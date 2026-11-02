export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  // An arch (oversight) sheltering a single point (the organization).
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" className="fill-primary" />
      <path
        d="M8 23V15a8 8 0 0 1 16 0v8"
        fill="none"
        strokeWidth="2.6"
        strokeLinecap="round"
        className="stroke-primary-foreground"
      />
      <path
        d="M12.5 23v-7a3.5 3.5 0 0 1 7 0v7"
        fill="none"
        strokeWidth="2.6"
        strokeLinecap="round"
        className="stroke-primary-foreground"
        opacity=".55"
      />
      <circle cx="16" cy="9.2" r="1.6" className="fill-primary-foreground" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="font-display text-xl font-semibold">mushrif</span>
      <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline" lang="ar">
        مشرف
      </span>
    </span>
  );
}
