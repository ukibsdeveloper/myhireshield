import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { documentAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { formatDateDDMMYYYY } from '../utils/helpers';

const VerifyDocuments = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [backgroundChecks, setBackgroundChecks] = useState({});

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      // Logic from existing VerifyDocuments.jsx used axios, mapping to documentAPI if needed
      // Assuming getPendingVerifications exists or adding it
      const res = await documentAPI.getPendingVerifications();
      if (res.data.success) {
        setSubmissions(res.data.data);
      }
    } catch (err) {
      toast.error("Could not load verification records.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, action) => {
    const status = action === 'approved' ? 'verified' : 'rejected';
    let rejectionReason = '';

    if (status === 'rejected') {
      rejectionReason = window.prompt('Reason for rejection:');
      if (!rejectionReason || rejectionReason.trim() === '') {
        return toast.error('Please provide a reason for rejection.');
      }
    }

    const toastId = toast.loading(`Processing...`);
    try {
      const res = await documentAPI.verify(id, status, rejectionReason?.trim());
      if (res.data.success) {
        toast.success(`Verified Successfully.`, { id: toastId });
        setSubmissions(prev => prev.filter(s => s.id !== id));
        setSelectedDocument(null);
      }
    } catch (err) {
      toast.error("Error during verification.", { id: toastId });
    }
  };

  const handleBackgroundCheck = async (documentId, checkType, result, notes) => {
    const toastId = toast.loading(`Running ${checkType} check...`);
    try {
      // Note: Backend endpoint for background-check: POST /api/documents/:id/background-check
      const res = await documentAPI.performBackgroundCheck(documentId, { checkType, result, notes });
      if (res.data.success) {
        toast.success(`Result Saved.`, { id: toastId });
        // Update local state for immediate feedback
        setBackgroundChecks(prev => ({
          ...prev,
          [checkType]: res.data.data
        }));
        // Optional: refresh submissions to get overall status
        fetchSubmissions();
      }
    } catch (err) {
      toast.error("Error saving check result.", { id: toastId });
    }
  };

  const openBackgroundCheckModal = (document) => {
    setSelectedDocument(document);
    setBackgroundChecks(document.backgroundCheck || {});
  };

  const performCheck = (checkType) => {
    const result = window.prompt(`Result for ${checkType}: (passed/failed)`);
    if (!result || !['passed', 'failed'].includes(result.toLowerCase())) {
      return toast.error('Invalid status. Use "passed" or "failed".');
    }

    const notes = window.prompt('Add notes for this check:');
    if (notes === null) return;

    handleBackgroundCheck(selectedDocument.id, checkType, result.toLowerCase(), notes);
  };

  const inputClass = "w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:border-[#4c8051] transition-all font-black text-[11px] tracking-widest text-[#496279] shadow-sm placeholder:text-slate-300";

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/20 font-sans antialiased text-[#496279] overflow-x-hidden">
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
              Verification Command Center
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-6">
              Review <span className="text-[#4c8051]">Requests.</span>
            </h1>
            <p className="text-slate-400 font-bold text-xs tracking-[0.4em] max-w-lg leading-relaxed">
              Review and verify employee documents and background checks for your network.
            </p>
          </div>
        </div>

        {/* QUEUE STATISTICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl">
            <p className="text-xs font-black text-slate-300 tracking-widest mb-2">Pending</p>
            <h4 className="text-5xl font-black tracking-tighter text-[#496279]">{submissions.filter(s => s.status !== 'verified').length}</h4>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl">
            <p className="text-xs font-black text-slate-300 tracking-widest mb-2">Verified</p>
            <h4 className="text-5xl font-black tracking-tighter text-[#4c8051]">{submissions.filter(s => s.status === 'verified').length}</h4>
          </div>
        </div>

        {/* COMPLIANCE REGISTRY */}
        <div className="bg-white border border-slate-100 rounded-[4rem] p-10 md:p-14 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4c8051] opacity-[0.01] rounded-full blur-[100px] -mr-32 -mt-32"></div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-8 opacity-40">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-t-4 border-[#4c8051] rounded-full animate-spin"></div>
              </div>
              <p className="text-xs font-black tracking-[0.5em] animate-pulse">Loading records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="pb-10 pl-6 text-xs font-black text-slate-300 tracking-[0.3em] uppercase">Name</th>
                    <th className="pb-10 px-6 text-xs font-black text-slate-300 tracking-[0.3em] uppercase">Document</th>
                    <th className="pb-10 px-6 text-xs font-black text-slate-300 tracking-[0.3em] uppercase">Date</th>
                    <th className="pb-10 pr-6 text-xs font-black text-slate-300 tracking-[0.3em] text-right uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="group hover:bg-[#fcfaf9]/50 transition-all duration-500">
                      <td className="py-10 pl-6">
                        <div className="flex items-center gap-6">
                          <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center font-black group-hover:bg-[#496279] group-hover:text-white transition-all duration-500">
                            {sub.employeeName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-lg tracking-tight group-hover:text-[#4c8051] transition-colors uppercase">{sub.employeeName}</p>
                            <p className="text-[11px] text-slate-300 font-black tracking-widest">{sub.employeeEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-10 px-6">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black tracking-[0.2em]">
                          <i className="fas fa-file-invoice text-[#4c8051]"></i>
                          {sub.documentType}
                        </div>
                      </td>
                      <td className="py-10 px-6">
                        <p className="text-xs font-black text-slate-400 tracking-[0.2em]">{formatDateDDMMYYYY(sub.uploadedAt)}</p>
                        <p className="text-[11px] font-bold text-slate-200 tracking-widest uppercase">ID Ref: {sub.id.slice(-8).toUpperCase()}</p>
                      </td>
                      <td className="py-10 pr-6 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <button
                            onClick={() => openBackgroundCheckModal(sub)}
                            className="px-8 py-4 bg-[#496279] text-white text-xs font-black tracking-widest rounded-2xl shadow-lg hover:bg-[#4c8051] transition-all active:scale-95 uppercase"
                          >
                            Review
                          </button>
                          <button
                            onClick={() => handleVerify(sub.id, 'rejected')}
                            className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all border border-rose-100"
                          >
                            <i className="fas fa-times text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {submissions.length === 0 && (
                <div className="text-center py-40 opacity-30 text-xs font-black tracking-[0.5em] uppercase">All verification requests cleared.</div>
              )}
            </div>
          )}
        </div>

        {/* DEEP AUDIT MODAL */}
        {selectedDocument && (
          <div className="fixed inset-0 bg-[#496279]/40 backdrop-blur-xl flex items-center justify-center z-[10000] p-6 md:p-12 animate-in fade-in duration-500">
            <div className="bg-white rounded-[4rem] p-10 md:p-16 max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_100px_rgba(0,0,0,0.2)] border border-white/20 relative animate-in slide-in-from-bottom-12 duration-700">

              <div className="flex justify-between items-start mb-16">
                <div>
                  <div className="inline-flex items-center gap-3 px-3 py-1 bg-slate-50 rounded-lg text-xs font-black tracking-[0.3em] mb-4">
                    <i className="fas fa-microchip text-[#4c8051]"></i>
                    Session ID: {Math.random().toString(36).substring(7).toUpperCase()}
                  </div>
                  <h2 className="text-4xl font-black tracking-tighter uppercase leading-none mb-2">Verify Identity & <span className="text-[#4c8051]">Background.</span></h2>
                  <p className="text-slate-400 font-bold text-xs tracking-[0.4em]">Target: {selectedDocument.employeeName} | Type: {selectedDocument.documentType}</p>
                </div>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="h-16 w-16 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 rounded-[2rem] flex items-center justify-center transition-all shadow-inner"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-16 mb-16">
                {/* Performance Matrix */}
                <div className="space-y-8">
                  <h3 className="text-[11px] font-black tracking-[0.5em] text-slate-300 flex items-center gap-4">
                    <span className="h-px w-12 bg-slate-100"></span> Background Checks
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {['policeVerification', 'courtRecords', 'addressVerification', 'employmentVerification', 'educationVerification', 'referenceCheck', 'criminalBackground'].map(key => (
                      <div key={key} className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-6 hover:border-[#4c8051]/30 transition-all group/cell">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black tracking-[0.3em] group-hover/cell:text-[#4c8051] transition-colors">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <div className="flex items-center gap-6">
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[11px] font-black tracking-widest ${backgroundChecks[key]?.status === 'passed' ? 'bg-[#4c8051]/10 text-[#4c8051]' : 'bg-slate-100 text-slate-400'}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${backgroundChecks[key]?.status === 'passed' ? 'bg-[#4c8051]' : 'bg-slate-300'}`}></span>
                              {backgroundChecks[key]?.status || 'PENDING'}
                            </div>
                            <button
                              onClick={() => performCheck(key)}
                              className="h-10 w-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-xs hover:bg-[#496279] hover:text-white transition-all shadow-sm"
                            >
                              <i className="fas fa-bolt"></i>
                            </button>
                          </div>
                        </div>
                        {backgroundChecks[key]?.result && (
                          <p className="mt-4 text-xs font-bold text-slate-400 normal-case leading-relaxed p-4 bg-white/50 rounded-xl shadow-sm italic">
                            "{backgroundChecks[key].result}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Asset Review */}
                <div className="space-y-8">
                  <h3 className="text-[11px] font-black tracking-[0.5em] text-slate-300 flex items-center gap-4">
                    <span className="h-px w-12 bg-slate-100"></span> Primary Document
                  </h3>
                  <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-10 h-full relative overflow-hidden flex flex-col items-center justify-center text-center group/asset">
                    <i className="fas fa-file-pdf text-8xl text-slate-100 group-hover/asset:text-[#4c8051]/20 transition-all duration-1000 mb-8"></i>
                    <p className="text-xs font-black tracking-[0.4em] mb-4">File Name: {selectedDocument.fileName}</p>
                    <a
                      href={`/uploads/documents/${selectedDocument.fileName}`}
                      target="_blank"
                      className="px-10 py-5 bg-white border border-slate-100 rounded-2xl text-xs font-black tracking-widest hover:bg-[#496279] hover:text-white transition-all shadow-sm"
                    >
                      VIEW DOCUMENT
                    </a>
                    <div className="mt-10 p-6 bg-white/50 border border-dashed border-slate-100 rounded-2xl w-full">
                      <p className="text-xs font-black text-slate-300 tracking-widest mb-2">Notes</p>
                      <p className="text-xs font-bold leading-relaxed opacity-60 normal-case italic">
                        {selectedDocument.verificationNotes || "No notes provided."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 pt-10 border-t border-slate-50">
                <button
                  onClick={() => handleVerify(selectedDocument.id, 'approved')}
                  className="flex-1 group bg-[#4c8051] text-white py-8 rounded-[2.5rem] font-black tracking-[0.5em] text-xs shadow-2xl hover:bg-[#3a8e41] transition-all relative overflow-hidden active:scale-95"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  <span className="relative z-10">Approve & Verify</span>
                </button>
                <button
                  onClick={() => handleVerify(selectedDocument.id, 'rejected')}
                  className="flex-1 group bg-rose-50 text-rose-500 border border-rose-100 py-8 rounded-[2.5rem] font-black tracking-[0.5em] text-xs hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                >
                  Reject Document
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-bottom { from { transform: translateY(4rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        .animate-in {
          animation-duration: 0.8s;
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-12 { animation-name: slide-in-bottom; }
      `}} />
    </div>
  );
};

export default VerifyDocuments;