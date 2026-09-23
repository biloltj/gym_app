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
    <nav className="mx-auto max-w-4xl px-4 flex gap-1 text-sm pb-2">
      {items.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
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
  );
}
