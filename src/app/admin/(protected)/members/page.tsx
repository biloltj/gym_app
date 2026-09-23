import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getMemberPaymentStatus } from "@/lib/payment-status";
import StatusBadge from "@/components/StatusBadge";
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
          className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 transition"
        >
          {t(locale, "addMember")}
        </Link>
      </div>

      <form className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder={t(locale, "searchPlaceholder")}
          className="flex-1 rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="rounded-lg border border-neutral-800 px-4 py-2 text-sm text-neutral-300 hover:text-white hover:border-neutral-700 transition"
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
                className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 hover:border-neutral-700 transition"
              >
                <div>
                  <div className="font-medium">{member.fullName}</div>
                  <div className="text-xs text-neutral-500">
                    {member.phone}
                    {member.status === "inactive" ? ` · ${t(locale, "inactiveTag")}` : ""}
                  </div>
                </div>
                <StatusBadge status={status} locale={locale} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
