import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '',
    dateOfBirth: '', 
    gender: 'male', // Default value set to avoid empty selection
    designation: '', 
    department: 'General' // Added default for validation safety
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      /**
       * BACKEND SYNC LOGIC:
       * 1. Backend ko 'password' chahiye -> Hum DOB ko (YYYYMMDD) format mein use karenge.
       * 2. Backend ko 'address' object chahiye -> Hum default values bhejenge.
       * 3. Name ko trim aur uppercase karenge Consistency ke liye.
       */
      const payload = {
        ...formData,
        firstName: formData.firstName.trim().toUpperCase(),
        lastName: formData.lastName.trim().toUpperCase(),
        password: formData.dateOfBirth.replace(/-/g, ""), // e.g., 1995-05-20 becomes 19950520
        confirmPassword: formData.dateOfBirth.replace(/-/g, ""),
        phone: formData.phone || "0000000000", // Phone validation safety
        address: {
          street: 'Registered by Company',
          city: 'Pending Update',
          state: 'Pending Update',
          country: 'India',
          pincode: '000000'
        }
      };

      // Exact Backend Route: /api/auth/register/employee
      const res = await axios.post('/api/auth/register/employee', payload); 
      
      if (res.data.success) {
        alert("Employee Node Created Successfully! ✅\nDefault Password: " + payload.password);
        navigate('/dashboard/company');
      }
    } catch (err) {
      // Backend validation error extract karne ka logic
      const errorMessage = err.response?.data?.errors 
        ? err.response.data.errors.map(e => e.msg).join(", ") 
        : err.response?.data?.message || "Node Creation Failed";
        
      alert("Validation Error: " + errorMessage);
      console.error("Protocol Sync Details:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

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
            <input type="text" placeholder="First Name (Aadhar)" className="p-4 bg-slate-50 rounded-xl border-none font-bold outline-none focus:ring-2 ring-[#4c8051]/20" onChange={(e)=>setFormData({...formData, firstName: e.target.value})} required />
            <input type="text" placeholder="Last Name" className="p-4 bg-slate-50 rounded-xl border-none font-bold outline-none focus:ring-2 ring-[#4c8051]/20" onChange={(e)=>setFormData({...formData, lastName: e.target.value})} required />
            <input type="email" placeholder="Official Email" className="p-4 bg-slate-50 rounded-xl border-none font-bold col-span-2 outline-none focus:ring-2 ring-[#4c8051]/20" onChange={(e)=>setFormData({...formData, email: e.target.value})} required />
            
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Date of Birth</label>
              <input type="date" className="p-4 bg-slate-50 rounded-xl border-none font-bold text-[#496279] outline-none focus:ring-2 ring-[#4c8051]/20" onChange={(e)=>setFormData({...formData, dateOfBirth: e.target.value})} required />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Gender Node</label>
              <select className="p-4 bg-slate-50 rounded-xl border-none font-bold text-[#496279] outline-none focus:ring-2 ring-[#4c8051]/20" value={formData.gender} onChange={(e)=>setFormData({...formData, gender: e.target.value})}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <input type="text" placeholder="Designation" className="p-4 bg-slate-50 rounded-xl border-none font-bold col-span-2 outline-none focus:ring-2 ring-[#4c8051]/20" onChange={(e)=>setFormData({...formData, designation: e.target.value})} required />
            
            <button type="submit" disabled={loading} className="col-span-2 bg-[#496279] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#3a4e61] transition-all shadow-xl active:scale-95 disabled:opacity-50">
              {loading ? "Synchronizing Node..." : "Deploy Employee Node"}
            </button>
          </form>
          <p className="text-[9px] font-bold text-slate-300 uppercase mt-6 text-center tracking-widest italic">
            * Default password will be set as DOB (YYYYMMDD)
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddEmployee;