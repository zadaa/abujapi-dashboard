import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ExcelUploader({ onDataLoaded }) {
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
          throw new Error('File Excel kosong atau format tidak sesuai.');
        }

        onDataLoaded(jsonData, file.name);
        setIsLoading(false);
      } catch (err) {
        console.error('Error parsing Excel:', err);
        setError('Gagal membaca file Excel. Pastikan file valid (.xls/.xlsx).');
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Gagal membaca file.');
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
    <div className="glass-card rounded-2xl p-6 border border-slate-800/80 mb-6">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
          isDragOver 
            ? 'border-indigo-500 bg-indigo-500/10' 
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto mb-3">
          <FileSpreadsheet className="w-6 h-6" />
        </div>

        <h3 className="text-sm font-bold text-white mb-1">
          Drag & Drop File Excel (<span className="text-indigo-400">data perusahaan abujapi.xls</span>) Di Sini
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Mendukung format .xls, .xlsx, dan .csv (Pemrosesan 100% lokal di browser Anda)
        </p>

        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md cursor-pointer transition-all">
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
          <div className="mt-4 text-xs font-semibold text-indigo-300 animate-pulse">
            Mengurai data Excel (6.000+ baris)...
          </div>
        )}

        {error && (
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
