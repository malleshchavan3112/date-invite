import type { Metadata, Viewport } from 'next';
import { DM_Serif_Display, Inter } from 'next/font/google';
import './globals.css';

// ─── Fonts ───────────────────────────────────────────────────────────────

const dmSerifDisplay = DM_Serif_Display({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// ─── Metadata ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL('https://dateinvite.me'),
  title: 'DateInvite 💌 • A Playful Invitation Experience',
  description: 'Create a private, interactive date invitation and send it to someone special.',
  keywords: ['date invite', 'invitation', 'date ideas', 'special invitation'],
  openGraph: {
    title: 'DateInvite 💌 • A Playful Invitation Experience',
    description: 'Create a private, interactive date invitation and send it to someone special.',
    url: 'https://dateinvite.me',
    siteName: 'DateInvite',
    type: 'website',
  },
};

// Separate viewport export — required by Next.js 14.2+
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

// ─── Layout ───────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${inter.variable}`}
    >
      <body className="bg-bg text-dark antialiased">
        {children}
      </body>
    </html>
  );
}
