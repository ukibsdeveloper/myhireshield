import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '', // Ab yahan real number aayega
    dateOfBirth: '',
    gender: 'male',
    designation: '',
    department: 'General'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Phone number validation (6-9 se shuru aur exactly 10 digits)
      if (!/^[6-9]\d{9}$/.test(formData.phone)) {
        return alert("Error: Indian phone number must start with 6-9 and be exactly 10 digits.");
      }

      // 2. Age check (Frontend safety)
      const birthDate = new Date(formData.dateOfBirth);
      const age = (new Date() - birthDate) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 18) {
        return alert("Error: Employee must be at least 18 years old.");
      }

      const cleanDOB = formData.dateOfBirth.replace(/-/g, ""); // YYYYMMDD for password

      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: cleanDOB,
        confirmPassword: cleanDOB,
        dateOfBirth: formData.dateOfBirth, // YYYY-MM-DD format strictly
        gender: formData.gender.toLowerCase(), // female/male strictly lowercase
        phone: String(formData.phone).trim(),
        // Backend expects these as top-level fields
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001'
      };

      const res = await api.post('/auth/register/employee', payload);

      // Success check based on status code 201
      if (res.status === 201 || res.status === 200 || res.data.success) {
        alert("Employee Account Created Successfully! ✅");
        navigate('/dashboard/company');
      }

    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      if (backendErrors && backendErrors.length > 0) {
        alert(`Validation Failed: ${backendErrors[0].field} - ${backendErrors[0].message}`);
      } else {
        alert("Error: " + (err.response?.data?.message || "Please check your inputs"));
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-5 bg-white border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest outline-none focus:border-[#4c8051] focus:ring-4 ring-[#4c8051]/5 transition-all shadow-sm";
  const labelClass = "text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 mb-2 block";

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/20 font-sans antialiased text-[#496279] uppercase overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <Navbar scrolled={true} isAuthenticated={true} />

      <div className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
        <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-2xl border border-slate-50 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4c8051]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 bg-[#496279] rounded-[2rem] flex items-center justify-center text-white shadow-2xl group">
                <i className="fas fa-user-plus text-3xl group-hover:scale-110 transition-transform"></i>
              </div>
              <div>
                <h2 className="text-4xl font-black tracking-tighter leading-none mb-3">Add <span className="text-[#4c8051]">Employee.</span></h2>
                <p className="text-[10px] font-black text-slate-400 tracking-[0.4em]">Create a new employee profile</p>
              </div>
            </div>
            <div className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[9px] font-black tracking-widest text-[#496279]">
              PROFILE ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10 group relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className={labelClass}>First Name</label>
                <input type="text" placeholder="REQUIRED" className={inputClass} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Last Name</label>
                <input type="text" placeholder="REQUIRED" className={inputClass} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Work Email</label>
              <input type="email" placeholder="email@company.com" className={inputClass} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className={labelClass}>Phone Number</label>
                <input type="tel" placeholder="10 DIGIT MOBILE" className={inputClass} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required maxLength="10" />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Date of Birth</label>
                <input type="date" className={inputClass} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className={labelClass}>Designation</label>
                <input type="text" placeholder="ROLE / TITLE" className={inputClass} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Gender</label>
                <select className={inputClass} value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="pt-8">
              <button type="submit" disabled={loading} className="group relative w-full bg-[#496279] text-white py-8 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.5em] shadow-24 hover:bg-[#4c8051] transition-all overflow-hidden active:scale-95 disabled:opacity-50">
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <span className="relative z-10 flex items-center justify-center gap-4">
                  {loading ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin"></i>
                      Adding Employee...
                    </>
                  ) : (
                    <>
                      Add Employee
                      <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>

          <p className="mt-12 text-center text-[8px] font-black text-slate-300 uppercase tracking-[0.6em] relative z-10">
            All data is securely stored and protected within the network.
          </p>
        </div>
      </div>
      <Footer />

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-bottom { from { transform: translateY(3rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        .animate-in {
          animation-duration: 0.8s;
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-8 { animation-name: slide-in-bottom; }
      `}} />
    </div>
  );
};

export default AddEmployee;