import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  ArrowUpDown, Eye, Download, FileSpreadsheet, Building2, MapPin 
} from 'lucide-react';

export default function DataTable({ data = [], onSelectEntity }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortField, setSortField] = useState('badan_usaha_name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Sorting
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const valA = (a[sortField] || '').toString().toLowerCase();
      const valB = (b[sortField] || '').toString().toLowerCase();
      
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (statusStr) => {
    if (!statusStr) return <span className="badge-info px-2 py-0.5 rounded-full text-xs font-semibold">Unknown</span>;
    const s = statusStr.toLowerCase();
    if (s.includes('aktif') && !s.includes('non')) {
      return <span className="badge-active px-2.5 py-0.5 rounded-full text-xs font-semibold">{statusStr}</span>;
    }
    if (s.includes('non') || s.includes('tidak') || s.includes('suspend')) {
      return <span className="badge-inactive px-2.5 py-0.5 rounded-full text-xs font-semibold">{statusStr}</span>;
    }
    if (s.includes('proses') || s.includes('pending')) {
      return <span className="badge-warning px-2.5 py-0.5 rounded-full text-xs font-semibold">{statusStr}</span>;
    }
    return <span className="badge-info px-2.5 py-0.5 rounded-full text-xs font-semibold">{statusStr}</span>;
  };

  // Export to CSV function
  const exportToCSV = () => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
      const values = headers.map(header => {
        const escaped = ('' + (row[header] || '')).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `abujapi_filtered_data_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden mb-8">
      
      {/* Table Header Controls */}
      <div className="p-4 lg:p-5 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">Daftar Perusahaan & Badan Usaha</h3>
          <span className="text-xs text-slate-400 font-medium">
            ({sortedData.length.toLocaleString()} Perusahaan)
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Rows per page selector */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Tampilkan:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="glass-input rounded-lg px-2 py-1 text-xs font-semibold"
            >
              <option value={20} className="bg-slate-900">20 Baris</option>
              <option value={50} className="bg-slate-900">50 Baris</option>
              <option value={100} className="bg-slate-900">100 Baris</option>
            </select>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              <th className="p-3.5 pl-5">#</th>
              <th 
                className="p-3.5 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('badan_usaha_name')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Nama Badan Usaha</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th 
                className="p-3.5 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('pj_name')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Penanggung Jawab (PJ)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="p-3.5">No. Sertifikat</th>
              <th 
                className="p-3.5 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('kota_name')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Kota / Kabupaten</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th 
                className="p-3.5 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('provinsi_name')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Provinsi</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th 
                className="p-3.5 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('badan_usaha_status')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="p-3.5 pr-5 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 text-xs">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => {
                const rowIndex = startIndex + index + 1;
                return (
                  <tr 
                    key={index}
                    className="hover:bg-indigo-500/[0.04] transition-colors cursor-pointer group"
                    onClick={() => onSelectEntity(item)}
                  >
                    <td className="p-3.5 pl-5 font-mono text-slate-500 text-[11px]">{rowIndex}</td>
                    
                    {/* Badan Usaha Name */}
                    <td className="p-3.5">
                      <div className="font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                        {item.badan_usaha_name || '-'}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                        {item.badan_usaha_alamat || ''}
                      </div>
                    </td>

                    {/* Penanggung Jawab */}
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-200">
                        {item.pj_name || '-'}
                      </div>
                      <div className="text-[11px] text-indigo-400 font-medium">
                        {item.jabatan_name || '-'}
                      </div>
                    </td>

                    {/* Sertifikat */}
                    <td className="p-3.5 font-mono text-slate-300 text-[11px]">
                      {item.badan_usaha_sertifikat || '-'}
                    </td>

                    {/* Kota */}
                    <td className="p-3.5 text-slate-300">
                      {item.kota_name || '-'}
                    </td>

                    {/* Provinsi */}
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-slate-300 font-medium">
                        <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                        {item.provinsi_name || '-'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      {getStatusBadge(item.badan_usaha_status)}
                    </td>

                    {/* Action */}
                    <td className="p-3.5 pr-5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEntity(item);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold transition-all"
                      >
                        <Eye className="w-3 h-3" /> Detail
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500 text-xs">
                  Tidak ada data yang sesuai dengan filter pencarian Anda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination */}
      <div className="p-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="text-slate-400">
          Menampilkan <span className="font-semibold text-slate-200">{paginatedData.length > 0 ? startIndex + 1 : 0}</span> sampai{' '}
          <span className="font-semibold text-slate-200">{Math.min(startIndex + pageSize, sortedData.length)}</span> dari{' '}
          <span className="font-semibold text-white">{sortedData.length.toLocaleString()}</span> data
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 font-semibold text-indigo-300 bg-slate-900 border border-slate-800 rounded-lg">
            Halaman {currentPage} dari {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
