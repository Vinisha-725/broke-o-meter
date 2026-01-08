
import React from 'react';
import { Expense, UserBudget } from '../types';

interface DashboardProps {
  expenses: Expense[];
  budget: UserBudget;
  onAddClick: () => void;
  onSetBudget: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ expenses, budget, onAddClick, onSetBudget }) => {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  const today = new Date();
  const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)));
  firstDayOfWeek.setHours(0, 0, 0, 0);
  
  const weeklySpent = expenses
    .filter(e => new Date(e.date) >= firstDayOfWeek)
    .reduce((sum, e) => sum + e.amount, 0);

  const monthlyRemaining = budget.monthlyLimit - totalSpent;
  const weeklyRemaining = budget.weeklyLimit - weeklySpent;

  const monthlyPercent = budget.monthlyLimit > 0 ? Math.min((totalSpent / budget.monthlyLimit) * 100, 100) : 0;
  const weeklyPercent = budget.weeklyLimit > 0 ? Math.min((weeklySpent / budget.weeklyLimit) * 100, 100) : 0;

  const isLowBalance = monthlyRemaining <= 500 && monthlyRemaining > 0;
  const isBroke = monthlyRemaining <= 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Low Balance Alert */}
      {(isLowBalance || isBroke) && (
        <div className={`rounded-full px-6 py-4 flex items-center gap-4 animate-slideUp border shadow-sm ${isBroke ? 'bg-slate-700 border-slate-600 text-white' : 'bg-orange-50 border-orange-100 text-orange-600'}`}>
            <span className="text-2xl">{isBroke ? '💀' : '😰'}</span>
            <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest">Danger Zone</p>
                <p className="text-xs font-bold">
                    {isBroke ? "We are officially flat broke." : "Survival funds dangerously low!"}
                </p>
            </div>
            {isLowBalance && <span className="font-bold">₹{Math.round(monthlyRemaining)}</span>}
        </div>
      )}

      {/* The broke-o-meter Card */}
      <div className="broke-o-gradient rounded-[3rem] p-10 shadow-[0_20px_50px_-10px_rgba(255,203,186,0.6)] relative overflow-hidden">
        <div className="absolute top-[-20px] left-[-20px] w-24 h-24 bg-white/20 rounded-full blur-xl" />
        
        <div className="relative z-10 text-center">
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.3em] mb-2">Survival Funds</p>
            <h2 className="text-5xl font-bold text-slate-800 tracking-tight">
                ₹{monthlyRemaining.toLocaleString('en-IN')}
            </h2>
            
            <div className="mt-8 space-y-4">
                <div className="w-full bg-white/40 h-3 rounded-full overflow-hidden p-1 backdrop-blur-sm">
                    <div 
                        className={`h-full transition-all duration-1000 ease-out rounded-full ${monthlyPercent > 90 ? 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]' : 'bg-orange-300'}`}
                        style={{ width: `${monthlyPercent}%` }}
                    />
                </div>
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">the broke-o-meter</span>
                  <span className="text-xs font-bold text-orange-500">{Math.round(monthlyPercent)}% full</span>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
          <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-orange-50 flex flex-col justify-between">
            <div>
                <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-2">Weekly Left</p>
                <h2 className="text-2xl font-bold text-slate-800">
                    ₹{weeklyRemaining.toLocaleString('en-IN')}
                </h2>
            </div>
            <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 bg-slate-50 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-200" style={{ width: `${weeklyPercent}%` }} />
                </div>
            </div>
          </div>

          <button 
            onClick={onSetBudget}
            className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-100 flex flex-col justify-between text-left group hover:bg-yellow-50 transition-all active:scale-95"
          >
            <span className="text-[10px] font-bold text-slate-300 uppercase">Goals</span>
            <div className="flex items-center justify-between mt-auto">
                <span className="font-bold text-slate-600 text-sm">Change</span>
                <span className="text-orange-200 group-hover:text-orange-400 transition-all">→</span>
            </div>
          </button>
      </div>

      {/* Main Action */}
      <div 
        className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-orange-100/50 flex items-center justify-between group cursor-pointer hover:shadow-md transition-all active:scale-[0.98]" 
        onClick={onAddClick}
      >
        <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                👛
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-700">Spent something?</h3>
                <p className="text-xs text-slate-400 font-medium">Click to track it!</p>
            </div>
        </div>
        <span className="text-orange-200 text-2xl group-hover:translate-x-1 transition-all">→</span>
      </div>

      <div className="p-6 bg-yellow-50 rounded-[2rem] border border-yellow-100/50 flex gap-4 items-center">
          <span className="text-2xl">🧸</span>
          <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
            {isLowBalance 
              ? "We need to eat Maggi for a few days to fix this balance situation."
              : "You're doing great! Even tracking small snacks helps us stay on top of our game."}
          </p>
      </div>
    </div>
  );
};

export default Dashboard;
