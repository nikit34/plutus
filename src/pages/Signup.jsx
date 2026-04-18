import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await signup(email.trim(), password, name.trim() || undefined);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8 text-gold">
          <Sparkles size={18} />
          <div className="font-display text-xl font-semibold">Plutus</div>
        </div>
        <div className="p-6 rounded-2xl bg-bg-card border border-border">
          <h1 className="text-xl font-semibold mb-1">Create your account</h1>
          <p className="text-sm text-text-secondary mb-6">Start selling digital products</p>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">Display name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Carter" className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-sm focus:border-gold/30 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-sm focus:border-gold/30 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">Password (8+ chars)</label>
              <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-sm focus:border-gold/30 transition-colors" />
            </div>
            {error && <div className="text-xs text-red">{error}</div>}
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gold text-bg-primary font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
              {loading && <Loader2 size={14} className="animate-spin" />}
              Create account
            </button>
          </form>
          <div className="text-xs text-text-tertiary text-center mt-5">
            Already have one? <Link to="/login" className="text-gold hover:underline">Sign in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
