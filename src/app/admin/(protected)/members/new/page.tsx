import { createMemberAction } from "@/app/actions/members";
import MemberForm from "@/components/MemberForm";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/dictionaries";

export default async function NewMemberPage() {
  const locale = await getLocale();
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">{t(locale, "addMemberTitle")}</h1>
      <MemberForm action={createMemberAction} submitLabel={t(locale, "addMemberBtn")} locale={locale} />
    </div>
  );
}
