import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth(); // AuthContext integration
  
  const [role, setRole] = useState('company');
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // If already authenticated, redirect to terminal
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'company' ? '/dashboard/company' : '/dashboard/employee');
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
    try {
      // Calling logic from AuthContext
      const result = await login(formData.email, formData.password, role);
      if (result.success) {
        // Dynamic routing based on node type
        navigate(result.user.role === 'company' ? '/dashboard/company' : '/dashboard/employee');
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4c8051] focus:border-transparent outline-none transition-all font-medium text-[#496279] shadow-sm";

  return (
    <div className="min-h-screen flex bg-white overflow-hidden selection:bg-[#4c8051]/20">
      {/* 1. LEFT SIDE: Visual Brand Portal (50%) */}
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
            The Gateway to <br /> <span className="text-[#4c8051]">Professional Trust.</span>
          </h1>
          <p className="text-white/60 text-lg font-bold uppercase tracking-widest leading-relaxed">
            Standardizing integrity nodes for the modern enterprise ecosystem.
          </p>
          
          <div className="mt-16 pt-12 border-t border-white/10 flex justify-center gap-12 text-center">
            <div>
              <p className="text-2xl font-black text-white uppercase tracking-tighter">100%</p>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Encrypted</p>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div>
              <p className="text-2xl font-black text-white uppercase tracking-tighter">ISO</p>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Compliant</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RIGHT SIDE: Login Interface (50%) */}
      <div className="w-full lg:w-1/2 flex flex-col bg-[#fcfaf9] relative">
        <div className="lg:hidden p-6 flex justify-between items-center bg-white border-b border-slate-100">
           <Link to="/" className="flex items-center gap-2">
              <img src="/logo.jpg" className="h-8 w-8 rounded-lg" alt="logo" />
              <span className="text-sm font-black text-[#496279] uppercase tracking-tighter">HireShield</span>
           </Link>
           <Link to="/" className="text-[10px] font-black uppercase text-slate-400">Back Home</Link>
        </div>

        <div className="flex-grow flex items-center justify-center px-6 md:px-12 lg:px-24 py-12">
          <div className="w-full max-w-md">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-black text-[#496279] uppercase tracking-tight mb-2">Portal Access</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Authorized credentials required</p>
            </div>

            {/* Role Switcher Node */}
            <div className="flex p-1 bg-slate-200/50 rounded-2xl mb-8 border border-slate-200">
              {['company', 'employee'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    role === r ? 'bg-white text-[#496279] shadow-md' : 'text-slate-500 hover:text-[#496279]'
                  }`}
                >
                  {r === 'company' ? <><i className="fas fa-building mr-2"></i>Enterprise</> : <><i className="fas fa-user-tie mr-2"></i>Professional</>}
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-in fade-in slide-in-from-left duration-300">
                <i className="fas fa-shield-virus"></i> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Corporate ID / Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="node@enterprise.com" required />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Key</label>
                  <Link to="/forgot-password" size="sm" className="text-[9px] font-black text-[#4c8051] uppercase tracking-widest hover:text-[#3d6641]">Recovery Node?</Link>
                </div>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className={inputClass} placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#496279]">
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2 ml-1">
                <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} className="w-4 h-4 accent-[#496279] rounded border-slate-300" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Maintain Active Session</span>
              </div>

              <button type="submit" disabled={loading} className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#496279] text-white hover:bg-[#3a4e61] shadow-[#496279]/20'
              }`}>
                {loading ? <><i className="fas fa-circle-notch fa-spin"></i> Verifying Node...</> : 'Authenticate Access'}
              </button>
            </form>

            <div className="mt-12 text-center border-t border-slate-100 pt-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                New User Node? <Link to={role === 'company' ? '/register/company' : '/register/employee'} className="text-[#4c8051] ml-2 hover:underline underline-offset-4">Register Hub Account</Link>
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 text-center lg:text-left opacity-30">
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">© 2026 HireShield Intelligence Network // Standardized Protocols</p>
        </div>
      </div>
    </div>
  );
};

export default Login;