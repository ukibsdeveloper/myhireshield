import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    dateOfBirth: '', gender: '', designation: '', department: ''
  });

// AddEmployee.jsx ke andar changes:

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    // Exact Backend Route Match:
    const res = await axios.post('/api/auth/register/employee', formData); 
    
    if (res.data.success) {
      alert("Employee Node Created Successfully! ✅");
      navigate('/dashboard/company');
    }
  } catch (err) {
    // Backend se aane wala error message dikhayegagit
    alert(err.response?.data?.message || "Node Creation Failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#fcfaf9]">
      <Navbar scrolled={true} isAuthenticated={true} />
      <div className="container mx-auto px-6 pt-32 pb-20 max-w-3xl">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-50">
          <h2 className="text-3xl font-black text-[#496279] uppercase tracking-tighter mb-8">Register New Node</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <input type="text" placeholder="First Name" className="p-4 bg-slate-50 rounded-xl border-none font-bold" onChange={(e)=>setFormData({...formData, firstName: e.target.value})} required />
            <input type="text" placeholder="Last Name" className="p-4 bg-slate-50 rounded-xl border-none font-bold" onChange={(e)=>setFormData({...formData, lastName: e.target.value})} required />
            <input type="email" placeholder="Official Email" className="p-4 bg-slate-50 rounded-xl border-none font-bold col-span-2" onChange={(e)=>setFormData({...formData, email: e.target.value})} required />
            <input type="date" className="p-4 bg-slate-50 rounded-xl border-none font-bold text-[#496279]" onChange={(e)=>setFormData({...formData, dateOfBirth: e.target.value})} required />
            <select className="p-4 bg-slate-50 rounded-xl border-none font-bold text-[#496279]" onChange={(e)=>setFormData({...formData, gender: e.target.value})}>
              <option>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input type="text" placeholder="Designation" className="p-4 bg-slate-50 rounded-xl border-none font-bold col-span-2" onChange={(e)=>setFormData({...formData, designation: e.target.value})} required />
            <button type="submit" disabled={loading} className="col-span-2 bg-[#496279] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#3a4e61] transition-all">
              {loading ? "Initializing..." : "Deploy Employee Node"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddEmployee;