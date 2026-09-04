const longDate = new Intl.DateTimeFormat("en-AU", {
  dateStyle: "long",
  timeZone: "UTC",
});

// The course's own timezone (see `timezone` on the `courseGraph` integration
// in astro.config.ts) — deadlines are due at a real wall-clock time there, so
// the offset in a `due:` value must survive into what the reader sees.
// `dateStyle`/`timeStyle` can't be combined with `timeZoneName`, so the full
// deadline format spells out each component instead.
const longDateTime = new Intl.DateTimeFormat("en-AU", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Australia/Canberra",
  timeZoneName: "short",
});

/** Format a date-only value without letting the viewer's timezone move it. */
export function formatCourseDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(`${value}T00:00:00Z`) : value;
  return longDate.format(date);
}

/**
 * Format a deadline that carries a real time and offset (e.g. a `due:`
 * value like `2027-05-03T12:00:00+10:00`) as date, time and timezone —
 * never truncated to a date-only string, since a noon deadline and a
 * midnight one are not the same deadline.
 */
export function formatCourseDeadline(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return longDateTime.format(date);
}
