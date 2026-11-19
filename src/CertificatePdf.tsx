// ---------------------------------------------------------------------------
// DAO Voting Kit — Participation Certificate (Chapter 06: Sertifikat /
// Certificate)
// One A4 landscape page per sample voter — three pages. The certificate is
// designed as a collectible membership card, not a form letter: a unique
// voter number (VOTER #0147), a "voter power" line (1 vote = 1 suara), a
// batik border and a gold seal. It is printed from the SAME proposal file
// as the emails, the voting page, the dashboard, the results PDF and the
// share card — the proposal ID and the vote on this certificate are the
// proposal ID and the vote everywhere else.
// ---------------------------------------------------------------------------

import {
  Column,
  Document,
  Heading,
  PageNumber,
  Row,
  Span,
  Text,
  token,
} from "@hyper-elements/react";
import { defaultData, formatUsdc, type DaoData, type Voter } from "./data.js";
import {
  BatikBand,
  ChapterMark,
  GoldSeal,
  SampleNote,
  VoteLabel,
} from "./shared.js";
import { C, MONO_FONT, PRINT_FONT, PRINT_FONTS, daoTheme } from "./theme.js";

export interface CertificatePdfProps {
  data?: DaoData;
}

function CertificatePage({ data, voter }: { data: DaoData; voter: Voter }) {
  const dao = data.dao;
  const p = data.proposal;
  return (
    <Document.Page style={{ gap: 10 }}>
      {/* Batik border: top band */}
      <BatikBand width={740} height={16} color={C.gold} />
      <Column
        style={{
          border: `2px solid ${C.gold}`,
          borderRadius: 16,
          padding: 28,
          gap: 14,
          alignItems: "center",
        }}
      >
        <GoldSeal size={72} />
        <Column style={{ gap: 2, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: C.goldDark,
              textAlign: "center",
            }}
          >
            Sertifikat Partisipasi · Certificate of Participation
          </Text>
          <Heading level={1} style={{ textAlign: "center" }}>
            {voter.name}
          </Heading>
          <Text style={{ fontSize: 15, fontWeight: 700, color: C.navy, textAlign: "center" }}>
            {voter.handle} · {voter.voterNo}
          </Text>
        </Column>

        <Text style={{ fontSize: 14, textAlign: "center" }}>
          Telah ikut voting pada proposal / Voted on proposal{" "}
          <Span style={{ fontFamily: MONO_FONT, fontWeight: 800 }}>{p.id}</Span> — {p.titleId}
        </Text>

        <Row style={{ gap: 32, alignItems: "center" }}>
          <Column style={{ gap: 2, alignItems: "center" }}>
            <Text style={{ fontSize: 12, color: token("colors.muted") }}>
              Pilihan suara / Vote cast
            </Text>
            <VoteLabel choice={voter.vote} />
          </Column>
          <Column style={{ gap: 2, alignItems: "center" }}>
            <Text style={{ fontSize: 12, color: token("colors.muted") }}>
              Kekuatan suara / Voting power
            </Text>
            <Text style={{ fontSize: 15, fontWeight: 800, fontFamily: MONO_FONT }}>
              {voter.votingPower} vote = 1 suara
            </Text>
          </Column>
          <Column style={{ gap: 2, alignItems: "center" }}>
            <Text style={{ fontSize: 12, color: token("colors.muted") }}>
              Waktu vote / Voted at
            </Text>
            <Text style={{ fontSize: 13, fontWeight: 700, fontFamily: MONO_FONT }}>
              {voter.votedAtLabelId}
            </Text>
          </Column>
        </Row>

        <Text style={{ fontSize: 12, color: token("colors.muted"), textAlign: "center" }}>
          {dao.name} · {formatUsdc(p.amountUsdc)} · Proposal {p.id} · Voting{" "}
          {data.voting.startLabelId} — {data.voting.endLabelId}
        </Text>
        <ChapterMark n={6} />
      </Column>
      {/* Batik border: bottom band */}
      <BatikBand width={740} height={16} color={C.gold} />
      <SampleNote data={data} />
      <Text style={{ fontSize: 11, color: token("colors.muted"), textAlign: "center" }}>
        Page <PageNumber /> of <PageNumber total /> · {voter.voterNo} · Proposal {p.id}
      </Text>
    </Document.Page>
  );
}

function CertificatePdf({ data = defaultData }: CertificatePdfProps) {
  const dao = data.dao;
  const p = data.proposal;
  return (
    <Document
      theme={daoTheme}
      fonts={PRINT_FONTS}
      title={`DAO Voting Kit — Sertifikat partisipasi ${p.id} (${dao.name}, ${data.voters.length} voter)`}
      size="A4"
      orientation="landscape"
      lang="id"
      style={{ fontFamily: PRINT_FONT, fontSize: 13 }}
    >
      {data.voters.map((voter) => (
        <CertificatePage key={voter.voterNo} data={data} voter={voter} />
      ))}
    </Document>
  );
}

// Props for `npx hyper-elements check/render` (the template renders its
// sample data when no props are given).
export default Object.assign(CertificatePdf, { PreviewProps: {} });
