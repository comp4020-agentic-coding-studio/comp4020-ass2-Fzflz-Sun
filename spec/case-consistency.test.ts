import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { engagementSignalCase } from "../src/data/case-facts";

const casePages = [
  "src/content/sessions/03-the-agenda-is-an-argument.md",
  "src/content/lectures/week-03.md",
  "src/decks/week-03.deck.mdx",
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
