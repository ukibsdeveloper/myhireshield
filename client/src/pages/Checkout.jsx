import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { setPaymentStatus } = useAuth();
  const [processing, setProcessing] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    const toastId = toast.loading('Connecting to Secure Payment...');

    setTimeout(() => {
      setProcessing(false);
      setPaymentStatus(true);
      toast.success('Payment Successful. Report Unlocked.', { id: toastId });
      navigate('/reputation-report');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/30 font-sans antialiased text-[#496279] uppercase overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <Navbar scrolled={true} isAuthenticated={true} />

      <div className="container mx-auto px-6 pt-32 pb-20 flex flex-col items-center">
        <div className="max-w-xl w-full mb-12 flex justify-between items-center opacity-60">
          <Breadcrumb />
          <Link to="/dashboard/employee" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-[#4c8051] transition-all">
            <i className="fas fa-arrow-left"></i>
            Back to Dashboard
          </Link>
        </div>

        <div className="max-w-xl w-full bg-white rounded-[4rem] p-12 md:p-16 shadow-2xl border border-slate-50 relative overflow-hidden animate-in zoom-in duration-700">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#4c8051]/5 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-[#fcfaf9] rounded-[2.5rem] flex items-center justify-center mb-10 shadow-inner group border border-slate-100">
              <i className="fas fa-lock-open text-4xl text-[#496279] group-hover:scale-110 transition-transform"></i>
            </div>

            <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] mb-4">Secure Payment</h2>
            <h3 className="text-4xl font-black text-[#496279] tracking-tighter mb-4">Unlock Your <span className="text-[#4c8051]">Report.</span></h3>

            <div className="my-12 relative">
              <div className="absolute -inset-4 bg-[#4c8051]/5 blur-2xl rounded-full"></div>
              <div className="relative">
                <p className="text-8xl font-black text-[#496279] tracking-tighter leading-none">₹99</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">One-Time Access Fee</p>
              </div>
            </div>

            <div className="w-full space-y-5 mb-12 text-left bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-50">
              {[
                { l: 'Full Work History', d: 'View all verified company reviews' },
                { l: 'Performance Insights', d: 'Analyze work quality & feedback' },
                { l: 'Verified PDF Report', d: 'Download your Trust Report' }
              ].map((b, i) => (
                <div key={i} className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase text-[#496279] tracking-widest mb-1">{b.l}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{b.d}</p>
                  </div>
                  <i className="fas fa-check-circle text-[#4c8051] text-xs mt-1"></i>
                </div>
              ))}
            </div>

            <button
              onClick={handlePayment}
              disabled={processing}
              className="group relative w-full bg-[#496279] text-white py-8 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.4em] shadow-24 hover:bg-[#4c8051] transition-all active:scale-95 disabled:opacity-50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <span className="relative z-10 flex items-center justify-center gap-4">
                {processing ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    Pay Now
                    <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
                  </>
                )}
              </span>
            </button>

            <p className="mt-10 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-3">
              <i className="fas fa-lock text-[#4c8051]"></i>
              Secure & Encrypted Transaction
            </p>
          </div>
        </div>
      </div>
      <Footer />

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes zoom-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation: zoom-in 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
      `}} />
    </div>
  );
};

export default Checkout;