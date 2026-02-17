import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageMeta from '../components/PageMeta';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/20 font-sans antialiased text-[#496279] overflow-x-hidden">
            <PageMeta title="Page not found" noIndex />
            <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <Navbar scrolled={true} isAuthenticated={false} />

            <div className="container mx-auto px-4 sm:px-6 py-40 flex flex-col items-center justify-center text-center">
                <div className="relative mb-20 animate-in fade-in zoom-in duration-1000">
                    <h1 className="text-[15rem] md:text-[25rem] font-black tracking-tighter leading-none opacity-[0.03] select-none">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-40 h-40 bg-[#dd8d88] blur-[100px] opacity-20 animate-pulse"></div>
                        <div className="relative z-10 space-y-8">
                            <div className="inline-flex items-center gap-4 px-6 py-3 bg-white border border-slate-100 rounded-full text-xs font-black tracking-[0.4em] shadow-2xl uppercase">
                                <i className="fas fa-unlink text-[#dd8d88]"></i>
                                Broken Link
                            </div>
                            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-tight uppercase">Page Not <span className="text-[#dd8d88]">Found.</span></h2>
                        </div>
                    </div>
                </div>

                <p className="max-w-xl text-slate-400 font-bold text-sm tracking-[0.2em] leading-relaxed mb-16 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                    The page you are looking for has been moved or does not exist. Please check the URL or return to the main dashboard.
                </p>

                <Link to="/" className="group relative px-12 py-6 bg-[#496279] text-white rounded-[2.5rem] font-black text-xs tracking-[0.4em] shadow-2xl hover:bg-[#4c8051] transition-all overflow-hidden animate-in slide-in-from-bottom-12 duration-1000 delay-500">
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    <span className="relative z-10 flex items-center gap-4">
                        Back to Home
                        <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
                    </span>
                </Link>
            </div>

            <Footer />



        </div>
    );
};

export default NotFound;
