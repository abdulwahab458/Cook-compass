import { NextRequest, NextResponse } from "next/server";
import Recipe from "@/models/Recipe";
import { dbconnect } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: recipeId } = await context.params; // ✅ await params

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    // ✅ handle missing user safely
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
      userId: session.user.id, // ✅ safe now because we checked above
      comment,
      createdAt: new Date(),
    };

    recipe.comments.push(newComment);
    await recipe.save();

    return NextResponse.json(newComment, { status: 200 });
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
