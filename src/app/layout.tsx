import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skills — The Agent Skills Directory",
  description: "Discover, inspect and install skills for AI agents (Cursor, Claude Code, Antigravity, Windsurf, Copilot).",
  icons: {
    icon: "/favicon.ico",
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
        {children}
      </body>
    </html>
  );
}
