import NavbarComponent from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finite Automata Simulator",
  description:
    "Sebuah website untuk menyimulasikan finite automata dengan beberapa pilihan tools, seperti: NFA, E-NFA Konverter, Regex Konverter, Minimisasi DFA, DFA Ekuivalensi, dan FA & Regex Validator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavbarComponent />
        {children}

        <Toaster />
      </body>
    </html>
  );
}
