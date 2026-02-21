import React, { useState, useEffect, useRef } from 'react';
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
    firstName: '',
    dateOfBirth: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'company') navigate('/dashboard/company');
      else navigate('/dashboard/employee');
    }
    // Entrance animation
    const timer = setTimeout(() => setFormVisible(true), 150);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    setFormData({ email: '', password: '', firstName: '', dateOfBirth: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const loadingToast = toast.loading('Signing you in...');

    try {
      let credentials = {};

      if (role === 'company' || role === 'admin') {
        if (!formData.email || !formData.password) {
          toast.error('Email and password are required', { id: loadingToast });
          setError('Email and password are required');
          setLoading(false);
          return;
        }
        credentials = { email: formData.email, password: formData.password };
      } else {
        if (!formData.firstName || !formData.dateOfBirth) {
          toast.error('Full name and date of birth are required', { id: loadingToast });
          setError('Full name and date of birth are required');
          setLoading(false);
          return;
        }
        credentials = { firstName: formData.firstName, dateOfBirth: formData.dateOfBirth };
      }

      const result = await login(credentials, role);

      if (result.success) {
        toast.success('Welcome back! 🎉', { id: loadingToast });
        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'company') navigate('/dashboard/company');
        else navigate('/dashboard/employee');
      } else {
        toast.error(result.error || 'Login failed. Please check your details.', { id: loadingToast });
        setError(result.error || 'Login failed. Please check your details.');
        setShakeError(true);
        setTimeout(() => setShakeError(false), 600);
      }
    } catch (err) {
      toast.error('Connection failed. Please try again.', { id: loadingToast });
      setError('Connection failed. Please try again.');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4c8051] focus:border-transparent outline-none transition-all font-medium text-[#496279] shadow-sm text-sm";

  return (
    <div className="min-h-screen flex bg-white overflow-hidden selection:bg-[#4c8051]/20">
      <PageMeta title="Login — MyHireShield" description="Sign in to your MyHireShield account as a company or employee." canonical="/login" noIndex />

      {/* LEFT SIDE: Visual Brand Portal */}
      <div className="hidden lg:flex w-1/2 relative bg-[#496279] items-center justify-center p-12 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}
        ></div>
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#4c8051] rounded-full blur-[120px] opacity-30"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#da8b86] rounded-full blur-[120px] opacity-25"></div>

        <div className="relative z-10 max-w-lg text-center">
          <Link to="/" className="inline-flex items-center gap-4 mb-14 group transition-transform hover:scale-105">
            <div className="h-20 w-20 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center p-3 transition-transform group-hover:rotate-6">
              <img src="/logo.jpg" alt="HireShield" className="h-full w-full object-contain rounded-xl" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-black text-white tracking-tight leading-none">
                Hire<span className="text-[#4c8051]">Shield</span>
              </p>
              <p className="text-[11px] font-bold text-white/40 tracking-[0.25em] mt-1">TRUSTED HIRING PLATFORM</p>
            </div>
          </Link>

          <h1 className="text-5xl font-black text-white mb-5 uppercase tracking-tighter leading-[1.05]">
            The Gateway to <br />
            <span className="text-[#4c8051]">Trusted Teams.</span>
          </h1>
          <p className="text-white/50 text-base font-medium leading-relaxed mb-12">
            Verify employee backgrounds, build trust, and hire with confidence.
          </p>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: 'fa-shield-halved', label: 'Verified Data' },
              { icon: 'fa-lock', label: 'Secure & Safe' },
              { icon: 'fa-bolt', label: 'Instant Access' },
            ].map((badge, i) => (
              <div key={i} className="bg-white/8 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
                <i className={`fas ${badge.icon} text-[#4c8051] text-xl mb-2 block`}></i>
                <p className="text-white/60 text-xs font-semibold tracking-wider">{badge.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Interface */}
      <div className="w-full lg:w-1/2 flex flex-col bg-[#fcfaf9] relative overflow-y-auto">
        <div className="flex-grow flex items-center justify-center px-6 md:px-12 lg:px-16 py-12">
          <div ref={formRef} className={`w-full max-w-md transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${shakeError ? 'animate-shake' : ''}`}>

            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-3 mb-8">
              <div className="h-10 w-10 bg-white rounded-xl shadow-lg flex items-center justify-center p-1.5 border border-slate-100">
                <img src="/logo.jpg" alt="HireShield" className="h-full w-full object-contain rounded-lg" />
              </div>
              <div>
                <p className="text-lg font-black text-[#496279] leading-none">
                  Hire<span className="text-[#4c8051]">Shield</span>
                </p>
                <p className="text-xs text-slate-400 font-bold tracking-wider">TRUSTED HIRING</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-black text-[#496279] tracking-tight mb-1">Welcome Back</h2>
              <p className="text-sm text-slate-400 font-medium">Select your role and sign in to continue</p>
            </div>

            {/* Role Selector */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { id: 'company', label: 'Company / HR', icon: 'fa-building', desc: 'Email & password' },
                { id: 'employee', label: 'Employee', icon: 'fa-user-tie', desc: 'Name & date of birth' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleChange(r.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${role === r.id
                      ? 'border-[#496279] bg-[#496279] text-white shadow-lg shadow-[#496279]/20 scale-[1.02]'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-[#496279]/40 hover:text-[#496279]'
                    }`}
                >
                  <i className={`fas ${r.icon} text-lg`}></i>
                  <span className="text-xs font-black tracking-wide">{r.label}</span>
                  <span className={`text-[10px] font-medium leading-tight text-center ${role === r.id ? 'text-white/70' : 'text-slate-400'}`}>
                    {r.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Admin Login Toggle */}
            <div className="mb-6 flex justify-center">
              <button
                type="button"
                onClick={() => handleRoleChange(role === 'admin' ? 'company' : 'admin')}
                className={`text-xs font-bold transition-all px-4 py-2 rounded-xl border ${role === 'admin'
                    ? 'bg-[#da8b86]/10 text-[#da8b86] border-[#da8b86]/30 shadow-sm'
                    : 'text-slate-400 border-slate-200 hover:text-[#da8b86] hover:border-[#da8b86]/30 bg-white'
                  }`}
              >
                <i className="fas fa-user-shield mr-2"></i>
                {role === 'admin' ? '← Back to Company/Employee Login' : 'Admin Login'}
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl text-rose-700 text-sm font-semibold flex items-start gap-3 animate-slideDown">
                <i className="fas fa-exclamation-circle mt-0.5 flex-shrink-0"></i>
                <span>{error}</span>
                <button onClick={() => setError('')} className="ml-auto text-rose-400 hover:text-rose-600 transition-colors flex-shrink-0" aria-label="Dismiss error">
                  <i className="fas fa-times text-xs"></i>
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {(role === 'company' || role === 'admin') ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 tracking-widest mb-2 uppercase">
                      {role === 'admin' ? 'Admin Email' : 'Company Email Address'}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder={role === 'admin' ? 'admin@myhireshield.com' : 'hr@yourcompany.com'}
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-500 tracking-widest uppercase">Password</label>
                      {role === 'company' && (
                        <Link to="/forgot-password" className="text-xs font-bold text-[#4c8051] hover:underline underline-offset-2">
                          Forgot password?
                        </Link>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={inputClass + ' pr-12'}
                        placeholder="Enter your password"
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#496279] transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-[#4c8051]/5 border border-[#4c8051]/15 rounded-2xl">
                    <div className="flex items-start gap-3">
                      <i className="fas fa-info-circle text-[#4c8051] mt-0.5 flex-shrink-0"></i>
                      <div>
                        <p className="text-sm font-bold text-[#496279] mb-1">Employee Login</p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Your company registered your account. Enter your <strong>first name</strong> as registered and your <strong>date of birth</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 tracking-widest mb-2 uppercase">
                      First Name (As Registered)
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="e.g. Rahul"
                      required
                    />
                    <p className="text-xs text-slate-400 mt-1.5 ml-1">
                      <i className="fas fa-exclamation-triangle mr-1 text-amber-400"></i>
                      Enter exactly as your HR registered you
                    </p>
                  </div>
                  <DateInput
                    label="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={(val) => { setFormData(prev => ({ ...prev, dateOfBirth: val })); setError(''); }}
                    required
                  />
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 mt-2 ${loading
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#496279] text-white hover:bg-[#3a4e61] hover:shadow-xl hover:shadow-[#496279]/25 hover:-translate-y-0.5'
                  }`}
              >
                {loading && <i className="fas fa-circle-notch fa-spin"></i>}
                {loading ? 'Signing In...' : (
                  <>
                    Sign In
                    <i className="fas fa-arrow-right text-xs"></i>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500 font-medium">
                New company?{' '}
                <Link to="/register/company" className="text-[#4c8051] font-bold hover:underline underline-offset-2">
                  Register your company →
                </Link>
              </p>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
              <i className="fas fa-lock text-[#4c8051]"></i>
              <span>256-bit SSL encrypted · GDPR compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error shake animation + slide-down */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 50%, 90% { transform: translateX(-4px); }
          30%, 70% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}} />
    </div>
  );
};

export default Login;