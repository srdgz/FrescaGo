import { readFileSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

type Tokens = Record<string, [number, number, number]>;

const css = readFileSync(path.resolve(import.meta.dirname, "../theme.css"), "utf8");

const parseBlock = (block: string): Tokens => {
  const tokens: Tokens = {};
  for (const match of block.matchAll(/--([\w-]+):\s*(\d+)\s+(\d+)\s+(\d+);/g)) {
    tokens[match[1]] = [Number(match[2]), Number(match[3]), Number(match[4])];
  }
  return tokens;
};

const lightBlock = css.match(/^:root \{([\s\S]*?)\n\}/m)?.[1] ?? "";
const mediaBlock =
  css.match(/@media \(prefers-color-scheme: dark\) \{\s*:root:not\(\[data-theme="light"\]\) \{([\s\S]*?)\n {2}\}/)?.[1] ?? "";
const attributeBlock =
  css.match(/:root\[data-theme="dark"\] \{([\s\S]*?)\n\}/)?.[1] ?? "";

const light = parseBlock(lightBlock);
const dark = { ...light, ...parseBlock(mediaBlock) };

const channel = (value: number) => {
  const scaled = value / 255;
  return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
};

const luminance = ([r, g, b]: [number, number, number]) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

const ratio = (a: [number, number, number], b: [number, number, number]) => {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
};

const WHITE: [number, number, number] = [255, 255, 255];

const textPairs: [string, string, string][] = [
  ["ink", "canvas", "body text"],
  ["ink", "surface", "text on cards"],
  ["ink", "soft", "text on tinted panels"],
  ["gray-900", "surface", "strong text"],
  ["gray-800", "surface", "headings"],
  ["gray-700", "surface", "secondary text"],
  ["gray-600", "canvas", "muted text"],
  ["gray-600", "surface", "muted text on cards"],
  ["gray-600", "soft", "muted text on panels"],
  ["gray-500", "canvas", "placeholders and hints"],
  ["gray-500", "surface", "hints on cards"],
  ["brand", "canvas", "links and brand text"],
  ["brand", "surface", "brand text on cards"],
  ["brand", "soft", "brand text on panels"],
  ["accent", "canvas", "prices"],
  ["accent", "surface", "prices on cards"],
  ["accent", "soft", "prices on panels"],
  ["accent", "accent-soft", "chips"],
  ["danger", "danger-soft", "error messages"],
  ["danger", "surface", "error text"],
  ["gray-700", "gray-300", "disabled button"],
];

const uiPairs: [string, string, string][] = [
  ["gray-400", "surface", "input border on cards"],
  ["gray-400", "canvas", "input border on page"],
  ["brand", "canvas", "focus ring"],
  ["brand", "surface", "focus ring on cards"],
];

const themes: [string, Tokens][] = [
  ["light", light],
  ["dark", dark],
];

describe("theme contrast", () => {
  for (const [name, tokens] of themes) {
    describe(name, () => {
      it.each(textPairs)("%s on %s reaches 4.5:1 (%s)", (foreground, background) => {
        expect(ratio(tokens[foreground], tokens[background])).toBeGreaterThanOrEqual(4.5);
      });

      it.each(uiPairs)("%s against %s reaches 3:1 (%s)", (foreground, background) => {
        expect(ratio(tokens[foreground], tokens[background])).toBeGreaterThanOrEqual(3);
      });

      it("keeps white text readable on primary buttons", () => {
        expect(ratio(WHITE, tokens.primary)).toBeGreaterThanOrEqual(4.5);
        expect(ratio(WHITE, tokens["primary-strong"])).toBeGreaterThanOrEqual(4.5);
      });
    });
  }

  it("really parses both palettes", () => {
    expect(Object.keys(light).length).toBeGreaterThan(20);
    expect(Object.keys(parseBlock(mediaBlock)).length).toBeGreaterThan(15);
    expect(dark.canvas).not.toEqual(light.canvas);
    expect(dark.brand).not.toEqual(light.brand);
  });

  it("defines the same dark tokens for the system and the manual switch", () => {
    expect(parseBlock(attributeBlock)).toEqual(parseBlock(mediaBlock));
  });

  it("defines every dark token as a light token", () => {
    for (const key of Object.keys(parseBlock(mediaBlock))) {
      expect(light[key], key).toBeDefined();
    }
  });
});
