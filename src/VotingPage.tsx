// ---------------------------------------------------------------------------
// DAO Voting Kit — Voting Page (Chapter 02: Pemungutan Suara / Voting)
// The live voting page: the proposal, the three options with live tallies,
// the quorum progress, the countdown — and the what-if analysis no other
// entry has: what happens if 40 more Against votes arrive, and how many it
// would take to flip the result. Every number is computed from the same
// proposal file as the emails, the dashboard, the results PDF, the
// certificates and the share card.
//
// The page is responsive by design: the theme carries mobile heading
// sizes, the option rows stack, and the bars are fluid — see README for
// the phone-width behaviour.
// ---------------------------------------------------------------------------

import {
  Button,
  Column,
  Divider,
  Heading,
  Page,
  Row,
  Section,
  Span,
  Text,
  token,
} from "@hyper-elements/react";
import {
  countdownLabel,
  defaultData,
  formatIntId,
  formatUsdc,
  quorumRequired,
  totalVotes,
  type DaoData,
} from "./data.js";
import {
  BatikBand,
  Bi,
  ChapterMark,
  ProofStrip,
  ProposalBadge,
  QuorumBar,
  SampleNote,
  TallyBars,
  WhatIfBlock,
} from "./shared.js";
import { C, MONO_FONT, daoTheme } from "./theme.js";

export interface VotingPageProps {
  data?: DaoData;
}

function VotingPage({ data = defaultData }: VotingPageProps) {
  const dao = data.dao;
  const p = data.proposal;
  const count = countdownLabel(data);
  const total = totalVotes(data);
  const required = quorumRequired(data);
  return (
    <Page
      theme={daoTheme}
      title={`${dao.name} — Vote: ${p.id} ${p.titleId}`}
      lang="id"
      style={{ gap: 0 }}
    >
      {/* ---- Masthead ---- */}
      <Section
        tokens={{ colors: { background: C.navy, foreground: "#FFFFFF" } }}
        style={{ backgroundColor: C.navy, padding: [32, 0, 28, 0], gap: 18 }}
      >
        <Row style={{ gap: 14, alignItems: "center" }}>
          <Column style={{ gap: 2 }}>
            <Text
              style={{
                fontSize: 34,
                fontWeight: 800,
                lineHeight: 1.15,
                color: "#FFFFFF",
                letterSpacing: 3,
              }}
            >
              NUSANTARA DAO
            </Text>
            <Text style={{ color: "#E8B923", fontSize: 14 }}>
              {dao.taglineId} · {dao.taglineEn}
            </Text>
          </Column>
        </Row>
        <BatikBand width={1100} height={18} color={C.goldBright} />
        <Row style={{ gap: 16, alignItems: "center" }}>
          <ProposalBadge data={data} />
          <Text style={{ color: "#FFFFFF", fontSize: 13, fontFamily: MONO_FONT, flex: 1 }}>
            {p.categoryId} · {formatUsdc(p.amountUsdc)}
          </Text>
        </Row>
      </Section>

      {/* ---- Body ---- */}
      <Section style={{ padding: [28, 0, 8, 0], gap: 24 }}>
        <Column style={{ apply: ["card"] }}>
          <ChapterMark n={2} />
          <Heading level={1}>
            {p.titleId} / {p.titleEn}
          </Heading>
          <Text>{p.descriptionId}</Text>
          <Text>{p.descriptionEn}</Text>
          <Text style={{ fontSize: 13, color: token("colors.muted") }}>
            Diajukan oleh / Proposed by: {p.proposerId} · {p.proposerEn} · Voting:{" "}
            {data.voting.startLabelId} — {data.voting.endLabelId}
          </Text>
        </Column>

        {/* Live tally */}
        <Column style={{ apply: ["card"] }}>
          <Heading level={2}>Hasil sementara / Live tally</Heading>
          <Text>
            {formatIntId(total)} suara sudah masuk per {data.referenceDateLabelId} /{" "}
            {formatIntId(total)} votes cast as of {data.referenceDateLabelEn}.
          </Text>
          <TallyBars data={data} barWidth={480} />
          <Divider style={{ borderTop: { width: 1, style: "solid", color: token("colors.border") } }} />
          <QuorumBar data={data} barWidth={520} />
        </Column>

        {/* Countdown */}
        <Column style={{ apply: ["card"] }}>
          <Bi id="Hitung mundur" en="Countdown" size={12} bold />
          <Text style={{ fontSize: 26, fontWeight: 800, color: C.goldDark }}>
            {count.id} · {count.en}
          </Text>
          <Text>
            Voting ditutup {data.voting.endLabelId} / Voting closes {data.voting.endLabelEn}
          </Text>
          <Button href={dao.voteUrl}>Vote Sekarang / Vote Now</Button>
        </Column>

        {/* What-if analysis — the analytical depth no other entry has */}
        <WhatIfBlock data={data} />

        {/* How to vote */}
        <Column style={{ apply: ["card"] }}>
          <Heading level={2}>Cara vote / How to vote</Heading>
          <Text>
            1. Hubungkan dompet anggota DAO / Connect your member wallet. 2. Pilih Setuju,
            Tidak Setuju, atau Abstain / Pick For, Against, or Abstain. 3. Tanda tangani
            transaksinya — satu anggota, satu suara, tanpa biaya gas tambahan untuk vote ini. /
            Sign the transaction — one member, one vote, no extra gas for this vote.
          </Text>
          <Text style={{ fontSize: 13, color: token("colors.muted") }}>
            Hasil sementara di atas diperbarui dari data snapshot {data.referenceDateLabelId} /
            The live tally above is rendered from the {data.referenceDateLabelEn} data snapshot.
          </Text>
        </Column>

        {/* Proof strip */}
        <Column style={{ apply: ["card"] }}>
          <Heading level={3}>Satu proposal, satu suara / One proposal, one vote</Heading>
          <ProofStrip data={data} />
        </Column>
      </Section>

      {/* ---- Footer ---- */}
      <Section style={{ padding: [28, 0, 36, 0], gap: 24 }}>
        <BatikBand width={1100} height={16} color={C.gold} />
        <SampleNote data={data} />
        <Text style={{ fontSize: 12, color: token("colors.muted"), textAlign: "center" }}>
          {dao.name} · {data.source} · Proposal {p.id}
        </Text>
      </Section>
    </Page>
  );
}

// Props for `npx hyper-elements check/render` (the template renders its
// sample data when no props are given).
export default Object.assign(VotingPage, { PreviewProps: {} });
