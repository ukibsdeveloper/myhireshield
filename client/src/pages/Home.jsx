import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);

    const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-4');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      el.classList.add('transition-all', 'duration-700', 'ease-[cubic-bezier(0.23,1,0.32,1)]', 'opacity-0', 'translate-y-4');
      observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfaf9] text-[#496279] font-sans antialiased selection:bg-[#dd8d88]/30">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <Navbar scrolled={scrolled} isAuthenticated={isAuthenticated} user={user} />

      {/* Hero Section */}
      <section className="relative pt-16 pb-16 md:pt-24 lg:pt-28 lg:pb-32 overflow-hidden bg-gradient-to-b from-[#fef8f7] to-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-[#dd8d88]/15 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[10%] left-[-5%] w-[35%] h-[35%] bg-[#4c8051]/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="animate-on-scroll z-10 text-center lg:text-left w-full lg:w-3/5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-[#dd8d88]/20 text-[#dd8d88] text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] mb-8 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#dd8d88] animate-pulse"></span>
                Verify. Score. Decide. Hire.
              </div>
              
              <h1 className="text-[36px] sm:text-6xl lg:text-[76px] font-black text-[#496279] mb-8 leading-[1.1] tracking-[-0.03em]">
                Smarter Hiring Starts with <br className="hidden md:block" />
                <span className="text-[#4c8051] relative">
                   Verified Employees.
                  <svg className="absolute -bottom-2 left-0 w-full h-2 text-[#4c8051]/20" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
                </span>
              </h1>
              
              <p className="text-base md:text-xl text-slate-500/90 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-bold border-l-4 border-[#4c8051]/20 pl-6">
                Verify history, measure trustworthiness, and track employment patterns using HR verified data. Gain clarity on candidate credibility and hire responsible talent.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/register/company" className="w-full sm:w-auto px-10 py-4.5 bg-[#496279] text-white rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#3a4e61] transition-all shadow-[0_10px_30px_rgba(73,98,121,0.25)] hover:-translate-y-1">
                  For Enterprises
                  <i className="fas fa-arrow-right text-xs"></i>
                </Link>
                <Link to="/register/employee" className="w-full sm:w-auto px-10 py-4.5 bg-white text-[#496279] border-2 border-[#496279]/10 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#fcfaf9] transition-all">
                  Claim Profile
                </Link>
              </div>

              <div className="mt-16 pt-10 border-t border-slate-100 grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0">
                {[
                  { n: '98%', l: 'Accuracy Rate' },
                  { n: '<2 Min', l: 'Avg. Check Time' },
                  { n: '24/7', l: 'Support' }
                ].map(stat => (
                  <div key={stat.l}>
                    <p className="text-2xl font-black text-[#496279] tracking-tight">{stat.n}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-on-scroll w-full lg:w-2/5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[460px] group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#4c8051]/20 to-[#dd8d88]/20 rounded-[2rem] blur-xl opacity-50"></div>
                <div className="relative bg-white border border-slate-200 rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.08)] overflow-hidden p-7 md:p-9 transition-transform duration-700 group-hover:scale-[1.02]">
                  <div className="flex justify-between items-center mb-10">
                    <div className="flex gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-100"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-100"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-100"></div>
                    </div>
                    <span className="text-[10px] font-black text-[#4c8051] bg-[#4c8051]/5 px-3 py-1 rounded-full border border-[#4c8051]/10 tracking-widest uppercase">Verified System</span>
                  </div>
                  <div className="flex items-center gap-5 mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-[#496279] flex items-center justify-center shadow-lg shadow-[#496279]/20">
                      <i className="fas fa-shield-halved text-2xl text-[#dd8d88]"></i>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-[#496279] tracking-tight">Trust Score™</h4>
                      <p className="text-xs font-bold text-[#4c8051] tracking-[0.1em] uppercase">Status: Credible</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[98, 85, 92].map((v, i) => (
                      <div key={i} className="bg-[#fcfaf9] border border-slate-100 p-4 rounded-2xl text-center">
                        <p className="text-xl font-black text-[#496279]">{v}</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Check</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#496279] rounded-2xl text-white shadow-lg shadow-[#496279]/30">
                    <div className="flex items-center gap-3">
                      <i className="fas fa-fingerprint text-sm text-[#dd8d88]"></i>
                      <span className="text-xs font-black uppercase tracking-wider">HR-Verified</span>
                    </div>
                    <i className="fas fa-check-double text-xs opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About/Value Section */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="container mx-auto px-5 max-w-5xl text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-black text-[#496279] mb-8 uppercase tracking-tight">Everything You Need to Hire With Confidence</h2>
            <p className="text-slate-500 font-bold leading-relaxed mb-6">
                In today’s challenging era, every company faces attrition and sudden exits that cause financial loss, reduced productivity, and damage to reputation. Traditional methods are limited or outdated.
            </p>
            <p className="text-slate-500 font-bold leading-relaxed italic border-t pt-6 border-slate-100">
                MyHireShield provides authentic, HR-verified employment history, credibility insights, and a structured trust score.
            </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 md:py-32 bg-[#fcfaf9] relative overflow-hidden">
        <div className="container mx-auto px-5 max-w-7xl relative">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-20 animate-on-scroll">
            <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
              <h2 className="text-4xl md:text-5xl font-black text-[#496279] tracking-tight mb-6">
                Core <span className="text-[#4c8051]">Insights.</span>
              </h2>
              <p className="text-lg text-slate-500 font-bold max-w-lg mx-auto lg:mx-0">Convert data into instant, trusted hiring decisions.</p>
            </div>
            <div className="h-px bg-slate-200 flex-grow mx-12 hidden lg:block opacity-50"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: 'fa-history', title: 'Employee History', d: 'HR-Verified history and workplace performance to ensure the right fit.', color: '#4c8051' },
              { icon: 'fa-magnifying-glass-chart', title: 'Spot Caps & Flags', d: 'Identify gaps, mismatched data, and red flag behaviors.', color: '#dd8d88' },
              { icon: 'fa-star-half-stroke', title: 'Employee Trust Score', d: 'Measure credibility with a structured score based on verified history.', color: '#496279' },
              { icon: 'fa-shield-heart', title: 'Reduce Hiring Risk', d: 'Protect your company from uncertainty, fraud, and misrepresentation.', color: '#4c8051' },
              { icon: 'fa-bolt', title: 'Hire Faster & Smarter', d: 'Instant insights simplify screening and accelerate decisions.', color: '#dd8d88' },
              { icon: 'fa-users-gear', title: 'Build a Trusted Workforce', d: 'Foster transparency and accountability with high-integrity professionals.', color: '#496279' }
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-white border border-slate-100 hover:border-[#496279] transition-all duration-300 animate-on-scroll hover:shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
                <div className="w-12 h-12 mb-8 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:bg-[#496279] group-hover:text-white" style={{ backgroundColor: `${f.color}10`, color: f.color }}>
                  <i className={`fas ${f.icon} text-lg`}></i>
                </div>
                <h3 className="text-lg font-black text-[#496279] mb-4 tracking-tight uppercase">{f.title}</h3>
                <p className="text-slate-500 text-sm font-bold leading-relaxed opacity-75">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="process" className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-5 max-w-7xl text-center">
          <div className="max-w-3xl mx-auto mb-24 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-black text-[#496279] tracking-tighter mb-6 uppercase">How MyHireShield Works</h2>
            <div className="w-16 h-1.5 bg-[#4c8051] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { step: 'LEVEL 1', title: 'Integration', color: '#dd8d88', d: 'Integrate direct HR verified data of the employee to the portal by the Employer.' },
              { step: 'LEVEL 2', title: 'Verification', color: '#4c8051', d: 'Multi-layer verification process to identify gaps, credibility, and inconsistencies.' },
              { step: 'LEVEL 3', title: 'Finalization', color: '#496279', d: 'Data is turned into a structured employee trust score and actionable hiring insights.' }
            ].map((s, i) => (
              <div key={i} className="group text-center animate-on-scroll">
                <p className="text-[10px] font-black tracking-[0.4em] mb-8" style={{ color: s.color }}>{s.step}</p>
                <div className="relative w-24 h-24 mx-auto mb-10">
                  <div className="absolute inset-0 border-2 border-dashed border-slate-200 rounded-full group-hover:rotate-45 transition-transform duration-1000"></div>
                  <div className="absolute inset-2 bg-white border border-slate-100 rounded-full shadow-lg flex items-center justify-center text-xl font-black text-[#496279]">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-black text-[#496279] mb-4 tracking-tight uppercase">{s.title}</h3>
                <p className="text-slate-500 text-xs font-bold leading-relaxed max-w-[250px] mx-auto uppercase tracking-wide opacity-70">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#fcfaf9]">
        <div className="container mx-auto px-5 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-black text-[#496279] mb-12 text-center uppercase">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {[
                    { q: "How does My Hireshield help in hiring decisions?", a: "My Hireshield helps in hiring decisions by offering HR-verified data, insights, tenure, and other relevant information required by a recruiter that is beyond resumes and traditional background checks." },
                    { q: "What kind of employee information does My Hireshield provide?", a: "Information mainly required by the recruiter, such as identity, employment history, education, last company role & responsibilities, criminal records, and references. This helps recruiters hire the appropriate person for the company." },
                    { q: "What is the Employee Trust Score?", a: "The employee trust score is based on HR-verified data. A score >60 indicates that the employee is credible and trustworthy." },
                    { q: "How long does the verification process take?", a: "At MyHire Shield, the verification process takes <2 min to gather authentic data after submitting simple details like Name and Date of Birth." },
                    { q: "Why should employers use My Hireshield?", a: "To ensure they are hiring credible and trustworthy employees, protecting the company from financial loss and reputational damage." },
                    { q: "How is an employee's history collected?", a: "History is collected through HR-verified employer records and official databases, ensuring a reliable and structured data history." },
                    { q: "How does My Hireshield ensure fairness?", a: "By using standardized verification, consent-based collection, and an unbiased trust score to evaluate every candidate transparently." },
                    { q: "Can it identify fake experience or inconsistencies?", a: "Yes, our high-tech platform identifies fake experiences or inconsistencies by cross-referencing employment records thoroughly." },
                    { q: "Can I view or request my own employment data?", a: "Yes. If you are an employee, you can view your data and score by providing your Name and DOB on the platform." }
                ].map((faq, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden animate-on-scroll">
                        <button 
                            onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                            className="w-full p-6 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                        >
                            <span className="font-black text-[#496279] text-sm uppercase tracking-tight">{faq.q}</span>
                            <i className={`fas fa-chevron-${activeFaq === idx ? 'up' : 'down'} text-[#dd8d88] text-xs`}></i>
                        </button>
                        {activeFaq === idx && (
                            <div className="px-6 pb-6 text-slate-500 text-sm font-bold leading-relaxed border-t border-slate-50 pt-4">
                                {faq.a}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-5 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="relative bg-[#496279] rounded-[2.5rem] p-12 md:p-24 text-center overflow-hidden border-[12px] border-slate-50 shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="relative z-10 animate-on-scroll">
              <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase leading-none">
                Hire Faster. <br /> Hire Smarter.
              </h2>
              <p className="text-white/60 text-sm md:text-lg mb-12 max-w-xl mx-auto font-black uppercase tracking-[0.2em]">
                Standardizing Global Professional Integrity.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register/company" className="px-12 py-5 bg-[#4c8051] text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all active:scale-95">Start Protocol</Link>
                <a href="mailto:contact@hireshield.com" className="px-12 py-5 border-2 border-white/20 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95">Request Audit</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;