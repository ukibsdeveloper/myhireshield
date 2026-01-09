import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ConsentForm = () => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/30">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <Navbar scrolled={true} isAuthenticated={true} />

      <div className="container mx-auto px-6 pt-32 pb-20 max-w-3xl">
        <div className="bg-white border border-slate-100 rounded-[3.5rem] shadow-2xl p-10 md:p-16 relative overflow-hidden animate-on-scroll">
          
          {/* Header Node */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 bg-[#4c8051]/10 rounded-2xl flex items-center justify-center text-[#4c8051]">
              <i className="fas fa-file-signature text-2xl"></i>
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#496279] uppercase tracking-tighter leading-none">Data Authorization.</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Protocol: HS-CONSENT-2026</p>
            </div>
          </div>

          <div className="space-y-8 text-[#496279]/80 font-medium leading-relaxed text-sm uppercase tracking-tight">
            <p className="border-l-4 border-[#4c8051] pl-6 bg-[#4c8051]/5 py-4 rounded-r-xl">
              I hereby authorize **HireShield Intelligence Network** to act as a central repository for my professional performance data.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="font-black text-[#4c8051]">01.</span>
                <p>I consent to the collection and processing of my employment history, behavioral ratings, and document assets by registered enterprise nodes.</p>
              </div>
              <div className="flex gap-4">
                <span className="font-black text-[#4c8051]">02.</span>
                <p>I understand that my **Shield Score™** will be generated based on cross-enterprise audits and may be visible to authorized hiring entities.</p>
              </div>
              <div className="flex gap-4">
                <span className="font-black text-[#4c8051]">03.</span>
                <p>I acknowledge that this consent is voluntary and can be managed via my privacy settings node, subject to statutory retention protocols.</p>
              </div>
            </div>

            <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
              <div className="flex items-start gap-4">
                <input 
                  type="checkbox" 
                  id="consent-check"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-5 h-5 accent-[#4c8051] rounded cursor-pointer"
                />
                <label htmlFor="consent-check" className="text-[11px] font-black text-[#496279] leading-relaxed cursor-pointer">
                  I DIGITALLY SIGN THIS AUTHORIZATION AND CONFIRM THAT I HAVE READ THE 
                  <Link to="/privacy" className="text-[#4c8051] underline mx-1">PRIVACY PROTOCOL</Link> 
                  AND <Link to="/terms" className="text-[#4c8051] underline mx-1">TERMS OF SERVICE</Link>.
                </label>
              </div>
            </div>

            <button 
              disabled={!agreed}
              className={`w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl transition-all active:scale-95 ${
                agreed ? 'bg-[#496279] text-white hover:bg-[#3a4e61]' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
            >
              Confirm Digital Identity Access
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-50 text-center opacity-40">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em]">
              Authorized by IP Node: {window.location.hostname} // AES-256 Bit Encrypted
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ConsentForm;