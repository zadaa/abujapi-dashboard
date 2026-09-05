import React, { useMemo } from 'react';
import { Search, RotateCcw, SlidersHorizontal, MapPin, Building, UserCheck } from 'lucide-react';

export default function FilterBar({
  data = [],
  searchTerm,
  setSearchTerm,
  selectedProvince,
  setSelectedProvince,
  selectedCity,
  setSelectedCity,
  selectedStatus,
  setSelectedStatus,
  selectedJabatan,
  setSelectedJabatan,
  onReset
}) {
  
  // Unique Options
  const provinces = useMemo(() => {
    const set = new Set();
    data.forEach(i => i.provinsi_name && set.add(i.provinsi_name.trim()));
    return Array.from(set).sort();
  }, [data]);

  const cities = useMemo(() => {
    const set = new Set();
    data.forEach(i => {
      if (selectedProvince && i.provinsi_name?.trim() !== selectedProvince) return;
      if (i.kota_name) set.add(i.kota_name.trim());
    });
    return Array.from(set).sort();
  }, [data, selectedProvince]);

  const statuses = useMemo(() => {
    const set = new Set();
    data.forEach(i => i.badan_usaha_status && set.add(i.badan_usaha_status.trim()));
    return Array.from(set).sort();
  }, [data]);

  const jabatans = useMemo(() => {
    const set = new Set();
    data.forEach(i => i.jabatan_name && set.add(i.jabatan_name.trim()));
    return Array.from(set).sort();
  }, [data]);

  const activeCount = [
    searchTerm, selectedProvince, selectedCity, selectedStatus, selectedJabatan
  ].filter(Boolean).length;

  return (
    <div className="glass-card rounded-2xl p-4 lg:p-5 border border-slate-800/80 mb-6">
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-200">Filter & Pencarian Interaktif</h3>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {activeCount} Active
            </span>
          )}
        </div>

        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Semua Filter</span>
          </button>
        )}
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        
        {/* Global Search Input */}
        <div className="lg:col-span-4 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Nama Perusahaan, PJ, KTP, Sertifikat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium placeholder-slate-500"
          />
        </div>

        {/* Provinsi Dropdown */}
        <div className="lg:col-span-2">
          <select
            value={selectedProvince}
            onChange={(e) => {
              setSelectedProvince(e.target.value);
              setSelectedCity('');
            }}
            className="w-full glass-input rounded-xl px-3 py-2.5 text-xs font-medium"
          >
            <option value="" className="bg-slate-900 text-slate-300">Semua Provinsi ({provinces.length})</option>
            {provinces.map(p => (
              <option key={p} value={p} className="bg-slate-900 text-slate-200">{p}</option>
            ))}
          </select>
        </div>

        {/* Kota Dropdown */}
        <div className="lg:col-span-2">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full glass-input rounded-xl px-3 py-2.5 text-xs font-medium"
          >
            <option value="" className="bg-slate-900 text-slate-300">Semua Kota ({cities.length})</option>
            {cities.map(c => (
              <option key={c} value={c} className="bg-slate-900 text-slate-200">{c}</option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="lg:col-span-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full glass-input rounded-xl px-3 py-2.5 text-xs font-medium"
          >
            <option value="" className="bg-slate-900 text-slate-300">Semua Status ({statuses.length})</option>
            {statuses.map(s => (
              <option key={s} value={s} className="bg-slate-900 text-slate-200">{s}</option>
            ))}
          </select>
        </div>

        {/* Jabatan Dropdown */}
        <div className="lg:col-span-2">
          <select
            value={selectedJabatan}
            onChange={(e) => setSelectedJabatan(e.target.value)}
            className="w-full glass-input rounded-xl px-3 py-2.5 text-xs font-medium"
          >
            <option value="" className="bg-slate-900 text-slate-300">Semua Jabatan ({jabatans.length})</option>
            {jabatans.map(j => (
              <option key={j} value={j} className="bg-slate-900 text-slate-200">{j}</option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
}
