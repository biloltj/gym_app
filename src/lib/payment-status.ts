export type PaymentStatus = "paid" | "due_soon" | "overdue" | "upcoming";

export type PaymentStatusResult = {
  status: PaymentStatus;
  dueDate: Date;
  monthsOwed: number;
  currentMonth: string;
};

const DUE_SOON_WINDOW_DAYS = 5;

function ymKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

/** Recurring due date within a given month, anchored to the join day (clamped to month length). */
function dueDateInMonth(joinDate: Date, year: number, month: number): Date {
  const lastDay = new Date(year, month + 1, 0).getDate();
  const day = Math.min(joinDate.getDate(), lastDay);
  return new Date(year, month, day);
}

function monthsBetweenInclusive(from: Date, to: Date): string[] {
  const months: string[] = [];
  let cursor = new Date(from.getFullYear(), from.getMonth(), 1);
  const end = new Date(to.getFullYear(), to.getMonth(), 1);
  while (cursor <= end) {
    months.push(ymKey(cursor));
    cursor = addMonths(cursor, 1);
  }
  return months;
}

/**
 * Determines whether a member is paid up, due soon, overdue, or hasn't
 * reached their first due date yet, based on join date and recorded payments.
 */
export function getMemberPaymentStatus(
  joinDate: Date,
  paidMonths: string[],
  today: Date = new Date()
): PaymentStatusResult {
  const paidSet = new Set(paidMonths);
  const currentMonth = ymKey(today);
  const expectedMonths = monthsBetweenInclusive(joinDate, today);
  const unpaidMonths = expectedMonths.filter((ym) => !paidSet.has(ym));

  const currentMonthDueDate = dueDateInMonth(
    joinDate,
    today.getFullYear(),
    today.getMonth()
  );

  const unpaidPastMonths = unpaidMonths.filter((ym) => ym < currentMonth);

  if (unpaidPastMonths.length > 0) {
    return {
      status: "overdue",
      dueDate: dueDateInMonth(
        joinDate,
        Number(unpaidPastMonths[0].slice(0, 4)),
        Number(unpaidPastMonths[0].slice(5, 7)) - 1
      ),
      monthsOwed: unpaidMonths.length,
      currentMonth,
    };
  }

  const paidThisMonth = paidSet.has(currentMonth);
  if (paidThisMonth) {
    return { status: "paid", dueDate: currentMonthDueDate, monthsOwed: 0, currentMonth };
  }

  if (today > currentMonthDueDate) {
    return {
      status: "overdue",
      dueDate: currentMonthDueDate,
      monthsOwed: 1,
      currentMonth,
    };
  }

  const msUntilDue = currentMonthDueDate.getTime() - today.getTime();
  const daysUntilDue = msUntilDue / (1000 * 60 * 60 * 24);
  if (daysUntilDue <= DUE_SOON_WINDOW_DAYS) {
    return { status: "due_soon", dueDate: currentMonthDueDate, monthsOwed: 1, currentMonth };
  }

  return { status: "upcoming", dueDate: currentMonthDueDate, monthsOwed: 0, currentMonth };
}

export function currentMonthKey(today: Date = new Date()): string {
  return ymKey(today);
}
