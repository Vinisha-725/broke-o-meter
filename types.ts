
export enum Category {
  Food = 'Food',
  Transport = 'Transport',
  Study = 'Study',
  Entertainment = 'Entertainment',
  Personal = 'Personal',
  Misc = 'Misc'
}

export interface Expense {
  id: string;
  date: string;
  category: Category;
  amount: number;
  paymentMethod: string;
  notes: string;
}

export interface WeeklyBudget {
  weekStart: string; // ISO date string of Monday
  limit: number;
  spent: number;
  saved: number;
}

export interface UserBudget {
  monthlyLimit: number;
  weeklyLimit: number;
  savings: number;
  weeklyBudgets: WeeklyBudget[];
  currentWeekStart: string; // ISO date string of current Monday
}

export interface UserProfile {
  name: string;
  username: string;
  password?: string;
}

export type Tab = 'dashboard' | 'history' | 'insights' | 'settings' | 'calendar' | 'profile' | 'savings';
