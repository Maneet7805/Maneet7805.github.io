import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { PROFILE } from "@/lib/data";
import "./globals.css";

const interTight = localFont({
  src: "../fonts/InterTight-Variable.woff2",
  variable: "--font-inter-tight",
  weight: "100 900",
  display: "swap",
});

const instrument = localFont({
  src: [
    { path: "../fonts/InstrumentSerif-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/InstrumentSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = localFont({
  src: "../fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-jetbrains",
  weight: "100 800",
  display: "swap",
});

const SITE = "https://maneet7805.github.io";
const description = `${PROFILE.name}: ${PROFILE.role}. ${PROFILE.roleLine}.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: `${PROFILE.name} · ${PROFILE.role}`,
  description,
  openGraph: {
    title: PROFILE.name,
    description,
    url: SITE,
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: PROFILE.name }],
  },
  twitter: { card: "summary_large_image", title: PROFILE.name, description, images: ["/og.jpg"] },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#f4f2ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${interTight.variable} ${instrument.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
