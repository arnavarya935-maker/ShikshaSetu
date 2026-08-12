'use client';

import { useState } from 'react';
import { CreditCard, Smartphone, Landmark, Loader2, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type PaymentModalProps = {
  courseTitle: string;
  coursePrice: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

type PaymentMethod = 'card' | 'upi' | 'netbanking';

export default function PaymentModal({ courseTitle, coursePrice, isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  // Form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  if (!isOpen) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      setLoadingStep('Securing payment gateway connection...');
      await new Promise((r) => setTimeout(r, 1200));

      setLoadingStep('Authorizing credentials...');
      await new Promise((r) => setTimeout(r, 1000));

      setLoadingStep('Completing transaction...');
      await new Promise((r) => setTimeout(r, 800));

      setSuccess(true);
      await new Promise((r) => setTimeout(r, 1200));

      onSuccess();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 16);
    const matches = value.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(value);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      setCardExpiry(`${value.substring(0, 2)}/${value.substring(2, 4)}`);
    } else {
      setCardExpiry(value);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={loading ? undefined : onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
      />

      {/* Modal Box */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 p-6 shadow-[0_32px_100px_rgba(0,0,0,0.8)] z-10"
      >
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 rounded-full border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white transition disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Loading / Success Overlays */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center text-center p-6 z-20"
            >
              {success ? (
                <motion.div
                  initial={{ scale: 0.6, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="space-y-4"
                >
                  <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-400" />
                  <h3 className="text-xl font-bold text-white">Payment Successful!</h3>
                  <p className="text-xs text-slate-400">Welcome to {courseTitle}!</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <Loader2 className="mx-auto h-12 w-12 text-violet-500 animate-spin" />
                  <h3 className="text-lg font-semibold text-white">Processing Transaction</h3>
                  <p className="text-xs text-slate-400 font-mono">{loadingStep}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main form details */}
        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest block mb-1">Secure Checkout</span>
            <h2 className="text-lg font-extrabold text-white truncate">{courseTitle}</h2>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">₹{coursePrice}</span>
              <span className="text-xs text-slate-500">Includes all digital study guides & certificate</span>
            </div>
          </div>

          {/* Payment Method Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-900/60 border border-slate-900 p-1">
            <button
              onClick={() => setMethod('card')}
              className={`flex flex-col items-center justify-center py-2 rounded-md text-xs font-medium gap-1 transition-colors ${
                method === 'card' ? 'bg-[#171717] !text-white dark:bg-white dark:!text-[#171717]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="h-4 w-4" />
              Card
            </button>
            <button
              onClick={() => setMethod('upi')}
              className={`flex flex-col items-center justify-center py-2 rounded-md text-xs font-medium gap-1 transition-colors ${
                method === 'upi' ? 'bg-[#171717] !text-white dark:bg-white dark:!text-[#171717]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="h-4 w-4" />
              UPI
            </button>
            <button
              onClick={() => setMethod('netbanking')}
              className={`flex flex-col items-center justify-center py-2 rounded-md text-xs font-medium gap-1 transition-colors ${
                method === 'netbanking' ? 'bg-[#171717] !text-white dark:bg-white dark:!text-[#171717]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Landmark className="h-4 w-4" />
              Banking
            </button>
          </div>

          {/* Input details form */}
          <form onSubmit={handlePay} className="space-y-4">
            {method === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4111 2222 3333 4444"
                    required
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-zinc-400 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-zinc-400 transition-colors text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                      placeholder="•••"
                      maxLength={3}
                      required
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-zinc-400 transition-colors text-center"
                    />
                  </div>
                </div>
              </div>
            )}

            {method === 'upi' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">UPI ID (VPA)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@upi"
                    required={method === 'upi'}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-zinc-400 transition-colors"
                  />
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-900 bg-slate-900/30">
                  {/* Simulated QR Code box */}
                  <div className="h-28 w-28 rounded-lg bg-white p-2 flex items-center justify-center shadow-none">
                    <img
                      src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect x='0' y='0' width='30' height='30' fill='black'/><rect x='70' y='0' width='30' height='30' fill='black'/><rect x='0' y='70' width='30' height='30' fill='black'/><rect x='30' y='30' width='40' height='40' fill='black'/></svg>"
                      alt="Simulated QR Code"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <p className="mt-2 text-[10px] text-slate-500 font-mono font-semibold uppercase tracking-wider">or scan simulated QR Code</p>
                </div>
              </div>
            )}

            {method === 'netbanking' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Select Your Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  required={method === 'netbanking'}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-zinc-400 transition-colors"
                >
                  <option value="" className="bg-slate-950 text-slate-450">-- Choose Bank --</option>
                  <option value="sbi" className="bg-slate-950 text-slate-100">State Bank of India</option>
                  <option value="hdfc" className="bg-slate-950 text-slate-100">HDFC Bank</option>
                  <option value="icici" className="bg-slate-950 text-slate-100">ICICI Bank</option>
                  <option value="axis" className="bg-slate-950 text-slate-100">Axis Bank</option>
                  <option value="pnb" className="bg-slate-950 text-slate-100">Punjab National Bank</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-[#171717] hover:bg-[#262626] dark:bg-white dark:hover:bg-zinc-100 py-3 text-xs font-medium !text-white dark:!text-[#171717] transition-colors shadow-none flex items-center justify-center gap-1.5"
            >
              Pay ₹{coursePrice}
            </button>
          </form>

        </div>
      </motion.div>
    </div>
  );
}
