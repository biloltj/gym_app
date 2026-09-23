import { notFound } from "next/navigation";
import { CreditCard, History, UserPen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getMemberPaymentStatus, getNextUnpaidMonth } from "@/lib/payment-status";
import { updateMemberAction } from "@/app/actions/members";
import MemberForm from "@/components/MemberForm";
import AddPaymentForm from "@/components/AddPaymentForm";
import DeleteMemberButton from "@/components/DeleteMemberButton";
import DeletePaymentButton from "@/components/DeletePaymentButton";
import StatusBadge from "@/components/StatusBadge";
import Avatar from "@/components/Avatar";
import WhatsAppButton from "@/components/WhatsAppButton";
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

  const paidMonths = member.payments.map((p) => p.forMonth);
  const { status, dueDate, monthsOwed } = getMemberPaymentStatus(member.joinDate, paidMonths);
  const nextUnpaidMonth = getNextUnpaidMonth(member.joinDate, paidMonths);
  const appName = t(locale, "appName");
  const reminderMessage =
    status === "overdue"
      ? t(locale, "waReminderOverdue", { name: member.fullName, appName, count: monthsOwed })
      : t(locale, "waReminderDueSoon", {
          name: member.fullName,
          appName,
          date: dueDate.toLocaleDateString(),
        });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={member.fullName} />
          <div>
            <h1 className="text-lg font-semibold">{member.fullName}</h1>
            <div className="mt-1 flex items-center gap-2">
              <StatusBadge status={status} locale={locale} />
              <span className="text-xs text-neutral-500">
                {status === "overdue"
                  ? t(locale, "monthsOwedShort", { count: monthsOwed })
                  : t(locale, "nextDueLabel", { date: dueDate.toLocaleDateString() })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(status === "overdue" || status === "due_soon") && (
            <WhatsAppButton
              phone={member.phone}
              label={t(locale, "whatsappBtn")}
              message={reminderMessage}
            />
          )}
          <DeleteMemberButton id={member.id} locale={locale} />
        </div>
      </div>

      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-medium text-neutral-300">
          <CreditCard className="h-4 w-4 text-emerald-400" />
          {t(locale, "recordPaymentTitle")}
        </h2>
        <AddPaymentForm
          memberId={member.id}
          defaultAmount={member.monthlyFee}
          defaultForMonth={nextUnpaidMonth}
          locale={locale}
        />
      </section>

      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-medium text-neutral-300">
          <History className="h-4 w-4 text-neutral-500" />
          {t(locale, "paymentHistoryTitle", { count: member.payments.length })}
        </h2>
        {member.payments.length === 0 ? (
          <p className="text-sm text-neutral-500">{t(locale, "noPayments")}</p>
        ) : (
          <div className="space-y-2">
            {member.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/60 px-4 py-3"
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

      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-medium text-neutral-300">
          <UserPen className="h-4 w-4 text-indigo-400" />
          {t(locale, "editMemberTitle")}
        </h2>
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
