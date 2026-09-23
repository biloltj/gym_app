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

async function memberSchema() {
  const locale = await getLocale();
  return z.object({
    fullName: z.string().min(1, t(locale, "nameRequired")),
    phone: z.string().min(1, t(locale, "phoneRequired")),
    email: z.string().email(t(locale, "invalidEmail")).optional().or(z.literal("")),
    joinDate: z.string().min(1, t(locale, "joinDateRequired")),
    monthlyFee: z.coerce.number().int().positive(t(locale, "feePositive")),
    status: z.enum(["active", "inactive"]),
    notes: z.string().optional(),
  });
}

export type MemberFormState = { error?: string };

export async function createMemberAction(
  _prevState: MemberFormState,
  formData: FormData
): Promise<MemberFormState> {
  await requireAdmin();
  const parsed = (await memberSchema()).safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;

  const member = await prisma.member.create({
    data: {
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || null,
      joinDate: new Date(data.joinDate),
      monthlyFee: data.monthlyFee,
      status: data.status,
      notes: data.notes || null,
    },
  });

  revalidatePath("/admin/members");
  redirect(`/admin/members/${member.id}`);
}

export async function updateMemberAction(
  id: string,
  _prevState: MemberFormState,
  formData: FormData
): Promise<MemberFormState> {
  await requireAdmin();
  const parsed = (await memberSchema()).safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;

  await prisma.member.update({
    where: { id },
    data: {
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || null,
      joinDate: new Date(data.joinDate),
      monthlyFee: data.monthlyFee,
      status: data.status,
      notes: data.notes || null,
    },
  });

  revalidatePath("/admin/members");
  revalidatePath(`/admin/members/${id}`);
  return {};
}

export async function deleteMemberAction(id: string) {
  await requireAdmin();
  await prisma.member.delete({ where: { id } });
  revalidatePath("/admin/members");
  redirect("/admin/members");
}
