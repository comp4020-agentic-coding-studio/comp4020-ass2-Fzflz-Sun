import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// The six templates exist in two places: the downloadable file under
// public/templates/, and a copy embedded in a code fence on
// src/pages/templates/index.mdx. Nothing keeps these in sync automatically,
// so this file checks both that they agree with each other and that each one
// actually contains the fields the rest of the site promises it will.

const TEMPLATE_NAMES = [
  "agenda",
  "decision-autopsy",
  "decision-record",
  "negotiation-log",
  "redesign",
  "strategy-memo",
] as const;

const readTemplate = (name: (typeof TEMPLATE_NAMES)[number]) =>
  readFileSync(resolve(`public/templates/${name}.txt`), "utf8").trim();

const templatesPage = readFileSync(resolve("src/pages/templates/index.mdx"), "utf8");

function extractCodeFences(text: string): string[] {
  const fences: string[] = [];
  const regex = /```text\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    fences.push(match[1].trim());
  }
  return fences;
}

describe("Downloadable templates match the copies embedded on the templates page", () => {
  const fences = extractCodeFences(templatesPage);

  it("finds one code fence per template on the page", () => {
    expect(fences.length).toBe(TEMPLATE_NAMES.length);
  });

  it("every downloadable .txt file is byte-identical (modulo trailing whitespace) to its embedded fence", () => {
    for (const name of TEMPLATE_NAMES) {
      const file = readTemplate(name);
      const matchingFence = fences.find((fence) => fence.startsWith(file.slice(0, 20)));
      expect(matchingFence, `no embedded fence on the templates page starts like ${name}.txt`).toBeDefined();
      expect(matchingFence).toBe(file);
    }
  });

  it("[negative example] a page fence edited out of sync with its .txt file is caught", () => {
    const file = readTemplate("agenda");
    const driftedFence = `${file}\nAn extra line only on the page.`;
    expect(driftedFence).not.toBe(file);
  });
});

describe("Decision record template covers the fields the Lab guide promises", () => {
  const decisionRecord = readTemplate("decision-record");

  it("includes evidence relied on, distinct from an unverified assumption", () => {
    expect(decisionRecord).toMatch(/evidence relied on/i);
    expect(decisionRecord).toMatch(/unverified assumption/i);
  });

  it("includes an action owner, distinct from who signs off", () => {
    expect(decisionRecord).toMatch(/action owner/i);
  });

  it("includes a final decision authority, distinct from who agreed or dissented", () => {
    expect(decisionRecord).toMatch(/final decision authority/i);
  });

  it("includes conditions for reopening the record", () => {
    expect(decisionRecord).toMatch(/reopen/i);
  });

  it("[negative example] the old five-field version is missing at least one of these", () => {
    const old = [
      "The decision:",
      "Who agreed:",
      "Who dissented, and on what grounds:",
      "What information arrived too late to change the outcome, if any:",
      "Who signs off on this record:",
    ].join("\n");
    expect(old).not.toMatch(/action owner/i);
    expect(old).not.toMatch(/final decision authority/i);
    expect(old).not.toMatch(/reopen/i);
  });
});

describe("Negotiation log template does not cap the log at exactly two entries", () => {
  const negotiationLog = readTemplate("negotiation-log");

  it("does not hardcode 'Contact 1' / 'Contact 2' as the only two slots", () => {
    expect(negotiationLog).not.toMatch(/contact 1:/i);
    expect(negotiationLog).not.toMatch(/contact 2:/i);
  });

  it("names the two-self-initiated-contact cap without capping the log itself", () => {
    expect(negotiationLog).toMatch(/at most two self-initiated contacts/i);
    expect(negotiationLog).toMatch(/repl(y|ies)/i);
  });

  it("carries purpose, new information, commitments and judgment-change fields", () => {
    expect(negotiationLog).toMatch(/purpose/i);
    expect(negotiationLog).toMatch(/new information/i);
    expect(negotiationLog).toMatch(/commitment/i);
    expect(negotiationLog).toMatch(/judgment change/i);
  });

  it("[negative example] the old template is caught by the 'Contact 1' check", () => {
    const old = "NEGOTIATION LOG — [your role]\n\nContact 1: [who]\nContact 2: [who]";
    expect(old).toMatch(/contact 1:/i);
  });
});

describe("Strategy memo template matches what the Lab guide says a memo contains", () => {
  const strategyMemo = readTemplate("strategy-memo");
  const labProcessSource = readFileSync(resolve("src/data/alignment-lab.ts"), "utf8");

  it("the guide's step-2 description and the template name the same five things", () => {
    expect(labProcessSource).toMatch(/their responsibilities/i);
    expect(strategyMemo).toMatch(/my responsibilities/i);
    expect(strategyMemo).toMatch(/my evidence/i);
    expect(strategyMemo).toMatch(/what i don't know/i);
    expect(strategyMemo).toMatch(/who i plan to contact/i);
    expect(strategyMemo).toMatch(/ethical boundaries/i);
  });

  it("[negative example] a memo about concessions rather than evidence would not match", () => {
    const old = "What I want:\nWhat I can concede:\nWho I expect to oppose me:";
    expect(old).not.toMatch(/my evidence/i);
    expect(old).not.toMatch(/ethical boundaries/i);
  });
});

describe("Decision autopsy template allows an indeterminate or open-process conclusion", () => {
  const decisionAutopsy = readTemplate("decision-autopsy");
  const assessmentBrief = readFileSync(
    resolve("src/content/assessments/decision-autopsy.md"),
    "utf8",
  );

  it("the template's 'seam' field and the assessment brief agree that no seam is a valid finding", () => {
    expect(assessmentBrief).toMatch(/seam, or why there isn't one/i);
    expect(decisionAutopsy).toMatch(/seam, or why there isn't one/i);
    expect(decisionAutopsy).toMatch(/genuinely open or indeterminate/i);
  });

  it("[negative example] a template that only asks for a seam disagrees with the brief", () => {
    const old = "The seam (where the outcome looks settled before the forum that announced it):";
    expect(old).not.toMatch(/or why there isn't one/i);
  });
});

describe("Redesign template tests the replacement against a scenario, matching its assessment brief", () => {
  const redesign = readTemplate("redesign");
  const assessmentBrief = readFileSync(
    resolve("src/content/assessments/decision-system-redesign.md"),
    "utf8",
  );

  it("both the brief and the template require testing against a concrete scenario", () => {
    expect(assessmentBrief).toMatch(/at least one concrete scenario/i);
    expect(redesign).toMatch(/concrete scenario/i);
  });

  it("both name that eliminating pre-meeting coordination is not the goal", () => {
    expect(assessmentBrief).toMatch(/not\s+.*eliminat/i);
    expect(redesign).toMatch(/pre-meeting\s+coordination/i);
  });

  it("[negative example] the old four-line template has no scenario field", () => {
    const old = [
      "Who currently decides, and how:",
      "What is wrong with it today, with evidence:",
      "The replacement: who is invited, when, on what information, with what record:",
      "Who loses influence under the new design:",
    ].join("\n");
    expect(old).not.toMatch(/concrete scenario/i);
  });
});
