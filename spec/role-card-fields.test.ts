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
