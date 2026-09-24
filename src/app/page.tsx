import Link from "next/link";
import { Dumbbell, LogIn } from "lucide-react";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/dictionaries";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ExerciseLibrary from "@/components/ExerciseLibrary";
import WorkoutTimer from "@/components/WorkoutTimer";

export default async function GuestHomePage() {
  const locale = await getLocale();

  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-800">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700">
              <Dumbbell className="h-4 w-4 text-white" strokeWidth={2.25} />
            </div>
            <span className="font-semibold">{t(locale, "appName")}</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher current={locale} />
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">{t(locale, "adminLoginLink")}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-10">
        <section className="text-center max-w-lg mx-auto">
          <h1 className="text-3xl font-semibold tracking-tight">{t(locale, "guestHeroTitle")}</h1>
          <p className="text-neutral-400 mt-2">{t(locale, "guestHeroSubtitle")}</p>
        </section>

        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
          <h2 className="text-sm font-medium text-neutral-300 mb-4">{t(locale, "timerTitle")}</h2>
          <WorkoutTimer locale={locale} />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">{t(locale, "guestExercisesTitle")}</h2>
          <ExerciseLibrary locale={locale} />
        </section>
      </main>
    </div>
  );
}
