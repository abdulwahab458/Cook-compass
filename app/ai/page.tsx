"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AIRecipePage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  async function handleGenerate() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setResult(data.recipe);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch AI recipe");
    }

    setLoading(false);
  }
  const handlebtn = () => {
    router.push('/recipes');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 py-12 px-4 sm:px-10 lg:px-20">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md border border-pink-200 rounded-2xl shadow-xl p-8">
      <button
          onClick={handlebtn}
          className="px-6 py-2 flex gap-3 bg-pink-600 mb-6 text-white rounded-lg hover:bg-pink-700 transition"
        >
          <ArrowLeft />
          Go Back
        </button>
        <h1 className="text-4xl font-extrabold text-pink-800 mb-4 text-center">
          🍰 Ask AI for a Recipe
        </h1>
        <p className="mb-8 text-gray-700 text-center">
          Enter a dish or ingredient and let AI generate a full recipe for you!
        </p>

        {/* Input & Button */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Chocolate Cake"
            className="flex-1 border border-pink-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-black shadow-sm"
          />
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-6 py-2 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition shadow-md w-full sm:w-auto justify-center"
            disabled={loading || !query.trim()}
          >
            {loading ? "Generating..." : "Generate Recipe"}
          </button>
        </div>

        {/* Recipe Display */}
        {result && (
          <div className="bg-white border border-pink-200 rounded-xl shadow-md p-6 mb-10">
            {/* Image */}
            {result.image && (
              <div className="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden mb-6">
                <Image
                  src={result.image}
                  alt={result.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Title & Description */}
            <h2 className="text-3xl font-bold text-pink-700 mb-2">{result.title}</h2>
            <p className="text-gray-700 mb-4">{result.description}</p>

            {/* Ingredients */}
            {result.ingredients?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-pink-600">Ingredients</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {result.ingredients.map((ing: string, idx: number) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Steps */}
            {result.steps?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-pink-600">Steps</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  {result.steps.map((step: string, idx: number) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Source */}
            {result.source && (
              <p className="text-sm text-gray-500 italic">Source: {result.source}</p>
            )}
          </div>
        )}

        {/* Create This Recipe Button */}
        {result && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                if (result) {
                  sessionStorage.setItem("aiRecipe", JSON.stringify(result));
                  window.location.href = "/create-recipe";
                }
              }}
              className="px-8 py-3 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition shadow-md"
            >
              ➕ Create This Recipe
            </button>
          </div>
        )}
      </div>
    </div>
  );
}