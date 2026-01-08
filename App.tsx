
import React, { useState, useEffect, useCallback } from 'react';
import { Expense, UserBudget, Tab, UserProfile, WeeklyBudget } from './types';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import History from './components/History';
import Insights from './components/Insights';
import Settings from './components/Settings';
import Profile from './components/Profile';
import CalendarTab from './components/CalendarTab';
import Savings from './components/Savings';
import Notification from './components/Notification';

const getMonday = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
};

const INITIAL_BUDGET: UserBudget = {
  monthlyLimit: 0,
  weeklyLimit: 0,
  savings: 0,
  weeklyBudgets: [],
  currentWeekStart: getMonday()
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [showAddForm, setShowAddForm] = useState(false);
  const [notification, setNotification] = useState<{message: string, id: number} | null>(null);
  
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [budget, setBudget] = useState<UserBudget>(() => {
    const saved = localStorage.getItem('budget');
    const parsed = saved ? JSON.parse(saved) : INITIAL_BUDGET;
    
    // If the saved budget doesn't have the new fields, initialize them
    if (!('savings' in parsed)) {
      return { ...INITIAL_BUDGET, ...parsed, savings: 0, weeklyBudgets: [], currentWeekStart: getMonday() };
    }
    
    // Check if we need to roll over to a new week
    const currentMonday = getMonday();
    if (parsed.currentWeekStart !== currentMonday) {
      // Calculate savings from last week if there was a weekly limit set
      if (parsed.weeklyLimit > 0 && parsed.weeklyBudgets?.length > 0) {
        const lastWeek = parsed.weeklyBudgets[parsed.weeklyBudgets.length - 1];
        if (lastWeek.weekStart !== currentMonday) {
          const weeklySavings = lastWeek.limit - lastWeek.spent;
          if (weeklySavings > 0) {
            parsed.savings = (parsed.savings || 0) + weeklySavings;
          }
        }
      }
      
      // Update to new week
      parsed.currentWeekStart = currentMonday;
    }
    
    return parsed;
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Force Onboarding Logic
  useEffect(() => {
    if (!user) {
      setActiveTab('profile');
      setShowAddForm(false);
    } else if (budget.monthlyLimit === 0 && activeTab !== 'settings') {
      setActiveTab('settings');
      setShowAddForm(false);
    } else if (user && budget.monthlyLimit > 0 && activeTab === 'profile') {
      setActiveTab('dashboard');
    }
  }, [user, budget.monthlyLimit]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('budget', JSON.stringify(budget));
  }, [budget]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const showNotification = (message: string) => {
    setNotification({ message, id: Date.now() });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: Date.now().toString() };
    setExpenses(prev => {
      const updated = [...prev, newExpense];
      showNotification(`Added ₹${expense.amount} for ${expense.category}`);
      return updated;
    });
    
    // Update weekly budget
    setBudget(prev => {
      const currentMonday = getMonday();
      const updatedWeeklyBudgets = [...(prev.weeklyBudgets || [])];
      let currentWeek = updatedWeeklyBudgets.find(w => w.weekStart === currentMonday);
      
      if (!currentWeek) {
        currentWeek = {
          weekStart: currentMonday,
          limit: prev.weeklyLimit,
          spent: 0,
          saved: 0
        };
        updatedWeeklyBudgets.push(currentWeek);
      }
      
      currentWeek.spent += expense.amount;
      
      return {
        ...prev,
        weeklyBudgets: updatedWeeklyBudgets
      };
    });
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const updateBudget = (newBudget: UserBudget) => {
    setBudget(newBudget);
  };

  const renderContent = () => {
    if (showAddForm) {
      return <ExpenseForm onAdd={handleAddExpense} onCancel={() => setShowAddForm(false)} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
                  expenses={expenses} 
                  budget={budget} 
                  onAddClick={() => setShowAddForm(true)} 
                  onSetBudget={() => setActiveTab('settings')}
                />;
      case 'history':
        return <History expenses={expenses} onDelete={deleteExpense} />;
      case 'insights':
        return <Insights expenses={expenses} budget={budget} />;
      case 'settings':
        return <Settings budget={budget} onUpdate={updateBudget} />;
      case 'calendar':
        return <CalendarTab />;
      case 'savings':
        return <Savings budget={budget} />;
      case 'history':
        return <History expenses={expenses} onDelete={deleteExpense} />;
      case 'profile':
        return <Profile user={user} onLogin={setUser} onLogout={() => setUser(null)} />;
      default:
        return <Profile user={user} onLogin={setUser} onLogout={() => setUser(null)} />;
    }
  };

  // Check if navigation should be enabled
  const navEnabled = !!user && budget.monthlyLimit > 0;

  return (
    <div className="min-h-screen max-w-md mx-auto bg-[#fdfcf8] shadow-[0_0_80px_rgba(255,203,186,0.15)] flex flex-col relative overflow-hidden border-x border-orange-50">
      {/* Decorative Blobs */}
      <div className="blob w-80 h-80 top-[-10%] right-[-20%]"></div>
      <div className="blob w-64 h-64 bottom-[10%] left-[-20%] bg-blue-100"></div>

      <header className="p-8 pb-4 text-center z-10">
        <h1 className="text-3xl font-bold text-slate-700 tracking-tight">
          broke-o-meter
        </h1>
        <p className="text-[10px] text-orange-400 font-bold uppercase tracking-[0.2em] mt-1">Track your spendings</p>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-6 pb-32 z-10 relative">
        {notification && (
          <Notification 
            key={notification.id}
            message={notification.message} 
            onClose={() => setNotification(null)} 
          />
        )}
        {renderContent()}
      </main>

      <nav className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md glass px-3 py-4 flex justify-around items-center rounded-full shadow-[0_20px_40px_rgba(255,154,139,0.1)] z-50 transition-opacity duration-300 ${!navEnabled ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        <NavButton active={activeTab === 'dashboard' && !showAddForm} onClick={() => { setActiveTab('dashboard'); setShowAddForm(false); }} icon="🏡" label="Home" />
        <NavButton active={activeTab === 'calendar'} onClick={() => { setActiveTab('calendar'); setShowAddForm(false); }} icon="📅" label="Plan" />
        
        <div className="relative mx-1">
            <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${showAddForm ? 'bg-slate-700 rotate-45' : 'bg-orange-300 shadow-orange-200/50'}`}
            >
              <span className="text-white text-3xl font-bold">+</span>
            </button>
        </div>
        
        <NavButton active={activeTab === 'history'} onClick={() => { setActiveTab('history'); setShowAddForm(false); }} icon="📜" label="History" />
        <NavButton active={activeTab === 'insights'} onClick={() => { setActiveTab('insights'); setShowAddForm(false); }} icon="✨" label="AI" />
        <NavButton active={activeTab === 'savings'} onClick={() => { setActiveTab('savings'); setShowAddForm(false); }} icon="💰" label="Savings" />
        <NavButton active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setShowAddForm(false); }} icon="�" label="Profile" />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 px-3 py-1 transition-all duration-300 ${active ? 'text-orange-400 scale-110' : 'text-slate-300'}`}
  >
    <span className="text-xl">{icon}</span>
    <span className="text-[8px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

export default App;
