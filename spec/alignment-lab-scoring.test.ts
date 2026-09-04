import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { labScoring, MAX_SELF_INITIATED_CONTACTS } from "../src/data/alignment-lab";

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

interface MarkingCriterion {
  name: string;
  weight: number;
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as {
  nodes: ApiNode[];
};

const alignmentLabAssessment = api.nodes.find(
  (node) => node.type === "assessments" && node.id.endsWith("alignment-lab"),
);

const sumWeights = (criteria: MarkingCriterion[]) =>
  criteria.reduce((sum, c) => sum + c.weight, 0);

describe("Alignment Lab internal scoring, whole-course page vs. canonical data", () => {
  it("finds the built alignment-lab assessment page", () => {
    expect(alignmentLabAssessment, "no assessments node id ends with alignment-lab").toBeDefined();
  });

  it("canonical scoring in src/data/alignment-lab.ts sums to 100", () => {
    expect(sumWeights(labScoring)).toBe(100);
  });

  it("the published assessment's marking criteria match the canonical scoring exactly", () => {
    const criteria = (alignmentLabAssessment?.meta?.marking as { criteria: MarkingCriterion[] })
      .criteria;
    expect(criteria.length).toBe(labScoring.length);
    const byName = new Map(criteria.map((c) => [c.name, c.weight]));
    for (const canonical of labScoring) {
      expect(byName.get(canonical.name), `${canonical.name} missing or renamed on the page`).toBe(
        canonical.weight,
      );
    }
  });

  it("[negative example] a scoring breakdown with an unrebalanced weight fails the sum check", () => {
    const tampered = labScoring.map((c, i) => (i === 0 ? { ...c, weight: c.weight + 1 } : c));
    expect(sumWeights(tampered)).not.toBe(100);
  });

  it("[negative example] a page criterion renamed or reweighted is not silently accepted", () => {
    const tampered: MarkingCriterion[] = labScoring.map((c) => ({ name: c.name, weight: c.weight }));
    tampered[0] = { ...tampered[0], weight: tampered[0].weight - 5 };
    const byName = new Map(tampered.map((c) => [c.name, c.weight]));
    const firstCanonical = labScoring[0];
    expect(byName.get(firstCanonical.name)).not.toBe(firstCanonical.weight);
  });
});

describe("Alignment Lab contact limit, guide page vs. canonical data", () => {
  const guidePage = readFileSync(resolve("src/pages/alignment-lab/index.mdx"), "utf8");
  const componentSource = readFileSync(
    resolve("src/components/ContactSimulator.astro"),
    "utf8",
  );

  it("states the canonical contact limit in words on the guide page", () => {
    expect(guidePage).toMatch(new RegExp(`\\btwo\\b.*self-initiated contacts`, "i"));
    expect(MAX_SELF_INITIATED_CONTACTS).toBe(2);
  });

  it("the simulator's default contact count is imported from canonical data, not hardcoded", () => {
    expect(componentSource).toMatch(
      /import\s*\{\s*MAX_SELF_INITIATED_CONTACTS\s*\}\s*from\s*["']\.\.\/data\/alignment-lab["']/,
    );
    expect(componentSource).toMatch(/maxContacts\s*=\s*MAX_SELF_INITIATED_CONTACTS/);
  });

  it("the simulator no longer encodes the limit as an hours-per-contact proxy", () => {
    expect(componentSource).not.toMatch(/windowHours/);
    expect(componentSource).not.toMatch(/contactCostHours/);
  });

  it("[negative example] a component hardcoding its own contact number would drift silently", () => {
    const drifted = componentSource.replace(
      "maxContacts = MAX_SELF_INITIATED_CONTACTS",
      "maxContacts = 3",
    );
    expect(drifted).not.toMatch(/maxContacts\s*=\s*MAX_SELF_INITIATED_CONTACTS/);
  });

  it("revealing a contact's facts does not depend on how many contacts came before it", () => {
    // Regression test for a fixed bug: the previous implementation indexed into
    // [uniqueEvidence, constraint, leverageOrDependency] by `contacted.size %
    // facts.length`, so a role's uniqueEvidence (index 0) was only ever shown
    // on someone's *first* contact of the session, and was silently skipped
    // whenever a different target was contacted first.
    expect(componentSource).not.toMatch(/contacted\.size\s*%/);
    expect(componentSource).toMatch(/card\.uniqueEvidence/);
    expect(componentSource).toMatch(/card\.constraint/);
  });

  it("the simulator shows the player their own role card after choosing a role", () => {
    expect(componentSource).toMatch(/renderOwnCard/);
    expect(componentSource).toMatch(/Your role card/);
  });

  it("the simulator prompts for a judgment change after every contact", () => {
    expect(componentSource).toMatch(/does what .* change what you'd argue/i);
  });
});
