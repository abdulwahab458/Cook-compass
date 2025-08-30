  // app/api/recipes/[id]/save/route.ts
  import { NextResponse } from "next/server";
  import { getServerSession } from "next-auth";
  import { authOptions } from "@/lib/auth";
  import { dbconnect } from "@/lib/db";
  import User from "@/models/User";

  export async function POST(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      await dbconnect();

      const recipeId = params.id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userId = (session.user as any).id;

      // Find user
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Toggle save/unsave
      const isSaved = user.savedRecipes.some(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (savedId: any) => savedId.toString() === recipeId
      );

      if (isSaved) {
        user.savedRecipes = user.savedRecipes.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (savedId: any) => savedId.toString() !== recipeId
        );
      } else {
        user.savedRecipes.push(recipeId);
      }

      await user.save();

      return NextResponse.json({
        message: isSaved
          ? "Recipe removed from saved"
          : "Recipe saved successfully",
        saved: !isSaved,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error saving recipe:", err);
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }
  }
