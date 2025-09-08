import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "@/lib/db";
import Recipe from "@/models/Recipe";
import { createRecipeSchema } from "@/lib/utils/schemas";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbconnect();
    const { id } = await context.params; // ✅ await params

    const recipe = await Recipe.findById(id).populate("createdBy", "name");
    if (!recipe) {
      return NextResponse.json({ error: "Recipe Not Found" }, { status: 404 });
    }

    const serializedRecipe = {
      ...recipe.toObject(),
      _id: recipe._id.toString(),
      createdAt: recipe.createdAt.toISOString(),
      updatedAt: recipe.updatedAt.toISOString(),
      createdBy: recipe.createdBy
        ? {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            _id: (recipe.createdBy as any)._id.toString(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            name: (recipe.createdBy as any).name,
          }
        : null,
    };

    return NextResponse.json(serializedRecipe, { status: 200 });
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching recipe:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbconnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    if (recipe.createdBy?.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: Not the owner" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createRecipeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(id, parsed.data, {
      new: true,
    });

    if (!updatedRecipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(updatedRecipe, { status: 200 });
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbconnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const recipe = await Recipe.findById(id).populate("createdBy", "_id name email");
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    if (recipe.createdBy?._id.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: Not the owner" }, { status: 403 });
    }

    await Recipe.findByIdAndDelete(id);

    return NextResponse.json({ message: "Recipe deleted successfully" }, { status: 200 });
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
