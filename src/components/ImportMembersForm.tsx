"use client";

import { useActionState } from "react";
import { Upload } from "lucide-react";
import { importMembersAction } from "@/app/actions/members";
import { t } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";

export default function ImportMembersForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState(importMembersAction, {});

  return (
    <form action={formAction} className="flex items-center gap-2">
      <label className="flex items-center gap-1.5 rounded-lg border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 text-sm font-medium px-3 py-2 transition cursor-pointer">
        <Upload className="h-4 w-4" />
        <span className="hidden sm:inline">{pending ? "..." : t(locale, "importCsvBtn")}</span>
        <input
          type="file"
          name="file"
          accept=".csv,text/csv"
          className="hidden"
          disabled={pending}
          onChange={(e) => e.target.form?.requestSubmit()}
        />
      </label>
      {state?.error && <p className="text-xs text-red-400">{state.error}</p>}
      {typeof state?.imported === "number" && (
        <p className="text-xs text-neutral-400">
          {t(locale, "importResult", { imported: state.imported, skipped: state.skipped ?? 0 })}
        </p>
      )}
    </form>
  );
}
