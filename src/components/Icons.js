// Small stroke-based icons, sized by the `size` prop, colored by currentColor
// so they automatically match whatever text color surrounds them.

function base(children, size) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function SunIcon({ size = 18 }) {
  return base(
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>,
    size,
  );
}

export function MoonIcon({ size = 18 }) {
  return base(
    <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />,
    size,
  );
}

export function UserIcon({ size = 18 }) {
  return base(
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.2-3.5 4-5 7-5s5.8 1.5 7 5" />
    </>,
    size,
  );
}

export function PowerIcon({ size = 18 }) {
  return base(
    <>
      <path d="M12 3v8" />
      <path d="M6.2 6.2a8 8 0 1 0 11.6 0" />
    </>,
    size,
  );
}

export function StarIcon({ size = 16, filled = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    >
      <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8z" />
    </svg>
  );
}

export function TrashIcon({ size = 16 }) {
  return base(
    <>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13h10l1-13" />
    </>,
    size,
  );
}

export function CopyIcon({ size = 16 }) {
  return base(
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </>,
    size,
  );
}

export function SearchIcon({ size = 16 }) {
  return base(
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.5-4.5" />
    </>,
    size,
  );
}

export function BackspaceIcon({ size = 18 }) {
  return base(
    <>
      <path d="M8 5h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H8l-6-7z" />
      <path d="M12 10l5 5M17 10l-5 5" />
    </>,
    size,
  );
}

export function ArrowLeftIcon({ size = 18 }) {
  return base(<path d="M19 12H5M11 6l-6 6 6 6" />, size);
}

export function EyeIcon({ size = 18 }) {
  return base(
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </>,
    size,
  );
}

export function EyeOffIcon({ size = 18 }) {
  return base(
    <>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c6 0 10 7 10 7a17.7 17.7 0 0 1-3.1 3.9M6.5 6.6C4 8.3 2 12 2 12s4 7 10 7a9.7 9.7 0 0 0 4.4-1" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>,
    size,
  );
}

export function CheckIcon({ size = 16 }) {
  return base(<path d="M4 12l5 5L20 6" />, size);
}

export function AlertIcon({ size = 16 }) {
  return base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <circle cx="12" cy="16" r="0.5" fill="currentColor" />
    </>,
    size,
  );
}

export function InfoIcon({ size = 16 }) {
  return base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <circle cx="12" cy="8" r="0.5" fill="currentColor" />
    </>,
    size,
  );
}

export function ClearIcon({ size = 14 }) {
  return base(<path d="M18 6L6 18M6 6l12 12" />, size);
}

export function DownloadIcon({ size = 16 }) {
  return base(
    <>
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 20h14" />
    </>,
    size,
  );
}
