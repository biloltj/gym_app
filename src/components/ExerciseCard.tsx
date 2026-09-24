import {
  Footprints,
  Dumbbell,
  PersonStanding,
  Zap,
  Target,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";
import type { Category, Difficulty, Exercise } from "@/lib/exercises";
import { t, type DictionaryKey } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";

const CATEGORY_ICON: Record<Category, LucideIcon> = {
  legs: Footprints,
  chest: Dumbbell,
  back: PersonStanding,
  arms: Zap,
  core: Target,
  cardio: HeartPulse,
};

const CATEGORY_ACCENT: Record<Category, string> = {
  legs: "text-indigo-400 bg-indigo-500/10",
  chest: "text-sky-400 bg-sky-500/10",
  back: "text-violet-400 bg-violet-500/10",
  arms: "text-amber-400 bg-amber-500/10",
  core: "text-emerald-400 bg-emerald-500/10",
  cardio: "text-rose-400 bg-rose-500/10",
};

const DIFFICULTY_KEY: Record<Difficulty, DictionaryKey> = {
  beginner: "difficultyBeginner",
  intermediate: "difficultyIntermediate",
  advanced: "difficultyAdvanced",
};

const DIFFICULTY_STYLE: Record<Difficulty, string> = {
  beginner: "text-emerald-400 border-emerald-900/40",
  intermediate: "text-amber-400 border-amber-900/40",
  advanced: "text-red-400 border-red-900/40",
};

export default function ExerciseCard({ exercise, locale }: { exercise: Exercise; locale: Locale }) {
  const Icon = CATEGORY_ICON[exercise.category];

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 flex gap-3 hover:border-neutral-700 transition">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${CATEGORY_ACCENT[exercise.category]}`}
      >
        <Icon className={`h-6 w-6 anim-${exercise.animation}`} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-medium">{exercise.name[locale]}</h3>
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${DIFFICULTY_STYLE[exercise.difficulty]}`}
          >
            {t(locale, DIFFICULTY_KEY[exercise.difficulty])}
          </span>
        </div>
        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
          {exercise.instructions[locale]}
        </p>
      </div>
    </div>
  );
}
