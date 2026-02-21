import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DateInput from '../components/DateInput';
import toast from 'react-hot-toast';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    designation: '',
    department: 'General',
    employmentType: 'permanent',
    dateOfJoining: new Date().toISOString().split('T')[0],
    workLocation: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Phone validation
      if (!/^[6-9]\d{9}$/.test(formData.phone)) {
        toast.error('Phone number must start with 6-9 and be 10 digits');
        return;
      }

      // Age check
      const birthDate = new Date(formData.dateOfBirth);
      const age = (new Date() - birthDate) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 16) {
        toast.error('Employee must be at least 16 years old');
        return;
      }

      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender.toLowerCase(),
        phone: String(formData.phone).trim(),
        department: formData.department || 'General',
        designation: formData.designation || 'Employee',
        employmentType: formData.employmentType || 'permanent',
        dateOfJoining: formData.dateOfJoining,
        workLocation: formData.workLocation || 'Not Specified'
      };

      const res = await api.post('/employees/create', payload);

      if (res.data.success) {
        toast.success(res.data.message || 'Employee added successfully!');
        navigate('/dashboard/company');
      }

    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      if (backendErrors && backendErrors.length > 0) {
        toast.error(`${backendErrors[0].field}: ${backendErrors[0].message}`);
      } else {
        toast.error(err.response?.data?.message || 'Failed to add employee');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-5 bg-white border border-slate-100 rounded-2xl font-black text-xs tracking-widest outline-none focus:border-[#4c8051] focus:ring-4 ring-[#4c8051]/5 transition-all shadow-sm";
  const labelClass = "text-xs font-black text-slate-400 tracking-[0.3em] ml-4 mb-2 block";

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/20 font-sans antialiased text-[#496279] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <Navbar scrolled={true} isAuthenticated={true} />

      <div className="container mx-auto px-4 sm:px-6 pt-32 pb-28 sm:pb-20 max-w-4xl">
        <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-2xl border border-slate-50 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4c8051]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 bg-[#496279] rounded-[2rem] flex items-center justify-center text-white shadow-2xl group">
                <i className="fas fa-user-plus text-3xl group-hover:scale-110 transition-transform"></i>
              </div>
              <div>
                <h2 className="text-4xl font-black tracking-tighter leading-none mb-3 uppercase">Add <span className="text-[#4c8051]">Employee.</span></h2>
                <p className="text-xs font-black text-slate-400 tracking-[0.4em]">Create a new employee profile</p>
              </div>
            </div>
            <div className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black tracking-widest text-[#496279]">
              PROFILE ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10 group relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className={labelClass}>First Name *</label>
                <input type="text" placeholder="e.g. Rahul" className={inputClass} value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Last Name *</label>
                <input type="text" placeholder="e.g. Sharma" className={inputClass} value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Work Email *</label>
              <input type="email" placeholder="employee@company.com" className={inputClass} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className={labelClass}>Phone Number *</label>
                <input type="tel" placeholder="10 digit mobile" className={inputClass} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required maxLength="10" />
              </div>
              <div className="space-y-2">
                <DateInput
                  label="Date of Birth *"
                  value={formData.dateOfBirth}
                  onChange={(val) => setFormData(prev => ({ ...prev, dateOfBirth: val }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className={labelClass}>Designation *</label>
                <input type="text" placeholder="e.g. Software Engineer" className={inputClass} value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Department</label>
                <input type="text" placeholder="e.g. Engineering" className={inputClass} value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className={labelClass}>Gender *</label>
                <select className={inputClass} value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Employment Type</label>
                <select className={inputClass} value={formData.employmentType} onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}>
                  <option value="permanent">Permanent</option>
                  <option value="contract">Contract</option>
                  <option value="intern">Intern</option>
                  <option value="probation">Probation</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Work Location</label>
                <input type="text" placeholder="e.g. Mumbai" className={inputClass} value={formData.workLocation} onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })} />
              </div>
            </div>

            <div className="p-5 bg-[#4c8051]/5 rounded-2xl border border-[#4c8051]/10">
              <p className="text-xs font-bold text-[#4c8051] leading-relaxed tracking-wider">
                <i className="fas fa-info-circle mr-2"></i>
                The employee will receive an email with login instructions. They can log in using their <strong>First Name</strong> and <strong>Date of Birth</strong>.
              </p>
            </div>

            <div className="pt-8">
              <button type="submit" disabled={loading} className="group relative w-full bg-[#496279] text-white py-8 rounded-[2.5rem] font-black text-xs tracking-[0.5em] shadow-2xl hover:bg-[#4c8051] transition-all overflow-hidden active:scale-95 disabled:opacity-50 uppercase">
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

          <p className="mt-12 text-center text-[11px] font-black text-slate-300 uppercase tracking-[0.6em] relative z-10">
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