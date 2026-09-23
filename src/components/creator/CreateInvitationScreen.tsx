'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { createInvitationAction } from '@/lib/actions';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { FadeIn } from '@/components/ui/PageTransition';

// Decorative background accents (subtle, non-distracting, tasteful)
const ACCENTS = [
  { emoji: '✨', x: '8%',  y: '14%', delay: 0.1, size: 'text-base', dur: 6 },
  { emoji: '💌', x: '88%', y: '16%', delay: 0.3, size: 'text-xl',  dur: 5 },
  { emoji: '🌸', x: '6%',  y: '72%', delay: 0.5, size: 'text-sm',  dur: 7 },
  { emoji: '💫', x: '84%', y: '78%', delay: 0.2, size: 'text-base',dur: 5 },
] as const;

export default function CreateInvitationScreen() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const [creatorName, setCreatorName] = useState('');
  const [creatorEmail, setCreatorEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; general?: string }>({});

  const validate = (): boolean => {
    const newErrors: { name?: string; email?: string } = {};
    const trimmedName = creatorName.trim();
    const trimmedEmail = creatorEmail.trim();

    if (!trimmedName) {
      newErrors.name = 'Please enter your name.';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      newErrors.email = 'Please enter your email.';
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || isLoading) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await createInvitationAction({
        creator_name: creatorName.trim(),
        creator_email: creatorEmail.trim(),
      });

      if (!result.success || !result.slug) {
        setErrors({ general: result.error || 'Something went wrong. Please try again.' });
        setIsLoading(false);
        return;
      }

      // Store created slug in session storage for smooth hydration without exposing email
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('dateinvite_last_slug', result.slug);
          sessionStorage.setItem('dateinvite_creator_name', result.creator_name || creatorName.trim());
        } catch {
          // Non-critical if storage fails
        }
      }

      // Navigate to C02 (Invitation Created) passing ONLY the unpredictable slug
      router.push(`/create/success?slug=${encodeURIComponent(result.slug)}`);
    } catch {
      setErrors({ general: 'Network error occurred. Please try again.' });
      setIsLoading(false);
    }
  };

  return (
    <div className="screen relative overflow-hidden bg-bg min-h-dvh flex flex-col justify-center items-center px-4 py-8">
      {/* ── Decorative Background Floaters ── */}
      {!prefersReducedMotion &&
        ACCENTS.map((item, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className={`absolute select-none pointer-events-none ${item.size}`}
            style={{ left: item.x, top: item.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.45, 0.35, 0.45],
              scale: [0, 1, 0.95, 1],
              y: [0, -8, 0],
            }}
            transition={{
              opacity: { delay: item.delay, duration: 0.8 },
              scale:   { delay: item.delay, duration: 0.5 },
              y:       { delay: item.delay + 0.5, duration: item.dur, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            {item.emoji}
          </motion.span>
        ))}

      {/* ── Main Container ── */}
      <div className="w-full max-w-md mx-auto relative z-10">
        {/* Header Content */}
        <div className="text-center mb-6">
          <FadeIn delay={0.08}>
            <span className="inline-block text-label uppercase tracking-widest text-primary font-semibold mb-2 bg-soft-pink px-3.5 py-1 rounded-full text-xs">
              Date Invitation
            </span>
          </FadeIn>

          <FadeIn delay={0.16}>
            <h1 className="font-serif text-display-md text-dark mb-2.5 leading-tight text-balance">
              Plan a date.<br />
              <span className="text-primary italic">Make it unforgettable.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.24}>
            <p className="font-sans text-body-md text-muted max-w-xs mx-auto text-balance">
              Create a private invitation and send it to someone special.
            </p>
          </FadeIn>
        </div>

        {/* Form Card */}
        <FadeIn delay={0.32}>
          <div className="content-card bg-surface rounded-3xl p-6 sm:p-8 shadow-card border border-border">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* General error banner */}
              {errors.general && (
                <div
                  role="alert"
                  className="p-3.5 rounded-2xl bg-rose-50 border border-primary/20 text-primary text-sm font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errors.general}</span>
                </div>
              )}

              {/* Creator Name Field */}
              <div>
                <label
                  htmlFor="creator-name-input"
                  className="block text-label uppercase tracking-wider text-muted font-sans font-semibold mb-2"
                >
                  Your Name
                </label>
                <div className="relative">
                  <input
                    id="creator-name-input"
                    name="creatorName"
                    type="text"
                    autoComplete="name"
                    required
                    value={creatorName}
                    onChange={(e) => {
                      setCreatorName(e.target.value);
                      if (errors.name) {
                        setErrors((prev) => ({ ...prev, name: undefined }));
                      }
                    }}
                    placeholder="Enter your name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'creator-name-error' : undefined}
                    disabled={isLoading}
                    className={`w-full px-4 py-3.5 rounded-2xl border text-dark bg-sand-50/60 placeholder:text-muted/50 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base min-h-[48px] ${
                      errors.name ? 'border-primary ring-1 ring-primary/30' : 'border-border focus:border-primary'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p id="creator-name-error" role="alert" className="text-xs text-primary font-medium mt-1.5 flex items-center gap-1">
                    <span aria-hidden="true">•</span>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Creator Email Field */}
              <div>
                <label
                  htmlFor="creator-email-input"
                  className="block text-label uppercase tracking-wider text-muted font-sans font-semibold mb-2"
                >
                  Your Email
                </label>
                <div className="relative">
                  <input
                    id="creator-email-input"
                    name="creatorEmail"
                    type="email"
                    autoComplete="email"
                    required
                    value={creatorEmail}
                    onChange={(e) => {
                      setCreatorEmail(e.target.value);
                      if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: undefined }));
                      }
                    }}
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'creator-email-error' : 'creator-email-helper'}
                    disabled={isLoading}
                    className={`w-full px-4 py-3.5 rounded-2xl border text-dark bg-sand-50/60 placeholder:text-muted/50 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base min-h-[48px] ${
                      errors.email ? 'border-primary ring-1 ring-primary/30' : 'border-border focus:border-primary'
                    }`}
                  />
                </div>
                {errors.email ? (
                  <p id="creator-email-error" role="alert" className="text-xs text-primary font-medium mt-1.5 flex items-center gap-1">
                    <span aria-hidden="true">•</span>
                    {errors.email}
                  </p>
                ) : (
                  <p id="creator-email-helper" className="text-xs text-muted/70 mt-1.5 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 flex-shrink-0 text-muted/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Your email is only used to send you their response.
                  </p>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <PrimaryButton
                  type="submit"
                  fullWidth
                  loading={isLoading}
                  id="create-invitation-btn"
                >
                  Create My Invitation
                </PrimaryButton>
              </div>
            </form>
          </div>
        </FadeIn>

        {/* Footer Guarantee */}
        <FadeIn delay={0.42}>
          <div className="text-center mt-5">
            <p className="text-xs text-muted/60 flex items-center justify-center gap-1.5">
              <span>🔒</span>
              <span>Private & confidential • No recipient account needed</span>
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
