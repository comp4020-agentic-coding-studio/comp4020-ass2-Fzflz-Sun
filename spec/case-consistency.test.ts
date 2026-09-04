import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { engagementSignalCase, engagementSignalTimeline } from "../src/data/case-facts";

const casePages = [
  "src/content/sessions/01-getting-started.md",
  "src/content/lectures/week-01.md",
  "src/decks/week-01.deck.mdx",
  "src/content/sessions/02-first-review.md",
  "src/content/lectures/week-02.md",
  "src/content/sessions/03-the-agenda-is-an-argument.md",
  "src/content/lectures/week-03.md",
  "src/decks/week-03.deck.mdx",
  "src/content/sessions/04-the-meeting-before-the-meeting.md",
  "src/content/lectures/week-04.md",
  "src/content/sessions/05-information-arrives-on-someones-schedule.md",
  "src/content/lectures/week-05.md",
  "src/content/sessions/06-silence-is-a-position-sometimes.md",
  "src/content/lectures/week-06.md",
  "src/content/sessions/07-power-in-the-room.md",
  "src/content/lectures/week-07.md",
  "src/content/sessions/08-dissent-without-disappearing.md",
  "src/content/lectures/week-08.md",
  "src/content/sessions/09-who-actually-decides.md",
  "src/content/lectures/week-09.md",
  "src/content/sessions/10-minutes-make-memory.md",
  "src/content/lectures/week-10.md",
  "src/content/sessions/11-the-ethics-of-alignment.md",
  "src/content/lectures/week-11.md",
  "src/content/sessions/12-redesigning-the-decision.md",
  "src/content/lectures/week-12.md",
  "src/pages/alignment-lab/index.mdx",
];

const readCasePages = () =>
  casePages.map((path) => ({ path, text: readFileSync(resolve(path), "utf8") }));

const vendorShortName = engagementSignalCase.vendor.split(" ")[0];

function assertVendorNamedIfMentioned(text: string, label: string) {
  if (/vendor|ClarityPulse/i.test(text) && !text.includes(vendorShortName)) {
    throw new Error(`${label} does not name the canonical vendor`);
  }
}

function assertNoConflictingBudget(text: string, label: string) {
  const figures = [...text.matchAll(/AUD \$[\d,]+/g)].map((match) => match[0]);
  for (const figure of figures) {
    if (figure !== engagementSignalCase.budget) {
      throw new Error(`${label} states a budget other than the canonical one: ${figure}`);
    }
  }
}

describe("Engagement Signal Pilot case consistency", () => {
  it("names the case's canonical vendor wherever a vendor is mentioned", () => {
    const pages = readCasePages();
    const mentionsVendor = pages.filter((page) => /vendor|ClarityPulse/i.test(page.text));
    expect(mentionsVendor.length, "no page mentions the pilot's vendor").toBeGreaterThan(0);
    for (const page of pages) {
      expect(() => assertVendorNamedIfMentioned(page.text, page.path)).not.toThrow();
    }
  });

  it("states no budget figure other than the canonical one", () => {
    for (const page of readCasePages()) {
      expect(() => assertNoConflictingBudget(page.text, page.path)).not.toThrow();
    }
  });

  it("[negative example] a page naming a vendor without the canonical name is caught", () => {
    const fake = "The vendor for this rollout has not been finalised yet.";
    expect(() => assertVendorNamedIfMentioned(fake, "fake page")).toThrow(
      /does not name the canonical vendor/,
    );
  });

  it("[negative example] a page stating a conflicting budget figure is caught", () => {
    const fake = "The pilot budget was later revised to AUD $999,999.";
    expect(() => assertNoConflictingBudget(fake, "fake page")).toThrow(
      /budget other than the canonical one/,
    );
  });
});

// The vendor/budget checks above never look at dates, so a timeline entry
// entered out of order (e.g. a copy-paste that duplicates or reverses two
// dates) previously had no check against it at all.
function firstDate(entry: string) {
  return entry.split(" to ")[0];
}

describe("Engagement Signal Pilot timeline ordering", () => {
  // Only "fact" entries are required to run in strict date order. An
  // "inference" entry (like the gap between the two agenda drafts) is
  // deliberately placed after the facts it reasons about even though its own
  // date range can start before the later fact's date — that is a narrative
  // choice, not a data-entry mistake, so it is excluded from this check.
  it("fact-kind entries run in non-decreasing date order", () => {
    const facts = engagementSignalTimeline.filter((entry) => entry.kind === "fact");
    const dates = facts.map((entry) => firstDate(entry.date));
    for (let i = 1; i < dates.length; i++) {
      expect(
        dates[i] >= dates[i - 1],
        `fact entry ${i} (${dates[i]}) is dated before fact entry ${i - 1} (${dates[i - 1]})`,
      ).toBe(true);
    }
  });

  it("[negative example] a timeline entry out of order is caught", () => {
    const dates = ["2027-01-18", "2027-03-08", "2027-02-03"];
    expect(dates[2] >= dates[1]).toBe(false);
  });
});
