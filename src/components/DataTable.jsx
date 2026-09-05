import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  ArrowUpDown, Eye, Download, Building2, MapPin, Phone, Mail, 
  MessageSquare, ExternalLink, Copy, Check 
} from 'lucide-react';

export default function DataTable({ data = [], onSelectEntity }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortField, setSortField] = useState('badan_usaha_name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [copiedText, setCopiedText] = useState(null);

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

  const copyToClipboard = (e, text, label) => {
    e.stopPropagation();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Format WhatsApp Link
  const getWaUrl = (phoneStr, pjName, companyName) => {
    if (!phoneStr) return null;
    let cleaned = phoneStr.replace(/\D/g, '');
    if (!cleaned) return null;
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    } else if (!cleaned.startsWith('62')) {
      cleaned = '62' + cleaned;
    }
    const message = encodeURIComponent(`Halo Yth. Bpk/Ibu ${pjName || ''}, kami dari Sekretariat ABUJAPI perihal data perusahaan ${companyName || ''}.`);
    return `https://wa.me/${cleaned}?text=${message}`;
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
    return <span className="badge-info px-2.5 py-0.5 rounded-full text-xs font-semibold">{statusStr}</span>;
  };

  // Export CSV
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
    link.setAttribute('download', `abujapi_contacts_${Date.now()}.csv`);
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
          <div>
            <h3 className="text-base font-bold text-white">Daftar Kontak & Perusahaan ABUJAPI</h3>
            <p className="text-xs text-slate-400">Tabel Kontak Penanggung Jawab (HP/WA/Email) & Perusahaan</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
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
              
              {/* Prominent Contact PJ Column */}
              <th className="p-3.5 bg-indigo-950/40 text-indigo-300">
                <div className="flex items-center gap-1.5 font-bold">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kontak PJ (HP & WA)</span>
                </div>
              </th>

              {/* Email PJ */}
              <th className="p-3.5 bg-indigo-950/40 text-indigo-300">
                <div className="flex items-center gap-1.5 font-bold">
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  <span>Email PJ</span>
                </div>
              </th>

              {/* Telepon & Email Badan Usaha */}
              <th className="p-3.5 text-slate-300">
                <span>Kontak Perusahaan</span>
              </th>

              <th 
                className="p-3.5 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('provinsi_name')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Wilayah</span>
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
                const waUrl = getWaUrl(item.pj_phone, item.pj_name, item.badan_usaha_name);

                return (
                  <tr 
                    key={index}
                    className="hover:bg-indigo-500/[0.06] transition-colors cursor-pointer group"
                    onClick={() => onSelectEntity(item)}
                  >
                    <td className="p-3.5 pl-5 font-mono text-slate-500 text-[11px]">{rowIndex}</td>
                    
                    {/* Badan Usaha Name */}
                    <td className="p-3.5 min-w-[200px]">
                      <div className="font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                        {item.badan_usaha_name || '-'}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {item.badan_usaha_sertifikat || ''}
                      </div>
                    </td>

                    {/* Penanggung Jawab */}
                    <td className="p-3.5 min-w-[170px]">
                      <div className="font-bold text-white">
                        {item.pj_name || '-'}
                      </div>
                      <div className="text-[11px] text-indigo-400 font-semibold">
                        {item.jabatan_name || '-'}
                      </div>
                    </td>

                    {/* Prominent Kontak PJ (Phone + WA Button) */}
                    <td className="p-3.5 min-w-[190px] bg-indigo-950/20">
                      {item.pj_phone ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-emerald-400 text-xs">
                              {item.pj_phone}
                            </span>
                            <button
                              onClick={(e) => copyToClipboard(e, item.pj_phone, `phone_${rowIndex}`)}
                              className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                              title="Copy No HP"
                            >
                              {copiedText === `phone_${rowIndex}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>

                          {/* Direct WhatsApp Chat Button */}
                          {waUrl && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm transition-all transform hover:scale-105"
                            >
                              <MessageSquare className="w-3 h-3 fill-current" />
                              <span>Chat WhatsApp</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500 font-mono text-[11px]">-</span>
                      )}
                    </td>

                    {/* Email PJ */}
                    <td className="p-3.5 min-w-[170px] bg-indigo-950/20">
                      {item.pj_email ? (
                        <a
                          href={`mailto:${item.pj_email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 hover:underline font-mono text-[11px]"
                        >
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[150px]">{item.pj_email}</span>
                        </a>
                      ) : (
                        <span className="text-slate-500 font-mono text-[11px]">-</span>
                      )}
                    </td>

                    {/* Kontak Perusahaan */}
                    <td className="p-3.5 min-w-[180px]">
                      <div className="text-slate-200 font-mono text-[11px]">
                        {item.badan_usaha_tlp ? `Telp: ${item.badan_usaha_tlp}` : ''}
                      </div>
                      <div className="text-indigo-300 text-[11px] truncate max-w-[150px]">
                        {item.badan_usaha_email || '-'}
                      </div>
                    </td>

                    {/* Wilayah */}
                    <td className="p-3.5 min-w-[140px]">
                      <div className="font-semibold text-slate-200">{item.kota_name || '-'}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-indigo-400" />
                        {item.provinsi_name || '-'}
                      </div>
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
                <td colSpan={9} className="p-8 text-center text-slate-500 text-xs">
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
