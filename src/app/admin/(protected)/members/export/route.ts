import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMemberPaymentStatus } from "@/lib/payment-status";
import { getLocale } from "@/lib/i18n/get-locale";
import { t, type DictionaryKey } from "@/lib/i18n/dictionaries";

const STATUS_LABEL_KEYS: Record<string, DictionaryKey> = {
  paid: "statusPaid",
  due_soon: "statusDueSoon",
  overdue: "statusOverdue",
  upcoming: "statusUpcoming",
};

function csvCell(value: string | number): string {
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const locale = await getLocale();

  const members = await prisma.member.findMany({
    include: { payments: { select: { forMonth: true } } },
    orderBy: { fullName: "asc" },
  });

  const headers = [
    t(locale, "fullNameLabel"),
    t(locale, "phoneLabel"),
    t(locale, "emailLabel"),
    t(locale, "joinDateLabel"),
    t(locale, "monthlyFeeLabel"),
    t(locale, "statusLabel"),
    t(locale, "csvHeaderPaymentStatus"),
    t(locale, "csvHeaderMonthsOwed"),
    t(locale, "csvHeaderNextDue"),
  ];

  const rows = members.map((member) => {
    const { status, dueDate, monthsOwed } = getMemberPaymentStatus(
      member.joinDate,
      member.payments.map((p) => p.forMonth)
    );
    return [
      member.fullName,
      member.phone,
      member.email ?? "",
      member.joinDate.toISOString().slice(0, 10),
      member.monthlyFee,
      member.status === "active" ? t(locale, "statusActive") : t(locale, "statusInactive"),
      t(locale, STATUS_LABEL_KEYS[status]),
      monthsOwed,
      dueDate.toISOString().slice(0, 10),
    ];
  });

  const csv = [headers, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");

  return new NextResponse(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="members-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
