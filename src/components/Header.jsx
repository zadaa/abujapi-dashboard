import React, { useRef } from 'react';
import { Building2, Upload, Database, Moon, Sun, CheckCircle2, ShieldCheck, LogOut } from 'lucide-react';

export default function Header({ 
  totalRecords, 
  fileName, 
  onFileUpload, 
  isDarkMode, 
  setIsDarkMode,
  onLogout,
  onChangeFile
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <header className="sticky top-0 z-30 glass-card border-b border-slate-800/80 px-4 lg:px-8 py-4 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
                ABUJAPI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Intelligence</span>
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold badge-active">
                <ShieldCheck className="w-3 h-3" /> Verified Data
              </span>
            </div>
            <p className="text-xs lg:text-sm text-slate-400 font-medium">
              Dashboard Eksekutif Badan Usaha & Penanggung Jawab
            </p>
          </div>
        </div>

        {/* Info Badges & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          
          {/* Record Count Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-300">
            <Database className="w-4 h-4 text-indigo-400" />
            <span>Total Data:</span>
            <span className="font-bold text-indigo-300 text-sm">{totalRecords.toLocaleString()} Rows</span>
          </div>

          {/* File Name Tag */}
          {fileName && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="truncate max-w-[140px]">{fileName}</span>
            </div>
          )}

          {/* Upload Excel Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xls,.xlsx,.csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold transition-all"
            title="Ganti atau Upload File Excel Baru"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ganti File Excel</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all"
            title="Keluar / Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
}
