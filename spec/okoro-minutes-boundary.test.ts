import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Week 6's minutes excerpt records that Okoro raised a phase-order question
// tied to frontline consultation, before the sequence was confirmed — but it
// does NOT record his specific reasoning (the public-facing-hours argument),
// how the chair responded, or whether that reasoning affected the final
// decision. A past drift had Week 8 and Week 10 overstate what the excerpt
// hides: Week 8 said the question "got minuted as though it hadn't been
// asked", and Week 10 said later readers have "no way to know Sanjay Okoro
// asked a question" and called the question itself "exactly as invisible" as
// a compressed record could make it. Both claims are wrong in the same way —
// the raising of the question is documented; only its grounds, the
// discussion, and the response are not. These tests read Week 6's minutes,
// Week 8's lecture and session, and Week 10's lecture and session together
// and protect that specific boundary.

const week6Session = readFileSync(
  resolve("src/content/sessions/06-silence-is-a-position-sometimes.md"),
  "utf8",
);
const week8Lecture = readFileSync(resolve("src/content/lectures/week-08.md"), "utf8");
const week8Session = readFileSync(
  resolve("src/content/sessions/08-dissent-without-disappearing.md"),
  "utf8",
);
const week10Lecture = readFileSync(resolve("src/content/lectures/week-10.md"), "utf8");
const week10Session = readFileSync(
  resolve("src/content/sessions/10-minutes-make-memory.md"),
  "utf8",
);

describe("Week 6's minutes excerpt records that a question was raised, not its grounds or the response", () => {
  it("the excerpt names Okoro asking about phase order and frontline consultation", () => {
    expect(week6Session).toMatch(
      /Sanjay Okoro asked whether frontline staff would/i,
    );
  });

  it("the excerpt does not itself state Okoro's reasoning or the chair's response", () => {
    expect(week6Session).not.toMatch(/public-facing hours/i);
    expect(week6Session).toMatch(/nothing\s*\nbetween it and "confirmed as presented" is/i);
  });
});

describe("Week 8 does not claim the question itself was minuted out of existence", () => {
  it("the lecture's transcript-vs-minutes table calls the phase-order question a documented fact", () => {
    expect(week8Lecture).toMatch(/\*\*documented fact\*\*: that a phase-order question was raised/i);
  });

  it("the lecture no longer says the question got minuted as though it hadn't been asked", () => {
    expect(week8Lecture).not.toMatch(/got minuted as though it hadn't been asked/i);
  });

  it("the lecture instead frames the loss as the reasoning and the response, not the question's existence", () => {
    expect(week8Lecture).toMatch(/what's lost is \*why\* he raised it/i);
  });

  it("the session table also marks the phase-order question itself as documented", () => {
    expect(week8Session).toMatch(
      /\*\*documented\*\*: a phase-order question, tied to frontline consultation, was raised/i,
    );
  });

  it("[negative example] the old claim reproduces the error this test set catches", () => {
    const oldClaim =
      "only that a real question went unanswered and got minuted as though it hadn't been asked.";
    expect(oldClaim).toMatch(/got minuted as though it hadn't been asked/i);
  });
});

describe("Week 10 does not claim later readers have no way to know a question was asked", () => {
  it("the lecture says a later reader CAN see that Okoro raised a question", () => {
    expect(week10Lecture).toMatch(
      /can see that Sanjay\s*\nOkoro raised a phase-order question/i,
    );
  });

  it("the lecture says what a later reader CANNOT see is the reasoning, the discussion, and whether it was addressed", () => {
    expect(week10Lecture).toMatch(/What they cannot see is his specific reasoning/i);
  });

  it("the lecture no longer says readers have 'no way to know' a question was asked at all", () => {
    expect(week10Lecture).not.toMatch(
      /have no way to know Sanjay Okoro asked a question/i,
    );
  });

  it("the lecture no longer calls the raising of the question itself 'exactly as invisible' as a full gap", () => {
    expect(week10Lecture).not.toMatch(
      /exactly as invisible to that later reading as Okoro's unanswered\s*\nquestion/i,
    );
    expect(week10Lecture).toMatch(/exactly as invisible to that later reading as Okoro's\s*\nspecific reasoning/i);
  });

  it("the session's reveal framing doesn't contradict this — it only names consequence rules, not the Okoro minutes claim", () => {
    expect(week10Session).not.toMatch(/no way to know/i);
    expect(week10Session).not.toMatch(/invisible/i);
  });

  it("[negative example] the old lecture wording reproduces the overstated claim", () => {
    const oldWording =
      "They have no way to know Sanjay Okoro asked a question that never got answered";
    expect(oldWording).toMatch(/have no way to know Sanjay Okoro asked a question/i);
  });
});
