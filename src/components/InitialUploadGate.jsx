import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { FileSpreadsheet, Upload, AlertCircle, CheckCircle2, Shield, Sparkles } from 'lucide-react';

export default function InitialUploadGate({ onDataLoaded, onUseDemoData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const processFile = (file) => {
    if (!file) return;
    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!jsonData || jsonData.length === 0) {
          throw new Error('File Excel kosong atau format tidak valid.');
        }

        onDataLoaded(jsonData, file.name);
        setIsLoading(false);
      } catch (err) {
        console.error('Error parsing Excel:', err);
        setError('Gagal membaca file Excel. Pastikan file valid (.xls / .xlsx).');
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Gagal membaca file dari sistem.');
      setIsLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex items-center justify-center p-4 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-2xl glass-card rounded-3xl p-8 lg:p-10 border border-slate-800 shadow-2xl animate-fade-in text-center">
        
        {/* Badge Header */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold badge-active mb-4">
          <Shield className="w-4 h-4 text-emerald-400" /> Pemrosesan 100% Lokal & Privasi Aman
        </div>

        <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-2">
          Upload File Data Perusahaan <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">ABUJAPI</span>
        </h1>
        
        <p className="text-xs lg:text-sm text-slate-400 max-w-lg mx-auto mb-8">
          Silakan unggah file Excel (<span className="text-indigo-300 font-semibold">data perusahaan abujapi.xls</span>) Anda untuk mengaktifkan Dashboard & Filter Interaktif.
        </p>

        {/* Dropzone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-8 lg:p-12 transition-all cursor-pointer ${
            isDragOver 
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]' 
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900/80'
          }`}
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/10">
            <FileSpreadsheet className="w-10 h-10" />
          </div>

          <h3 className="text-base font-bold text-white mb-1">
            Drag & Drop File Excel Anda Di Sini
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Mendukung format file <span className="text-slate-200 font-mono font-semibold">.xls</span>, <span className="text-slate-200 font-mono font-semibold">.xlsx</span>, atau <span className="text-slate-200 font-mono font-semibold">.csv</span>
          </p>

          <label className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Pilih File Dari Komputer</span>
            <input
              type="file"
              accept=".xls,.xlsx,.csv"
              onChange={(e) => processFile(e.target.files[0])}
              className="hidden"
            />
          </label>

          {isLoading && (
            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-indigo-300 animate-pulse">
              <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span>Mengurai 6.000+ baris data Excel...</span>
            </div>
          )}

          {error && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Fallback to Demo Data option */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span className="text-slate-500">Belum membawa file Excel saat ini?</span>
          <button
            onClick={onUseDemoData}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold border border-slate-700 transition-all text-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Gunakan Demo Data Simulasi (6.000 Rows)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
