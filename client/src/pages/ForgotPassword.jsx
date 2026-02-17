import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageMeta from '../components/PageMeta';
import { authAPI } from '../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.forgotPassword(email);
      if (res.data.success) {
        setSent(true);
        toast.success('Check your email for the reset link.');
      } else {
        setError(res.data.message || 'Request failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-[#fcfaf9] flex items-center justify-center px-6">
        <PageMeta title="Check your email" description="Password reset email sent." noIndex />
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#4c8051]/10 text-[#4c8051] mb-6">
            <i className="fas fa-envelope-open-text text-3xl"></i>
          </div>
          <h1 className="text-2xl font-black text-[#496279] mb-2">Check your email</h1>
          <p className="text-slate-500 text-sm mb-8">
            We sent a password reset link to <strong>{email}</strong>. Click the link in the email to set a new password.
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-4 bg-[#496279] text-white rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-[#3a4e61] transition-colors"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf9] flex items-center justify-center px-6">
      <PageMeta title="Forgot password" description="Reset your HireShield account password." noIndex />
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <img src="/logo.jpg" alt="HireShield" className="h-10 w-10 rounded-xl object-cover" />
            <span className="text-xl font-black text-[#496279]">Hire<span className="text-[#4c8051]">Shield</span></span>
          </Link>
          <h1 className="text-2xl font-black text-[#496279] mb-2">Forgot password?</h1>
          <p className="text-slate-500 text-sm">Enter your email and we’ll send you a reset link.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-xs font-bold flex items-center gap-3">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-400 tracking-widest mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4c8051] focus:border-transparent outline-none text-[#496279]"
              placeholder="you@company.com"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#496279] text-white rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-[#3a4e61] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <i className="fas fa-circle-notch fa-spin"></i>}
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <p className="mt-8 text-center">
          <Link to="/login" className="text-[#496279] font-bold text-sm hover:text-[#4c8051]">Back to login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
