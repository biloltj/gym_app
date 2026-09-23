"use client";

import { Trash2 } from "lucide-react";
import { deleteMemberAction } from "@/app/actions/members";
import { t } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";

export default function DeleteMemberButton({ id, locale }: { id: string; locale: Locale }) {
  return (
    <form
      action={deleteMemberAction.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm(t(locale, "deleteMemberConfirm"))) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="flex items-center gap-1.5 rounded-lg border border-red-900/40 px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/30 transition"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t(locale, "deleteMemberBtn")}</span>
      </button>
    </form>
  );
}
