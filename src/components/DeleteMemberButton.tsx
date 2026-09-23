"use client";

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
      <button type="submit" className="text-sm text-red-400 hover:text-red-300 transition">
        {t(locale, "deleteMemberBtn")}
      </button>
    </form>
  );
}
