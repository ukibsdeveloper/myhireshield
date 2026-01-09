import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const VerifyDocuments = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Note: Backend integration for Company Admin to see all uploads
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('token');
        // Actual endpoint for compliance officer/admin
        const res = await axios.get('/api/compliance/all-uploads', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setSubmissions(res.data.data);
        }
      } catch (err) {
        console.error("Compliance fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
    // Temporary mock for design testing if API is not live
    // setSubmissions([
    //   { id: 1, employeeName: 'Karan Malhotra', docType: 'Aadhar Card', status: 'Pending', date: '2026-01-08', fileUrl: '#' },
    //   { id: 2, employeeName: 'Sanya Gupta', docType: 'Experience Letter', status: 'Verified', date: '2026-01-05', fileUrl: '#' }
    // ]);
  }, []);

  const handleVerify = async (id, action) => {
    try {
      // action can be 'approved' or 'rejected'
      alert(`Asset Node ${id} protocol: ${action.toUpperCase()}`);
      // Actual API call: axios.patch(`/api/compliance/verify/${id}`, { status: action })
    } catch (err) {
      alert("Protocol override failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/30">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <Navbar scrolled={true} isAuthenticated={true} />

      <div className="container mx-auto px-6 pt-32 pb-20 max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 animate-on-scroll">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4c8051]/10 rounded-lg text-[#4c8051] text-[10px] font-black uppercase tracking-widest mb-4 border border-[#4c8051]/20">
              <i className="fas fa-file-shield"></i> Compliance Node Terminal
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#496279] uppercase tracking-tighter leading-none">
              Asset <span className="text-[#4c8051]">Verification.</span>
            </h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-4 leading-relaxed">Authorized validation of professional credentials and identity nodes</p>
          </div>
        </div>

        {/* Global Stats bar for compliance */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-on-scroll">
           <div className="bg-white p-6 rounded-3xl border border-slate-100">
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Queue</p>
              <h4 className="text-xl font-black text-[#496279]">{submissions.filter(s => s.status === 'Pending').length} Nodes</h4>
           </div>
           <div className="bg-[#4c8051]/5 p-6 rounded-3xl border border-[#4c8051]/10">
              <p className="text-[8px] font-black text-[#4c8051] uppercase tracking-widest mb-1">Secured</p>
              <h4 className="text-xl font-black text-[#4c8051]">{submissions.filter(s => s.status === 'Verified').length} Cleared</h4>
           </div>
        </div>

        {/* Verification Queue Table */}
        <div className="bg-white border border-slate-100 rounded-[3.5rem] p-8 md:p-10 shadow-sm overflow-hidden animate-on-scroll">
            <h3 className="text-sm font-black text-[#496279] uppercase tracking-[0.3em] mb-10 px-2">Verification Registry</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="pb-6 px-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">Target Subject</th>
                    <th className="pb-6 px-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">Asset Node</th>
                    <th className="pb-6 px-4 text-[9px] font-black text-slate-300 uppercase tracking-widest text-right">Clearance Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="group hover:bg-[#fcfaf9]/50 transition-all">
                      <td className="py-6 px-4">
                         <p className="font-black text-[#496279] text-sm uppercase tracking-tight leading-none">{sub.employeeName}</p>
                         <p className="text-[9px] text-slate-300 font-bold uppercase mt-2">{new Date(sub.date).toLocaleDateString('en-GB')}</p>
                      </td>
                      <td className="py-6 px-4">
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-[#496279] bg-slate-50 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-slate-100">
                               {sub.docType}
                            </span>
                            <a href={sub.fileUrl} target="_blank" className="text-[#496279] hover:text-[#4c8051] transition-colors">
                               <i className="fas fa-external-link-alt text-xs"></i>
                            </a>
                         </div>
                      </td>
                      <td className="py-6 px-4 text-right">
                         {sub.status === 'Verified' ? (
                           <div className="flex items-center justify-end gap-2 text-[#4c8051]">
                              <span className="text-[10px] font-black uppercase tracking-widest">Protocol Secured</span>
                              <i className="fas fa-check-circle"></i>
                           </div>
                         ) : (
                           <div className="flex items-center justify-end gap-3">
                              <button onClick={() => handleVerify(sub.id, 'rejected')} className="w-8 h-8 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                                 <i className="fas fa-times text-xs"></i>
                              </button>
                              <button onClick={() => handleVerify(sub.id, 'approved')} className="bg-[#496279] text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#3a4e61] shadow-lg shadow-[#496279]/20 transition-all">
                                Execute Review
                              </button>
                           </div>
                         )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {submissions.length === 0 && !loading && (
              <div className="text-center py-20 opacity-30">
                 <i className="fas fa-inbox text-4xl mb-4"></i>
                 <p className="text-xs font-black uppercase tracking-widest">Queue Clear // No Pending Assets</p>
              </div>
            )}
        </div>

        {/* Audit Tip */}
        <div className="mt-16 text-center opacity-30">
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.5em]">
               Global Asset Verification Terminal // Secure Node ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyDocuments;