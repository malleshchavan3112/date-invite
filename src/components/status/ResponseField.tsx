'use client';

interface ResponseFieldProps {
  icon: string;
  label: string;
  value: string | null | undefined;
  subtext?: string;
  fullWidth?: boolean;
  className?: string;
}

export default function ResponseField({
  icon,
  label,
  value,
  subtext,
  fullWidth = false,
  className = '',
}: ResponseFieldProps) {
  const hasValue = Boolean(value && value.trim().length > 0);

  return (
    <div
      className={`bg-white/85 backdrop-blur-sm border border-primary/15 rounded-2xl p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between hover:border-primary/30 transition-all ${
        fullWidth ? 'col-span-full' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-muted flex items-center gap-1.5">
          <span aria-hidden="true">{icon}</span>
          <span>{label}</span>
        </span>
        {subtext && (
          <span className="text-[10px] text-muted/70 font-mono">{subtext}</span>
        )}
      </div>

      <div className="mt-0.5">
        <span
          className={`text-sm sm:text-base font-semibold block break-words ${
            hasValue ? 'text-dark' : 'text-muted/60 italic font-normal text-xs'
          }`}
        >
          {hasValue ? value : 'Not specified'}
        </span>
      </div>
    </div>
  );
}
