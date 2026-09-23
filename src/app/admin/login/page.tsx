import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/dictionaries";
import LoginForm from "@/components/LoginForm";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default async function LoginPage() {
  const locale = await getLocale();

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-semibold">{t(locale, "appName")}</h1>
          <LanguageSwitcher current={locale} />
        </div>
        <p className="text-neutral-400 text-sm mb-6">{t(locale, "loginSubtitle")}</p>
        <LoginForm locale={locale} />
      </div>
    </main>
  );
}
