"use client";

import { useRouter } from "next/navigation";
import { LOCALES, LOCALE_LABELS, LOCALE_COOKIE, type Locale } from "@/lib/i18n/locales";

export default function LanguageSwitcher({ current }: { current: Locale }) {
  const router = useRouter();

  function switchTo(locale: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <div className="flex gap-1 text-xs">
      {LOCALES.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchTo(locale)}
          className={`px-2 py-1 rounded-md border transition ${
            locale === current
              ? "border-indigo-500 text-white bg-indigo-500/10"
              : "border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
          }`}
        >
          {LOCALE_LABELS[locale]}
        </button>
      ))}
    </div>
  );
}
