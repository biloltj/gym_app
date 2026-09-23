"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/dictionaries";

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

async function paymentSchema() {
  const locale = await getLocale();
  return z.object({
    memberId: z.string().min(1),
    amount: z.coerce.number().int().positive(t(locale, "amountPositive")),
    forMonth: z.string().regex(/^\d{4}-\d{2}$/, t(locale, "pickMonth")),
    paidDate: z.string().min(1, t(locale, "pickDate")),
    method: z.string().min(1),
  });
}

export type PaymentFormState = { error?: string };

export async function addPaymentAction(
  _prevState: PaymentFormState,
  formData: FormData
): Promise<PaymentFormState> {
  await requireAdmin();
  const parsed = (await paymentSchema()).safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;

  await prisma.payment.create({
    data: {
      memberId: data.memberId,
      amount: data.amount,
      forMonth: data.forMonth,
      paidDate: new Date(data.paidDate),
      method: data.method,
    },
  });

  revalidatePath(`/admin/members/${data.memberId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/members");
  return {};
}

export async function deletePaymentAction(paymentId: string, memberId: string) {
  await requireAdmin();
  await prisma.payment.delete({ where: { id: paymentId } });
  revalidatePath(`/admin/members/${memberId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/members");
}
