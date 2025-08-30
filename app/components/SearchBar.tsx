import React from 'react'

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="w-full max-w-xl">
      <input
        aria-label="Search recipes"
        placeholder="Search for recipes...."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-pink-300 bg-white px-4 py-2 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 text-black"
      />
    </div>
  );
}

export default SearchBar
