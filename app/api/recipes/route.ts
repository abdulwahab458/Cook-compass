import { authOptions } from "@/lib/auth";
import { dbconnect } from "@/lib/db";
import { createRecipeSchema } from "@/lib/utils/schemas";
import Recipe from "@/models/Recipe";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbconnect();
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const skip = (page - 1) * limit;

    const search = searchParams.get("q") || "";
    const tag = searchParams.get("tag") || ""; // <-- get tag
    const sortOption = searchParams.get("sort") || "newest";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (tag) {
      // match recipes where tags array contains this string, case-insensitive
      query.tags = { $in: [new RegExp(`^${tag}$`, "i")] };
    }

    // 🔥 define sort rules
    let sort: Record<string, 1 | -1> = { createdAt: -1 }; // default newest
    if (sortOption === "oldest") sort = { createdAt: 1 };
    if (sortOption === "most_liked") sort = { likesCount: -1 };
    if (sortOption === "most_commented") sort = { commentsCount: -1 };

    const total = await Recipe.countDocuments(query);
    const recipes = await Recipe.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "_id name");


    return NextResponse.json(
      {
        items: recipes,
        total,
        page,
        pagecount: Math.ceil(total / limit),
      },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log("SESSION:", session);
  try {
    await dbconnect();
    const body = await req.json();
    const parsed = createRecipeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // const recipe = await Recipe.create({
    //   ...parsed.data,
    //   createdBy: session.user.id, // this is the user's ObjectId
    // });
    const recipe = await Recipe.create({
      ...parsed.data,// eslint-disable-next-line @typescript-eslint/no-explicit-any
      createdBy: new mongoose.Types.ObjectId((session.user as any).id)
    });


    return NextResponse.json(recipe, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
