import { NextResponse } from "next/server";
import { dbconnect } from "@/lib/db";
import Recipe from "@/models/Recipe";
import { createRecipeSchema } from "@/lib/utils/schemas";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Params {
    params: { id: string }
}

export async function GET(req: Request, context: Params) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbconnect();
        const { id } = context.params;

        const recipe = await Recipe.findById(id).populate("createdBy", "name");
        if (!recipe) {
            return NextResponse.json({ error: "Recipe Not Found" }, { status: 404 });
        }

        // Serialize the recipe for safe JSON response
        const serializedRecipe = {
            ...recipe.toObject(),
            _id: recipe._id.toString(),
            createdAt: recipe.createdAt.toISOString(),
            updatedAt: recipe.updatedAt.toISOString(),
            createdBy: recipe.createdBy
                ? {// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
// export async function GET(req: Request, context: { params: { id: string } }) {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     console.log("SESSION:", session);
//     try {
//         await dbconnect();
//         const { id } = await context.params
//         const recipe = await Recipe.findById(id)
//             .populate("createdBy", "name");
//         console.log(recipe)


//         if (!recipe) {
//             return NextResponse.json({ error: "Recipe Not Found" }, { status: 404 })
//         }

//         return NextResponse.json(recipe, { status: 200 });
//     } catch (error: any) {
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }



export async function PUT(req: Request, { params }: Params) {

    try {
        await dbconnect();

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const recipe = await Recipe.findById(params.id);
        if (!recipe) {
            return NextResponse.json({ error: "Recipe not found " }, { status: 404 });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (recipe.createdBy?.toString() !== (session.user as any).id) {
            return NextResponse.json({ error: "Forbidden: Not the owner" }, { status: 403 });
        }


        const body = await req.json();

        // validate using same schema
        const parsed = createRecipeSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(
            params.id,
            parsed.data,
            { new: true }
        );

        if (!updatedRecipe) {
            return NextResponse.json(
                { error: "Recipe not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(updatedRecipe, { status: 200 });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}


export async function DELETE(req: Request, { params }: Params) {
    try {
        await dbconnect();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const recipe = await Recipe.findById(params.id)
            .populate("createdBy", "_id name email"); // ✅ ensure _id + name are returned

        console.log("SESSION USER ID:", session.user.id);
        console.log("RECIPE CREATED BY:", recipe.createdBy);

        if (!recipe) {
            return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (recipe.createdBy?._id.toString() !== (session.user as any).id) {
            return NextResponse.json({ error: "Forbidden: Not the owner" }, { status: 403 });
        }
        await Recipe.findByIdAndDelete(params.id);

        return NextResponse.json(
            { message: "Recipe deleted Successfully " },
            { status: 200 }
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}