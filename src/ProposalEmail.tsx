// ---------------------------------------------------------------------------
// DAO Voting Kit — Proposal Email (Chapter 01: Pengumuman / Announcement)
// The email every member receives when the proposal opens: what is being
// decided, the options, the voting window, the countdown and the call to
// vote. The proposal ID, the tally and the countdown are all derived from
// the same proposal file as the voting page, the reminder, the dashboard,
// the results PDF, the certificates and the share card — so the email can
// never disagree with any of them.
// Sender: ONE address serves both emails — governance@nusantaradao.org
// (a data field; edit it in data.ts and both emails change together).
// ---------------------------------------------------------------------------

import {
  Button,
  Column,
  Divider,
  Email,
  Heading,
  Menu,
  MergeTag,
  Row,
  Section,
  Span,
  Text,
  token,
} from "@hyper-elements/react";
import {
  countdownLabel,
  defaultData,
  endDate,
  formatDateId,
  formatUsdc,
  type DaoData,
} from "./data.js";
import {
  BatikBandEmail,
  Bi,
  ChapterMark,
  ProofStrip,
  ProposalBadge,
  SampleNote,
  TallyBars,
} from "./shared.js";
import { C, MONO_FONT, daoTheme } from "./theme.js";

export interface ProposalEmailProps {
  data?: DaoData;
}

function ProposalEmail({ data = defaultData }: ProposalEmailProps) {
  const dao = data.dao;
  const p = data.proposal;
  const count = countdownLabel(data);
  return (
    <Email
      theme={daoTheme}
      title={`Proposal ${p.id}: ${p.titleId} — voting ${data.voting.endLabelId}`}
      previewText={`Proposal ${p.id} dibuka: ${p.titleId}. Voting sampai ${data.voting.endLabelId} — ${count.id.toLowerCase()}.`}
      lang="id"
      style={{ gap: 0 }}
    >
      {/* ---- Masthead: deep navy band + batik ---- */}
      <Section
        tokens={{ colors: { background: C.navy, foreground: "#FFFFFF" } }}
        style={{ backgroundColor: C.navy, padding: [28, 0, 24, 0], gap: 16 }}
      >
        <Row style={{ gap: 14, alignItems: "center" }}>
          <Column style={{ gap: 2 }}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: 800,
                lineHeight: 1.15,
                color: "#FFFFFF",
                letterSpacing: 3,
              }}
            >
              NUSANTARA DAO
            </Text>
            <Text style={{ color: "#E8B923", fontSize: 13 }}>
              {dao.taglineId} · {dao.taglineEn}
            </Text>
          </Column>
        </Row>
        <BatikBandEmail color={C.goldBright} />
        <Row style={{ gap: 16, alignItems: "center" }}>
          <ProposalBadge data={data} />
          <Text style={{ color: "#FFFFFF", fontSize: 12, fontFamily: MONO_FONT, flex: 1 }}>
            {p.categoryId} · {formatUsdc(p.amountUsdc)}
          </Text>
        </Row>
      </Section>

      {/* ---- Body ---- */}
      <Section style={{ padding: [24, 0, 8, 0], gap: 24 }}>
        <Column style={{ apply: ["card"] }}>
          <ChapterMark n={1} />
          <Heading level={1}>
            {p.titleId} / {p.titleEn}
          </Heading>
          <Text>
            Halo, <MergeTag name="first_name" /> — proposal baru dibuka di {dao.name}:{" "}
            <Span style={{ fontWeight: 700 }}>{p.titleId}</Span>. Dana{" "}
            <Span style={{ fontWeight: 700 }}>{formatUsdc(p.amountUsdc)}</Span> dari treasury
            untuk hibah developer. / Hello, <MergeTag name="first_name" /> — a new proposal is
            open at {dao.name}: <Span style={{ fontWeight: 700 }}>{p.titleEn}</Span>.{" "}
            <Span style={{ fontWeight: 700 }}>{formatUsdc(p.amountUsdc)}</Span> from the
            treasury for developer grants.
          </Text>
          <Text>
            {p.descriptionId} / {p.descriptionEn}
          </Text>
          <Text style={{ fontSize: 13, color: token("colors.muted") }}>
            Diajukan oleh / Proposed by: {p.proposerId} · {p.proposerEn}
          </Text>
        </Column>

        {/* Options */}
        <Column style={{ apply: ["card"] }}>
          <Heading level={2}>Pilihan suara / Voting options</Heading>
          <Text>
            Satu anggota, satu suara — pilih salah satu. / One member, one vote — pick one.
          </Text>
          <TallyBars data={data} barWidth={200} />
          <Text style={{ fontSize: 12, color: token("colors.muted") }}>
            Batang di atas adalah hasil sementara per {data.referenceDateLabelId} / The bars
            above are the tally as of {data.referenceDateLabelEn}.
          </Text>
        </Column>

        {/* Window + countdown */}
        <Column style={{ apply: ["card"] }}>
          <Bi id="Jadwal voting" en="Voting window" size={12} bold />
          <Row style={{ gap: 24 }}>
            <Column style={{ gap: 2, flex: 1 }}>
              <Bi id="Dibuka" en="Opens" size={12} />
              <Text style={{ fontFamily: MONO_FONT, fontSize: 15, fontWeight: 700 }}>
                {data.voting.startLabelId}
              </Text>
            </Column>
            <Column style={{ gap: 2, flex: 1 }}>
              <Bi id="Ditutup" en="Closes" size={12} />
              <Text style={{ fontFamily: MONO_FONT, fontSize: 15, fontWeight: 700 }}>
                {data.voting.endLabelId}
              </Text>
            </Column>
          </Row>
          <Text style={{ fontSize: 20, fontWeight: 800, color: C.goldDark }}>
            {count.id} · {count.en}
          </Text>
          <Text style={{ fontSize: 13, color: token("colors.muted") }}>
            Hitung mundur dihitung dari tanggal snapshot data ({data.referenceDateLabelId}) / The
            countdown is computed from the data snapshot date ({data.referenceDateLabelEn}).
          </Text>
          <Button href={dao.voteUrl}>Vote Sekarang / Vote Now</Button>
        </Column>

        {/* Proof strip */}
        <Column style={{ apply: ["card"] }}>
          <Heading level={3}>Satu proposal, satu suara / One proposal, one vote</Heading>
          <ProofStrip data={data} />
        </Column>
      </Section>

      {/* ---- Footer ---- */}
      <Section style={{ padding: [24, 0, 32, 0], gap: 24 }}>
        <BatikBandEmail />
        <Menu
          items={[
            { text: "Halaman voting / Voting page", href: dao.voteUrl },
            { text: "Hasil / Results", href: dao.resultsUrl },
            { text: "Discord DAO", href: dao.discordUrl },
            { text: "Berhenti berlangganan / Unsubscribe", href: "https://example.com/unsubscribe" },
          ]}
          separator="·"
          style={{ fontSize: 13, color: token("colors.muted") }}
        />
        <Text style={{ fontSize: 12, color: token("colors.muted"), textAlign: "center" }}>
          Dikirim dari / Sent from {dao.senderEmail} — satu alamat pengirim untuk kedua email
          kit ini / one sender address for both emails in this kit. Anda menerima email ini
          karena Anda anggota {dao.name}. / You received this email because you are a member of{" "}
          {dao.name}.
        </Text>
        <SampleNote data={data} />
        <Text style={{ fontSize: 12, color: token("colors.muted"), textAlign: "center" }}>
          {dao.name} · {data.source}
        </Text>
      </Section>
    </Email>
  );
}

// Props for `npx hyper-elements check/render` (the template renders its
// sample data when no props are given).
export default Object.assign(ProposalEmail, { PreviewProps: {} });
