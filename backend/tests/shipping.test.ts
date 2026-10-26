import { describe, expect, it } from "vitest";
import {
  InvalidShippingError,
  parseShippingInfo,
} from "../src/domain/shipping.js";

const valid = {
  recipient: "Ana Pérez",
  phone: "+34 600 123 123",
  street: "Calle Mayor 12, 3ºB",
  postalCode: "28013",
  city: "Madrid",
  country: "ES",
};

describe("shipping info", () => {
  it("accepts a complete address and trims it", () => {
    expect(
      parseShippingInfo({ ...valid, street: "  Calle Mayor 12  ", city: " Madrid " })
    ).toMatchObject({ street: "Calle Mayor 12", city: "Madrid", country: "ES" });
  });

  it("makes the phone optional", () => {
    expect(parseShippingInfo({ ...valid, phone: "" }).phone).toBeUndefined();
    expect(parseShippingInfo({ ...valid, phone: undefined }).phone).toBeUndefined();
  });

  it.each([
    ["nothing", undefined],
    ["a string", "Calle Mayor"],
    ["a missing recipient", { ...valid, recipient: "" }],
    ["a blank street", { ...valid, street: "   " }],
    ["a missing city", { ...valid, city: undefined }],
    ["a bad postal code", { ...valid, postalCode: "!!" }],
    ["a postal code that is too long", { ...valid, postalCode: "123456789012" }],
    ["an unsupported country", { ...valid, country: "XX" }],
    ["a country name instead of a code", { ...valid, country: "España" }],
    ["a bad phone", { ...valid, phone: "call me" }],
    ["a street over the limit", { ...valid, street: "x".repeat(201) }],
    ["a non string field", { ...valid, city: 42 }],
  ])("rejects %s", (_label, input) => {
    expect(() => parseShippingInfo(input)).toThrow(InvalidShippingError);
  });
});
