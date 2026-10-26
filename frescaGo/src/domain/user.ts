import { DEFAULT_COUNTRY, countryName, isShippingCountry } from "./countries";
import type { ShippingCountry } from "./countries";
import type { Locale } from "./locale";

export interface ShippingAddress {
  street: string;
  postalCode: string;
  city: string;
  country: ShippingCountry;
}

export interface ShippingDetails {
  recipient: string;
  phone?: string;
  address: ShippingAddress;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  address?: string;
  phone?: string;
  shippingAddress?: ShippingAddress;
}

export interface ProfileForm {
  avatar: string;
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  postalCode: string;
  city: string;
  country: ShippingCountry;
}

export interface Registration {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export type AuthErrorCode =
  | "user-not-found"
  | "wrong-password"
  | "invalid-email"
  | "invalid-credential"
  | "missing-password"
  | "weak-password"
  | "email-already-in-use"
  | "unknown";

export class AuthError extends Error {
  constructor(public readonly code: AuthErrorCode) {
    super(code);
  }
}

const POSTAL_CODE = /^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/;

export const isPostalCode = (value: string): boolean =>
  POSTAL_CODE.test(value.trim());

export const isShippingAddressComplete = (
  address: Partial<ShippingAddress> | null | undefined
): address is ShippingAddress =>
  Boolean(
    address &&
      address.street?.trim() &&
      address.city?.trim() &&
      address.postalCode &&
      isPostalCode(address.postalCode) &&
      isShippingCountry(address.country)
  );

export const normalizeShippingAddress = (
  form: Pick<ProfileForm, "street" | "postalCode" | "city" | "country">
): ShippingAddress => ({
  street: form.street.trim(),
  postalCode: form.postalCode.trim(),
  city: form.city.trim(),
  country: form.country,
});

export const profileFormOf = (user: User | null): ProfileForm => ({
  avatar: user?.avatar || "",
  firstName: user?.firstName || "",
  lastName: user?.lastName || "",
  phone: user?.phone || "",
  street: user?.shippingAddress?.street || user?.address || "",
  postalCode: user?.shippingAddress?.postalCode || "",
  city: user?.shippingAddress?.city || "",
  country: user?.shippingAddress?.country || DEFAULT_COUNTRY,
});

export const recipientOf = (
  user: Pick<User, "firstName" | "lastName">
): string => `${user.firstName} ${user.lastName}`.trim();

export const shippingDetailsOf = (user: User | null): ShippingDetails | null => {
  if (!user || !isShippingAddressComplete(user.shippingAddress)) {
    return null;
  }
  const recipient = recipientOf(user);
  if (!recipient) {
    return null;
  }
  return {
    recipient,
    ...(user.phone?.trim() ? { phone: user.phone.trim() } : {}),
    address: user.shippingAddress,
  };
};

export const formatShippingAddress = (
  address: ShippingAddress,
  locale: Locale
): string =>
  `${address.street}, ${address.postalCode} ${address.city}, ${countryName(address.country, locale)}`;
