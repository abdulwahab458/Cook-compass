// File: app/page.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import UserMenu from "../components/Usermenu";
import SearchBar from "../components/SearchBar";
import SortAndFilter from "../components/SortAndFilter";
import TagsBar from "../components/TagsBar";
import RecipeCard from "../components/RecipeCard";
import Pagination from "../components/Pagination";
import { fetchRecipes } from "@/lib/actions/fetchrecipe";
import { Recipe } from "@/lib/types/types";
import { useRouter } from "next/navigation";



// -------------------- Page --------------------
export default function Page() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [activeTag, setActiveTag] = useState("");

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const tags = ["Dessert", "Vegan", "Breakfast", "Quick", "Italian", "Indian", "Chinese", "ice cream"];

  // debounce search input
  useEffect(() => {
    const id = setTimeout(
      () => setDebouncedSearch(search.trim()),
      450
    );
    return () => clearTimeout(id);
  }, [search]);

  // fetch data
  const pendingRequestRef = useRef<AbortController | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    if (pendingRequestRef.current) pendingRequestRef.current.abort();
    const controller = new AbortController();
    pendingRequestRef.current = controller;

    fetchRecipes({
      search: debouncedSearch,
      page,
      limit,
      sort,
      tag: activeTag,
    })
      .then((json) => {
        if (!isMounted) return;
        setRecipes(json.items ?? []);
        setTotalPages(json.pagecount ?? 1);
        setTotalCount(json.total ?? 0);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error(err);
        if (!isMounted) return;
        setError(err.message ?? "Failed to load recipes");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [debouncedSearch, page, limit, sort, activeTag]);

  // reset page when filters change
  useEffect(() => setPage(1), [debouncedSearch, limit, sort, activeTag]);

  const handleAI = () => {
    router.push('/ai');
  }

  return (
    <main className="min-h-screen bg-pink-50 py-10 text-black">
      <div className="mx-auto w-full max-w-7xl px-6">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <Image
              src="/logo.svg"
              alt="logo"
              height={100}
              width={100}
              
            />
            
            <p className=" uppercase font-extrabold text-amber-900">Cook  Compass</p>
            </div>
            
            



          {/* <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex-1 min-w-[150px] sm:min-w-[250px]">
            </div>

            
          </div> */}
          <SearchBar value={search} onChange={setSearch} />



          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={handleAI}
              className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
            >
              Ask
              <Image
                src="/ai.svg"
                height={24}
                width={24}
                alt="AI icon"
              />
            </button>
            <SortAndFilter
              sort={sort}
              setSort={setSort}
              limit={limit}
              setLimit={setLimit}
            />
            <UserMenu />
          </div>
        </header>

        <section className="mb-6">
          <TagsBar
            tags={tags}
            activeTag={activeTag}
            onSelect={setActiveTag}
          />
        </section>

        <section>
          {loading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({
                length: limit > 0 ? Math.min(limit, 6) : 6,
              }).map((_, i) => (
                <div
                  key={i}
                  className="h-56 animate-pulse rounded-2xl bg-white p-4"
                />
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-4 text-red-700">
              Error: {error}
            </div>
          )}

          {!loading && !error && recipes.length === 0 && (
            <div className="rounded-md bg-yellow-50 p-6 text-yellow-800">
              No recipes found.
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((r) => (
              <RecipeCard
                key={r.id || r._id}
                recipe={{ ...r, id: r.id || r._id || "" }}
              />
            ))}
          </div>
        </section>

        <footer className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {recipes.length} of {totalCount} recipes
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        </footer>
      </div>
    </main>
  );
}
