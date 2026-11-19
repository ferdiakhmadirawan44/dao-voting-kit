// ---------------------------------------------------------------------------
// DAO Voting Kit — Quorum Dashboard (Chapter 04: Hasil / Results)
// The results summary page, published after the close: the verdict, the
// final tally, the quorum math, the participation rate and the per-day
// vote timeline. Every number is computed from the same proposal file as
// the emails, the voting page, the results PDF, the certificates and the
// share card — the dashboard can never disagree with the report.
// ---------------------------------------------------------------------------

import {
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
  defaultData,
  formatIntId,
  formatPct1,
  formatUsdc,
  outcomeLabel,
  participationPct,
  peakDay,
  quorumRequired,
  totalVotes,
  type DaoData,
} from "./data.js";
import {
  BatikBand,
  Bi,
  ChapterMark,
  OutcomePill,
  ProofStrip,
  ProposalBadge,
  QuorumBar,
  SampleNote,
  TallyBars,
  TallyTable,
  VoteTimelineSvg,
} from "./shared.js";
import { C, MONO_FONT, daoTheme } from "./theme.js";

export interface QuorumDashboardProps {
  data?: DaoData;
}

function QuorumDashboard({ data = defaultData }: QuorumDashboardProps) {
  const dao = data.dao;
  const p = data.proposal;
  const total = totalVotes(data);
  const required = quorumRequired(data);
  const label = outcomeLabel(data);
  const peak = peakDay(data);
  return (
    <Page
      theme={daoTheme}
      title={`${dao.name} — Hasil: ${p.id} ${label.id}`}
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
              Hasil voting / Voting results
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
        {/* Verdict */}
        <Column style={{ apply: ["card"] }}>
          <ChapterMark n={4} />
          <Heading level={1}>
            {p.titleId} / {p.titleEn}
          </Heading>
          <OutcomePill data={data} />
          <Text style={{ fontSize: 18, fontWeight: 700, color: C.navy }}>
            Proposal {label.id} — {formatIntId(data.tally.forVotes)} suara Setuju melawan{" "}
            {formatIntId(data.tally.againstVotes)} Tidak Setuju. / Proposal {label.en} —{" "}
            {formatIntId(data.tally.forVotes)} For votes against{" "}
            {formatIntId(data.tally.againstVotes)} Against.
          </Text>
          <Text style={{ fontSize: 13, color: token("colors.muted") }}>
            Voting ditutup {data.voting.endLabelId} · Tidak ada suara pada hari penutupan 22
            Nov, jadi tally final sama dengan tally per {data.referenceDateLabelId}. / Voting
            closed {data.voting.endLabelEn} · No votes were cast on closing day, 22 Nov, so
            the final tally matches the tally as of {data.referenceDateLabelEn}.
          </Text>
        </Column>

        {/* Final tally */}
        <Column style={{ apply: ["card"] }}>
          <Heading level={2}>Tally final / Final tally</Heading>
          <TallyTable data={data} />
          <TallyBars data={data} barWidth={480} />
        </Column>

        {/* Quorum + participation */}
        <Column style={{ apply: ["card"] }}>
          <Heading level={2}>Kuorum &amp; partisipasi / Quorum &amp; participation</Heading>
          <QuorumBar data={data} barWidth={520} />
          <Row style={{ gap: 24 }}>
            <Column style={{ gap: 2, flex: 1 }}>
              <Bi id="Partisipasi" en="Participation" size={12} />
              <Text style={{ fontFamily: MONO_FONT, fontSize: 24, fontWeight: 800, color: C.navy }}>
                {formatPct1(participationPct(data), "id")}
              </Text>
              <Text style={{ fontSize: 13, color: token("colors.muted") }}>
                {formatIntId(total)} dari / of {formatIntId(data.voting.members)} anggota /
                members
              </Text>
            </Column>
            <Column style={{ gap: 2, flex: 1 }}>
              <Bi id="Kuorum dibutuhkan" en="Quorum required" size={12} />
              <Text style={{ fontFamily: MONO_FONT, fontSize: 24, fontWeight: 800, color: C.navy }}>
                {formatIntId(required)}
              </Text>
              <Text style={{ fontSize: 13, color: token("colors.muted") }}>
                10% dari / of {formatIntId(data.voting.members)} anggota / members
              </Text>
            </Column>
          </Row>
        </Column>

        {/* Vote timeline */}
        <Column style={{ apply: ["card"] }}>
          <Heading level={2}>Linimasa suara / Vote timeline</Heading>
          <Text>
            Suara per hari, {data.voting.startLabelId} — {data.referenceDateLabelId}. Jumlah
            per hari sama dengan tally final. / Votes per day,{" "}
            {data.voting.startLabelEn} — {data.referenceDateLabelEn}. The daily split sums to
            the final tally.
          </Text>
          <VoteTimelineSvg data={data} width={1000} height={160} />
          <Text style={{ fontSize: 13, color: token("colors.muted") }}>
            Hari tersibuk / Busiest day: {peak.labelId} — {peak.forVotes + peak.againstVotes + peak.abstainVotes}{" "}
            suara / votes ({peak.forVotes} Setuju, {peak.againstVotes} Tidak Setuju,{" "}
            {peak.abstainVotes} Abstain).
          </Text>
        </Column>

        {/* Journey so far */}
        <Column style={{ apply: ["card"] }}>
          <Heading level={2}>Perjalanan proposal / Proposal journey</Heading>
          <Text>
            15 Nov — proposal dibuka / opened · 21 Nov — pengingat terakhir / last reminder ·{" "}
            22 Nov — voting ditutup, hasil terbit / closed, results published · Sertifikat
            partisipasi diterbitkan untuk tiap voter / participation certificates issued to
            every voter.
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
export default Object.assign(QuorumDashboard, { PreviewProps: {} });
