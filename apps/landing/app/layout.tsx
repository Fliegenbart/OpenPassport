import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenPassport — The passport standard for AI agents",
  description:
    "Open standard for agent identity, signed messages, and trust attestations. No more anonymous agents.",
  openGraph: {
    title: "OpenPassport",
    description: "The passport standard for AI agents. No more anonymous agents.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenPassport",
    description: "The passport standard for AI agents. No more anonymous agents.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="noise antialiased">{children}</body>
    </html>
  );
}
