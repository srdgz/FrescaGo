export const SHIPPING_COUNTRIES = [
  "ES",
  "PT",
  "FR",
  "IT",
  "DE",
  "GB",
  "US",
] as const;

export type ShippingCountry = (typeof SHIPPING_COUNTRIES)[number];

export interface ShippingInfo {
  recipient: string;
  phone?: string;
  street: string;
  postalCode: string;
  city: string;
  country: ShippingCountry;
}

export class InvalidShippingError extends Error {
  constructor() {
    super("Dirección de envío no válida.");
  }
}

const POSTAL_CODE = /^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/;
const PHONE = /^[0-9+()\s-]{6,20}$/;

const text = (value: unknown, max: number): string => {
  if (typeof value !== "string") {
    throw new InvalidShippingError();
  }
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > max) {
    throw new InvalidShippingError();
  }
  return trimmed;
};

export const parseShippingInfo = (input: unknown): ShippingInfo => {
  if (typeof input !== "object" || input === null) {
    throw new InvalidShippingError();
  }
  const data = input as Record<string, unknown>;

  const postalCode = text(data.postalCode, 10);
  const country = SHIPPING_COUNTRIES.find((code) => code === data.country);
  if (!POSTAL_CODE.test(postalCode) || !country) {
    throw new InvalidShippingError();
  }

  let phone: string | undefined;
  if (typeof data.phone === "string" && data.phone.trim() !== "") {
    phone = data.phone.trim();
    if (!PHONE.test(phone)) {
      throw new InvalidShippingError();
    }
  }

  return {
    recipient: text(data.recipient, 100),
    phone,
    street: text(data.street, 200),
    postalCode,
    city: text(data.city, 100),
    country,
  };
};
