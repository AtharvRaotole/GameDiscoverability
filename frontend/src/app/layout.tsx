import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/lib/providers";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { ToastContainer } from "@/components/ui/toast";
import { SkipLink } from "@/components/ui/skip-link";
import { AnalyticsInit } from "@/components/analytics/AnalyticsInit";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameSoul - Discover Games Through Emotion",
  description: "Discover games through emotional fingerprinting. Find games that make you feel the way your favorite games made you feel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <SkipLink />
        <ErrorBoundary>
          <Providers>
            {children}
            <ToastContainer />
            <AnalyticsInit />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
