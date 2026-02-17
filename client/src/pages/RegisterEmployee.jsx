import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { camelCaseName } from '../utils/helpers';
import toast from 'react-hot-toast';
import DateInput from '../components/DateInput';

const RegisterEmployee = () => {
  const navigate = useNavigate();
  const { registerEmployee, resendVerification } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);
  const [successEmail, setSuccessEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  // ORIGINAL STATE MAINTAINED
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    street: '', // Added for full address support
    city: '',
    state: '',
    pincode: '',
    agreeToTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // CLIENT-SIDE VALIDATION
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms of Protocol');
      setLoading(false);
      return;
    }

    try {
      // BACKEND SYNC: Nested address object taiyaar karna
      const payload = {
        firstName: camelCaseName(formData.firstName.trim()),
        lastName: camelCaseName(formData.lastName.trim()),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: {
          street: formData.street || 'Not Provided',
          city: formData.city,
          state: formData.state,
          country: 'India',
          pincode: formData.pincode
        }
      };

      // API call via AuthContext
      const result = await registerEmployee(payload);

      if (result.success) {
        setSuccessEmail(formData.email);
        setShowVerificationNotice(true);
        toast.success('Account created! Check your email to verify.');
      } else {
        toast.error(result.error || 'Registration failed. Please try again.');
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      toast.error('Connection failed. Please try again.');
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    const result = await resendVerification(successEmail);
    setResendLoading(false);
    if (result.success) toast.success('Verification email sent. Check your inbox.');
    else toast.error(result.error || 'Failed to send');
  };

  const inputClass = "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4c8051] focus:border-transparent outline-none transition-all font-medium text-[#496279] shadow-sm";

  if (showVerificationNotice) {
    return (
      <div className="min-h-screen flex bg-[#fcfaf9] items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#4c8051]/10 text-[#4c8051] mb-6">
            <i className="fas fa-envelope-circle-check text-3xl"></i>
          </div>
          <h1 className="text-2xl font-black text-[#496279] mb-2">Check your email</h1>
          <p className="text-slate-500 text-sm mb-6">
            We sent a verification link to <strong>{successEmail}</strong>. Click the link to verify your account.
          </p>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendLoading}
              className="w-full py-4 bg-[#496279] text-white rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-[#3a4e61] disabled:opacity-60 transition-colors"
            >
              {resendLoading ? 'Sending...' : 'Resend verification email'}
            </button>
            <Link to="/login" className="text-[#496279] font-bold text-sm hover:text-[#4c8051]">Go to login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white overflow-hidden selection:bg-[#dd8d88]/30 font-sans antialiased">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* 1. LEFT SIDE: Visual Brand Portal */}
      <div className="hidden lg:flex w-1/2 relative bg-[#496279] items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#4c8051] rounded-full blur-[120px] opacity-30"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#dd8d88] rounded-full blur-[120px] opacity-30"></div>

        <div className="relative z-10 max-w-lg text-center">
          <Link to="/" className="inline-flex items-center gap-4 mb-12 group transition-transform hover:scale-105">
            <div className="h-20 w-20 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center p-3 border border-slate-50">
              <img src="/logo.jpg" alt="HireShield" className="h-full w-full object-contain" />
            </div>
          </Link>
          <h1 className="text-5xl font-black text-white mb-6 tracking-tighter leading-tight uppercase">
            Create Your <br /> <span className="text-[#dd8d88]">Professional Profile.</span>
          </h1>
          <p className="text-white/60 text-lg font-bold tracking-widest leading-relaxed mb-12">
            Build your profile and see your honesty score.
          </p>

          <div className="grid grid-cols-2 gap-8 pt-12 border-t border-white/10">
            <div className="text-left group cursor-default">
              <i className="fas fa-id-card text-[#4c8051] text-2xl mb-4 transition-transform group-hover:scale-110"></i>
              <h4 className="text-white font-black text-xs tracking-widest">Verified Account</h4>
              <p className="text-white/40 text-xs mt-1 tracking-tighter">Secure & Trusted</p>
            </div>
            <div className="text-left group cursor-default">
              <i className="fas fa-chart-line text-[#dd8d88] text-2xl mb-4 transition-transform group-hover:scale-110"></i>
              <h4 className="text-white font-black text-xs tracking-widest">Trust Score</h4>
              <p className="text-white/40 text-xs mt-1 tracking-tighter">Standard Honesty</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RIGHT SIDE: Registration Interface */}
      <div className="w-full lg:w-1/2 flex flex-col bg-[#fcfaf9] relative overflow-y-auto">
        <div className="lg:hidden p-6 flex justify-between items-center bg-white border-b border-slate-100 sticky top-0 z-50">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.jpg" className="h-8 w-8 rounded-lg" alt="logo" />
            <span className="text-sm font-black text-[#496279] uppercase tracking-tighter">HireShield</span>
          </Link>
          <Link to="/login" className="text-xs font-black text-[#4c8051]">Sign In</Link>
        </div>

        <div className="flex-grow flex items-center justify-center px-6 md:px-12 lg:px-20 py-16">
          <div className="w-full max-w-xl">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-black text-[#496279] tracking-tight mb-2 uppercase">Employee Sign Up</h2>
              <p className="text-xs font-bold text-slate-400 tracking-[0.2em]">Join HireShield and show your work history</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-in slide-in-from-top duration-300">
                <i className="fas fa-exclamation-circle"></i> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 tracking-widest mb-2 ml-1">First Name *</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass} placeholder="First Name" required />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 tracking-widest mb-2 ml-1">Last Name *</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass} placeholder="Last Name" required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 tracking-widest mb-2 ml-1">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="name@email.com" required />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 tracking-widest mb-2 ml-1">Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="10 Digits" required maxLength="10" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 tracking-widest mb-2 ml-1">Password *</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className={inputClass} placeholder="6+ Characters" required />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 tracking-widest mb-2 ml-1">Confirm Password *</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={inputClass} placeholder="Verify Password" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <DateInput
                    label="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={(val) => setFormData(prev => ({ ...prev, dateOfBirth: val }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Gender *</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass} required>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">City *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} required />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">State *</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} className={inputClass} required />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Zip *</label>
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className={inputClass} required maxLength="6" />
                </div>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-inner">
                <div className="flex items-start gap-3">
                  <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} className="mt-1 w-4 h-4 accent-[#496279] cursor-pointer" required />
                  <label className="text-xs font-black text-slate-500 leading-relaxed tracking-wider">
                    I agree to the <Link to="/terms" className="text-[#496279] underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#496279] underline">Privacy Policy</Link>
                  </label>
                </div>
              </div>

              <button type="submit" disabled={loading} className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#496279] text-white hover:bg-[#3a4e61] shadow-[#496279]/30'
                }`}>
                {loading ? <><i className="fas fa-circle-notch fa-spin"></i> Starting...</> : 'Create Account'}
              </button>
            </form>

            <div className="mt-10 text-center border-t border-slate-100 pt-8">
              <p className="text-xs font-black text-slate-400 tracking-widest">
                Already have an account? <Link to="/login" className="text-[#4c8051] ml-2 hover:underline underline-offset-4">Login Here</Link>
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 text-center lg:text-left opacity-30">
          <p className="text-xs font-bold text-slate-400 tracking-[0.3em]">© 2026 HireShield Network</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterEmployee;