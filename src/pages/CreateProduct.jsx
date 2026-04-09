import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, Image as ImageIcon, X, Eye, Copy, Check, Sparkles, Palette, ArrowLeft, Link2, FileDown, FileText } from 'lucide-react';
import { useStore } from '../data/store';
import { THEMES, formatPrice } from '../data/mockData';
import SharePanel from '../components/SharePanel';

export default function CreateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, addNotification } = useStore();
  const existing = id ? products.find((p) => p.id === id) : null;

  const [title, setTitle] = useState(existing?.title || '');
  const [description, setDescription] = useState(existing?.description || '');
  const [price, setPrice] = useState(existing?.price || '');
  const [theme, setTheme] = useState(existing?.theme || 'midnight');
  const [mediaPreview, setMediaPreview] = useState(existing?.image || null);
  const [mediaType, setMediaType] = useState('image');
  const [contentType, setContentType] = useState(existing?.content?.type || 'file');
  const [contentUrl, setContentUrl] = useState(existing?.content?.url || '');
  const [contentLabel, setContentLabel] = useState(existing?.content?.label || '');
  const [contentFileName, setContentFileName] = useState(existing?.content?.fileName || '');
  const [contentText, setContentText] = useState(existing?.content?.body || '');
  const [showPreview, setShowPreview] = useState(false);
  const [linkGenerated, setLinkGenerated] = useState(!!existing);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef(null);
  const selectedTheme = THEMES[theme];

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaPreview(URL.createObjectURL(file));
    setMediaType(file.type.startsWith('video') ? 'video' : 'image');
  };

  const handleSubmit = () => {
    if (!title || !price) { addNotification('Fill in title and price', 'error'); return; }
    if (existing) {
      updateProduct(id, { title, description, price: Number(price), theme, image: mediaPreview });
      addNotification('Product updated!');
    } else {
      addProduct({ title, description, price: Number(price), theme, image: mediaPreview || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop' });
      addNotification('Product created!');
    }
    setLinkGenerated(true);
  };

  const slug = title.toLowerCase().replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '-').slice(0, 30) || 'product';
  const generatedLink = `nikit34.github.io/numi/product/${existing?.id || slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText('https://' + generatedLink);
    setCopied(true);
    addNotification('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center hover:bg-bg-elevated transition-colors"><ArrowLeft size={16} /></button>
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">{existing ? 'Edit Product' : 'New Product'}</h1>
          <p className="text-text-secondary text-sm mt-0.5">{existing ? 'Update your product details' : 'Create a digital product listing'}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-5 gap-6">
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="col-span-3 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notion System for Freelancers" className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-tertiary focus:border-gold/30 transition-colors text-[15px]" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your product in detail — what's included, who it's for, what results buyers will get..." rows={5} className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-tertiary focus:border-gold/30 transition-colors text-[15px] resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Cover image or video</label>
            <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleMediaUpload} className="hidden" />
            {mediaPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-border">
                {mediaType === 'video' ? <video src={mediaPreview} className="w-full h-48 object-cover" /> : <img src={mediaPreview} className="w-full h-48 object-cover" alt="" />}
                <button onClick={() => setMediaPreview(null)} className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-bg-primary/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-red-dim transition-colors"><X size={14} /></button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()} className="w-full h-48 rounded-xl border-2 border-dashed border-border hover:border-gold/30 bg-bg-input flex flex-col items-center justify-center gap-3 transition-colors group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-bg-elevated flex items-center justify-center group-hover:bg-gold-dim transition-colors"><Upload size={20} className="text-text-tertiary group-hover:text-gold transition-colors" /></div>
                <div className="text-center"><div className="text-sm font-medium text-text-secondary">Drop a file or click to upload</div><div className="text-xs text-text-tertiary mt-1">JPG, PNG, GIF, MP4 up to 50MB</div></div>
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
                <input type="text" value={contentFileName} onChange={(e) => setContentFileName(e.target.value)} placeholder="presets.zip" className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-tertiary focus:border-gold/30 transition-colors text-[15px]" />
                <div className="p-4 rounded-xl border-2 border-dashed border-border bg-bg-input flex items-center justify-center gap-3 text-text-tertiary"><Upload size={16} /><span className="text-sm">Upload file</span></div>
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
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(THEMES).map(([key, t]) => (
                <button key={key} onClick={() => setTheme(key)} className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all ${theme === key ? 'border-gold scale-[1.02]' : 'border-transparent hover:border-border-strong'}`} style={{ background: t.bg }}>
                  <div className="absolute inset-0 flex items-center justify-center"><span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: t.accent, background: t.accent + '20' }}>{t.name}</span></div>
                  {theme === key && <motion.div layoutId="theme-check" className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gold flex items-center justify-center"><Check size={10} className="text-bg-primary" /></motion.div>}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl bg-gold text-bg-primary font-semibold text-sm hover:brightness-110 transition-all">{existing ? 'Save Changes' : 'Create Product'}</button>
            <button onClick={() => setShowPreview(!showPreview)} className="px-5 py-3 rounded-xl bg-bg-card border border-border text-sm font-medium hover:bg-bg-elevated transition-colors flex items-center gap-2"><Eye size={14} />Preview</button>
          </div>

          <AnimatePresence>
            {linkGenerated && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="p-4 rounded-xl bg-green-dim border border-green/20">
                  <div className="flex items-center gap-2 mb-2"><Check size={14} className="text-green" /><span className="text-sm font-medium text-green">Link ready!</span></div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 rounded-lg bg-bg-primary/50 text-sm text-text-primary font-mono">https://{generatedLink}</div>
                    <button onClick={copyLink} className="px-4 py-2 rounded-lg bg-green/20 text-green text-sm font-medium hover:bg-green/30 transition-colors flex items-center gap-2">{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copied' : 'Copy'}</button>
                  </div>
                  <div className="mt-3 pt-3 border-t border-green/10"><SharePanel productTitle={title} productLink={generatedLink} /></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="col-span-2">
          <div className="sticky top-8">
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
