import React from 'react';
import { Building, UserCheck, MapPin, CheckCircle } from 'lucide-react';

export default function KpiCards({ data = [] }) {
  const totalCompanies = data ? data.length : 0;
  
  const uniquePJs = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return 0;
    const set = new Set();
    data.forEach(item => {
      if (item && item.pj_name) set.add(String(item.pj_name).trim());
    });
    return set.size;
  }, [data]);

  const uniqueProvinces = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return 0;
    const set = new Set();
    data.forEach(item => {
      if (item && item.provinsi_name) set.add(String(item.provinsi_name).trim());
    });
    return set.size;
  }, [data]);

  const activeStatusCount = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return 0;
    return data.filter(item => {
      if (!item || !item.badan_usaha_status) return false;
      const s = String(item.badan_usaha_status).toLowerCase();
      return s.includes('aktif') && !s.includes('non');
    }).length;
  }, [data]);

  const activeRatio = totalCompanies > 0 ? ((activeStatusCount / totalCompanies) * 100).toFixed(1) : 0;

  const cards = [
    {
      title: 'Total Badan Usaha',
      value: totalCompanies.toLocaleString(),
      subtext: 'Perusahaan Terdaftar',
      icon: Building,
      iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      gradient: 'from-indigo-500/10 via-slate-900/50 to-slate-900/80',
      borderColor: 'group-hover:border-indigo-500/40'
    },
    {
      title: 'Penanggung Jawab',
      value: uniquePJs.toLocaleString(),
      subtext: 'PJ / Direksi Unik',
      icon: UserCheck,
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      gradient: 'from-purple-500/10 via-slate-900/50 to-slate-900/80',
      borderColor: 'group-hover:border-purple-500/40'
    },
    {
      title: 'Jangkauan Wilayah',
      value: `${uniqueProvinces} Provinsi`,
      subtext: 'Sebaran Seluruh Indonesia',
      icon: MapPin,
      iconBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      gradient: 'from-sky-500/10 via-slate-900/50 to-slate-900/80',
      borderColor: 'group-hover:border-sky-500/40'
    },
    {
      title: 'Status Aktif',
      value: `${activeStatusCount.toLocaleString()} (${activeRatio}%)`,
      subtext: 'Badan Usaha Status Aktif',
      icon: CheckCircle,
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      gradient: 'from-emerald-500/10 via-slate-900/50 to-slate-900/80',
      borderColor: 'group-hover:border-emerald-500/40'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className={`group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br ${card.gradient} p-5 glass-card-hover ${card.borderColor}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl border ${card.iconBg}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {card.value}
              </h3>
              <p className="text-xs font-medium text-slate-400">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
