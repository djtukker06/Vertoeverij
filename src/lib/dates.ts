export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
export const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
export const daysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
export const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
export const sameDay = (a: Date | null, b: Date | null) => !!a && !!b && dayKey(a) === dayKey(b);
/** Maandag = 0 */
export const weekdayIndex = (d: Date) => (d.getDay() + 6) % 7;

export const WEEKDAYS = ["ma", "di", "wo", "do", "vr", "za", "zo"];
export const monthFmt = new Intl.DateTimeFormat("nl-NL", { month: "long", year: "numeric" });
export const monthNameFmt = new Intl.DateTimeFormat("nl-NL", { month: "long" });
export const longFmt = new Intl.DateTimeFormat("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

/** Cellen voor een maandraster: lege plekken tot de eerste maandag-kolom, daarna de dagen. */
export function monthCells(view: Date): (Date | null)[] {
  return [
    ...Array.from({ length: weekdayIndex(startOfMonth(view)) }, () => null),
    ...Array.from({ length: daysInMonth(view) }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1)),
  ];
}
