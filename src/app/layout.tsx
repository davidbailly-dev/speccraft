import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/lib/query/QueryProvider";
import { Header } from "@/components/layout/Header";
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
  title: "SpecCraft",
  description: "Rédaction et maintenance de cahiers des charges structurés.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {/* Dégradé sur un calque fixe (position: fixed, en dehors du flux) plutôt que sur le
            background de body : un background-attachment: fixed classique se redimensionne avec
            le contenu et se répète visuellement sur les pages qui dépassent la hauteur de l'écran. */}
        <div
          aria-hidden
          className="fixed inset-0 -z-10 bg-background bg-linear-to-br from-background via-background to-[#4c1d95]/40"
        />
        <QueryProvider>
          <Header />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
