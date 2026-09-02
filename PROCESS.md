# Process overview — working evidence

<!-- TEMPLATE: These are agent-assisted evidence notes, not the student's final
     process narrative. Keep this draft marker until the student has replaced
     the notes with their own account and reviewed its citations. -->

> Snapshot: 3 September 2026 (AEST), against commit
> [7433cd3](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Fzflz-Sun/commit/7433cd39021bccb5f073d9a96b44df904613bd9e).
> The working tree was clean before this documentation edit. This is an
> evidence index, not a submission-ready personal account. Under [CLAUDE.md](CLAUDE.md)
> and the [assignment brief](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/assessments/assignment-2/),
> the final 400–600-word narrative must be written by the student.

## Design position to develop in the narrative

The design discussion moved from broad workplace unwritten rules to a narrower
question: how decisions form through invitations, agendas, private conversations
and records. The student questioned whether assigned roles would generate real
pressure or merely encourage superficial acting. The proposed response was to
model responsibilities, information, constraints and dependencies rather than
personalities. This discussion supplies motivation; the commits below establish
what was actually implemented, not whether students have successfully used it.

## Traceable implementation

[da715b6](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Fzflz-Sun/commit/da715b6fd9bbf384b150f501155600f72ffff55d)
introduced a general working harness: preview, inspect rendered pages, read
failures, and check before pushing. Its presence records intended practice; it
does not prove that every commit passed validation.

[5ade0a8](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Fzflz-Sun/commit/5ade0a806babdb5dc8b48505ae8c10e2374858a4)
added four mechanical requirements before the course implementation: retain the
allocated `700` suffix, provide weeks 1–12, link a non-starter deck, and total
assessment weights to 100%. The week-number assertion does not itself validate
dates; the inherited data-integrity test checks their presence and teaching-period
bounds.

[7433cd3](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Fzflz-Sun/commit/7433cd39021bccb5f073d9a96b44df904613bd9e)
implemented a representative slice of **SLOP4700, The Meeting Before the Meeting**:
the homepage, Week 3 session and lecture, a 13-slide agenda deck, three assessment
briefs, the Alignment Lab guide, a contact simulator and six downloadable templates.
It is not a completed twelve-week course.

That same commit translated the simulation design into four functional role
cards with six required fields. It separated the public hot-desking example from
the confidential assessed scenario and separated the Lab's 45% course weight
from its internal 20/20/15/35/10 breakdown. Only 15% of the Lab's internal mark is
shared; the rest concerns individual evidence. The guide rejects scoring by
negotiation victory and includes continuity and alternative-participation rules.

The course-specific harness and tests protect role-field completeness, scoring
metadata and a limited set of case facts. Negative examples exercise missing
fields, duplicate roles, altered weights and conflicting figures. These checks
do not establish pedagogical fairness, believable motivations or effective
student participation; those remain human-review questions.

## Student review supplied during this audit

The student provided this feedback after the repository inspection, not as part
of the earlier implementation commit:

> 目前的话，我感觉内容肯定还是不够的，只有到第三周的内容。不过整体网页的框架已经出来了，这个基本上不错，可以继续朝着这个方向深入

In substance, this accepts the current website framework and direction while
explicitly withholding acceptance of the course's content completeness. The
next priority is to deepen and extend the teaching material beyond the current
slice. This feedback does not claim a particular viewport, interaction test or
automated check was personally verified.

## Verification performed during this audit

These results were obtained by the agent on 3 September, after the implementation
commit; they are not evidence of earlier student testing.

- `pnpm check`: type checking reported **0 errors, 0 warnings and 0 hints**.
  The production build generated **22 pages**. It reported no broken internal
  links or deck-structure violations. Accessibility results reused cached checks
  for all 22 unchanged pages, rather than constituting a fresh visual review.
- The specification suite reported **21 passed, 1 failed**. The failure is
  `runs across twelve dated teaching weeks`: the built week set is `[1, 2, 3]`.
  The initial sandboxed run could not start Astro's local font service; an
  authorised rerun reached the build and specification results above.
- `pnpm check:evidence` failed on remaining starter content, four unchanged
  starter images and the unfinished process document. Its original fictitious
  example citations have now been replaced with real commits. The draft marker
  remains intentionally until the student's narrative is written.

## Limits to resolve before making stronger claims

Weeks 1–2, policies, people entries and the Week 1 deck still contain starter
material; Weeks 4–12 are only an outline. Browser interaction, mobile readability,
real classroom use and deployment were not verified in this audit.

The single-source claim in `CLAUDE.md` is stronger than the implementation:
`spec/case-consistency.test.ts` scans only three Week 3 source files for vendor
mentions and formatted budget figures. It does not enforce imports or validate
all people, dates or rendered pages. The contact-limit test similarly reads
source defaults rather than exercising the browser. Record these as initial,
narrow safeguards, not complete consistency or usability guarantees.

The full role data is not all rendered as readable HTML, and several downloadable
templates omit fields required by the Lab guide. Fiction framing and reading
attribution also need review. These are remaining review findings, not fixes
performed by this documentation change.

## Student-authored account still needed

Use the evidence above to write one connected narrative, rather than submitting
this checklist. In particular:

- Explain why practical, constrained decision-making was preferable to a broad
  workplace-advice course or a performance-based role play.
- Identify which harness rules were personally accepted and why; distinguish
  structural guarantees from judgements deliberately left to human review.
- Describe what was actually inspected, rejected or changed, with the relevant
  commit and genuine before/after evidence. Do not infer personal verification
  from the existence of a test or from an agent's report.

Retain the useful commit links, update the status after further work, and remove
the draft marker only when the final account is genuinely the student's own.
