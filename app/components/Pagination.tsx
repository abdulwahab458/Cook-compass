import React from 'react'

function Pagination({
  page,
  totalPages,
  setPage,
}: {
  page: number;
  totalPages: number;
  setPage: (p: number) => void;
}) {
  const pagesToShow = 5;
  const start = Math.max(1, page - Math.floor(pagesToShow / 2));
  const end = Math.min(totalPages, start + pagesToShow - 1);
  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="flex items-center gap-2">
      <button
        className="rounded-md border px-3 py-1 text-black"
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`rounded-md px-3 py-1 ${
            p === page
              ? "bg-pink-600 text-white"
              : "border text-black"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        className="rounded-md border px-3 py-1 text-black"
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination
