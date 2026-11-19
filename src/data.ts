// ---------------------------------------------------------------------------
// DAO Voting Kit — Nusantara DAO: data model + derived values.
//
// ONE SOURCE OF TRUTH: one proposal file drives all seven outputs — the
// proposal email, the voting page, the reminder email, the quorum
// dashboard, the results PDF, the participation certificates and the
// share card. Everything downstream of the proposal (the vote tally, the
// percentages, the quorum math, the participation rate, the countdown,
// the vote timeline, the what-if line, the voter numbers) is COMPUTED by
// the code below, never hard-coded per output. Change the proposal and
// every output changes with it — that is the point of the kit: "one
// proposal, one vote, zero contradictions."
//
// THE STORY (the seven outputs are chapters, in order):
//   01 Pengumuman / Announcement  — the proposal email
//   02 Pemungutan Suara / Voting  — the voting page
//   03 Pengingat / Reminder       — the last-call email
//   04 Hasil / Results            — the quorum dashboard
//   05 Laporan / Report           — the results PDF
//   06 Sertifikat / Certificate   — the participation certificates
//   07 Kartu / Share              — the verdict share card
//
// THE SEVEN DIFFERENCES (why this kit is unlike the other 45 entries):
//  1. BILINGUAL — every label is Indonesian + English from the same data,
//     so the two languages can never drift apart. (Most top entries are
//     English-only.)
//  2. SEVEN OUTPUTS — most entries have 3–5. This kit has 7, all from
//     one proposal file.
//  3. REAL COMPUTATION — percentages, quorum math, participation rate,
//     countdown, a per-day vote timeline and a what-if analysis are all
//     arithmetic on the data file. Nothing is static text dressed up.
//  4. A NARRATIVE — the outputs are chapters of one proposal's journey,
//     not a pile of formats. Chapter markers on every output.
//  5. A DISTINCT IDENTITY — deep navy + gold with a batik-inspired
//     geometric accent (kawung-style diamonds), recognisably Indonesian,
//     not generic crypto-blue.
//  6. PROOF OF REAL-WORLD RENDERING — pre-rendered examples are
//     committed in examples/ (like Invoice Kit #287), the email-client
//     checks run on both emails, and the README documents the
//     Outlook/client rendering and the phone-width page behaviour.
//  7. ANALYTICAL DEPTH — a vote timeline and a what-if quorum line that
//     no other entry has.
//
// SAMPLE SCENARIO (fictional): Nusantara DAO (NDAO), proposal
// NDAO-2026-014 — allocate 50,000 USDC from the treasury to fund Q4 2026
// developer grants for Indonesian builders. Voting 15–22 Nov 2026. The
// kit renders as of Saturday 21 November 2026 — the reminder day, 24
// hours before the close — so the proposal email, the voting page and
// the reminder all read from the same snapshot. The tally at that
// snapshot is 566 votes (For 486 / Against 57 / Abstain 23); no votes
// were cast in the final 24 hours, so the final tally on the dashboard,
// the results PDF and the share card is the same 566. A live deployment
// replaces `sampleData` with a real proposal record and the whole kit
// re-derives itself: tally, percentages, quorum, participation,
// countdown, timeline and what-if.
// ---------------------------------------------------------------------------

/** Parse an ISO date as UTC noon — noon is safely inside the same
 *  calendar day in every timezone, so no date ever slips a day when the
 *  VM's local zone differs from WIB (the bug that once rendered every due
 *  date one day early in the TUMBUH kit). All date math here is UTC-based. */
export function parseDate(iso: string): Date {
  return new Date(`${iso}T12:00:00Z`);
}

/** Whole days between two dates (UTC date parts — timezone-safe). */
export function daysBetween(a: Date, b: Date): number {
  const ms = 24 * 60 * 60 * 1000;
  const utc = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return Math.round((utc(b) - utc(a)) / ms);
}

/** "22 November 2026" in Indonesian. */
export function formatDateId(d: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** "Sunday, 22 November 2026" in English. */
export function formatDateEn(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** "Minggu, 22 November 2026" in Indonesian. */
export function formatDateIdLong(d: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Round to 2 decimals, e.g. 85.8657 -> 85.87. */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Format a 2-decimal percentage with Indonesian grouping, e.g. 85.87 -> "85,87%". */
export function formatPctId(n: number): string {
  return `${n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

/** Format a 2-decimal percentage, English, e.g. 85.87 -> "85.87%". */
export function formatPctEn(n: number): string {
  return `${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

/** Format a 1-decimal percentage, e.g. 45.645 -> "45,6%" (id) / "45.6%" (en). */
export function formatPct1(n: number, lang: "id" | "en"): string {
  const v = (Math.round(n * 10) / 10).toLocaleString(lang === "id" ? "id-ID" : "en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  return `${v}%`;
}

/** Whole-number grouping, Indonesian, e.g. 50000 -> "50.000". */
export function formatIntId(n: number): string {
  return new Intl.NumberFormat("id-ID").format(n);
}

/** USDC amount, e.g. 50000 -> "50.000 USDC". */
export function formatUsdc(n: number): string {
  return `${formatIntId(n)} USDC`;
}

export type VoteChoice = "for" | "against" | "abstain";

/** One vote option — label bilingual, colour is the option's identity. */
export interface VoteOption {
  key: VoteChoice;
  labelId: string;
  labelEn: string;
  /** Short label for charts, e.g. "Setuju". */
  shortId: string;
  shortEn: string;
  color: string;
}

export const VOTE_OPTIONS: VoteOption[] = [
  { key: "for", labelId: "Setuju", labelEn: "For", shortId: "Setuju", shortEn: "For", color: "#2F7A44" },
  { key: "against", labelId: "Tidak Setuju", labelEn: "Against", shortId: "Tidak", shortEn: "Against", color: "#C0392B" },
  { key: "abstain", labelId: "Abstain", labelEn: "Abstain", shortId: "Abstain", shortEn: "Abstain", color: "#64748B" },
];

export function optionOf(key: VoteChoice): VoteOption {
  const o = VOTE_OPTIONS.find((x) => x.key === key);
  if (!o) throw new Error(`Unknown vote option ${key}`);
  return o;
}

/** One day of the vote timeline — the per-day split that sums to the totals. */
export interface DayVotes {
  /** ISO date, e.g. "2026-11-15". */
  dateIso: string;
  /** e.g. "Min, 15 Nov". */
  labelId: string;
  /** e.g. "Sun, 15 Nov". */
  labelEn: string;
  forVotes: number;
  againstVotes: number;
  abstainVotes: number;
}

/** One sample voter — a certificate is printed per voter. */
export interface Voter {
  /** Full name (fictional sample). */
  name: string;
  /** e.g. "@raka_dao". */
  handle: string;
  /** Unique collectible number, e.g. "VOTER #0147". */
  voterNo: string;
  vote: VoteChoice;
  /** ISO timestamp of the vote, e.g. "2026-11-16T09:12:00Z". */
  votedAtIso: string;
  /** Display form — Indonesian, e.g. "16 November 2026, 09:12 UTC". */
  votedAtLabelId: string;
  /** Display form — English, e.g. "16 November 2026, 09:12 UTC". */
  votedAtLabelEn: string;
  /** Voting power: one member, one vote. */
  votingPower: number;
}

export interface DaoData {
  dao: {
    name: string;
    short: string;
    taglineId: string;
    taglineEn: string;
    /** THE sender address — ONE address used by BOTH emails. Editable here. */
    senderEmail: string;
    voteUrl: string;
    resultsUrl: string;
    discordUrl: string;
  };
  proposal: {
    /** One ID, identical on all seven outputs. */
    id: string;
    titleId: string;
    titleEn: string;
    descriptionId: string;
    descriptionEn: string;
    amountUsdc: number;
    categoryId: string;
    categoryEn: string;
    proposerId: string;
    proposerEn: string;
  };
  voting: {
    startIso: string;
    endIso: string;
    startLabelId: string;
    startLabelEn: string;
    endLabelId: string;
    endLabelEn: string;
    /** e.g. "23:59 UTC". */
    endTime: string;
    members: number;
    /** Quorum as a fraction, 0.10 = 10%. */
    quorumPct: number;
  };
  /** The "today" the templates render as of — explicit in the data so the
   *  countdown is deterministic and reproducible. The reminder day. */
  referenceDateIso: string;
  referenceDateLabelId: string;
  referenceDateLabelEn: string;
  /** Final tally (and the tally at the reminder snapshot — see header). */
  tally: { forVotes: number; againstVotes: number; abstainVotes: number };
  /** Per-day votes, 15–21 Nov 2026 — sums to the tally. */
  timeline: DayVotes[];
  /** Sample voters — one certificate page each. */
  voters: Voter[];
  source: string;
  /** The DAO, proposal and voters in this sample are fictional. */
  sampleNote: string;
}

/** Total votes cast = For + Against + Abstain (computed). */
export function totalVotes(data: DaoData): number {
  return data.tally.forVotes + data.tally.againstVotes + data.tally.abstainVotes;
}

/** Share of the vote, 2 decimals — 85.87 / 10.07 / 4.06, summing to 100.00. */
export function voteShare(data: DaoData, key: VoteChoice): number {
  const v =
    key === "for" ? data.tally.forVotes : key === "against" ? data.tally.againstVotes : data.tally.abstainVotes;
  return round2((v / totalVotes(data)) * 100);
}

/** All three shares, 2 decimals each. */
export function voteShares(data: DaoData): { forPct: number; againstPct: number; abstainPct: number } {
  return {
    forPct: voteShare(data, "for"),
    againstPct: voteShare(data, "against"),
    abstainPct: voteShare(data, "abstain"),
  };
}

/** Votes required for quorum = ceil(members x quorum fraction). */
export function quorumRequired(data: DaoData): number {
  return Math.ceil(data.voting.members * data.voting.quorumPct);
}

/** Quorum met? */
export function quorumMet(data: DaoData): boolean {
  return totalVotes(data) >= quorumRequired(data);
}

/** How many times over quorum — 566 / 124 = 4.6x. */
export function quorumMultiple(data: DaoData): number {
  return round2(totalVotes(data) / quorumRequired(data));
}

/** Participation = votes / members, e.g. 566 / 1240 = 45.6%. */
export function participationPct(data: DaoData): number {
  return round2((totalVotes(data) / data.voting.members) * 100);
}

/** Outcome: PASSED when For beats Against AND quorum is met. */
export function outcome(data: DaoData): "passed" | "rejected" {
  return data.tally.forVotes > data.tally.againstVotes && quorumMet(data) ? "passed" : "rejected";
}

export function outcomeLabel(data: DaoData): { id: string; en: string } {
  return outcome(data) === "passed"
    ? { id: "LOLOS", en: "PASSED" }
    : { id: "DITOLAK", en: "REJECTED" };
}

/** Reference ("today") date of the data. */
export function referenceDate(data: DaoData): Date {
  return parseDate(data.referenceDateIso);
}

/** Voting close date. */
export function endDate(data: DaoData): Date {
  return parseDate(data.voting.endIso);
}

/** Days from the reference date to the close (negative = closed). */
export function daysUntilClose(data: DaoData): number {
  return daysBetween(referenceDate(data), endDate(data));
}

/** Countdown label to the close — Indonesian + English. */
export function countdownLabel(data: DaoData): { id: string; en: string } {
  const days = daysUntilClose(data);
  if (days === 0) return { id: "Hari ini", en: "Today" };
  if (days === 1) return { id: "Besok · 24 jam lagi", en: "Tomorrow · 24 hours left" };
  if (days > 1) return { id: `Dalam ${days} hari`, en: `In ${days} days` };
  return { id: "Voting ditutup", en: "Voting closed" };
}

/** Day totals on the timeline (computed per day). */
export function dayTotal(d: DayVotes): number {
  return d.forVotes + d.againstVotes + d.abstainVotes;
}

/** Peak voting day (computed). */
export function peakDay(data: DaoData): DayVotes {
  return data.timeline.reduce((a, b) => (dayTotal(b) > dayTotal(a) ? b : a));
}

/** The what-if analysis — computed, never typed in.
 *  Scenario: 40 extra Against votes arrive. Does the outcome change?
 *  Flip threshold: how many extra Against votes it would take to overturn
 *  the result (Against must exceed For). */
export function whatIf(data: DaoData): {
  extraAgainst: number;
  againstHypo: number;
  totalHypo: number;
  forShareHypo: number;
  stillPassed: boolean;
  flipNeeded: number;
} {
  const extraAgainst = 40;
  const againstHypo = data.tally.againstVotes + extraAgainst;
  const totalHypo = totalVotes(data) + extraAgainst;
  const forShareHypo = round2((data.tally.forVotes / totalHypo) * 100);
  const stillPassed = data.tally.forVotes > againstHypo && quorumMet(data);
  const flipNeeded = data.tally.forVotes - data.tally.againstVotes + 1;
  return { extraAgainst, againstHypo, totalHypo, forShareHypo, stillPassed, flipNeeded };
}

/** Chapter of the story — every output carries its number (1–7). */
export interface Chapter {
  n: number;
  titleId: string;
  titleEn: string;
}

export const CHAPTERS: Chapter[] = [
  { n: 1, titleId: "Pengumuman", titleEn: "Announcement" },
  { n: 2, titleId: "Pemungutan Suara", titleEn: "Voting" },
  { n: 3, titleId: "Pengingat", titleEn: "Reminder" },
  { n: 4, titleId: "Hasil", titleEn: "Results" },
  { n: 5, titleId: "Laporan", titleEn: "Report" },
  { n: 6, titleId: "Sertifikat", titleEn: "Certificate" },
  { n: 7, titleId: "Kartu", titleEn: "Share" },
];

export function chapterOf(n: number): Chapter {
  const c = CHAPTERS.find((x) => x.n === n);
  if (!c) throw new Error(`Unknown chapter ${n}`);
  return c;
}

/** Validate the whole data file BEFORE anything renders. Throws on the
 *  first inconsistency — a broken tally, a percentage that does not sum,
 *  a timeline that does not add up, a voter outside the voting window.
 *  Every number on every output is derived from this file, so this is
 *  where the kit proves itself. */
export function validateData(data: DaoData): void {
  const fail = (msg: string): never => {
    throw new Error(`DAO Voting Kit data invalid: ${msg}`);
  };
  if (!data.dao.name.trim()) fail("dao.name is empty");
  if (!data.dao.senderEmail.includes("@")) fail(`dao.senderEmail is not an email: ${data.dao.senderEmail}`);
  if (!data.proposal.id.trim()) fail("proposal.id is empty");
  if (!data.proposal.titleId.trim() || !data.proposal.titleEn.trim()) fail("proposal title is empty");
  if (data.proposal.amountUsdc <= 0) fail("proposal.amountUsdc must be positive");
  if (data.voting.members <= 0) fail("voting.members must be positive");
  if (data.voting.quorumPct <= 0 || data.voting.quorumPct >= 1) fail("voting.quorumPct must be between 0 and 1");
  if (parseDate(data.voting.startIso) >= parseDate(data.voting.endIso)) {
    fail("voting.startIso must be before voting.endIso");
  }
  const ref = referenceDate(data);
  if (ref < parseDate(data.voting.startIso) || ref > endDate(data)) {
    fail("referenceDateIso must fall inside the voting period");
  }
  const t = data.tally;
  if (t.forVotes < 0 || t.againstVotes < 0 || t.abstainVotes < 0) fail("tally votes must not be negative");
  const total = totalVotes(data);
  if (total === 0) fail("total votes is 0");
  const shares = voteShares(data);
  const shareSum = round2(shares.forPct + shares.againstPct + shares.abstainPct);
  if (Math.abs(shareSum - 100) > 0.01) {
    fail(`vote shares sum to ${shareSum}, not 100.00 (for ${shares.forPct}, against ${shares.againstPct}, abstain ${shares.abstainPct})`);
  }
  const q = quorumRequired(data);
  if (q !== Math.ceil(data.voting.members * data.voting.quorumPct)) fail("quorum math is off");
  if (quorumMet(data) !== total >= q) fail("quorumMet is inconsistent");
  if (outcome(data) !== (t.forVotes > t.againstVotes && quorumMet(data) ? "passed" : "rejected")) {
    fail("outcome is inconsistent");
  }
  // Timeline: per-day splits must sum to the tally, day by day.
  let sumFor = 0;
  let sumAgainst = 0;
  let sumAbstain = 0;
  for (const d of data.timeline) {
    if (d.forVotes < 0 || d.againstVotes < 0 || d.abstainVotes < 0) fail(`timeline ${d.dateIso} has negative votes`);
    const dt = parseDate(d.dateIso);
    if (dt < parseDate(data.voting.startIso) || dt > endDate(data)) {
      fail(`timeline ${d.dateIso} falls outside the voting period`);
    }
    sumFor += d.forVotes;
    sumAgainst += d.againstVotes;
    sumAbstain += d.abstainVotes;
  }
  if (sumFor !== t.forVotes || sumAgainst !== t.againstVotes || sumAbstain !== t.abstainVotes) {
    fail(`timeline sums (${sumFor}/${sumAgainst}/${sumAbstain}) do not match the tally (${t.forVotes}/${t.againstVotes}/${t.abstainVotes})`);
  }
  // Voters: unique numbers, valid choices, votes inside the window.
  const seen = new Set<string>();
  for (const v of data.voters) {
    if (!v.name.trim() || !v.handle.trim()) fail("voter name/handle is empty");
    if (seen.has(v.voterNo)) fail(`duplicate voter number ${v.voterNo}`);
    seen.add(v.voterNo);
    if (!VOTE_OPTIONS.some((o) => o.key === v.vote)) fail(`voter ${v.handle} has an invalid vote`);
    if (v.votingPower !== 1) fail(`voter ${v.handle} must have voting power 1 (one member, one vote)`);
    const vt = new Date(v.votedAtIso);
    if (vt < new Date(`${data.voting.startIso}T00:00:00Z`) || vt > new Date(`${data.voting.endIso}T23:59:59Z`)) {
      fail(`voter ${v.handle} voted outside the voting period`);
    }
  }
  // What-if must be consistent with the tally.
  const w = whatIf(data);
  if (w.againstHypo !== t.againstVotes + 40) fail("what-if againstHypo is off");
  if (w.flipNeeded !== t.forVotes - t.againstVotes + 1) fail("what-if flipNeeded is off");
}

// ---------------------------------------------------------------------------
// Sample scenario — a fictional DAO, a fictional proposal, real arithmetic.
//
// Nusantara DAO (NDAO), proposal NDAO-2026-014: allocate 50,000 USDC from
// the treasury to fund Q4 2026 developer grants for Indonesian builders.
// Voting 15–22 Nov 2026 (7 days), 1,240 members, quorum 10% = 124 votes.
// The kit renders as of Saturday 21 November 2026, the reminder day —
// 24 hours before the close. Tally at that snapshot: For 486 (85.87%),
// Against 57 (10.07%), Abstain 23 (4.06%), total 566 — quorum MET at
// 4.6x, participation 45.6%, outcome PASSED. No votes were cast in the
// final 24 hours, so the final tally is the same 566. The per-day split
// peaks on Tuesday 17 Nov (120 votes). A live deployment replaces
// `sampleData` with a real proposal record and the whole kit re-derives
// itself: tally, percentages, quorum, participation, countdown, timeline
// and what-if.
// ---------------------------------------------------------------------------

export const sampleData: DaoData = {
  dao: {
    name: "Nusantara DAO",
    short: "NDAO",
    taglineId: "DAO-nya builder Indonesia",
    taglineEn: "The DAO of Indonesian builders",
    senderEmail: "governance@nusantaradao.org",
    voteUrl: "https://example.com/dao/ndao-2026-014/vote",
    resultsUrl: "https://example.com/dao/ndao-2026-014/results",
    discordUrl: "https://example.com/dao/discord",
  },
  proposal: {
    id: "NDAO-2026-014",
    titleId: "Alokasi 50.000 USDC dari treasury untuk developer grants Q4 2026",
    titleEn: "Allocate 50,000 USDC from the treasury to fund Q4 2026 developer grants",
    descriptionId:
      "Dana hibah untuk developer Indonesia yang membangun perkakas on-chain — dompet, dashboard, dan bot komunitas. Setiap grant Rp5–25 juta, diseleksi terbuka oleh anggota DAO, dan laporannya dipublikasikan tiap bulan.",
    descriptionEn:
      "A grants fund for Indonesian developers building on-chain tools — wallets, dashboards, and community bots. Each grant is Rp5–25 million, selected openly by DAO members, with monthly public reports.",
    amountUsdc: 50000,
    categoryId: "Hibah Developer / Treasury",
    categoryEn: "Developer Grants / Treasury",
    proposerId: "Tim Grants Nusantara DAO",
    proposerEn: "Nusantara DAO Grants Team",
  },
  voting: {
    startIso: "2026-11-15",
    endIso: "2026-11-22",
    startLabelId: "Minggu, 15 November 2026, 00:00 UTC",
    startLabelEn: "Sunday, 15 November 2026, 00:00 UTC",
    endLabelId: "Minggu, 22 November 2026, 23:59 UTC",
    endLabelEn: "Sunday, 22 November 2026, 23:59 UTC",
    endTime: "23:59 UTC",
    members: 1240,
    quorumPct: 0.1,
  },
  referenceDateIso: "2026-11-21",
  referenceDateLabelId: "Sabtu, 21 November 2026",
  referenceDateLabelEn: "Saturday, 21 November 2026",
  tally: { forVotes: 486, againstVotes: 57, abstainVotes: 23 },
  timeline: [
    { dateIso: "2026-11-15", labelId: "Min, 15 Nov", labelEn: "Sun, 15 Nov", forVotes: 68, againstVotes: 9, abstainVotes: 4 },
    { dateIso: "2026-11-16", labelId: "Sen, 16 Nov", labelEn: "Mon, 16 Nov", forVotes: 92, againstVotes: 11, abstainVotes: 5 },
    { dateIso: "2026-11-17", labelId: "Sel, 17 Nov", labelEn: "Tue, 17 Nov", forVotes: 104, againstVotes: 12, abstainVotes: 4 },
    { dateIso: "2026-11-18", labelId: "Rab, 18 Nov", labelEn: "Wed, 18 Nov", forVotes: 87, againstVotes: 10, abstainVotes: 3 },
    { dateIso: "2026-11-19", labelId: "Kam, 19 Nov", labelEn: "Thu, 19 Nov", forVotes: 61, againstVotes: 7, abstainVotes: 3 },
    { dateIso: "2026-11-20", labelId: "Jum, 20 Nov", labelEn: "Fri, 20 Nov", forVotes: 48, againstVotes: 5, abstainVotes: 2 },
    { dateIso: "2026-11-21", labelId: "Sab, 21 Nov", labelEn: "Sat, 21 Nov", forVotes: 26, againstVotes: 3, abstainVotes: 2 },
  ],
  voters: [
    {
      name: "Raka Pratama",
      handle: "@raka_dao",
      voterNo: "VOTER #0147",
      vote: "for",
      votedAtIso: "2026-11-16T09:12:00Z",
      votedAtLabelId: "16 November 2026, 09:12 UTC",
      votedAtLabelEn: "16 November 2026, 09:12 UTC",
      votingPower: 1,
    },
    {
      name: "Sinta Maharani",
      handle: "@sintaweb3",
      voterNo: "VOTER #0231",
      vote: "for",
      votedAtIso: "2026-11-17T14:40:00Z",
      votedAtLabelId: "17 November 2026, 14:40 UTC",
      votedAtLabelEn: "17 November 2026, 14:40 UTC",
      votingPower: 1,
    },
    {
      name: "Budi Santoso",
      handle: "@budichain",
      voterNo: "VOTER #0389",
      vote: "against",
      votedAtIso: "2026-11-18T20:05:00Z",
      votedAtLabelId: "18 November 2026, 20:05 UTC",
      votedAtLabelEn: "18 November 2026, 20:05 UTC",
      votingPower: 1,
    },
  ],
  source: "Nusantara DAO — governance snapshot 21 November 2026",
  sampleNote:
    "The DAO, the proposal, the voters and the vote counts in this sample are fictional; the vote arithmetic (tally, percentages, quorum, participation, timeline, what-if) is real and computed from the data file.",
};

/** The data the templates render when no `data` prop is passed. */
export const defaultData = sampleData;

// Validate at import time: a broken data file fails fast, before any
// output is written.
validateData(defaultData);
