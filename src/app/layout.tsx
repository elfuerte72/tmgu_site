import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalChatProvider from "@/components/GlobalChatProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Тюменский государственный университет",
  description: "Традиции и инновации с 1930 года. Ведущий вуз России с современной инфраструктурой.",
  keywords: "ТюмГУ, UTMN, университет, высшее образование, Тюмень",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        
        {/* Глобальный университетский чат-бот */}
        <GlobalChatProvider />
      </body>
    </html>
  );
}
