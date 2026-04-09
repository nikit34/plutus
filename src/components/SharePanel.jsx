import { useState } from 'react';
import { Copy, Check, MessageCircle, Send } from 'lucide-react';

const PLATFORMS = [
  {
    key: 'telegram',
    label: 'Telegram',
    icon: Send,
    color: '#26A5E4',
    getUrl: (link, text) => `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`,
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageCircle,
    color: '#25D366',
    getUrl: (link, text) => `https://wa.me/?text=${encodeURIComponent(text + '\n' + link)}`,
  },
  {
    key: 'x',
    label: 'X',
    icon: null,
    color: '#fff',
    getUrl: (link, text) => `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`,
  },
];

export default function SharePanel({ productTitle, productLink }) {
  const [copied, setCopied] = useState(false);
  const fullLink = `https://${productLink}`;
  const shareText = `${productTitle} — get it here:`;

  const copyFormatted = () => {
    navigator.clipboard.writeText(`${shareText}\n${fullLink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="text-xs text-text-tertiary">Share:</div>
      <div className="flex gap-2">
        {PLATFORMS.map((p) => (
          <a
            key={p.key}
            href={p.getUrl(fullLink, shareText)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-bg-elevated border border-border hover:border-border-strong transition-all no-underline"
            title={p.label}
          >
            {p.icon ? (
              <p.icon size={16} style={{ color: p.color }} />
            ) : (
              <span className="text-xs font-bold" style={{ color: p.color }}>{p.label}</span>
            )}
          </a>
        ))}
        <button
          onClick={copyFormatted}
          className={`flex items-center gap-2 px-4 h-10 rounded-xl border text-xs font-medium transition-all ${
            copied
              ? 'bg-green-dim border-green/20 text-green'
              : 'bg-bg-elevated border-border text-text-secondary hover:text-text-primary hover:border-border-strong'
          }`}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>
    </div>
  );
}
