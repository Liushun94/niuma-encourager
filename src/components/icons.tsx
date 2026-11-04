interface IconProps {
  className?: string;
  size?: number;
}

const base = (size = 24) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
});

export function HeadphonesIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
      <rect x="3" y="14" width="4.5" height="7" rx="2.2" />
      <rect x="16.5" y="14" width="4.5" height="7" rx="2.2" />
    </svg>
  );
}

export function ToiletIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 17h12" />
      <path d="M7 17v-4a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v4" />
      <path d="M6.5 9h11a0 0 0 0 1 0 0v2h-11z" />
      <path d="M8 9V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V9" />
      <path d="M9 13.5h6" />
    </svg>
  );
}

export function WhipIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 20 9.5 14.5" />
      <path d="M9.5 14.5c2.5-2.5 2-7 6-9.5" />
      <path d="M15.5 5c2.8-1.2 4.6.8 4.1 3.2-.4 1.9-2.1 2.6-3.4 1.8" />
      <path d="M4.8 19.2 3 21" />
      <path d="M20 3.2 21.8 2" />
    </svg>
  );
}

export function SparkIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12z" />
    </svg>
  );
}

export function ResetIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 10a8 8 0 1 1 2 6.5" />
      <path d="M4 4v6h6" />
    </svg>
  );
}

export function MusicNoteIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M9 18V6l10-2v11" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="16" cy="15" r="3" />
    </svg>
  );
}

export function PhoneIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="7" y="2.5" width="10" height="19" rx="2.6" />
      <path d="M10.6 5.4h2.8" />
      <circle cx="12" cy="18.2" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PieIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 3a9 9 0 1 0 9 9h-9z" />
      <path d="M14.5 3.3A9 9 0 0 1 20.7 9.5H14.5z" />
      <path d="M3.6 12.8A9 9 0 0 0 9.9 20.7" opacity="0.5" />
    </svg>
  );
}

export function PinIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="m9 4 6 0-1 6 3 3v1H7v-1l3-3z" />
      <path d="M12 14v7" />
    </svg>
  );
}

export function MinimizeIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function CloseIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ClockIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function CoinsIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <ellipse cx="12" cy="6.5" rx="7.5" ry="3.2" />
      <path d="M4.5 6.5v4c0 1.8 3.4 3.2 7.5 3.2s7.5-1.4 7.5-3.2v-4" />
      <path d="M4.5 10.5v4c0 1.8 3.4 3.2 7.5 3.2s7.5-1.4 7.5-3.2v-4" />
    </svg>
  );
}

export function ArrowRightIcon({ className, size }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
