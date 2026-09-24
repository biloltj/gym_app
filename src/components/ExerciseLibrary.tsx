"use client";

import { useState } from "react";
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

export default function ExerciseLibrary({ locale }: { locale: Locale }) {
  const [active, setActive] = useState<Category | "all">("all");
  const categories = getCategories();
  const visible = active === "all" ? EXERCISES : EXERCISES.filter((e) => e.category === active);

  return (
    <div className="space-y-4">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visible.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} locale={locale} />
        ))}
      </div>
    </div>
  );
}
