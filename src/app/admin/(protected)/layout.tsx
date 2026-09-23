import { redirect } from "next/navigation";
import { Dumbbell, LogOut } from "lucide-react";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/dictionaries";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import NavLinks from "@/components/NavLinks";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const locale = await getLocale();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700">
              <Dumbbell className="h-4 w-4 text-white" strokeWidth={2.25} />
            </div>
            <span className="font-semibold">{t(locale, "appName")}</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher current={locale} />
            <form action={logoutAction}>
              <button className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t(locale, "signOut")}</span>
              </button>
            </form>
          </div>
        </div>
        <NavLinks locale={locale} />
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
    </div>
  );
}
