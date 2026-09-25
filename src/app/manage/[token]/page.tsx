import { Metadata } from 'next';
import { getInvitationByCreatorToken } from '@/lib/invitation-repository';
import CreatorStatusDashboard from '@/components/status/CreatorStatusDashboard';
import CreatorDashboardNotFound from '@/components/status/CreatorDashboardNotFound';
import StatusErrorState from '@/components/status/StatusErrorState';

/**
 * Force dynamic rendering on every request.
 * The creator dashboard must always query fresh data from Supabase —
 * it must never serve a cached render from before the recipient submitted.
 */
export const dynamic = 'force-dynamic';

interface ManagePageProps {
  params: { token: string };
}

export async function generateMetadata({
  params,
}: ManagePageProps): Promise<Metadata> {
  const result = await getInvitationByCreatorToken(params.token);

  if (result.status === 'ok' && result.invitation) {
    const name = result.invitation.creator_name;
    return {
      title: `${name ? `${name}'s ` : ''}Creator Dashboard • DateInvite`,
      description: 'Private creator dashboard to view date invitation responses.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: 'Creator Dashboard • DateInvite',
    description: 'Private creator dashboard to view date invitation responses.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

/**
 * /manage/[token] — Secure Login-Free Creator Dashboard.
 * 
 * Server Component:
 * - Server validates private token.
 * - Resolves invitation and fresh response from Supabase.
 * - Strictly keeps creator_email and internal UUIDs server-side.
 * - Invalid tokens return friendly error without technical details.
 */
export default async function CreatorManagePage({ params }: ManagePageProps) {
  const result = await getInvitationByCreatorToken(params.token);

  if (result.status === 'not_found') {
    return <CreatorDashboardNotFound />;
  }

  if (result.status === 'error') {
    return <StatusErrorState />;
  }

  return (
    <CreatorStatusDashboard
      invitation={result.invitation}
      response={result.response}
      token={params.token}
    />
  );
}
