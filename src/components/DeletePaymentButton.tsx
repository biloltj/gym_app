"use client";

import { X } from "lucide-react";
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
      <button
        type="submit"
        className="flex items-center gap-1 rounded-md p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-950/30 transition"
        aria-label={t(locale, "deleteBtn")}
        title={t(locale, "deleteBtn")}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}
