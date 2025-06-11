import { GuestQR } from "@/types/firestroreTypes";
import QRCode from "qrcode";

export const generateQRImage = async (
  userId: string
): Promise<GuestQR | undefined> => {
  try {
    // Generate QR code dari text userId
    const qrDataUrl = await QRCode.toDataURL(userId);

    // Convert base64 ke File
    const res = await fetch(qrDataUrl);
    const blob = await res.blob();
    const file = new File([blob], "qrcode.png", { type: "image/png" });

    // Upload ke Imgur
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/imgur", {
      method: "POST",
      body: formData,
    });

    const data = await response.json(); // <- ini yang benar!

    if (!response.ok || !data.link) throw new Error("Upload gagal");

    const uploadedImage = {
      url: data.link,
      deleteHash: data.deletehash,
    } as GuestQR;

    return uploadedImage;
  } catch (error) {
    console.error("Gagal generate QR:", error);
    return undefined;
  }
};

export const deleteImage = async (deleteHash: string) => {
  console.log("fungsi delete image", deleteHash);
  const res = await fetch("/api/imgur", {
    method: "DELETE",
    body: JSON.stringify({ deleteHash }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error("Gagal delete gambar");

  console.log("Hasil delete:", data);
};
