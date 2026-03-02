import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import AllProviders from "@/components/providors/all-providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quick Hire - Find Your Next Job",
  description: "Quick Hire is a modern job hiring platform to connect employers and job seekers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AllProviders>
          {children}
          <Toaster richColors position="top-right" />
        </AllProviders>
      </body>
    </html>
  );
}
