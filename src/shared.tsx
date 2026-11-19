// ---------------------------------------------------------------------------
// Shared pieces of the DAO Voting Kit — used by all seven outputs so the
// kit can never disagree with itself. Every piece reads the SAME `data`
// object and derives everything from the proposal and the tally; nothing
// is re-typed per output.
//
// The bilingual rule: every label is Indonesian first, English second,
// from the same data — the two languages are rendered from one source, so
// they can never drift apart.
//
// The identity rule: every output carries the batik band (kawung-style
// diamonds), the chapter marker and the proposal badge — the kit's
// fingerprint, recognisable in any format.
// ---------------------------------------------------------------------------

import {
  Circle,
  Column,
  Divider,
  Line,
  Path,
  Rect,
  Row,
  Span,
  Svg,
  Table,
  TableCell,
  TableRow,
  Text,
  token,
} from "@hyper-elements/react";
import {
  VOTE_OPTIONS,
  chapterOf,
  dayTotal,
  formatIntId,
  formatPct1,
  formatPctEn,
  formatPctId,
  formatUsdc,
  outcomeLabel,
  participationPct,
  peakDay,
  quorumMet,
  quorumMultiple,
  quorumRequired,
  totalVotes,
  voteShare,
  voteShares,
  whatIf,
  type DaoData,
  type DayVotes,
  type VoteChoice,
} from "./data.js";
import { C, MONO_FONT, VOTE_COLORS } from "./theme.js";

/** Bilingual label: Indonesian line, then the English line, muted. The
 *  signature of this kit — used everywhere a label appears. */
export function Bi({
  id,
  en,
  size = 14,
  bold = false,
  align,
}: {
  id: string;
  en: string;
  size?: number;
  bold?: boolean;
  align?: "left" | "center" | "right";
}) {
  return (
    <Column style={{ gap: 0 }}>
      <Text
        style={{
          fontSize: size,
          fontWeight: bold ? 700 : 400,
          textAlign: align,
        }}
      >
        {id}
      </Text>
      <Text
        style={{
          fontSize: Math.max(11, size - 2),
          color: token("colors.muted"),
          textAlign: align,
        }}
      >
        {en}
      </Text>
    </Column>
  );
}

/**
 * The batik band — a kawung-inspired row of gold diamonds with dots,
 * drawn in code (no image assets). One diamond per 26 units of width;
 * the band is the kit's fingerprint and runs across the top of every
 * output, in the header, the footer, or both.
 */
export function BatikBand({
  width = 560,
  height = 18,
  color = C.gold,
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  const step = 26;
  const count = Math.max(1, Math.floor(width / step));
  const ry = height / 2 - 2;
  const rx = 9;
  const diamonds: { cx: number; d: string }[] = [];
  for (let i = 0; i < count; i++) {
    const cx = i * step + step / 2;
    diamonds.push({
      cx,
      d: `M ${cx} ${height / 2 - ry} L ${cx + rx} ${height / 2} L ${cx} ${height / 2 + ry} L ${cx - rx} ${height / 2} Z`,
    });
  }
  const dots: number[] = [];
  for (let i = 0; i < count - 1; i++) {
    dots.push(i * step + step);
  }
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      title="Batik kawung band"
    >
      {diamonds.map((d, i) => (
        <Path key={`d${i}`} d={d.d} style={{ fill: color }} />
      ))}
      {dots.map((x, i) => (
        <Circle key={`c${i}`} cx={x} cy={height / 2} r={2} style={{ fill: color }} />
      ))}
    </Svg>
  );
}

/**
 * The gold seal — concentric circles with a diamond heart, drawn in code.
 * Used on the certificates (and small on the share card): the DAO's wax
 * seal, not a stock checkmark. `bg` is the surface the seal sits on —
 * the circles are filled with it (the renderers reject fill "none").
 */
export function GoldSeal({ size = 72, bg = "#FFFFFF" }: { size?: number; bg?: string }) {
  const c = size / 2;
  const rOuter = size / 2 - 2;
  const rInner = size / 2 - 10;
  const d = `M ${c} ${c - 12} L ${c + 12} ${c} L ${c} ${c + 12} L ${c - 12} ${c} Z`;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} title="Nusantara DAO seal">
      <Circle cx={c} cy={c} r={rOuter} style={{ fill: bg, stroke: C.gold, strokeWidth: 3 }} />
      <Circle cx={c} cy={c} r={rInner} style={{ fill: bg, stroke: C.gold, strokeWidth: 1 }} />
      <Path d={d} style={{ fill: C.gold }} />
      <Circle cx={c} cy={c} r={3} style={{ fill: C.navyDeep }} />
    </Svg>
  );
}

/**
 * The batik band for EMAIL roots — the Email writer has no inline SVG,
 * so the email version is a row of gold diamond glyphs (the same motif,
 * email-safe; the Invoice Kit entry did the same with emoji icons).
 * Page, Document and Canvas roots use the drawn BatikBand above.
 */
export function BatikBandEmail({ count = 42, color = "#6B5600" }: { count?: number; color?: string }) {
  return (
    <Text style={{ color, fontSize: 12, letterSpacing: 4, textAlign: "center" }}>
      {"◆ ".repeat(count).trim()}
    </Text>
  );
}

/** The chapter marker — where this output sits in the proposal's story. */
export function ChapterMark({ n }: { n: number }) {
  const ch = chapterOf(n);
  return (
    <Column style={{ gap: 4 }}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: C.goldDark,
        }}
      >
        Bab {String(ch.n).padStart(2, "0")} dari 7 · Chapter {String(ch.n).padStart(2, "0")} of 7
      </Text>
      <Text style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>
        {ch.titleId} / {ch.titleEn}
      </Text>
      <JourneyStrip current={n} />
    </Column>
  );
}

/** The journey strip — seven numbered dots, the current chapter in gold.
 *  The whole story at a glance, on every output. */
export function JourneyStrip({ current }: { current: number }) {
  return (
    <Row style={{ gap: 6, alignItems: "center" }}>
      {CHAPTERS_DOTS.map((n) => {
        const isCurrent = n === current;
        const isPast = n < current;
        return (
          <Column
            key={n}
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: isCurrent ? C.gold : isPast ? C.navyTint : "#FFFFFF",
              border: `2px solid ${isCurrent ? C.goldDark : C.navy}`,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: isCurrent ? C.navyDeep : C.navy,
                textAlign: "center",
              }}
            >
              {n}
            </Text>
          </Column>
        );
      })}
      <Text style={{ fontSize: 12, color: token("colors.muted") }}>
        {current} / 7
      </Text>
    </Row>
  );
}

const CHAPTERS_DOTS = [1, 2, 3, 4, 5, 6, 7];

/** The proposal badge: the ID over the DAO name. Stacked, not side by
 *  side — the ID is the proof that ties all seven outputs together. */
export function ProposalBadge({ data }: { data: DaoData }) {
  return (
    <Column
      style={{
        backgroundColor: "#FFFFFF",
        border: `2px solid ${C.gold}`,
        borderRadius: 14,
        padding: [10, 18],
        gap: 2,
        alignItems: "center",
        justifyContent: "start",
        width: 280,
      }}
    >
      <Text
        style={{
          color: C.navy,
          fontWeight: 800,
          fontSize: 14,
          fontFamily: MONO_FONT,
          textAlign: "center",
        }}
      >
        {data.proposal.id}
      </Text>
      <Text style={{ color: C.navy, fontSize: 12, fontWeight: 700, textAlign: "center" }}>
        {data.dao.name}
      </Text>
    </Column>
  );
}

/**
 * The proof strip — IDENTICAL text on the proposal email, the reminder,
 * the voting page, the dashboard, the results PDF, the certificates and
 * the share card. If any output ever shows a different proposal ID or
 * tally, the kit is broken; that is the whole point of "one proposal,
 * one vote".
 */
export function ProofStrip({ data, dark }: { data: DaoData; dark?: boolean }) {
  const color = dark ? "#C9D6E8" : token("colors.muted");
  const shares = voteShares(data);
  return (
    <Column style={{ gap: 4 }}>
      <Text style={{ fontSize: 12, color, fontFamily: MONO_FONT }}>
        {data.proposal.id} · {data.dao.name} · {formatUsdc(data.proposal.amountUsdc)}
      </Text>
      <Text style={{ fontSize: 12, color }}>
        Setuju / For {formatIntId(data.tally.forVotes)} ({formatPctId(shares.forPct)}) · Tidak
        Setuju / Against {formatIntId(data.tally.againstVotes)} ({formatPctId(shares.againstPct)})
        · Abstain {formatIntId(data.tally.abstainVotes)} ({formatPctId(shares.abstainPct)}) · Total{" "}
        {formatIntId(totalVotes(data))} suara / votes
      </Text>
      <Text style={{ fontSize: 12, fontWeight: 700, color: dark ? "#FFFFFF" : C.ink }}>
        One proposal, one vote — this proposal ID is identical on the proposal email, the
        reminder, the voting page, the dashboard, the results PDF, the certificates and the
        share card.
      </Text>
    </Column>
  );
}

/** The outcome pill — PASSED in gold-on-green, bilingual. */
export function OutcomePill({ data }: { data: DaoData }) {
  const label = outcomeLabel(data);
  const passed = label.en === "PASSED";
  return (
    <Column
      style={{
        backgroundColor: passed ? C.greenTint : C.redTint,
        border: `2px solid ${passed ? C.green : C.red}`,
        borderRadius: 999,
        padding: [6, 16],
        alignItems: "center",
        width: 260,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: 800,
          color: passed ? C.greenDark : C.redDark,
          textAlign: "center",
          letterSpacing: 1,
        }}
      >
        {label.id} · {label.en}
      </Text>
    </Column>
  );
}

/** The tally as a table — the same computed rows everywhere. */
export function TallyTable({ data }: { data: DaoData }) {
  const total = totalVotes(data);
  return (
    <Table
      style={{
        cellPadding: [10, 8],
        rowBorder: { width: 1, style: "solid", color: C.border },
      }}
    >
      <TableRow header>
        <TableCell>
          <Span style={{ fontWeight: 700 }}>Pilihan / Choice</Span>
        </TableCell>
        <TableCell style={{ textAlign: "right" }}>
          <Span style={{ fontWeight: 700 }}>Suara / Votes</Span>
        </TableCell>
        <TableCell style={{ textAlign: "right" }}>
          <Span style={{ fontWeight: 700 }}>Bagian / Share</Span>
        </TableCell>
      </TableRow>
      {VOTE_OPTIONS.map((opt) => {
        const votes =
          opt.key === "for"
            ? data.tally.forVotes
            : opt.key === "against"
              ? data.tally.againstVotes
              : data.tally.abstainVotes;
        const share = voteShare(data, opt.key);
        return (
          <TableRow key={opt.key}>
            <TableCell>
              <Span style={{ fontWeight: 700, color: opt.color }}>
                {opt.labelId} / {opt.labelEn}
              </Span>
            </TableCell>
            <TableCell style={{ textAlign: "right" }}>
              <Span style={{ fontFamily: MONO_FONT, fontSize: 14, fontWeight: 700 }}>
                {formatIntId(votes)}
              </Span>
            </TableCell>
            <TableCell style={{ textAlign: "right" }}>
              <Span style={{ fontFamily: MONO_FONT, fontSize: 14 }}>
                {formatPctId(share)} · {formatPctEn(share)}
              </Span>
            </TableCell>
          </TableRow>
        );
      })}
      <TableRow style={{ backgroundColor: C.navyTint }}>
        <TableCell>
          <Span style={{ fontWeight: 800 }}>Total</Span>
        </TableCell>
        <TableCell style={{ textAlign: "right" }}>
          <Span style={{ fontFamily: MONO_FONT, fontSize: 15, fontWeight: 800 }}>
            {formatIntId(total)}
          </Span>
        </TableCell>
        <TableCell style={{ textAlign: "right" }}>
          <Span style={{ fontFamily: MONO_FONT, fontSize: 14, fontWeight: 800 }}>
            100,00% · 100.00%
          </Span>
        </TableCell>
      </TableRow>
    </Table>
  );
}

/** The tally as layout bars — works in Email, Page and Document roots. */
export function TallyBars({ data, barWidth = 220 }: { data: DaoData; barWidth?: number }) {
  const total = totalVotes(data);
  return (
    <Column style={{ gap: 12 }}>
      {VOTE_OPTIONS.map((opt) => {
        const votes =
          opt.key === "for"
            ? data.tally.forVotes
            : opt.key === "against"
              ? data.tally.againstVotes
              : data.tally.abstainVotes;
        const share = voteShare(data, opt.key);
        const w = Math.max(2, Math.round((votes / total) * barWidth));
        return (
          <Column key={opt.key} style={{ gap: 4 }}>
            <Row style={{ gap: 8, alignItems: "center" }}>
              <Text style={{ fontWeight: 700, fontSize: 13, width: 130 }}>
                {opt.labelId} / {opt.labelEn}
              </Text>
              <Text style={{ fontFamily: MONO_FONT, fontSize: 13, fontWeight: 700 }}>
                {formatIntId(votes)} · {formatPctId(share)}
              </Text>
            </Row>
            <Row style={{ gap: 0, alignItems: "center" }}>
              <Column
                style={{
                  width: barWidth,
                  height: 16,
                  backgroundColor: C.track,
                  borderRadius: 8,
                }}
              >
                <Column
                  style={{
                    width: w,
                    height: 16,
                    backgroundColor: opt.color,
                    borderRadius: 8,
                  }}
                />
              </Column>
            </Row>
          </Column>
        );
      })}
    </Column>
  );
}

/** The quorum bar — progress to the 124 votes required, capped at full
 *  with the multiple stated (566 votes is 4.6x quorum). */
export function QuorumBar({ data, barWidth = 520 }: { data: DaoData; barWidth?: number }) {
  const required = quorumRequired(data);
  const total = totalVotes(data);
  const met = quorumMet(data);
  const multiple = quorumMultiple(data);
  const fillPct = Math.min(100, (total / required) * 100);
  return (
    <Column style={{ gap: 8 }}>
      <Row style={{ gap: 12, alignItems: "center" }}>
        <Text style={{ fontWeight: 700, fontSize: 14 }}>
          Kuorum / Quorum: {formatIntId(total)} dari / of {formatIntId(required)} suara —{" "}
          {multiple.toLocaleString("id-ID", { maximumFractionDigits: 1 })}× kuorum
        </Text>
        <Text
          style={{
            fontWeight: 800,
            fontSize: 13,
            color: met ? C.greenDark : C.redDark,
          }}
        >
          {met ? "TERCAPAI / MET" : "BELUM TERCAPAI / NOT MET"}
        </Text>
      </Row>
      <Column
        style={{
          width: barWidth,
          height: 20,
          backgroundColor: C.track,
          borderRadius: 10,
        }}
      >
        <Column
          style={{
            width: Math.round((fillPct / 100) * barWidth),
            height: 20,
            backgroundColor: C.gold,
            borderRadius: 10,
          }}
        />
      </Column>
      <Text style={{ fontSize: 12, color: token("colors.muted") }}>
        Kuorum = 10% dari / of {formatIntId(data.voting.members)} anggota / members ={" "}
        {formatIntId(required)} suara / votes · Partisipasi / Participation:{" "}
        {formatPct1(participationPct(data), "id")} ({formatIntId(total)} dari / of{" "}
        {formatIntId(data.voting.members)})
      </Text>
    </Column>
  );
}

/**
 * The vote timeline as an SVG bar chart (Page + Canvas): one bar per
 * voting day, the peak day in gold, the rest in navy, a gold line for
 * the daily average. Values and day labels sit in layout rows
 * underneath the SVG — the same pattern as the TAGIHAN usage chart — so
 * the numbers are real text, never drawn glyphs.
 */
export function VoteTimelineSvg({
  data,
  width = 560,
  height = 132,
}: {
  data: DaoData;
  width?: number;
  height?: number;
}) {
  const days = data.timeline;
  const max = Math.max(...days.map((d) => dayTotal(d)));
  const n = days.length;
  const slot = width / n;
  const barW = Math.min(52, slot * 0.55);
  const topPad = 10;
  const bottomPad = 6;
  const chartH = height - topPad - bottomPad;
  const barH = (v: number) => (v / max) * chartH;
  const avg = totalVotes(data) / n;
  const avgY = topPad + chartH - (avg / max) * chartH;
  const peak = peakDay(data);
  return (
    <Column style={{ gap: 6 }}>
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        title="Votes per day"
      >
        {/* Daily average line */}
        <Line
          x1={0}
          y1={avgY}
          x2={width}
          y2={avgY}
          style={{ stroke: C.gold, strokeWidth: 3 }}
        />
        {/* Bars */}
        {days.map((d, i) => {
          const v = dayTotal(d);
          const h = barH(v);
          const x = i * slot + (slot - barW) / 2;
          const y = topPad + chartH - h;
          const isPeak = d.dateIso === peak.dateIso;
          return (
            <Rect
              key={d.dateIso}
              x={x}
              y={y}
              width={barW}
              height={h}
              style={{ fill: isPeak ? C.gold : C.navy }}
            />
          );
        })}
      </Svg>
      <Row style={{ gap: 0 }}>
        {days.map((d) => (
          <Column key={d.dateIso} style={{ flex: 1, gap: 2, alignItems: "center" }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: d.dateIso === peak.dateIso ? C.goldDark : C.ink,
                fontFamily: MONO_FONT,
                textAlign: "center",
              }}
            >
              {dayTotal(d)}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: token("colors.muted"),
                textAlign: "center",
              }}
            >
              {d.labelId}
            </Text>
          </Column>
        ))}
      </Row>
      <Text style={{ fontSize: 12, color: token("colors.muted"), textAlign: "center" }}>
        Garis emas = rata-rata harian: {avg.toLocaleString("id-ID", { maximumFractionDigits: 1 })}{" "}
        suara/hari · Puncak / Peak: {peak.labelId} ({dayTotal(peak)} suara) · Tidak ada suara
        pada hari penutupan 22 Nov / No votes on closing day, 22 Nov
      </Text>
    </Column>
  );
}

/** The vote timeline as layout rows (Email + Document: no SVG needed). */
export function VoteTimelineRows({ data }: { data: DaoData }) {
  const max = Math.max(...data.timeline.map((d) => dayTotal(d)));
  const avg = totalVotes(data) / data.timeline.length;
  return (
    <Column style={{ gap: 10 }}>
      {data.timeline.map((d) => {
        const v = dayTotal(d);
        const isPeak = d.dateIso === peakDay(data).dateIso;
        return (
          <Row key={d.dateIso} style={{ gap: 12, alignItems: "center", justifyContent: "start" }}>
            <Column style={{ gap: 0, width: 150 }}>
              <Text style={{ fontWeight: 700, fontSize: 13 }}>
                {d.labelId} · {d.labelEn}
              </Text>
              <Text style={{ fontSize: 12, color: token("colors.muted") }}>
                {isPeak ? "Puncak / Peak" : ""}
              </Text>
            </Column>
            {/* Bar: a fixed-width track with a filled portion. */}
            <Column
              style={{
                width: 180,
                height: 14,
                backgroundColor: C.track,
                borderRadius: 7,
              }}
            >
              <Column
                style={{
                  width: Math.round((v / max) * 180),
                  height: 14,
                  backgroundColor: isPeak ? C.gold : C.navy,
                  borderRadius: 7,
                }}
              />
            </Column>
            <Text
              style={{
                fontFamily: MONO_FONT,
                fontSize: 14,
                fontWeight: isPeak ? 800 : 400,
                color: isPeak ? C.goldDark : C.ink,
              }}
            >
              {v} suara
            </Text>
            <Text style={{ fontSize: 12, color: token("colors.muted"), fontFamily: MONO_FONT }}>
              {d.forVotes}S · {d.againstVotes}T · {d.abstainVotes}A
            </Text>
          </Row>
        );
      })}
      <Text style={{ fontSize: 12, color: token("colors.muted") }}>
        Rata-rata harian / Daily average:{" "}
        {avg.toLocaleString("id-ID", { maximumFractionDigits: 1 })} suara/hari · Total{" "}
        {formatIntId(totalVotes(data))} suara — jumlah per hari sama dengan tally / the daily
        split sums to the tally.
      </Text>
    </Column>
  );
}

/**
 * The what-if block — computed from the tally, never typed in. If 40
 * more Against votes arrived, would the outcome change? And how many
 * would it take to flip it?
 */
export function WhatIfBlock({ data }: { data: DaoData }) {
  const w = whatIf(data);
  return (
    <Column
      style={{
        backgroundColor: C.goldTint,
        border: `2px solid ${C.gold}`,
        borderRadius: 14,
        padding: [16, 20],
        gap: 8,
      }}
    >
      <Text style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: "#6B5600" }}>
        Bagaimana jika / What if
      </Text>
      <Text style={{ fontSize: 15, fontWeight: 700 }}>
        Seandainya {formatIntId(w.extraAgainst)} suara Tidak Setuju lagi masuk (total{" "}
        {formatIntId(w.againstHypo)}), Setuju tetap menang {formatIntId(data.tally.forVotes)} vs{" "}
        {formatIntId(w.againstHypo)} — {formatPctId(w.forShareHypo)} suara. Hasil tetap{" "}
        {outcomeLabel(data).id} / {outcomeLabel(data).en}.
      </Text>
      <Text style={{ fontSize: 14 }}>
        Untuk membalikkan hasil, perlu {formatIntId(w.flipNeeded)} suara Tidak Setuju tambahan —
        Against harus melampaui Setuju. / To overturn the result,{" "}
        {formatIntId(w.flipNeeded)} more Against votes would be needed — Against must overtake
        For.
      </Text>
    </Column>
  );
}

/** Small divider + "sample scenario" note used at the foot of every output. */
export function SampleNote({ data }: { data: DaoData }) {
  return (
    <Column style={{ gap: 8 }}>
      <Divider style={{ borderTop: { width: 1, style: "solid", color: "#CBD8E6" } }} />
      <Text style={{ fontSize: 12, color: token("colors.muted"), textAlign: "center" }}>
        SAMPLE SCENARIO — a fictional DAO, Nusantara DAO, proposal {data.proposal.id}. Not a
        real vote. The DAO, the proposal, the voters and the vote counts are illustrative; the
        vote arithmetic (tally, percentages, quorum, participation, timeline, what-if) is real
        and computed from the data file. One sender address serves both emails:{" "}
        {data.dao.senderEmail}.
      </Text>
    </Column>
  );
}

/** Vote choice label — bilingual, coloured. */
export function VoteLabel({ choice }: { choice: VoteChoice }) {
  const opt = VOTE_OPTIONS.find((o) => o.key === choice);
  if (!opt) return null;
  return (
    <Text style={{ fontWeight: 700, color: opt.color }}>
      {opt.labelId} / {opt.labelEn}
    </Text>
  );
}
