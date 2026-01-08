
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileProps {
  user: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogin, onLogout }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && username.trim()) {
      onLogin({ 
        name: name.trim(), 
        username: username.trim() 
      });
    }
  };

  if (user) {
    return (
      <div className="animate-fadeIn space-y-8">
        <h2 className="text-2xl font-bold text-slate-800 px-2 tracking-tight">Your Space</h2>
        <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-orange-100 text-center">
          <div className="w-24 h-24 bg-orange-100 text-orange-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">🐨</div>
          <h3 className="text-2xl font-bold text-slate-800">{user.name}</h3>
          <p className="text-orange-400 font-bold text-[10px] uppercase tracking-widest mt-2">@{user.username}</p>
          
          <div className="mt-10 pt-10 border-t border-slate-50 space-y-6 text-left">
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Wallet Status</span>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-50 px-4 py-1.5 rounded-full uppercase">Healthyish</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="w-full bg-slate-100 text-slate-400 py-5 rounded-full font-bold hover:bg-slate-200 transition-all text-xs uppercase tracking-widest"
        >
          LOG OUT
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="text-center mb-10 pt-6">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">🐨</div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Who are you?</h2>
        <p className="text-slate-400 text-sm font-medium mt-2">Create an account to see the broke-o-meter.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <label className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block mb-2">Full Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent border-b border-slate-50 p-2 text-sm outline-none focus:border-orange-300"
            placeholder="E.g. Broke Student"
            required
          />
        </div>
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <label className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block mb-2">Secret Alias</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-transparent border-b border-slate-50 p-2 text-sm outline-none focus:border-orange-300"
            placeholder="Username"
            required
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-orange-300 text-white font-bold py-5 rounded-full shadow-lg shadow-orange-100 hover:bg-orange-400 transition-all mt-6 tracking-widest"
        >
          CREATE ACCOUNT ✨
        </button>
      </form>
    </div>
  );
};

export default Profile;
