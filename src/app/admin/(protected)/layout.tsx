import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/dictionaries";
import LanguageSwitcher from "@/components/LanguageSwitcher";

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
      <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between gap-3">
          <span className="font-semibold">{t(locale, "appName")}</span>
          <div className="flex items-center gap-3">
            <LanguageSwitcher current={locale} />
            <form action={logoutAction}>
              <button className="text-sm text-neutral-400 hover:text-white transition">
                {t(locale, "signOut")}
              </button>
            </form>
          </div>
        </div>
        <nav className="mx-auto max-w-4xl px-4 flex gap-4 text-sm pb-2">
          <Link href="/admin" className="text-neutral-300 hover:text-white transition">
            {t(locale, "navDashboard")}
          </Link>
          <Link href="/admin/members" className="text-neutral-300 hover:text-white transition">
            {t(locale, "navMembers")}
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
    </div>
  );
}
