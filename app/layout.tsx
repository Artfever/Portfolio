import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import NavDots from "@/components/NavDots";
import Background from "@/components/three/Background";

/**
 * Typography defaults to a system-font stack (see --font-sans / --font-mono in
 * globals.css) so the build has zero network dependency.
 *
 * To use the plan's custom fonts, install is already done — just uncomment the
 * block below, add `${sans.variable} ${mono.variable}` to the <html> className,
 * and next/font will self-host Inter + Space Mono (needs network at build time):
 *
 * import { Inter, Space_Mono } from "next/font/google";
 * const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
 * const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono", display: "swap" });
 */

export const metadata: Metadata = {
  title: "Muhammad Shaheer — Software Engineer",
  description:
    "Portfolio of Muhammad Shaheer, a software engineer and CS student at FAST NUCES Islamabad building applications across web, desktop, and systems.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Muhammad Shaheer — Software Engineer",
    description:
      "Software engineer building applications across web, desktop, and systems.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Background />
        <Preloader />
        <CustomCursor />
        <NavDots />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
