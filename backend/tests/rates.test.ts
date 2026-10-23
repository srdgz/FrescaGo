import { describe, expect, it, vi } from "vitest";
import { createFrankfurterRateProvider } from "../src/infrastructure/rates/FrankfurterRateProvider.js";

const liveResponse = (usd: number) =>
  ({
    ok: true,
    status: 200,
    json: async () => ({ date: "2026-10-23", rates: { USD: usd } }),
  }) as Response;

const HOUR = 60 * 60 * 1000;

describe("Frankfurter rate provider", () => {
  it("returns the live rate and caches it for twelve hours", async () => {
    let clock = 0;
    const fetchImpl = vi.fn().mockResolvedValue(liveResponse(1.1));
    const provider = createFrankfurterRateProvider({
      fetchImpl,
      now: () => clock,
    });

    expect(await provider.getRate()).toEqual({
      usdPerEur: 1.1,
      date: "2026-10-23",
      source: "ecb",
    });
    clock = 11 * HOUR;
    await provider.getRate();
    expect(fetchImpl).toHaveBeenCalledTimes(1);

    clock = 13 * HOUR;
    await provider.getRate();
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("uses the fallback rate when the service is down and nothing is cached", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const provider = createFrankfurterRateProvider({
      fetchImpl: vi.fn().mockRejectedValue(new Error("offline")),
      getFallbackRate: () => 1.2,
    });

    expect(await provider.getRate()).toMatchObject({
      usdPerEur: 1.2,
      source: "fallback",
    });
  });

  it("keeps serving the last live rate when a refresh fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    let clock = 0;
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(liveResponse(1.1))
      .mockRejectedValueOnce(new Error("offline"));
    const provider = createFrankfurterRateProvider({
      fetchImpl,
      now: () => clock,
    });

    await provider.getRate();
    clock = 13 * HOUR;

    expect(await provider.getRate()).toMatchObject({
      usdPerEur: 1.1,
      source: "ecb",
    });
  });

  it("rejects malformed responses and falls back", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const provider = createFrankfurterRateProvider({
      fetchImpl: vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ rates: {} }),
      } as Response),
      getFallbackRate: () => 1.05,
    });

    expect((await provider.getRate()).source).toBe("fallback");
  });
});
