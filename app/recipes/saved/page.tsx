"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getOptimizedImage } from "@/lib/utils/cloudnary";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Recipe = {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  createdAt: string;
  createdBy?: { name?: string };
};

const SavedRecipesPage = () => {
  const { data: session } = useSession();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    headers: {
      "Content-Type": "application/json",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(session?.user && (session.user as any).accessToken
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? { Authorization: `Bearer ${(session.user as any).accessToken}` }
        : {}),
    },
  });

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await api.get("/api/users/me/saved");
        setRecipes(res.data.savedRecipes);
      } catch (err) {
        console.error("Failed to load saved recipes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  if (loading) return <p className="p-6 text-center text-pink-700">Loading your saved recipes...</p>;

  const handlebtn = () => {
    router.push('/recipes');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={handlebtn}
          className="px-6 py-2 flex gap-3 bg-pink-600 mb-6 text-white rounded-lg hover:bg-pink-700 transition"
        >
          <ArrowLeft />
          Go Back
        </button>
        <h1 className="text-4xl font-extrabold text-pink-800 mb-8 text-center">
          💖 Saved Recipes
        </h1>

        {recipes.length === 0 ? (
          <p className="text-gray-600 text-center italic">No saved recipes yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <Link key={recipe._id} href={`/recipes/${recipe._id}`}>
                <div className="bg-white/90 backdrop-blur-md border border-pink-200 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition p-4 cursor-pointer flex flex-col">
                  {recipe.image && (
                    <img  
                      src={getOptimizedImage(recipe.image, 400, 250)}
                      alt={recipe.title}
                      className="w-full h-44 object-cover rounded-lg mb-4 shadow-sm"
                    />
                  )}
                  <h2 className="text-xl font-bold text-pink-800 line-clamp-1">
                    {recipe.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {recipe.description?.slice(0, 100) || "No description"}...
                  </p>
                  <p className="mt-3 text-xs text-gray-500">
                    By <span className="font-medium text-pink-700">{recipe.createdBy?.name || "Unknown"}</span> • {new Date(recipe.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRecipesPage;
