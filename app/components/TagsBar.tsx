import React from 'react'

function TagsBar({
    tags,
    activeTag,
    onSelect,
}: {
    tags: string[];
    activeTag: string;
    onSelect: (t: string) => void;
}) {
    return (
        <div className="flex flex-wrap gap-2">
            <button
                className={`px-3 py-1 rounded-full text-sm ${activeTag === ""
                        ? "bg-pink-600 text-white"
                        : "bg-gray-100 text-black"
                    }`}
                onClick={() => onSelect("")}
            >
                All
            </button>
            {tags.map((t) => (
                <button
                    key={t}
                    className={`px-3 py-1 rounded-full text-sm ${activeTag === t
                            ? "bg-pink-600 text-white"
                            : "bg-gray-100 text-black"
                        }`}
                    onClick={() => onSelect(t)}
                >
                    {t}
                </button>
            ))}
        </div>
    );
}

export default TagsBar
