// services/guests.ts

import { db } from "@/lib/firebase.browser";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Guest } from "@/types/firestroreTypes";

const guestsCollection = collection(db, "guests");

// Ambil semua data guests
export const getAllGuests = async (): Promise<Guest[]> => {
  const snapshot = await getDocs(guestsCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Guest[];
};

// Tambah guest baru
export const addGuest = async (guest: Omit<Guest, "id">): Promise<string> => {
  const docRef = await addDoc(guestsCollection, guest);
  return docRef.id;
};

// Update field alreadyCheckedIn jadi true
export const markGuestAsCheckedIn = async (id: string): Promise<void> => {
  const guestRef = doc(db, "guests", id);
  await updateDoc(guestRef, { alreadyCheckedIn: true });
};

export const updateGuestQR = async (
  guestId: string,
  qr: { url: string; deleteHash: string }
) => {
  const guestRef = doc(db, "guests", guestId);
  await updateDoc(guestRef, {
    qrCodeURL: qr.url,
    qrCodeDeleteHash: qr.deleteHash,
  });
};

// Hapus guest by ID
export const deleteGuest = async (guestId: string) => {
  const guestRef = doc(db, "guests", guestId);
  await deleteDoc(guestRef);
};
