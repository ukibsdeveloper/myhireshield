import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-[#fcfaf9] pt-16 md:pt-24 pb-12 border-t border-[#496279]/10 overflow-hidden selection:bg-[#4c8051]/20">
      {/* Background Sharp Accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#dd8d88]/5 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#4c8051]/5 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16 md:mb-24">
          
          {/* Brand Section - Identity Bureau Branding */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start p-8 lg:p-0 bg-white lg:bg-transparent rounded-[32px] border border-slate-100 lg:border-none shadow-sm lg:shadow-none">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="h-10 w-10 bg-[#496279] rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-all duration-500">
                <i className="fas fa-shield-halved text-white text-lg"></i>
              </div>
              <span className="text-2xl font-black text-[#496279] tracking-tighter uppercase">
                Hire<span className="text-[#4c8051]">Shield</span>
              </span>
            </Link>
            <p className="text-slate-500 text-[11px] leading-relaxed mb-8 font-black text-center lg:text-left opacity-80 uppercase tracking-[0.1em]">
              Standardizing Global Integrity Through The First Decentralized Professional Bureau Ledger.
            </p>
            <div className="flex gap-3">
              {['linkedin-in', 'x-twitter', 'instagram'].map(s => (
                <a 
                  key={s} 
                  href="#" 
                  className="w-11 h-11 rounded-xl bg-[#496279]/5 border border-transparent flex items-center justify-center text-[#496279] hover:bg-[#496279] hover:text-white transition-all duration-300"
                >
                  <i className={`fab fa-${s} text-sm`}></i>
                </a>
              ))}
            </div>
          </div>
          
          {/* Links Section - Functional Sitemap */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-12">
            {[
              { 
                title: 'Infrastructure', 
                links: [
                    { name: 'Identity Vault', to: '/register/employee' }, 
                    { name: 'Shield Score™', to: '/dashboard/employee' }, 
                    { name: 'Audit Hub', to: '/dashboard/company' }, 
                    { name: 'API Ledger', to: '#' }
                ] 
              },
              { 
                title: 'Operations', 
                links: [
                    { name: 'Audit Desk', to: '/review/submit' }, 
                    { name: 'Search Node', to: '/employee/search' }, 
                    { name: 'History Ledger', to: '/review/manage' }, 
                    { name: 'Verification', to: '/verify/documents' }
                ] 
              },
              { 
                title: 'Legal Nodes', 
                links: [
                    { name: 'Consent Protocol', to: '/consent' }, 
                    { name: 'Privacy Policy', to: '/privacy' }, 
                    { name: 'Terms Node', to: '/terms' }, 
                    { name: 'Resolution Hub', to: '#' }
                ] 
              }
            ].map((col, idx) => (
              <div key={col.title} className={`${idx === 2 ? 'col-span-2 sm:col-span-1' : 'col-span-1'} flex flex-col`}>
                <h4 className="font-black text-[#496279] text-[10px] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                  <span className="w-4 h-[2px] bg-[#4c8051]"></span> {col.title}
                </h4>
                <ul className="space-y-4">
                  {col.links.map(link => (
                    <li key={link.name}>
                      <Link 
                        to={link.to} 
                        className="text-[12px] font-black text-slate-400 hover:text-[#4c8051] transition-all duration-200 uppercase tracking-widest block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar - Protocol Status */}
        <div className="pt-10 border-t border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-8">
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 order-2 lg:order-1 w-full lg:w-auto">
            <div className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-xl border border-slate-200 shadow-sm w-full md:w-auto justify-center">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4c8051] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4c8051]"></span>
              </span>
              <span className="text-[9px] font-black text-[#496279] uppercase tracking-[0.2em]">Ecosystem Status: Active</span>
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] text-center">
              © 2026 HireShield Enterprise Integration Node
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 order-1 lg:order-2">
            {[
                { name: 'GDPR Compliance', to: '/privacy' },
                { name: 'System Terms', to: '/terms' },
                { name: 'Contact Hub', to: '#' }
            ].map((item) => (
              <Link 
                key={item.name}
                to={item.to} 
                className="text-[10px] font-black text-[#496279]/50 hover:text-[#dd8d88] uppercase tracking-[0.2em] transition-all"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;