"use client";

import { useActionState } from "react";
import { addPaymentAction } from "@/app/actions/payments";
import { t } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";

const inputClass =
  "w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500";
const labelClass = "block text-sm text-neutral-300 mb-1";

export default function AddPaymentForm({
  memberId,
  defaultAmount,
  locale,
}: {
  memberId: string;
  defaultAmount: number;
  locale: Locale;
}) {
  const [state, formAction, pending] = useActionState(addPaymentAction, {});
  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="memberId" value={memberId} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass} htmlFor="amount">{t(locale, "amountLabel")}</label>
          <input
            id="amount"
            name="amount"
            type="number"
            min={1}
            required
            defaultValue={defaultAmount}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="forMonth">{t(locale, "forMonthLabel")}</label>
          <input
            id="forMonth"
            name="forMonth"
            type="month"
            required
            defaultValue={currentMonth}
            className={inputClass}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass} htmlFor="paidDate">{t(locale, "paidOnLabel")}</label>
          <input
            id="paidDate"
            name="paidDate"
            type="date"
            required
            defaultValue={today}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="method">{t(locale, "methodLabel")}</label>
          <select id="method" name="method" defaultValue="cash" className={inputClass}>
            <option value="cash">{t(locale, "methodCash")}</option>
            <option value="card">{t(locale, "methodCard")}</option>
            <option value="transfer">{t(locale, "methodTransfer")}</option>
            <option value="other">{t(locale, "methodOther")}</option>
          </select>
        </div>
      </div>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-medium px-5 py-2.5 transition"
      >
        {pending ? t(locale, "saving") : t(locale, "recordPaymentBtn")}
      </button>
    </form>
  );
}
