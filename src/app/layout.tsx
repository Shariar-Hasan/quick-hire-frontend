import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import AllProviders from "@/components/providers/all-providers";

const clashDisplay = localFont({
  src: [
    { path: '../../public/fonts/ClashDisplay-Extralight.otf', weight: '200' },
    { path: '../../public/fonts/ClashDisplay-Light.otf',      weight: '300' },
    { path: '../../public/fonts/ClashDisplay-Regular.otf',    weight: '400' },
    { path: '../../public/fonts/ClashDisplay-Medium.otf',     weight: '500' },
    { path: '../../public/fonts/ClashDisplay-Semibold.otf',   weight: '600' },
    { path: '../../public/fonts/ClashDisplay-Bold.otf',       weight: '700' },
  ],
  variable: '--font-clash',
  display: 'swap',
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
        className={`${clashDisplay.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <AllProviders>
          {children}
          <Toaster richColors position="top-right" />
        </AllProviders>
      </body>
    </html>
  );
}
