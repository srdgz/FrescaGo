import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import type { OrderRepository } from "../../application/ports";
import type { Order } from "../../domain/order";
import { db } from "./client";

export const createFirestoreOrderRepository = (): OrderRepository => ({
  async list(email) {
    const snapshot = await getDoc(doc(db, "orders", email));
    return snapshot.exists() ? (snapshot.data()?.orders ?? []) : [];
  },

  async add(email, order: Order) {
    const reference = doc(db, "orders", email);
    const snapshot = await getDoc(reference);
    if (snapshot.exists()) {
      await updateDoc(reference, { orders: arrayUnion(order) });
    } else {
      await setDoc(reference, { orders: [order] });
    }
  },
});
