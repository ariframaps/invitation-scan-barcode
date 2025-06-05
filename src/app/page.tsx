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

  let scanTimer: ReturnType<typeof setTimeout>;

  const handleScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const scannedId = e.target.value.trim();

    clearTimeout(scanTimer); // reset timer setiap karakter masuk

    scanTimer = setTimeout(() => {
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

      e.target.value = ""; // kosongkan input setelah proses
    }, 1500); // delay 300ms setelah input terakhir
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* HEADER */}
      <header className="w-full">
        <img
          src="/MKO-BANNER-DIGITAL-FOR-WEB-QR.jpg"
          alt="Event Banner"
          className="w-full object-cover shadow-md rounded-b-none"
        />
      </header>

      {/* KONTEN */}
      <main className="flex flex-col items-center w-full py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 sm:mb-20 text-center text-gray-800">
          Guest Registration
        </h1>

        {/* INPUT HIDDEN */}
        <input
          ref={inputRef}
          type="text"
          onChange={handleScan}
          className="opacity-0 absolute"
          autoFocus
        />

        {/* LIST CHECK-IN */}
        <div className="w-full max-w-[90vw] xs:max-w-[80vw] sm:max-w-3xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Check-in Information:
          </h2>
          <ul className="space-y-4">
            {checkIns.map((c, i) => (
              <li
                key={i}
                className="overflow-hidden bg-white border border-gray-300 rounded-lg shadow-sm flex justify-between items-stretch flex-wrap md:flex-nowrap">
                <div className="flex-1 min-w-[60%] p-4">
                  <div className="font-semibold text-gray-800">
                    Name : {c.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Company : {c.company}
                  </div>
                  <div className="text-sm text-gray-600">
                    Seat No. : {c.seatNumber}
                  </div>
                  {/* <div className="text-sm text-gray-500">Waktu: {c.time}</div> */}
                </div>
                <button
                  onClick={() => handlePrint(c)}
                  className="md:mt-0 ml-0 md:ml-4 px-8 py-1 text-sm bg-[#29A5DF] text-white rounded hover:bg-black">
                  Print
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* TIKET SAAT PRINT */}
      {selectedTicket && (
        <div
          id="ticket"
          className="hidden print:block p-6 border w-72 fixed top-10 left-1/2 -translate-x-1/2 bg-white"
          style={{ boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}>
          <img
            src="/MKO.png"
            alt="Logo"
            style={{ width: "80px", marginBottom: "10px" }}
          />

          <h2 className="text-xl font-bold mb-4">Ticket</h2>
          <p>
            <strong>Name :</strong> {selectedTicket.name}
          </p>
          <p>
            <strong>Company :</strong> {selectedTicket.company}
          </p>
          <p>
            <strong>Seat No. :</strong> {selectedTicket.seatNumber}
          </p>
        </div>
      )}
    </div>
  );
}
