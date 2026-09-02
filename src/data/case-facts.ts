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
      "desks every day for three years.",
    constraint:
      "The desk-booking software the university already owns cannot handle " +
      "hot-desking without a paid upgrade nobody has budgeted for.",
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
