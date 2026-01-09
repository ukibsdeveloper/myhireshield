import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/30">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <Navbar scrolled={true} />

      <div className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
        <div className="bg-white border border-slate-100 rounded-[3.5rem] shadow-2xl p-10 md:p-16 relative overflow-hidden animate-on-scroll">
          
          {/* Top Security Badge */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 bg-[#dd8d88]/10 rounded-2xl flex items-center justify-center text-[#dd8d88]">
              <i className="fas fa-user-lock text-2xl"></i>
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#496279] uppercase tracking-tighter leading-none">Privacy Protocol.</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Data Protection ID: HS-DP-2026</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none space-y-10 text-[#496279]/80 font-medium leading-relaxed text-sm uppercase tracking-tight">
            
            {/* Section 1 */}
            <section className="space-y-4">
              <h3 className="text-sm font-black text-[#496279] border-b-2 border-slate-50 pb-2">01. Data Node Collection</h3>
              <p>
                HireShield collects professional identity nodes including Aadhar-verified names, official contact links, and tenure-based behavioral data. All data points are encrypted at the source node.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h3 className="text-sm font-black text-[#496279] border-b-2 border-slate-50 pb-2">02. Shield Score Algorithm</h3>
              <p>
                Your **Shield Score™** is processed using decentralized audit logs. No manual overriding of company testimonies is permitted, ensuring 100% data integrity for the hiring enterprise nodes.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h3 className="text-sm font-black text-[#496279] border-b-2 border-slate-50 pb-2">03. Authorized Decryption</h3>
              <p>
                Detailed audit history and HR testimonies are only decrypted for authorized enterprise partners or the subject employee upon successful authentication and (if applicable) credit payment.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h3 className="text-sm font-black text-[#496279] border-b-2 border-slate-50 pb-2">04. Compliance Standards</h3>
              <p>
                Our infrastructure adheres to ISO 27001 standards and the Professional Integrity Protection Act. Data retention is subject to statutory audit requirements.
              </p>
            </section>

            {/* Footer Note */}
            <div className="mt-16 p-8 bg-[#fcfaf9] rounded-[2.5rem] border border-slate-100 text-center">
              <i className="fas fa-shield-halved text-[#4c8051] text-3xl mb-4 opacity-40"></i>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                By maintaining an active node on HireShield, you authorize the network to synchronize your integrity logs across verified enterprise terminals.
              </p>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;