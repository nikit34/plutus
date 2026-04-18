import { motion } from 'framer-motion';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Shield, Download, ExternalLink, FileText, Star, Users, Sparkles, ArrowLeft, Check, Zap, CreditCard, Loader2 } from 'lucide-react';
import { PRODUCTS, THEMES, CREATOR, formatPrice } from '../data/mockData';
import { useState, useEffect, useRef } from 'react';

export default function ProductPublic() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
  const theme = THEMES[product.theme] || THEMES.midnight;
  const initialStep = searchParams.get('success') === 'true' ? 'content' : 'info';
  const [step, setStep] = useState(initialStep); // info → checkout → processing → content

  const handleBuyClick = () => {
    if (product.paymentLink) {
      window.location.href = product.paymentLink;
      return;
    }
    setStep('checkout');
  };

  if (step === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.bg }}>
        <ProcessingScreen theme={theme} onDone={() => setStep('content')} />
      </div>
    );
  }

  if (step === 'content') {
    return (
      <div className="min-h-screen" style={{ background: theme.bg }}>
        <div className="max-w-2xl mx-auto px-6 py-16">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-10">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: theme.accent + '20' }}>
              <Check size={32} style={{ color: theme.accent }} />
            </motion.div>
            <h1 className="font-display text-3xl font-semibold mb-2" style={{ color: theme.text }}>Payment successful!</h1>
            <p className="text-sm opacity-50" style={{ color: theme.text }}>Your content is ready — access forever</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl p-8 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <ContentBlock content={product.content} theme={theme} productTitle={product.title} />
          </motion.div>

          {CREATOR.socialLink && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-6 rounded-2xl p-6 border text-center" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="text-sm opacity-60 mb-2" style={{ color: theme.text }}>Enjoyed it? Follow the creator</div>
              <div className="text-base font-semibold mb-4" style={{ color: theme.text }}>{CREATOR.name}</div>
              <a href={CREATOR.socialLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm no-underline transition-all hover:brightness-110" style={{ background: theme.accent, color: '#0a0a0a' }}>
                <ExternalLink size={14} />Follow{CREATOR.socialLabel ? ` on ${CREATOR.socialLabel}` : ''}
              </a>
              <div className="text-xs opacity-30 mt-3" style={{ color: theme.text }}>{CREATOR.subscribers.toLocaleString('en-US')}+ followers</div>
            </motion.div>
          )}

          <div className="text-center mt-8"><span className="text-[10px] opacity-20 flex items-center justify-center gap-1" style={{ color: theme.text }}><Sparkles size={8} />Powered by Plutus</span></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <Link to="/" className="inline-flex items-center gap-2 text-xs opacity-40 hover:opacity-70 transition-opacity no-underline" style={{ color: theme.text }}><ArrowLeft size={12} />Back to dashboard</Link>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-5 gap-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="col-span-3">
            <div className="rounded-2xl overflow-hidden mb-8 border border-white/5"><img src={product.image} alt={product.title} className="w-full h-72 object-cover" /></div>
            <h1 className="font-display text-4xl font-semibold leading-tight mb-4" style={{ color: theme.text }}>{product.title}</h1>
            <p className="text-base leading-relaxed opacity-60 mb-8" style={{ color: theme.text }}>{product.description}</p>
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2"><Users size={14} style={{ color: theme.accent }} /><span className="text-sm opacity-70" style={{ color: theme.text }}>{product.sales}+ bought</span></div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < 4 ? theme.accent : 'transparent'} stroke={theme.accent} strokeWidth={1.5} />)}
                <span className="text-sm ml-1 opacity-70" style={{ color: theme.text }}>4.8</span>
              </div>
            </div>
            <div className="space-y-3">
              {['Instant access after payment', 'Lifetime access', 'Secure checkout via Stripe'].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: theme.accent + '15' }}><Check size={12} style={{ color: theme.accent }} /></div>
                  <span className="text-sm opacity-70" style={{ color: theme.text }}>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="col-span-2">
            <div className="sticky top-8">
              <div className="rounded-2xl p-6 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="text-center mb-6">
                  <div className="text-xs uppercase tracking-widest opacity-40 mb-1" style={{ color: theme.text }}>Price</div>
                  <div className="font-display text-5xl font-bold" style={{ color: theme.accent }}>{formatPrice(product.price)}</div>
                  <div className="text-xs opacity-30 mt-1" style={{ color: theme.text }}>One-time payment · No subscription</div>
                </div>
                <div className="h-px my-5" style={{ background: 'rgba(255,255,255,0.06)' }} />

                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3"><Zap size={12} style={{ color: theme.accent }} /><span className="text-xs font-medium opacity-60" style={{ color: theme.text }}>What you get</span></div>
                  <ContentPreview content={product.content} theme={theme} />
                </div>

                {step === 'info' && (
                  <>
                    <button onClick={handleBuyClick} className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:brightness-110" style={{ background: theme.accent, color: '#0a0a0a' }}>
                      <ShoppingCart size={16} />Buy for {formatPrice(product.price)}
                    </button>
                    {product.paymentLink && (
                      <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] opacity-40" style={{ color: theme.text }}>
                        <CreditCard size={11} />Checkout powered by Stripe
                      </div>
                    )}
                  </>
                )}

                {step === 'checkout' && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <div className="text-xs font-medium opacity-50 mb-2" style={{ color: theme.text }}>Payment method</div>
                    {[
                      { id: 'card', label: 'Card', sub: 'Visa, Mastercard, Amex', icon: CreditCard },
                      { id: 'apple', label: 'Apple Pay', sub: null, icon: null },
                      { id: 'google', label: 'Google Pay', sub: null, icon: null },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setStep('processing')}
                        className="w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all hover:border-white/20"
                        style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: theme.text }}
                      >
                        {method.icon ? <method.icon size={18} style={{ color: theme.accent }} /> : <span className="text-sm font-bold" style={{ color: theme.accent }}>{method.label.charAt(0)}</span>}
                        <div className="text-left flex-1">
                          <div className="text-sm font-medium">{method.label}</div>
                          {method.sub && <div className="text-xs opacity-40">{method.sub}</div>}
                        </div>
                        <ArrowLeft size={14} className="rotate-180 opacity-30" />
                      </button>
                    ))}
                    <button onClick={() => setStep('info')} className="w-full text-center text-xs opacity-40 hover:opacity-70 py-2 transition-opacity" style={{ color: theme.text }}>Back</button>
                  </motion.div>
                )}

                <div className="flex items-center justify-center gap-4 mt-5">
                  <div className="flex items-center gap-1.5 text-[11px] opacity-30" style={{ color: theme.text }}><Shield size={11} />Secure</div>
                  <div className="flex items-center gap-1.5 text-[11px] opacity-30" style={{ color: theme.text }}><Zap size={11} />Instant</div>
                </div>
              </div>
              <div className="text-center mt-4"><span className="text-[10px] opacity-20 flex items-center justify-center gap-1" style={{ color: theme.text }}><Sparkles size={8} />Powered by Plutus</span></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ProcessingScreen({ theme, onDone }) {
  const called = useRef(false);
  useEffect(() => {
    if (called.current) return;
    called.current = true;
    const delay = window.__PLUTUS_TEST__ ? 0 : 2000;
    const timer = setTimeout(onDone, delay);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
      <Loader2 size={40} className="animate-spin mx-auto mb-6" style={{ color: theme.accent }} />
      <div className="text-lg font-semibold mb-2" style={{ color: theme.text }}>Processing payment...</div>
      <div className="text-sm opacity-40" style={{ color: theme.text }}>Securely handled by Stripe</div>
    </motion.div>
  );
}

function ContentPreview({ content, theme }) {
  if (!content) return null;
  const items = { file: `File: ${content.fileName || 'Downloadable file'}`, link: content.label || 'Link access', text: 'Text content' };
  const icons = { file: Download, link: ExternalLink, text: FileText };
  const Icon = icons[content.type] || Download;
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: theme.accent + '08', border: `1px solid ${theme.accent}15` }}>
      <Icon size={14} style={{ color: theme.accent }} /><span className="text-sm opacity-70" style={{ color: theme.text }}>{items[content.type]}</span>
    </div>
  );
}

function ContentBlock({ content, theme, productTitle }) {
  if (!content) return <div className="text-center opacity-50" style={{ color: theme.text }}><p className="text-sm">Content unavailable</p></div>;

  if (content.type === 'file') {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: theme.accent + '15' }}><Download size={24} style={{ color: theme.accent }} /></div>
        <div className="text-lg font-semibold mb-1" style={{ color: theme.text }}>{content.fileName}</div>
        {content.fileSize && <div className="text-xs opacity-40 mb-6" style={{ color: theme.text }}>{content.fileSize}</div>}
        <button className="px-8 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2 hover:brightness-110 transition-all" style={{ background: theme.accent, color: '#0a0a0a' }}><Download size={16} />Download file</button>
      </div>
    );
  }

  if (content.type === 'link') {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: theme.accent + '15' }}><ExternalLink size={24} style={{ color: theme.accent }} /></div>
        <div className="text-lg font-semibold mb-1" style={{ color: theme.text }}>{productTitle}</div>
        <div className="text-xs opacity-40 mb-6" style={{ color: theme.text }}>Click the button to access your content</div>
        <a href={content.url} target="_blank" rel="noopener noreferrer" className="px-8 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2 hover:brightness-110 transition-all no-underline" style={{ background: theme.accent, color: '#0a0a0a' }}>
          <ExternalLink size={16} />{content.label || 'Open'}
        </a>
      </div>
    );
  }

  if (content.type === 'text') {
    return (
      <div>
        <div className="flex items-center gap-2 mb-4"><FileText size={16} style={{ color: theme.accent }} /><span className="text-sm font-semibold" style={{ color: theme.text }}>{productTitle}</span></div>
        <div className="text-sm leading-relaxed opacity-80 whitespace-pre-wrap" style={{ color: theme.text }}>{content.body}</div>
      </div>
    );
  }
  return null;
}
