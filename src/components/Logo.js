function Logo({ size = 'normal' }) {
  return (
    <div className="logo">
      <div className="logo-mark">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="2" width="18" height="20" rx="4" fill="white" fillOpacity="0.15" />
          <circle cx="8" cy="8" r="1.6" fill="white" />
          <circle cx="12" cy="8" r="1.6" fill="white" />
          <circle cx="16" cy="8" r="1.6" fill="white" />
          <path d="M8 14h8M8 18h5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      {size === 'normal' && <span>CalcHub</span>}
    </div>
  );
}

export default Logo;
