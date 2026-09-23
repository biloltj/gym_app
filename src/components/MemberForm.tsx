"use client";

import { useActionState } from "react";
import type { MemberFormState } from "@/app/actions/members";
import { t } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";

type Action = (
  prevState: MemberFormState,
  formData: FormData
) => Promise<MemberFormState>;

type Props = {
  action: Action;
  submitLabel: string;
  locale: Locale;
  defaultValues?: {
    fullName?: string;
    phone?: string;
    email?: string;
    joinDate?: string;
    monthlyFee?: number;
    status?: string;
    notes?: string;
  };
};

const inputClass =
  "w-full rounded-lg bg-neutral-950/60 border border-neutral-800 px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition";
const labelClass = "block text-sm text-neutral-300 mb-1.5";

export default function MemberForm({ action, submitLabel, locale, defaultValues = {} }: Props) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className={labelClass} htmlFor="fullName">{t(locale, "fullNameLabel")}</label>
        <input id="fullName" name="fullName" required defaultValue={defaultValues.fullName} className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass} htmlFor="phone">{t(locale, "phoneLabel")}</label>
          <input id="phone" name="phone" required defaultValue={defaultValues.phone} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">{t(locale, "emailLabel")}</label>
          <input id="email" name="email" type="email" defaultValue={defaultValues.email} className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass} htmlFor="joinDate">{t(locale, "joinDateLabel")}</label>
          <input
            id="joinDate"
            name="joinDate"
            type="date"
            required
            defaultValue={defaultValues.joinDate ?? new Date().toISOString().slice(0, 10)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="monthlyFee">{t(locale, "monthlyFeeLabel")}</label>
          <input
            id="monthlyFee"
            name="monthlyFee"
            type="number"
            min={1}
            required
            defaultValue={defaultValues.monthlyFee}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="status">{t(locale, "statusLabel")}</label>
        <select id="status" name="status" defaultValue={defaultValues.status ?? "active"} className={inputClass}>
          <option value="active">{t(locale, "statusActive")}</option>
          <option value="inactive">{t(locale, "statusInactive")}</option>
        </select>
      </div>
      <div>
        <label className={labelClass} htmlFor="notes">{t(locale, "notesLabel")}</label>
        <textarea id="notes" name="notes" rows={3} defaultValue={defaultValues.notes} className={inputClass} />
      </div>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-medium px-5 py-2.5 transition"
      >
        {pending ? t(locale, "saving") : submitLabel}
      </button>
    </form>
  );
}
