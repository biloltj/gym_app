import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getMemberPaymentStatus, type PaymentStatus } from "@/lib/payment-status";
import StatusBadge from "@/components/StatusBadge";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/dictionaries";

export default async function DashboardPage() {
  const locale = await getLocale();

  const members = await prisma.member.findMany({
    where: { status: "active" },
    include: { payments: { select: { forMonth: true } } },
  });

  const results = members.map((member) => ({
    member,
    ...getMemberPaymentStatus(
      member.joinDate,
      member.payments.map((p) => p.forMonth)
    ),
  }));

  const byStatus = (status: PaymentStatus) => results.filter((r) => r.status === status);
  const overdue = byStatus("overdue").sort((a, b) => b.monthsOwed - a.monthsOwed);
  const dueSoon = byStatus("due_soon").sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  const paidCount = byStatus("paid").length;

  const stats = [
    { label: t(locale, "statActiveMembers"), value: members.length },
    { label: t(locale, "statPaidThisMonth"), value: paidCount },
    { label: t(locale, "statDueSoon"), value: dueSoon.length },
    { label: t(locale, "statOverdue"), value: overdue.length },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <div className="text-2xl font-semibold">{s.value}</div>
            <div className="text-xs text-neutral-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-sm font-medium text-neutral-300 mb-3">
          {t(locale, "sectionOverdue", { count: overdue.length })}
        </h2>
        {overdue.length === 0 ? (
          <p className="text-sm text-neutral-500">{t(locale, "noOverdue")}</p>
        ) : (
          <div className="space-y-2">
            {overdue.map(({ member, status, monthsOwed }) => (
              <Link
                key={member.id}
                href={`/admin/members/${member.id}`}
                className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 hover:border-neutral-700 transition"
              >
                <div>
                  <div className="font-medium">{member.fullName}</div>
                  <div className="text-xs text-neutral-500">
                    {t(locale, "monthsOwedShort", { count: monthsOwed })} &middot; {member.phone}
                  </div>
                </div>
                <StatusBadge status={status} locale={locale} />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-medium text-neutral-300 mb-3">
          {t(locale, "sectionDueSoon", { count: dueSoon.length })}
        </h2>
        {dueSoon.length === 0 ? (
          <p className="text-sm text-neutral-500">{t(locale, "noDueSoon")}</p>
        ) : (
          <div className="space-y-2">
            {dueSoon.map(({ member, status, dueDate }) => (
              <Link
                key={member.id}
                href={`/admin/members/${member.id}`}
                className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 hover:border-neutral-700 transition"
              >
                <div>
                  <div className="font-medium">{member.fullName}</div>
                  <div className="text-xs text-neutral-500">
                    {t(locale, "dueLabel", { date: dueDate.toLocaleDateString() })} &middot; {member.phone}
                  </div>
                </div>
                <StatusBadge status={status} locale={locale} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
