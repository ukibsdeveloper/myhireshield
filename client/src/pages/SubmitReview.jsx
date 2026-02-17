import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { reviewAPI, employeeAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import toast from 'react-hot-toast';
import DateInput from '../components/DateInput';

const SubmitReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Identification States
  const [searchName, setSearchName] = useState('');
  const [searchDob, setSearchDob] = useState('');
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  // Files State
  const [files, setFiles] = useState({
    govId: null,
    expCert: null
  });

  // Form State
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

  // Load Review (for Edit Mode)
  useEffect(() => {
    if (isEditMode) {
      loadReview();
    }
  }, [id]);

  const loadReview = async () => {
    setLoading(true);
    try {
      const res = await reviewAPI.getById(id);
      if (res.data.success) {
        const review = res.data.data;
        setEmployee(review.employeeId);
        setFormData({
          ratings: review.ratings,
          employmentDetails: {
            ...review.employmentDetails,
            startDate: review.employmentDetails.startDate?.split('T')[0],
            endDate: review.employmentDetails.endDate?.split('T')[0]
          },
          comment: review.comment,
          wouldRehire: review.wouldRehire
        });
        toast.success("Review history loaded.");
      }
    } catch (err) {
      toast.error("Could not load reviews.");
      navigate('/review/manage');
    } finally {
      setLoading(false);
    }
  };

  const findEmployee = async () => {
    if (!searchName.trim() || !searchDob) {
      return toast.error("Please enter Name and Date of Birth.");
    }

    setLoading(true);
    try {
      const res = await employeeAPI.search({ query: searchName.toUpperCase(), dob: searchDob });
      if (res.data.success && res.data.data.length > 0) {
        setEmployee(res.data.data[0]);
        toast.success("Employee found.");
      } else {
        toast.error("Employee not found. Please check details.");
      }
    } catch (err) {
      toast.error("Connection failed.");
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
    if (formData.comment.length < 50) {
      return toast.error("Feedback must be at least 50 characters.");
    }

    setLoading(true);
    const toastId = toast.loading(isEditMode ? "Saving changes..." : "Saving review...");

    try {
      const submissionData = new FormData();
      submissionData.append('employeeId', employee._id);

      // Send nested objects as JSON strings for Backend Parser
      submissionData.append('ratings', JSON.stringify(formData.ratings));
      submissionData.append('employmentDetails', JSON.stringify(formData.employmentDetails));

      submissionData.append('comment', formData.comment);
      submissionData.append('wouldRehire', formData.wouldRehire);

      if (files.govId) submissionData.append('govId', files.govId);
      if (files.expCert) submissionData.append('expCert', files.expCert);

      let res;
      if (isEditMode) {
        res = await reviewAPI.update(id, submissionData);
      } else {
        res = await reviewAPI.create(submissionData);
      }

      if (res.data.success) {
        toast.success(isEditMode ? 'Review Saved ✅' : 'Review Posted ✅', { id: toastId });
        setTimeout(() => navigate('/review/manage'), 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving review.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:border-[#4c8051] transition-all font-black text-[11px] tracking-widest text-[#496279] shadow-sm placeholder:text-slate-300";

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/20 font-sans antialiased text-[#496279] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <Navbar scrolled={true} isAuthenticated={true} />

      <div className="container mx-auto px-4 sm:px-6 pt-32 pb-32 sm:pb-24 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <Breadcrumb />
          <Link to="/review/manage" className="group flex items-center gap-4 text-xs font-black tracking-[0.3em] text-slate-400 hover:text-[#496279] transition-all">
            <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
            Back to History
          </Link>
        </div>

        {/* HEADER SECTION */}
        <div className="relative mb-20">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#4c8051] opacity-[0.03] rounded-full blur-[100px]"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-slate-100 rounded-2xl text-xs font-black tracking-[0.3em] mb-8 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#4c8051] animate-pulse"></span>
              {isEditMode ? 'Edit Review' : 'New Review'}
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-6">
              {isEditMode ? 'Modify' : 'Submit'} <span className="text-[#4c8051]">Review.</span>
            </h1>
            <p className="text-slate-400 font-bold text-xs tracking-[0.4em] max-w-lg leading-relaxed">
              Fill in the details below to rate the employee. Your feedback helps other companies hire better.
            </p>
          </div>
        </div>

        {!employee ? (
          /* IDENTIFICATION TERMINAL */
          <div className="relative max-w-4xl mx-auto mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#4c8051]/10 via-[#496279]/10 to-[#dd8d88]/10 rounded-[4rem] blur-2xl opacity-50"></div>
            <div className="relative bg-white border border-slate-100 p-10 md:p-16 rounded-[4rem] shadow-2xl flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-10 border border-slate-100 shadow-inner">
                <i className="fas fa-shield-halved text-3xl text-[#496279]/20"></i>
              </div>
              <h2 className="text-3xl font-black tracking-tighter mb-4">Find Employee</h2>
              <p className="text-slate-400 font-bold text-xs tracking-[0.4em] mb-12">Search to start rating</p>

              <div className="grid md:grid-cols-2 gap-6 w-full max-w-xl">
                <div className="space-y-2 text-left">
                  <label className="text-xs font-black text-slate-300 tracking-[0.3em] ml-4">Employee Name</label>
                  <input
                    type="text"
                    placeholder="Full Legal Name"
                    className={inputClass}
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && findEmployee()}
                  />
                </div>
                <div className="space-y-2 text-left">
                  <DateInput
                    label="Date of Birth"
                    value={searchDob}
                    onChange={setSearchDob}
                  />
                </div>
                <button
                  onClick={findEmployee}
                  disabled={loading}
                  className="md:col-span-2 group bg-[#496279] text-white py-6 rounded-[2.5rem] font-black text-[11px] tracking-[0.5em] shadow-2xl hover:bg-[#4c8051] transition-all disabled:opacity-30 relative overflow-hidden mt-4"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  <span className="relative z-10">
                    {loading ? <i className="fas fa-circle-notch fa-spin"></i> : 'Check Employee & Rate'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ASSESSMENT PHASE */
          <form onSubmit={handleSubmit} className="space-y-12 animate-in slide-in-from-bottom-12 duration-1000">

            {/* TARGET NODE PROFILE */}
            <div className="bg-[#496279] border-4 border-white/5 rounded-[4rem] p-10 md:p-14 text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#4c8051] opacity-10 rounded-full blur-[150px] -mr-48 -mt-48 transition-transform duration-1000 group-hover:scale-110"></div>
              <div className="relative">
                <div className="h-32 w-32 bg-white/10 backdrop-blur-3xl rounded-[3rem] border border-white/20 flex items-center justify-center text-5xl font-black text-white shadow-2xl uppercase">
                  {employee.firstName?.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-[#4c8051] rounded-2xl shadow-lg flex items-center justify-center text-xs animate-pulse">
                  <i className="fas fa-check"></i>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black tracking-[0.4em] mb-4 text-[#4c8051]">
                  Verified
                </div>
                <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-2">{employee.firstName} {employee.lastName}</h3>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-6 opacity-60">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-fingerprint text-xs"></i>
                    <span className="text-xs font-black tracking-[0.2em]">{employee._id.slice(-12).toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-envelope text-xs"></i>
                    <span className="text-xs font-black tracking-[0.2em]">{employee.email}</span>
                  </div>
                </div>
              </div>
              {!isEditMode && (
                <button type="button" onClick={() => setEmployee(null)} className="text-xs font-black tracking-[0.4em] text-white/20 hover:text-[#dd8d88] transition-colors py-4 border-b border-white/5">
                  Cancel
                </button>
              )}
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* PERFORMANCE GRID */}
              <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[4rem] p-10 md:p-14 shadow-sm hover:shadow-2xl transition-all duration-700">
                <h3 className="text-[11px] font-black text-slate-300 tracking-[0.5em] mb-12 flex items-center gap-4">
                  <span className="h-px w-12 bg-slate-100"></span> Performance Ratings
                </h3>
                <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
                  {Object.keys(formData.ratings).map(key => (
                    <div key={key} className="group">
                      <div className="flex justify-between items-center mb-6">
                        <label className="text-xs font-black tracking-[0.3em] group-hover:text-[#4c8051] transition-colors">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </label>
                        <span className="text-2xl font-black tracking-tighter text-[#4c8051]">{formData.ratings[key]}</span>
                      </div>
                      <div className="relative h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-[#4c8051] transition-all duration-500 rounded-full"
                          style={{ width: `${formData.ratings[key] * 10}%` }}
                        ></div>
                        <input
                          type="range" min="1" max="10" step="1"
                          value={formData.ratings[key]}
                          onChange={(e) => handleRatingChange(key, e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LOGISTICS & ASSETS */}
              <div className="space-y-12">
                <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-md hover:shadow-2xl transition-all duration-500">
                  <h3 className="text-[11px] font-black text-slate-300 tracking-[0.5em] mb-8">Work Details</h3>
                  <div className="space-y-6">
                    <input type="text" placeholder="Designation" required className={inputClass}
                      value={formData.employmentDetails.designation}
                      onChange={(e) => handleEmploymentChange('designation', e.target.value)} />

                    <input type="text" placeholder="Department (Optional)" className={inputClass}
                      value={formData.employmentDetails.department}
                      onChange={(e) => handleEmploymentChange('department', e.target.value)} />

                    <select className={inputClass} value={formData.employmentDetails.employmentType} onChange={(e) => handleEmploymentChange('employmentType', e.target.value)}>
                      <option value="full-time">Full-Time</option>
                      <option value="part-time">Part-Time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <DateInput
                          label="Joining Date (Date – Month – Year)"
                          value={formData.employmentDetails.startDate}
                          onChange={(val) => handleEmploymentChange('startDate', val)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <DateInput
                          label="Relieving Date (Date – Month – Year)"
                          value={formData.employmentDetails.endDate}
                          onChange={(val) => handleEmploymentChange('endDate', val)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-[4rem] p-10 shadow-sm">
                  <h3 className="text-[11px] font-black text-slate-300 tracking-[0.5em] mb-8">Documents</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-dashed border-slate-100 rounded-3xl hover:border-[#4c8051] transition-all cursor-pointer group text-center">
                      <i className={`fas ${files.govId ? 'fa-check text-[#4c8051]' : 'fa-fingerprint text-slate-200'} text-xl mb-3`}></i>
                      <span className="text-[11px] font-black tracking-widest leading-tight">
                        {files.govId ? 'UPLOADED' : 'ID CARD'}
                      </span>
                      <input type="file" className="hidden" onChange={(e) => setFiles({ ...files, govId: e.target.files[0] })} />
                    </label>
                    <label className="flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-dashed border-slate-100 rounded-3xl hover:border-[#4c8051] transition-all cursor-pointer group text-center">
                      <i className={`fas ${files.expCert ? 'fa-check text-[#4c8051]' : 'fa-file-invoice text-slate-200'} text-xl mb-3`}></i>
                      <span className="text-[11px] font-black tracking-widest leading-tight">
                        {files.expCert ? 'UPLOADED' : 'EXP LETTER'}
                      </span>
                      <input type="file" className="hidden" onChange={(e) => setFiles({ ...files, expCert: e.target.files[0] })} />
                    </label>
                  </div>
                  <p className="text-[11px] font-black text-slate-300 text-center mt-4">Note: New files will replace old ones.</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[4rem] p-10 md:p-14 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[11px] font-black text-slate-300 tracking-[0.5em]">Feedback</h3>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black tracking-[0.2em]">Eligible for Re-Hire</span>
                  <div
                    onClick={() => setFormData({ ...formData, wouldRehire: !formData.wouldRehire })}
                    className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-500 ${formData.wouldRehire ? 'bg-[#4c8051]' : 'bg-slate-100'}`}
                  >
                    <div className={`h-6 w-6 bg-white rounded-full shadow-md transition-transform duration-500 ${formData.wouldRehire ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                </div>
              </div>
              <textarea
                placeholder="Write your feedback here (minimum 50 characters)..."
                className="w-full p-10 bg-slate-50 border border-slate-100 rounded-[3rem] h-64 outline-none focus:border-[#4c8051] transition-all font-black text-xs tracking-widest text-[#496279] placeholder:text-slate-200 shadow-inner resize-none"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              />
              <div className="mt-8 flex justify-between items-center opacity-40">
                <p className="text-xs font-black tracking-[0.4em]">Characters: {formData.comment.length}/50 Min</p>
                <i className="fas fa-lock text-xs"></i>
              </div>
            </div>

            <div className="pt-8">
              <button
                type="submit"
                disabled={loading || formData.comment.length < 50}
                className="w-full group bg-[#496279] text-white py-10 rounded-[3rem] font-black text-[11px] tracking-[0.6em] shadow-2xl hover:bg-[#4c8051] active:scale-95 disabled:opacity-20 transition-all overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <span className="relative z-10">
                  {loading ? <i className="fas fa-circle-notch fa-spin"></i> : isEditMode ? 'Save Changes' : 'Save Review'}
                </span>
              </button>
            </div>
          </form>
        )}
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
        .slide-in-from-bottom-12 { animation-name: slide-in-bottom; }
        .slide-in-from-bottom-8 { animation-name: slide-in-bottom; }
      `}} />
    </div>
  );
};

export default SubmitReview;