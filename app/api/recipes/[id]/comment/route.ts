import { NextResponse } from "next/server";
import Recipe from "@/models/Recipe";
import { dbconnect } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(
  req: Request,
  context: { params: { id: string } }
) {
  const { params } = context; // ✅ do NOT await
  const recipeId = params.id; // ✅ just access it directly

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbconnect();

    const body = await req.json();
    const { comment } = body;

    if (!comment) {
      return NextResponse.json({ error: "Comments Needed" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return NextResponse.json({ error: "Invalid recipe id" }, { status: 400 });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const newComment = {
      userId: session.user.id,
      comment,
      createdAt: new Date(),
    };

    recipe.comments.push(newComment);
    await recipe.save();

    return NextResponse.json(newComment, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
