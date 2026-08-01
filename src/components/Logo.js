function Logo({ withWordmark = true }) {
  return (
    <div className="logo">
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
        <defs>
          <linearGradient
            id="logoGradient"
            x1="0"
            y1="0"
            x2="40"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFB648" />
            <stop offset="1" stopColor="#FF6B4A" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="12" fill="url(#logoGradient)" />
        <rect
          x="9"
          y="8"
          width="22"
          height="9"
          rx="3"
          fill="white"
          fillOpacity="0.92"
        />
        <path
          d="M12.5 12.5h4M22 12.5h4"
          stroke="#FF6B4A"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="13" cy="23" r="2" fill="white" />
        <circle cx="20" cy="23" r="2" fill="white" />
        <circle cx="27" cy="23" r="2" fill="white" />
        <circle cx="13" cy="30" r="2" fill="white" />
        <circle cx="20" cy="30" r="2" fill="white" />
        <rect x="24" y="28" width="6" height="4" rx="1.5" fill="white" />
      </svg>
      {withWordmark && <span>CalcHub</span>}
    </div>
  );
}

export default Logo;
