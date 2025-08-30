"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import imageCompression from "browser-image-compression"; 
import utf8 from "utf8";
import { ArrowLeft } from "lucide-react";


const createRecipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  ingredients: z
    .array(z.string().min(1, "Ingredient cannot be empty"))
    .min(1, "At least one ingredient is required"),
  steps: z.array(z.string().min(1, "Step cannot be empty")).min(1, "At least one step is required"),
  tags: z.array(z.string()).optional(),
  image: z.string().min(1, "Image is required"),
  createdBy: z.string().optional(),
});

export default function CreateRecipeForm() {
  const { data: session } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof z.infer<typeof createRecipeSchema>, string>>>({});

  const predefinedTags = ["Vegan", "Dessert", "Breakfast", "Quick", "Italian", "Indian"];

  // ------------------- Load AI Recipe -------------------
  useEffect(() => {
    const aiRecipe = sessionStorage.getItem("aiRecipe");
    if (aiRecipe) {
      const recipe = JSON.parse(aiRecipe);
      setTitle(recipe.title || "");
      setDescription(recipe.description || "");
      setIngredients(recipe.ingredients?.length ? recipe.ingredients : [""]);
      setSteps(recipe.steps?.length ? recipe.steps : [""]);
      setTags(recipe.tags || []);


    }
  }, []);

  // ------------------- Handle File Input -------------------
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    // Compress & resize image
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 2,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
    });

    setImageFile(compressedFile);
  };

  // ------------------- Submit Recipe -------------------


// ------------------- Submit Recipe -------------------
const handleSubmit = async () => {
  setErrors({});
  try {
    let imageUrl = "";

    // Handle image upload
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Image upload failed");
      imageUrl = uploadData.url;
    }

    // Sanitize all text fields using utf8.encode
    const sanitizedRecipeData = {
      title: utf8.encode(title),
      description: utf8.encode(description),
      ingredients: ingredients.map((i) => utf8.encode(i)),
      steps: steps.map((s) => utf8.encode(s)),
      tags: tags.map((t) => utf8.encode(t)),
      image: imageUrl || "",
      createdBy: session?.user?.id || null,
    };

    const parsed = createRecipeSchema.safeParse(sanitizedRecipeData);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const flatErrors: typeof errors = {};
      for (const key in fieldErrors) {
        if (fieldErrors[key as keyof typeof fieldErrors]?.[0]) {
          flatErrors[key as keyof typeof fieldErrors] =
            fieldErrors[key as keyof typeof fieldErrors]![0];
        }
      }
      setErrors(flatErrors);
      return;
    }

    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    const data = await res.json();
    if (!res.ok) {
      const message = typeof data.error === "string" ? data.error : JSON.stringify(data.error);
      throw new Error(message || "Recipe creation failed");
    }

    sessionStorage.removeItem("aiRecipe");
    sessionStorage.removeItem("aiImageUrl");

    router.push(`/recipes/${data._id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    alert(error.message);
    console.error(error);
  }
};

const handlebtn = () => {
    router.push('/recipes');
  };


  // ------------------- Render -------------------
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md text-gray-800">
      <button
          onClick={handlebtn}
          className="px-6 py-2 flex gap-3 bg-pink-600 mb-6 text-white rounded-lg hover:bg-pink-700 transition"
        >
          <ArrowLeft />
          Go Back
        </button>
      <h1 className="text-2xl font-bold mb-4 text-pink-600">Create New Recipe</h1>

      {/* Title */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Recipe Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-pink-300 px-3 py-2 focus:ring-2 focus:ring-pink-400 focus:outline-none"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div className="mb-4">
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-pink-300 px-3 py-2 focus:ring-2 focus:ring-pink-400 focus:outline-none"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Ingredients */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2 text-pink-600">Ingredients</h2>
        {ingredients.map((ing, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder={`Ingredient ${i + 1}`}
              value={ing}
              onChange={(e) => {
                const newIngredients = [...ingredients];
                newIngredients[i] = e.target.value;
                setIngredients(newIngredients);
              }}
              className="flex-1 rounded-lg border border-pink-300 px-3 py-2 focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))}
              className="px-3 py-2 bg-pink-500 text-white rounded-lg"
            >
              –
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setIngredients([...ingredients, ""])}
          className="px-4 py-2 bg-pink-400 text-white rounded-lg"
        >
          + Add Ingredient
        </button>
      </div>

      {/* Steps */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2 text-pink-600">Steps</h2>
        {steps.map((step, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder={`Step ${i + 1}`}
              value={step}
              onChange={(e) => {
                const newSteps = [...steps];
                newSteps[i] = e.target.value;
                setSteps(newSteps);
              }}
              className="flex-1 rounded-lg border border-pink-300 px-3 py-2 focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setSteps(steps.filter((_, idx) => idx !== i))}
              className="px-3 py-2 bg-pink-500 text-white rounded-lg"
            >
              –
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setSteps([...steps, ""])}
          className="px-4 py-2 bg-pink-400 text-white rounded-lg"
        >
          + Add Step
        </button>
      </div>

      {/* Tags */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2 text-pink-600">Tags</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {predefinedTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() =>
                setTags(tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag])
              }
              className={`px-3 py-1 rounded-full border ${
                tags.includes(tag)
                  ? "bg-pink-500 text-white border-pink-500"
                  : "bg-pink-100 border-pink-300 text-pink-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add custom tag"
          value={customTag}
          onChange={(e) => setCustomTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && customTag.trim()) {
              setTags([...tags, customTag.trim()]);
              setCustomTag("");
              e.preventDefault();
            }
          }}
          className="rounded-lg border border-pink-300 px-3 py-2 w-full focus:ring-2 focus:ring-pink-400 focus:outline-none"
        />
      </div>

      {/* Image */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2 text-pink-600">Image</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} className="text-gray-700" />
        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition"
      >
        Create Recipe
      </button>
    </div>
  );
}
