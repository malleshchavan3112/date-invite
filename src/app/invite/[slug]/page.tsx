import { getPublicInvitationBySlug } from '@/lib/invitation-repository';
import InvitationFlow from '@/components/invitation/InvitationFlow';
import InvalidInvitationScreen from '@/components/invitation/InvalidInvitationScreen';

interface InvitePageProps {
  params: { slug: string };
}

/**
 * /invite/[slug] — Server Component entry point.
 *
 * Resolves public invitation data from the repository.
 * D016: creator_email is strictly excluded from public data.
 * Unknown or inactive slugs render P15 Invalid Invitation screen.
 */
export default async function InvitePage({ params }: InvitePageProps) {
  const invitation = await getPublicInvitationBySlug(params.slug);

  if (!invitation || !invitation.active) {
    return <InvalidInvitationScreen />;
  }

  // Pass safe public invitation to client-side flow
  return <InvitationFlow invitation={invitation} />;
}

