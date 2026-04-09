import { motion } from 'framer-motion';
import { User, Bell, Users } from 'lucide-react';
import { useStore } from '../data/store';
import { useState } from 'react';

export default function Settings() {
  const { creator, addNotification } = useStore();
  const [name, setName] = useState(creator.name);
  const [email, setEmail] = useState(creator.email);

  const handleSave = () => {
    addNotification('Настройки сохранены!');
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Настройки</h1>
        <p className="text-text-secondary text-sm mt-1">Управление аккаунтом и предпочтениями</p>
      </motion.div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-bg-card border border-border"
      >
        <div className="flex items-center gap-2 mb-5">
          <User size={16} className="text-text-secondary" />
          <h3 className="text-base font-semibold">Профиль</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-5 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center text-xl font-semibold text-gold">
              {creator.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <button className="px-4 py-2 rounded-xl bg-bg-elevated border border-border text-sm hover:bg-bg-hover transition-colors">
              Загрузить фото
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Имя</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-text-primary focus:border-gold/30 transition-colors text-[15px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-text-primary focus:border-gold/30 transition-colors text-[15px]"
            />
          </div>
        </div>
      </motion.div>

      {/* Social link for audience */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="p-6 rounded-2xl bg-bg-card border border-border"
      >
        <div className="flex items-center gap-2 mb-5">
          <Users size={16} className="text-text-secondary" />
          <h3 className="text-base font-semibold">Ссылка на канал</h3>
        </div>
        <p className="text-xs text-text-tertiary mb-3">
          Покупатели увидят предложение подписаться после покупки
        </p>
        <div className="space-y-3">
          <input
            type="url"
            defaultValue={creator.socialLink || ''}
            placeholder="https://t.me/..., youtube.com/..., instagram.com/..."
            className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-tertiary focus:border-gold/30 transition-colors text-[15px]"
          />
          <input
            type="text"
            defaultValue={creator.socialLabel || ''}
            placeholder="Название: Telegram, YouTube, Instagram..."
            className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-tertiary focus:border-gold/30 transition-colors text-[15px]"
          />
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-6 rounded-2xl bg-bg-card border border-border"
      >
        <div className="flex items-center gap-2 mb-5">
          <Bell size={16} className="text-text-secondary" />
          <h3 className="text-base font-semibold">Уведомления</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Новая продажа', desc: 'Уведомлять о каждой покупке', default: true },
            { label: 'Еженедельный отчет', desc: 'Статистика за неделю на email', default: true },
            { label: 'AI-рекомендации', desc: 'Советы по увеличению продаж', default: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated">
              <div>
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-text-tertiary">{item.desc}</div>
              </div>
              <ToggleSwitch defaultOn={item.default} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="px-6 py-3 rounded-xl bg-gold text-bg-primary font-semibold text-sm hover:brightness-110 transition-all"
      >
        Сохранить изменения
      </button>
    </div>
  );
}

function ToggleSwitch({ defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`w-11 h-6 rounded-full transition-colors relative ${
        on ? 'bg-gold' : 'bg-bg-hover'
      }`}
    >
      <motion.div
        animate={{ x: on ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-5 h-5 rounded-full bg-white absolute top-0.5"
      />
    </button>
  );
}
