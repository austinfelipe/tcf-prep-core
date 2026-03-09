import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TCF Prep – Master French for the TCF Exam",
  description: "The complete platform for TCF exam preparation. Practice verb conjugation, written expression, and oral expression with AI-powered feedback.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
