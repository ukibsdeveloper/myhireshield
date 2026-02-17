import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageMeta from '../components/PageMeta';
import { authAPI } from '../utils/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Request a new one from the forgot password page.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.resetPassword(token, password);
      if (res.data.success) {
        setSuccess(true);
        toast.success('Password reset successful. You can log in now.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(res.data.message || 'Reset failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired link. Request a new reset link.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#fcfaf9] flex items-center justify-center px-6">
        <PageMeta title="Password reset" description="Your password has been reset." noIndex />
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#4c8051]/10 text-[#4c8051] mb-6">
            <i className="fas fa-check-circle text-3xl"></i>
          </div>
          <h1 className="text-2xl font-black text-[#496279] mb-2">Password reset</h1>
          <p className="text-slate-500 text-sm mb-8">Your password has been updated. Redirecting to login...</p>
          <Link
            to="/login"
            className="inline-block px-8 py-4 bg-[#496279] text-white rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-[#3a4e61] transition-colors"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf9] flex items-center justify-center px-6">
      <PageMeta title="Set new password" description="Set a new password for your HireShield account." noIndex />
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <img src="/logo.jpg" alt="HireShield" className="h-10 w-10 rounded-xl object-cover" />
            <span className="text-xl font-black text-[#496279]">Hire<span className="text-[#4c8051]">Shield</span></span>
          </Link>
          <h1 className="text-2xl font-black text-[#496279] mb-2">Set new password</h1>
          <p className="text-slate-500 text-sm">Enter your new password below.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-xs font-bold flex items-center gap-3">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        {!token ? (
          <Link
            to="/forgot-password"
            className="block w-full py-4 bg-[#496279] text-white rounded-xl font-bold text-xs tracking-widest uppercase text-center hover:bg-[#3a4e61] transition-colors"
          >
            Request new reset link
          </Link>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 tracking-widest mb-2">New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4c8051] focus:border-transparent outline-none text-[#496279]"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 tracking-widest mb-2">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4c8051] focus:border-transparent outline-none text-[#496279]"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#496279] text-white rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-[#3a4e61] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <i className="fas fa-circle-notch fa-spin"></i>}
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        )}

        <p className="mt-8 text-center">
          <Link to="/login" className="text-[#496279] font-bold text-sm hover:text-[#4c8051]">Back to login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
