"use client";

import { useState } from "react";
import { addGuest, updateGuestQR } from "@/services/guests";
import { generateQRImage } from "@/lib/generateQR";
import { Guest } from "@/types/firestroreTypes";
import { useRouter } from "next/navigation";

export default function AddGuestPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    company: "",
    seatNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // const userId = uuidv4(); // generate ID unik
    // const qr = await generateQRImage(userId);

    const newGuest: Omit<Guest, "id"> = {
      name: form.name,
      company: form.company,
      seatNumber: form.seatNumber,
      qrCodeURL: "",
      qrCodeDeleteHash: "",
      alreadyCheckedIn: false,
    };

    try {
      const guestId = await addGuest(newGuest);

      // 2. Generate QR pakai ID-nya
      const qr = await generateQRImage(guestId);
      if (!qr) {
        alert("Gagal buat QR Code");
        setLoading(false);
        return;
      }

      // 3. Update guest dengan QR code URL dan deleteHash
      await updateGuestQR(guestId, qr);

      setSuccessMessage("Guest berhasil ditambahkan!");
      setForm({ name: "", company: "", seatNumber: "" });
      router.push("/admin");
    } catch (err) {
      console.error("Error tambah guest:", err);
      alert("Gagal tambah guest");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 max-w-md mx-auto">
      <button
        onClick={() => router.back()}
        className="cursor-pointer w-full flex items-center gap-2 text-blue-600 hover:text-blue-800">
        {/* SVG panah kiri */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>
      <h1 className="text-2xl font-bold my-6">Tambah Guest Baru</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full bg-white p-6 rounded shadow space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Nama"
          className="w-full border border-gray-300 p-2 rounded"
        />

        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          required
          placeholder="Company"
          className="w-full border border-gray-300 p-2 rounded"
        />

        <input
          name="seatNumber"
          value={form.seatNumber}
          onChange={handleChange}
          required
          placeholder="Seat Number"
          className="w-full border border-gray-300 p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {loading ? "Menyimpan..." : "Tambah Guest"}
        </button>

        {successMessage && (
          <div className="text-green-600 font-medium mt-2">
            {successMessage}
          </div>
        )}
      </form>
    </div>
  );
}
