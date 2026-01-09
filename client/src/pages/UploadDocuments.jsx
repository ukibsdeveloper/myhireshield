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
    
    // Safety Checks
    if (!file) return setStatus({ type: 'error', msg: 'Identity asset missing! Please select a file.' });
    if (!docNumber.trim()) return setStatus({ type: 'error', msg: 'Document number is required for verification.' });

    setLoading(true);
    setStatus({ type: '', msg: '' });

    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', docType);
    formData.append('documentNumber', docNumber.trim());

    try {
      // NOTE: Axios automatically uses baseURL from App.jsx
      // URL simplified for production compatibility
      const res = await axios.post('/api/documents/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data' 
        }
      });

      if (res.data.success) {
        setStatus({ type: 'success', msg: 'Node Secured: Asset uploaded and queued for verification!' });
        setFile(null); 
        setDocNumber('');
        // Optional: Scroll to top to see success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error("Upload Error:", err);
      setStatus({ 
        type: 'error', 
        msg: err.response?.data?.message || 'Synchronization with ledger failed.' 
      });
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/30 font-sans antialiased">
      {/* Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <Navbar scrolled={true} isAuthenticated={true} />

      <div className="container mx-auto px-6 pt-32 pb-20 flex justify-center">
        <div className="max-w-xl w-full bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-slate-50 relative overflow-hidden animate-in fade-in zoom-in duration-500">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#4c8051]/5 rounded-full blur-3xl"></div>

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#496279]/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#496279] shadow-inner">
               <i className="fas fa-file-shield text-2xl"></i>
            </div>
            <h2 className="text-3xl font-black text-[#496279] uppercase tracking-tighter leading-none">Asset Hub.</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Secure identity node synchronization</p>
          </div>

          {status.msg && (
            <div className={`p-5 rounded-2xl mb-8 text-[10px] font-black uppercase tracking-widest text-center border animate-in slide-in-from-top-4 duration-300 ${
              status.type === 'success' 
                ? 'bg-green-50 text-[#4c8051] border-[#4c8051]/20' 
                : 'bg-rose-50 text-rose-600 border-rose-600/20'
            }`}>
              <i className={`fas ${status.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} mr-2`}></i>
              {status.msg}
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Document Protocol</label>
              <select 
                className="w-full p-4 bg-[#fcfaf9] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#4c8051] transition-all font-bold text-[#496279] appearance-none cursor-pointer shadow-sm"
                value={docType} 
                onChange={(e)=>setDocType(e.target.value)}
              >
                <option value="aadhaar">Aadhaar (National ID)</option>
                <option value="pan">Permanent Account Number (PAN)</option>
                <option value="experience_letter">Tenure Verification Node</option>
                <option value="other">Other Identity Asset</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Node Identifier (Doc Number)</label>
              <input 
                type="text" 
                className="w-full p-4 bg-[#fcfaf9] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#4c8051] transition-all font-bold text-[#496279] shadow-sm" 
                placeholder="Ex: XXXX XXXX XXXX" 
                value={docNumber} 
                onChange={(e)=>setDocNumber(e.target.value)} 
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Secure Asset Upload</label>
              <label className="relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50 hover:bg-white hover:border-[#4c8051] transition-all cursor-pointer group overflow-hidden">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                  <i className={`fas ${file ? 'fa-check-circle text-[#4c8051]' : 'fa-cloud-arrow-up text-slate-300'} text-4xl mb-4 transition-transform duration-500 group-hover:scale-110`}></i>
                  <p className="text-[10px] font-black text-[#496279] uppercase tracking-widest leading-relaxed line-clamp-1">
                    {file ? file.name : "Initialize Payload (Click to Browse)"}
                  </p>
                  {!file && <p className="text-[8px] font-bold text-slate-300 uppercase mt-2">Max Size: 10MB (PDF, PNG, JPG)</p>}
                </div>
                <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e)=>setFile(e.target.files[0])} />
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-[#496279] text-white py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:bg-[#3a4e61] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <i className="fas fa-circle-notch fa-spin"></i> Encrypting & Syncing...
                </span>
              ) : 'Deploy Node to Ledger'}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-center gap-4 opacity-40">
             <i className="fas fa-shield-halved text-[#4c8051]"></i>
             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
               End-to-End AES-256 Bit Encryption Active
             </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default UploadDocuments;