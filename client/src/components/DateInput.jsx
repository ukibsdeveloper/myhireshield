import React, { useState, useEffect } from 'react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DateInput = ({ value, onChange, required = false, className = '', label, id }) => {
  // Local state taaki user selection lock na ho
  const [localDate, setLocalDate] = useState({ day: '', month: '', year: '' });

  // Jab bahar se value aaye (initial load), local state update karein
  useEffect(() => {
    if (value && value.length === 10) {
      const [y, m, d] = value.split('-');
      setLocalDate({
        year: y,
        month: String(parseInt(m, 10)),
        day: String(parseInt(d, 10))
      });
    }
  }, [value]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const daysInMonth = (m, y) => {
    if (!m || !y) return 31;
    return new Date(parseInt(y, 10), parseInt(m, 10), 0).getDate();
  };

  const updateDate = (type, val) => {
    const newDate = { ...localDate, [type]: val };
    setLocalDate(newDate);

    // Agar teeno values hain, toh hi parent ko YYYY-MM-DD format mein bhejo
    if (newDate.day && newDate.month && newDate.year) {
      const iso = `${newDate.year}-${newDate.month.padStart(2, '0')}-${newDate.day.padStart(2, '0')}`;
      onChange(iso);
    } else {
      onChange(''); // Adhoori date pe parent state khali rakho
    }
  };

  const inputClass = "flex-1 min-w-0 px-3 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4c8051] focus:border-transparent outline-none font-medium text-[#496279] shadow-sm";

  const daysCount = daysInMonth(localDate.month, localDate.year);
  const days = Array.from({ length: daysCount }, (_, i) => i + 1);

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-black text-slate-400 tracking-widest mb-2 ml-1">
          {label} {required && '*'}
        </label>
      )}
      <div className="flex gap-2">
        <select value={localDate.day} onChange={(e) => updateDate('day', e.target.value)} className={inputClass} required={required}>
          <option value="">DD</option>
          {days.map(d => <option key={d} value={d}>{String(d).padStart(2, '0')}</option>)}
        </select>

        <select value={localDate.month} onChange={(e) => updateDate('month', e.target.value)} className={inputClass} required={required}>
          <option value="">MM</option>
          {MONTHS.map((name, i) => <option key={name} value={i + 1}>{String(i + 1).padStart(2, '0')} - {name}</option>)}
        </select>

        <select value={localDate.year} onChange={(e) => updateDate('year', e.target.value)} className={inputClass} required={required}>
          <option value="">YYYY</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
    </div>
  );
};

export default DateInput;