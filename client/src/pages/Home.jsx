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
      <section className="relative pt-20 pb-20 md:pt-32 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-b from-[#fef8f7] to-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#dd8d88]/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[0%] left-[-10%] w-[40%] h-[40%] bg-[#4c8051]/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-5 max-w-7xl">
          <div className="text-center max-w-4xl mx-auto mb-16 animate-on-scroll">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#dd8d88]/20 text-[#dd8d88] text-[11px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#dd8d88] animate-ping"></span>
              Verify. Score. Decide. Hire.
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#496279] mb-8 leading-[1] tracking-tight">
              Smarter Hiring Starts with <br />
              <span className="text-[#4c8051]">Verified Employees.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 font-medium mb-10 leading-relaxed max-w-3xl mx-auto">
              Verify employees' history, measure trustworthiness, and track employment patterns using HR verified data. Gain clarity on candidate credibility and protect your reputation.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link to="/register/company" className="w-full sm:w-auto px-10 py-5 bg-[#496279] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#3a4e61] transition-all shadow-xl hover:-translate-y-1">
                For Enterprises
              </Link>
              <Link to="/register/employee" className="w-full sm:w-auto px-10 py-5 bg-white text-[#496279] border-2 border-[#496279]/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all">
                Claim My Profile
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto border-y border-slate-100 py-10 animate-on-scroll">
            {[
              { n: '98%', l: 'Accuracy Rate', i: 'fa-bullseye' },
              { n: '<2 Min', l: 'Avg. Check Time', i: 'fa-stopwatch' },
              { n: '24/7', l: 'Expert Support', i: 'fa-headset' }
            ].map(stat => (
              <div key={stat.l} className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#4c8051]/5 flex items-center justify-center text-[#4c8051]">
                  <i className={`fas ${stat.i} text-lg`}></i>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-[#496279] leading-none">{stat.n}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.l}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Section - The Problem/Solution Layout */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-5 max-w-7xl">
          <div className="bg-[#496279] rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#dd8d88]/10 rounded-full blur-3xl"></div>
            <div className="lg:w-1/2 z-10 animate-on-scroll">
              <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight uppercase">Everything You Need to <br /> Hire With Confidence</h2>
              <p className="text-white/70 text-lg font-medium leading-relaxed">
                In today’s challenging era, every company faces attrition and sudden exits that cause financial loss and damage to the company’s reputation. Traditional methods are outdated. MyHireShield gives you an authentic, HR-verified path to truth.
              </p>
            </div>
            <div className="lg:w-1/2 grid grid-cols-1 gap-4 z-10 animate-on-scroll">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <i className="fas fa-triangle-exclamation text-[#dd8d88] mb-3"></i>
                <p className="text-sm font-bold">Traditional checks are limited, slow, and often based on unverified resumes.</p>
              </div>
              <div className="bg-[#4c8051] p-6 rounded-2xl shadow-lg border border-[#4c8051]/50">
                <i className="fas fa-circle-check text-white mb-3"></i>
                <p className="text-sm font-bold">MyHireShield uses real-time HR records to provide instant trust scores and verified data.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-24 bg-[#fcfaf9]">
        <div className="container mx-auto px-5 max-w-7xl">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-black text-[#496279] uppercase tracking-tight">Powerful Insights</h2>
            <div className="w-20 h-1 bg-[#dd8d88] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            {/* Large Card */}
            <div className="md:col-span-3 bg-white p-10 rounded-[2rem] border border-slate-100 hover:shadow-2xl transition-all animate-on-scroll group">
              <div className="w-14 h-14 bg-[#4c8051]/10 rounded-2xl flex items-center justify-center text-[#4c8051] mb-8 group-hover:bg-[#4c8051] group-hover:text-white transition-all">
                <i className="fas fa-history text-2xl"></i>
              </div>
              <h3 className="text-2xl font-black text-[#496279] mb-4">Employee History</h3>
              <p className="text-slate-500 font-bold leading-relaxed">Get the HR-Verified history and workplace performance of an employee that helps to hire the right person for your company.</p>
            </div>

            {/* Medium Card */}
            <div className="md:col-span-3 bg-white p-10 rounded-[2rem] border border-slate-100 hover:shadow-2xl transition-all animate-on-scroll group">
              <div className="w-14 h-14 bg-[#dd8d88]/10 rounded-2xl flex items-center justify-center text-[#dd8d88] mb-8 group-hover:bg-[#dd8d88] group-hover:text-white transition-all">
                <i className="fas fa-magnifying-glass-chart text-2xl"></i>
              </div>
              <h3 className="text-2xl font-black text-[#496279] mb-4">Spot Caps & Flags</h3>
              <p className="text-slate-500 font-bold leading-relaxed">Identify employee gaps, mismatched data, and the red flag behavior that might cause reputational damage in the future.</p>
            </div>

            {/* Small Card */}
            <div className="md:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 hover:shadow-2xl transition-all animate-on-scroll group">
              <div className="w-12 h-12 bg-[#496279]/10 rounded-2xl flex items-center justify-center text-[#496279] mb-6 group-hover:bg-[#496279] group-hover:text-white transition-all">
                <i className="fas fa-star text-xl"></i>
              </div>
              <h3 className="text-xl font-black text-[#496279] mb-3">Trust Score</h3>
              <p className="text-sm text-slate-500 font-bold">Measure credibility with a structured score based on varied history.</p>
            </div>

            <div className="md:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 hover:shadow-2xl transition-all animate-on-scroll group">
              <div className="w-12 h-12 bg-[#4c8051]/10 rounded-2xl flex items-center justify-center text-[#4c8051] mb-6 group-hover:bg-[#4c8051] group-hover:text-white transition-all">
                <i className="fas fa-shield-virus text-xl"></i>
              </div>
              <h3 className="text-xl font-black text-[#496279] mb-3">Reduce Risk</h3>
              <p className="text-sm text-slate-500 font-bold">Protect your company from uncertainty, fraud, and misrepresentation.</p>
            </div>

            <div className="md:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 hover:shadow-2xl transition-all animate-on-scroll group">
              <div className="w-12 h-12 bg-[#dd8d88]/10 rounded-2xl flex items-center justify-center text-[#dd8d88] mb-6 group-hover:bg-[#dd8d88] group-hover:text-white transition-all">
                <i className="fas fa-bolt text-xl"></i>
              </div>
              <h3 className="text-xl font-black text-[#496279] mb-3">Hire Faster</h3>
              <p className="text-sm text-slate-500 font-bold">Convert insight into instant and trusted decisions, simplify screening.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Keeping your preferred design but polishing */}
      <section id="how-it-works" className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-5 max-w-7xl text-center">
          <div className="max-w-3xl mx-auto mb-24 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-black text-[#496279] tracking-tighter mb-6 uppercase">How MyHireShield Works</h2>
            <div className="w-16 h-1.5 bg-[#4c8051] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-16 relative">
             {/* Hidden Line for Desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px border-t-2 border-dashed border-slate-100 -z-0"></div>
            
            {[
              { step: 'LEVEL 1', title: 'Integration', color: '#dd8d88', d: 'Integrate direct HR verified data of the employee to the portal MyHireShield by the Employer.' },
              { step: 'LEVEL 2', title: 'Verification', color: '#4c8051', d: 'Uploaded data goes under a multi-layer verification process to identify employee year gap, credibility, and inconsistencies.' },
              { step: 'LEVEL 3', title: 'Finalization', color: '#496279', d: 'Once the verification is complete, the data is turned into a structured employee trust score and actionable hiring insights.' }
            ].map((s, i) => (
              <div key={i} className="group text-center animate-on-scroll relative z-10 bg-white">
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

      {/* Modern FAQ Section */}
      <section className="py-24 bg-[#fcfaf9]">
        <div className="container mx-auto px-5 max-w-6xl">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="text-4xl font-black text-[#496279] uppercase tracking-tight">Got Questions?</h2>
              <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">Frequently Asked Questions</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 items-start">
                {[
                    { q: "How does My Hireshield help in hiring decisions?", a: "My Hireshield helps in hiring decisions by offering HR-verified data, insights, tenure, and other relevant information required by a recruiter that is beyond resumes and traditional background checks." },
                    { q: "What kind of employee information does My Hireshield provide?", a: "Information mainly required by the recruiter, such as identity, employment history, education, last company role & responsibilities, criminal records, and references. This helps recruiters hire the appropriate person for the company." },
                    { q: "What is Employee Trust Score?", a: "According to MyHireshield, the employee trust score is >60. This score shows that the employee is credible." },
                    { q: "How long does the verification process take?", a: "At MyHire Shield the verification process takes <2 min to gather the right and authentic data after submitting the employee's details, such as the employee's name and DOB." },
                    { q: "Why should employers use My Hireshield?", a: "To hire credible and trustworthy employees for their company, employers must use MyHireShield." },
                    { q: "How is an employee's history collected?", a: "An employee’s history is collected through the HR-verified employer records, especially from the official database. This is a reliable & structured data history that helps with accurate hiring decisions." },
                    { q: "What does the employee trust reflect?", a: "Via credibility score on the basis of the employee background history, consistency records, and HR-validation the employee trust score reflects." },
                    { q: "How does My Hireshield ensure fairness?", a: "By using a standardized verification procedure, consent-based data collection, an unbiased trust score, and HR-verified data assure every candidate is evaluated transparently." },
                    { q: "Can My Hireshield identify fake experience?", a: "Yes, My Hireshield is a structured & high-tech platform that easily identifies fake experiences or inconsistencies by thoroughly checking employment records." },
                    { q: "Can I view my employment data?", a: "Yes, if you are an employee and want to check your employment data and score, you can easily do so from My Hireshield. You need to put your name and DOB." }
                ].map((faq, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-2xl animate-on-scroll overflow-hidden transition-all duration-300">
                        <button 
                            onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                            className={`w-full p-6 text-left flex justify-between items-center transition-colors ${activeFaq === idx ? 'bg-[#496279] text-white' : 'hover:bg-slate-50'}`}
                        >
                            <span className="font-black text-xs uppercase tracking-tight pr-4">{faq.q}</span>
                            <i className={`fas fa-${activeFaq === idx ? 'minus' : 'plus'} text-[10px]`}></i>
                        </button>
                        {activeFaq === idx && (
                            <div className="p-6 text-slate-500 text-sm font-bold leading-relaxed bg-white">
                                {faq.a}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* CTA Section - Keeping your preferred design */}
      <section className="py-20 md:py-32 px-5 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="relative bg-[#496279] rounded-[3rem] p-12 md:p-24 text-center overflow-hidden border-[12px] border-slate-50 shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="relative z-10 animate-on-scroll">
              <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase leading-none">
                Hire Faster. <br /> Hire Smarter.
              </h2>
              <p className="text-white/60 text-sm md:text-lg mb-12 max-w-xl mx-auto font-black uppercase tracking-[0.2em]">
                Standardizing Global Professional Integrity.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register/company" className="px-12 py-5 bg-[#4c8051] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all active:scale-95">Start Protocol</Link>
                <a href="mailto:contact@hireshield.com" className="px-12 py-5 border-2 border-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95">Request Audit</a>
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