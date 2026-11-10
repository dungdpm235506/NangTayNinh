import type { Metadata } from "next";
import { Be_Vietnam_Pro, Noto_Serif } from "next/font/google";
import "../styles.css";

const vietnameseSans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-vietnamese-sans",
  display: "swap",
});

const vietnameseSerif = Noto_Serif({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-vietnamese-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nắng Tây Ninh | Đặc sản từ gốc đất",
  description:
    "Đặc sản OCOP tuyển chọn từ những vùng đất Việt Nam. Quà quê chân thật, gửi trao đầy trân trọng.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${vietnameseSans.variable} ${vietnameseSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}