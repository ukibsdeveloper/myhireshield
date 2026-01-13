import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10 selection:bg-[#4c8051]/10">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
          
          {/* 1. Brand & Value Prop */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="h-12 w-12 overflow-hidden rounded-xl border border-slate-200 shadow-sm transition-transform group-hover:scale-105 bg-white">
                <img 
                  src="/logo.jpg" 
                  alt="MyHireShield Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-[#496279] tracking-tighter uppercase leading-none">
                  Hire<span className="text-[#4c8051]">Shield</span>
                </span>
                <span className="text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase mt-1">
                  Verification Bureau
                </span>
              </div>
            </Link>
            
            <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium max-w-sm text-center lg:text-left">
              MyHireShield is a well-structured & high-tech background verification platform that offers accurate employee data that ensures trustworthiness and helps to make transparent hiring decisions.
            </p>
          </div>

          {/* 2. Navigation Links */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-8">
            {/* For Employees */}
            <div>
              <h4 className="font-black text-[#496279] text-[11px] uppercase tracking-[0.2em] mb-7 border-b border-slate-50 pb-2">
                For Employees
              </h4>
              <ul className="space-y-4">
                <li><Link to="/register/employee" className="footer-link">Claim My Profile</Link></li>
                <li><Link to="/dashboard/employee" className="footer-link">View Trust Score</Link></li>
                <li><Link to="/verify/documents" className="footer-link">Document Vault</Link></li>
                <li><Link to="/consent" className="footer-link">Privacy Settings</Link></li>
              </ul>
            </div>

            {/* For Companies */}
            <div>
              <h4 className="font-black text-[#496279] text-[11px] uppercase tracking-[0.2em] mb-7 border-b border-slate-50 pb-2">
                For Companies
              </h4>
              <ul className="space-y-4">
                <li><Link to="/register/company" className="footer-link">Business Registration</Link></li>
                <li><Link to="/employee/search" className="footer-link">Candidate Search</Link></li>
                <li><Link to="/dashboard/company" className="footer-link">Enterprise Dashboard</Link></li>
                <li><Link to="/review/submit" className="footer-link">Submit Employee Audit</Link></li>
                <li><Link to="/review/manage" className="footer-link">History Records</Link></li>
              </ul>
            </div>
          </div>

          {/* 3. Support & Contact - PHONE UPDATED HERE */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="font-black text-[#496279] text-[11px] uppercase tracking-[0.2em] mb-7 border-b border-slate-50 pb-2">
              Resolution Hub
            </h4>
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Call Support</span>
                <a href="tel:+919910048130" className="text-sm font-bold text-[#496279] hover:text-[#4c8051] transition-colors flex items-center gap-2">
                  <i className="fas fa-phone-alt text-[10px]"></i>
                  +91 9910048130
                </a>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Common</span>
                <a href="/#faq" className="text-sm font-bold text-[#496279] hover:text-[#4c8051]">
                  FAQs & Help
                </a>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Legal</span>
                <Link to="/terms" className="text-sm font-bold text-[#496279] hover:text-[#4c8051]">
                  Terms & Conditions
                </Link>
                <Link to="/privacy" className="text-sm font-bold text-[#496279] hover:text-[#4c8051]">
                  Privacy Policy
                </Link>
                <Link to="/refund-policy" className="text-sm font-bold text-[#496279] hover:text-[#4c8051]">
                  Refund Policy
                </Link>
                <Link to="/disclaimer" className="text-sm font-bold text-[#496279] hover:text-[#4c8051]">
                  Disclaimer
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Compliance Section */}
        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              © 2026 MyHireShield Bureau. Secure Protocol Integration.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4c8051] animate-pulse"></div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Infrastructure Active</span>
            </div>
            <Link to="/terms" className="text-[9px] font-black text-slate-400 hover:text-[#496279] uppercase tracking-widest">Terms & Conditions</Link>
            <Link to="/privacy" className="text-[9px] font-black text-slate-400 hover:text-[#496279] uppercase tracking-widest">Privacy Policy</Link>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .footer-link {
          font-size: 13px;
          font-weight: 700;
          color: #94a3b8;
          transition: all 0.2s;
          display: block;
        }
        .footer-link:hover {
          color: #496279;
          transform: translateX(4px);
        }
      `}} />
    </footer>
  );
};

export default Footer;