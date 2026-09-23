import { Dumbbell } from "lucide-react";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/dictionaries";
import LoginForm from "@/components/LoginForm";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default async function LoginPage() {
  const locale = await getLocale();

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-950/50">
            <Dumbbell className="h-7 w-7 text-white" strokeWidth={2.25} />
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-sm shadow-xl shadow-black/20 p-6 sm:p-7">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h1 className="text-xl font-semibold">{t(locale, "appName")}</h1>
            <LanguageSwitcher current={locale} />
          </div>
          <p className="text-neutral-400 text-sm mb-6">{t(locale, "loginSubtitle")}</p>
          <LoginForm locale={locale} />
        </div>
      </div>
    </main>
  );
}
