import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';

const CompanyUploadDocuments = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('aadhaar');
  const [docNumber, setDocNumber] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/documents/employees', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setEmployees(res.data.data);
        }
      } catch (err) {
        console.error("Employees fetch error", err);
      }
    };
    fetchEmployees();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    // Safety Checks
    if (!selectedEmployee) return setStatus({ type: 'error', msg: 'Please select an employee!' });
    if (!file) return setStatus({ type: 'error', msg: 'Document file is required!' });
    if (!docNumber.trim()) return setStatus({ type: 'error', msg: 'Document number is required for verification.' });

    setLoading(true);
    setStatus({ type: '', msg: '' });

    const formData = new FormData();
    formData.append('document', file);
    formData.append('employeeId', selectedEmployee);
    formData.append('documentType', docType);
    formData.append('documentNumber', docNumber.trim());
    formData.append('verificationNotes', verificationNotes.trim());

    try {
      const res = await axios.post('/api/documents/company-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        setStatus({
          type: 'success',
          msg: 'Document uploaded successfully! Background verification process initiated.'
        });
        setFile(null);
        setDocNumber('');
        setVerificationNotes('');
        setSelectedEmployee('');
        // Reset file input
        document.getElementById('document').value = '';
      }
    } catch (err) {
      console.error("Upload Error:", err);
      setStatus({
        type: 'error',
        msg: err.response?.data?.message || 'Upload failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/30">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <Navbar scrolled={true} isAuthenticated={true} />

      <div className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Breadcrumb />
          <Link to="/dashboard/company" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#4c8051] transition-all">
            <i className="fas fa-arrow-left"></i>
            Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 animate-on-scroll">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4c8051]/10 rounded-lg text-[#4c8051] text-[10px] font-black uppercase tracking-widest mb-4 border border-[#4c8051]/20">
              <i className="fas fa-upload"></i> Document Upload Center
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#496279] uppercase tracking-tighter leading-none">
              Upload <span className="text-[#4c8051]">Documents.</span>
            </h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-4 leading-relaxed">
              Initiate comprehensive background verification for employee onboarding
            </p>
          </div>
        </div>

        {/* Upload Form */}
        <div className="bg-white border border-slate-100 rounded-[3.5rem] p-8 md:p-10 shadow-sm animate-on-scroll">

          {/* Status Messages */}
          {status.msg && (
            <div className={`mb-6 p-4 rounded-2xl text-sm font-bold ${status.type === 'success'
              ? 'bg-[#4c8051]/10 text-[#4c8051] border border-[#4c8051]/20'
              : 'bg-rose-50 text-rose-600 border border-rose-200'
              }`}>
              <i className={`fas ${status.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} mr-2`}></i>
              {status.msg}
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-8">

            {/* Employee Selection */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-2">
                Select Employee for Verification
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full p-4 bg-[#fcfaf9] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#4c8051] transition-all font-bold text-[#496279]"
                required
              >
                <option value="">Choose Employee...</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} - {emp.email} ({emp.verificationPercentage}% verified)
                  </option>
                ))}
              </select>
            </div>

            {/* Document Type */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-2">
                Document Type
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full p-4 bg-[#fcfaf9] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#4c8051] transition-all font-bold text-[#496279]"
              >
                <option value="aadhaar">Aadhaar Card</option>
                <option value="pan">PAN Card</option>
                <option value="passport">Passport</option>
                <option value="driving_license">Driving License</option>
                <option value="educational_certificate">Educational Certificate</option>
                <option value="experience_letter">Experience Letter</option>
                <option value="police_verification">Police Verification</option>
                <option value="address_proof">Address Proof</option>
                <option value="bank_statement">Bank Statement</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Document Number */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-2">
                Document Number
              </label>
              <input
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                className="w-full p-4 bg-[#fcfaf9] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#4c8051] transition-all font-bold text-[#496279] placeholder-slate-300"
                placeholder="Enter document number..."
                required
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-2">
                Document File
              </label>
              <input
                id="document"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full p-4 bg-[#fcfaf9] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#4c8051] transition-all font-bold text-[#496279] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#4c8051] file:text-white hover:file:bg-[#3a8e41]"
                required
              />
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest ml-2">
                Accepted formats: PDF, JPG, PNG (Max 5MB)
              </p>
            </div>

            {/* Verification Notes */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-2">
                Verification Notes (Optional)
              </label>
              <textarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                rows="3"
                className="w-full p-4 bg-[#fcfaf9] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#4c8051] transition-all font-bold text-[#496279] placeholder-slate-300 resize-none"
                placeholder="Add any notes for verification process..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#496279] text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-[#3a4e61] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <i className="fas fa-sync fa-spin mr-2"></i>
                  Initiating Verification...
                </>
              ) : (
                <>
                  <i className="fas fa-upload mr-2"></i>
                  Upload & Start Verification
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-12 p-6 border border-slate-100 rounded-[2.5rem] bg-white/50 opacity-80">
          <h3 className="text-sm font-black text-[#496279] uppercase tracking-widest mb-4">
            <i className="fas fa-info-circle mr-2"></i>
            Background Verification Process
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            <div>
              <h4 className="text-[#496279] mb-2">Automated Checks:</h4>
              <ul className="space-y-1">
                <li>• Document format validation</li>
                <li>• File integrity verification</li>
                <li>• OCR data extraction</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#496279] mb-2">Manual Verification:</h4>
              <ul className="space-y-1">
                <li>• Police record check</li>
                <li>• Court records verification</li>
                <li>• Address & employment validation</li>
                <li>• Reference & education checks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompanyUploadDocuments;