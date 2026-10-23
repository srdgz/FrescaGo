import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import type { UserRepository } from "../../application/ports";
import type { User } from "../../domain/user";
import { db } from "./client";

export const createFirestoreUserRepository = (): UserRepository => ({
  async get(uid) {
    const snapshot = await getDoc(doc(db, "users", uid));
    return snapshot.exists() ? (snapshot.data() as User) : null;
  },

  async create(user) {
    await setDoc(doc(db, "users", user.id), user);
  },

  async update(uid, changes) {
    await updateDoc(doc(db, "users", uid), changes);
  },
});
