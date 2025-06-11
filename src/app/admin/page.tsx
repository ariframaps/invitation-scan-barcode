"use client";

import { useEffect, useState } from "react";
import { deleteGuest, getAllGuests } from "@/services/guests";
import { Guest } from "@/types/firestroreTypes";
import { useRouter } from "next/navigation";
import { deleteImage } from "@/lib/generateQR";

export default function AdminGuestList() {
  const router = useRouter();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGuests() {
      try {
        const data = await getAllGuests();
        setGuests(data);
      } catch (error) {
        console.error("Gagal fetch guests:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGuests();
  }, []);

  const handleDeleteGuest = async (guestId: string, deleteHash: string) => {
    const confirm = window.confirm(
      "Yakin ingin hapus guest ini? QR Code juga akan dihapus!"
    );
    if (!confirm) return;

    try {
      await deleteImage(deleteHash); // Hapus QR dari Imgur
      await deleteGuest(guestId); // Hapus dari Firestore
      setGuests((prev) => prev.filter((g) => g.id !== guestId)); // Update UI
    } catch (err) {
      console.error("Gagal hapus:", err);
      alert("Gagal menghapus guest");
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="min-h-screen p-6 px-2 max-w-4xl mx-auto space-y-4">
      <div className="flex justify-around mb-10 items-center">
        <h1 className="text-3xl font-bold text-center">Guest List</h1>
        <button
          className="bg-blue-300 px-4 py-2 text-sm rounded hover:bg-blue-400"
          onClick={() => router.push("/admin/add-guest")}>
          Add Guest
        </button>
      </div>
      <div className="bg-gray-50 py-6 px-3 border-t">
        {guests.length === 0 && <p className="text-center">Tidak ada guest.</p>}

        {guests.map((guest) => (
          <div
            key={guest.id}
            className="bg-white rounded shadow p-4 mb-3 flex sm:items-center justify-between flex-col sm:flex-row items-start">
            <div className="flex items-center space-x-4">
              <img
                src={guest.qrCodeURL}
                alt={`${guest.name} QR Code`}
                className="size-20 sm:size-auto object-contain border rounded"
              />

              <div>
                <p className="font-semibold text-lg">{guest.name}</p>
                <p className="italic">ID: {guest.id}</p>
                <p className="text-gray-600">Company: {guest.company}</p>
                <p className="text-gray-600">Seat: {guest.seatNumber}</p>
                <p className="text-sm text-green-600">
                  {guest.alreadyCheckedIn ? "Sudah Check-in" : "Belum Check-in"}
                </p>
              </div>
            </div>

            {/* Tombol Delete */}
            <button
              onClick={() =>
                handleDeleteGuest(guest.id, guest.qrCodeDeleteHash)
              }
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 self-end sm:self-auto">
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
