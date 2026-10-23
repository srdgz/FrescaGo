import { readdirSync, readFileSync, statSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import en from "../messages/en.json";
import es from "../messages/es.json";

type Tree = { [key: string]: string | Tree };

const flatten = (tree: Tree, prefix = ""): Record<string, string> =>
  Object.entries(tree).reduce<Record<string, string>>((acc, [key, value]) => {
    const full = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string"
      ? { ...acc, [full]: value }
      : { ...acc, ...flatten(value, full) };
  }, {});

const spanish = flatten(es as Tree);
const english = flatten(en as Tree);

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) {
      return name === "__tests__" ? [] : sourceFiles(full);
    }
    return /\.(ts|tsx)$/.test(name) && !/\.test\./.test(name) ? [full] : [];
  });

const placeholders = (text: string) =>
  [...text.matchAll(/{{\s*(\w+)\s*}}/g)].map((match) => match[1]).sort();

describe("translations", () => {
  it("define the same keys in both languages", () => {
    expect(Object.keys(english).sort()).toEqual(Object.keys(spanish).sort());
  });

  it("have no empty values", () => {
    for (const [key, value] of Object.entries({ ...spanish, ...english })) {
      expect(value.trim(), key).not.toBe("");
    }
  });

  it("use the same interpolation placeholders", () => {
    for (const key of Object.keys(spanish)) {
      expect(placeholders(english[key]), key).toEqual(placeholders(spanish[key]));
    }
  });

  it("cover every key used in the source", () => {
    const root = path.resolve(import.meta.dirname, "../../..");
    const used = sourceFiles(root).flatMap((file) =>
      [...readFileSync(file, "utf8").matchAll(/\bt\(\s*"([\w.-]+)"/g)].map(
        (match) => match[1]
      )
    );
    expect(used.length).toBeGreaterThan(50);
    const missing = used.filter((key) => !(key in spanish));
    expect(missing).toEqual([]);
  });
});
