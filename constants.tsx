
import React from 'react';
import { Category } from './types';

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.Food]: 'bg-orange-50 text-orange-400',
  [Category.Transport]: 'bg-blue-50 text-blue-400',
  [Category.Study]: 'bg-yellow-50 text-yellow-500',
  [Category.Entertainment]: 'bg-purple-50 text-purple-400',
  [Category.Personal]: 'bg-pink-50 text-pink-400',
  [Category.Misc]: 'bg-slate-100 text-slate-400',
};

export const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  [Category.Food]: <span className="text-xl">🍔</span>,
  [Category.Transport]: <span className="text-xl">🚗</span>,
  [Category.Study]: <span className="text-xl">📚</span>,
  [Category.Entertainment]: <span className="text-xl">🎮</span>,
  [Category.Personal]: <span className="text-xl">💅</span>,
  [Category.Misc]: <span className="text-xl">✨</span>,
};
