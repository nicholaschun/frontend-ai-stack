import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

/**
 * Typeface roles for Keystone.
 *
 * - Display — Space Grotesk: a geometric grotesque with just enough quirk in
 *   its terminals to feel engineered rather than corporate. Used with restraint
 *   for headings and the wordmark only.
 * - Body — IBM Plex Sans: highly legible at UI sizes, technical lineage that
 *   pairs with the display face without competing.
 * - Mono — IBM Plex Mono: shares the Plex skeleton; carries data, code, and the
 *   uppercase "eyebrow" labels that are part of the visual signature.
 *
 * Exposed as CSS variables (`--ff-*`) and mapped to Tailwind's font tokens in
 * globals.css. Self-hosted by next/font — no external requests, no layout shift.
 */

export const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--ff-display",
  display: "swap",
});

export const fontSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--ff-body",
  display: "swap",
});

export const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--ff-mono",
  display: "swap",
});

export const fontVariables = `${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`;
