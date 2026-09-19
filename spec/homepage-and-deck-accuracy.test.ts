import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Two small but conspicuous accuracy fixes: the Week 1 deck overclaimed what
// a primary source guarantees ("tells you what happened", unqualified), and
// the homepage undercounted the repo's own decks (it named only Week 3's,
// though both Week 1 and Week 3 have one). Both are cheap to re-break by a
// later edit that reverts to the shorter, catchier, less accurate phrasing —
// these tests catch that regression directly, with a negative example each.

const week1Deck = readFileSync(resolve("src/decks/week-01.deck.mdx"), "utf8");
const homepage = readFileSync(resolve("src/pages/index.astro"), "utf8");

describe("Week 1 deck's primary-source line doesn't overclaim what a record guarantees", () => {
  it("says a primary source records what a document or participant states happened", () => {
    expect(week1Deck).toMatch(
      /A primary source records what a particular document or participant states\s*\n>?\s*happened/i,
    );
  });

  it("explicitly says it does not itself guarantee the record is complete or true", () => {
    expect(week1Deck).toMatch(/does not itself guarantee the record is complete or true/i);
  });

  it("no longer makes the unqualified claim that a primary source 'tells you what happened'", () => {
    expect(week1Deck).not.toMatch(/A primary source tells you what happened\./i);
  });

  it("[negative example] the old overclaim reproduces the error this test catches", () => {
    const oldLine = "A primary source tells you what happened. It rarely tells you why";
    expect(oldLine).toMatch(/A primary source tells you what happened\./i);
  });
});

describe("Homepage's deck description matches the repo's actual decks (Week 1 and Week 3, not Week 3 alone)", () => {
  it("names both Week 1 and Week 3 as having a slide deck", () => {
    expect(homepage).toMatch(/Weeks 1 and 3 additionally have a slide deck/i);
    expect(homepage).toMatch(/href=\{withBase\("\/lectures\/week-01\/"\)\}/);
    expect(homepage).toMatch(/href=\{withBase\("\/lectures\/week-03\/"\)\}/);
  });

  it("both linked deck files actually exist on disk", () => {
    expect(() => readFileSync(resolve("src/decks/week-01.deck.mdx"), "utf8")).not.toThrow();
    expect(() => readFileSync(resolve("src/decks/week-03.deck.mdx"), "utf8")).not.toThrow();
  });

  it("[negative example] the old wording undercounts the decks to Week 3 alone", () => {
    const oldWording =
      'Week 3 additionally has a slide deck; the Alignment Lab spans Weeks 9 to 11';
    expect(oldWording).toMatch(/Week 3 additionally has a slide deck/i);
    expect(oldWording).not.toMatch(/Week 1/i);
  });
});
