'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createInvitationAction } from '@/lib/actions';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { FadeIn } from '@/components/ui/PageTransition';
import DecorativeBackground from '@/components/ui/DecorativeBackground';

export default function CreateInvitationScreen() {
  const router = useRouter();

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

      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('dateinvite_last_slug', result.slug);
          sessionStorage.setItem('dateinvite_creator_name', result.creator_name || creatorName.trim());
        } catch {
          // Non-critical
        }
      }

      router.push(`/create/success?slug=${encodeURIComponent(result.slug)}`);
    } catch {
      setErrors({ general: 'Network error occurred. Please try again.' });
      setIsLoading(false);
    }
  };

  return (
    <div className="screen relative overflow-hidden min-h-dvh flex flex-col justify-center items-center px-4 py-8">
      {/* ── Ambient Decorative Background ── */}
      <DecorativeBackground />

      <div className="w-full max-w-sm sm:max-w-md mx-auto relative z-10">
        {/* Header Content */}
        <div className="text-center mb-6">
          <FadeIn delay={0.08}>
            <span className="inline-block text-xs uppercase tracking-widest text-primary font-semibold mb-2.5 bg-primary-subtle border border-primary/20 px-3.5 py-1 rounded-full">
              Date Invitation
            </span>
          </FadeIn>

          <FadeIn delay={0.16}>
            <h1 className="font-serif text-3xl sm:text-4xl text-dark mb-2.5 leading-tight text-balance font-normal">
              Plan a date.<br />
              <span className="text-primary italic">Make it unforgettable.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.24}>
            <p className="font-sans text-sm sm:text-base text-muted-foreground max-w-xs mx-auto text-balance">
              Create a funny, interactive invitation in seconds.
            </p>
          </FadeIn>
        </div>

        {/* Form Card */}
        <FadeIn delay={0.32}>
          <div className="bg-surface/95 backdrop-blur-md rounded-[2.25rem] p-6 sm:p-9 shadow-card hover:shadow-card-hover border border-border/80 transition-shadow duration-300">
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
                  className="block text-xs uppercase tracking-wider text-muted font-sans font-semibold mb-2"
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
                    className={`w-full px-4 py-3.5 rounded-2xl border text-dark bg-sand-50/70 placeholder:text-muted/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base min-h-[48px] ${
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
                  className="block text-xs uppercase tracking-wider text-muted font-sans font-semibold mb-2"
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
                    className={`w-full px-4 py-3.5 rounded-2xl border text-dark bg-sand-50/70 placeholder:text-muted/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base min-h-[48px] ${
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
                  className="py-4 text-base sm:text-lg"
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
