import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#203D32",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://arpan-arpita.wedding"),
  title: "Arpan Kamal Weds Arpita Simon — Two Hearts. One Journey. With God.",
  description:
    "We cordially invite your presence and prayers at the Holy Matrimony of Arpita Simon with Arpan Kamal on Wednesday, 11 November 2026 at 04:30 PM at The Epiphany Church Zahur Bux, Capper Road, Lucknow, followed by dinner at The Railway Club, Bandariya Bagh, Lucknow.",
  keywords: [
    "Arpan Kamal",
    "Arpita Simon",
    "Arpan Weds Arpita",
    "Christian Wedding",
    "The Epiphany Church Zahur Bux",
    "The Railway Club Lucknow",
    "Devansh Greens Ballabhgarh",
    "Holy Matrimony",
  ],
  authors: [{ name: "Arpan Kamal & Arpita Simon" }],
  openGraph: {
    title: "Arpan Kamal Weds Arpita Simon — Wedding Invitation",
    description: "Two Hearts. One Journey. With God. Wednesday, 11 November 2026 at 04:30 PM | The Epiphany Church, Lucknow",
    type: "website",
    locale: "en_IN",
    siteName: "Arpan & Arpita Wedding",
    images: [
      {
        url: "/images/og_image.jpg",
        width: 1200,
        height: 675,
        alt: "Arpan Kamal Weds Arpita Simon — Luxury Wedding Invitation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arpan Kamal Weds Arpita Simon — Wedding Invitation",
    description: "Two Hearts. One Journey. With God. Wednesday, 11 November 2026 at 04:30 PM",
    images: ["/images/og_image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
