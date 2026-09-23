import { UserPlus } from "lucide-react";
import { createMemberAction } from "@/app/actions/members";
import MemberForm from "@/components/MemberForm";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/dictionaries";

export default async function NewMemberPage() {
  const locale = await getLocale();
  return (
    <div className="space-y-6">
      <h1 className="flex items-center gap-2 text-lg font-semibold">
        <UserPlus className="h-5 w-5 text-indigo-400" />
        {t(locale, "addMemberTitle")}
      </h1>
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
        <MemberForm action={createMemberAction} submitLabel={t(locale, "addMemberBtn")} locale={locale} />
      </div>
    </div>
  );
}
