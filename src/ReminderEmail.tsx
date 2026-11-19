// ---------------------------------------------------------------------------
// DAO Voting Kit — Reminder Email (Chapter 03: Pengingat / Reminder)
// The last-call email, sent 24 hours before the close: the tally so far,
// the countdown, and one more call to vote. It is the same proposal file
// as the announcement — the tally here is the tally on the voting page,
// the dashboard and the results PDF, because all of them read the same
// data. Sender: the same ONE address as the proposal email,
// governance@nusantaradao.org (a data field in data.ts).
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
  formatDateId,
  formatIntId,
  formatUsdc,
  quorumRequired,
  totalVotes,
  type DaoData,
} from "./data.js";
import {
  BatikBandEmail,
  Bi,
  ChapterMark,
  ProofStrip,
  ProposalBadge,
  QuorumBar,
  SampleNote,
  TallyBars,
} from "./shared.js";
import { C, MONO_FONT, daoTheme } from "./theme.js";

export interface ReminderEmailProps {
  data?: DaoData;
}

function ReminderEmail({ data = defaultData }: ReminderEmailProps) {
  const dao = data.dao;
  const p = data.proposal;
  const count = countdownLabel(data);
  const total = totalVotes(data);
  const required = quorumRequired(data);
  return (
    <Email
      theme={daoTheme}
      title={`Tinggal 24 jam: voting ${p.id} ditutup besok / 24 hours left to vote on ${p.id}`}
      previewText={`Voting ${p.id} ditutup ${data.voting.endLabelId}. ${formatIntId(total)} suara sudah masuk, kuorum ${formatIntId(required)} sudah tercapai — suaramu masih dihitung.`}
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
              Pengingat terakhir / Last call
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
          <ChapterMark n={3} />
          <Heading level={1}>
            Tinggal 24 jam / 24 hours left
          </Heading>
          <Text>
            Halo, <MergeTag name="first_name" /> — voting proposal{" "}
            <Span style={{ fontWeight: 700 }}>{p.id}</Span> ditutup{" "}
            <Span style={{ fontWeight: 700 }}>{data.voting.endLabelId}</Span>. Kalau kamu belum
            vote, ini kesempatan terakhirmu. / Hello, <MergeTag name="first_name" /> — voting
            on proposal <Span style={{ fontWeight: 700 }}>{p.id}</Span> closes{" "}
            <Span style={{ fontWeight: 700 }}>{data.voting.endLabelEn}</Span>. If you have not
            voted yet, this is your last chance.
          </Text>
          <Text style={{ fontSize: 20, fontWeight: 800, color: C.goldDark }}>
            {count.id} · {count.en}
          </Text>
        </Column>

        {/* Tally so far */}
        <Column style={{ apply: ["card"] }}>
          <Heading level={2}>Hasil sementara / Tally so far</Heading>
          <Text>
            {formatIntId(total)} suara sudah masuk per {data.referenceDateLabelId}. /{" "}
            {formatIntId(total)} votes cast as of {data.referenceDateLabelEn}.
          </Text>
          <TallyBars data={data} barWidth={200} />
          <QuorumBar data={data} barWidth={460} />
        </Column>

        {/* The ask */}
        <Column style={{ apply: ["card"] }}>
          <Bi id="Suaramu masih dihitung" en="Your vote still counts" size={12} bold />
          <Text>
            Kuorum {formatIntId(required)} suara sudah tercapai, tapi hasil akhir ditentukan
            oleh semua suara yang masuk sebelum penutupan — termasuk suaramu. / Quorum of{" "}
            {formatIntId(required)} votes is already met, but the final result is decided by
            every vote cast before the close — including yours.
          </Text>
          <Button href={dao.voteUrl}>Vote Sekarang / Vote Now</Button>
          <Text style={{ fontSize: 13, color: token("colors.muted") }}>
            Setelah ditutup, hasil final terbit di halaman hasil / After the close, the final
            results are published on the results page: {dao.resultsUrl}
          </Text>
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
export default Object.assign(ReminderEmail, { PreviewProps: {} });
