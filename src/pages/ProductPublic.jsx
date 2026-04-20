import { motion } from 'framer-motion';
import { useParams, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Shield, Download, ExternalLink, FileText, Star, Users, Sparkles, Check, Zap, CreditCard, Loader2, Bitcoin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { THEMES } from '../data/mockData';
import { publicApi, checkoutApi, accessApi } from '../api/client';

const formatPrice = (amt, currency = 'USD') => new Intl.NumberFormat('en-US', {
  style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0,
}).format(amt || 0);

export default function ProductPublic() {
  const { id: slug } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const accessToken = searchParams.get('access');

  const [product, setProduct] = useState(null);
  const [err, setErr] = useState('');
  const [step, setStep] = useState('info'); // info | processing | access
  const [access, setAccess] = useState(null);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [loadingCrypto, setLoadingCrypto] = useState(false);
  const [email, setEmail] = useState('');

  // Fetch product
  useEffect(() => {
    if (!slug) return;
    publicApi.product(slug)
      .then(({ product }) => setProduct(product))
      .catch((e) => setErr(e.message || 'Product not found'));
    publicApi.event(slug, 'view').catch(() => {});
  }, [slug]);

  // If arriving from Stripe redirect, poll session status
  useEffect(() => {
    if (!sessionId) return;
    setStep('processing');
    let tries = 0;
    let cancelled = false;
    const poll = async () => {
      while (!cancelled && tries < 30) {
        try {
          const data = await checkoutApi.session(sessionId);
          if (data.status === 'paid' && data.downloadToken) {
            const info = await accessApi.get(data.downloadToken);
            if (cancelled) return;
            setAccess({ ...info, token: data.downloadToken });
            setStep('access');
            return;
          }
          if (data.status === 'failed') {
            setErr('Payment failed. Please try again.');
            setStep('info');
            return;
          }
        } catch { /* keep polling */ }
        tries += 1;
        await new Promise((r) => setTimeout(r, 2000));
      }
      if (!cancelled) { setErr('Payment is taking longer than expected. Check your email for a receipt.'); setStep('info'); }
    };
    poll();
    return () => { cancelled = true; };
  }, [sessionId]);

  // Direct access via token (from email link)
  useEffect(() => {
    if (!accessToken) return;
    accessApi.get(accessToken)
      .then((info) => { setAccess({ ...info, token: accessToken }); setStep('access'); })
      .catch(() => setErr('Access link is invalid or expired'));
  }, [accessToken]);

  const theme = THEMES[product?.theme] || THEMES.midnight;

  const handleBuy = async () => {
    if (!product) return;
    setLoadingCheckout(true);
    try {
      const { checkoutUrl, paymentLinkUrl } = await checkoutApi.start(slug, email || undefined);
      publicApi.event(slug, 'click_buy').catch(() => {});
      const url = checkoutUrl || paymentLinkUrl;
      if (url) window.location.href = url;
      else setErr('Checkout unavailable');
    } catch (e) {
      setErr(e.message || 'Could not start checkout');
    } finally {
      setLoadingCheckout(false);
    }
  };

  const handleBuyCrypto = async () => {
    if (!product) return;
    setLoadingCrypto(true);
    try {
      const { invoiceUrl } = await checkoutApi.startCrypto(slug, email || undefined);
      publicApi.event(slug, 'click_buy', { provider: 'nowpayments' }).catch(() => {});
      if (invoiceUrl) window.location.href = invoiceUrl;
      else setErr('Crypto checkout unavailable');
    } catch (e) {
      setErr(e.message || 'Could not start crypto checkout');
    } finally {
      setLoadingCrypto(false);
    }
  };

  if (err && !product) {
    return <div className="min-h-screen flex items-center justify-center p-6" style={{ background: theme.bg }}>
      <div className="text-center" style={{ color: theme.text }}><div className="text-lg font-semibold mb-2">Oops</div><div className="text-sm opacity-60">{err}</div></div>
    </div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: theme.bg }}>
      <Loader2 className="animate-spin" style={{ color: theme.accent }} />
    </div>;
  }

  if (step === 'processing') {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: theme.bg }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
        <Loader2 size={40} className="animate-spin mx-auto mb-6" style={{ color: theme.accent }} />
        <div className="text-lg font-semibold mb-2" style={{ color: theme.text }}>Finalizing your purchase…</div>
        <div className="text-sm opacity-40" style={{ color: theme.text }}>Securely handled by Stripe</div>
      </motion.div>
    </div>;
  }

  if (step === 'access' && access) {
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
            <ContentBlock access={access} theme={theme} productTitle={access.productTitle} />
          </motion.div>

          {product.seller?.socialLink && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-6 rounded-2xl p-6 border text-center" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="text-sm opacity-60 mb-2" style={{ color: theme.text }}>Enjoyed it? Follow the creator</div>
              <div className="text-base font-semibold mb-4" style={{ color: theme.text }}>{product.seller.name}</div>
              <a href={product.seller.socialLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm no-underline transition-all hover:brightness-110" style={{ background: theme.accent, color: '#0a0a0a' }}>
                <ExternalLink size={14} />Follow{product.seller.socialLabel ? ` on ${product.seller.socialLabel}` : ''}
              </a>
            </motion.div>
          )}

          <div className="text-center mt-8"><span className="text-[10px] opacity-20 flex items-center justify-center gap-1" style={{ color: theme.text }}><Sparkles size={8} />Powered by Plutus</span></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="lg:col-span-3">
            {product.image && <div className="rounded-2xl overflow-hidden mb-6 md:mb-8 border border-white/5"><img src={product.image} alt={product.title} className="w-full h-56 md:h-72 object-cover" /></div>}
            <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight mb-4" style={{ color: theme.text }}>{product.title}</h1>
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

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="lg:col-span-2">
            <div className="lg:sticky lg:top-8">
              <div className="rounded-2xl p-6 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="text-center mb-6">
                  <div className="text-xs uppercase tracking-widest opacity-40 mb-1" style={{ color: theme.text }}>Price</div>
                  <div className="font-display text-4xl md:text-5xl font-bold" style={{ color: theme.accent }}>{formatPrice(product.price, product.currency)}</div>
                  <div className="text-xs opacity-30 mt-1" style={{ color: theme.text }}>One-time payment · No subscription</div>
                </div>
                <div className="h-px my-5" style={{ background: 'rgba(255,255,255,0.06)' }} />

                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3"><Zap size={12} style={{ color: theme.accent }} /><span className="text-xs font-medium opacity-60" style={{ color: theme.text }}>What you get</span></div>
                  <ContentPreview content={product.content} theme={theme} />
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com (to receive access)"
                  className="w-full mb-3 px-4 py-2.5 rounded-xl border text-sm"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: theme.text }}
                />

                <button onClick={handleBuy} disabled={loadingCheckout || loadingCrypto} className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:brightness-110 disabled:opacity-60" style={{ background: theme.accent, color: '#0a0a0a' }}>
                  {loadingCheckout ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
                  Buy for {formatPrice(product.price, product.currency)}
                </button>
                <button onClick={handleBuyCrypto} disabled={loadingCheckout || loadingCrypto} className="w-full mt-2 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all hover:brightness-110 disabled:opacity-60 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: theme.text }}>
                  {loadingCrypto ? <Loader2 size={16} className="animate-spin" /> : <Bitcoin size={16} />}
                  Pay with crypto
                </button>
                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] opacity-40" style={{ color: theme.text }}>
                  <CreditCard size={11} />Checkout powered by Stripe
                </div>

                {err && <div className="mt-3 text-xs text-center" style={{ color: '#F87171' }}>{err}</div>}

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

function ContentBlock({ access, theme, productTitle }) {
  const content = access.content;
  if (!content) return <div className="text-center opacity-50" style={{ color: theme.text }}><p className="text-sm">Content unavailable</p></div>;

  if (content.type === 'file') {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: theme.accent + '15' }}><Download size={24} style={{ color: theme.accent }} /></div>
        <div className="text-lg font-semibold mb-1" style={{ color: theme.text }}>{content.fileName}</div>
        {content.fileSize && <div className="text-xs opacity-40 mb-6" style={{ color: theme.text }}>{Math.round(Number(content.fileSize) / 1024 / 1024 * 10) / 10} MB</div>}
        <a href={accessApi.fileUrl(access.token)} className="px-8 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2 hover:brightness-110 transition-all no-underline" style={{ background: theme.accent, color: '#0a0a0a' }}><Download size={16} />Download file</a>
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
