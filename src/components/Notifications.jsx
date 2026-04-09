import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { useStore } from '../data/store';

export default function Notifications() {
  const { notifications } = useStore();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            layout
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl ${
              n.type === 'success'
                ? 'bg-green-dim border-green/20 text-green'
                : n.type === 'error'
                ? 'bg-red-dim border-red/20 text-red'
                : 'bg-bg-elevated border-border text-text-primary'
            }`}
          >
            {n.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span className="text-sm font-medium">{n.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
