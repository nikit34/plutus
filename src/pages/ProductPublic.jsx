import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingCart,
  Shield,
  Download,
  Star,
  Users,
  Sparkles,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { PRODUCTS, THEMES, formatPrice, PLATFORM_FEE } from '../data/mockData';
import { useState } from 'react';

export default function ProductPublic() {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
  const theme = THEMES[product.theme] || THEMES.midnight;
  const [showCheckout, setShowCheckout] = useState(false);
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [purchased, setPurchased] = useState(false);

  const handlePurchase = (e) => {
    e.preventDefault();
    setPurchased(true);
  };

  if (purchased) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: theme.bg }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: theme.accent + '20' }}
          >
            <Check size={32} style={{ color: theme.accent }} />
          </motion.div>
          <h1 className="font-display text-3xl font-semibold mb-3" style={{ color: theme.text }}>
            Покупка успешна!
          </h1>
          <p className="text-sm opacity-60 mb-8" style={{ color: theme.text }}>
            Ссылка для скачивания отправлена на {email}
          </p>
          <button
            className="px-8 py-3 rounded-xl font-semibold text-sm"
            style={{ background: theme.accent, color: '#0a0a0a' }}
          >
            <Download size={16} className="inline mr-2 -mt-0.5" />
            Скачать сейчас
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      {/* Back link */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs opacity-40 hover:opacity-70 transition-opacity no-underline"
          style={{ color: theme.text }}
        >
          <ArrowLeft size={12} />
          Вернуться в дашборд
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-5 gap-10">
          {/* Product info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="col-span-3"
          >
            {/* Image */}
            <div className="rounded-2xl overflow-hidden mb-8 border border-white/5">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-72 object-cover"
              />
            </div>

            <h1
              className="font-display text-4xl font-semibold leading-tight mb-4"
              style={{ color: theme.text }}
            >
              {product.title}
            </h1>

            <p className="text-base leading-relaxed opacity-60 mb-8" style={{ color: theme.text }}>
              {product.description}
            </p>

            {/* Social proof */}
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Users size={14} style={{ color: theme.accent }} />
                <span className="text-sm opacity-70" style={{ color: theme.text }}>
                  {product.sales}+ купили
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < 4 ? theme.accent : 'transparent'}
                    stroke={theme.accent}
                    strokeWidth={1.5}
                  />
                ))}
                <span className="text-sm ml-1 opacity-70" style={{ color: theme.text }}>
                  4.8
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {[
                'Мгновенная доставка на email',
                'Доступ навсегда после покупки',
                'Безопасная оплата',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: theme.accent + '15' }}
                  >
                    <Check size={12} style={{ color: theme.accent }} />
                  </div>
                  <span className="text-sm opacity-70" style={{ color: theme.text }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Purchase form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="col-span-2"
          >
            <div className="sticky top-8">
              <div
                className="rounded-2xl p-6 border"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderColor: 'rgba(255,255,255,0.08)',
                }}
              >
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-xs uppercase tracking-widest opacity-40 mb-1" style={{ color: theme.text }}>
                    Стоимость
                  </div>
                  <div
                    className="font-display text-5xl font-bold"
                    style={{ color: theme.accent }}
                  >
                    {formatPrice(product.price)}
                  </div>
                  <div className="text-xs opacity-30 mt-1" style={{ color: theme.text }}>
                    Одноразовый платеж · Без подписки
                  </div>
                </div>

                <div className="h-px my-5" style={{ background: 'rgba(255,255,255,0.06)' }} />

                {!showCheckout ? (
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:brightness-110"
                    style={{ background: theme.accent, color: '#0a0a0a' }}
                  >
                    <ShoppingCart size={16} />
                    Купить сейчас
                  </button>
                ) : (
                  <motion.form
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handlePurchase}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs mb-1.5 opacity-50" style={{ color: theme.text }}>
                        Email для получения товара
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="ivan@mail.com"
                        className="w-full px-3 py-2.5 rounded-xl text-sm bg-white/5 border border-white/8 placeholder:opacity-30 focus:border-white/20 transition-colors"
                        style={{ color: theme.text }}
                      />
                    </div>

                    {/* Payment method */}
                    <div>
                      <label className="block text-xs mb-2 opacity-50" style={{ color: theme.text }}>
                        Способ оплаты
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: 'card', label: 'Карта' },
                          { key: 'sbp', label: 'СБП' },
                        ].map((m) => (
                          <button
                            type="button"
                            key={m.key}
                            onClick={() => setPaymentMethod(m.key)}
                            className="py-2.5 rounded-xl text-xs font-medium border transition-all"
                            style={{
                              background: paymentMethod === m.key ? theme.accent + '15' : 'transparent',
                              borderColor: paymentMethod === m.key ? theme.accent + '40' : 'rgba(255,255,255,0.08)',
                              color: paymentMethod === m.key ? theme.accent : theme.text,
                            }}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {paymentMethod === 'card' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                      >
                        <label className="block text-xs mb-1.5 opacity-50" style={{ color: theme.text }}>
                          Номер карты
                        </label>
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          className="w-full px-3 py-2.5 rounded-xl text-sm bg-white/5 border border-white/8 placeholder:opacity-30 focus:border-white/20 transition-colors"
                          style={{ color: theme.text }}
                        />
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="px-3 py-2.5 rounded-xl text-sm bg-white/5 border border-white/8 placeholder:opacity-30 focus:border-white/20 transition-colors"
                            style={{ color: theme.text }}
                          />
                          <input
                            type="text"
                            placeholder="CVV"
                            className="px-3 py-2.5 rounded-xl text-sm bg-white/5 border border-white/8 placeholder:opacity-30 focus:border-white/20 transition-colors"
                            style={{ color: theme.text }}
                          />
                        </div>
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all hover:brightness-110"
                      style={{ background: theme.accent, color: '#0a0a0a' }}
                    >
                      Оплатить {formatPrice(product.price)}
                    </button>
                  </motion.form>
                )}

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 mt-5">
                  <div className="flex items-center gap-1.5 text-[11px] opacity-30" style={{ color: theme.text }}>
                    <Shield size={11} />
                    Безопасно
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] opacity-30" style={{ color: theme.text }}>
                    <Download size={11} />
                    Мгновенно
                  </div>
                </div>
              </div>

              {/* Powered by Numi */}
              <div className="text-center mt-4">
                <span className="text-[10px] opacity-20 flex items-center justify-center gap-1" style={{ color: theme.text }}>
                  <Sparkles size={8} />
                  Powered by Numi
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
