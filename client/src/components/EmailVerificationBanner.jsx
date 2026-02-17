import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function EmailVerificationBanner() {
  const { user, emailVerified, resendVerification, refreshUser } = useAuth();
  const [sending, setSending] = useState(false);

  if (!user || user.role !== 'employee' || emailVerified) return null;

  const handleResend = async () => {
    setSending(true);
    const email = user.email || user.profile?.email;
    const result = await resendVerification(email);
    setSending(false);
    if (result.success) {
      toast.success('Verification email sent. Check your inbox.');
    } else {
      toast.error(result.error || 'Failed to send');
    }
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
          <i className="fas fa-envelope-open-text"></i>
        </div>
        <div>
          <p className="font-bold text-[#496279] text-sm">Verify your email</p>
          <p className="text-slate-500 text-xs">We sent a link to your email. Click it to verify and unlock all features.</p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleResend}
        disabled={sending}
        className="px-4 py-2 bg-[#496279] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#3a4e61] disabled:opacity-60 transition-colors"
      >
        {sending ? 'Sending...' : 'Resend email'}
      </button>
    </div>
  );
}
