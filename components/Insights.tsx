
import React, { useState, useEffect } from 'react';
import { Expense, UserBudget } from '../types';
import { generateInsights } from '../services/geminiService';

interface InsightsProps {
  expenses: Expense[];
  budget: UserBudget;
}

const Insights: React.FC<InsightsProps> = ({ expenses, budget }) => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    const now = new Date();
    const monthYear = now.toLocaleString('default', { month: 'long', year: 'numeric' });
    const result = await generateInsights(expenses, budget, monthYear);
    setInsights(result || "Something went wrong.");
    setLoading(false);
  };

  useEffect(() => {
    fetchInsights();
  }, [expenses.length]);

  const renderInsights = (text: string) => {
    const sections = text.split('###').filter(s => s.trim());
    return sections.map((section, idx) => {
      const [title, ...content] = section.split('\n');
      return (
        <div key={idx} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-blue-50 mb-8 animate-slideIn">
          <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4 border-b border-blue-50 pb-3">{title.trim()}</h3>
          <div className="text-slate-600 text-sm leading-relaxed space-y-3 whitespace-pre-line font-medium">
            {content.join('\n').trim()}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-8 px-2">
        <h2 className="text-2xl font-bold text-slate-800">Support AI</h2>
        <button 
            onClick={fetchInsights} 
            disabled={loading}
            className="text-[10px] font-bold text-blue-400 bg-blue-50 px-5 py-2.5 rounded-full uppercase tracking-widest"
        >
            {loading ? 'Thinking...' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="h-40 bg-blue-50/50 rounded-[2.5rem] animate-pulse" />
          <div className="h-40 bg-blue-50/50 rounded-[2.5rem] animate-pulse" />
        </div>
      ) : insights ? (
        <div className="pb-16">
          {renderInsights(insights)}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-300 font-bold uppercase text-[10px] tracking-widest">
          AI Tips Loading...
        </div>
      )}
    </div>
  );
};

export default Insights;
