import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#496279]/20">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <Navbar scrolled={true} />

      <div className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
        <div className="bg-white border border-slate-100 rounded-[3.5rem] shadow-2xl p-10 md:p-16 relative overflow-hidden animate-on-scroll">
          
            <div>
              <h1 className="text-3xl font-black text-[#496279] uppercase tracking-tighter leading-none">Disclaimer.</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Legal Notice ID: HS-DISCLAIMER-2026</p>
            </div>
          </div>

          <div className="space-y-12 text-[#496279]/80 font-medium leading-relaxed text-sm uppercase tracking-tight">
            
            {/* Clause 1 */}
            <section className="space-y-4">
              <h3 className="text-sm font-black text-[#496279] flex items-center gap-3">
                <span className="w-6 h-px bg-[#4c8051]"></span> 01. Information Accuracy
              </h3>
              <p className="pl-9 text-slate-500 font-bold leading-relaxed">
                While we strive for accuracy, HireShield does not guarantee the complete accuracy of verification data. Users should conduct their own checks.
              </p>
            </section>

            {/* Clause 2 */}
            <section className="space-y-4">
              <h3 className="text-sm font-black text-[#496279] flex items-center gap-3">
                <span className="w-6 h-px bg-[#4c8051]"></span> 02. No Liability
              </h3>
              <p className="pl-9 text-slate-500 font-bold leading-relaxed">
                HireShield is not liable for any decisions made based on the information provided. Users are responsible for their hiring decisions.
              </p>
            </section>

            {/* Clause 3 */}
            <section className="space-y-4">
              <h3 className="text-sm font-black text-[#496279] flex items-center gap-3">
                <span className="w-6 h-px bg-[#4c8051]"></span> 03. Data Privacy
              </h3>
              <p className="pl-9 text-slate-500 font-bold leading-relaxed">
                We follow data protection rules, but users acknowledge that sharing information online involves some risks.
              </p>
            </section>

            {/* Clause 4 */}
            <section className="space-y-4">
              <h3 className="text-sm font-black text-[#496279] flex items-center gap-3">
                <span className="w-6 h-px bg-[#4c8051]"></span> 04. Service Availability
              </h3>
              <p className="pl-9 text-slate-500 font-bold leading-relaxed">
                Services are provided "as is". We do not guarantee uninterrupted access or error-free service at all times.
              </p>
            </section>

          </div>

          <div className="mt-16 pt-12 border-t border-slate-50 flex flex-col items-center">
            <div className="w-20 h-20 border-4 border-slate-100 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-shield-halved text-slate-200 text-3xl"></i>
            </div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">HireShield Legal Policy</p>
          </div>
        </div>

        <div className="mt-12 text-center opacity-40">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            For legal concerns, contact our Support Team at +91 9910048130
          </p>
        </div>
      </div>

      <Footer />
    </div >
  );
};

export default Disclaimer;