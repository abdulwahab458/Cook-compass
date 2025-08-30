"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Trash, ArrowLeft } from 'lucide-react';
import { getOptimizedImage } from "@/lib/utils/cloudnary";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

type Comment = {
  _id: string;
  comment: string;
  createdAt: string;
  userId?: { name?: string };
};

type Recipe = {
  _id: string;
  title: string;
  description?: string;
  ingredients: string[];
  steps: string[];
  image?: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
  createdBy?: { name?: string; _id?: string };
};

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    headers: {
      "Content-Type": "application/json",
      ...(session?.user && (session.user as any).accessToken
        ? { Authorization: `Bearer ${(session.user as any).accessToken}` }
        : {}),
    },
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await api.get(`/api/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error("Failed to load recipe", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) return <p className="p-6 text-center text-pink-700">Loading...</p>;
  if (!recipe) return <p className="p-6 text-center text-pink-700">Recipe not found</p>;

  const handleLike = async () => {
    try {
      const res = await api.post(`/api/recipes/${id}/like`);
      setRecipe((prev) => prev ? { ...prev, likes: res.data.likes } : prev);
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await api.post(`/api/recipes/${id}/save`);
      if (res.data.saved) {
        toast.success("Recipe saved!");
      } else {
        toast.info("Recipe removed from saved recipes");
      }
    } catch (err) {
      console.error("Save failed", err);
      toast.error("Failed to save recipe");
    } finally {
      setSaving(false);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    try {
      const res = await api.post(`/api/recipes/${id}/comment`, { comment });
      setRecipe((prev) => prev ? { ...prev, comments: [...prev.comments, res.data] } : prev);
      setComment("");
    } catch (err) {
      console.error("Comment failed", err);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/recipes/${id}`);
      toast.success("Recipe deleted successfully!");
      window.location.href = "/recipes";
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete recipe.");
    }
  };

  const handlebtn = () => {
    router.push('/recipes');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 py-10 px-4">
      <div className="max-w-3xl mx-auto p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-pink-200">
        <button
          onClick={handlebtn}
          className="px-6 py-2 flex gap-3 bg-pink-600 mb-6 text-white rounded-lg hover:bg-pink-700 transition"
        >
          <ArrowLeft />
          Go Back
        </button>

        {recipe.image && (
          <img
            src={getOptimizedImage(recipe.image, 800, 400)}
            alt={recipe.title}
            className="w-full h-64 object-cover rounded-xl shadow-md mb-6"
          />
        )}

        <h1 className="text-4xl font-extrabold text-pink-800">{recipe.title}</h1>
        <p className="mt-3 text-gray-700 text-lg">{recipe.description}</p>
        <p className="mt-2 text-sm text-gray-500">
          By <span className="font-medium text-pink-700">{recipe.createdBy?.name || "Unknown"}</span> • {new Date(recipe.createdAt).toLocaleDateString()}
        </p>

        <div className="mt-8 bg-pink-50 border border-pink-200 rounded-xl p-5">
          <h2 className="text-2xl font-semibold text-pink-800">Ingredients</h2>
          <ul className="list-disc list-inside mt-2 text-gray-800 space-y-1">
            {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
          </ul>
        </div>

        <div className="mt-6 bg-pink-50 border border-pink-200 rounded-xl p-5">
          <h2 className="text-2xl font-semibold text-pink-800">Steps</h2>
          <ol className="list-decimal list-inside mt-2 text-gray-800 space-y-2">
            {recipe.steps.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </div>

        <div className="mt-8 flex items-center gap-4 flex-wrap">
          <motion.button
            onClick={handleLike}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            animate={{ rotate: recipe.likes > 0 ? [0, 8, -8, 0] : 0 }}
            className="px-5 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 shadow-md flex items-center gap-2"
          >
            ❤️ Like ({recipe.likes})
          </motion.button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-white border border-pink-300 text-pink-700 hover:bg-pink-100 shadow-sm disabled:opacity-50"
          >
            📌 {saving ? "Saving..." : "Save"}
          </button>

          {recipe.createdBy && (session?.user as any)?.id === recipe.createdBy._id?.toString() && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md"
            >
              <Trash className="w-4" /> Delete
            </button>
          )}
        </div>

        <div className="mt-10 bg-white border border-pink-200 rounded-xl p-5 shadow-sm">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full rounded-lg border border-pink-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            onClick={handleComment}
            className="mt-3 px-5 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 shadow-md"
          >
            Comment
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-pink-800 mb-3">Comments</h2>
          {recipe.comments.length === 0 ? (
            <p className="text-gray-500 italic">No comments yet</p>
          ) : (
            <ul className="space-y-3">
              {recipe.comments.map((c, idx) => (
                <li key={idx} className="border border-pink-200 bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-gray-800">{c.comment}</p>
                  <span className="text-xs text-gray-500 block mt-1">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
