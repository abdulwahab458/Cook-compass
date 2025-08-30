// app/api/users/me/saved/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbconnect } from "@/lib/db";
import User from "@/models/User";

// export async function GET() {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     await dbconnect();

//     const userId = (session.user as any).id;
//     const user = await User.findById(userId).populate("savedRecipes");

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json(
//       {
//         savedRecipes: user.savedRecipes, // populated recipe objects
//       },
//       { status: 200 }
//     );
//   } catch (err: any) {
//     console.error("Error fetching saved recipes:", err);
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbconnect();

    const userId = (session.user as any).id;
    const user = await User.findById(userId).populate({
      path: "savedRecipes",
      populate: { path: "createdBy", select: "name" },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        savedRecipes: user.savedRecipes,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error fetching saved recipes:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}