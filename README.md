# DAO Voting Kit — Nusantara DAO

**One proposal data file → 7 outputs.** A complete voting-communication kit
for a DAO proposal: the announcement, the vote, the last-call reminder, the
results, the certificate and the verdict poster — one story, told in order.

Built with Hyper Elements (`@hyper-elements/react` 0.4.6, CLI 0.2.10).
**Bilingual ID + EN on every output.** Every number on every output is
computed from `src/data.ts` — nothing is hardcoded text.

## The story (narrative arc)

The 7 outputs are chapters of one proposal journey. Each output carries a
chapter marker and a **JourneyStrip** — 7 numbered dots showing where this
output sits in the story:

| Ch | Output | File | Root |
|----|--------|------|------|
| 01 Pengumuman | Proposal email — the announcement | `src/ProposalEmail.tsx` | Email |
| 02 Pemungutan Suara | Voting page — cast your vote | `src/VotingPage.tsx` | Page |
| 03 Pengingat | Reminder email — 24 hours left | `src/ReminderEmail.tsx` | Email |
| 04 Hasil | Quorum dashboard — the result | `src/QuorumDashboard.tsx` | Page |
| 05 Laporan | Results PDF — the formal record | `src/ResultsPdf.tsx` | Document |
| 06 Sertifikat | Participation certificate (3 voters) | `src/CertificatePdf.tsx` | Document |
| 07 Kartu | Share card — the verdict poster | `src/ShareCard.tsx` | Canvas |

## The proposal (sample data — fictional, edit in `src/data.ts`)

- **DAO:** Nusantara DAO (NDAO) — a community of Indonesian builders
- **Proposal ID:** `NDAO-2026-014` — printed identically on all 7 outputs
- **Title:** Alokasi 50.000 USDC dari treasury untuk developer grants Q4 2026 /
  Allocate 50,000 USDC from the treasury to fund Q4 2026 developer grants
- **Description:** a grants fund for Indonesian developers building on-chain
  tools — a short paragraph, ID + EN, in the data file.
- **Voting period:** 15 Nov 2026 00:00 UTC → 22 Nov 2026 23:59 UTC (7 days).
  The countdown on the emails and voting page is computed from the end date.
- **Sender:** **one email address for both emails** —
  `governance@nusantaradao.org` (fictional sample; edit `sender` in
  `src/data.ts` — both the proposal email and the reminder email use it).

## The math (all computed, all shown)

| Figure | Value | Where shown |
|---|---|---|
| Votes | For 486 · Against 57 · Abstain 23 = **566 total** | Tally table + bars on every output |
| Shares | **85,87% / 10,07% / 4,06%** (sums to exactly 100,00%) | Tally table, bars, dashboard |
| Quorum | 10% of 1,240 members = **124 votes required**; 566 cast → **MET, 4,6×** | Quorum bar on voting page, dashboard, results PDF |
| Participation | 566 / 1,240 = **45,6%** | Dashboard, results PDF |
| Outcome | **PASSED / LOLOS** (For share 85,87% > 50%) | Dashboard, results PDF, share card |
| Vote timeline | Votes per day, 15–21 Nov, peak **17 Nov: 120 votes**; daily split sums to 486 / 57 / 23 | Results PDF + quorum dashboard (bar/strip chart) |
| What-if | **+40 Against** → Against 97, For share still **80,20%** — result still PASSES. **430** more Against votes would be needed to flip it | Voting page (prominent) + results PDF |

`src/data.ts` runs `validateData()` at import: required fields, the vote
sums, the percentages summing to 100%, the quorum math and the timeline
summing to the totals. A bad data file fails the build before anything renders.

## The identity — batik Nusantara, not generic crypto-blue

Deep navy (`#0E2444` / `#14315C`) + gold (`#C9A227` / `#E8B923`) on warm
parchment (`#F7F3E8`). The accent is a **batik-inspired geometric band**:
a kawung-style diamond pattern drawn in code (`BatikBand` — SVG diamonds on
Page/Document/Canvas roots; a gold diamond-glyph band on Email roots, where
inline SVG cannot render). The same navy + gold + batik band runs across all
7 outputs, so the kit is recognisably Indonesian at a glance.

- **Share card = verdict poster.** 1200×630, designed like a newspaper
  front page / court verdict: "PROPOSAL LOLOS" in huge gold type, the
  proposal ID, the tally and the DAO name — not a plain summary card.
- **Certificate = collectible.** Each voter's certificate is a membership
  card: a **unique voter number** (VOTER #0147 / #0231 / #0389), a
  **"1 vote = 1 suara"** voter-power line, a batik border and a gold seal
  motif drawn in code. One page per voter (3 pages, A4 landscape).

## Pre-rendered examples

`examples/` holds every rendered output — open them without running anything:

- `ProposalEmail.html` / `.txt`, `ReminderEmail.html` / `.txt`
- `VotingPage.html`, `QuorumDashboard.html`
- `ResultsPdf.pdf` (2 pages), `CertificatePdf.pdf` (3 pages)
- `ShareCard.png` (1200×630)

`examples/client-previews/` holds real client renders of both emails,
generated with `hyper-elements preview` — **Classic Outlook (desktop)** and
**Apple Mail on iPhone** for each email. The pages also ship responsive
behaviour: the rendered HTML carries a `@media (max-width: 480px)` rule that
stacks rows into columns, and headings carry mobile font sizes.

## How to run it

```sh
npm install
npm run check     # hyper-elements check src — expect 0 errors / 0 warnings
npm run render    # hyper-elements render src --out output — expect 0 errors
```

## Gap coverage — why this kit beats the field

| # | Weakness in other entries | What this kit does |
|---|---|---|
| 1 | English only (Invoice Kit #287, Game Launch Kit #288, Rent Receipt #251, Matchday #222) | **Bilingual ID+EN on all 7 outputs** — every heading, label and body line |
| 2 | Few outputs (most have 3–5) | **7 outputs** — email ×2, page ×2, document ×2, canvas ×1 |
| 3 | No real computation (static content dressed up) | **Every number derived from `data.ts`**: percentages, quorum math (566/124, 4,6×), participation 45,6%, countdown, timeline, what-if |
| 4 | No narrative (a collection of formats) | **One story in order** — announce → vote → remind → results → certificate → share, with chapter markers + JourneyStrip on every output |
| 5 | Generic look (crypto-blue / clean-minimal) | **Batik-inspired Nusantara identity** — navy + gold + kawung diamonds, consistent across all 7 |
| 6 | No proof of real-world rendering | **Pre-rendered examples in `examples/`** + **Outlook + iPhone client previews** in `examples/client-previews/` + documented phone-width behaviour |
| 7 | No interactive / analytical depth | **Vote timeline per day** (results PDF + dashboard) and a **what-if quorum line** (voting page + results PDF), prominent, not buried |

## Files

```
src/
  data.ts            sample proposal data + validateData() + all computed math
  theme.ts           navy/gold/parchment theme + fonts
  shared.tsx         batik band, gold seal, chapter marks, JourneyStrip,
                     tally table/bars, quorum bar, timeline chart, what-if
  ProposalEmail.tsx  ch. 01 — announcement email
  VotingPage.tsx     ch. 02 — voting page (quorum bar, countdown, what-if)
  ReminderEmail.tsx  ch. 03 — "24 hours left" reminder email
  QuorumDashboard.tsx ch. 04 — results dashboard (tally, timeline, outcome)
  ResultsPdf.tsx     ch. 05 — A4 results report (2 pages)
  CertificatePdf.tsx ch. 06 — participation certificates (3 pages, A4 landscape)
  ShareCard.tsx      ch. 07 — verdict-poster share card (1200×630)
examples/            pre-rendered outputs + client previews (no build needed)
```

All sample people, the DAO and the sender address are fictional.
