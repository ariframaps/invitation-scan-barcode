"use client";

import { getAllGuests, markGuestAsCheckedIn } from "@/services/guests";
import { Guest } from "@/types/firestroreTypes";
import { useEffect, useRef, useState } from "react";

type GuestWithTempStatus = Guest & { justCheckedIn?: boolean };

export default function Home() {
  const [guests, setGuests] = useState<GuestWithTempStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Guest | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadGuests() {
      const data = await getAllGuests();
      setGuests(data);
      setLoading(false);
    }
    loadGuests();

    // Fokuskan ke input saat halaman dibuka
    inputRef.current?.focus();
  }, []);

  // Fokus otomatis saat mount
  useEffect(() => {
    inputRef.current?.focus();

    const keepFocus = () => {
      // Cek kalau tombol print ga lagi di-click
      if (document.activeElement !== inputRef.current) {
        inputRef.current?.focus();
      }
    };

    const interval = setInterval(keepFocus, 500); // jaga fokus tiap 0.5 detik

    return () => clearInterval(interval);
  }, []);

  let scanTimer: ReturnType<typeof setTimeout>;

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const scannedId = e.target.value.trim();
    clearTimeout(scanTimer);

    scanTimer = setTimeout(() => {
      const guestIndex = guests.findIndex((g) => g.id === scannedId);

      if (guestIndex !== -1) {
        const guest = guests[guestIndex];

        if (!guest.alreadyCheckedIn) {
          markGuestAsCheckedIn(guest.id);
          const updatedGuest = {
            ...guest,
            alreadyCheckedIn: true,
          };

          const newGuests = [...guests];

          newGuests.splice(guestIndex, 1); // hapus dari posisi lama
          console.log([updatedGuest, ...newGuests]);
          setGuests([updatedGuest, ...newGuests]); // taruh di paling atas
        } else {
          alert("Guest sudah check-in!");
        }
      } else {
        alert("Guest tidak ditemukan!");
      }

      e.target.value = "";
    }, 1500);
  };

  const handlePrint = (guest: Guest) => {
    setSelectedTicket(guest);
    setTimeout(() => {
      window.print();
      inputRef.current?.focus();
      setSelectedTicket(null);
    }, 100);
  };

  if (loading) return <p className="text-center mt-8 w-full">Loading...</p>;

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
          disabled={loading}
          className="opacity-1 absolute"
          autoFocus
        />

        {/* LIST CHECK-IN */}
        <div className="w-full max-w-[90vw] xs:max-w-[80vw] sm:max-w-3xl h-[65vh] overflow-y-scroll">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Check-in Information:
          </h2>
          <ul className="space-y-4">
            {guests.map(
              (c, i) =>
                c.alreadyCheckedIn && (
                  <li
                    key={i}
                    className={`overflow-hidden bg-white border border-gray-300 rounded-lg shadow-sm flex justify-between items-stretch flex-wrap md:flex-nowrap ${
                      c.justCheckedIn ? "bg-green-500" : "bg-white"
                    }`}>
                    <div className="flex-1 min-w-[60%] p-4">
                      <div className="font-semibold text-gray-800">
                        checkin : {c.justCheckedIn}
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
                )
            )}
          </ul>
        </div>
      </main>

      {/* TIKET SAAT PRINT */}
      {selectedTicket && (
        <div
          id="ticket"
          className="hidden print:block p-6 border w-72 fixed top-10 left-1/2 -translate-x-1/2 bg-white"
          // style={{ boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}
        >
          {/* <img
            src="/MKO.png"
            alt="Logo"
            style={{ width: "80px", marginBottom: "10px" }}
          /> */}

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
