import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ scrolled }) => {
  const { isAuthenticated, user, logout } = useAuth(); // Context se values li hain
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  }, [location]);

  const toggleMenu = () => {
    const nextState = !isMobileMenuOpen;
    setIsMobileMenuOpen(nextState);
    document.body.style.overflow = nextState ? 'hidden' : 'unset';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Top Header */}
      <div className={`fixed w-full z-[110] transition-all duration-500 px-4 md:px-6 ${
        scrolled ? 'top-2 md:top-4' : 'top-0'
      }`}>
        <nav className={`mx-auto max-w-7xl transition-all duration-500 rounded-xl md:rounded-2xl ${
          scrolled 
            ? 'bg-white/90 backdrop-blur-xl shadow-lg border border-slate-100 py-2.5 md:py-3 px-5 md:px-8' 
            : 'bg-transparent py-5 md:py-6 px-4'
        }`}>
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 md:gap-3 z-[120]">
              <div className="h-8 w-8 md:h-10 md:w-10 bg-[#496279] rounded-xl flex items-center justify-center shadow-lg transition-transform hover:rotate-6">
                <i className="fas fa-shield-halved text-white text-lg"></i>
              </div>
              <div className="flex flex-col leading-none">
                <span className={`text-lg md:text-xl font-black transition-colors duration-500 ${isMobileMenuOpen ? 'text-white' : 'text-[#496279]'}`}>
                  Hire<span className={isMobileMenuOpen ? 'text-white/80' : 'text-[#4c8051]'}>Shield</span>
                </span>
                <span className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-[#dd8d88]">Integrity Bureau</span>
              </div>
            </Link>

            {/* Desktop Nav - SMART LOGIC */}
            <div className="hidden md:flex items-center bg-[#496279]/5 rounded-full px-1.5 py-1 border border-[#496279]/5">
              {isHomePage ? (
                <>
                  {['Features', 'Process'].map((item) => (
                    <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-[#496279]/70 hover:text-[#496279] transition-all hover:bg-white rounded-full">
                      {item}
                    </a>
                  ))}
                </>
              ) : (
                <Link to="/" className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-[#496279]/70 hover:text-[#496279] transition-all hover:bg-white rounded-full">
                  <i className="fas fa-arrow-left mr-2"></i> Home
                </Link>
              )}
            </div>

            {/* Right Side Buttons - Role Based Logic */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-4">
                {isAuthenticated ? (
                  <>
                    <Link 
                      to={user?.role === 'company' ? "/dashboard/company" : "/dashboard/employee"} 
                      className="px-6 py-2.5 bg-[#496279] text-white text-[11px] font-black uppercase tracking-widest rounded-xl active:scale-95 transition-all shadow-lg shadow-[#496279]/20"
                    >
                      Terminal
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-[11px] font-black uppercase tracking-widest text-[#496279] px-2 hover:text-[#4c8051] transition-colors">Log In</Link>
                    <Link to="/register/company" className="px-6 py-2.5 bg-[#4c8051] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#4c8051]/20 active:scale-95 transition-all">Get Started</Link>
                  </>
                )}
              </div>
              
              {/* Mobile Burger */}
              <button onClick={toggleMenu} className="md:hidden relative z-[120] w-10 h-10 flex items-center justify-center bg-white/80 rounded-lg border border-slate-200 shadow-sm">
                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-[#496279]`}></i>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* MOBILE BOTTOM TAB BAR - Dynamic for Auth User */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-[110]">
        <div className="bg-[#496279]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] px-6 py-3 flex justify-between items-center text-white">
          <Link to="/" className={`flex flex-col items-center gap-1 ${isHomePage ? 'text-[#4c8051]' : 'opacity-60'}`}>
            <i className="fas fa-home text-lg"></i>
            <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
          </Link>
          
          <Link to={isAuthenticated ? (user?.role === 'company' ? "/dashboard/company" : "/dashboard/employee") : "/login"} className="flex flex-col items-center gap-1 opacity-60">
            <i className="fas fa-th-large text-lg"></i>
            <span className="text-[8px] font-black uppercase tracking-widest">Panel</span>
          </Link>

          <div className="relative -top-8">
             <Link to="/register/company" className="w-14 h-14 bg-[#4c8051] rounded-full border-4 border-[#fcfaf9] shadow-[0_10px_20px_rgba(76,128,81,0.4)] flex items-center justify-center text-white scale-110 active:scale-90 transition-transform">
               <i className="fas fa-plus text-xl"></i>
             </Link>
          </div>

          <Link to="/settings" className="flex flex-col items-center gap-1 opacity-60">
            <i className="fas fa-cog text-lg"></i>
            <span className="text-[8px] font-black uppercase tracking-widest">Settings</span>
          </Link>

          {isAuthenticated ? (
            <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-rose-400">
              <i className="fas fa-sign-out-alt text-lg"></i>
              <span className="text-[8px] font-black uppercase tracking-widest">Exit</span>
            </button>
          ) : (
            <Link to="/login" className="flex flex-col items-center gap-1 opacity-60">
              <i className="fas fa-user-circle text-lg"></i>
              <span className="text-[8px] font-black uppercase tracking-widest">Login</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;