import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import DateInput from '../components/DateInput';
import PageMeta from '../components/PageMeta';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const [role, setRole] = useState('company');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') navigate('/admin/verify-reviews');
      else if (user.role === 'company') navigate('/dashboard/company');
      else navigate('/dashboard/employee');
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const loadingToast = toast.loading('Authenticating...');

    try {
      // Step 1: Backend ke naye AuthContext function ke hisaab se payload taiyaar karna
      let credentials = {};

      if (role === 'company') {
        credentials = {
          email: formData.email,
          password: formData.password
        };
      } else {
        // Employee login: Email + Password (secure authentication)
        credentials = {
          email: formData.email,
          password: formData.password
        };
      }

      // Step 2: Login call
      const result = await login(credentials, role);

      if (result.success) {
        const displayName = result.user.profile?.firstName || result.user.profile?.companyName || (result.user.role === 'company' ? 'Company' : 'User');
        toast.success(`Welcome back, ${displayName}! 🎉`, {
          id: loadingToast,
        });
        // Navigation handled by useEffect, but adding fallback
        if (result.user.role === 'admin') navigate('/admin/verify-reviews');
        else if (result.user.role === 'company') navigate('/dashboard/company');
        else navigate('/dashboard/employee');
      } else {
        toast.error(result.error || 'Identity credentials mismatch', {
          id: loadingToast,
        });
        setError(result.error || 'Identity credentials mismatch');
      }
    } catch (err) {
      toast.error('Connection failed. Please try again.', {
        id: loadingToast,
      });
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4c8051] focus:border-transparent outline-none transition-all font-medium text-[#496279] shadow-sm";

  return (
    <div className="min-h-screen flex bg-white overflow-hidden selection:bg-[#4c8051]/20">
      <PageMeta title="Login" description="Sign in to your HireShield account as a company or employee." canonical="/login" noIndex />
      {/* LEFT SIDE: Visual Brand Portal */}
      <div className="hidden lg:flex w-1/2 relative bg-[#496279] items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#4c8051] rounded-full blur-[120px] opacity-30"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#dd8d88] rounded-full blur-[120px] opacity-30"></div>

        <div className="relative z-10 max-w-lg text-center">
          <Link to="/" className="inline-flex items-center gap-4 mb-12 group transition-transform hover:scale-105">
            <div className="h-20 w-20 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center p-3">
              <img src="/logo.jpg" alt="HireShield" className="h-full w-full object-contain" />
            </div>
          </Link>
          <h1 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter leading-tight">
            The Gateway to <br /> <span className="text-[#4c8051]">Trusted Teams.</span>
          </h1>
          <p className="text-white/60 text-lg font-bold tracking-widest leading-relaxed">
            Making hiring simple and safe for everyone.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Login Interface */}
      <div className="w-full lg:w-1/2 flex flex-col bg-[#fcfaf9] relative">
        <div className="flex-grow flex items-center justify-center px-6 md:px-12 lg:px-24 py-12">
          <div className="w-full max-w-md">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-black text-[#496279] tracking-tight mb-2 uppercase">Login</h2>
              <p className="text-xs font-bold text-slate-400 tracking-[0.2em]">Please enter your details</p>
            </div>

            {/* Role Switcher */}
            <div className="flex p-1 bg-slate-200/50 rounded-2xl mb-8 border border-slate-200">
              {['company', 'employee'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setRole(r); setError(''); }}
                  className={`flex-1 py-3.5 rounded-xl text-xs font-black tracking-[0.2em] transition-all uppercase ${role === r ? 'bg-white text-[#496279] shadow-md' : 'text-slate-500 hover:text-[#496279]'
                    }`}
                >
                  {r === 'company' ? 'Company' : 'Employee'}
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-in fade-in duration-300">
                <i className="fas fa-exclamation-circle"></i> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {role === 'company' ? (
                <>
                  <div>
                    <label className="block text-xs font-black text-slate-400 tracking-widest mb-2 ml-1">Work Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="example@company.com" required />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2 ml-1">
                      <label className="text-xs font-black text-slate-400 tracking-widest">Password</label>
                      <Link to="/forgot-password" className="text-xs font-bold text-[#4c8051] hover:underline">Forgot password?</Link>
                    </div>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className={inputClass} placeholder="••••••••" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-black text-slate-400 tracking-widest mb-2 ml-1">First Name (As per ID Card)</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass} placeholder="EX: RAHUL" required />
                  </div>
                  <DateInput
                    label="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={(val) => setFormData(prev => ({ ...prev, dateOfBirth: val }))}
                    required
                  />
                  <div className="p-4 bg-[#4c8051]/5 rounded-xl border border-[#4c8051]/10">
                    <p className="text-xs font-bold text-[#4c8051] leading-tight tracking-wider">
                      <i className="fas fa-info-circle mr-1"></i> Employees must be registered by their company to log in.
                    </p>
                  </div>
                </>
              )}


              <button type="submit" disabled={loading} className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#496279] text-white hover:bg-[#3a4e61]'
                }`}>
                {loading && <i className="fas fa-circle-notch fa-spin"></i>}
                {loading ? 'Checking...' : 'Login Now'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;