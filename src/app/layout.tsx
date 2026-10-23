import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://skill-ps.apps.taqat.academy";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Skills.ps — The Agent Skills Directory 🇵🇸",
    template: "%s | Skills.ps",
  },
  description:
    "The open directory for AI coding agent skills. Discover, inspect, and install 1,400,000+ workflows for Cursor, Claude Code, Antigravity, Windsurf, and Copilot.",
  keywords: [
    "AI Agent Skills",
    "Cursor Skills",
    "Claude Code Workflows",
    "Google Antigravity",
    "Windsurf Rules",
    "Developer Workflows",
    "Agentic AI",
    "Palestine Tech",
    "Skills Directory",
  ],
  authors: [{ name: "Skills.ps Community", url: APP_URL }],
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
    title: "Skills.ps — The Agent Skills Directory 🇵🇸",
    description:
      "Supercharge your AI coding agents. 1.4M+ skills & workflows for Cursor, Claude Code, Antigravity, and Windsurf.",
    siteName: "Skills.ps",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skills.ps — The Agent Skills Directory 🇵🇸",
    description:
      "Supercharge your AI coding agents. 1.4M+ skills & workflows for Cursor, Claude Code, Antigravity, and Windsurf.",
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
      </head>
      <body className="min-h-screen bg-black text-foreground antialiased selection:bg-neutral-800 selection:text-white">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
