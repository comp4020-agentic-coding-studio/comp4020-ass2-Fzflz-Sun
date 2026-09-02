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

  it("the simulator's default time budget mechanically enforces the same limit", () => {
    const windowMatch = componentSource.match(/windowHours\s*=\s*(\d+)/);
    const costMatch = componentSource.match(/contactCostHours\s*=\s*(\d+)/);
    expect(windowMatch, "no default windowHours found").not.toBeNull();
    expect(costMatch, "no default contactCostHours found").not.toBeNull();
    const windowHours = Number(windowMatch![1]);
    const contactCost = Number(costMatch![1]);
    expect(Math.floor(windowHours / contactCost)).toBe(MAX_SELF_INITIATED_CONTACTS);
  });

  it("[negative example] a looser cost-per-contact would silently allow more contacts", () => {
    const looserCost = 20;
    expect(Math.floor(72 / looserCost)).not.toBe(MAX_SELF_INITIATED_CONTACTS);
  });
});
