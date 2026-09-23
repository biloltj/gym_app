import Link from "next/link";
import { Users, CheckCircle2, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getMemberPaymentStatus, type PaymentStatus } from "@/lib/payment-status";
import StatusBadge from "@/components/StatusBadge";
import Avatar from "@/components/Avatar";
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
    {
      label: t(locale, "statActiveMembers"),
      value: members.length,
      icon: Users,
      accent: "text-indigo-400 bg-indigo-500/10",
    },
    {
      label: t(locale, "statPaidThisMonth"),
      value: paidCount,
      icon: CheckCircle2,
      accent: "text-emerald-400 bg-emerald-500/10",
    },
    {
      label: t(locale, "statDueSoon"),
      value: dueSoon.length,
      icon: Clock,
      accent: "text-amber-400 bg-amber-500/10",
    },
    {
      label: t(locale, "statOverdue"),
      value: overdue.length,
      icon: AlertTriangle,
      accent: "text-red-400 bg-red-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4"
          >
            <div className={`inline-flex items-center justify-center rounded-lg p-1.5 mb-3 ${s.accent}`}>
              <s.icon className="h-4 w-4" />
            </div>
            <div className="text-2xl font-semibold tabular-nums">{s.value}</div>
            <div className="text-xs text-neutral-400 mt-0.5">{s.label}</div>
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
                className="group flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3 hover:border-neutral-700 hover:bg-neutral-900 transition"
              >
                <Avatar name={member.fullName} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{member.fullName}</div>
                  <div className="text-xs text-neutral-500">
                    {t(locale, "monthsOwedShort", { count: monthsOwed })} &middot; {member.phone}
                  </div>
                </div>
                <StatusBadge status={status} locale={locale} />
                <ChevronRight className="h-4 w-4 text-neutral-600 group-hover:text-neutral-400 transition hidden sm:block" />
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
                className="group flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3 hover:border-neutral-700 hover:bg-neutral-900 transition"
              >
                <Avatar name={member.fullName} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{member.fullName}</div>
                  <div className="text-xs text-neutral-500">
                    {t(locale, "dueLabel", { date: dueDate.toLocaleDateString() })} &middot; {member.phone}
                  </div>
                </div>
                <StatusBadge status={status} locale={locale} />
                <ChevronRight className="h-4 w-4 text-neutral-600 group-hover:text-neutral-400 transition hidden sm:block" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
