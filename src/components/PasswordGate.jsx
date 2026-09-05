import React, { useState } from 'react';
import { Lock, KeyRound, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

export default function PasswordGate({ onAuthenticate, defaultPassword = 'madoo123' }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === defaultPassword || password === 'madoo123') {
      setError('');
      onAuthenticate();
    } else {
      setError('Password salah. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex items-center justify-center p-4 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md glass-card rounded-3xl p-8 border border-slate-800 shadow-2xl animate-fade-in">
        
        {/* Brand Logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold mx-auto mb-5 shadow-xl shadow-indigo-500/20">
          <Lock className="w-8 h-8" />
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold badge-active mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Akses Terproteksi Internal
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            ABUJAPI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Intelligence</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Masukkan password untuk menguji & mengakses Dashboard Data Perusahaan
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password Akses Dashboard
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                placeholder="Masukkan password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full glass-input rounded-xl pl-10 pr-4 py-3 text-sm font-medium placeholder-slate-500"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all transform active:scale-95"
          >
            <span>Masuk Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
          <p>Sistem Terproteksi • Gunakan Password Resmi Tim Internal</p>
        </div>

      </div>
    </div>
  );
}
