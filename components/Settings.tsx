
import React, { useState } from 'react';
import { UserBudget } from '../types';

interface SettingsProps {
  budget: UserBudget;
  onUpdate: (budget: UserBudget) => void;
}

const Settings: React.FC<SettingsProps> = ({ budget, onUpdate }) => {
  const [monthly, setMonthly] = useState(budget.monthlyLimit.toString());
  const [weekly, setWeekly] = useState(budget.weeklyLimit.toString());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdate({
      monthlyLimit: parseFloat(monthly) || 0,
      weeklyLimit: parseFloat(weekly) || 0,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-fadeIn space-y-8">
      <h2 className="text-2xl font-bold text-slate-800 px-2 tracking-tight">Your Limits</h2>
      
      <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-orange-50 space-y-10">
        <div>
          <label className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block mb-4">Monthly Goal (₹)</label>
          <input 
            type="number"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
            placeholder="0"
            className="text-4xl font-bold text-slate-800 outline-none bg-transparent w-full border-b-2 border-slate-50 focus:border-orange-200 transition-all"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-4">Weekly Limit (₹)</label>
          <input 
            type="number"
            value={weekly}
            onChange={(e) => setWeekly(e.target.value)}
            placeholder="0"
            className="text-4xl font-bold text-slate-800 outline-none bg-transparent w-full border-b-2 border-slate-50 focus:border-blue-200 transition-all"
          />
        </div>
      </div>

      <button 
        onClick={handleSave}
        className={`w-full py-5 rounded-full font-bold transition-all shadow-md active:scale-95 text-xs tracking-widest ${
          saved ? 'bg-blue-400 text-white' : 'bg-slate-800 text-white hover:bg-black'
        }`}
      >
        {saved ? 'ALL SET! 🌈' : 'UPDATE LIMITS'}
      </button>

      <div className="p-8 bg-orange-50/50 rounded-[2.5rem] border border-orange-100/50 flex gap-5 items-start">
        <span className="text-2xl">🥐</span>
        <p className="text-xs text-slate-500 font-bold leading-relaxed">
          Be realistic with your goals! It's better to stay within a larger budget than to fail a tiny one.
        </p>
      </div>
    </div>
  );
};

export default Settings;
