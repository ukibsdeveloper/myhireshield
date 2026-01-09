import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#496279]/20">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <Navbar scrolled={true} />

      <div className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
        <div className="bg-white border border-slate-100 rounded-[3.5rem] shadow-2xl p-10 md:p-16 relative overflow-hidden animate-on-scroll">
          
          {/* Header Node */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 bg-[#496279]/10 rounded-2xl flex items-center justify-center text-[#496279]">
              <i className="fas fa-balance-scale text-2xl"></i>
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#496279] uppercase tracking-tighter leading-none">Protocol Terms.</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Agreement Node: HS-TOS-2026</p>
            </div>
          </div>

          <div className="space-y-12 text-[#496279]/80 font-medium leading-relaxed text-sm uppercase tracking-tight">
            
            {/* Clause 1 */}
            <section className="space-y-4">
              <h3 className="text-sm font-black text-[#496279] flex items-center gap-3">
                <span className="w-6 h-px bg-[#4c8051]"></span> 01. Enterprise Node Responsibility
              </h3>
              <p className="pl-9 text-slate-500 font-bold leading-relaxed">
                Registered enterprises are legally bound to provide 100% factual data. Any intentional falsification of behavioral nodes or tenure records will result in terminal lockout and legal audit.
              </p>
            </section>

            {/* Clause 2 */}
            <section className="space-y-4">
              <h3 className="text-sm font-black text-[#496279] flex items-center gap-3">
                <span className="w-6 h-px bg-[#4c8051]"></span> 02. Professional Identity Claim
              </h3>
              <p className="pl-9 text-slate-500 font-bold leading-relaxed">
                By claiming a professional profile, users acknowledge that HireShield acts as a neutral bureau. Scores are automated reflections of cross-enterprise audits and cannot be manually modified by the network.
              </p>
            </section>

            {/* Clause 3 */}
            <section className="space-y-4">
              <h3 className="text-sm font-black text-[#496279] flex items-center gap-3">
                <span className="w-6 h-px bg-[#4c8051]"></span> 03. Financial Decryption Node
              </h3>
              <p className="pl-9 text-slate-500 font-bold leading-relaxed">
                Access to detailed historical ledgers (Shield Reports) requires a one-time decryption fee. This fee covers the data synchronization and node validation costs across our global ledger infrastructure.
              </p>
            </section>

            {/* Clause 4 */}
            <section className="space-y-4">
              <h3 className="text-sm font-black text-[#496279] flex items-center gap-3">
                <span className="w-6 h-px bg-[#4c8051]"></span> 04. Data Retention Protocol
              </h3>
              <p className="pl-9 text-slate-500 font-bold leading-relaxed">
                Integrity logs are archived for a period of 10 years to maintain industry standardization. User nodes may be de-activated but historical records remain part of the decentralized ledger audit trail.
              </p>
            </section>

            {/* Formal Seal */}
            <div className="mt-16 pt-12 border-t border-slate-50 flex flex-col items-center">
              <div className="w-20 h-20 border-4 border-slate-100 rounded-full flex items-center justify-center mb-4">
                 <i className="fas fa-shield-halved text-slate-200 text-3xl"></i>
              </div>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">HireShield Certified Protocol</p>
            </div>
          </div>

        </div>

        {/* Global Support Link */}
        <div className="mt-12 text-center opacity-40">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Legal Dispute? Initialize <span className="text-[#496279] underline cursor-pointer">Resolution Protocol</span>
            </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;