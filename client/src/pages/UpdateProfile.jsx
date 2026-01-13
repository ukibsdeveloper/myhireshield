import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import toast from 'react-hot-toast';

const UpdateProfile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    companyName: '',
    currentDesignation: '',
    bio: '',
    website: '',
    industry: '',
    address: { city: '', state: '', pincode: '', country: 'India' }
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    profileVisible: true,
    securityAlerts: true
  });

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        firstName: user.profile.firstName || '',
        lastName: user.profile.lastName || '',
        phone: user.profile.phone || '',
        companyName: user.profile.companyName || '',
        currentDesignation: user.profile.currentDesignation || '',
        bio: user.profile.bio || '',
        website: user.profile.website || '',
        industry: user.profile.industry || '',
        address: user.profile.address || { city: '', state: '', pincode: '', country: 'India' }
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSecurityChange = (e) => {
    setSecurityData({ ...securityData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Updating Profile...");
    try {
      const res = await updateProfile(formData);
      if (res.success) {
        toast.success("Profile Updated Successfully.", { id: toastId });
      } else {
        toast.error(res.error || "Update Failed.", { id: toastId });
      }
    } catch (err) {
      toast.error("Error updating profile.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }
    setLoading(true);
    const toastId = toast.loading("Updating Password...");
    try {
      const res = await changePassword({
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword
      });
      if (res.success) {
        toast.success("Password Updated Successfully.", { id: toastId });
        setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(res.error || "Incorrect password.", { id: toastId });
      }
    } catch (err) {
      toast.error("Could not update password.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:border-[#4c8051] transition-all font-black text-[11px] tracking-widest text-[#496279] shadow-sm uppercase placeholder:text-slate-300";

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/20 font-sans antialiased text-[#496279] uppercase overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <Navbar scrolled={true} isAuthenticated={true} />

      <div className="container mx-auto px-6 pt-32 pb-24 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <Breadcrumb />
          <Link to={user?.role === 'company' ? '/dashboard/company' : '/dashboard/employee'} className="group flex items-center gap-4 text-[10px] font-black tracking-[0.3em] text-slate-400 hover:text-[#496279] transition-all">
            <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
            Back to Dashboard
          </Link>
        </div>

        {/* HEADER SECTION */}
        <div className="relative mb-20">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#496279] opacity-[0.03] rounded-full blur-[100px]"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-slate-100 rounded-2xl text-[10px] font-black tracking-[0.3em] mb-8 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#496279] animate-pulse"></span>
              Profile Settings Active
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-6">
              Account <span className="text-[#496279]">Settings.</span>
            </h1>
            <p className="text-slate-400 font-bold text-xs tracking-[0.4em] max-w-lg leading-relaxed">
              Manage your personal information, security settings, and notifications here.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-12">
          {/* NAVIGATION SIDEBAR */}
          <div className="space-y-4">
            {[
              { id: 'profile', label: 'Profile Info', icon: 'fa-user' },
              { id: 'security', label: 'Security & Password', icon: 'fa-lock' },
              { id: 'preferences', label: 'Notifications', icon: 'fa-bell' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-6 p-8 rounded-[2.5rem] transition-all duration-500 border-2 ${activeTab === tab.id ? 'bg-[#496279] border-white/10 text-white shadow-2xl scale-105' : 'bg-white border-slate-100 text-slate-300 hover:border-[#496279]/20'}`}
              >
                <i className={`fas ${tab.icon} text-lg`}></i>
                <span className="text-[10px] font-black tracking-[0.3em] uppercase">{tab.label}</span>
              </button>
            ))}

            <div className="mt-12 p-10 bg-[#dd8d88]/5 border border-[#dd8d88]/10 rounded-[3rem] text-center group">
              <i className="fas fa-info-circle text-[#dd8d88] text-xl mb-4 group-hover:scale-110 transition-all"></i>
              <h4 className="text-[9px] font-black text-[#dd8d88] tracking-widest mb-2">Important Notice</h4>
              <p className="text-[8px] font-bold text-[#dd8d88]/50 normal-case leading-relaxed">Changes to your name or designation might need verification from our team.</p>
            </div>
          </div>

          {/* CONTENT TERMINAL */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-slate-100 rounded-[4rem] p-10 md:p-16 shadow-sm hover:shadow-2xl transition-all duration-700 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#496279] opacity-[0.02] rounded-full blur-[100px] -mr-40 -mt-40"></div>

              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit} className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
                  <div className="flex items-center gap-10 border-b border-slate-50 pb-12">
                    <div className="h-32 w-32 bg-slate-50 rounded-[3rem] border border-slate-100 flex items-center justify-center text-4xl font-black text-[#496279] shadow-inner relative group/avatar">
                      {user?.profile?.firstName?.charAt(0) || user?.profile?.companyName?.charAt(0)}
                      <button type="button" className="absolute inset-0 bg-[#496279]/80 text-white rounded-[3rem] opacity-0 group-hover/avatar:opacity-100 transition-all flex items-center justify-center text-[8px] font-black tracking-widest uppercase">Update Photo</button>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black tracking-tighter">Profile Picture</h3>
                      <p className="text-[9px] font-bold text-slate-300 tracking-[0.2em] normal-case">How you'll appear on the network.</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {user?.role === 'employee' ? (
                      <>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black tracking-[0.3em] text-slate-200 ml-4">First Name</label>
                          <input type="text" name="firstName" value={formData.firstName} onChange={handleProfileChange} className={inputClass} placeholder="FIRST NAME" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black tracking-[0.3em] text-slate-200 ml-4">Last Name</label>
                          <input type="text" name="lastName" value={formData.lastName} onChange={handleProfileChange} className={inputClass} placeholder="LAST NAME" />
                        </div>
                        <div className="md:col-span-2 space-y-3">
                          <label className="text-[10px] font-black tracking-[0.3em] text-slate-200 ml-4">Designation</label>
                          <input type="text" name="currentDesignation" value={formData.currentDesignation} onChange={handleProfileChange} className={inputClass} placeholder="PROFESSIONAL TITLE" />
                        </div>
                      </>
                    ) : (
                      <div className="md:col-span-2 space-y-3">
                        <label className="text-[10px] font-black tracking-[0.3em] text-slate-200 ml-4">Company Name</label>
                        <input type="text" name="companyName" value={formData.companyName} onChange={handleProfileChange} className={inputClass} placeholder="COMPANY NAME" />
                      </div>
                    )}

                    <div className="space-y-3">
                      <label className="text-[10px] font-black tracking-[0.3em] text-slate-200 ml-4">Email Address</label>
                      <input type="text" value={user?.email} disabled className={`${inputClass} bg-slate-100 cursor-not-allowed text-slate-300 border-none`} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black tracking-[0.3em] text-slate-200 ml-4">Phone Number</label>
                      <input type="text" name="phone" value={formData.phone} onChange={handleProfileChange} className={inputClass} placeholder="+XX XXXXXXXX" />
                    </div>

                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[10px] font-black tracking-[0.3em] text-slate-200 ml-4">Bio / Summary</label>
                      <textarea name="bio" value={formData.bio} onChange={handleProfileChange} className={`${inputClass} h-40 resize-none py-8`} placeholder="TELL US ABOUT YOURSELF..."></textarea>
                    </div>
                  </div>

                  <div className="pt-8">
                    <button type="submit" disabled={loading} className="w-full group bg-[#496279] text-white py-8 rounded-[2.5rem] font-black text-[11px] tracking-widest shadow-24 hover:bg-[#4c8051] transition-all relative overflow-hidden active:scale-95">
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                      <span className="relative z-10">{loading ? 'SAVING...' : 'Update Profile Info'}</span>
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'security' && (
                <form onSubmit={handleSecuritySubmit} className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
                  <div className="p-10 bg-[#496279] rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#4c8051] opacity-20 rounded-full blur-[40px] -mr-16 -mt-16"></div>
                    <h3 className="text-xl font-black tracking-tighter mb-4"><i className="fas fa-lock mr-4"></i>Change Password</h3>
                    <p className="text-[9px] font-bold text-white/40 tracking-widest normal-case leading-relaxed">Updating your password helps keep your account secure.</p>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black tracking-[0.3em] text-slate-200 ml-4">Current Password</label>
                      <input type="password" name="currentPassword" value={securityData.currentPassword} onChange={handleSecurityChange} className={inputClass} placeholder="ENTER CURRENT PASSWORD" required />
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black tracking-[0.3em] text-slate-200 ml-4">New Password</label>
                        <input type="password" name="newPassword" value={securityData.newPassword} onChange={handleSecurityChange} className={inputClass} placeholder="NEW PASSWORD" required />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black tracking-[0.3em] text-slate-200 ml-4">Confirm New Password</label>
                        <input type="password" name="confirmPassword" value={securityData.confirmPassword} onChange={handleSecurityChange} className={inputClass} placeholder="RE-ENTER NEW" required />
                      </div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <button type="submit" disabled={loading} className="w-full group bg-[#496279] text-white py-8 rounded-[2.5rem] font-black text-[11px] tracking-widest shadow-24 hover:bg-[#dd8d88] transition-all relative overflow-hidden active:scale-95">
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                      <span className="relative z-10">{loading ? 'UPDATING...' : 'Update Password'}</span>
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
                  <div className="grid gap-6">
                    {[
                      { id: 'emailNotifications', label: 'Email Neural Feed', desc: 'Critical audit alerts and trajectory updates via SMTP.', icon: 'fa-envelope-open-text' },
                      { id: 'profileVisible', label: 'Soveryeign Visibility', desc: 'Allow deep analysis of your node by authorized companies.', icon: 'fa-eye' },
                      { id: 'securityAlerts', label: 'Security Uplinks', desc: 'Real-time notifications for unauthorized access attempts.', icon: 'fa-bolt-lightning' }
                    ].map(pref => (
                      <div key={pref.id} className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 flex items-center justify-between group/pref hover:border-[#496279]/30 transition-all">
                        <div className="flex items-center gap-8">
                          <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-[#496279] shadow-sm transform group-hover/pref:rotate-12 transition-all">
                            <i className={`fas ${pref.icon}`}></i>
                          </div>
                          <div>
                            <h4 className="text-[11px] font-black tracking-[0.3em] mb-2">{pref.label}</h4>
                            <p className="text-[9px] font-bold text-slate-300 normal-case">{pref.desc}</p>
                          </div>
                        </div>
                        <div
                          onClick={() => setPreferences({ ...preferences, [pref.id]: !preferences[pref.id] })}
                          className={`w-16 h-10 rounded-full p-1.5 cursor-pointer transition-colors duration-500 ${preferences[pref.id] ? 'bg-[#4c8051]' : 'bg-slate-200'}`}
                        >
                          <div className={`h-7 w-7 bg-white rounded-full shadow-lg transition-transform duration-500 ${preferences[pref.id] ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-right { from { transform: translateX(2rem); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        
        .animate-in {
          animation-duration: 0.6s;
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        
        .fade-in { animation-name: fade-in; }
        .slide-in-from-right-8 { animation-name: slide-in-right; }
      `}} />
    </div>
  );
};

export default UpdateProfile;