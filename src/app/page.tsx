import { Metadata } from 'next';
import CreateInvitationScreen from '@/components/creator/CreateInvitationScreen';

export const metadata: Metadata = {
  title: 'Plan a Date • DateInvite',
  description: 'Create a private, interactive date invitation and send it to someone special.',
};

/**
 * Root Route (/) — C01: Create Invitation
 * Entry point for the Invitation Creator to generate a unique date invitation.
 */
export default function HomePage() {
  return <CreateInvitationScreen />;
}
