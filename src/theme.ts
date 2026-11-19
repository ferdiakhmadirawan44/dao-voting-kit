// ---------------------------------------------------------------------------
// DAO Voting Kit's brand, written once as a Hyper Elements theme and handed
// to all seven roots (Email x2, Page x2, Document x2, Canvas). One theme,
// one palette — deep navy, gold and warm parchment, with a batik-inspired
// geometric accent: kawung-style diamonds woven into headers, borders and
// the seal. Recognisably Indonesian, not generic crypto-blue. The vote
// colours ARE the information (green = For, red = Against, slate =
// Abstain; gold = the verdict), so the same colours run through every
// output and a member reads the result at a glance, in any format.
// Headings are a strong grotesque sans on the email and page; the PDF,
// the certificates and the share card use DejaVu, the font the renderers
// can load.
// ---------------------------------------------------------------------------

import { defineTheme } from "@hyper-elements/react";

/** Monospace stack for figures (proposal ID, voter numbers, tallies). */
export const MONO_FONT = "'DejaVu Sans Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/** Font stack for the Document (PDF) and Canvas (share card) roots,
 *  loaded from assets/fonts. */
export const PRINT_FONT = "'DejaVu Sans', sans-serif";

/** Semantic colours shared by all seven outputs. */
export const C = {
  ink: "#1B2A3D",
  page: "#F7F3E8",
  card: "#FFFFFF",
  muted: "#5A6B80",
  faint: "#A9B8C7",
  border: "#D9DEE6",
  zebra: "#F7FAFD",
  track: "#DCE7F2",
  white: "#FFFFFF",
  navy: "#14315C",
  navyDeep: "#0E2444",
  navyTint: "#E4ECF6",
  gold: "#C9A227",
  goldBright: "#E8B923",
  goldDark: "#8A6D00",
  goldTint: "#FBF3D5",
  parchment: "#F7F3E8",
  parchmentDark: "#EFE7D2",
  green: "#2F7A44",
  greenDark: "#1F5230",
  greenTint: "#E6F0E7",
  red: "#C0392B",
  redDark: "#7E241A",
  redTint: "#FDECEA",
  slate: "#64748B",
  slateDark: "#3D4A5C",
  slateTint: "#EDF1F5",
} as const;

/** Vote option colours — the tally's traffic light, shared by all outputs. */
export const VOTE_COLORS = {
  for: { color: "#2F7A44", dark: "#1F5230", tint: "#E6F0E7" },
  against: { color: "#C0392B", dark: "#7E241A", tint: "#FDECEA" },
  abstain: { color: "#64748B", dark: "#3D4A5C", tint: "#EDF1F5" },
} as const;

export const daoTheme = defineTheme({
  colors: {
    background: C.page,
    foreground: C.ink,
    primary: C.navy,
    primaryForeground: "#FFFFFF",
    muted: C.muted,
    border: C.border,
  },
  fonts: {
    body: "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
    heading: "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
  },
  fontSizes: { body: 15 },
  lineHeights: { body: 1.6 },
  elements: {
    Heading: {
      by: {
        level: {
          1: { fontSize: 30, lineHeight: 1.2, mobile: { fontSize: 25 } },
          2: { fontSize: 20, lineHeight: 1.25, mobile: { fontSize: 18 } },
          // Section kickers: small, tracked-out, uppercase, muted.
          3: {
            fontSize: 12,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            color: "{colors.muted}",
          },
        },
      },
    },
    Button: {
      borderRadius: 999,
      hover: { backgroundColor: "#0E2444" },
    },
  },
  styles: {
    // The white card every content section lives in.
    card: {
      backgroundColor: "#FFFFFF",
      padding: 28,
      gap: 20,
      borderRadius: 16,
      border: "1px solid #D9DEE6",
    },
  },
});

/** Font files for the Document (PDF) and Canvas (share card) roots.
 *  The CLI's `render` loads them from the paths the template names; the
 *  Email and Page roots use the system stack from the theme instead.
 *  DejaVu ships only Regular (400) and Bold (700), but the theme's
 *  headings and badges use weight 800 — so each Bold file is registered
 *  for the whole 700–900 range, and 800 draws as Bold instead of warning
 *  about a missing file. */
export const PRINT_FONTS = [
  {
    family: "DejaVu Sans",
    src: "../assets/fonts/DejaVuSans.ttf",
    weight: 400 as const,
    style: "normal" as const,
  },
  {
    family: "DejaVu Sans",
    src: "../assets/fonts/DejaVuSans-Bold.ttf",
    weight: 700 as const,
    style: "normal" as const,
  },
  {
    // The renderers register a file per weight: the range string above did
    // not satisfy them, so Bold is registered again at 800 explicitly.
    family: "DejaVu Sans",
    src: "../assets/fonts/DejaVuSans-Bold.ttf",
    weight: 800 as const,
    style: "normal" as const,
  },
  {
    family: "DejaVu Sans Mono",
    src: "../assets/fonts/DejaVuSansMono.ttf",
    weight: 400 as const,
    style: "normal" as const,
  },
  {
    family: "DejaVu Sans Mono",
    src: "../assets/fonts/DejaVuSansMono-Bold.ttf",
    weight: 700 as const,
    style: "normal" as const,
  },
  {
    // Same as above: Bold registered again at 800 explicitly.
    family: "DejaVu Sans Mono",
    src: "../assets/fonts/DejaVuSansMono-Bold.ttf",
    weight: 800 as const,
    style: "normal" as const,
  },
];
