import React from 'react';
import { UserBudget } from '../types';

interface SavingsProps {
  budget: UserBudget;
}

const Savings: React.FC<SavingsProps> = ({ budget }) => {
  const { savings, weeklyBudgets = [] } = budget;
  
  // Filter out current week's budget and sort by weekStart in descending order
  const pastBudgets = [...weeklyBudgets]
    .filter(wb => wb.weekStart !== budget.currentWeekStart)
    .sort((a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime());

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Total Savings Card */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-[2.5rem] p-8 shadow-sm border border-green-100">
        <div className="text-center">
          <p className="text-sm font-medium text-green-600 mb-2">Total Savings</p>
          <h2 className="text-4xl font-bold text-slate-800">
            ₹{savings.toLocaleString('en-IN')}
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            From {pastBudgets.length} week{pastBudgets.length !== 1 ? 's' : ''} of smart spending
          </p>
        </div>
      </div>

      {/* Weekly Savings Breakdown */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 px-2">Weekly Contributions</h3>
        <div className="space-y-3">
          {pastBudgets.length > 0 ? (
            pastBudgets.map((week) => (
              <div key={week.weekStart} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Week of {new Date(week.weekStart).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                    <p className="text-sm font-medium text-green-600">
                      +₹{week.saved.toLocaleString('en-IN')} saved
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">
                      Spent ₹{week.spent.toLocaleString('en-IN')} of ₹{week.limit.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm">No savings history yet. Start saving this week!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Savings;
