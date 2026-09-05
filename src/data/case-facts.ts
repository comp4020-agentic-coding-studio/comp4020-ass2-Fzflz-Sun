// The single source of truth for the semester-long fictional case.
//
// Every page that mentions the pilot's budget, vendor, sponsor or timeline
// should import these constants rather than retyping the numbers, so the
// case cannot drift out of sync with itself across twelve weeks of material.
// `spec/case-consistency.test.ts` greps the built pages for these exact
// strings and fails if a page states a conflicting figure.

export const engagementSignalCase = {
  name: "The Engagement Signal Pilot",
  organisation: "Slop University",
  pilotUnit: "Library & Student Services (LSS)",
  vendor: "ClarityPulse Analytics",
  budget: "AUD $420,000",
  implementationWeeks: 14,
  people: {
    sponsor: {
      name: "Priya Nandakumar",
      title: "Deputy Vice-Chancellor (Operations)",
      note: "commissioned the pilot and owns the go-live date",
    },
    delivery: {
      name: "Tomas Herrera",
      title: "Director of Digital Delivery",
      note: "runs the implementation and the vendor relationship",
    },
    financeRisk: {
      name: "Beatrix Oyelaran",
      title: "Head of Finance & Risk",
      note: "signed off the budget and holds the risk register",
    },
    staffRep: {
      name: "Sanjay Okoro",
      title: "Staff Association Representative (Professional Staff)",
      note: "elected by professional staff to represent them on the pilot",
    },
    librarian: {
      name: "Dr Femi Adisa",
      title: "University Librarian",
      note: "whose team is the pilot cohort, not a decision-maker on the pilot itself",
    },
    comms: {
      name: "Wren Castellano",
      title: "Internal Communications Lead",
      note: "drafts the announcements the class reads as artefacts",
    },
  },
} as const;

// The Week 1 and Week 2 material both work from this same timeline, rather
// than inventing separate facts. Each entry is tagged with how well-supported
// it is: a "fact" is something a dated document states directly, an
// "inference" is a reasonable reading that still requires a step of
// judgement, and "unknown" marks something the public record does not settle
// either way. Weeks 1 and 2 ask students to sort entries like these; Week 3's
// agenda drafts (below) are themselves two of these documents.
export type EvidenceKind = "fact" | "inference" | "unknown";

export interface TimelineEntry {
  date: string;
  label: string;
  kind: EvidenceKind;
  source: string;
  note: string;
}

export const engagementSignalTimeline: TimelineEntry[] = [
  {
    date: "2027-01-18",
    label: "Finance & Risk signs off the ClarityPulse budget line",
    kind: "fact",
    source: "Finance & Risk sign-off memo, dated and initialled by Beatrix Oyelaran",
    note: "The document states the amount and the signature; it does not state who asked for the sign-off first.",
  },
  {
    date: "2027-01-22",
    label: "Tomas Herrera and ClarityPulse's sales lead meet",
    kind: "fact",
    source: "Calendar entry, both attendees named",
    note: "The meeting happened; no minutes exist, so what was discussed is not part of the public record.",
  },
  {
    date: "2027-01-29",
    label: "A implementation-timeline draft names LSS as the first rollout site",
    kind: "fact",
    source: "Draft project plan, version history shows Tomas Herrera as the only editor",
    note: "The document directly names LSS — that part is a fact. Why LSS was chosen over another unit is a separate question the document does not answer; reasoning toward an answer would be a step of inference, not this entry itself.",
  },
  {
    date: "2027-02-01 to 2027-02-28",
    label: "Dr Femi Adisa's staff first hear the word 'ClarityPulse' at all",
    kind: "unknown",
    source: "No dated document exists confirming when LSS staff were first told",
    note: "Staff say informally it was 'sometime in February'; nothing in the public record fixes a date, so this entry takes the month as a range rather than inventing a single day no document supports.",
  },
  {
    date: "2027-02-10",
    label: "Priya Nandakumar emails the Vice-Chancellery an update naming a go-live term",
    kind: "fact",
    source: "Email, forwarded and time-stamped",
    note: "States the term; does not state whether the term was already fixed before this email or proposed for the first time in it.",
  },
  {
    date: "2027-02-24",
    label: "Sanjay Okoro requests a staff information session before rollout",
    kind: "fact",
    source: "Email from the Staff Association distribution list",
    note: "The request is dated and on the record; whether it was granted is a separate, later question.",
  },
  {
    date: "2027-03-01",
    label: "Wren Castellano drafts Item 4 as an open question (Draft B)",
    kind: "fact",
    source: "Draft agenda file, timestamped, never circulated",
    note: "The file's own metadata carries this date; it was found afterwards, not sent at the time.",
  },
  {
    date: "2027-03-03",
    label: "Wren Castellano sends Item 4 as a confirmation (Draft A)",
    kind: "fact",
    source: "Sent agenda, distribution list and read receipts",
    note: "This is the version the Steering Committee actually received.",
  },
  {
    date: "2027-03-01 to 2027-03-03",
    label: "Between the two drafts, someone decided the item should read as settled",
    kind: "inference",
    source: "No document names who made this call or why",
    note: "This entry has no document of its own — it is a reading of the gap between Draft B and Draft A, so it gets the gap's date range rather than a false-precise single day. It is the course's central seam: a reasonable inference, not a proven fact. An equally reasonable reading is that the question was genuinely resolved in an earlier, undocumented conversation the drafts simply reflect.",
  },
  {
    date: "2027-03-08",
    label: "The Steering Committee meets and confirms the timeline",
    kind: "fact",
    source: "Meeting minutes, attendance list attached",
    note: "The minutes record what was said in the room; they do not record what any attendee already believed before entering it.",
  },
];

// The Steering Committee invitation list for the 2027-03-08 meeting above.
// Week 2 asks students to read this list along three *independent* axes,
// not one mixed classification:
//
//   1. `participationStatus` — was this seat invited, and did it attend?
//   2. `decisionRight` — what formal right over the outcome, if any, does
//      the seat carry, independent of whether it was even in the room?
//   3. `informationTiming` — when, relative to the decision, does this
//      person actually learn the outcome: before, during (e.g. present in
//      the room as it happens), or only after?
//
// These three answers can combine in any way. Wren Castellano is the clearest
// case: she is invited and attends (participationStatus), holds no vote or
// advisory say over the outcome (decisionRight: "observe"), and yet learns the
// outcome "during" — in real time, in the room — rather than "after," simply
// because she is physically present while it happens. A decision-right
// taxonomy that used a single "informed after" value for both her and
// someone who is genuinely told the outcome later, having never attended
// anything, would erase exactly that distinction — which is why
// "informed after" is an `informationTiming` value only, never a
// `decisionRight` one.
export type ParticipationStatus =
  | "invited-and-attended"
  | "invited-but-absent"
  | "not-invited";

export type DecisionRight = "decide" | "approve" | "vote" | "advise" | "observe" | "none";

export type InformationTiming = "before" | "during" | "after";

export interface InviteEntry {
  name: string;
  title: string;
  participationStatus: ParticipationStatus;
  decisionRight: DecisionRight;
  informationTiming: InformationTiming;
  reasonGiven: string | null;
  note: string;
}

export const engagementSignalInviteList: InviteEntry[] = [
  {
    name: "Priya Nandakumar",
    title: "Deputy Vice-Chancellor (Operations)",
    participationStatus: "invited-and-attended",
    decisionRight: "vote",
    informationTiming: "during",
    reasonGiven: "Chairs the Steering Committee",
    note: "Also the pilot's sponsor — the person who owns the go-live date is also the person chairing the meeting that confirms it.",
  },
  {
    name: "Tomas Herrera",
    title: "Director of Digital Delivery",
    participationStatus: "invited-and-attended",
    decisionRight: "vote",
    informationTiming: "during",
    reasonGiven: "Owns the implementation",
    note: "No stated conflict-of-interest process applies to a delivery lead voting on their own project's timeline.",
  },
  {
    name: "Beatrix Oyelaran",
    title: "Head of Finance & Risk",
    participationStatus: "invited-and-attended",
    decisionRight: "vote",
    informationTiming: "during",
    reasonGiven: "Budget holder",
    note: "",
  },
  {
    name: "Sanjay Okoro",
    title: "Staff Association Representative (Professional Staff)",
    participationStatus: "invited-and-attended",
    decisionRight: "advise",
    informationTiming: "during",
    reasonGiven: "Represents affected professional staff",
    note: "Attends and can speak, but the invitation records no vote for this seat — a distinction the agenda itself does not mention.",
  },
  {
    name: "Dr Femi Adisa",
    title: "University Librarian",
    participationStatus: "not-invited",
    decisionRight: "none",
    informationTiming: "after",
    reasonGiven: null,
    note: "Leads the unit the pilot is rolled out to first. No document states why the Librarian was not invited; the committee's terms of reference name only directorate-level roles as members, which would exclude this seat by default rather than by a specific decision about this pilot.",
  },
  {
    name: "Wren Castellano",
    title: "Internal Communications Lead",
    participationStatus: "invited-and-attended",
    decisionRight: "observe",
    informationTiming: "during",
    reasonGiven: "Drafts the announcement once a decision is made",
    note: "Attends to take notes and prepare comms, not named as holding a vote — present in the room, and so informed *during* the decision rather than after it, without any decision right over its outcome.",
  },
  {
    name: "LSS frontline staff (as a group)",
    title: "The pilot's first cohort",
    participationStatus: "not-invited",
    decisionRight: "none",
    informationTiming: "after",
    reasonGiven: null,
    note: "No individual staff member and no elected staff seat for this specific unit was invited. Sanjay Okoro's seat represents professional staff university-wide, not LSS specifically — whether that counts as representation for this decision is exactly the kind of judgement call this course asks you to make, not assume.",
  },
];

// A small, fully self-contained scenario used only on the Alignment Lab guide
// page as a worked, fully revealed example. It is deliberately unrelated to
// the Engagement Signal Pilot: the real Lab scenario's role cards stay
// confidential (distributed by teaching staff before the workshop), so the
// public site needs a different case to show what a role card looks like.
export const hotDeskingExample = {
  name: "Should the Reading Room move to hot-desking?",
  oneLine:
    "Facilities wants to convert 40 assigned desks in the Reading Room into " +
    "unassigned hot-desks to fit a larger cohort. Staff were not consulted " +
    "before the proposal was drafted.",
} as const;

export interface RoleCard {
  archetype:
    | "Executive Sponsor"
    | "Delivery Lead"
    | "Finance and Risk Lead"
    | "Staff Representative";
  publicResponsibility: string;
  uniqueEvidence: string;
  constraint: string;
  leverageOrDependency: string;
  minimumAcceptableOutcome: string;
  conditionToShiftPosition: string;
}

// Fully revealed, because this is the public worked example, not the graded
// scenario. Every archetype below carries the same six fields a real Lab role
// card carries — `spec/role-card-fields.test.ts` checks that.
export const hotDeskingRoleCards: RoleCard[] = [
  {
    archetype: "Executive Sponsor",
    publicResponsibility:
      "Owns the space-efficiency target the Vice-Chancellery set this year.",
    uniqueEvidence:
      "A utilisation report showing the Reading Room sits at 31% occupancy on " +
      "the average weekday.",
    constraint:
      "Must report a credible plan to the Space Committee within the month, " +
      "or the target rolls onto a directorate that has less room to move.",
    leverageOrDependency:
      "Controls whether the Reading Room gets its requested lighting upgrade " +
      "next year.",
    minimumAcceptableOutcome:
      "Any plan that raises reported utilisation above 50% within two terms.",
    conditionToShiftPosition:
      "Would accept a slower phase-in if it comes with a firm date attached.",
  },
  {
    archetype: "Delivery Lead",
    publicResponsibility:
      "Has to implement whatever the room's new layout turns out to be.",
    uniqueEvidence:
      "A booking-system export showing the same 12 staff have used the same " +
      "desks every day for three years, and — after reading the licence " +
      "terms directly — confirmation that the current software already " +
      "supports named, reserved desks at no extra cost; the paid upgrade is " +
      "only needed for genuine unassigned hot-desking.",
    constraint:
      "The desk-booking software the university already owns cannot handle " +
      "unassigned hot-desking without a paid upgrade nobody has budgeted for.",
    leverageOrDependency:
      "Is the only person in the room who has actually read the booking " +
      "software's licence terms.",
    minimumAcceptableOutcome:
      "A decision that does not commit to a go-live date before the software " +
      "question is answered.",
    conditionToShiftPosition:
      "Would support hot-desking immediately if the software upgrade is " +
      "funded in the same decision.",
  },
  {
    archetype: "Finance and Risk Lead",
    publicResponsibility: "Signs off any spend the room change requires.",
    uniqueEvidence:
      "A comparison showing the software upgrade costs less than a single " +
      "term of the overflow desks Facilities currently rents off-site.",
    constraint:
      "Cannot approve new spend without a proposal that names a specific " +
      "line item, not a category.",
    leverageOrDependency:
      "Any spend over $10,000 needs their sign-off before it can proceed.",
    minimumAcceptableOutcome:
      "A named, costed proposal, even a small one, rather than an in-principle " +
      "agreement to spend later.",
    conditionToShiftPosition:
      "Would fund the upgrade today if it visibly cancels a bigger cost " +
      "elsewhere.",
  },
  {
    archetype: "Staff Representative",
    publicResponsibility:
      "Represents the 12 staff who have used the same desk for years.",
    uniqueEvidence:
      "Three staff have accessibility equipment permanently fitted to their " +
      "current desk that a hot-desk cannot accommodate without notice.",
    constraint:
      "Cannot agree to anything that was not first taken back to the staff " +
      "for comment, or the agreement will not hold.",
    leverageOrDependency:
      "Can escalate to the union if consultation is skipped a second time.",
    minimumAcceptableOutcome:
      "Named, reserved desks for anyone with a documented accessibility need.",
    conditionToShiftPosition:
      "Would support the change once reserved desks are guaranteed in " +
      "writing, not just promised verbally.",
  },
];
