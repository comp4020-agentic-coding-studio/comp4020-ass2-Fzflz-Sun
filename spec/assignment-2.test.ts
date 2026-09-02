import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

interface CourseApi {
  course: { code: string };
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
const nodesOfType = (type: string) => api.nodes.filter((node) => node.type === type);

describe("assignment 2 spec", () => {
  it("keeps the three digits the repo was provisioned with", () => {
    expect(api.course.code).toMatch(/^SLOP[123468]700$/);
  });

  it("runs across twelve dated teaching weeks", () => {
    const weeks = nodesOfType("sessions")
      .map((node) => node.meta?.week)
      .sort((a, b) => Number(a) - Number(b));
    expect(weeks).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("has at least one lecture with a real deck linked from its page", () => {
    const withSlides = nodesOfType("lectures").filter((node) => node.meta?.slides);
    expect(withSlides.length, "no lecture links a deck via `slides:`").toBeGreaterThan(0);

    const realDecks = withSlides.filter((node) => {
      const slug = String(node.meta?.slides).replace(/^\/decks\/|\/$/g, "");
      const deckPath = resolve(`src/decks/${slug}.deck.mdx`);
      if (!existsSync(deckPath)) return false;
      return !readFileSync(deckPath, "utf8").includes("STARTER_CONTENT");
    });
    expect(realDecks.length, "every linked deck is still the starter placeholder").toBeGreaterThan(
      0,
    );
  });

  it("weights its assessments to add up to 100%", () => {
    const total = nodesOfType("assessments").reduce(
      (sum, node) => sum + Number(node.meta?.weight ?? 0),
      0,
    );
    expect(total).toBe(100);
  });
});
