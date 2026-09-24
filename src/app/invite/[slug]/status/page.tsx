import { Metadata } from 'next';
import { getInvitationStatusData } from '@/lib/invitation-repository';
import PublicStatusNotice from '@/components/status/PublicStatusNotice';
import StatusInvalidState from '@/components/status/StatusInvalidState';
import StatusErrorState from '@/components/status/StatusErrorState';

interface StatusPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: StatusPageProps): Promise<Metadata> {
  const result = await getInvitationStatusData(params.slug);

  if (result.status === 'ok' && result.invitation) {
    const name = result.invitation.creator_name;
    return {
      title: `${name ? `${name}'s ` : ''}Invitation Status • DateInvite`,
      description: 'Private creator dashboard access notice.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: 'Invitation Status • DateInvite',
    description: 'Check status of your date invitation.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

/**
 * /invite/[slug]/status — Public Status URL.
 * 
 * Security Guard (Phase 9A Correction):
 * - Private questionnaire responses are NEVER exposed via the public slug.
 * - Explains to visitors that the Creator Dashboard is securely gated at /manage/[token].
 */
export default async function InvitationStatusPage({ params }: StatusPageProps) {
  const result = await getInvitationStatusData(params.slug);

  if (result.status === 'not_found') {
    return <StatusInvalidState />;
  }

  if (result.status === 'error') {
    return <StatusErrorState />;
  }

  return (
    <PublicStatusNotice
      slug={result.invitation.slug}
      creatorName={result.invitation.creator_name}
    />
  );
}
