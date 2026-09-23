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
  title: 'You have a special invitation 💌',
  description: 'Someone is asking you on a date. Open to find out who.',
  keywords: ['invitation', 'date', 'special'],
  robots: {
    index: false,   // Private invitations — don't index
    follow: false,
  },
  openGraph: {
    title: 'You have a special invitation 💌',
    description: 'Someone is asking you on a date. Open to find out who.',
    type: 'website',
  },
};

// Separate viewport export — required by Next.js 14.2+
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Prevent auto-zoom on mobile inputs
  userScalable: false,
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
