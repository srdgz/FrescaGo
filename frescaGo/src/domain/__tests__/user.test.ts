import { describe, expect, it } from "vitest";
import { countryName, isShippingCountry } from "../countries";
import {
  MIN_PASSWORD_LENGTH,
  checkNewPassword,
  formatShippingAddress,
  isPostalCode,
  isShippingAddressComplete,
  normalizeShippingAddress,
  profileFormOf,
  shippingDetailsOf,
} from "../user";
import { buyer, newcomer } from "../../test/fixtures";

const address = buyer.shippingAddress!;

describe("shipping address", () => {
  it("is complete only with street, postal code, city and a supported country", () => {
    expect(isShippingAddressComplete(address)).toBe(true);
    expect(isShippingAddressComplete(undefined)).toBe(false);
    expect(isShippingAddressComplete(null)).toBe(false);
    expect(isShippingAddressComplete({ ...address, street: "  " })).toBe(false);
    expect(isShippingAddressComplete({ ...address, city: "" })).toBe(false);
    expect(isShippingAddressComplete({ ...address, postalCode: "" })).toBe(false);
    expect(isShippingAddressComplete({ ...address, postalCode: "!!" })).toBe(false);
    expect(
      isShippingAddressComplete({ ...address, country: "XX" as never })
    ).toBe(false);
  });

  it("validates postal codes", () => {
    expect(isPostalCode("28013")).toBe(true);
    expect(isPostalCode("SW1A 1AA")).toBe(true);
    expect(isPostalCode("75008")).toBe(true);
    expect(isPostalCode("12")).toBe(false);
    expect(isPostalCode("1234567890123")).toBe(false);
    expect(isPostalCode("@@@@@")).toBe(false);
  });

  it("trims the fields before saving", () => {
    expect(
      normalizeShippingAddress({
        street: " Calle 1 ",
        postalCode: " 28001 ",
        city: " Madrid ",
        country: "ES",
      })
    ).toEqual({ street: "Calle 1", postalCode: "28001", city: "Madrid", country: "ES" });
  });

  it("lists the supported countries", () => {
    expect(isShippingCountry("ES")).toBe(true);
    expect(isShippingCountry("XX")).toBe(false);
    expect(isShippingCountry("España")).toBe(false);
  });

  it("names countries in each language", () => {
    expect(countryName("ES", "es")).toBe("España");
    expect(countryName("ES", "en")).toBe("Spain");
    expect(countryName("DE", "es")).toBe("Alemania");
  });

  it("formats an address for display", () => {
    expect(formatShippingAddress(address, "es")).toBe(
      "Calle Mayor 12, 3ºB, 28013 Madrid, España"
    );
    expect(formatShippingAddress(address, "en")).toBe(
      "Calle Mayor 12, 3ºB, 28013 Madrid, Spain"
    );
  });
});

describe("shipping details", () => {
  it("are built from a user with a complete address", () => {
    expect(shippingDetailsOf(buyer)).toEqual({
      recipient: "Ana Pérez",
      phone: "600123123",
      address,
    });
  });

  it("omit the phone when there is none", () => {
    const details = shippingDetailsOf({ ...buyer, phone: "  " });
    expect(details).not.toBeNull();
    expect("phone" in details!).toBe(false);
  });

  it("are missing for a user without address or without session", () => {
    expect(shippingDetailsOf(newcomer)).toBeNull();
    expect(shippingDetailsOf(null)).toBeNull();
    expect(
      shippingDetailsOf({ ...buyer, shippingAddress: { ...address, city: "" } })
    ).toBeNull();
  });

  it("need a recipient name", () => {
    expect(shippingDetailsOf({ ...buyer, firstName: "", lastName: "" })).toBeNull();
  });
});

describe("profile form", () => {
  it("starts from the saved profile", () => {
    expect(profileFormOf(buyer)).toEqual({
      avatar: "",
      firstName: "Ana",
      lastName: "Pérez",
      phone: "600123123",
      street: "Calle Mayor 12, 3ºB",
      postalCode: "28013",
      city: "Madrid",
      country: "ES",
    });
  });

  it("reuses the old free text address as the street", () => {
    expect(profileFormOf({ ...newcomer, address: "Calle Vieja 3" })).toMatchObject({
      street: "Calle Vieja 3",
      postalCode: "",
      city: "",
      country: "ES",
    });
  });

  it("is empty without a user", () => {
    expect(profileFormOf(null)).toMatchObject({ firstName: "", street: "", country: "ES" });
  });
});

describe("new password check", () => {
  it("accepts a long enough password that matches its confirmation", () => {
    expect(checkNewPassword("secret123", "secret123")).toBe("ok");
    expect(checkNewPassword("a".repeat(MIN_PASSWORD_LENGTH), "a".repeat(MIN_PASSWORD_LENGTH))).toBe("ok");
  });

  it("asks for at least eight characters", () => {
    expect(MIN_PASSWORD_LENGTH).toBe(8);
    expect(checkNewPassword("short12", "short12")).toBe("too-short");
    expect(checkNewPassword("", "")).toBe("too-short");
  });

  it("reports a mismatch only when the length is fine", () => {
    expect(checkNewPassword("secret123", "secret124")).toBe("mismatch");
    expect(checkNewPassword("secret123", "")).toBe("mismatch");
    expect(checkNewPassword("short", "different")).toBe("too-short");
  });

  it("is case and space sensitive", () => {
    expect(checkNewPassword("Secret123", "secret123")).toBe("mismatch");
    expect(checkNewPassword("secret123 ", "secret123")).toBe("mismatch");
  });
});
