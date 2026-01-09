import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reviewAPI, employeeAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SubmitReview = () => {
  const navigate = useNavigate();
  
  // States for Node Identification (Updated to Name + DOB logic)
  const [searchName, setSearchName] = useState('');
  const [searchDob, setSearchDob] = useState('');
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  // Document Upload States
  const [files, setFiles] = useState({
    govId: null,
    expCert: null
  });

  const [formData, setFormData] = useState({
    ratings: {
      workQuality: 8, punctuality: 8, behavior: 8, teamwork: 8,
      communication: 8, technicalSkills: 8, problemSolving: 8, reliability: 8
    },
    employmentDetails: {
      designation: '', department: '',
      startDate: '', endDate: '', employmentType: 'full-time'
    },
    comment: '',
    wouldRehire: true
  });

  // Identification Logic using Name and DOB
  const findEmployee = async () => {
    if(!searchName.trim() || !searchDob) return alert("Subject Name and DOB are required.");
    try {
      setLoading(true);
      const res = await employeeAPI.search({ name: searchName, dob: searchDob });
      if (res.data.success && res.data.data.length > 0) {
        setEmployee(res.data.data[0]);
      } else {
        alert("Node not found. Please verify the identification details.");
      }
    } catch (err) {
      alert("Encryption mismatch or network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      ratings: { ...prev.ratings, [key]: Number(value) }
    }));
  };

  const handleEmploymentChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      employmentDetails: { ...prev.employmentDetails, [key]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.comment.length < 50) return alert("Professional testimony must be at least 50 characters.");

    setLoading(true);
    try {
      // Use FormData to handle both text and files
      const submissionData = new FormData();
      submissionData.append('employeeId', employee._id);
      submissionData.append('formData', JSON.stringify(formData));
      if (files.govId) submissionData.append('govId', files.govId);
      if (files.expCert) submissionData.append('expCert', files.expCert);

      const res = await reviewAPI.create(submissionData);
      if (res.data.success) {
        alert('Integrity Report Published Successfully ✅');
        navigate('/dashboard/company');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#4c8051] transition-all font-bold text-[#496279] shadow-sm";

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#dd8d88]/30">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <Navbar scrolled={true} isAuthenticated={true} />

      <div className="container mx-auto px-6 pt-32 pb-20 max-w-5xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 animate-on-scroll">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4c8051]/10 rounded-lg text-[#4c8051] text-[10px] font-black uppercase tracking-widest mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4c8051] animate-pulse"></span>
              Audit Protocol 2026
            </div>
            <h1 className="text-4xl font-black text-[#496279] uppercase tracking-tighter">
              Talent <span className="text-[#4c8051]">Assessment.</span>
            </h1>
          </div>
          {employee && (
            <button type="button" onClick={() => setEmployee(null)} className="text-[10px] font-black uppercase tracking-widest text-[#dd8d88] border-b-2 border-[#dd8d88]/20 hover:border-[#dd8d88] transition-all">
              Change Subject Node
            </button>
          )}
        </div>

        {!employee ? (
          /* Identification Phase using Name + DOB */
          <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-slate-100 text-center animate-on-scroll">
            <div className="w-20 h-20 bg-[#496279]/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
              <i className="fas fa-fingerprint text-3xl text-[#496279]/30"></i>
            </div>
            <h2 className="text-2xl font-black text-[#496279] uppercase tracking-tight mb-4">Identify Professional Node</h2>
            <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mb-10">Verification required via Name & DOB before assessment phase</p>
            <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
              <input 
                type="text" placeholder="Full Name (As per Aadhar)" 
                className="p-5 bg-[#fcfaf9] border border-slate-200 rounded-[1.5rem] outline-none font-bold text-[#496279] focus:ring-2 ring-[#496279]/10"
                onChange={(e) => setSearchName(e.target.value)} 
              />
              <input 
                type="date" 
                className="p-5 bg-[#fcfaf9] border border-slate-200 rounded-[1.5rem] outline-none font-bold text-[#496279] focus:ring-2 ring-[#496279]/10"
                onChange={(e) => setSearchDob(e.target.value)} 
              />
              <button 
                onClick={findEmployee} 
                className="md:col-span-2 bg-[#496279] text-white px-10 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-[#3a4e61] transition-all active:scale-95"
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Initialize Node'}
              </button>
            </div>
          </div>
        ) : (
          /* Assessment Phase */
          <form onSubmit={handleSubmit} className="space-y-8 animate-on-scroll">
            
            {/* Subject Profile Header */}
            <div className="bg-[#496279] rounded-[3rem] p-8 md:p-10 text-white flex items-center gap-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#4c8051] opacity-20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
               <div className="h-24 w-24 bg-white rounded-[2rem] flex items-center justify-center text-4xl font-black text-[#496279] shadow-inner shrink-0">
                  {employee.firstName?.charAt(0)}
               </div>
               <div>
                  <p className="text-[10px] font-black text-[#4c8051] uppercase tracking-[0.3em] mb-2">Subject Verified</p>
                  <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">{employee.firstName} {employee.lastName}</h3>
                  <p className="text-white/40 font-bold text-[10px] uppercase tracking-widest mt-2">DOB: {new Date(employee.dob).toLocaleDateString()}</p>
               </div>
            </div>

            {/* Performance Sliders Grid */}
            <div className="bg-white rounded-[3.5rem] p-10 md:p-12 shadow-sm border border-slate-100">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-12 flex items-center gap-4">
                 <span className="w-8 h-[2px] bg-[#4c8051]"></span> Performance Matrix
               </h3>
               <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                  {Object.keys(formData.ratings).map(key => (
                    <div key={key} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-[#496279] uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</label>
                        <span className={`text-xl font-black ${formData.ratings[key] > 7 ? 'text-[#4c8051]' : formData.ratings[key] > 4 ? 'text-[#496279]' : 'text-[#dd8d88]'}`}>
                          {formData.ratings[key]}/10
                        </span>
                      </div>
                      <input 
                        type="range" min="1" max="10" step="1"
                        value={formData.ratings[key]} 
                        onChange={(e) => handleRatingChange(key, e.target.value)}
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#4c8051]"
                      />
                    </div>
                  ))}
               </div>
            </div>

            {/* NEW SECTION: Document Upload Section */}
            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                <span className="w-8 h-px bg-slate-200"></span> Verification Assets
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-white border border-dashed border-slate-200 rounded-[2.5rem]">
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-100 rounded-3xl hover:border-[#4c8051] transition-all cursor-pointer group">
                  <i className={`fas ${files.govId ? 'fa-check-circle text-[#4c8051]' : 'fa-id-card text-slate-200'} text-2xl group-hover:text-[#4c8051] mb-2`}></i>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {files.govId ? files.govId.name : 'Upload Government ID'}
                  </p>
                  <input 
                    type="file" className="hidden" 
                    onChange={(e) => setFiles({...files, govId: e.target.files[0]})} 
                  />
                </label>
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-100 rounded-3xl hover:border-[#4c8051] transition-all cursor-pointer group">
                  <i className={`fas ${files.expCert ? 'fa-check-circle text-[#4c8051]' : 'fa-file-alt text-slate-200'} text-2xl group-hover:text-[#4c8051] mb-2`}></i>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {files.expCert ? files.expCert.name : 'Experience Certificate'}
                  </p>
                  <input 
                    type="file" className="hidden" 
                    onChange={(e) => setFiles({...files, expCert: e.target.files[0]})} 
                  />
                </label>
              </div>
            </div>

            {/* Logistics & Testimony Grid */}
            <div className="grid lg:grid-cols-5 gap-8">
               <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 space-y-8">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Employment Node</h3>
                  <div className="space-y-6">
                    <input type="text" placeholder="Subject Designation" required className={inputClass}
                      onChange={(e) => handleEmploymentChange('designation', e.target.value)} />
                    
                    <select className={inputClass} onChange={(e) => handleEmploymentChange('employmentType', e.target.value)}>
                      <option value="full-time">Full-Time Deployment</option>
                      <option value="part-time">Part-Time Deployment</option>
                      <option value="contract">Contract/Node Basis</option>
                    </select>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase ml-2">Commenced</p>
                        <input type="date" required className="w-full p-4 bg-[#fcfaf9] border border-slate-200 rounded-2xl text-[11px] font-bold uppercase text-[#496279]"
                          onChange={(e) => handleEmploymentChange('startDate', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase ml-2">Terminated</p>
                        <input type="date" required className="w-full p-4 bg-[#fcfaf9] border border-slate-200 rounded-2xl text-[11px] font-bold uppercase text-[#496279]"
                          onChange={(e) => handleEmploymentChange('endDate', e.target.value)} />
                      </div>
                    </div>
                  </div>
               </div>

               <div className="lg:col-span-3 bg-white rounded-[3.5rem] p-10 shadow-sm border border-slate-100 flex flex-col">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">Professional Testimony</h3>
                  <textarea 
                    placeholder="Provide a detailed encrypted assessment of skills and conduct..." 
                    className="flex-1 w-full p-8 bg-[#fcfaf9] border border-slate-100 rounded-[2.5rem] h-56 outline-none focus:ring-2 ring-[#4c8051]/10 transition font-bold text-[#496279] placeholder:text-slate-300 shadow-inner resize-none"
                    onChange={(e) => setFormData({...formData, comment: e.target.value})} 
                  />
                  <div className="mt-8 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={formData.wouldRehire} onChange={(e) => setFormData({...formData, wouldRehire: e.target.checked})} className="w-5 h-5 accent-[#4c8051] rounded-lg" />
                      <span className="text-[10px] font-black text-[#496279] uppercase tracking-widest">Recommended for Re-hire</span>
                    </div>
                    <p className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${formData.comment.length < 50 ? 'bg-red-50 text-[#dd8d88]' : 'bg-green-50 text-[#4c8051]'}`}>
                      Depth: {formData.comment.length}/50
                    </p>
                  </div>
               </div>
            </div>

            <div className="pt-8">
              <button type="submit" disabled={loading} className="w-full bg-[#496279] text-white py-8 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] hover:bg-[#3a4e61] transition-all shadow-2xl active:scale-95 disabled:opacity-50">
                {loading ? 'Initializing Blockchain Push...' : 'Deploy Integrity Report'}
              </button>
            </div>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SubmitReview;