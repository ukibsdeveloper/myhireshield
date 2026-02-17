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

      <div className="container mx-auto px-4 sm:px-6 pt-32 pb-28 sm:pb-20 max-w-3xl">
        <div className="bg-white border border-slate-100 rounded-[3.5rem] shadow-2xl p-10 md:p-16 relative overflow-hidden animate-on-scroll">

          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 bg-[#4c8051]/10 rounded-2xl flex items-center justify-center text-[#4c8051]">
              <i className="fas fa-file-signature text-2xl"></i>
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#496279] tracking-tighter leading-none">Safe Hiring Consent.</h1>
              <p className="text-xs font-black text-slate-400 tracking-[0.3em] mt-2">Form ID: HS-CONSENT-2026</p>
            </div>
          </div>

          <div className="space-y-8 text-[#496279]/80 font-medium leading-relaxed text-sm tracking-tight">
            <p className="border-l-4 border-[#4c8051] pl-6 bg-[#4c8051]/5 py-4 rounded-r-xl">
              I hereby authorize **HireShield Verified Network** to store and manage my professional work history and feedback.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="font-black text-[#4c8051]">01.</span>
                <p>I consent to the collection of my work history, ratings, and documents by verified companies on the platform.</p>
              </div>
              <div className="flex gap-4">
                <span className="font-black text-[#4c8051]">02.</span>
                <p>I understand that my **Trust Score™** will be calculated based on verified company feedback and will be visible to potential employers.</p>
              </div>
              <div className="flex gap-4">
                <span className="font-black text-[#4c8051]">03.</span>
                <p>I acknowledge that this consent is voluntary and I can manage my profile visibility in the account settings.</p>
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
                  I agree to these terms and confirm that I have read the
                  <Link to="/privacy" className="text-[#4c8051] underline mx-1">Privacy Policy</Link>
                  and <Link to="/terms" className="text-[#4c8051] underline mx-1">Terms of Service</Link>.
                </label>
              </div>
            </div>

            <button
              disabled={!agreed}
              className={`w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl transition-all active:scale-95 ${agreed ? 'bg-[#496279] text-white hover:bg-[#3a4e61]' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }`}
            >
              Join the Verified Network
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-50 text-center opacity-40">
            <p className="text-xs font-bold text-slate-400 tracking-[0.4em]">
              Secure Authorization // HireShield Safe Hiring Platform
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div >
  );
};

export default ConsentForm;