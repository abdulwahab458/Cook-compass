import React from 'react'
import { motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import { Recipe } from '@/lib/types/types';


function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md text-black"
    >
      <Link
        href={`/recipes/${recipe.id || recipe._id}`}
        className="block"
      >
        <div className="relative h-44 w-full overflow-hidden rounded-xl bg-pink-100">
          {recipe.image ? (
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>

        <div className="mt-3">
          <h3 className="text-lg font-semibold leading-tight">
            {recipe.title}
          </h3>
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">
            {recipe.description ?? "No description"}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>❤️ {recipe.likes ?? 0}</span>
              <span>💬 {recipe.comments?.length ?? 0}</span>
            </div>

            <div className="flex gap-2">
              {(recipe.tags ?? []).slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-pink-100 px-2 py-0.5 text-xs text-black"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default RecipeCard
