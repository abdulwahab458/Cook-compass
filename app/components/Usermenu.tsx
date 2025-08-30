// File: components/UserMenu.tsx
"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Icon button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full p-2 hover:bg-pink-200 transition"
      >
        <User className="h-6 w-6 text-pink-700" />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-44 rounded-xl border border-pink-200 bg-white/95 shadow-xl z-30 overflow-hidden"
          >
            <Link
              href="/create-recipe"
              className="block px-4 py-2 text-sm text-gray-800 hover:bg-gradient-to-r hover:from-pink-100 hover:to-pink-200 transition"
              onClick={() => setOpen(false)}
            >
              ➕ Create Recipe
            </Link>
            <Link
              href="/recipes/saved"
              className="block px-4 py-2 text-sm text-gray-800 hover:bg-gradient-to-r hover:from-pink-100 hover:to-pink-200 transition"
              onClick={() => setOpen(false)}
            >
              💖 Saved
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gradient-to-r hover:from-pink-100 hover:to-pink-200 transition"
            >
              🚪 Log Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
