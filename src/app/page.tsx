"use client";

import { useEffect, useRef, useState } from "react";

type User = {
  id: string;
  name: string;
};

type CheckIn = {
  id: string;
  name: string;
  time: string;
};
export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Simulasi data user
    const dummyUsers: User[] = [
      { id: "123ABC", name: "John Doe" },
      { id: "456DEF", name: "Jane Smith" },
      { id: "789GHI", name: "Alice Johnson" },
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
        time: new Date().toLocaleTimeString(),
      };

      // Cegah double scan
      const alreadyChecked = checkIns.find((c) => c.id === user.id);
      if (!alreadyChecked) {
        setCheckIns((prev) => [...prev, newCheckIn]);
      }
    } else {
      alert("User tidak ditemukan!");
    }

    e.target.value = "";
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Scan Barcode</h1>

        {/* Hidden input for scanner */}
        <input
          ref={inputRef}
          type="text"
          onChange={handleScan}
          className="opacity-0 absolute"
          autoFocus
        />

        {/* Check-in List */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Check-in List:</h2>
          <ul className="space-y-2">
            {checkIns.map((c, i) => (
              <li key={i} className="border p-2 rounded bg-green-100">
                <strong>{c.name}</strong> - <span>{c.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
