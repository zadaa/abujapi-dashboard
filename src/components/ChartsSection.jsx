import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, 
  PieChart, Pie, Legend 
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon, Filter } from 'lucide-react';

const COLOR_PALETTE = [
  '#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', 
  '#8b5cf6', '#14b8a6', '#f97316', '#06b6d4', '#64748b'
];

export default function ChartsSection({ data = [], selectedProvince, setSelectedProvince, selectedStatus, setSelectedStatus }) {
  
  // Province Chart Data (Top 10)
  const provinceChartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    const counts = {};
    data.forEach(item => {
      if (!item) return;
      const p = item.provinsi_name ? String(item.provinsi_name).trim() : 'Lainnya / Tidak Ada';
      counts[p] = (counts[p] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [data]);

  // Status Chart Data
  const statusChartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    const counts = {};
    data.forEach(item => {
      if (!item) return;
      const s = item.badan_usaha_status ? String(item.badan_usaha_status).trim() : 'Tidak Diketahui';
      counts[s] = (counts[s] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length && payload[0]) {
      const dataPayload = payload[0].payload || {};
      return (
        <div className="bg-slate-900/95 border border-slate-800 p-3 rounded-xl shadow-xl text-xs backdrop-blur-md">
          <p className="font-bold text-slate-200 mb-1">{dataPayload.name || label || ''}</p>
          <p className="text-indigo-400 font-semibold">
            Jumlah: <span className="text-white">{(payload[0].value || 0).toLocaleString()} Perusahaan</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
      
      {/* Chart 1: Bar Chart by Provinsi */}
      <div className="lg:col-span-7 glass-card rounded-2xl p-5 border border-slate-800/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Top 10 Provinsi Terbanyak</h3>
              <p className="text-xs text-slate-400">Klik batang untuk memfilter tabel berdasarkan Provinsi</p>
            </div>
          </div>
          {selectedProvince && (
            <button
              onClick={() => setSelectedProvince('')}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20"
            >
              <Filter className="w-3 h-3" /> Reset Filter Provinsi
            </button>
          )}
        </div>

        <div className="h-[280px] w-full min-h-[280px]">
          {provinceChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={250}>
              <BarChart
                data={provinceChartData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                  width={110}
                  tickFormatter={(val) => (val && val.length > 14) ? `${val.substring(0, 14)}...` : (val || '')}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  radius={[0, 6, 6, 0]}
                  cursor="pointer"
                  onClick={(entry) => {
                    if (entry && entry.name) {
                      setSelectedProvince(selectedProvince === entry.name ? '' : entry.name);
                    }
                  }}
                >
                  {provinceChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={selectedProvince === entry.name ? '#818cf8' : COLOR_PALETTE[index % COLOR_PALETTE.length]} 
                      opacity={selectedProvince && selectedProvince !== entry.name ? 0.4 : 1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              Tidak ada data grafik
            </div>
          )}
        </div>
      </div>

      {/* Chart 2: Donut Chart by Status */}
      <div className="lg:col-span-5 glass-card rounded-2xl p-5 border border-slate-800/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <PieChartIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Status Badan Usaha</h3>
              <p className="text-xs text-slate-400">Proporsi Keaktifan Perusahaan</p>
            </div>
          </div>
          {selectedStatus && (
            <button
              onClick={() => setSelectedStatus('')}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20"
            >
              <Filter className="w-3 h-3" /> Reset Filter Status
            </button>
          )}
        </div>

        <div className="h-[280px] w-full min-h-[280px] flex flex-col justify-center">
          {statusChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={250}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                  cursor="pointer"
                  onClick={(entry) => {
                    if (entry && entry.name) {
                      setSelectedStatus(selectedStatus === entry.name ? '' : entry.name);
                    }
                  }}
                >
                  {statusChartData.map((entry, index) => (
                    <Cell 
                      key={`pie-cell-${index}`} 
                      fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} 
                      stroke="#0f172a"
                      strokeWidth={2}
                      opacity={selectedStatus && selectedStatus !== entry.name ? 0.35 : 1}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-slate-300 text-xs font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              Tidak ada data status
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
