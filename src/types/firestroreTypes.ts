export type Guest = {
  id: string; // user ID / doc ID
  name: string;
  company: string;
  seatNumber: string;
  qrCodeURL: string; // URL gambar barcode (misalnya dari Imgur)
  qrCodeDeleteHash: string;
  alreadyCheckedIn: boolean;
};

// 👇 Gambar-gambar di kuis
export type GuestQR = {
  url: string;
  deleteHash: string;
};
