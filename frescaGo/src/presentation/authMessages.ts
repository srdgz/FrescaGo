import type { AuthErrorCode } from "../domain/user";

const LOGIN_CODES: AuthErrorCode[] = [
  "user-not-found",
  "wrong-password",
  "invalid-email",
  "invalid-credential",
];

const REGISTRATION_CODES: AuthErrorCode[] = [
  "invalid-email",
  "missing-password",
  "weak-password",
  "email-already-in-use",
];

export const loginErrorKey = (code: AuthErrorCode): string =>
  LOGIN_CODES.includes(code) ? `auth.login.${code}` : "auth.unknown";

export const registrationErrorKey = (code: AuthErrorCode): string =>
  REGISTRATION_CODES.includes(code)
    ? `auth.registration.${code}`
    : "auth.unknown";
