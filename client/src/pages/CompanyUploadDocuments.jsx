import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { documentAPI } from '../utils/api';
import toast from 'react-hot-toast';

const CompanyUploadDocuments = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('aadhaar');
  const [docNumber, setDocNumber] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await documentAPI.getEmployeesForUpload();
      if (res.data.success) {
        setEmployees(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch employee registry.");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedEmployee) return toast.error('Select an authorized Subject Node.');
    if (!file) return toast.error('Evidence file is missing.');
    if (!docNumber.trim()) return toast.error('Document identification number required.');

    setLoading(true);
    setUploadProgress(0);
    const toastId = toast.loading("Establishing Uplink...");

    const formData = new FormData();
    formData.append('document', file);
    formData.append('employeeId', selectedEmployee);
    formData.append('documentType', docType);
    formData.append('documentNumber', docNumber.trim());
    formData.append('verificationNotes', verificationNotes.trim());

    try {
      const res = await documentAPI.companyUpload(formData, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      });

      if (res.data.success) {
        toast.success('Document Uploaded Successfully ✅', { id: toastId });
        setFile(null);
        setDocNumber('');
        setVerificationNotes('');
        setSelectedEmployee('');
        setUploadProgress(0);
        // Reset file input
        const fileInput = document.getElementById('document');
        if (fileInput) fileInput.value = '';
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:border-[#4c8051] transition-all font-black text-[11px] tracking-widest text-[#496279] shadow-sm uppercase placeholder:text-slate-300";

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/20 font-sans antialiased text-[#496279] uppercase overflow-x-hidden">
      {/* Background Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <Navbar scrolled={true} isAuthenticated={true} />

      <div className="container mx-auto px-4 sm:px-6 pt-32 pb-32 sm:pb-24 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <Breadcrumb />
          <Link to="/dashboard/company" className="group flex items-center gap-4 text-xs font-black tracking-[0.3em] text-slate-400 hover:text-[#496279] transition-all">
            <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
            Back to Dashboard
          </Link>
        </div>

        {/* HEADER SECTION */}
        <div className="relative mb-20">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#4c8051] opacity-[0.03] rounded-full blur-[100px]"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-slate-100 rounded-2xl text-xs font-black tracking-[0.3em] mb-8 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#4c8051] animate-pulse"></span>
              Secure Upload Active
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-6">
              Upload <span className="text-[#4c8051]">Documents.</span>
            </h1>
            <p className="text-slate-400 font-bold text-xs tracking-[0.4em] max-w-lg leading-relaxed">
              Securely add employee identification and background documents for verification.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* UPLOAD TERMINAL */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-slate-100 rounded-[4rem] p-10 md:p-14 shadow-sm hover:shadow-2xl transition-all duration-700 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#4c8051] opacity-[0.02] rounded-full blur-[80px] group-hover:opacity-[0.05 transition-all"></div>

              <form onSubmit={handleUpload} className="space-y-10 relative z-10">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black tracking-[0.3em] text-slate-300 ml-4">Select Employee</label>
                    <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className={inputClass}
                      required
                    >
                      <option value="">Choose Employee...</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id} className="py-4">
                          {emp.name} ({emp.verificationPercentage}%)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black tracking-[0.3em] text-slate-300 ml-4">Document Type</label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      className={inputClass}
                    >
                      <option value="aadhaar">Aadhaar Card</option>
                      <option value="pan">PAN Card</option>
                      <option value="passport">Passport</option>
                      <option value="driving_license">Driving License</option>
                      <option value="experience_letter">Experience Letter</option>
                      <option value="educational_certificate">Educational Certificate</option>
                      <option value="other">Other Document</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black tracking-[0.3em] text-slate-300 ml-4">Document Number</label>
                  <input
                    type="text"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className={inputClass}
                    placeholder="Enter document number..."
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black tracking-[0.3em] text-slate-300 ml-4">File Upload</label>
                  <div className="relative group/upload">
                    <div className={`w-full h-40 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all duration-500 bg-slate-50/50 ${file ? 'border-[#4c8051] bg-[#4c8051]/5' : 'border-slate-100'}`}>
                      <div className={`h-16 w-16 rounded-3xl flex items-center justify-center transition-all duration-500 ${file ? 'bg-[#4c8051] text-white shadow-xl' : 'bg-white text-slate-200 shadow-inner'}`}>
                        <i className={`fas ${file ? 'fa-check' : 'fa-cloud-arrow-up'} text-xl`}></i>
                      </div>
                      <p className="text-xs font-black tracking-[0.3em] text-slate-400">
                        {file ? file.name : 'Drag & Drop File or Click To Upload'}
                      </p>
                      <input
                        id="document"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center px-4 pt-2">
                    <p className="text-[11px] font-black text-slate-300 tracking-[0.2em]">MAX FILE SIZE: 5MB (PDF/JPG/PNG)</p>
                    {uploadProgress > 0 && <p className="text-[11px] font-black text-[#4c8051] tracking-[0.2em]">UPLOADING: {uploadProgress}%</p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black tracking-[0.3em] text-slate-300 ml-4">Context (Optional Notes)</label>
                  <textarea
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] h-32 outline-none focus:border-[#4c8051] transition-all font-black text-xs tracking-widest text-[#496279] placeholder:text-slate-200 shadow-inner resize-none"
                    placeholder="Add notes for this document..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group bg-[#496279] text-white py-8 rounded-[2.5rem] font-black text-[11px] tracking-[0.6em] shadow-2xl hover:bg-[#4c8051] transition-all disabled:opacity-20 relative overflow-hidden active:scale-95"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  {loading && (
                    <div
                      className="absolute inset-y-0 left-0 bg-white/10 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  )}
                  <span className="relative z-10">
                    {loading ? `UPLOADING... ${uploadProgress}%` : 'Upload Document'}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* SECURITY HUB */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-[#496279] rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden group animate-in slide-in-from-right-12 duration-1000">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#4c8051] opacity-20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
              <h3 className="text-xl font-black tracking-tighter mb-8 relative z-10 flex items-center gap-4">
                <i className="fas fa-lock text-[#4c8051]"></i>
                Secure Verification
              </h3>
              <div className="space-y-8 relative z-10">
                <div className="flex gap-6">
                  <div className="h-10 w-10 shrink-0 bg-white/10 rounded-xl flex items-center justify-center">
                    <i className="fas fa-microchip text-[12px]"></i>
                  </div>
                  <div>
                    <p className="text-xs font-black tracking-widest mb-1">Automated Analysis</p>
                    <p className="text-xs font-bold text-white/40 leading-relaxed normal-case">Fast and accurate verification of document data.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="h-10 w-10 shrink-0 bg-white/10 rounded-xl flex items-center justify-center">
                    <i className="fas fa-shield-check text-[12px]"></i>
                  </div>
                  <div>
                    <p className="text-xs font-black tracking-widest mb-1">Safe Storage</p>
                    <p className="text-xs font-bold text-white/40 leading-relaxed normal-case">All documents are stored in our secure and private vault.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="h-10 w-10 shrink-0 bg-white/10 rounded-xl flex items-center justify-center">
                    <i className="fas fa-sync text-[12px]"></i>
                  </div>
                  <div>
                    <p className="text-xs font-black tracking-widest mb-1">Profile Update</p>
                    <p className="text-xs font-bold text-white/40 leading-relaxed normal-case">Real-time update to the employee's trust score after verification.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[4rem] p-12 shadow-sm text-center">
              <i className="fas fa-shield-halved text-4xl text-slate-100 mb-6"></i>
              <h4 className="text-[11px] font-black tracking-[0.4em] mb-4">Safe Usage Policy</h4>
              <p className="text-xs font-bold text-slate-300 normal-case leading-relaxed">
                Uploading false documents is against our platform terms. All uploads are logged and verified for security.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-right { from { transform: translateX(3rem); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        
        .animate-in {
          animation-duration: 0.8s;
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        
        .fade-in { animation-name: fade-in; }
        .slide-in-from-right-12 { animation-name: slide-in-right; }
      `}} />
    </div>
  );
};

export default CompanyUploadDocuments;