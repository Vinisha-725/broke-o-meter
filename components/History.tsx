
import React from 'react';
import { Expense } from '../types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../constants';

interface HistoryProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const History: React.FC<HistoryProps> = ({ expenses, onDelete }) => {
  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  if (expenses.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-fadeIn">
        <div className="text-6xl mb-6 floating">☁️</div>
        <p className="text-slate-400 font-bold tracking-tight text-lg">Empty for now!</p>
        <p className="text-slate-300 text-sm mt-2">Start spending to see records.</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn pb-16">
      <div className="flex justify-between items-center mb-8 px-2">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Activity</h2>
        <span className="text-[10px] font-bold text-orange-400 bg-orange-50 px-4 py-2 rounded-full uppercase">Past Spends</span>
      </div>
      
      <div className="space-y-4">
        {expenses.map((expense) => (
          <div key={expense.id} className="bg-white rounded-full p-4 pl-4 pr-6 flex items-center gap-5 shadow-sm border border-slate-50 hover:shadow-md transition-all group">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${CATEGORY_COLORS[expense.category]}`}>
              {CATEGORY_ICONS[expense.category]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="font-bold text-slate-700 truncate text-sm">{expense.notes || expense.category}</p>
                <p className="font-bold text-slate-800">₹{expense.amount.toLocaleString('en-IN')}</p>
              </div>
              <div className="flex justify-between items-center mt-0.5">
                <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">{formatDate(expense.date)} • {expense.paymentMethod}</p>
                <button 
                    onClick={() => onDelete(expense.id)}
                    className="text-[9px] font-bold text-slate-200 hover:text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest"
                >
                    delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
