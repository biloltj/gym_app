"use client";

import { deletePaymentAction } from "@/app/actions/payments";
import { t } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";

export default function DeletePaymentButton({
  paymentId,
  memberId,
  locale,
}: {
  paymentId: string;
  memberId: string;
  locale: Locale;
}) {
  return (
    <form
      action={deletePaymentAction.bind(null, paymentId, memberId)}
      onSubmit={(e) => {
        if (!confirm(t(locale, "deletePaymentConfirm"))) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-xs text-red-400 hover:text-red-300 transition">
        {t(locale, "deleteBtn")}
      </button>
    </form>
  );
}
