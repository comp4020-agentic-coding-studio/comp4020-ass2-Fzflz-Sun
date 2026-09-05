import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// The `due:` value is a UTC instant plus an offset (e.g. `+11:00`), but
// `formatCourseDeadline` (src/lib/dates.ts) renders it in the real
// `Australia/Canberra` timezone — so a `due:` offset that disagrees with
// what that timezone's DST rules actually say for that date doesn't just
// mislabel the zone abbreviation, it shifts the displayed wall-clock time
// off the intended noon deadline. Rendering the built page is the only way
// to catch that: reading the frontmatter string alone can't reveal it.
const html = readFileSync(resolve("dist/assessments/decision-autopsy/index.html"), "utf8");

describe("Decision Autopsy due date renders the correct Canberra wall-clock time", () => {
  it("shows the intended noon deadline, not a DST-shifted hour", () => {
    expect(html).toMatch(/12:00\s*pm/i);
  });

  it("labels the timezone as Canberra's daylight-saving offset (AEDT, UTC+11) for this date", () => {
    // 29 March 2027 is before the first Sunday in April, when AEDT ends —
    // so a correct render must show +11, not the non-DST +10.
    expect(html).toMatch(/AEDT|GMT\+11/);
    expect(html).not.toMatch(/AEST|GMT\+10\b/);
  });

  it("[negative example] a due date rendered with the wrong DST offset would be caught", () => {
    const wrongRender = "29 March 2027, 1:00 pm AEDT";
    expect(wrongRender).not.toMatch(/12:00\s*pm/i);
  });
});
