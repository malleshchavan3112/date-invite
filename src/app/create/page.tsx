import { Metadata } from 'next';
import CreateInvitationScreen from '@/components/creator/CreateInvitationScreen';

export const metadata: Metadata = {
  title: 'Create Your Date Invitation • DateInvite',
  description: 'Create a private, interactive date invitation and send it to someone special.',
};

/**
 * /create Route — C01: Create Invitation
 * Dedicated URL route for invitation creation.
 */
export default function CreatePage() {
  return <CreateInvitationScreen />;
}
