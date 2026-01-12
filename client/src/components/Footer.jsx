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
          
          {/* Brand & Contact Section */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              {/* Original Logo Implementation from /public/logo.jpg */}
              <div className="h-12 w-12 overflow-hidden rounded-xl shadow-lg group-hover:rotate-3 transition-transform duration-500 bg-white border border-slate-100">
                <img 
                  src="/logo.jpg" 
                  alt="MyHireShield Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-2xl font-black text-[#496279] tracking-tighter uppercase leading-none">
                  Hire<span className="text-[#4c8051]">Shield</span>
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#dd8d88] mt-1">Verification Bureau</span>
              </div>
            </Link>
            
            {/* Content Writer's Text */}
            <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium opacity-90 max-w-sm">
              MyHireShield is a well-structured & high-tech background verification platform that offers accurate employee data that ensures trustworthiness and helps to make transparent hiring decisions.
            </p>

            {/* Contact Details */}
            <div className="space-y-3 mb-8">
                <div className="flex items-center justify-center lg:justify-start gap-3 text-slate-500 hover:text-[#496279] transition-colors">
                    <i className="fas fa-envelope text-[#4c8051] text-xs"></i>
                    <a href="mailto:contact@myhireshield.com" className="text-sm font-bold tracking-tight">contact@myhireshield.com</a>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-3 text-slate-500">
                    <i className="fas fa-location-dot text-[#dd8d88] text-xs"></i>
                    <span className="text-sm font-bold tracking-tight">Corporate Office, India</span>
                </div>
            </div>

            <div className="flex gap-3">
              {['linkedin-in', 'x-twitter', 'instagram', 'facebook-f'].map(s => (
                <a 
                  key={s} 
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-[#496279] hover:bg-[#496279] hover:text-white transition-all duration-300 shadow-sm"
                >
                  <i className={`fab fa-${s} text-xs`}></i>
                </a>
              ))}
            </div>
          </div>
          
          {/* Simple Navigation Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-12">
            
            {/* Column 1: For Employees (Employee pages links) */}
            <div className="flex flex-col">
              <h4 className="font-black text-[#496279] text-[11px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <span className="w-4 h-[2px] bg-[#4c8051]"></span> For Candidates
              </h4>
              <ul className="space-y-4">
                <li><Link to="/register/employee" className="text-[13px] font-bold text-slate-400 hover:text-[#4c8051] transition-all block">Get Your Profile</Link></li>
                <li><Link to="/dashboard/employee" className="text-[13px] font-bold text-slate-400 hover:text-[#4c8051] transition-all block">Check My Trust Score</Link></li>
                <li><Link to="/verify/documents" className="text-[13px] font-bold text-slate-400 hover:text-[#4c8051] transition-all block">Verify Documents</Link></li>
                <li><Link to="/consent" className="text-[13px] font-bold text-slate-400 hover:text-[#4c8051] transition-all block">Privacy Consent</Link></li>
              </ul>
            </div>

            {/* Column 2: For Companies (Company pages links) */}
            <div className="flex flex-col">
              <h4 className="font-black text-[#496279] text-[11px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <span className="w-4 h-[2px] bg-[#dd8d88]"></span> For Employers
              </h4>
              <ul className="space-y-4">
                <li><Link to="/register/company" className="text-[13px] font-bold text-slate-400 hover:text-[#dd8d88] transition-all block">Register Organization</Link></li>
                <li><Link to="/employee/search" className="text-[13px] font-bold text-slate-400 hover:text-[#dd8d88] transition-all block">Search Candidates</Link></li>
                <li><Link to="/dashboard/company" className="text-[13px] font-bold text-slate-400 hover:text-[#dd8d88] transition-all block">Enterprise Portal</Link></li>
                <li><Link to="/review/submit" className="text-[13px] font-bold text-slate-400 hover:text-[#dd8d88] transition-all block">Submit Employee Audit</Link></li>
                <li><Link to="/review/manage" className="text-[13px] font-bold text-slate-400 hover:text-[#dd8d88] transition-all block">Manage History</Link></li>
              </ul>
            </div>

            {/* Column 3: General & Legal */}
            <div className="flex flex-col">
              <h4 className="font-black text-[#496279] text-[11px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <span className="w-4 h-[2px] bg-[#496279]"></span> Help & Legal
              </h4>
              <ul className="space-y-4">
                <li><Link to="/privacy" className="text-[13px] font-bold text-slate-400 hover:text-[#496279] transition-all block">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-[13px] font-bold text-slate-400 hover:text-[#496279] transition-all block">Terms of Service</Link></li>
                <li><Link to="/faq" className="text-[13px] font-bold text-slate-400 hover:text-[#496279] transition-all block">Resolution Center (FAQ)</Link></li>
                <li><Link to="/contact" className="text-[13px] font-bold text-slate-400 hover:text-[#496279] transition-all block">Connect Support</Link></li>
                <li><Link to="/about" className="text-[13px] font-bold text-slate-400 hover:text-[#496279] transition-all block">Our Vision</Link></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar - Compliance Status */}
        <div className="pt-10 border-t border-slate-200/60 flex flex-col lg:flex-row justify-between items-center gap-8">
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 order-2 lg:order-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">
              © 2026 MyHireShield Integration Hub. Built for Trust.
            </p>
            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4c8051] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4c8051]"></span>
              </span>
              <span className="text-[9px] font-black text-[#496279] uppercase tracking-[0.2em]">Data Sync: 100% Secure</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 order-1 lg:order-2">
            <Link to="/privacy" className="text-[10px] font-black text-slate-400 hover:text-[#dd8d88] uppercase tracking-[0.2em] transition-all">GDPR Ready</Link>
            <Link to="/terms" className="text-[10px] font-black text-slate-400 hover:text-[#dd8d88] uppercase tracking-[0.2em] transition-all">Audit Protocols</Link>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">SSL v3.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;