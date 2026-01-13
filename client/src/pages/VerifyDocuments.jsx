import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const VerifyDocuments = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [backgroundChecks, setBackgroundChecks] = useState({});

  // Note: Backend integration for Company Admin to see all uploads
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('token');
        // Updated endpoint for pending document verifications
        const res = await axios.get('/api/documents/pending-verification', {
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
  }, []);

  const handleVerify = async (id, action) => {
    try {
      const token = localStorage.getItem('token');
      const status = action === 'approved' ? 'verified' : 'rejected';

      let rejectionReason = '';
      if (status === 'rejected') {
        rejectionReason = prompt('Please provide a reason for rejection:');
        if (!rejectionReason || rejectionReason.trim() === '') {
          alert('Rejection reason is required');
          return;
        }
      }

      const res = await axios.put(`/api/documents/${id}/verify`,
        { status, rejectionReason: rejectionReason.trim() },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        alert(`Document ${status.toUpperCase()}: Verification protocol executed successfully!`);
        // Refresh the list
        window.location.reload();
      }
    } catch (err) {
      console.error("Verification error:", err);
      alert("Protocol override failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  const handleBackgroundCheck = async (documentId, checkType, result, notes) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/documents/${documentId}/background-check`,
        { checkType, result, notes },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        alert(`${checkType} check completed successfully!`);
        // Refresh the list
        window.location.reload();
      }
    } catch (err) {
      console.error("Background check error:", err);
      alert("Background check failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  const openBackgroundCheckModal = (document) => {
    setSelectedDocument(document);
    setBackgroundChecks(document.backgroundCheck || {});
  };

  const performCheck = (checkType) => {
    const result = prompt(`Result for ${checkType}: (passed/failed)`);
    if (!result || !['passed', 'failed'].includes(result.toLowerCase())) {
      alert('Please enter "passed" or "failed"');
      return;
    }

    const notes = prompt('Add verification notes:');
    if (notes === null) return; // User cancelled

    handleBackgroundCheck(selectedDocument.id, checkType, result.toLowerCase(), notes);
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
                         <p className="text-[9px] text-slate-300 font-bold uppercase mt-2">{new Date(sub.uploadedAt).toLocaleDateString('en-GB')}</p>
                      </td>
                      <td className="py-6 px-4">
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-[#496279] bg-slate-50 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-slate-100">
                               {sub.documentType}
                            </span>
                            <a href={`/api/documents/${sub.id}/download`} target="_blank" className="text-[#496279] hover:text-[#4c8051] transition-colors">
                               <i className="fas fa-external-link-alt text-xs"></i>
                            </a>
                         </div>
                      </td>
                      <td className="py-6 px-4 text-right">
                         {sub.status === 'verified' ? (
                           <div className="flex items-center justify-end gap-2 text-[#4c8051]">
                              <span className="text-[10px] font-black uppercase tracking-widest">Protocol Secured</span>
                              <i className="fas fa-check-circle"></i>
                           </div>
                         ) : (
                           <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openBackgroundCheckModal(sub)}
                                className="px-3 py-1.5 bg-[#4c8051] text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-[#3a8e41] transition-all"
                              >
                                <i className="fas fa-search mr-1"></i>
                                Verify
                              </button>
                              <button onClick={() => handleVerify(sub.id, 'rejected')} className="w-8 h-8 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                                 <i className="fas fa-times text-xs"></i>
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

        {/* Background Verification Modal */}
        {selectedDocument && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
            <div className="bg-white rounded-[3rem] p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-[#496279] uppercase tracking-tight">
                    Background Verification
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {selectedDocument.employeeName} - {selectedDocument.documentType}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              {/* Background Check Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {[
                  { key: 'policeVerification', label: 'Police Verification', icon: 'fa-shield-alt' },
                  { key: 'courtRecords', label: 'Court Records', icon: 'fa-gavel' },
                  { key: 'addressVerification', label: 'Address Verification', icon: 'fa-map-marker-alt' },
                  { key: 'employmentVerification', label: 'Employment Check', icon: 'fa-briefcase' },
                  { key: 'educationVerification', label: 'Education Verification', icon: 'fa-graduation-cap' },
                  { key: 'referenceCheck', label: 'Reference Check', icon: 'fa-users' },
                  { key: 'criminalBackground', label: 'Criminal Background', icon: 'fa-user-secret' }
                ].map((check) => (
                  <div key={check.key} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#4c8051]/10 flex items-center justify-center text-[#4c8051]">
                          <i className={`fas ${check.icon}`}></i>
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#496279] uppercase tracking-tight">{check.label}</p>
                          <p className={`text-[10px] font-bold uppercase tracking-widest ${
                            backgroundChecks[check.key]?.status === 'passed' ? 'text-[#4c8051]' :
                            backgroundChecks[check.key]?.status === 'failed' ? 'text-rose-500' :
                            'text-slate-400'
                          }`}>
                            {backgroundChecks[check.key]?.status || 'pending'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => performCheck(check.key)}
                        className="px-4 py-2 bg-[#496279] text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-[#3a4e61] transition-all"
                      >
                        Check
                      </button>
                    </div>
                    {backgroundChecks[check.key]?.result && (
                      <p className="text-[10px] text-slate-600 font-bold leading-relaxed">
                        {backgroundChecks[check.key].result}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Final Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => handleVerify(selectedDocument.id, 'approved')}
                  className="flex-1 bg-[#4c8051] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#3a8e41] transition-all"
                >
                  <i className="fas fa-check mr-2"></i>
                  Approve All & Complete
                </button>
                <button
                  onClick={() => handleVerify(selectedDocument.id, 'rejected')}
                  className="flex-1 bg-rose-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-rose-600 transition-all"
                >
                  <i className="fas fa-times mr-2"></i>
                  Reject Application
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default VerifyDocuments;