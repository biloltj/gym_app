import { Wallet, TrendingUp, Percent } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/dictionaries";
import RevenueChart, { type RevenuePoint } from "@/components/RevenueChart";

const MONTHS_BACK = 6;

const MONTH_LABEL_LOCALE: Record<string, string> = { en: "en-US", ru: "ru-RU", tg: "ru-RU" };

function ymKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export default async function AnalyticsPage() {
  const locale = await getLocale();

  const [members, payments] = await Promise.all([
    prisma.member.findMany({ select: { joinDate: true, monthlyFee: true } }),
    prisma.payment.findMany({ select: { amount: true, forMonth: true } }),
  ]);

  const today = new Date();
  const months: { key: string; date: Date }[] = [];
  for (let i = MONTHS_BACK - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({ key: ymKey(date), date });
  }

  const monthFormatter = new Intl.DateTimeFormat(MONTH_LABEL_LOCALE[locale] ?? "en-US", {
    month: "short",
  });

  const data: RevenuePoint[] = months.map(({ key, date }) => {
    const collected = payments
      .filter((p) => p.forMonth === key)
      .reduce((sum, p) => sum + p.amount, 0);
    const expected = members
      .filter((m) => ymKey(m.joinDate) <= key)
      .reduce((sum, m) => sum + m.monthlyFee, 0);
    return { month: key, label: monthFormatter.format(date), collected, expected };
  });

  const currentMonth = data[data.length - 1];
  const collectionRate =
    currentMonth.expected > 0
      ? Math.round((currentMonth.collected / currentMonth.expected) * 100)
      : 0;

  const stats = [
    {
      label: t(locale, "statCollectedThisMonth"),
      value: currentMonth.collected,
      icon: Wallet,
      accent: "text-emerald-400 bg-emerald-500/10",
    },
    {
      label: t(locale, "statExpectedThisMonth"),
      value: currentMonth.expected,
      icon: TrendingUp,
      accent: "text-indigo-400 bg-indigo-500/10",
    },
    {
      label: t(locale, "statCollectionRate"),
      value: `${collectionRate}%`,
      icon: Percent,
      accent: "text-amber-400 bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
            <div className={`inline-flex items-center justify-center rounded-lg p-1.5 mb-3 ${s.accent}`}>
              <s.icon className="h-4 w-4" />
            </div>
            <div className="text-2xl font-semibold tabular-nums">{s.value}</div>
            <div className="text-xs text-neutral-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
        <h2 className="text-sm font-medium text-neutral-300 mb-4">
          {t(locale, "chartTitleRevenue")}
        </h2>
        <RevenueChart
          data={data}
          legendCollected={t(locale, "legendCollected")}
          legendExpected={t(locale, "legendExpected")}
        />
      </section>
    </div>
  );
}
