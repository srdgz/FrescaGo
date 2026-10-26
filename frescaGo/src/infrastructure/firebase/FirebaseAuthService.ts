import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import type { AuthService } from "../../application/ports";
import { AuthError } from "../../domain/user";
import type { AuthErrorCode } from "../../domain/user";
import { auth } from "./client";

const KNOWN_CODES: AuthErrorCode[] = [
  "user-not-found",
  "wrong-password",
  "invalid-email",
  "invalid-credential",
  "missing-password",
  "weak-password",
  "email-already-in-use",
];

export const toAuthError = (error: unknown): AuthError => {
  const raw = String((error as { code?: string })?.code ?? "").replace(
    "auth/",
    ""
  );
  const code = KNOWN_CODES.find((known) => known === raw) ?? "unknown";
  return new AuthError(code);
};

export const createFirebaseAuthService = (): AuthService => ({
  async signIn(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw toAuthError(error);
    }
  },

  async register(email, password) {
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return credential.user.uid;
    } catch (error) {
      throw toAuthError(error);
    }
  },

  signOut: () => auth.signOut(),

  async setPhoto(url) {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { photoURL: url });
    }
  },

  onChange: (listener) =>
    onAuthStateChanged(auth, (user) => listener(user?.uid)),
});
