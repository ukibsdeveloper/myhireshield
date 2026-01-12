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
      <section className="relative pt-20 pb-20 md:pt-32 lg:pt-36 lg:pb-36 overflow-hidden bg-gradient-to-b from-[#fef8f7] to-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-[#dd8d88]/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[5%] left-[-5%] w-[40%] h-[40%] bg-[#4c8051]/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="animate-on-scroll z-10 text-center lg:text-left w-full lg:w-3/5">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#dd8d88]/20 text-[#dd8d88] text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] mb-8 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#dd8d88] animate-pulse"></span>
                Verify. Score. Decide. Hire.
              </div>
              
              <h1 className="text-[40px] sm:text-6xl lg:text-[72px] font-black text-[#496279] mb-8 leading-[1.05] tracking-tight">
                Smarter Hiring Starts with <br className="hidden md:block" />
                <span className="text-[#4c8051] relative inline-block mt-2">
                   Verified Employees.
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#4c8051]/10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="6" fill="none" /></svg>
                </span>
              </h1>
              
              <p className="text-base md:text-xl text-slate-500 font-bold mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 border-l-4 border-[#4c8051]/20 pl-6">
                Verify employees' history, measure trustworthiness, and past track employment patterns using HR verified data. These insights help employers to gain clarity on candidate credibility, and hire a responsible person that product their company’s reputation.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
                <Link to="/register/company" className="w-full sm:w-auto px-10 py-5 bg-[#496279] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#3a4e61] transition-all shadow-[0_15px_35px_rgba(73,98,121,0.2)] hover:-translate-y-1">
                  For Enterprises
                  <i className="fas fa-chevron-right text-[10px]"></i>
                </Link>
                <Link to="/register/employee" className="w-full sm:w-auto px-10 py-5 bg-white text-[#496279] border-2 border-[#496279]/10 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all hover:border-[#496279]/20">
                  Claim My Profile
                </Link>
              </div>

              <div className="mt-16 pt-10 border-t border-slate-100 grid grid-cols-3 gap-8 max-w-lg mx-auto lg:mx-0">
                {[
                  { n: '98%', l: 'Accuracy Rate', c: '#4c8051' },
                  { n: '<2 Min', l: 'Avg. Check Time', c: '#dd8d88' },
                  { n: '24/7', l: 'Support', c: '#496279' }
                ].map(stat => (
                  <div key={stat.l}>
                    <p className="text-2xl md:text-3xl font-black tracking-tighter" style={{ color: stat.c }}>{stat.n}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{stat.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Mockup Card */}
            <div className="relative animate-on-scroll w-full lg:w-2/5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[440px] group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#4c8051]/10 via-transparent to-[#dd8d88]/10 rounded-[3rem] blur-2xl opacity-60"></div>
                <div className="relative bg-white border border-slate-200/60 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.06)] overflow-hidden p-8 md:p-10 transition-all duration-700 group-hover:shadow-[0_40px_100px_rgba(0,0,0,0.1)]">
                  <div className="flex justify-between items-center mb-12">
                    <div className="flex gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-slate-100"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-100"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-100"></div>
                    </div>
                    <span className="text-[9px] font-black text-[#4c8051] bg-[#4c8051]/5 px-4 py-1.5 rounded-full border border-[#4c8051]/10 tracking-[0.15em] uppercase">Security Level: High</span>
                  </div>
                  
                  <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#496279] to-[#3a4e61] flex items-center justify-center shadow-xl shadow-[#496279]/20">
                      <i className="fas fa-shield-halved text-2xl text-[#dd8d88]"></i>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-[#496279] tracking-tight">Employee Trust Score™</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => <div key={s} className="w-3 h-1 rounded-full bg-[#4c8051]"></div>)}
                        </div>
                        <p className="text-[10px] font-black text-[#4c8051] tracking-[0.1em] uppercase">Credible</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-10">
                    <div className="bg-[#fcfaf9] border border-slate-100 p-5 rounded-2xl flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HR-Verification</span>
                        <span className="text-sm font-black text-[#496279]">99.2% Match</span>
                    </div>
                    <div className="bg-[#fcfaf9] border border-slate-100 p-5 rounded-2xl flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Tenure</span>
                        <span className="text-sm font-black text-[#496279]">Active Pulse</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center p-5 bg-[#4c8051] rounded-2xl text-white shadow-lg shadow-[#4c8051]/20 group-hover:scale-[1.02] transition-transform">
                      <div className="flex items-center gap-3">
                        <i className="fas fa-circle-check text-sm text-white/80"></i>
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Verified Integrity Infrastructure</span>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro/Problem Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-5 max-w-6xl">
            <div className="bg-[#fcfaf9] border border-slate-100 rounded-[3rem] p-10 md:p-20 text-center animate-on-scroll relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-[#dd8d88]/5 rounded-full -translate-x-16 -translate-y-16"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black text-[#496279] mb-10 uppercase tracking-tighter leading-tight">Everything You Need to <br /> Hire With Confidence</h2>
                    <div className="max-w-4xl mx-auto space-y-8">
                        <p className="text-lg md:text-xl text-slate-500 font-bold leading-relaxed">
                            In today’s challenging era, every company faces the attrition and sudden by their employee that causes financial loss, reduced productivity, and damage to the company’s reputation as well. Therefore, before hiring, the employer must conduct a record check. Traditional methods to check the credibility are very limited or outdated.
                        </p>
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent w-full"></div>
                        <p className="text-lg md:text-xl text-[#4c8051] font-black leading-relaxed">
                            Thus, MyHireShield contributes to giving you an authentic and HR-verified employment history, credibility insight, and a structured trust score that help you:
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 md:py-32 bg-[#fcfaf9] relative overflow-hidden">
        <div className="container mx-auto px-5 max-w-7xl relative">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[
              { icon: 'fa-history', title: 'Employee History', d: 'Get the HR-Verified history and workplace performance of an employee that helps to get hired the right person for your company.', color: '#4c8051' },
              { icon: 'fa-magnifying-glass-chart', title: 'Spot Caps, Flags, & Inconsistencies', d: 'Identify employee gaps, mismatched data, and the red flag behavior might cause the company\'s reputation in the future.', color: '#dd8d88' },
              { icon: 'fa-star-half-stroke', title: 'Employee Trust Score', d: 'Measure the credibility of an employee with a structured trust score based on a varied history.', color: '#496279' },
              { icon: 'fa-shield-heart', title: 'Reduce Hiring Risk', d: 'Protect your company from uncertainty, fraud, and misrepresentation that strengthens hiring confidence.', color: '#4c8051' },
              { icon: 'fa-bolt-lightning', title: 'Hire Faster, Hire Smarter', d: 'Convert insight into instant and trusted decisions, simplify screening.', color: '#dd8d88' },
              { icon: 'fa-users-gear', title: 'Build a Trusted Workforce', d: 'Stronger team trust helps to build transparency and accountability by hiring professionals.', color: '#496279' }
            ].map((f, i) => (
              <div key={i} className="group p-10 rounded-[2rem] bg-white border border-slate-100 hover:border-[#496279]/20 transition-all duration-500 animate-on-scroll hover:shadow-[0_30px_60px_rgba(0,0,0,0.03)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full translate-x-12 -translate-y-12 transition-transform group-hover:scale-150 duration-700"></div>
                <div className="relative z-10">
                    <div className="w-14 h-14 mb-8 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110" style={{ backgroundColor: `${f.color}10`, color: f.color }}>
                      <i className={`fas ${f.icon} text-xl`}></i>
                    </div>
                    <h3 className="text-xl font-black text-[#496279] mb-4 tracking-tight uppercase leading-tight">{f.title}</h3>
                    <p className="text-slate-500 text-sm font-bold leading-relaxed opacity-80">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section (Preferred Layout) */}
      <section id="how-it-works" className="py-24 md:py-32 bg-white relative overflow-hidden border-y border-slate-100">
        <div className="container mx-auto px-5 max-w-7xl text-center">
          <div className="max-w-3xl mx-auto mb-24 animate-on-scroll">
            <h2 className="text-4xl md:text-6xl font-black text-[#496279] tracking-tighter mb-6 uppercase">How MyHire Shield Works?</h2>
            <div className="w-20 h-2 bg-[#4c8051] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-16 relative">
            {/* Visual connector line for desktop */}
            <div className="hidden lg:block absolute top-[110px] left-[15%] right-[15%] h-0.5 bg-dashed bg-slate-100 border-t-2 border-dashed border-slate-200"></div>
            
            {[
              { step: 'LEVEL 1', title: 'Integration', color: '#dd8d88', d: 'Intergate Doirect HR verified data of the employee to the portal MyHireShield by the Employer.' },
              { step: 'LEVEL 2', title: 'Verification', color: '#4c8051', d: 'Uploaded data goes under a multi-layer verification process to identify employee year gap, credibility, and inconsistencies.' },
              { step: 'LEVEL 3', title: 'Finalization', color: '#496279', d: 'Once the verification is complete, the data is turned into a structured employee trust score and actionable hiring insights.' }
            ].map((s, i) => (
              <div key={i} className="group text-center animate-on-scroll relative z-10 bg-white px-4">
                <p className="text-[10px] font-black tracking-[0.4em] mb-8" style={{ color: s.color }}>{s.step}</p>
                <div className="relative w-24 h-24 mx-auto mb-10">
                  <div className="absolute inset-0 border-2 border-dashed border-slate-200 rounded-full group-hover:rotate-90 transition-transform duration-[2s]"></div>
                  <div className="absolute inset-2 bg-white border border-slate-100 rounded-full shadow-xl flex items-center justify-center text-2xl font-black text-[#496279]">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-black text-[#496279] mb-4 tracking-tight uppercase">{s.title}</h3>
                <p className="text-slate-500 text-sm font-bold leading-relaxed max-w-[280px] mx-auto uppercase tracking-wide opacity-70">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-32 bg-[#fcfaf9]">
        <div className="container mx-auto px-5 max-w-4xl">
            <div className="text-center mb-16 animate-on-scroll">
                <h2 className="text-3xl md:text-5xl font-black text-[#496279] mb-4 uppercase tracking-tighter">Frequently Asked Questions</h2>
                <p className="text-xs font-black text-[#dd8d88] tracking-[0.3em] uppercase">Everything you need to know about the protocol</p>
            </div>
            <div className="space-y-4">
                {[
                    { q: "How does My Hireshield help in hiring decisions?", a: "My Hireshield helps in hiring decisions by offering Hr-verified data, insight, tenure, and other relevant information required by a recruiter that is beyond resumes and traditional background checks." },
                    { q: "What kind of employee information does My Hireshield provide?", a: "Information mainly required by the recruiter, such as identity, employment history, education, last company role & responsibilities, criminal records, and references provided by My Hireshield. This information helps recruiters to hire the appropriate person for the company." },
                    { q: "What is Employee Trust Score?", a: "According to MyHireshield, the employee trust score is >60. This score shows that the employee is credible." },
                    { q: "How long does the verification process take?", a: "At MyHire Shield ths verification process takes <2 min to gather the right and authentic data after submitting the employee's details, such as the employee's name and DOB." },
                    { q: "Why should employers use My Hireshield?", a: "To hire credible and trustworthy employees for their company, employers must use MyHireShield." },
                    { q: "How is an employee's history collected by the My Hiresheild?", a: "An employee’s history is collected through the HR-verified employer records, especially from the official database. This is a reliable & structured data history that helps with accurate hiring decisions." },
                    { q: "What does the employee trust reflect?", a: "Via credibility score on the basis of the employee background history, consistency records, and HR-vlaidation the employee trust score reflects." },
                    { q: "How does My Hireshield ensure fairness?", a: "By using a standardized verification procedure, consent-based data collection, an unbiased trust score, and HR-verified data assure every candidate is evaluated transparently." },
                    { q: "Can My Hireshield identify fake experience or inconsistencies?", a: "Yes, My Hireshield is a structured & high-tech platform that easily identifies fake experiences or inconsistencies by thoroughly checking employment records and helps in making trustworthy hiring decisions." },
                    { q: "Can I view or request my employment data?", a: "Yes, of course. If you are an employee and want to check your employment data and score, you can easily do so from My Hireshield. You need to put your name and DOB, and you will get your score and data in front of you." }
                ].map((faq, idx) => (
                    <div key={idx} className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden animate-on-scroll shadow-sm hover:shadow-md transition-shadow">
                        <button 
                            onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                            className={`w-full p-6 md:p-8 text-left flex justify-between items-center transition-colors ${activeFaq === idx ? 'bg-[#496279]/5' : ''}`}
                        >
                            <span className="font-black text-[#496279] text-xs md:text-sm uppercase tracking-tight pr-4">{faq.q}</span>
                            <div className={`w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 bg-[#496279] text-white' : ''}`}>
                                <i className="fas fa-chevron-down text-[10px]"></i>
                            </div>
                        </button>
                        {activeFaq === idx && (
                            <div className="px-6 md:px-8 pb-8 text-slate-500 text-sm font-bold leading-relaxed border-t border-slate-50 pt-6">
                                {faq.a}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* CTA Section (Your Preferred Layout) */}
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
              <div className="flex flex-col sm:flex-row justify-center gap-5">
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