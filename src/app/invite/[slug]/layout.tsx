import type { Metadata } from 'next';

interface InviteLayoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

export async function generateMetadata(
  { params }: InviteLayoutProps
): Promise<Metadata> {
  return {
    title: 'You have a special invitation 💌',
    description: 'Open to find out who is asking you on a date.',
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}

export default function InviteLayout({ children }: InviteLayoutProps) {
  return <>{children}</>;
}
