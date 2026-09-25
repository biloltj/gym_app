"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BarChart3 } from "lucide-react";
import { t } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";

export default function NavLinks({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  const items = [
    { href: "/admin", label: t(locale, "navDashboard"), icon: LayoutDashboard, exact: true },
    { href: "/admin/members", label: t(locale, "navMembers"), icon: Users, exact: false },
    { href: "/admin/analytics", label: t(locale, "navAnalytics"), icon: BarChart3, exact: false },
  ];

  return (
    <>
      <nav className="mx-auto max-w-4xl px-4 hidden sm:flex gap-1 text-sm pb-2">
        {items.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition active:scale-[0.97] ${
                active
                  ? "bg-indigo-500/15 text-indigo-300"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-20 border-t border-neutral-800 bg-neutral-950/95 backdrop-blur-md">
        <div className="mx-auto max-w-4xl grid grid-cols-3">
          {items.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-xs transition active:scale-95 ${
                  active ? "text-indigo-300" : "text-neutral-500"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
