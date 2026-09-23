import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMemberPaymentStatus } from "@/lib/payment-status";
import { updateMemberAction } from "@/app/actions/members";
import MemberForm from "@/components/MemberForm";
import AddPaymentForm from "@/components/AddPaymentForm";
import DeleteMemberButton from "@/components/DeleteMemberButton";
import DeletePaymentButton from "@/components/DeletePaymentButton";
import StatusBadge from "@/components/StatusBadge";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/dictionaries";

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();

  const member = await prisma.member.findUnique({
    where: { id },
    include: { payments: { orderBy: { forMonth: "desc" } } },
  });

  if (!member) notFound();

  const { status, dueDate, monthsOwed } = getMemberPaymentStatus(
    member.joinDate,
    member.payments.map((p) => p.forMonth)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">{member.fullName}</h1>
          <div className="mt-2 flex items-center gap-2">
            <StatusBadge status={status} locale={locale} />
            <span className="text-xs text-neutral-500">
              {status === "overdue"
                ? t(locale, "monthsOwedShort", { count: monthsOwed })
                : t(locale, "nextDueLabel", { date: dueDate.toLocaleDateString() })}
            </span>
          </div>
        </div>
        <DeleteMemberButton id={member.id} locale={locale} />
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-neutral-300">{t(locale, "recordPaymentTitle")}</h2>
        <AddPaymentForm memberId={member.id} defaultAmount={member.monthlyFee} locale={locale} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-neutral-300">
          {t(locale, "paymentHistoryTitle", { count: member.payments.length })}
        </h2>
        {member.payments.length === 0 ? (
          <p className="text-sm text-neutral-500">{t(locale, "noPayments")}</p>
        ) : (
          <div className="space-y-2">
            {member.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3"
              >
                <div>
                  <div className="font-medium">{payment.forMonth}</div>
                  <div className="text-xs text-neutral-500">
                    {payment.amount} &middot; {t(locale, "paidOnLabel")}{" "}
                    {new Date(payment.paidDate).toLocaleDateString()} &middot; {payment.method}
                  </div>
                </div>
                <DeletePaymentButton paymentId={payment.id} memberId={member.id} locale={locale} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-neutral-300">{t(locale, "editMemberTitle")}</h2>
        <MemberForm
          action={updateMemberAction.bind(null, member.id)}
          submitLabel={t(locale, "saveChangesBtn")}
          locale={locale}
          defaultValues={{
            fullName: member.fullName,
            phone: member.phone,
            email: member.email ?? undefined,
            joinDate: member.joinDate.toISOString().slice(0, 10),
            monthlyFee: member.monthlyFee,
            status: member.status,
            notes: member.notes ?? undefined,
          }}
        />
      </section>
    </div>
  );
}
