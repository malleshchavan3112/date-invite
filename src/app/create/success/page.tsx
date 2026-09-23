import { Metadata } from 'next';
import { Suspense } from 'react';
import InvitationSuccessScreen from '@/components/creator/InvitationSuccessScreen';

export const metadata: Metadata = {
  title: 'Your Invitation is Ready ✨ • DateInvite',
  description: 'Your private date invitation is ready to be shared.',
};

/**
 * Loading fallback while reading search parameters
 */
function SuccessLoadingFallback() {
  return (
    <div className="screen min-h-dvh flex items-center justify-center bg-bg">
      <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
    </div>
  );
}

/**
 * /create/success Route — C02: Invitation Created
 * Share hub for the creator with copy link, native share, and WhatsApp actions.
 */
export default function CreateSuccessPage() {
  return (
    <Suspense fallback={<SuccessLoadingFallback />}>
      <InvitationSuccessScreen />
    </Suspense>
  );
}
