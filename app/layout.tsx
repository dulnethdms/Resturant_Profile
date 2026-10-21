import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { MenuProvider } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReserveProvider from "@/components/ReserveProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nocturne · Kitchen & Bar — Dining after dark",
  description:
    "A modern European kitchen in SoHo where fire, season and restraint meet. Explore the menu, book a table, and taste the evening.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <MenuProvider>
          <ReserveProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </ReserveProvider>
        </MenuProvider>
      </body>
    </html>
  );
}
