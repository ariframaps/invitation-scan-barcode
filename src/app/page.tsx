"use client";

import { useEffect, useRef, useState } from "react";

type User = {
  id: string; // isi barcode
  name: string;
  company: string;
  seatNumber: string;
};

type CheckIn = {
  id: string;
  name: string;
  company: string;
  seatNumber: string;
  time: string;
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<CheckIn | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Simulasi data user
    const dummyUsers: User[] = [
      { id: "123ABC", name: "John Doe", company: "TechCorp", seatNumber: "A1" },
      {
        id: "456DEF",
        name: "Jane Smith",
        company: "CodeInc",
        seatNumber: "B2",
      },
      {
        id: "789GHI",
        name: "Alice Johnson",
        company: "DevHouse",
        seatNumber: "C3",
      },
    ];

    setUsers(dummyUsers);

    // Fokuskan ke input saat halaman dibuka
    inputRef.current?.focus();
  }, []);

  const handleScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const scannedId = e.target.value.trim();
    const user = users.find((u) => u.id === scannedId);

    if (user) {
      const newCheckIn: CheckIn = {
        id: user.id,
        name: user.name,
        company: user.company,
        seatNumber: user.seatNumber,
        time: new Date().toLocaleTimeString(),
      };

      const alreadyChecked = checkIns.find((c) => c.id === user.id);
      if (!alreadyChecked) {
        setCheckIns((prev) => [...prev, newCheckIn]);
      }
    } else {
      alert("User tidak ditemukan!");
    }

    e.target.value = "";
  };

  const handlePrint = (ticket: CheckIn) => {
    setSelectedTicket(ticket);
    setTimeout(() => {
      window.print();
      // Fokuskan input supaya bisa scan lagi
      inputRef.current?.focus();
      // Reset selectedTicket supaya tombol print hilang kalau mau
      setSelectedTicket(null);
    }, 100);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="p-4 w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center">Scan Barcode</h1>

        <input
          ref={inputRef}
          type="text"
          onChange={handleScan}
          className="opacity-0 absolute"
          autoFocus
        />

        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Check-in List:</h2>
          <ul className="space-y-3">
            {checkIns.map((c, i) => (
              <li key={i} className="p-3 border rounded bg-green-100">
                <div>
                  <div>
                    <strong>{c.name}</strong>
                  </div>
                  <div>Perusahaan: {c.company}</div>
                  <div>Kursi: {c.seatNumber}</div>
                  <div>Waktu: {c.time}</div>
                </div>
                <button
                  onClick={() => handlePrint(c)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Print Tiket
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tiket yang hanya muncul saat print */}
      {selectedTicket && (
        <div
          id="ticket"
          className="hidden print:block p-6 border w-72 fixed top-10 left-1/2 -translate-x-1/2 bg-white"
          style={{ boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}>
          <h2 className="text-xl font-bold mb-4">Tiket Masuk</h2>
          <p>
            <strong>Nama:</strong> {selectedTicket.name}
          </p>
          <p>
            <strong>Perusahaan:</strong> {selectedTicket.company}
          </p>
          <p>
            <strong>Kursi:</strong> {selectedTicket.seatNumber}
          </p>
          <p>
            <strong>Waktu Check-in:</strong> {selectedTicket.time}
          </p>
        </div>
      )}

      <style>{`
        @media print {
          @page {
            size: A6; /* ukuran tiket kecil, sesuaikan */
            margin: 10mm;
          }
          body * {
            visibility: hidden;
          }
          #ticket, #ticket * {
            visibility: visible;
          }
          #ticket {
            // position: absolute;
            // top: 0;
            // left: 0;
            margin: 0 auto;
            width: 300px;
          }
        }
      `}</style>
    </div>
  );
}
