import { readdirSync, readFileSync, statSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

const srcDir = path.resolve(import.meta.dirname, "../src");

const forbidden: Record<string, string[]> = {
  domain: ["application", "infrastructure"],
  application: ["infrastructure"],
};

const listFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? listFiles(full) : [full];
  });

const importsOf = (file: string) =>
  [...readFileSync(file, "utf8").matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]);

describe("dependency rule", () => {
  for (const [layer, blocked] of Object.entries(forbidden)) {
    it(`${layer} does not depend on ${blocked.join(" or ")}`, () => {
      const offenders = listFiles(path.join(srcDir, layer)).flatMap((file) =>
        importsOf(file)
          .filter((spec) => blocked.some((b) => spec.includes(`/${b}/`)))
          .map((spec) => `${path.relative(srcDir, file)} -> ${spec}`)
      );
      expect(offenders).toEqual([]);
    });
  }

  it("domain and application import no third-party packages", () => {
    const offenders = ["domain", "application"].flatMap((layer) =>
      listFiles(path.join(srcDir, layer)).flatMap((file) =>
        importsOf(file)
          .filter((spec) => !spec.startsWith("."))
          .map((spec) => `${path.relative(srcDir, file)} -> ${spec}`)
      )
    );
    expect(offenders).toEqual([]);
  });
});
