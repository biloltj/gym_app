import Link from "next/link";
import { Search, Plus, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getMemberPaymentStatus } from "@/lib/payment-status";
import StatusBadge from "@/components/StatusBadge";
import Avatar from "@/components/Avatar";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/dictionaries";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const locale = await getLocale();

  const members = await prisma.member.findMany({
    where: q ? { fullName: { contains: q } } : undefined,
    include: { payments: { select: { forMonth: true } } },
    orderBy: { fullName: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">{t(locale, "pageTitleMembers", { count: members.length })}</h1>
        <Link
          href="/admin/members/new"
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 transition shadow-lg shadow-indigo-950/30"
        >
          <Plus className="h-4 w-4" />
          {t(locale, "addMember")}
        </Link>
      </div>

      <form className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder={t(locale, "searchPlaceholder")}
          className="w-full rounded-lg bg-neutral-900 border border-neutral-800 pl-9 pr-20 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 text-xs text-neutral-200 transition"
        >
          {t(locale, "searchBtn")}
        </button>
      </form>

      {members.length === 0 ? (
        <p className="text-sm text-neutral-500">{t(locale, "noMembersFound")}</p>
      ) : (
        <div className="space-y-2">
          {members.map((member) => {
            const { status } = getMemberPaymentStatus(
              member.joinDate,
              member.payments.map((p) => p.forMonth)
            );
            return (
              <Link
                key={member.id}
                href={`/admin/members/${member.id}`}
                className="group flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3 hover:border-neutral-700 hover:bg-neutral-900 transition"
              >
                <Avatar name={member.fullName} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{member.fullName}</div>
                  <div className="text-xs text-neutral-500">
                    {member.phone}
                    {member.status === "inactive" ? ` · ${t(locale, "inactiveTag")}` : ""}
                  </div>
                </div>
                <StatusBadge status={status} locale={locale} />
                <ChevronRight className="h-4 w-4 text-neutral-600 group-hover:text-neutral-400 transition hidden sm:block" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
