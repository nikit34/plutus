import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import OAuthButtons from '../components/OAuthButtons';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
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
          <h1 className="text-xl font-semibold mb-1">Welcome back</h1>
          <p className="text-sm text-text-secondary mb-6">Sign in to your dashboard</p>
          <OAuthButtons label="Sign in" />
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-sm focus:border-gold/30 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-sm focus:border-gold/30 transition-colors" />
            </div>
            {error && <div className="text-xs text-red">{error}</div>}
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gold text-bg-primary font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
              {loading && <Loader2 size={14} className="animate-spin" />}
              Sign in
            </button>
          </form>
          <div className="text-xs text-text-tertiary text-center mt-5">
            No account? <Link to="/signup" className="text-gold hover:underline">Create one</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
