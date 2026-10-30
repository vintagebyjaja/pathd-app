import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const marcellus = localFont({ src:"../../node_modules/@fontsource/marcellus/files/marcellus-latin-400-normal.woff2", weight: "400", variable: "--font-marcellus", display: "swap" });
const figtree = localFont({ src:"../../node_modules/@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2", variable: "--font-figtree", display: "swap" });

export const metadata: Metadata = {
  title: { default: "PATHD — Find your path", template: "%s · PATHD" },
  description: "Discover opportunities, know what they pay, see who's connected, and map where your career can go next.",
  icons: {
    icon: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: { capable: true, title: "PATHD", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#F7F0E3",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${marcellus.variable} ${figtree.variable}`}>
      <body>{children}</body>
    </html>
  );
}
