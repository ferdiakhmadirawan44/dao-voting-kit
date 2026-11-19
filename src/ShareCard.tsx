// ---------------------------------------------------------------------------
// DAO Voting Kit — Share Card (Chapter 07: Kartu / Share, Canvas 1200 × 630)
// The verdict poster: a bold newspaper-front-page / court-verdict poster,
// not a plain summary card. "PROPOSAL LOLOS" huge in gold on deep navy,
// the proposal ID, the tally and the DAO name — built to be shared on X
// and Discord the moment the result lands. All visuals are drawn in code
// (batik band, gold seal, navy and gold); there are no image assets. The
// verdict, the ID and the tally are derived from the same proposal file as
// the emails, the voting page, the dashboard, the results PDF and the
// certificates.
// ---------------------------------------------------------------------------

import { Canvas, Column, Row, Text } from "@hyper-elements/react";
import {
  defaultData,
  formatIntId,
  formatPct1,
  outcomeLabel,
  participationPct,
  totalVotes,
  type DaoData,
} from "./data.js";
import { BatikBand, GoldSeal } from "./shared.js";
import { C, MONO_FONT, PRINT_FONT, PRINT_FONTS, daoTheme } from "./theme.js";

export interface ShareCardProps {
  data?: DaoData;
}

function ShareCard({ data = defaultData }: ShareCardProps) {
  const dao = data.dao;
  const p = data.proposal;
  const label = outcomeLabel(data);
  return (
    <Canvas
      theme={daoTheme}
      fonts={PRINT_FONTS}
      title={`DAO Voting Kit — ${label.id}: ${p.id} (${dao.name})`}
      width={1200}
      height={630}
      lang="id"
      style={{ backgroundColor: C.navyDeep, fontFamily: PRINT_FONT, gap: 0 }}
    >
      {/* ---- Top: brand + batik ---- */}
      <Column style={{ padding: [36, 48, 0, 48], gap: 14 }}>
        <Row style={{ gap: 16, alignItems: "center" }}>
          <Text style={{ color: "#FFFFFF", fontSize: 26, fontWeight: 800, letterSpacing: 4 }}>
            NUSANTARA DAO
          </Text>
          <Text
            style={{
              color: C.goldBright,
              fontSize: 14,
              fontFamily: MONO_FONT,
              flex: 1,
              textAlign: "right",
            }}
          >
            BAB 07 DARI 7 · CHAPTER 07 OF 7
          </Text>
        </Row>
        <BatikBand width={1104} height={18} color={C.goldBright} />

        {/* ---- The verdict ---- */}
        <Text
          style={{
            color: C.goldBright,
            fontSize: 104,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: 2,
          }}
        >
          PROPOSAL {label.id}
        </Text>
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 26,
            fontWeight: 700,
            fontFamily: MONO_FONT,
          }}
        >
          {p.id}
        </Text>
        <Text style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 700 }}>
          {p.titleId}
        </Text>

        {/* ---- The tally ---- */}
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 30,
            fontWeight: 800,
            fontFamily: MONO_FONT,
          }}
        >
          {formatIntId(data.tally.forVotes)} SETUJU · {formatIntId(data.tally.againstVotes)}{" "}
          TIDAK · {formatIntId(data.tally.abstainVotes)} ABSTAIN
        </Text>
        <Text style={{ color: "#C9D6E8", fontSize: 20, fontWeight: 700 }}>
          {formatIntId(totalVotes(data))} suara · Kuorum tercapai · Partisipasi{" "}
          {formatPct1(participationPct(data), "id")}
        </Text>
      </Column>

      {/* ---- Bottom band: seal + proof ---- */}
      <Column style={{ padding: [16, 48, 36, 48], gap: 8 }}>
        <Row style={{ gap: 16, alignItems: "center" }}>
          <GoldSeal size={56} bg={C.navyDeep} />
          <Column style={{ gap: 2, flex: 1 }}>
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: 800 }}>
              {dao.name} · {dao.taglineId}
            </Text>
            <Text style={{ color: "#C9D6E8", fontSize: 13, fontFamily: MONO_FONT }}>
              {p.id} · Hasil voting / Voting results · {data.voting.endLabelId}
            </Text>
          </Column>
          <Text style={{ color: C.goldBright, fontSize: 14, fontWeight: 800, fontFamily: MONO_FONT }}>
            1 PROPOSAL · 1 VOTE
          </Text>
        </Row>
      </Column>
    </Canvas>
  );
}

// Props for `npx hyper-elements check/render` (the template renders its
// sample data when no props are given).
export default Object.assign(ShareCard, { PreviewProps: {} });
