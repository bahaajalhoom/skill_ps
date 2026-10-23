import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://skill-ps.apps.taqat.academy";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Skills — The Open Agent Skills Ecosystem 🇵🇸",
    template: "%s | Skills.ps",
  },
  description:
    "Skills are reusable procedural capabilities for AI agents. Discover, inspect, and install agent skills for Cursor, Claude Code, Antigravity, Windsurf, and GitHub Copilot.",
  keywords: [
    "Skills",
    "Agent Skills",
    "Cursor",
    "Claude Code",
    "Antigravity",
    "Windsurf",
    "GitHub Copilot",
    "skills.sh",
    "skills.ps",
  ],
  authors: [{ name: "Skills.ps", url: APP_URL }],
  creator: "Skills.ps",
  publisher: "Skills.ps",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_PS"],
    url: APP_URL,
    title: "Skills — The Open Agent Skills Ecosystem 🇵🇸",
    description:
      "The open directory for AI agent skills. Install skills for Cursor, Claude Code, Antigravity, Windsurf, and GitHub Copilot with one command.",
    siteName: "Skills.ps",
    images: [
      {
        url: `${APP_URL}/og.jpg`,
        secureUrl: `${APP_URL}/og.jpg`,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Skills — The Open Agent Skills Ecosystem",
      },
      {
        url: `${APP_URL}/og.png`,
        secureUrl: `${APP_URL}/og.png`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Skills — The Open Agent Skills Ecosystem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Skills — The Open Agent Skills Ecosystem 🇵🇸",
    description:
      "The open directory for AI agent skills. Install skills for Cursor, Claude Code, Antigravity, Windsurf, and GitHub Copilot with one command.",
    images: [`${APP_URL}/og.jpg`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Geist:wght@300;400;500;600;700&family=Cairo:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        {/* WhatsApp & Social Crawlers Direct Image Fallback */}
        <meta property="og:image" content={`${APP_URL}/og.jpg`} />
        <meta property="og:image:secure_url" content={`${APP_URL}/og.jpg`} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link rel="image_src" href={`${APP_URL}/og.jpg`} />
      </head>
      <body className="min-h-screen bg-black text-foreground antialiased selection:bg-neutral-800 selection:text-white">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
