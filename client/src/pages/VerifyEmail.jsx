import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageMeta from '../components/PageMeta';
import { authAPI } from '../utils/api';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }
    authAPI
      .verifyEmail(token)
      .then((res) => {
        if (res.data.success) {
          setStatus('success');
          toast.success('Email verified. You can log in now.');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#fcfaf9] flex items-center justify-center px-6">
        <PageMeta title="Verifying email" noIndex />
        <div className="text-center">
          <i className="fas fa-shield-halved fa-spin text-4xl text-[#496279] mb-4"></i>
          <p className="text-[#496279] font-black uppercase tracking-widest text-xs">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#fcfaf9] flex items-center justify-center px-6">
        <PageMeta title="Email verified" description="Your email has been verified." noIndex />
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#4c8051]/10 text-[#4c8051] mb-6">
            <i className="fas fa-check-circle text-3xl"></i>
          </div>
          <h1 className="text-2xl font-black text-[#496279] mb-2">Email verified</h1>
          <p className="text-slate-500 text-sm mb-8">Your email has been verified. You can now log in to your account.</p>
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
      <PageMeta title="Verification failed" noIndex />
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#dd8d88]/10 text-[#dd8d88] mb-6">
          <i className="fas fa-times-circle text-3xl"></i>
        </div>
        <h1 className="text-2xl font-black text-[#496279] mb-2">Verification failed</h1>
        <p className="text-slate-500 text-sm mb-8">This link is invalid or has expired. Request a new verification email from your dashboard or when logging in.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="inline-block px-8 py-4 bg-[#496279] text-white rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-[#3a4e61] transition-colors"
          >
            Go to login
          </Link>
          <Link
            to="/"
            className="inline-block px-8 py-4 border-2 border-[#496279] text-[#496279] rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-[#496279]/5 transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
