
import React, { useState } from 'react';
import { Category, Expense } from '../types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../constants';

interface ExpenseFormProps {
  onAdd: (expense: Expense) => void;
  onCancel: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAdd, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>(Category.Food);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Digital');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount))) return;

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      amount: parseFloat(amount),
      category,
      notes,
      paymentMethod,
    };

    onAdd(newExpense);
  };

  return (
    <div className="animate-slideUp">
      <div className="flex justify-between items-center mb-8 px-2">
        <h2 className="text-2xl font-bold text-slate-700 tracking-tight">Track a Spend</h2>
        <button onClick={onCancel} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Back</button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8 pb-10">
        <div className="bg-white rounded-[3rem] p-10 text-center shadow-sm border border-orange-50">
          <label className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block mb-4">How much was it? (₹)</label>
          <input
            type="number"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="bg-transparent text-6xl font-bold text-slate-800 placeholder-slate-100 outline-none w-full text-center"
            autoFocus
            required
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-5 px-4">What was it for?</label>
          <div className="grid grid-cols-3 gap-4">
            {Object.values(Category).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`flex flex-col items-center gap-2 p-5 rounded-[2rem] transition-all duration-300 ${
                  category === cat ? 'bg-orange-100 ring-2 ring-orange-200' : 'bg-white shadow-sm hover:bg-orange-50'
                }`}
              >
                <span className="text-2xl">{CATEGORY_ICONS[cat]}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50">
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-4">Payment Method</label>
                <div className="flex gap-2">
                    {['Cash', 'Card', 'UPI'].map(method => (
                        <button
                            key={method}
                            type="button"
                            onClick={() => setPaymentMethod(method)}
                            className={`flex-1 py-3 rounded-full text-xs font-bold transition-all ${
                                paymentMethod === method ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-400'
                            }`}
                        >
                            {method}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50">
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Short Note</label>
                <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="E.g. Coffee date..."
                    className="w-full bg-transparent border-b border-slate-100 p-2 text-sm outline-none focus:border-orange-300 transition-all text-slate-700"
                />
            </div>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-300 text-white font-bold py-5 rounded-full shadow-lg shadow-orange-100 hover:bg-orange-400 transition-all active:scale-95 tracking-widest"
        >
          SAVE IT! ✨
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
