import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const VerifyDocuments = () => {
  // --- FIXED: Added Missing States ---
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [backgroundChecks, setBackgroundChecks] = useState({});

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('token');
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
        { status, rejectionReason: rejectionReason?.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert(`Document ${status.toUpperCase()} successfully!`);
        window.location.reload();
      }
    } catch (err) {
      console.error("Verification error:", err);
      alert("Verification failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  const handleBackgroundCheck = async (documentId, checkType, result, notes) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/documents/${documentId}/background-check`,
        { checkType, result, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert(`${checkType} check completed successfully!`);
        window.location.reload();
      }
    } catch (err) {
      console.error("Background check error:", err);
      alert("Background check failed: " + (err.response?.data?.message || "Error"));
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
    if (notes === null) return;

    handleBackgroundCheck(selectedDocument.id, checkType, result.toLowerCase(), notes);
  };

  // --- FIXED: Loading Screen ---
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfaf9]">
      <i className="fas fa-sync fa-spin text-4xl text-[#496279]"></i>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/30">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <Navbar scrolled={true} isAuthenticated={true} />

      <div className="container mx-auto px-6 pt-32 pb-20 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4c8051]/10 rounded-lg text-[#4c8051] text-[10px] font-black uppercase tracking-widest mb-4 border border-[#4c8051]/20">
              <i className="fas fa-file-shield"></i> Compliance Node Terminal
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#496279] uppercase tracking-tighter leading-none">
              Asset <span className="text-[#4c8051]">Verification.</span>
            </h1>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-slate-100">
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Queue</p>
            <h4 className="text-xl font-black text-[#496279]">{submissions.filter(s => s.status !== 'verified').length} Nodes</h4>
          </div>
          <div className="bg-[#4c8051]/5 p-6 rounded-3xl border border-[#4c8051]/10">
            <p className="text-[8px] font-black text-[#4c8051] uppercase tracking-widest mb-1">Secured</p>
            <h4 className="text-xl font-black text-[#4c8051]">{submissions.filter(s => s.status === 'verified').length} Cleared</h4>
          </div>
        </div>

        {/* Table Registry */}
        <div className="bg-white border border-slate-100 rounded-[3.5rem] p-8 md:p-10 shadow-sm overflow-hidden">
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
                      <p className="font-black text-[#496279] text-sm uppercase tracking-tight">{sub.employeeName}</p>
                      <p className="text-[9px] text-slate-300 font-bold uppercase">{new Date(sub.uploadedAt).toLocaleDateString()}</p>
                    </td>
                    <td className="py-6 px-4">
                      <span className="text-[10px] font-black text-[#496279] bg-slate-50 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-slate-100">{sub.documentType}</span>
                    </td>
                    <td className="py-6 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openBackgroundCheckModal(sub)} className="px-3 py-1.5 bg-[#4c8051] text-white text-[9px] font-black uppercase tracking-widest rounded-lg">Verify</button>
                        <button onClick={() => handleVerify(sub.id, 'rejected')} className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all"><i className="fas fa-times"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {submissions.length === 0 && <div className="text-center py-20 opacity-30 text-xs font-black uppercase">Queue Clear</div>}
        </div>

        {/* Modal Logic */}
        {selectedDocument && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-[3rem] p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-8 border-b pb-6">
                <div>
                  <h2 className="text-2xl font-black text-[#496279] uppercase">Verification Audit</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{selectedDocument.employeeName}</p>
                </div>
                <button onClick={() => setSelectedDocument(null)} className="w-10 h-10 rounded-xl bg-slate-100"><i className="fas fa-times"></i></button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {['policeVerification', 'courtRecords', 'addressVerification', 'employmentVerification', 'educationVerification', 'referenceCheck', 'criminalBackground'].map(key => (
                  <div key={key} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-black text-[#496279] uppercase">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <div className="flex items-center gap-3">
                        <span className={`text-[8px] font-bold uppercase ${backgroundChecks[key]?.status === 'passed' ? 'text-[#4c8051]' : 'text-rose-500'}`}>{backgroundChecks[key]?.status || 'pending'}</span>
                        <button onClick={() => performCheck(key)} className="px-3 py-1 bg-[#496279] text-white text-[9px] rounded-lg">Check</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 border-t pt-8">
                <button onClick={() => handleVerify(selectedDocument.id, 'approved')} className="flex-1 bg-[#4c8051] text-white py-4 rounded-2xl font-black uppercase text-xs">Approve All</button>
                <button onClick={() => handleVerify(selectedDocument.id, 'rejected')} className="flex-1 bg-rose-500 text-white py-4 rounded-2xl font-black uppercase text-xs">Reject Application</button>
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