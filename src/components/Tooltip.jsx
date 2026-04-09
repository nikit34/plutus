import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export default function Tooltip({ children, className = '' }) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="relative inline-flex" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      <HelpCircle size={13} className={`text-text-tertiary hover:text-text-secondary cursor-help transition-colors ${className}`} />
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-72 p-3 rounded-xl bg-bg-card border border-border shadow-2xl text-xs text-text-secondary leading-relaxed">
          {children}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-bg-card border-r border-b border-border rotate-45 -mt-1" />
        </div>
      )}
    </span>
  );
}
