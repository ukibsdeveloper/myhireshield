import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UploadDocuments = () => {
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('aadhaar');
  const [docNumber, setDocNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setStatus({ type: 'error', msg: 'Identity asset missing! Please select a file.' });

    setLoading(true);
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', docType);
    formData.append('documentNumber', docNumber);

    try {
      const token = localStorage.getItem('token');
      // Logic synchronized with Backend Node Service
      const res = await axios.post('http://localhost:5000/api/documents/upload', formData, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'multipart/form-data' 
        }
      });
      if (res.data.success) {
        setStatus({ type: 'success', msg: 'Node Secured: Asset uploaded successfully!' });
        setFile(null); 
        setDocNumber('');
      }
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.message || 'Encryption/Sync failed' });
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/30">
      {/* Texture Overlay for Premium feel */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <Navbar scrolled={true} isAuthenticated={true} />

      <div className="container mx-auto px-6 pt-32 pb-20 flex justify-center">
        <div className="max-w-xl w-full bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-slate-50 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#4c8051]/5 rounded-full blur-3xl"></div>

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#496279]/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#496279]">
               <i className="fas fa-file-shield text-2xl"></i>
            </div>
            <h2 className="text-3xl font-black text-[#496279] uppercase tracking-tighter">Asset Hub</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Secure identity node synchronization</p>
          </div>

          {status.msg && (
            <div className={`p-4 rounded-2xl mb-8 text-[10px] font-black uppercase tracking-widest text-center animate-in fade-in zoom-in duration-300 ${
              status.type === 'success' ? 'bg-green-50 text-[#4c8051] border border-[#4c8051]/20' : 'bg-rose-50 text-rose-600 border border-rose-600/20'
            }`}>
              {status.msg}
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Document Protocol</label>
              <select 
                className="w-full p-4 bg-[#fcfaf9] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#4c8051] transition-all font-bold text-[#496279] appearance-none cursor-pointer"
                value={docType} 
                onChange={(e)=>setDocType(e.target.value)}
              >
                <option value="aadhaar">Aadhaar Verification</option>
                <option value="pan">Permanent Account Number (PAN)</option>
                <option value="experience_letter">Tenure/Experience Node</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Node Identifier (Doc Number)</label>
              <input 
                type="text" 
                className="w-full p-4 bg-[#fcfaf9] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#4c8051] transition-all font-bold text-[#496279]" 
                placeholder="XXXX-XXXX-XXXX" 
                value={docNumber} 
                onChange={(e)=>setDocNumber(e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Secure File Upload</label>
              <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50 hover:bg-white hover:border-[#4c8051] transition-all cursor-pointer group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <i className={`fas ${file ? 'fa-check-circle text-[#4c8051]' : 'fa-cloud-arrow-up text-slate-300'} text-3xl mb-4 group-hover:scale-110 transition-transform`}></i>
                  <p className="text-[10px] font-black text-[#496279] uppercase tracking-widest leading-none">
                    {file ? file.name : "Drag Assets Here"}
                  </p>
                </div>
                <input type="file" className="hidden" onChange={(e)=>setFile(e.target.files[0])} />
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-[#496279] text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.25em] shadow-xl hover:bg-[#3a4e61] transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-circle-notch fa-spin"></i> Initializing Sync...
                </span>
              ) : 'Deploy Asset to Ledger'}
            </button>
          </form>

          <p className="mt-10 text-[8px] font-bold text-slate-300 uppercase tracking-widest text-center">
            <i className="fas fa-lock mr-2"></i> End-to-End Encrypted Node Submission
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default UploadDocuments;