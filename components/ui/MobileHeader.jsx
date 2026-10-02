export function MobileHeader({ title, badge }) {
  return (
    <header className="md:hidden h-[60px] flex items-center px-4 bg-charcoal border-b border-charcoal-border sticky top-0 z-40">
      {/* Common Icon */}
      <div className="w-10 h-10 bg-radium rounded-full flex items-center justify-center text-charcoal shadow-[0_0_15px_rgba(204,255,0,0.4)] mr-3">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      </div>

      {/* Dynamic Title */}
      <h1 className="font-outfit font-bold text-2xl tracking-wide uppercase">{title}</h1>

      {/* Optional Dynamic Badge/Text on the right */}
      {badge && (
        <div className="ml-4 border border-radium text-radium text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          {badge}
        </div>
      )}
    </header>
  );
}