import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageMeta from '../components/PageMeta';

const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://myhireshield.com';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'HireShield',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.jpg`,
  description: 'The gold standard for secure employee verification and professional integrity. Verify, score, and hire with confidence.',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9910048130',
    contactType: 'customer service',
    areaServed: 'IN',
  },
};

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'HireShield Employee Verification',
  description: 'Verify employees\' history, measure trustworthiness, and track past employment patterns using HR-verified data. Trust scores and reputation reports for employers and employees.',
  provider: { '@type': 'Organization', name: 'HireShield' },
  areaServed: { '@type': 'Country', name: 'India' },
};

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
      <PageMeta
        title="Secure Hiring. Professional Integrity."
        description="Verify employees' history, measure trustworthiness, and hire with confidence. The gold standard for secure employee verification."
        canonical="/"
        jsonLd={{ '@context': 'https://schema.org', '@graph': [organizationJsonLd, serviceJsonLd] }}
      />
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <Navbar scrolled={scrolled} isAuthenticated={isAuthenticated} user={user} />

      {/* Hero Section */}
      <section className="relative pt-16 pb-16 md:pt-24 lg:pt-28 lg:pb-32 overflow-hidden bg-gradient-to-b from-[#fef8f7] to-white">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-[#dd8d88]/15 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[10%] left-[-5%] w-[35%] h-[35%] bg-[#4c8051]/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-5 sm:px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

            {/* Left Content */}
            <div className="animate-on-scroll z-10 text-center lg:text-left w-full lg:w-3/5">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#dd8d88]/20 text-[#dd8d88] text-xs font-black uppercase tracking-[0.25em] mb-8 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#dd8d88] animate-pulse"></span>
                Verify. Score. Decide. Hire.
              </div>

              <h1 className="text-[32px] sm:text-5xl md:text-6xl lg:text-[76px] font-black text-[#496279] mb-6 sm:mb-8 leading-[1.1] tracking-[-0.03em]">
                Smarter Hiring Starts with<br className="hidden md:block" />
                <span className="text-[#4c8051] relative">
                  Verified Employee.
                  <svg className="absolute -bottom-2 left-0 w-full h-2 text-[#4c8051]/20" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-xl text-slate-500/90 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-bold border-l-4 border-[#4c8051]/20 pl-4 sm:pl-6">
                Verify employees' history, measure trustworthiness, and track past employment patterns using HR verified data. These insights help employers to gain clarity on candidate credibility, and hire a responsible person that protect their company’s reputation.
              </p>

              {/* New Action Buttons & Stats Wrapper */}
              <div className="flex flex-col gap-12 mt-10">
                {/* Updated Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
                  <Link
                    to="/register/company"
                    className="group w-full sm:w-auto px-10 py-5 bg-[#496279] text-white rounded-2xl font-bold text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#3a4e61] transition-all shadow-[0_20px_40px_rgba(73,98,121,0.2)] hover:-translate-y-1 active:scale-95"
                  >
                    I am a Company
                    <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
                  </Link>

                  <Link
                    to="/login"
                    className="w-full sm:w-auto px-10 py-5 bg-white text-[#496279] border border-slate-200 rounded-2xl font-bold text-xs tracking-[0.2em] hover:bg-slate-50 transition-all shadow-sm hover:shadow-md active:scale-95"
                  >
                    Employee Login
                  </Link>
                </div>

                {/* Updated Structured Stats */}
                <div className="inline-grid grid-cols-3 gap-3 sm:gap-4 md:gap-10 py-6 sm:py-8 px-2 border-t border-slate-100 max-w-lg mx-auto lg:mx-0">
                  {[
                    { n: '98%', l: 'Accuracy Rate', color: '#4c8051' },
                    { n: '<2 Min', l: 'Avg. Check Time', color: '#dd8d88' },
                    { n: '24/7', l: 'Support', color: '#496279' }
                  ].map((stat, idx) => (
                    <div key={stat.l} className={`relative ${idx !== 0 ? 'pl-4 md:pl-8' : ''}`}>
                      {idx !== 0 && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-slate-200"></div>
                      )}
                      <p className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter leading-none" style={{ color: stat.color }}>
                        {stat.n}
                      </p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2 whitespace-nowrap">
                        {stat.l}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side: Dashboard Mockup */}
            <div className="relative animate-on-scroll w-full lg:w-2/5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[460px] group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#4c8051]/20 to-[#dd8d88]/20 rounded-[2rem] blur-xl opacity-50"></div>
                <div className="relative bg-white border border-slate-200 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.08)] overflow-hidden p-6 sm:p-8 md:p-10 transition-transform duration-700 group-hover:scale-[1.02] flex flex-col items-center">

                  {/* Top: Logo (w-64 h-64 - Dugni Size) */}
                  <div className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-3xl overflow-hidden border-2 border-slate-50 shadow-xl mb-6 sm:mb-8 transition-transform duration-500 group-hover:rotate-3 bg-white">
                    <img
                      src="/logo.jpg"
                      alt="HireShield Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Header Content */}
                  <div className="text-center mb-8">
                    <span className="text-xs font-black text-[#4c8051] bg-[#4c8051]/5 px-4 py-1.5 rounded-full border border-[#4c8051]/10 tracking-widest uppercase mb-4 inline-block">Safe Checked</span>
                    <h4 className="text-2xl font-black text-[#496279] tracking-tight">Trust Score</h4>
                    <p className="text-sm font-bold text-[#4c8051] tracking-[0.1em] uppercase">Status: Good</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-8 w-full">
                    {[{ v: 95, l: 'History' }, { v: 88, l: 'Conduct' }, { v: 90, l: 'Tenure' }].map((item, i) => (
                      <div key={i} className="bg-[#fcfaf9] border border-slate-100 p-4 rounded-2xl text-center shadow-sm">
                        <p className="text-xl font-black text-[#496279]">{item.v}</p>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.l}</p>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Indicator */}
                  <div className="flex items-center justify-between p-4 bg-[#496279] rounded-2xl text-white shadow-lg shadow-[#496279]/30 w-full">
                    <div className="flex items-center gap-3">
                      <i className="fas fa-check-circle text-sm text-[#dd8d88]"></i>
                      <span className="text-xs font-black uppercase tracking-wider">Verified by HR</span>
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
          <h2 className="text-3xl md:text-4xl font-black text-[#496279] mb-8 tracking-tight">Everything You Need to Hire With Confidence</h2>
          <p className="text-slate-500 font-bold leading-relaxed mb-6">
            In today’s challenging era, every company faces attrition and sudden exits by their employees that cause financial loss, reduced productivity, and damage to the company’s reputation. Therefore, before hiring, the employer must conduct a record check. Traditional methods to check credibility are very limited or outdated.
          </p>
          <p className="text-slate-500 font-bold leading-relaxed italic border-t pt-6 border-slate-100">
            Thus, MyHireShield contributes to giving you an authentic and HR-verified employment history, credibility insight, and a structured trust score.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 md:py-32 bg-[#fcfaf9] relative overflow-hidden">
        <div className="container mx-auto px-5 max-w-7xl relative">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-20 animate-on-scroll">
            <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
              <h2 className="text-4xl md:text-5xl font-black text-[#496279] tracking-tight mb-6">
                Simple <span className="text-[#4c8051]">Checks.</span>
              </h2>
              <p className="text-lg text-slate-500 font-bold max-w-lg mx-auto lg:mx-0">Convert real history into easy hiring decisions.</p>
            </div>
            <div className="h-px bg-slate-200 flex-grow mx-12 hidden lg:block opacity-50"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: 'fa-history', title: 'Employee History', d: 'Get the HR-Verified history and workplace performance of an employee that helps to get hired the right person for your company.', color: '#4c8051' },
              { icon: 'fa-magnifying-glass-chart', title: 'Spot Caps, Flags, & Inconsistencies', d: "Identify employee gaps, mismatched data, and the red flag behavior might cause the company's reputation in the future.", color: '#dd8d88' },
              { icon: 'fa-star-half-stroke', title: 'Employee Trust Score', d: 'Measure the credibility of an employee with a structured trust score based on a varied history.', color: '#496279' },
              { icon: 'fa-shield-heart', title: 'Reduce Hiring Risk', d: 'Protect your company from uncertainty, fraud, and misrepresentation that strengthens hiring confidence.', color: '#4c8051' },
              { icon: 'fa-bolt', title: 'Hire Faster, Hire Smarter', d: 'Convert insight into instant and trusted decisions, simplify screening.', color: '#dd8d88' },
              { icon: 'fa-users-gear', title: 'Build a Trusted Workforce', d: 'Stronger team trust helps to build transparency and accountability by hiring professionals.', color: '#496279' }
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-white border border-slate-100 hover:border-[#496279] transition-all duration-300 animate-on-scroll hover:shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
                <div className="w-12 h-12 mb-8 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:bg-[#496279] group-hover:text-white" style={{ backgroundColor: `${f.color}10`, color: f.color }}>
                  <i className={`fas ${f.icon} text-lg`}></i>
                </div>
                <h3 className="text-lg font-black text-[#496279] mb-4 tracking-tight">{f.title}</h3>
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
            <h2 className="text-4xl md:text-5xl font-black text-[#496279] tracking-tighter mb-6">How MyHire Shield Works?</h2>
            <div className="w-16 h-1.5 bg-[#4c8051] mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            {[
              { step: 'Level 1', title: 'Integration', color: '#dd8d88', d: 'Integrate direct HR-verified data of the employee to the portal MyHireShield by the Employer.' },
              { step: 'Level 2', title: 'Verification', color: '#4c8051', d: 'Uploaded data goes under a multi-layer verification process to identify employee year gap, credibility, and inconsistencies.' },
              { step: 'Level 3', title: 'Finalization', color: '#496279', d: 'Once the verification is complete, the data is turned into a structured employee trust score and actionable hiring insights.' }
            ].map((s, i) => (
              <div key={i} className="group text-center animate-on-scroll">
                <p className="text-xs font-black tracking-[0.4em] mb-8" style={{ color: s.color }}>{s.step}</p>
                <div className="relative w-24 h-24 mx-auto mb-10">
                  <div className="absolute inset-0 border-2 border-dashed border-slate-200 rounded-full group-hover:rotate-45 transition-transform duration-1000"></div>
                  <div className="absolute inset-2 bg-white border border-slate-100 rounded-full shadow-lg flex items-center justify-center text-xl font-black text-[#496279]">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-black text-[#496279] mb-4 tracking-tight">{s.title}</h3>
                <p className="text-slate-500 text-sm font-bold leading-relaxed max-w-[280px] mx-auto tracking-wide opacity-70">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-[#fcfaf9]">
        <div className="container mx-auto px-5 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-black text-[#496279] mb-12 text-center">Common Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How does My Hireshield help in hiring decisions?", a: "My Hireshield helps in hiring decisions by offering Hr-verified data, insight, tenure, and other relevant information required by a recruiter that is beyond resumes and traditional background checks." },
              { q: "What kind of employee information does My Hireshield provide?", a: "Information mainly required by the recruiter, such as identity, employment history, education, last company role & responsibilities, criminal records, and references provided by My Hireshield. This information helps recruiters to hire the appropriate person for the company." },
              { q: "What is Employee Trust Score?", a: "According to MyHireshield, the employee trust score is >60. This score shows that the employee is credible." },
              { q: "How long does the verification process take?", a: "At MyHire Shield ths verification process takes <2 min to gather the right and authentic data after submitting the employee's details, such as the employee's name and DOB." },
              { q: "Why should employers use My Hireshield?", a: "To hire credible and trustworthy employees for their company, employers must use MyHireShield." },
              { q: "How is an employee's history collected by the My Hiresheild?", a: "An employee’s history is collected through the HR-verified employer records, especially from the official database. This is a reliable & structured data history that helps with accurate hiring decisions." },
              { q: "What does the employee trust reflect?", a: "Via credibility score on the basis of the employee background history, consistency records, and HR-validation the employee trust score reflects." },
              { q: "How does My Hireshield ensure fairness?", a: "By using a standardized verification procedure, consent-based data collection, an unbiased trust score, and HR-verified data assure every candidate is evaluated transparently." },
              { q: "Can My Hireshield identify fake experience or inconsistencies?", a: "Yes, My Hireshield is a structured & high-tech platform that easily identifies fake experiences or inconsistencies by thoroughly checking employment records and helps in making trustworthy hiring decisions." },
              { q: "Can I view or request my employment data?", a: "Yes, of course. If you are an employee and want to check your employment data and score, you can easily do so from My Hireshield. You need to put your name and DOB, and you will get your score and data in front of you." }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden animate-on-scroll">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                >
                  <span className="font-black text-[#496279] text-sm tracking-tight pr-4">{faq.q}</span>
                  <i className={`fas fa-chevron-down text-[#dd8d88] text-xs transition-transform duration-300 flex-shrink-0 ${activeFaq === idx ? 'rotate-180' : ''}`}></i>
                </button>
                <div className={`grid transition-all duration-300 ease-in-out ${activeFaq === idx ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 text-slate-500 text-sm font-bold leading-relaxed border-t border-slate-50 pt-4">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-5 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="relative bg-[#496279] rounded-[1.5rem] sm:rounded-[2.5rem] p-8 sm:p-12 md:p-24 text-center overflow-hidden border-4 sm:border-[12px] border-slate-50 shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="relative z-10 animate-on-scroll">
              <h2 className="text-3xl sm:text-4xl md:text-7xl font-black text-white mb-6 sm:mb-8 tracking-tighter leading-none">
                Hire Faster. <br /> Check Easier.
              </h2>
              <p className="text-white/60 text-base md:text-lg mb-12 max-w-xl mx-auto font-black tracking-[0.2em]">
                Simplified hiring for everyone.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register/company" className="px-12 py-5 bg-[#4c8051] text-white rounded-xl font-black text-xs tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all active:scale-95">Get Started</Link>
                <a href="mailto:ukibsdeveloper786@gmail.com" className="px-12 py-5 border-2 border-white/20 text-white rounded-xl font-black text-xs tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95">Contact Us</a>
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