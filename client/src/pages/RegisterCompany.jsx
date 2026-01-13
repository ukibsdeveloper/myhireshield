import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterCompany = () => {
  const navigate = useNavigate();
  const { registerCompany } = useAuth(); // Context se method liya
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // FLAT STATE FOR EASY INPUT HANDLING
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    website: '',
    industry: '',
    companySize: '',
    street: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    contactName: '',
    contactDesignation: '',
    contactPhone: '',
    contactEmail: '',
    gstin: '',
    cin: '',
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

  // VALIDATION LOGIC
  const validateStep1 = () => {
    if (!formData.companyName.trim()) { setError('Company name is required'); return false; }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) { setError('Valid company email is required'); return false; }

    // Optional: Personal email restriction
    const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = formData.email.split('@')[1];
    if (personalDomains.includes(domain)) { setError('Please use company email, not personal email'); return false; }

    if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return false; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return false; }
    if (!formData.industry) { setError('Please select an industry'); return false; }
    if (!formData.companySize) { setError('Please select company size'); return false; }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.city.trim()) { setError('City is required'); return false; }
    if (!formData.state.trim()) { setError('State is required'); return false; }
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) { setError('Valid 6-digit pincode is required'); return false; }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.contactName.trim()) { setError('Contact person name is required'); return false; }
    if (!formData.contactDesignation.trim()) { setError('Contact person designation is required'); return false; }
    if (!formData.contactPhone.trim() || !/^\d{10}$/.test(formData.contactPhone)) { setError('Valid 10-digit phone number is required'); return false; }
    if (!formData.agreeToTerms) { setError('You must agree to the terms node'); return false; }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
    window.scrollTo(0, 0);
  };

  // SUBMIT LOGIC SYNCED WITH BACKEND SCHEMA
  // Sirf handleSubmit function ko isse replace karein
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;
    setLoading(true);
    setError('');

    try {
      const payload = {
        companyName: formData.companyName,
        email: formData.email,
        password: formData.password,
        website: formData.website,
        industry: formData.industry,
        companySize: formData.companySize,
        address: {
          street: formData.street || '',
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode
        },
        contactPerson: {
          name: formData.contactName,
          designation: formData.contactDesignation,
          phone: formData.contactPhone,
          email: formData.contactEmail.trim() !== '' ? formData.contactEmail : formData.email // FIX: Never send empty string
        },
        gstin: formData.gstin,
        cin: formData.cin
      };

      const result = await registerCompany(payload);

      if (result.success) {
        toast.success('🎉 Registration successful! Welcome to MyHireShield', {
          duration: 4000,
        });
        setTimeout(() => navigate('/login'), 1500);
      } else {
        // Backend se jo error message aa raha hai wahi dikhayenge
        toast.error(result.message || result.error);
        setError(result.message || result.error);
      }
    } catch (err) {
      toast.error('Connection failed. Please check your server.');
      setError('Connection failed. Please check your server.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4c8051] focus:border-transparent outline-none transition-all font-medium text-[#496279] shadow-sm";

  return (
    <div className="min-h-screen flex bg-white overflow-hidden selection:bg-[#dd8d88]/30 font-sans antialiased">
      {/* 1. LEFT SIDE (BRANDING) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#496279] items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#4c8051] rounded-full blur-[120px] opacity-30"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#dd8d88] rounded-full blur-[120px] opacity-30"></div>

        <div className="relative z-10 max-w-lg">
          <Link to="/" className="inline-flex items-center gap-4 mb-12 group transition-transform hover:scale-105">
            <div className="h-16 w-16 bg-white rounded-2xl shadow-2xl flex items-center justify-center p-2">
              <img src="/logo.jpg" alt="HireShield" className="h-full w-full object-contain" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Hire<span className="text-[#4c8051]">Shield</span></p>
              <p className="text-[10px] font-black text-[#dd8d88] uppercase tracking-[0.3em] mt-1">Company Headquarters</p>
            </div>
          </Link>

          <h1 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter leading-tight">
            The Gateway to <br /> <span className="text-[#4c8051]">Trusted Teams.</span>
          </h1>
          <p className="text-white/60 text-lg font-bold uppercase tracking-widest leading-relaxed mb-16">
            Join the gold standard of professional integrity nodes.
          </p>

          <div className="space-y-10">
            {[
              { s: 1, l: 'Entity Detail', d: 'Enterprise identity setup' },
              { s: 2, l: 'Head Office', d: 'Headquarters verification' },
              { s: 3, l: 'Compliance Node', d: 'Legal authorization stage' }
            ].map((item) => (
              <div key={item.s} className={`flex items-start gap-6 transition-all duration-700 ${step >= item.s ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${step >= item.s ? 'bg-white text-[#496279] shadow-lg' : 'border-2 border-white/20 text-white'
                  }`}>
                  {step > item.s ? <i className="fas fa-check text-xs"></i> : item.s}
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">{item.l}</h3>
                  <p className="text-[10px] font-bold text-white/50 uppercase mt-1 tracking-wider">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. RIGHT SIDE (FORM) */}
      <div className="w-full lg:w-1/2 flex flex-col bg-[#fcfaf9] relative overflow-y-auto">
        <div className="flex-grow flex items-center justify-center px-6 md:px-12 lg:px-20 py-16">
          <div className="w-full max-w-lg">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-black text-[#496279] uppercase tracking-tight mb-2">Company Registration</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Deploy your enterprise audit node</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-in fade-in duration-300">
                <i className="fas fa-shield-virus"></i> {error}
              </div>
            )}

            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Entity Name *</label>
                      <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className={inputClass} placeholder="Legal Name" required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Work Domain *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="hr@domain.com" required />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Access Key *</label>
                      <input type="password" name="password" value={formData.password} onChange={handleChange} className={inputClass} placeholder="8+ Characters" required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Verify Key *</label>
                      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={inputClass} placeholder="Re-type Key" required />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sector</label>
                      <select name="industry" value={formData.industry} onChange={handleChange} className={inputClass} required>
                        <option value="">Select</option>
                        <option value="IT & Software">IT & Software</option>
                        <option value="Finance">Finance</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Retail">Retail</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Asset Size</label>
                      <select name="companySize" value={formData.companySize} onChange={handleChange} className={inputClass} required>
                        <option value="">Select</option>
                        <option value="1-10">1-10 Members</option>
                        <option value="11-50">11-50 Members</option>
                        <option value="51-200">51-200 Members</option>
                        <option value="201-500">201-500 Members</option>
                        <option value="500+">500+ Members</option>
                      </select>
                    </div>
                  </div>
                  <button type="button" onClick={handleNext} className="w-full bg-[#496279] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-xl hover:bg-[#3a4e61] transition-all flex items-center justify-center gap-3">
                    Initialize Next Stage <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Physical Address Node</label>
                    <input type="text" name="street" value={formData.street} onChange={handleChange} className={inputClass} placeholder="Building, Street" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">City Node *</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">State Node *</label>
                      <input type="text" name="state" value={formData.state} onChange={handleChange} className={inputClass} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Zip Code *</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className={inputClass} required maxLength="6" />
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={handleBack} className="w-1/3 border-2 border-slate-200 text-[#496279] py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white">Return</button>
                    <button type="button" onClick={handleNext} className="w-2/3 bg-[#496279] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-xl hover:bg-[#3a4e61] transition-all flex items-center justify-center gap-3">
                      Verify Address <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Admin Name *</label>
                      <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} className={inputClass} required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Admin Role *</label>
                      <input type="text" name="contactDesignation" value={formData.contactDesignation} onChange={handleChange} className={inputClass} placeholder="CEO, HR Manager, etc." required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Audit Phone *</label>
                    <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className={inputClass} required maxLength="10" />
                  </div>
                  <div className="p-5 bg-[#4c8051]/5 rounded-2xl border border-[#4c8051]/10">
                    <div className="flex items-start gap-3">
                      <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} className="mt-1 w-4 h-4 accent-[#4c8051] rounded cursor-pointer" required />
                      <label className="text-[10px] font-black text-slate-500 uppercase leading-relaxed tracking-wider">
                        I COMMIT TO THE <Link to="/terms" className="text-[#4c8051] underline">TERMS OF PROTOCOL</Link> AND <Link to="/privacy" className="text-[#4c8051] underline">DATA PRIVACY NODE</Link>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={handleBack} className="w-1/3 border-2 border-slate-200 text-[#496279] py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white">Return</button>
                    <button type="button" onClick={handleSubmit} disabled={loading} className="w-2/3 bg-[#4c8051] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-xl hover:bg-[#3d6641] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2">
                      {loading && <i className="fas fa-circle-notch fa-spin"></i>}
                      {loading ? 'Creating Account...' : 'Create Company Account'}
                    </button>
                  </div>
                </div>
              )}
            </form>

            <div className="mt-12 text-center border-t border-slate-100 pt-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Existing Node? <Link to="/login" className="text-[#496279] ml-2 hover:underline underline-offset-4">Authenticate Access</Link>
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 text-center lg:text-left opacity-30">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">© 2026 HireShield Intelligence Network</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterCompany;