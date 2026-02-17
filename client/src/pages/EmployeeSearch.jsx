import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { employeeAPI } from '../utils/api';

const EmployeeSearch = () => {
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Filter & Pagination State
  const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState('relevant'); // relevant, score-desc, score-asc
  const [displayCount, setDisplayCount] = useState(5);

  const handleSearch = async () => {
    if (!fullName.trim()) return;

    setLoading(true);
    setSearched(true);
    setDisplayCount(5); // Reset pagination on new search
    try {
      const res = await employeeAPI.search({
        query: fullName.trim().toUpperCase(),
        dob: dob || undefined
      });
      if (res?.data?.success) {
        setResults(res.data.data ?? []);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Search Error:", err);
      setResults([]);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  // Processed Results (Filtered & Sorted)
  const processedResults = useMemo(() => {
    let filtered = results.filter(emp => (emp.overallScore || 0) >= minScore);

    if (sortBy === 'score-desc') {
      filtered.sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));
    } else if (sortBy === 'score-asc') {
      filtered.sort((a, b) => (a.overallScore || 0) - (b.overallScore || 0));
    }

    return filtered;
  }, [results, minScore, sortBy]);

  const visibleResults = processedResults.slice(0, displayCount);

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/20 font-sans antialiased text-[#496279] overflow-x-hidden">
      {/* Background Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <Navbar scrolled={true} isAuthenticated={true} />

      <div className="container mx-auto px-4 sm:px-6 pt-32 pb-32 sm:pb-24 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <Breadcrumb />
          <Link to="/dashboard/company" className="group flex items-center gap-4 text-xs font-black tracking-[0.3em] text-slate-400 hover:text-[#496279] transition-all">
            <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
            Back to Dashboard
          </Link>
        </div>

        {/* TERMINAL HEADER */}
        <div className="relative mb-20">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#4c8051] opacity-[0.03] rounded-full blur-[100px]"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-slate-100 rounded-2xl text-xs font-black tracking-[0.3em] mb-8 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#4c8051] animate-pulse"></span>
              Search Active
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-6">
              Find <span className="text-[#4c8051]">People.</span>
            </h1>
            <p className="text-slate-400 font-bold text-xs tracking-[0.4em] max-w-lg leading-relaxed">
              Search our verified network to find and check employee details and work history.
            </p>
          </div>
        </div>

        {/* SCANNING TERMINAL INPUT */}
        <div className="relative max-w-4xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#4c8051]/10 via-[#496279]/10 to-[#dd8d88]/10 rounded-[4rem] blur-2xl opacity-50"></div>
          <div className="relative bg-white border border-slate-100 p-8 md:p-10 rounded-[4rem] shadow-2xl flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 w-full space-y-2">
              <label className="text-xs font-black text-slate-300 tracking-[0.3em] ml-2">Employee Name</label>
              <div className="flex items-center gap-4 px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus-within:border-[#4c8051] transition-all group">
                <i className="fas fa-search text-slate-300 group-focus-within:text-[#4c8051] transition-colors"></i>
                <input
                  type="text"
                  placeholder="Full Legal Name"
                  className="w-full bg-transparent outline-none font-black text-sm tracking-widest placeholder:text-slate-200"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            <div className="flex-1 w-full space-y-2">
              <DateInput
                label="Date of Birth"
                value={dob}
                onChange={setDob}
                required
                className="w-full bg-transparent outline-none font-black text-sm tracking-widest text-slate-400"
              />
            </div>

            <div className="md:pt-6">
              <button
                onClick={handleSearch}
                disabled={loading || !fullName.trim()}
                className="relative group bg-[#496279] text-white px-12 py-6 rounded-[2.5rem] font-black text-xs tracking-[0.4em] shadow-2xl hover:bg-[#4c8051] transition-all disabled:opacity-30 disabled:grayscale overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <span className="relative z-10 flex items-center gap-3">
                  {loading ? <i className="fas fa-circle-notch fa-spin"></i> : 'Search Now'}
                  <i className="fas fa-bolt text-[11px] opacity-50"></i>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* FILTERS TOOLBAR */}
        {results.length > 0 && (
          <div className="mb-12 flex flex-col md:flex-row gap-8 items-center justify-between p-8 bg-white border border-slate-100 rounded-[3rem] shadow-sm animate-in fade-in duration-1000">
            <div className="flex items-center gap-8 w-full md:w-auto">
              <div className="space-y-2 flex-1 md:flex-initial">
                <label className="text-[11px] font-black text-slate-300 tracking-[0.3em] ml-2">Min Score: {minScore}%</label>
                <input
                  type="range" min="0" max="100"
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  className="w-full md:w-48 h-1 bg-slate-100 rounded-full appearance-none accent-[#4c8051] cursor-pointer"
                />
              </div>
              <div className="space-y-2 flex-1 md:flex-initial">
                <label className="text-[11px] font-black text-slate-300 tracking-[0.3em] ml-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-xs font-black tracking-widest outline-none focus:border-[#4c8051]"
                >
                  <option value="relevant">Relevance</option>
                  <option value="score-desc">High Score First</option>
                  <option value="score-asc">Low Score First</option>
                </select>
              </div>
            </div>
            <div className="text-xs font-black text-slate-300 tracking-[0.2em]">
              Found {processedResults.length} Employees
            </div>
          </div>
        )}

        {/* RESULTS FEED */}
        <div className="space-y-10 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-8 opacity-40">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-t-4 border-[#4c8051] rounded-full animate-spin"></div>
              </div>
              <p className="text-xs font-black tracking-[0.5em] animate-pulse">Searching...</p>
            </div>
          ) : visibleResults.length > 0 ? (
            <div className="grid gap-8 animate-in fade-in slide-in-from-bottom-4">
              {visibleResults.map((emp, i) => (
                <div key={emp._id} className="bg-white border border-slate-100 p-8 md:p-12 rounded-[4rem] flex flex-col md:flex-row justify-between items-center group hover:shadow-2xl hover:border-[#4c8051]/20 transition-all duration-700 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 opacity-[0.02] group-hover:scale-125 transition-transform duration-1000">
                    <i className="fas fa-user-shield text-[15rem]"></i>
                  </div>

                  <div className="flex items-center gap-10 relative z-10 w-full md:w-auto mb-8 md:mb-0">
                    <div className="relative">
                      <div className="h-24 w-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-3xl font-black text-[#496279] border border-slate-100 shadow-inner group-hover:bg-[#4c8051] group-hover:text-white transition-all duration-500">
                        {emp.firstName?.charAt(0)}
                      </div>
                      <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-white rounded-xl shadow-lg flex items-center justify-center text-[#4c8051] text-xs">
                        <i className="fas fa-check-circle"></i>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <h4 className="text-3xl font-black tracking-tighter leading-none">{emp.firstName} {emp.lastName}</h4>
                        <span className="px-3 py-1 bg-[#4c8051]/5 text-[#4c8051] text-[11px] font-black rounded-lg tracking-widest">Verified</span>
                      </div>
                      <p className="text-xs font-bold text-slate-400 tracking-[0.2em]">{emp.currentDesignation || 'EMPLOYEE'}</p>
                      <div className="mt-6 flex gap-6 opacity-40">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-map-marker-alt text-[11px]"></i>
                          <span className="text-[11px] font-black tracking-widest">Identity Verified</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className="fas fa-shield-alt text-[11px]"></i>
                          <span className="text-[11px] font-black tracking-widest">Trusted Profile</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-12 relative z-10 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-300 tracking-[0.4em] mb-2">Trust Score</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black tracking-tighter text-[#496279] group-hover:text-[#4c8051] transition-colors">{emp.overallScore || '0'}</span>
                        <span className="text-base font-black opacity-20">%</span>
                      </div>
                    </div>
                    <Link to={`/employee/${emp._id}`} className="bg-[#496279] text-white px-10 py-5 rounded-[2rem] font-black text-xs tracking-[0.3em] shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all">
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}

              {processedResults.length > displayCount && (
                <div className="text-center pt-10">
                  <button
                    onClick={() => setDisplayCount(prev => prev + 5)}
                    className="bg-white border border-slate-100 px-12 py-5 rounded-3xl text-xs font-black tracking-[0.5em] text-slate-400 hover:text-[#496279] hover:border-[#496279]/20 transition-all shadow-sm"
                  >
                    Show More
                  </button>
                </div>
              )}
            </div>
          ) : searched && !loading && (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[5rem] border-2 border-dashed border-slate-100 text-center animate-in fade-in duration-1000">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-8 opacity-30">
                <i className="fas fa-user-times text-2xl"></i>
              </div>
              <h3 className="text-xl font-black tracking-tighter mb-4 opacity-50">No Results.</h3>
              <p className="text-xs font-black text-slate-400 tracking-[0.3em] max-w-xs leading-relaxed">
                No matching employees found. Please check the name or date of birth.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-bottom { from { transform: translateY(2rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        .animate-in {
          animation-duration: 0.8s;
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-8 { animation-name: slide-in-bottom; }
        .slide-in-from-bottom-4 { animation-name: slide-in-bottom; }
      `}} />
    </div>
  );
};

export default EmployeeSearch;