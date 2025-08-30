import React from 'react'

function SortAndFilter({
  sort,
  setSort,
  limit,
  setLimit,
}: {
  sort: string;
  setSort: (s: string) => void;
  limit: number;
  setLimit: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <select
        aria-label="Sort recipes"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="rounded-md border  py-2 text-black"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="most_liked">Most liked</option>
        <option value="most_commented">Most commented</option>
      </select>

      <select
        aria-label="Recipes per page"
        value={String(limit)}
        onChange={(e) => setLimit(Number(e.target.value))}
        className="rounded-md border  py-2 text-black"
      >
        <option value={6}>6 / page</option>
        <option value={10}>10 / page</option>
        <option value={20}>20 / page</option>
      </select>
    </div>
  );
}

export default SortAndFilter
