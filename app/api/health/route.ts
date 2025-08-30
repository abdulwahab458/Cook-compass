import { NextResponse } from "next/server";
import { dbconnect } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
    try {
        let db = "not configured" as "connected" | "not configured";
        if (process.env.MONGO_URI) {
            await dbconnect();
            db = "connected";
        }
        return NextResponse.json(
            {
                status: "ok",
                db,
                timestamp: new Date().toISOString(),
            },
            { status: 200 }
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json(
            {
                status: "down",
                error: error?.message ?? "Unknown error",
            },
            { status: 500 }
        );
    }
}