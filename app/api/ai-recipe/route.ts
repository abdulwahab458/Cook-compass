import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { query } = await req.json();
        if (!query || typeof query !== "string") {
            return NextResponse.json({ error: "query is required" }, { status: 400 });
        }

        // ask gemini
        const res = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
            process.env.GEMINI_API_KEY,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Generate a detailed recipe for ${query}. Make it very detailed.

Requirements:
1. Make it extremely detailed, covering every possible step and tip.
2. Include a long descriptive paragraph for the description (at least 3-5 sentences).
3. Ingredients should be exhaustive, including quantities, optional substitutions, and notes where applicable.
4. Steps should be detailed, step-by-step, including prep, cooking, and serving tips. Include extra tips for variations, timing, and presentation.
5. Return ONLY valid UTF-8 plain text JSON (no markdown, no emojis, no special characters, no code blocks, no explanations).
6. Use these keys in the JSON:
   - title (string)
   - description (string)
   - ingredients (array of strings)
   - steps (array of strings)
7. Make the content as long and thorough as possible while staying valid JSON.
8. Do not give content other than food recipes.`
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await res.json()

        let aitext = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        aitext = aitext.replace(/```json|```/g, "").trim();

        let parsed;
        try {
            parsed = JSON.parse(aitext);
        } catch (error: any) {
            return NextResponse.json({ error: "Failed to Parse AI text", raw: aitext }, { status: 500 });
        }

        // fetch the image from unsplash
        const unsplashRes = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
                query
            )}&per_page=1&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
        );
        const unsplashData = await unsplashRes.json();
        const imageUrl = unsplashData?.results?.[0]?.urls?.regular || null;

        return NextResponse.json(
            {
                recipe: {
                    ...parsed,
                    image: imageUrl,
                    source: "ai+unsplash"
                }
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
