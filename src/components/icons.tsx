type IconProps = { className?: string };

const base = "currentColor";

export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="11" cy="11" r="7" stroke={base} strokeWidth="2" />
      <path d="M21 21l-4.3-4.3" stroke={base} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z"
        stroke={base}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.5" stroke={base} strokeWidth="2" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 9l6 6 6-6" stroke={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke={base} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckBadgeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" fill={base} />
      <path d="M8 12.5l2.5 2.5L16 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 5h16v11H8l-4 4V5Z"
        stroke={base}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarIcon({ className, filled = true }: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? base : "none"} className={className}>
      <path
        d="M12 2.5l2.9 6.2 6.6.7-5 4.6 1.4 6.6L12 17.6 6.1 20.6l1.4-6.6-5-4.6 6.6-.7L12 2.5Z"
        stroke={base}
        strokeWidth={filled ? "0" : "1.5"}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UsersIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="9" cy="8" r="3" stroke={base} strokeWidth="2" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={base} strokeWidth="2" strokeLinecap="round" />
      <circle cx="17.5" cy="9" r="2.3" stroke={base} strokeWidth="2" />
      <path d="M15.5 13.2c2.6.4 4.5 2.6 4.5 5.3" stroke={base} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function UserPlusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="10" cy="8" r="3.5" stroke={base} strokeWidth="2" />
      <path d="M3 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5" stroke={base} strokeWidth="2" strokeLinecap="round" />
      <path d="M18.5 8v5M16 10.5h5" stroke={base} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ToolsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M14.7 6.3a3.5 3.5 0 0 0-4.6 4.2L4 16.6V20h3.4l6.1-6.1a3.5 3.5 0 0 0 4.2-4.6l-2.6 2.6-2-2 2.6-2.6Z"
        stroke={base}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 16v-3.2l1.8-4A2 2 0 0 1 7.7 7.5h8.6a2 2 0 0 1 1.9 1.3l1.8 4V16"
        stroke={base}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M4 16h16v2.2a.8.8 0 0 1-.8.8h-1.4a.8.8 0 0 1-.8-.8V17H7v1.2a.8.8 0 0 1-.8.8H4.8a.8.8 0 0 1-.8-.8V16Z" stroke={base} strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="7.5" cy="13.5" r="1.1" fill={base} />
      <circle cx="16.5" cy="13.5" r="1.1" fill={base} />
    </svg>
  );
}

export function LaptopIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="5" y="5" width="14" height="9" rx="1.2" stroke={base} strokeWidth="1.8" />
      <path d="M3 18.5h18" stroke={base} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CapIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 5 2 9.5 12 14l10-4.5L12 5Z" stroke={base} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6 11.8v3.7c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-3.7" stroke={base} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M20 10v5" stroke={base} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CameraIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-1.8h7L16.5 7h2A1.5 1.5 0 0 1 20 8.5v8A1.5 1.5 0 0 1 18.5 18h-13A1.5 1.5 0 0 1 4 16.5v-8Z" stroke={base} strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="12.2" r="3.1" stroke={base} strokeWidth="1.8" />
    </svg>
  );
}

export function ScissorsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="6" cy="6" r="2.2" stroke={base} strokeWidth="1.8" />
      <circle cx="6" cy="18" r="2.2" stroke={base} strokeWidth="1.8" />
      <path d="M7.6 7.4 19 18M19 6 7.6 16.6" stroke={base} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function GridIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill={base} className={className}>
      <circle cx="6" cy="6" r="1.7" />
      <circle cx="12" cy="6" r="1.7" />
      <circle cx="18" cy="6" r="1.7" />
      <circle cx="6" cy="12" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="18" cy="12" r="1.7" />
      <circle cx="6" cy="18" r="1.7" />
      <circle cx="12" cy="18" r="1.7" />
      <circle cx="18" cy="18" r="1.7" />
    </svg>
  );
}

export function PersonIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="8" r="4" stroke={base} strokeWidth="1.8" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" stroke={base} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="white" className={className}>
      <path d="M14.5 8.5H16V6h-1.7C12 6 11 7.2 11 9.2V11H9v2.5h2V19h2.5v-5.5H15.7L16 11h-2.5V9.5c0-.6.2-1 1-1Z" />
    </svg>
  );
}

export function WhatsappIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="white" className={className}>
      <path d="M12 4a8 8 0 0 0-6.9 12l-1 3.7 3.8-1A8 8 0 1 0 12 4Zm0 1.6a6.4 6.4 0 0 1 5.3 10c-1.7 2.6-5 3.5-7.7 2.2l-.3-.1-2.3.6.6-2.2-.1-.3A6.4 6.4 0 0 1 12 5.6Zm-2.5 3c-.2 0-.5 0-.6.3-.2.3-.7.8-.7 1.8s.7 2 .8 2.2c.1.1 1.5 2.4 3.7 3.2 1.8.7 2.2.6 2.6.5.4-.1 1.3-.5 1.5-1s.2-.9.1-1c-.1-.1-.2-.2-.5-.3l-1.4-.7c-.2-.1-.4-.1-.5.1l-.6.7c-.1.1-.2.2-.4.1-.2-.1-.9-.3-1.7-1-.6-.6-1-1.3-1.2-1.5-.1-.2 0-.3.1-.4l.4-.5c.1-.1.1-.3.1-.4 0-.1-.5-1.4-.7-1.9-.2-.4-.4-.4-.6-.4h-.4Z" />
    </svg>
  );
}

export function TelegramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="white" className={className}>
      <path d="M4.5 12.2 18.8 6.6c.6-.2 1.2.2 1 1l-2.3 11c-.1.6-.7.9-1.2.6l-3.6-2.7-1.9 1.8c-.2.2-.4.3-.7.2l.3-3.3 6-5.5c.3-.2 0-.4-.3-.2l-7.4 4.7-3.2-1c-.7-.2-.7-.7.1-1Z" />
    </svg>
  );
}

export function HeartIcon({ className, filled }: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? base : "none"} className={className}>
      <path
        d="M12 20.5s-7.5-4.6-9.9-9.3C.5 7.7 2.2 4.3 5.7 4.3c2 0 3.4 1 4.3 2.4.9-1.4 2.3-2.4 4.3-2.4 3.5 0 5.2 3.4 3.6 6.9-2.4 4.7-9.9 9.3-9.9 9.3Z"
        stroke={base}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CommentIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 5h16v11H8l-4 4V5Z"
        stroke={base}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ImageIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke={base} strokeWidth="1.8" />
      <circle cx="8.5" cy="9.5" r="1.6" stroke={base} strokeWidth="1.8" />
      <path d="M4 17l5-5 3.5 3.5L16 11l4 4" stroke={base} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12" stroke={base} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SendIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 20l16-8L4 4l0 6.5L14 12l-10 1.5L4 20Z" stroke={base} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="4.5" stroke="white" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.6" stroke="white" strokeWidth="1.7" />
      <circle cx="17" cy="7" r="1" fill="white" />
    </svg>
  );
}
