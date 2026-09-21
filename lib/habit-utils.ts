import { Habit } from "@/types/database.type";

export type Frequency = Habit["frequency"];

const startOfDay = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const startOfWeek = (date: Date) => {
  const copy = startOfDay(date);
  copy.setDate(copy.getDate() - copy.getDay()); // week starts Sunday
  return copy;
};

const startOfMonth = (date: Date) => {
  const copy = startOfDay(date);
  copy.setDate(1);
  return copy;
};

// A monotonically increasing integer identifying which "period" a date falls in,
// so consecutive periods always differ by exactly 1.
const periodIndex = (date: Date, frequency: Frequency): number => {
  if (frequency === "monthly") {
    const start = startOfMonth(date);
    return start.getFullYear() * 12 + start.getMonth();
  }
  const msPerDay = 86_400_000;
  const start = frequency === "weekly" ? startOfWeek(date) : startOfDay(date);
  const unitDays = frequency === "weekly" ? 7 : 1;
  return Math.floor(start.getTime() / (msPerDay * unitDays));
};

export const periodsBetween = (
  newer: string | Date,
  older: string | Date,
  frequency: Frequency,
): number =>
  periodIndex(new Date(newer), frequency) -
  periodIndex(new Date(older), frequency);

// Is `dateStr` in the same period as `now` (i.e. does it satisfy the habit "for now")?
export const isCurrentPeriod = (
  dateStr: string,
  frequency: Frequency,
  now: Date = new Date(),
): boolean => periodsBetween(now, dateStr, frequency) === 0;

export const computeStreaks = (
  completionDates: string[],
  frequency: Frequency,
  now: Date = new Date(),
) => {
  if (completionDates.length === 0) return { current: 0, best: 0, total: 0 };

  // Multiple completions in the same period only count once toward a streak.
  const seen = new Set<number>();
  const uniquePeriods: number[] = [];
  for (const date of [...completionDates].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  )) {
    const idx = periodIndex(new Date(date), frequency);
    if (!seen.has(idx)) {
      seen.add(idx);
      uniquePeriods.push(idx);
    }
  }

  let best = 1;
  let run = 1;
  for (let i = 1; i < uniquePeriods.length; i += 1) {
    run = uniquePeriods[i - 1] - uniquePeriods[i] === 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }

  // Current streak only counts as "alive" if the latest completion is this
  // period or the one right before it (i.e. not yet broken).
  const gapFromNow = periodIndex(now, frequency) - uniquePeriods[0];
  let current = 0;
  if (gapFromNow <= 1) {
    current = 1;
    for (let i = 1; i < uniquePeriods.length; i += 1) {
      if (uniquePeriods[i - 1] - uniquePeriods[i] === 1) current += 1;
      else break;
    }
  }

  return {
    current,
    best: Math.max(best, current),
    total: completionDates.length,
  };
};

export const MONTHLY_FREEZE_ALLOWANCE = 2;

// A missed-period gap of exactly 2 (one full period skipped) can be covered
// by a single freeze. Bigger gaps are considered "really" broken.
export const isFreezeableGap = (gap: number) => gap === 2;

// Has this habit's freeze allowance rolled over into a new month?
export const freezesNeedReset = (
  resetAt: string | undefined,
  now: Date = new Date(),
): boolean => {
  if (!resetAt) return true;
  const reset = new Date(resetAt);
  return (
    now.getFullYear() !== reset.getFullYear() ||
    now.getMonth() !== reset.getMonth()
  );
};

export const startOfCurrentMonthISO = (now: Date = new Date()): string => {
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  return start.toISOString();
};
