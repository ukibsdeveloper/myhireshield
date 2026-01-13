import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 border-t border-slate-200">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #4c8051 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative container mx-auto px-6 max-w-7xl">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 py-16">

          {/* 1. Brand Section - Enhanced */}
          <div className="lg:col-span-4 flex flex-col">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group w-fit">
              <div className="h-14 w-14 overflow-hidden rounded-2xl border-2 border-slate-200/80 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:border-[#4c8051]/30 bg-white">
                <img
                  src="/logo.jpg"
                  alt="MyHireShield Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-[#496279] tracking-tight leading-none">
                  Hire<span className="text-[#4c8051]">Shield</span>
                </span>
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mt-1.5">
                  Trusted Hiring Platform
                </span>
              </div>
            </Link>

            <p className="text-slate-600 text-[15px] leading-relaxed mb-8 font-medium max-w-sm">
              A simple hiring platform that helps you build trust with your team through verified work history and honest feedback.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Follow Us</span>
              <div className="flex gap-2">
                <a href="#" className="social-icon">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>

          {/* 2. Quick Links - For Employees */}
          <div className="lg:col-span-2">
            <h4 className="font-black text-[#496279] text-xs uppercase tracking-wider mb-6 pb-3 border-b-2 border-[#4c8051]/20">
              For Employees
            </h4>
            <ul className="space-y-3.5">
              <li><Link to="/register/employee" className="footer-link">I am an Employee</Link></li>
              <li><Link to="/dashboard/employee" className="footer-link">Check My Score</Link></li>
              <li><Link to="/verify/documents" className="footer-link">My Documents</Link></li>
              <li><Link to="/consent" className="footer-link">Privacy Settings</Link></li>
            </ul>
          </div>

          {/* 3. Quick Links - For Companies */}
          <div className="lg:col-span-2">
            <h4 className="font-black text-[#496279] text-xs uppercase tracking-wider mb-6 pb-3 border-b-2 border-[#4c8051]/20">
              For Companies
            </h4>
            <ul className="space-y-3.5">
              <li><Link to="/register/company" className="footer-link">Company Registration</Link></li>
              <li><Link to="/employee/search" className="footer-link">Find People</Link></li>
              <li><Link to="/dashboard/company" className="footer-link">Company Dashboard</Link></li>
              <li><Link to="/review/submit" className="footer-link">Rate an Employee</Link></li>
              <li><Link to="/review/manage" className="footer-link">Review History</Link></li>
            </ul>
          </div>

          {/* 4. Resources & Legal */}
          <div className="lg:col-span-2">
            <h4 className="font-black text-[#496279] text-xs uppercase tracking-wider mb-6 pb-3 border-b-2 border-[#4c8051]/20">
              Resources
            </h4>
            <ul className="space-y-3.5">
              <li><a href="/#faq" className="footer-link">FAQs & Help</a></li>
              <li><Link to="/terms" className="footer-link">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="/refund-policy" className="footer-link">Refund Policy</Link></li>
              <li><Link to="/disclaimer" className="footer-link">Disclaimer</Link></li>
            </ul>
          </div>

          {/* 5. Contact Information */}
          <div className="lg:col-span-2">
            <h4 className="font-black text-[#496279] text-xs uppercase tracking-wider mb-6 pb-3 border-b-2 border-[#4c8051]/20">
              Get In Touch
            </h4>
            <div className="space-y-5">
              {/* Phone */}
              <div className="group">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-2">Phone</span>
                <a href="tel:+919910048130" className="contact-link">
                  <i className="fas fa-phone-alt text-[#4c8051]"></i>
                  <span>+91 9910048130</span>
                </a>
              </div>

              {/* Email */}
              <div className="group">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-2">Email</span>
                <a href="mailto:ukibsdeveloper786@gmail.com" className="contact-link">
                  <i className="fas fa-envelope text-[#4c8051]"></i>
                  <span className="break-all">ukibsdeveloper786@gmail.com</span>
                </a>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 px-3 py-2 rounded-lg border border-emerald-200/50">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4c8051] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#4c8051]"></span>
                </div>
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">24/7 Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-slate-500">
                © 2026 <span className="text-[#496279] font-bold">MyHireShield</span>. All rights reserved.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-400 font-medium">Safe Hiring Platform</span>
              <div className="flex items-center gap-2">
                <i className="fas fa-shield-alt text-[#4c8051]"></i>
                <span className="text-slate-500 font-semibold">SSL Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .footer-link {
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          position: relative;
        }
        .footer-link:before {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #4c8051, #6ba36f);
          transition: width 0.3s ease;
        }
        .footer-link:hover {
          color: #496279;
          transform: translateX(4px);
        }
        .footer-link:hover:before {
          width: 100%;
        }
        
        .contact-link {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          transition: all 0.3s ease;
          padding: 8px 12px;
          border-radius: 8px;
          background: white;
          border: 1px solid #e2e8f0;
        }
        .contact-link:hover {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-color: #4c8051;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(76, 128, 81, 0.1);
        }
        .contact-link i {
          font-size: 12px;
          width: 16px;
          text-align: center;
        }
        
        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: white;
          border: 2px solid #e2e8f0;
          color: #64748b;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        .social-icon:hover {
          background: linear-gradient(135deg, #4c8051 0%, #6ba36f 100%);
          border-color: #4c8051;
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 8px 16px rgba(76, 128, 81, 0.25);
        }
      `}} />
    </footer>
  );
};

export default Footer;