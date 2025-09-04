import type { Metadata } from "next";
import { Orbitron, Rajdhani, Share_Tech_Mono } from "next/font/google";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Xtreme Reaction - Test Your Reflexes | 60-Second Challenge",
  description: "The ultimate reaction time game! Test your reflexes, compete on global leaderboards, and share your scores. How fast can you react?",
  keywords: ["reaction time", "reflex game", "speed test", "competitive gaming", "leaderboard", "browser game"],
  authors: [{ name: "XtremeReaction.lol" }],
  openGraph: {
    title: "Xtreme Reaction - Test Your Reflexes",
    description: "Challenge yourself in this 60-second reaction time game. Compete globally!",
    url: "https://XtremeReaction.lol",
    siteName: "Xtreme Reaction",
    type: "website",
    images: [
      {
        url: "https://XtremeReaction.lol/api/og",
        width: 1200,
        height: 630,
        alt: "Xtreme Reaction - Test Your Reflexes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xtreme Reaction - Test Your Reflexes",
    description: "How fast are your reflexes? Find out in 60 seconds!",
    images: ["https://XtremeReaction.lol/api/og"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Xtreme Reaction',
  },
  icons: {
    icon: [
      { url: '/xr-icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/xr-icon.svg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  themeColor: '#000000',
  viewportFit: 'cover', // For iOS safe areas
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${rajdhani.variable} ${shareTechMono.variable} antialiased`}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
