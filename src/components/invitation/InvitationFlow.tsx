'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type {
  Invitation,
  PublicInvitation,
  QuestionnaireAnswers,
  SubmissionErrorCode,
} from '@/types';
import { INITIAL_QUESTIONNAIRE_ANSWERS } from '@/types';
import { submitResponseAction } from '@/lib/actions';

// Phase 2 Screen components
import LoadingScreen from './LoadingScreen';
import LandingScreen from './LandingScreen';
import DateQuestion from './DateQuestion';
import PlayfulNo from './PlayfulNo';
import NoCompletion from './NoCompletion';

// Phase 3 Questionnaire components
import RecipientNameStep from '@/components/questionnaire/RecipientNameStep';
import DateTypeStep from '@/components/questionnaire/DateTypeStep';
import PreferredDayStep from '@/components/questionnaire/PreferredDayStep';
import PreferredTimeStep from '@/components/questionnaire/PreferredTimeStep';
import DateVibeStep from '@/components/questionnaire/DateVibeStep';
import OptionalMessageStep from '@/components/questionnaire/OptionalMessageStep';
import ReviewAnswersStep from '@/components/questionnaire/ReviewAnswersStep';

// Phase 4 Submission & Final Recipient State components
import SubmittingScreen from './SubmittingScreen';
import SuccessScreen from './SuccessScreen';
import InvalidInvitationScreen from './InvalidInvitationScreen';
import SubmissionErrorScreen from './SubmissionErrorScreen';

// ─── Flow Step ────────────────────────────────────────────────────────────

type FlowStep =
  | 'loading'          // P01
  | 'landing'          // P02
  | 'question'         // P03
  | 'playful-no'       // P04
  | 'no-completion'    // P05
  | 'name'             // P06
  | 'date-type'        // P07
  | 'preferred-day'    // P08
  | 'preferred-time'   // P09
  | 'date-vibe'        // P10
  | 'message'          // P11
  | 'review'           // P12
  | 'submitting'       // P13
  | 'success'          // P14
  | 'invalid'          // P15
  | 'error';           // P16

interface InvitationFlowProps {
  invitation?: Invitation | PublicInvitation | null;
}

export default function InvitationFlow({ invitation }: InvitationFlowProps) {
  const [step, setStep] = useState<FlowStep>(() => {
    if (!invitation || !invitation.active) {
      return 'invalid';
    }
    return 'loading';
  });

  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(INITIAL_QUESTIONNAIRE_ANSWERS);
  const [isEditingFromReview, setIsEditingFromReview] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<{
    code: SubmissionErrorCode;
    message?: string;
  } | null>(null);

  const prefersReducedMotion = useReducedMotion();

  const goTo = useCallback((nextStep: FlowStep, dir: 'forward' | 'back' = 'forward') => {
    setDirection(dir);
    setStep(nextStep);
  }, []);

  // Motion variants supporting directional slides
  const variants = prefersReducedMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1, transition: { duration: 0.22 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      }
    : {
        enter: {
          opacity: 0,
          x: direction === 'forward' ? 40 : -40,
        },
        center: {
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
          },
        },
        exit: {
          opacity: 0,
          x: direction === 'forward' ? -40 : 40,
          transition: {
            duration: 0.2,
            ease: [0.4, 0, 1, 1],
          },
        },
      };

  // Phase 4: Submit questionnaire response
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    if (!invitation || !invitation.active) {
      goTo('invalid', 'forward');
      return;
    }

    setIsSubmitting(true);
    goTo('submitting', 'forward');

    // Check development-only query parameter ?mockSubmissionError=true
    let forceError = false;
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('mockSubmissionError') === 'true') {
        forceError = true;
      }
    }

    try {
      // Small artificial delay (1.2s) ensures smooth presentation of envelope animation
      const [result] = await Promise.all([
        submitResponseAction({
          invitation_id: invitation.id,
          answer: 'yes',
          recipient_name: answers.recipient_name,
          date_type: answers.date_type,
          preferred_day: answers.preferred_day,
          preferred_time: answers.preferred_time,
          date_vibe: answers.date_vibe,
          message: answers.message,
          forceError,
        }),
        new Promise((resolve) => setTimeout(resolve, 1200)),
      ]);

      if (result.success) {
        setIsSubmitting(false);
        setSubmissionError(null);
        goTo('success', 'forward');
      } else {
        setIsSubmitting(false);
        setSubmissionError({
          code: result.code || 'UNKNOWN_ERROR',
          message: result.error,
        });
        goTo('error', 'forward');
      }
    } catch (err: unknown) {
      setIsSubmitting(false);
      const msg = err instanceof Error ? err.message : 'Submission failed.';
      setSubmissionError({
        code: 'UNKNOWN_ERROR',
        message: msg,
      });
      goTo('error', 'forward');
    }
  }, [answers, invitation, isSubmitting, goTo]);

  function renderScreen() {
    switch (step) {
      // P01 — Loading
      case 'loading':
        return <LoadingScreen onLoaded={() => goTo('landing', 'forward')} />;

      // P02 — Landing
      case 'landing':
        if (!invitation) return <InvalidInvitationScreen />;
        return (
          <LandingScreen
            invitation={invitation}
            onOpen={() => goTo('question', 'forward')}
          />
        );

      // P03 — Main Date Question
      case 'question':
        return (
          <DateQuestion
            onYes={() => goTo('name', 'forward')}
            onNo={() => goTo('playful-no', 'forward')}
          />
        );

      // P04 — Playful NO State
      case 'playful-no':
        return (
          <PlayfulNo
            onActuallyYes={() => goTo('name', 'forward')}
            onConfirmNo={() => goTo('no-completion', 'forward')}
          />
        );

      // P05 — Respectful NO Completion
      case 'no-completion':
        return <NoCompletion />;

      // P06 — Recipient Name
      case 'name':
        return (
          <RecipientNameStep
            value={answers.recipient_name}
            isEditingFromReview={isEditingFromReview}
            onContinue={(name) => {
              setAnswers((prev) => ({ ...prev, recipient_name: name }));
              if (isEditingFromReview) {
                setIsEditingFromReview(false);
                goTo('review', 'forward');
              } else {
                goTo('date-type', 'forward');
              }
            }}
            onBack={() => {
              if (isEditingFromReview) {
                setIsEditingFromReview(false);
                goTo('review', 'back');
              } else {
                goTo('question', 'back');
              }
            }}
          />
        );

      // P07 — Date Type
      case 'date-type':
        return (
          <DateTypeStep
            value={answers.date_type}
            isEditingFromReview={isEditingFromReview}
            onContinue={(dateType) => {
              setAnswers((prev) => ({ ...prev, date_type: dateType }));
              if (isEditingFromReview) {
                setIsEditingFromReview(false);
                goTo('review', 'forward');
              } else {
                goTo('preferred-day', 'forward');
              }
            }}
            onBack={() => {
              if (isEditingFromReview) {
                setIsEditingFromReview(false);
                goTo('review', 'back');
              } else {
                goTo('name', 'back');
              }
            }}
          />
        );

      // P08 — Preferred Day
      case 'preferred-day':
        return (
          <PreferredDayStep
            value={answers.preferred_day}
            isEditingFromReview={isEditingFromReview}
            onContinue={(day) => {
              setAnswers((prev) => ({ ...prev, preferred_day: day }));
              if (isEditingFromReview) {
                setIsEditingFromReview(false);
                goTo('review', 'forward');
              } else {
                goTo('preferred-time', 'forward');
              }
            }}
            onBack={() => {
              if (isEditingFromReview) {
                setIsEditingFromReview(false);
                goTo('review', 'back');
              } else {
                goTo('date-type', 'back');
              }
            }}
          />
        );

      // P09 — Preferred Time
      case 'preferred-time':
        return (
          <PreferredTimeStep
            value={answers.preferred_time}
            isEditingFromReview={isEditingFromReview}
            onContinue={(time) => {
              setAnswers((prev) => ({ ...prev, preferred_time: time }));
              if (isEditingFromReview) {
                setIsEditingFromReview(false);
                goTo('review', 'forward');
              } else {
                goTo('date-vibe', 'forward');
              }
            }}
            onBack={() => {
              if (isEditingFromReview) {
                setIsEditingFromReview(false);
                goTo('review', 'back');
              } else {
                goTo('preferred-day', 'back');
              }
            }}
          />
        );

      // P10 — Date Vibe
      case 'date-vibe':
        return (
          <DateVibeStep
            value={answers.date_vibe}
            isEditingFromReview={isEditingFromReview}
            onContinue={(vibe) => {
              setAnswers((prev) => ({ ...prev, date_vibe: vibe }));
              if (isEditingFromReview) {
                setIsEditingFromReview(false);
                goTo('review', 'forward');
              } else {
                goTo('message', 'forward');
              }
            }}
            onBack={() => {
              if (isEditingFromReview) {
                setIsEditingFromReview(false);
                goTo('review', 'back');
              } else {
                goTo('preferred-time', 'back');
              }
            }}
          />
        );

      // P11 — Optional Message
      case 'message':
        return (
          <OptionalMessageStep
            value={answers.message}
            isEditingFromReview={isEditingFromReview}
            onContinue={(msg) => {
              setAnswers((prev) => ({ ...prev, message: msg }));
              setIsEditingFromReview(false);
              goTo('review', 'forward');
            }}
            onSkip={() => {
              setIsEditingFromReview(false);
              goTo('review', 'forward');
            }}
            onBack={() => {
              if (isEditingFromReview) {
                setIsEditingFromReview(false);
                goTo('review', 'back');
              } else {
                goTo('date-vibe', 'back');
              }
            }}
          />
        );

      // P12 — Review Answers
      case 'review':
        return (
          <ReviewAnswersStep
            answers={answers}
            onEditStep={(stepKey) => {
              setIsEditingFromReview(true);
              goTo(stepKey, 'back');
            }}
            onBack={() => goTo('message', 'back')}
            onContinue={handleSubmit}
          />
        );

      // P13 — Submitting State
      case 'submitting':
        return <SubmittingScreen />;

      // P14 — Success Screen
      case 'success':
        if (!invitation) return <InvalidInvitationScreen />;
        return (
          <SuccessScreen
            invitation={invitation}
            answers={answers}
          />
        );

      // P15 — Invalid Invitation
      case 'invalid':
        return <InvalidInvitationScreen />;

      // P16 — Submission Error
      case 'error':
        return (
          <SubmissionErrorScreen
            errorCode={submissionError?.code}
            errorMessage={submissionError?.message}
            onTryAgain={handleSubmit}
            onReviewAnswers={() => goTo('review', 'back')}
          />
        );
    }
  }

  return (
    <div className="min-h-dvh bg-bg">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="w-full"
          style={{ willChange: 'opacity, transform' }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
