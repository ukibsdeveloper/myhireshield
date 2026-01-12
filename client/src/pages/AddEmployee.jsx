import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '', // Ab yahan real number aayega
    dateOfBirth: '', 
    gender: 'male',
    designation: '', 
    department: 'General'
  });

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    // 1. Phone number validation (6-9 se shuru aur exactly 10 digits)
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
        return alert("Error: Indian phone number must start with 6-9 and be exactly 10 digits.");
    }

    // 2. Age check (Frontend safety)
    const birthDate = new Date(formData.dateOfBirth);
    const age = (new Date() - birthDate) / (1000 * 60 * 60 * 24 * 365.25);
    if (age < 18) {
        return alert("Error: Employee must be at least 18 years old.");
    }

    const cleanDOB = formData.dateOfBirth.replace(/-/g, ""); // YYYYMMDD for password

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: cleanDOB,
      confirmPassword: cleanDOB,
      dateOfBirth: formData.dateOfBirth, // YYYY-MM-DD format strictly
      gender: formData.gender.toLowerCase(), // female/male strictly lowercase
      phone: String(formData.phone).trim(),
      // Backend expects these as top-level fields
      city: 'Delhi',
      state: 'Delhi', 
      pincode: '110001'
    };

    const res = await api.post('/auth/register/employee', payload); 

    // Success check based on status code 201
    if (res.status === 201 || res.status === 200 || res.data.success) {
      alert("Employee Node Created Successfully! ✅");
      navigate('/dashboard/company');
    }

  } catch (err) {
    const backendErrors = err.response?.data?.errors;
    if (backendErrors && backendErrors.length > 0) {
      // Isse alert mein exact field ka naam aur error message dikhega
      alert(`Validation Failed: ${backendErrors[0].field} - ${backendErrors[0].message}`);
    } else {
      alert("Registration Error: " + (err.response?.data?.message || "Check your inputs"));
    }
  } finally {
    setLoading(false);
  }
};

  const inputClass = "p-4 bg-slate-50 rounded-xl border-none font-bold outline-none focus:ring-2 ring-[#4c8051]/20";

  return (
    <div className="min-h-screen bg-[#fcfaf9]">
      <Navbar scrolled={true} isAuthenticated={true} />
      <div className="container mx-auto px-6 pt-32 pb-20 max-w-3xl">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-50">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 bg-[#496279] rounded-2xl flex items-center justify-center text-white shadow-lg">
               <i className="fas fa-user-plus"></i>
            </div>
            <h2 className="text-3xl font-black text-[#496279] uppercase tracking-tighter">Register New Node</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <input type="text" placeholder="First Name" className={inputClass} onChange={(e)=>setFormData({...formData, firstName: e.target.value})} required />
            <input type="text" placeholder="Last Name" className={inputClass} onChange={(e)=>setFormData({...formData, lastName: e.target.value})} required />
            <input type="email" placeholder="Official Email" className={`${inputClass} col-span-2`} onChange={(e)=>setFormData({...formData, email: e.target.value})} required />
            
            {/* Added Phone Input Field */}
            <input type="tel" placeholder="Phone Number (10 Digits)" className={`${inputClass} col-span-2`} onChange={(e)=>setFormData({...formData, phone: e.target.value})} required maxLength="10" />
            
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Date of Birth</label>
              <input type="date" className={inputClass} onChange={(e)=>setFormData({...formData, dateOfBirth: e.target.value})} required />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Gender Node</label>
              <select className={inputClass} value={formData.gender} onChange={(e)=>setFormData({...formData, gender: e.target.value})}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <input type="text" placeholder="Designation" className={`${inputClass} col-span-2`} onChange={(e)=>setFormData({...formData, designation: e.target.value})} required />
            
            <button type="submit" disabled={loading} className="col-span-2 bg-[#496279] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#3a4e61] transition-all shadow-xl active:scale-95 disabled:opacity-50">
              {loading ? "Synchronizing Node..." : "Deploy Employee Node"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddEmployee;