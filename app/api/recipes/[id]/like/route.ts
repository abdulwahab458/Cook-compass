import { dbconnect } from "@/lib/db";
import Recipe from "@/models/Recipe";
import { NextResponse } from "next/server";


interface Params {
    params: { id: string },
}

export async function POST(req: Request, { params }: Params) {
    try {
        await dbconnect();
        const body = await req.json().catch(() => ({}));
        const action = (body?.action as "like" | "unlike") || "like";

        const existing = await Recipe.findById(params.id).select('likes');
        if (!existing) {
            return NextResponse.json(
                { error: 'Recipe not found' }, { status: 404 }
            )
        }
        let updated;

        if (action === "like") {
            updated = await Recipe.findByIdAndUpdate(
                params.id,
                { $inc: { likes: 1 } },
                { new: true, select: "likes" }
            );
        } else {
            // Decrement only if likes > 0 to avoid negatives
            updated = await Recipe.findOneAndUpdate(
                { _id: params.id, likes: { $gt: 0 } },
                { $inc: { likes: -1 } },
                { new: true, select: "likes" }
            );
            // If likes was already 0, return 0 without change
            if (!updated) {
                return NextResponse.json({ likes: 0 }, { status: 200 });
            }
        }

        return NextResponse.json({ likes: updated!.likes }, { status: 200 });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        return NextResponse.json({error:error.message},{status:200})
    }
}