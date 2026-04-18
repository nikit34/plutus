import { motion } from 'framer-motion';
import { User, Bell, Users, LogOut, Loader2, Lock } from 'lucide-react';
import { useStore } from '../data/store';
import { useAuth } from '../contexts/AuthContext';
import { settingsApi } from '../api/client';
import { useState, useRef } from 'react';

export default function Settings() {
  const { addNotification, updateProfile } = useStore();
  const { user, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [socialLink, setSocialLink] = useState(user?.socialLink || '');
  const [socialLabel, setSocialLabel] = useState(user?.socialLabel || '');
  const [subscribers, setSubscribers] = useState(user?.subscribers || 0);
  const [notif, setNotif] = useState(user?.emailNotif || { sales: true, payouts: true, tips: false });
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const avatarRef = useRef(null);

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [pwdSaving, setPwdSaving] = useState(false);

  const initials = (user?.name || user?.email || '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const save = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('socialLink', socialLink);
      fd.append('socialLabel', socialLabel);
      fd.append('subscribers', String(subscribers || 0));
      fd.append('emailNotifSales', String(notif.sales));
      fd.append('emailNotifPayouts', String(notif.payouts));
      fd.append('emailNotifTips', String(notif.tips));
      if (avatarFile) fd.append('avatar', avatarFile);
      await updateProfile(fd);
      addNotification('Settings saved!');
    } catch (err) {
      addNotification(err.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (newPwd.length < 8) { addNotification('Password must be 8+ characters', 'error'); return; }
    setPwdSaving(true);
    try {
      await settingsApi.password(currentPwd, newPwd);
      setCurrentPwd(''); setNewPwd('');
      addNotification('Password updated');
    } catch (err) {
      addNotification(err.message || 'Could not update password', 'error');
    } finally {
      setPwdSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-text-secondary text-sm mt-1">Manage your account and preferences</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl bg-bg-card border border-border">
        <div className="flex items-center gap-2 mb-5"><User size={16} className="text-text-secondary" /><h3 className="text-base font-semibold">Profile</h3></div>
        <div className="space-y-4">
          <div className="flex items-center gap-5 mb-5">
            {avatarPreview ? (
              <img src={avatarPreview} alt="" className="w-16 h-16 rounded-2xl object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center text-xl font-semibold text-gold">{initials}</div>
            )}
            <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarSelect} className="hidden" />
            <button onClick={() => avatarRef.current?.click()} className="px-4 py-2 rounded-xl bg-bg-elevated border border-border text-sm hover:bg-bg-hover transition-colors">Upload photo</button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-text-primary focus:border-gold/30 transition-colors text-[15px]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Email</label>
            <input type="email" value={user?.email || ''} disabled className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-text-tertiary text-[15px] cursor-not-allowed" />
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="p-6 rounded-2xl bg-bg-card border border-border">
        <div className="flex items-center gap-2 mb-5"><Users size={16} className="text-text-secondary" /><h3 className="text-base font-semibold">Social channel</h3></div>
        <p className="text-xs text-text-tertiary mb-3">Buyers will see a follow prompt after purchase</p>
        <div className="space-y-3">
          <input type="url" value={socialLink} onChange={(e) => setSocialLink(e.target.value)} placeholder="https://youtube.com/..., instagram.com/..., tiktok.com/..." className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-tertiary focus:border-gold/30 transition-colors text-[15px]" />
          <input type="text" value={socialLabel} onChange={(e) => setSocialLabel(e.target.value)} placeholder="Label: YouTube, Instagram, TikTok..." className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-tertiary focus:border-gold/30 transition-colors text-[15px]" />
          <input type="number" value={subscribers} onChange={(e) => setSubscribers(Number(e.target.value) || 0)} placeholder="Followers count" className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-tertiary focus:border-gold/30 transition-colors text-[15px]" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-6 rounded-2xl bg-bg-card border border-border">
        <div className="flex items-center gap-2 mb-5"><Bell size={16} className="text-text-secondary" /><h3 className="text-base font-semibold">Email notifications</h3></div>
        <div className="space-y-3">
          {[
            { key: 'sales', label: 'New sale', desc: 'Get notified on every purchase' },
            { key: 'payouts', label: 'Payouts', desc: 'Email when a payout is sent' },
            { key: 'tips', label: 'AI recommendations', desc: 'Tips to increase sales' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated">
              <div><div className="text-sm font-medium">{item.label}</div><div className="text-xs text-text-tertiary">{item.desc}</div></div>
              <ToggleSwitch on={!!notif[item.key]} onChange={(val) => setNotif((n) => ({ ...n, [item.key]: val }))} />
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="p-6 rounded-2xl bg-bg-card border border-border">
        <div className="flex items-center gap-2 mb-5"><Lock size={16} className="text-text-secondary" /><h3 className="text-base font-semibold">Password</h3></div>
        <div className="space-y-3">
          <input type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} placeholder="Current password" className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-sm" />
          <input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} placeholder="New password (8+ characters)" className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-sm" />
          <button onClick={changePassword} disabled={pwdSaving || !currentPwd || !newPwd} className="px-5 py-2.5 rounded-xl bg-bg-elevated border border-border text-sm font-medium hover:bg-bg-hover transition-colors disabled:opacity-50 flex items-center gap-2">
            {pwdSaving && <Loader2 size={14} className="animate-spin" />} Change password
          </button>
        </div>
      </motion.div>

      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving} className="px-6 py-3 rounded-xl bg-gold text-bg-primary font-semibold text-sm hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50">
          {saving && <Loader2 size={14} className="animate-spin" />} Save changes
        </button>
        <button onClick={logout} className="px-6 py-3 rounded-xl bg-bg-card border border-border text-sm font-medium hover:bg-red-dim hover:border-red/30 hover:text-red transition-colors flex items-center gap-2">
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </div>
  );
}

function ToggleSwitch({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} className={`w-11 h-6 rounded-full transition-colors relative ${on ? 'bg-gold' : 'bg-bg-hover'}`}>
      <motion.div animate={{ x: on ? 20 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="w-5 h-5 rounded-full bg-white absolute top-0.5" />
    </button>
  );
}
