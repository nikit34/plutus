import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function OAuthCallback() {
  const { applyToken } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const token = params.get('token');
    const err = params.get('error');

    // Scrub the fragment from history so the token isn't left in the URL.
    window.history.replaceState(null, '', window.location.pathname);

    if (err) {
      setError(err);
      return;
    }
    if (!token) {
      setError('missing_token');
      return;
    }

    applyToken(token)
      .then(() => navigate('/', { replace: true }))
      .catch((e) => setError(e.message || 'auth_failed'));
  }, [applyToken, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm text-center">
          <div className="flex items-center gap-2 justify-center mb-8 text-gold">
            <Sparkles size={18} />
            <div className="font-display text-xl font-semibold">Plutus</div>
          </div>
          <div className="p-6 rounded-2xl bg-bg-card border border-border">
            <AlertCircle size={24} className="text-red mx-auto mb-3" />
            <div className="text-sm font-semibold mb-1">Sign-in failed</div>
            <div className="text-xs text-text-tertiary mb-5 break-words">{error}</div>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="w-full py-2.5 rounded-xl bg-bg-elevated border border-border text-sm hover:bg-bg-hover transition-colors"
            >
              Back to sign in
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-text-tertiary gap-2">
      <Loader2 size={16} className="animate-spin" />Signing you in…
    </div>
  );
}
