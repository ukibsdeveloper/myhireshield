import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Context import kiya
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Checkout = () => {
  const navigate = useNavigate();
  const { setPaymentStatus } = useAuth(); // Global status updater function
  const [processing, setProcessing] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    
    // Simulate Payment Gateway Response
    setTimeout(() => {
      setProcessing(false);
      
      // 1. Update Global State: Report ko instantly unlock karne ke liye
      setPaymentStatus(true); 
      
      alert("Payment Successful! Your Integrity Ledger is now decrypted.");
      
      // 2. Redirect to Report
      navigate('/reputation-report'); 
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/30">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <Navbar scrolled={true} isAuthenticated={true} />

      <div className="container mx-auto px-6 pt-32 pb-20 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-[3.5rem] p-10 md:p-14 shadow-2xl text-center border border-slate-50 relative overflow-hidden animate-in zoom-in duration-500">
          
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#4c8051]/5 rounded-full blur-3xl"></div>

          <div className="w-24 h-24 bg-[#fcfaf9] rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-inner group">
            <i className="fas fa-credit-card text-3xl text-[#496279] group-hover:scale-110 transition-transform"></i>
          </div>

          <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4">Secure Terminal</h2>
          <h3 className="text-3xl font-black text-[#496279] uppercase tracking-tighter mb-2">Audit Unlock</h3>
          
          <div className="my-10">
            <p className="text-6xl font-black text-[#4c8051] tracking-tighter leading-none">₹499</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4">One-time node decryption fee</p>
          </div>

          {/* Benefits List */}
          <div className="space-y-4 mb-12 text-left bg-slate-50/50 p-6 rounded-3xl border border-slate-50">
            <div className="flex justify-between items-center text-[9px] font-black uppercase text-[#496279]/70 tracking-widest">
              <span>Full Historical Ledger</span> 
              <i className="fas fa-check-circle text-[#4c8051]"></i>
            </div>
            <div className="flex justify-between items-center text-[9px] font-black uppercase text-[#496279]/70 tracking-widest">
              <span>Behavioral Analytics</span> 
              <i className="fas fa-check-circle text-[#4c8051]"></i>
            </div>
            <div className="flex justify-between items-center text-[9px] font-black uppercase text-[#496279]/70 tracking-widest">
              <span>Industry Benchmarking</span> 
              <i className="fas fa-check-circle text-[#4c8051]"></i>
            </div>
          </div>

          <button 
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-[#496279] text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-[#3a4e61] transition-all active:scale-95 disabled:opacity-50"
          >
            {processing ? (
              <span className="flex items-center justify-center gap-3">
                <i className="fas fa-circle-notch fa-spin"></i> Authorizing...
              </span>
            ) : (
              "Initialize Gateway"
            )}
          </button>

          <p className="mt-8 text-[8px] font-bold text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2">
            <i className="fas fa-shield-check text-[#4c8051]"></i> PCI-DSS COMPLIANT TRANSACTION
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;