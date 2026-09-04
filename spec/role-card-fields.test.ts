import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { hotDeskingRoleCards, type RoleCard } from "../src/data/case-facts";

const REQUIRED_FIELDS: (keyof RoleCard)[] = [
  "publicResponsibility",
  "uniqueEvidence",
  "constraint",
  "leverageOrDependency",
  "minimumAcceptableOutcome",
  "conditionToShiftPosition",
];

const ARCHETYPES = [
  "Executive Sponsor",
  "Delivery Lead",
  "Finance and Risk Lead",
  "Staff Representative",
];

function assertRoleCardComplete(card: RoleCard) {
  for (const field of REQUIRED_FIELDS) {
    const value = card[field];
    if (!value || value.length === 0) {
      throw new Error(`${card.archetype}.${field} is empty`);
    }
  }
}

function assertCoversEachArchetypeOnce(cards: RoleCard[]) {
  const archetypes = cards.map((card) => card.archetype);
  if (new Set(archetypes).size !== archetypes.length) {
    throw new Error("an archetype appears more than once");
  }
  if ([...archetypes].sort().join() !== [...ARCHETYPES].sort().join()) {
    throw new Error("the four archetypes are not exactly the required set");
  }
}

describe("Alignment Lab role cards", () => {
  it("covers all four archetypes exactly once", () => {
    expect(() => assertCoversEachArchetypeOnce(hotDeskingRoleCards)).not.toThrow();
  });

  it("gives every role card all six required fields, non-empty", () => {
    for (const card of hotDeskingRoleCards) {
      expect(() => assertRoleCardComplete(card)).not.toThrow();
    }
  });

  it("[negative example] a role card missing a required field is caught", () => {
    const broken: RoleCard = { ...hotDeskingRoleCards[0], constraint: "" };
    expect(() => assertRoleCardComplete(broken)).toThrow(/constraint is empty/);
  });

  it("[negative example] a duplicated archetype is caught", () => {
    const broken = [hotDeskingRoleCards[0], hotDeskingRoleCards[0], ...hotDeskingRoleCards.slice(2)];
    expect(() => assertCoversEachArchetypeOnce(broken)).toThrow(/more than once/);
  });

  it("[negative example] a missing archetype is caught", () => {
    const broken = hotDeskingRoleCards.slice(1);
    expect(() => assertCoversEachArchetypeOnce(broken)).toThrow(/exactly the required set/);
  });
});

describe("Alignment Lab role cards, as actually rendered on the built page", () => {
  // The data-level checks above passed even while the page only rendered 3 of
  // 6 fields in a table, because they never looked at the rendered HTML. This
  // is the check that catches that class of bug: the "fully revealed" claim
  // on /alignment-lab/ is only true if every field, for every archetype,
  // actually appears in the built output.
  const FIELD_LABELS = [
    "Public responsibility",
    "Evidence only this role holds",
    "Constraint they cannot trade away",
    "Leverage or dependency over the others",
    "Minimum acceptable outcome",
    "Condition that would shift their position",
  ];

  const renderedPage = readFileSync(resolve("dist/alignment-lab/index.html"), "utf8");

  it("renders every archetype name", () => {
    for (const archetype of ARCHETYPES) {
      expect(renderedPage, `${archetype} not found on the rendered page`).toContain(archetype);
    }
  });

  it("renders all six role-card field labels, once per archetype", () => {
    for (const label of FIELD_LABELS) {
      const occurrences = renderedPage.split(label).length - 1;
      expect(
        occurrences,
        `expected "${label}" to appear once per archetype (${ARCHETYPES.length}), found ${occurrences}`,
      ).toBeGreaterThanOrEqual(ARCHETYPES.length);
    }
  });

  it("[negative example] a table rendering only half the fields would fail this check", () => {
    const partialPageFixture = FIELD_LABELS.slice(0, 3).join(" ").repeat(ARCHETYPES.length);
    const missingLabel = FIELD_LABELS[5];
    expect(partialPageFixture.split(missingLabel).length - 1).toBeLessThan(ARCHETYPES.length);
  });
});
