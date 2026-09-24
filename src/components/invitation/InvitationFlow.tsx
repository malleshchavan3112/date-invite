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

// Questionnaire components
import RecipientNameStep from '@/components/questionnaire/RecipientNameStep';
import DateTypeStep from '@/components/questionnaire/DateTypeStep';
import ActivityPreferenceStep from '@/components/questionnaire/ActivityPreferenceStep';
import LocationPreferenceStep from '@/components/questionnaire/LocationPreferenceStep';
import PreferredDayStep from '@/components/questionnaire/PreferredDayStep';
import PreferredTimeStep from '@/components/questionnaire/PreferredTimeStep';
import FoodPreferenceStep from '@/components/questionnaire/FoodPreferenceStep';
import SpontaneityStep from '@/components/questionnaire/SpontaneityStep';
import OptionalMessageStep from '@/components/questionnaire/OptionalMessageStep';
import ReviewAnswersStep from '@/components/questionnaire/ReviewAnswersStep';

// Submission & Final Recipient State components
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
  | 'activity'         // P08 NEW
  | 'location'         // P09 NEW
  | 'preferred-day'    // P10
  | 'preferred-time'   // P11
  | 'food'             // P12 NEW
  | 'spontaneity'      // P13 NEW
  | 'message'          // P14
  | 'review'           // P15
  | 'submitting'       // P16
  | 'success'          // P17
  | 'invalid'          // P18
  | 'error';           // P19

// Edit step keys from review
type EditableStepKey =
  | 'name'
  | 'date-type'
  | 'activity'
  | 'location'
  | 'preferred-day'
  | 'preferred-time'
  | 'food'
  | 'spontaneity'
  | 'message';

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

  // Submit questionnaire response
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
      // Small artificial delay (1.2s) ensures smooth envelope animation
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
          // Phase 8 fields
          activity_preference: answers.activity_preference,
          location_preference: answers.location_preference,
          food_preference: answers.food_preference,
          spontaneity: answers.spontaneity,
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

  // ── Edit-from-review helper ──────────────────────────────────────────────
  const handleEditStep = useCallback(
    (stepKey: EditableStepKey) => {
      setIsEditingFromReview(true);
      goTo(stepKey, 'back');
    },
    [goTo]
  );

  // ── Helper: after editing from review, return to review ─────────────────
  const doneEditing = useCallback(
    (dir: 'forward' | 'back' = 'forward') => {
      setIsEditingFromReview(false);
      goTo('review', dir);
    },
    [goTo]
  );

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
            invitation={invitation}
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
                doneEditing();
              } else {
                goTo('date-type', 'forward');
              }
            }}
            onBack={() => {
              if (isEditingFromReview) {
                doneEditing('back');
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
                doneEditing();
              } else {
                goTo('activity', 'forward');
              }
            }}
            onBack={() => {
              if (isEditingFromReview) {
                doneEditing('back');
              } else {
                goTo('name', 'back');
              }
            }}
          />
        );

      // P08 — Activity Preference (NEW)
      case 'activity':
        return (
          <ActivityPreferenceStep
            value={answers.activity_preference}
            isEditingFromReview={isEditingFromReview}
            onContinue={(activity) => {
              setAnswers((prev) => ({ ...prev, activity_preference: activity }));
              if (isEditingFromReview) {
                doneEditing();
              } else {
                goTo('location', 'forward');
              }
            }}
            onBack={() => {
              if (isEditingFromReview) {
                doneEditing('back');
              } else {
                goTo('date-type', 'back');
              }
            }}
          />
        );

      // P09 — Location Preference (NEW)
      case 'location':
        return (
          <LocationPreferenceStep
            value={answers.location_preference}
            isEditingFromReview={isEditingFromReview}
            onContinue={(location) => {
              setAnswers((prev) => ({ ...prev, location_preference: location }));
              if (isEditingFromReview) {
                doneEditing();
              } else {
                goTo('preferred-day', 'forward');
              }
            }}
            onBack={() => {
              if (isEditingFromReview) {
                doneEditing('back');
              } else {
                goTo('activity', 'back');
              }
            }}
          />
        );

      // P10 — Preferred Day
      case 'preferred-day':
        return (
          <PreferredDayStep
            value={answers.preferred_day}
            isEditingFromReview={isEditingFromReview}
            onContinue={(day) => {
              setAnswers((prev) => ({ ...prev, preferred_day: day }));
              if (isEditingFromReview) {
                doneEditing();
              } else {
                goTo('preferred-time', 'forward');
              }
            }}
            onBack={() => {
              if (isEditingFromReview) {
                doneEditing('back');
              } else {
                goTo('location', 'back');
              }
            }}
          />
        );

      // P11 — Preferred Time
      case 'preferred-time':
        return (
          <PreferredTimeStep
            value={answers.preferred_time}
            isEditingFromReview={isEditingFromReview}
            onContinue={(time) => {
              setAnswers((prev) => ({ ...prev, preferred_time: time }));
              if (isEditingFromReview) {
                doneEditing();
              } else {
                goTo('food', 'forward');
              }
            }}
            onBack={() => {
              if (isEditingFromReview) {
                doneEditing('back');
              } else {
                goTo('preferred-day', 'back');
              }
            }}
          />
        );

      // P12 — Food Preference (NEW)
      case 'food':
        return (
          <FoodPreferenceStep
            value={answers.food_preference}
            isEditingFromReview={isEditingFromReview}
            onContinue={(food) => {
              setAnswers((prev) => ({ ...prev, food_preference: food }));
              if (isEditingFromReview) {
                doneEditing();
              } else {
                goTo('spontaneity', 'forward');
              }
            }}
            onBack={() => {
              if (isEditingFromReview) {
                doneEditing('back');
              } else {
                goTo('preferred-time', 'back');
              }
            }}
          />
        );

      // P13 — Spontaneity (NEW)
      case 'spontaneity':
        return (
          <SpontaneityStep
            value={answers.spontaneity}
            isEditingFromReview={isEditingFromReview}
            onContinue={(spontaneity) => {
              setAnswers((prev) => ({ ...prev, spontaneity }));
              if (isEditingFromReview) {
                doneEditing();
              } else {
                goTo('message', 'forward');
              }
            }}
            onBack={() => {
              if (isEditingFromReview) {
                doneEditing('back');
              } else {
                goTo('food', 'back');
              }
            }}
          />
        );

      // P14 — Optional Message
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
                doneEditing('back');
              } else {
                goTo('spontaneity', 'back');
              }
            }}
          />
        );

      // P15 — Review Answers
      case 'review':
        return (
          <ReviewAnswersStep
            answers={answers}
            onEditStep={handleEditStep}
            onBack={() => goTo('message', 'back')}
            onContinue={handleSubmit}
          />
        );

      // P16 — Submitting State
      case 'submitting':
        return <SubmittingScreen />;

      // P17 — Success Screen
      case 'success':
        if (!invitation) return <InvalidInvitationScreen />;
        return (
          <SuccessScreen
            invitation={invitation}
            answers={answers}
          />
        );

      // P18 — Invalid Invitation
      case 'invalid':
        return <InvalidInvitationScreen />;

      // P19 — Submission Error
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
