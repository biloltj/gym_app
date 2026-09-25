"use client";

import { useEffect, useState } from "react";
import { Search, Star } from "lucide-react";
import ExerciseCard from "@/components/ExerciseCard";
import { EXERCISES, getCategories, type Category } from "@/lib/exercises";
import { t, type DictionaryKey } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";

const CATEGORY_KEY: Record<Category, DictionaryKey> = {
  legs: "categoryLegs",
  chest: "categoryChest",
  back: "categoryBack",
  arms: "categoryArms",
  core: "categoryCore",
  cardio: "categoryCardio",
};

const FAVORITES_KEY = "gym-favorite-exercises";

function loadFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {
    // ignore — start with no favorites
  }
  return new Set();
}

function saveFavorites(favorites: Set<string>) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
  } catch {
    // ignore — non-persistent is fine
  }
}

export default function ExerciseLibrary({ locale }: { locale: Locale }) {
  const [active, setActive] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveFavorites(next);
      return next;
    });
  }

  const categories = getCategories();
  const normalizedQuery = query.trim().toLowerCase();

  const visible = EXERCISES.filter((e) => {
    if (active !== "all" && e.category !== active) return false;
    if (favoritesOnly && !favorites.has(e.id)) return false;
    if (normalizedQuery && !e.name[locale].toLowerCase().includes(normalizedQuery)) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(locale, "searchExercisesPlaceholder")}
            className="w-full rounded-lg bg-neutral-900 border border-neutral-800 pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
        <button
          onClick={() => setFavoritesOnly((v) => !v)}
          className={`shrink-0 flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition ${
            favoritesOnly
              ? "border-amber-900/40 text-amber-400 bg-amber-950/20"
              : "border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
          }`}
        >
          <Star className={`h-4 w-4 ${favoritesOnly ? "fill-amber-400" : ""}`} />
          <span className="hidden sm:inline">{t(locale, "favoritesOnlyLabel")}</span>
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          onClick={() => setActive("all")}
          className={`shrink-0 rounded-lg px-3 py-1.5 text-sm transition ${
            active === "all"
              ? "bg-indigo-500/15 text-indigo-300"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          {t(locale, "categoryAll")}
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-sm transition ${
              active === c
                ? "bg-indigo-500/15 text-indigo-300"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {t(locale, CATEGORY_KEY[c])}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-neutral-500">{t(locale, "noExercisesFound")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {visible.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              locale={locale}
              favorite={favorites.has(exercise.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
