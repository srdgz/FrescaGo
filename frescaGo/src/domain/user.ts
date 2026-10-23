export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  address?: string;
  phone?: string;
}

export interface ProfileForm {
  avatar: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
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
