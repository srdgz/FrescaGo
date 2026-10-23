import type { AuthErrorCode } from "../domain/user";

const FALLBACK = "Algo no ha funcionado. Por favor, inténtalo de nuevo";

const loginMessages: Partial<Record<AuthErrorCode, string>> = {
  "user-not-found": "No hay ningún usuario registrado con este email",
  "wrong-password": "Contraseña incorrecta",
  "invalid-email": "Por favor, introduce un email válido",
  "invalid-credential": "El email o la contraseña no coinciden",
};

const registrationMessages: Partial<Record<AuthErrorCode, string>> = {
  "invalid-email": "Por favor, introduce un email válido",
  "missing-password": "Por favor, introduce una contraseña",
  "weak-password": "La contraseña debe tener al menos 6 caracteres",
  "email-already-in-use":
    "Este email ya está registrado. Por favor, prueba con otro",
};

export const loginErrorMessage = (code: AuthErrorCode): string =>
  loginMessages[code] ?? FALLBACK;

export const registrationErrorMessage = (code: AuthErrorCode): string =>
  registrationMessages[code] ?? FALLBACK;
