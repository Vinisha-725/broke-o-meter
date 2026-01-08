
import React from 'react';

const CalendarTab: React.FC = () => {
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  const today = date.getDate();

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, date.getMonth(), 1).getDay();
  
  const daysInMonth = getDaysInMonth(date.getMonth(), year);
  const days = [];
  
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="flex justify-between items-end mb-4 px-2">
        <div>
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Budget Cycle</p>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{month}</h2>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-300 uppercase block mb-1">Today</span>
          <p className="text-2xl font-bold text-orange-300 leading-none">{today}</p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-50">
        <div className="grid grid-cols-7 mb-6 text-center">
          {weekDays.map((d, i) => (
            <div key={i} className="text-[10px] font-bold text-slate-200 uppercase">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-3 text-center">
          {days.map((day, idx) => (
            <div 
              key={idx} 
              className={`h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                day === today 
                  ? 'bg-blue-300 text-white shadow-md shadow-blue-100 scale-110' 
                  : day === null 
                    ? 'text-transparent' 
                    : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100/50 flex items-center gap-6">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">📅</div>
        <div>
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Notice</p>
          <p className="text-sm font-bold text-slate-600">Audit happens in 12 days.</p>
        </div>
      </div>
    </div>
  );
};

export default CalendarTab;
