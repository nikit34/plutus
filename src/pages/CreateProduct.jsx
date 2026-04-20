import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, Image as ImageIcon, X, Eye, Copy, Check, Sparkles, Palette, ArrowLeft, Link2, FileDown, FileText, CreditCard, Loader2 } from 'lucide-react';
import { useStore } from '../data/store';
import { THEMES, formatPrice } from '../data/mockData';
import { productsApi, API_BASE } from '../api/client';
import SharePanel from '../components/SharePanel';

export default function CreateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addProduct, updateProduct, addNotification } = useStore();

  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [existing, setExisting] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [theme, setTheme] = useState('midnight');
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState('image');
  const [contentType, setContentType] = useState('file');
  const [contentUrl, setContentUrl] = useState('');
  const [contentLabel, setContentLabel] = useState('');
  const [contentFileName, setContentFileName] = useState('');
  const [contentFile, setContentFile] = useState(null);
  const [contentText, setContentText] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const coverRef = useRef(null);
  const contentFileRef = useRef(null);
  const selectedTheme = THEMES[theme];

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productsApi.get(id)
      .then(({ product }) => {
        setExisting(product);
        setTitle(product.title);
        setDescription(product.description || '');
        setPrice(product.price);
        setTheme(product.theme);
        setMediaPreview(product.image || null);
        setContentType(product.content?.type || 'file');
        setContentUrl(product.content?.url || '');
        setContentLabel(product.content?.label || '');
        setContentFileName(product.content?.fileName || '');
        setContentText(product.content?.body || '');
        setPaymentLink(product.stripePaymentLink || '');
        setGeneratedLink(product.link);
      })
      .catch((err) => addNotification(err.message || 'Failed to load product', 'error'))
      .finally(() => setLoading(false));
  }, [id, addNotification]);

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
    setMediaType(file.type.startsWith('video') ? 'video' : 'image');
  };

  const handleContentFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setContentFile(file);
    setContentFileName(file.name);
  };

  const handleSubmit = async () => {
    if (!title || !price) { addNotification('Fill in title and price', 'error'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('description', description);
      fd.append('price', String(price));
      fd.append('theme', theme);
      fd.append('status', 'active');
      fd.append('contentType', contentType);
      if (contentType === 'link') { fd.append('contentUrl', contentUrl); fd.append('contentLabel', contentLabel); }
      if (contentType === 'text') fd.append('contentBody', contentText);
      if (paymentLink.trim()) fd.append('stripePaymentLink', paymentLink.trim());
      if (mediaFile) fd.append('cover', mediaFile);
      if (contentType === 'file' && contentFile) fd.append('contentFile', contentFile);

      const product = existing
        ? await updateProduct(existing.id, fd)
        : await addProduct(fd);

      setGeneratedLink(product.link);
      addNotification(existing ? 'Product updated!' : 'Product created!');
      if (!existing) navigate(`/edit/${product.id}`, { replace: true });
    } catch (err) {
      addNotification(err.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const copyLink = () => {
    const url = generatedLink.startsWith('http') ? generatedLink : 'https://' + generatedLink;
    navigator.clipboard.writeText(url);
    setCopied(true);
    addNotification('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-text-tertiary gap-2"><Loader2 size={16} className="animate-spin" />Loading…</div>;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center hover:bg-bg-elevated transition-colors"><ArrowLeft size={16} /></button>
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">{existing ? 'Edit Product' : 'New Product'}</h1>
          <p className="text-text-secondary text-sm mt-0.5">{existing ? 'Update your product details' : 'Create a digital product listing'}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-3 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notion System for Freelancers" className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-tertiary focus:border-gold/30 transition-colors text-[15px]" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your product in detail..." rows={5} className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-tertiary focus:border-gold/30 transition-colors text-[15px] resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Cover image or video</label>
            <input ref={coverRef} type="file" accept="image/*,video/*" onChange={handleMediaUpload} className="hidden" />
            {mediaPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-border">
                {mediaType === 'video' ? <video src={mediaPreview} className="w-full h-48 object-cover" /> : <img src={mediaPreview} className="w-full h-48 object-cover" alt="" />}
                <button onClick={() => { setMediaPreview(null); setMediaFile(null); }} className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-bg-primary/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-red-dim transition-colors"><X size={14} /></button>
              </div>
            ) : (
              <button onClick={() => coverRef.current?.click()} className="w-full h-48 rounded-xl border-2 border-dashed border-border hover:border-gold/30 bg-bg-input flex flex-col items-center justify-center gap-3 transition-colors group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-bg-elevated flex items-center justify-center group-hover:bg-gold-dim transition-colors"><Upload size={20} className="text-text-tertiary group-hover:text-gold transition-colors" /></div>
                <div className="text-center"><div className="text-sm font-medium text-text-secondary">Drop a file or click to upload</div><div className="text-xs text-text-tertiary mt-1">JPG, PNG, GIF, MP4 up to 100MB</div></div>
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Price ($)</label>
            <div className="relative">
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="29" className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-tertiary focus:border-gold/30 transition-colors text-[15px]" />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">USD</div>
            </div>
            {price && (
              <div className="mt-2 text-xs text-text-tertiary">
                Buyer pays {formatPrice(Number(price))} · Your earnings: <span className="text-green">{formatPrice(Number(price) * 0.95)}</span><span className="text-text-tertiary"> (5% fee)</span>
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-text-secondary">
              <CreditCard size={14} />Stripe Payment Link
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-bg-elevated text-text-tertiary">optional</span>
            </label>
            <p className="text-xs text-text-tertiary mb-3">
              Optional — if you want Stripe to host checkout directly. If left empty, Plutus creates a Checkout Session automatically using your connected account.
            </p>
            <input type="url" value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} placeholder="https://buy.stripe.com/test_..." className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-tertiary focus:border-gold/30 transition-colors text-[15px] font-mono" />
            {paymentLink && (<div className="mt-2 flex items-center gap-1.5 text-xs text-green"><Check size={12} />Custom Stripe link enabled</div>)}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Buyer content</label>
            <p className="text-xs text-text-tertiary mb-3">What the buyer gets after payment</p>
            <div className="flex gap-2 mb-3">
              {[{ key: 'file', icon: FileDown, label: 'File' }, { key: 'link', icon: Link2, label: 'Link' }, { key: 'text', icon: FileText, label: 'Text' }].map(({ key, icon: TypeIcon, label }) => (
                <button key={key} type="button" onClick={() => setContentType(key)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${contentType === key ? 'bg-gold-dim border-gold/20 text-gold' : 'bg-bg-input border-border text-text-secondary hover:text-text-primary'}`}>
                  <TypeIcon size={14} />{label}
                </button>
              ))}
            </div>
            {contentType === 'file' && (
              <div className="space-y-3">
                <input ref={contentFileRef} type="file" onChange={handleContentFileUpload} className="hidden" />
                <button onClick={() => contentFileRef.current?.click()} type="button" className="w-full p-4 rounded-xl border-2 border-dashed border-border hover:border-gold/30 bg-bg-input flex items-center justify-center gap-3 text-text-tertiary transition-colors">
                  <Upload size={16} />
                  <span className="text-sm">{contentFileName ? contentFileName : 'Upload file'}</span>
                </button>
              </div>
            )}
            {contentType === 'link' && (
              <div className="space-y-3">
                <input type="url" value={contentUrl} onChange={(e) => setContentUrl(e.target.value)} placeholder="https://notion.so/template/... or video link" className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-tertiary focus:border-gold/30 transition-colors text-[15px]" />
                <input type="text" value={contentLabel} onChange={(e) => setContentLabel(e.target.value)} placeholder="Button text: Go to Course" className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-tertiary focus:border-gold/30 transition-colors text-[15px]" />
              </div>
            )}
            {contentType === 'text' && (
              <textarea value={contentText} onChange={(e) => setContentText(e.target.value)} placeholder="Instructions, access codes, links — everything the buyer sees after payment..." rows={4} className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-tertiary focus:border-gold/30 transition-colors text-[15px] resize-none" />
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-3 text-text-secondary"><Palette size={14} />Card theme</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(THEMES).map(([key, t]) => (
                <button key={key} onClick={() => setTheme(key)} className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all ${theme === key ? 'border-gold scale-[1.02]' : 'border-transparent hover:border-border-strong'}`} style={{ background: t.bg }}>
                  <div className="absolute inset-0 flex items-center justify-center"><span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: t.accent, background: t.accent + '20' }}>{t.name}</span></div>
                  {theme === key && <motion.div layoutId="theme-check" className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gold flex items-center justify-center"><Check size={10} className="text-bg-primary" /></motion.div>}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button onClick={handleSubmit} disabled={saving} className="flex-1 py-3 rounded-xl bg-gold text-bg-primary font-semibold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {existing ? 'Save Changes' : 'Create Product'}
            </button>
            <button onClick={() => setShowPreview(!showPreview)} className="px-5 py-3 rounded-xl bg-bg-card border border-border text-sm font-medium hover:bg-bg-elevated transition-colors flex items-center gap-2"><Eye size={14} />Preview</button>
          </div>

          <AnimatePresence>
            {generatedLink && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="p-4 rounded-xl bg-green-dim border border-green/20">
                  <div className="flex items-center gap-2 mb-3"><Check size={14} className="text-green" /><span className="text-sm font-medium text-green">Link ready!</span></div>
                  <button onClick={copyLink} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-bg-primary/50 hover:bg-bg-primary/70 transition-colors text-left group">
                    <span className="flex-1 text-sm text-text-primary font-mono truncate">{generatedLink}</span>
                    {copied ? <Check size={14} className="text-green flex-shrink-0" /> : <Copy size={14} className="text-text-tertiary group-hover:text-text-primary flex-shrink-0" />}
                  </button>
                  <div className="mt-3 pt-3 border-t border-green/10"><SharePanel productTitle={title} productLink={generatedLink} /></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <div className="lg:sticky lg:top-8">
            <div className="text-xs uppercase tracking-widest text-text-tertiary mb-3 flex items-center gap-2"><Eye size={12} />Card preview</div>
            <div className="rounded-2xl overflow-hidden border border-border" style={{ background: selectedTheme.bg }}>
              <div className="h-48 overflow-hidden relative">
                {mediaPreview ? <img src={mediaPreview} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full bg-bg-elevated/30 flex items-center justify-center"><ImageIcon size={32} className="text-text-tertiary/30" /></div>}
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${selectedTheme.bg.includes('#') ? '#111' : 'rgba(0,0,0,0.6)'}, transparent)` }} />
              </div>
              <div className="p-6 -mt-8 relative">
                <h3 className="font-display text-2xl font-semibold mb-3" style={{ color: selectedTheme.text }}>{title || 'Product Title'}</h3>
                <p className="text-sm leading-relaxed mb-6 opacity-70 line-clamp-3" style={{ color: selectedTheme.text }}>{description || 'Your product description will appear here...'}</p>
                <div className="flex items-center justify-between">
                  <div><div className="text-xs opacity-50" style={{ color: selectedTheme.text }}>Price</div><div className="text-2xl font-bold" style={{ color: selectedTheme.accent }}>{price ? formatPrice(Number(price)) : '$ ---'}</div></div>
                  <button className="px-6 py-2.5 rounded-xl font-semibold text-sm" style={{ background: selectedTheme.accent, color: theme === 'snow' ? '#fff' : '#0a0a0a' }}>Buy</button>
                </div>
                <div className="mt-5 p-3 rounded-xl flex items-center gap-2.5" style={{ background: selectedTheme.accent + '10', border: `1px solid ${selectedTheme.accent}15` }}>
                  <Sparkles size={14} style={{ color: selectedTheme.accent }} />
                  <span className="text-xs" style={{ color: selectedTheme.accent }}>Potential revenue: {price ? formatPrice(Number(price) * 180) : '---'}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
