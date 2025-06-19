import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClientLayout } from "@/components/providers/ClientLayout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MaxiLoc - CodeByToma",
  description: "Maxi Loc est une application web de gestion immobilière conçue pour optimiser la rentabilité des investissements locatifs. Cette plateforme permet aux propriétaires et investisseurs de suivre, analyser et maximiser les performances de leurs biens immobiliers en location.",
  authors: [{ name: "CodeByToma", url: "https://codebytoma.com" }],
  keywords: ["MaxiLoc", "Location", "immobiliers", "maison", "Appartement", "CodeByToma"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
