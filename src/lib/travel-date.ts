/** Civil travel dates: reject rollover dates before they reach calendars or payloads. */
export function isTravelDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function validTravelRange(start: unknown, end: unknown, today: string) {
  return isTravelDate(start) && isTravelDate(end) && start >= today && end >= start;
}
