import type { PaymentStatus } from "@/lib/payment-status";
import { t, type DictionaryKey } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";

const STYLES: Record<PaymentStatus, string> = {
  paid: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  due_soon: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  overdue: "bg-red-500/15 text-red-400 border-red-500/30",
  upcoming: "bg-neutral-500/15 text-neutral-400 border-neutral-500/30",
};

const LABEL_KEYS: Record<PaymentStatus, DictionaryKey> = {
  paid: "statusPaid",
  due_soon: "statusDueSoon",
  overdue: "statusOverdue",
  upcoming: "statusUpcoming",
};

export default function StatusBadge({
  status,
  locale,
}: {
  status: PaymentStatus;
  locale: Locale;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${STYLES[status]}`}
    >
      {t(locale, LABEL_KEYS[status])}
    </span>
  );
}
