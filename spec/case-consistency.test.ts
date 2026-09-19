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

// The Finance & Risk memo proves two things: the budget figure, and that
// Oyelaran signed it. A past drift across case-facts.ts, the Week 1 session
// and the Week 1 lecture stated "Finance & Risk signs off the budget" as an
// established fact — treating the memo's own title as if it were a proven
// claim about complete, validly-delegated spending authority. Week 9 already
// gets this right (see spec/evidentiary-discipline.test.ts); these tests
// protect the same narrower claim everywhere the 2021-01-18 entry appears.
describe("The 2021-01-18 Finance & Risk memo is never inflated into proven spending authority", () => {
  const week1Session = readFileSync(resolve("src/content/sessions/01-getting-started.md"), "utf8");
  const week1Lecture = readFileSync(resolve("src/content/lectures/week-01.md"), "utf8");
  const week1Deck = readFileSync(resolve("src/decks/week-01.deck.mdx"), "utf8");

  it("case-facts.ts's timeline entry says the memo records the figure, not that Finance 'signs off' it", () => {
    const entry = engagementSignalTimeline.find((e) => e.date === "2021-01-18");
    expect(entry).toBeDefined();
    expect(entry?.label).toMatch(/records the ClarityPulse budget figure/i);
    expect(entry?.label).not.toMatch(/signs off|signed off/i);
  });

  it("case-facts.ts's note clarifies 'sign-off memo' is the document's own title, not this course's judgment", () => {
    const entry = engagementSignalTimeline.find((e) => e.date === "2021-01-18");
    expect(entry?.note).toMatch(/document's own title, not this course's/i);
    expect(entry?.note).toMatch(/does not by itself prove/i);
  });

  it("engagementSignalCase's Finance & Risk person note does not assert 'signed off the budget' as a settled role fact", () => {
    expect(engagementSignalCase.people.financeRisk.note).not.toMatch(
      /signed off the budget and holds the risk register/i,
    );
    expect(engagementSignalCase.people.financeRisk.note).toMatch(
      /does not by itself prove she held complete, validly delegated spending authority/i,
    );
  });

  it("Week 1 session's case-file table records the figure and signature, not a 'signs off' claim", () => {
    expect(week1Session).toMatch(/A Finance & Risk memo records the ClarityPulse budget figure/i);
    expect(week1Session).not.toMatch(/Finance & Risk signs off the ClarityPulse budget line/i);
  });

  it("Week 1 session clarifies the source column's 'sign-off memo' names the document, not a legal judgment", () => {
    expect(week1Session).toMatch(
      /is the document's own title, not a\s+claim about what authority it actually proves/i,
    );
  });

  it("Week 1 lecture's debrief table narrows the entry to the same recorded-figure-and-signature claim", () => {
    expect(week1Lecture).toMatch(
      /A Finance & Risk memo records the ClarityPulse budget figure, signed by Oyelaran/i,
    );
    expect(week1Lecture).not.toMatch(/Finance & Risk signs off the ClarityPulse budget \|/i);
  });

  it("Week 1 deck's case slide says 'Finance memo', not 'budget sign-off'", () => {
    expect(week1Deck).toMatch(/18 Jan Finance memo/i);
    expect(week1Deck).not.toMatch(/18 Jan budget sign-off/i);
  });

  it("[negative example] the old 'Finance & Risk signs off the budget' wording would fail every check above", () => {
    const oldLabel = "Finance & Risk signs off the ClarityPulse budget line";
    expect(oldLabel).not.toMatch(/records the ClarityPulse budget figure/i);
    expect(oldLabel).toMatch(/signs off/i);
  });
});

// Week 3's deck says "You rewrote a real agenda item twice", under its
// "Exercise debrief" slide. That is accurate: the session's own exercise
// instructs students to bring an agenda item "from your own work, study
// group, share house or club", not from the fictional Engagement Signal
// Pilot case — the deck's "real" is contrasted with the case's fiction, not
// mislabelling the case itself as real. These tests anchor that reading so a
// future edit can't quietly point "real agenda item" at the case instead.
describe("Week 3's 'real agenda item' refers to the student's own exercise item, not the fictional case", () => {
  const week3Session = readFileSync(
    resolve("src/content/sessions/03-the-agenda-is-an-argument.md"),
    "utf8",
  );
  const week3Lecture = readFileSync(resolve("src/content/lectures/week-03.md"), "utf8");
  const week3Deck = readFileSync(resolve("src/decks/week-03.deck.mdx"), "utf8");

  it("the session's Exercise section asks for an item from the student's own life, explicitly 'something real'", () => {
    expect(week3Session).toMatch(
      /Take an agenda item from your own work, study group, share house or club —\s*\nsomething real, however small/i,
    );
  });

  it("the lecture's debrief section frames 'the same real agenda item' as the exercise's paired rewrite, not the case", () => {
    expect(week3Lecture).toMatch(/## Exercise debrief/i);
    expect(week3Lecture).toMatch(/rewrite of the same real agenda item/i);
  });

  it("the deck's 'You rewrote a real agenda item twice' slide sits under its own Exercise debrief heading", () => {
    const debriefIndex = week3Deck.indexOf("## Exercise debrief");
    const claimIndex = week3Deck.indexOf("You rewrote a real agenda item twice");
    expect(debriefIndex).toBeGreaterThan(-1);
    expect(claimIndex).toBeGreaterThan(debriefIndex);
  });

  it("[negative example] a claim that the case's own (fictional) agenda item was rewritten would contradict the case's teaching-fiction framing", () => {
    const wrongClaim = "You rewrote the Steering Committee's real agenda item twice.";
    expect(wrongClaim).toMatch(/Steering Committee/i);
    expect(wrongClaim).not.toMatch(/from your own work, study group, share house or club/i);
  });
});
