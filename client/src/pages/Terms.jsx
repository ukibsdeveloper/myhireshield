import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageMeta from '../components/PageMeta';

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#496279]/20">
      <PageMeta title="Terms & Conditions" description="HireShield usage terms and agreement." canonical="/terms" />
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <Navbar scrolled={true} />

      <div className="container mx-auto px-4 sm:px-6 pt-32 pb-28 sm:pb-20 max-w-4xl">
        <div className="bg-white border border-slate-100 rounded-[3.5rem] shadow-2xl p-10 md:p-16 relative overflow-hidden animate-on-scroll">

          <div>
            <h1 className="text-3xl font-black text-[#496279] tracking-tighter leading-none">Usage Terms.</h1>
            <p className="text-xs font-black text-slate-400 tracking-[0.3em] mt-2">Agreement ID: HS-TOS-2026</p>
          </div>

          <div className="space-y-12 text-[#496279]/80 font-medium leading-relaxed text-sm tracking-tight">

            {/* Clause 1 */}
            <section className="space-y-4">
              <h3 className="text-sm font-black text-[#496279] flex items-center gap-3">
                <span className="w-6 h-px bg-[#4c8051]"></span> 01. Company Responsibility
              </h3>
              <p className="pl-9 text-slate-500 font-bold leading-relaxed">
                Registered companies are legally bound to provide 100% factual data. Any intentional false records or reviews will result in account suspension and further action.
              </p>
            </section>

            {/* Clause 2 */}
            <section className="space-y-4">
              <h3 className="text-sm font-black text-[#496279] flex items-center gap-3">
                <span className="w-6 h-px bg-[#4c8051]"></span> 02. Employee Profile Claim
              </h3>
              <p className="pl-9 text-slate-500 font-bold leading-relaxed">
                By claiming a profile, users acknowledge that HireShield acts as a neutral platform. Scores are automated reflections of verified feedback and cannot be manually changed by our team.
              </p>
            </section>

            {/* Clause 3 */}
            <section className="space-y-4">
              <h3 className="text-sm font-black text-[#496279] flex items-center gap-3">
                <span className="w-6 h-px bg-[#4c8051]"></span> 03. Report Access Fee
              </h3>
              <p className="pl-9 text-slate-500 font-bold leading-relaxed">
                Access to detailed trust reports requires a one-time fee. This fee covers data verification and secure record management costs across our platform.
              </p>
            </section>

            {/* Clause 4 */}
            <section className="space-y-4">
              <h3 className="text-sm font-black text-[#496279] flex items-center gap-3">
                <span className="w-6 h-px bg-[#4c8051]"></span> 04. Data Retention Policy
              </h3>
              <p className="pl-9 text-slate-500 font-bold leading-relaxed">
                Trust records are archived for a period of 10 years to maintain industry standards. Accounts may be deactivated, but historical records remain part of the verification trail.
              </p>
            </section>

            {/* Formal Seal */}
            <div className="mt-16 pt-12 border-t border-slate-50 flex flex-col items-center">
              <div className="w-20 h-20 border-4 border-slate-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-shield-halved text-slate-200 text-3xl"></i>
              </div>
              <p className="text-xs font-black text-slate-300 tracking-[0.5em]">HireShield Certified Protocol</p>
            </div>
          </div>

        </div>

        {/* Global Support Link */}
        <div className="mt-12 text-center opacity-40">
          <p className="text-xs font-bold text-slate-500 tracking-widest">
            Have a question? <span className="text-[#496279] underline cursor-pointer">Contact Support</span>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;