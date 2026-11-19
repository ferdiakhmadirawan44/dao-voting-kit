// ---------------------------------------------------------------------------
// DAO Voting Kit — Results PDF (Chapter 05: Laporan / Report)
// The printable voting report for one proposal: the verdict, the tally,
// the quorum math, the per-day vote timeline and the what-if analysis.
// Printed from the SAME proposal file as the emails, the voting page, the
// dashboard, the certificates and the share card — the proposal ID on
// this report is the proposal ID on all of them, so a printed report can
// never disagree with the dashboard on a member's screen.
// ---------------------------------------------------------------------------

import {
  Column,
  Divider,
  Document,
  Heading,
  PageNumber,
  Row,
  Text,
  token,
} from "@hyper-elements/react";
import {
  defaultData,
  formatIntId,
  formatPct1,
  formatUsdc,
  participationPct,
  peakDay,
  quorumRequired,
  totalVotes,
  type DaoData,
} from "./data.js";
import {
  BatikBand,
  ChapterMark,
  OutcomePill,
  ProofStrip,
  ProposalBadge,
  QuorumBar,
  SampleNote,
  TallyTable,
  VoteTimelineRows,
  WhatIfBlock,
} from "./shared.js";
import { C, MONO_FONT, PRINT_FONT, PRINT_FONTS, daoTheme } from "./theme.js";

export interface ResultsPdfProps {
  data?: DaoData;
}

function ResultsPdf({ data = defaultData }: ResultsPdfProps) {
  const dao = data.dao;
  const p = data.proposal;
  const total = totalVotes(data);
  const required = quorumRequired(data);
  const peak = peakDay(data);
  return (
    <Document
      theme={daoTheme}
      fonts={PRINT_FONTS}
      title={`DAO Voting Kit — Hasil ${p.id} (${dao.name}, ${total} suara)`}
      size="A4"
      orientation="portrait"
      lang="id"
      style={{ fontFamily: PRINT_FONT, fontSize: 13 }}
    >
      {/* ================= Page 1: the verdict ================= */}
      <Document.Page style={{ gap: 14 }}>
        <Column
          style={{ backgroundColor: C.navy, borderRadius: 10, padding: 20, gap: 8 }}
        >
          <Row style={{ gap: 12, alignItems: "center" }}>
            <Text style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 800, letterSpacing: 3 }}>
              NUSANTARA DAO
            </Text>
            <ProposalBadge data={data} />
          </Row>
          <BatikBand width={480} height={14} color={C.goldBright} />
          <Heading level={1} style={{ color: "#FFFFFF" }}>
            Hasil Voting / Voting Results
          </Heading>
          <Text style={{ color: "#FFFFFF", fontSize: 13 }}>
            {p.titleId} · {p.titleEn}
          </Text>
        </Column>

        <ChapterMark n={5} />

        <Column style={{ gap: 8, alignItems: "center" }}>
          <OutcomePill data={data} />
          <Text style={{ fontSize: 14, fontWeight: 700, textAlign: "center" }}>
            {formatIntId(data.tally.forVotes)} Setuju vs {formatIntId(data.tally.againstVotes)}{" "}
            Tidak Setuju · {formatUsdc(p.amountUsdc)} dialokasikan / allocated
          </Text>
        </Column>

        <Column style={{ gap: 8 }}>
          <Heading level={2}>Tally final / Final tally</Heading>
          <TallyTable data={data} />
        </Column>

        <Column style={{ gap: 8 }}>
          <Heading level={2}>Kuorum &amp; partisipasi / Quorum &amp; participation</Heading>
          <QuorumBar data={data} barWidth={440} />
          <Text>
            Partisipasi / Participation: {formatPct1(participationPct(data), "id")} (
            {formatIntId(total)} dari / of {formatIntId(data.voting.members)} anggota) ·
            Kuorum / Quorum: {formatIntId(required)} suara / votes
          </Text>
        </Column>

        <Divider style={{ borderTop: { width: 1, style: "solid", color: token("colors.border") } }} />
        <Text style={{ fontSize: 11, color: token("colors.muted"), textAlign: "center" }}>
          Page <PageNumber /> of <PageNumber total /> · Proposal {p.id} · {dao.name} · Voting{" "}
          {data.voting.startLabelId} — {data.voting.endLabelId}
        </Text>
      </Document.Page>

      {/* ================= Page 2: timeline, what-if, proof ================= */}
      <Document.Page style={{ gap: 12 }}>
        <Column style={{ gap: 8 }}>
          <Heading level={2}>Linimasa suara / Vote timeline</Heading>
          <Text style={{ color: token("colors.muted") }}>
            Suara per hari, 15–21 Nov 2026. Jumlah per hari sama dengan tally final. / Votes
            per day, 15–21 Nov 2026. The daily split sums to the final tally.
          </Text>
          <VoteTimelineRows data={data} />
          <Text style={{ fontSize: 12, color: token("colors.muted") }}>
            Hari tersibuk / Busiest day: {peak.labelId} —{" "}
            {peak.forVotes + peak.againstVotes + peak.abstainVotes} suara / votes. Tidak ada
            suara pada hari penutupan 22 Nov / No votes on closing day, 22 Nov.
          </Text>
        </Column>

        <WhatIfBlock data={data} />

        <Column style={{ gap: 8 }}>
          <Heading level={3}>Satu proposal, satu suara / One proposal, one vote</Heading>
          <ProofStrip data={data} />
        </Column>

        <Divider style={{ borderTop: { width: 1, style: "solid", color: token("colors.border") } }} />
        <SampleNote data={data} />
        <Text style={{ fontSize: 11, color: token("colors.muted"), textAlign: "center" }}>
          Page <PageNumber /> of <PageNumber total /> · {data.source} · Proposal {p.id}
        </Text>
      </Document.Page>
    </Document>
  );
}

// Props for `npx hyper-elements check/render` (the template renders its
// sample data when no props are given).
export default Object.assign(ResultsPdf, { PreviewProps: {} });
