"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/dictionaries";
import { parseCsv } from "@/lib/csv";

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

export type ImportMembersState = { error?: string; imported?: number; skipped?: number };

/** Expects columns: fullName, phone, email, joinDate (YYYY-MM-DD), monthlyFee — a header row is skipped. */
export async function importMembersAction(
  _prevState: ImportMembersState,
  formData: FormData
): Promise<ImportMembersState> {
  await requireAdmin();
  const locale = await getLocale();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: t(locale, "importNoFile") };
  }

  const text = (await file.text()).replace(/^﻿/, "");
  const dataRows = parseCsv(text).slice(1);

  const toCreate: {
    fullName: string;
    phone: string;
    email: string | null;
    joinDate: Date;
    monthlyFee: number;
  }[] = [];
  let skipped = 0;

  for (const cols of dataRows) {
    const [fullName, phone, email, joinDateStr, feeStr] = cols;
    const monthlyFee = parseInt(feeStr, 10);
    const joinDate = new Date(joinDateStr);
    if (
      !fullName?.trim() ||
      !phone?.trim() ||
      Number.isNaN(monthlyFee) ||
      monthlyFee <= 0 ||
      Number.isNaN(joinDate.getTime())
    ) {
      skipped++;
      continue;
    }
    toCreate.push({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email?.trim() || null,
      joinDate,
      monthlyFee,
    });
  }

  if (toCreate.length > 0) {
    await prisma.member.createMany({ data: toCreate });
  }

  revalidatePath("/admin/members");
  return { imported: toCreate.length, skipped };
}
