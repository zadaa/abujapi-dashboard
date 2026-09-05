import React, { useState } from 'react';
import { 
  X, Building2, UserCheck, ShieldCheck, MapPin, Phone, Mail, 
  FileText, Calendar, Copy, Check, Hash, Award 
} from 'lucide-react';

export default function DetailModal({ entity, onClose }) {
  const [copiedField, setCopiedField] = useState(null);

  if (!entity) return null;

  const copyToClipboard = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getStatusBadge = (statusStr) => {
    if (!statusStr) return <span className="badge-info px-3 py-1 rounded-full text-xs font-bold">Unknown</span>;
    const s = statusStr.toLowerCase();
    if (s.includes('aktif') && !s.includes('non')) {
      return <span className="badge-active px-3 py-1 rounded-full text-xs font-bold">{statusStr}</span>;
    }
    if (s.includes('non') || s.includes('tidak') || s.includes('suspend')) {
      return <span className="badge-inactive px-3 py-1 rounded-full text-xs font-bold">{statusStr}</span>;
    }
    return <span className="badge-info px-3 py-1 rounded-full text-xs font-bold">{statusStr}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      
      {/* Modal Card Container */}
      <div className="relative w-full max-w-3xl glass-card rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/90 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20 shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="text-xl font-extrabold text-white">
                  {entity.badan_usaha_name || 'Nama Perusahaan Tidak Ada'}
                </h2>
                {getStatusBadge(entity.badan_usaha_status)}
              </div>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                No. Sertifikat: <span className="font-mono text-indigo-300">{entity.badan_usaha_sertifikat || '-'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* Section 1: Profil Penanggung Jawab */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/50">
            <div className="flex items-center gap-2 mb-4 text-indigo-400 font-bold text-sm">
              <UserCheck className="w-4 h-4" />
              <h3>Informasi Penanggung Jawab (PJ)</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <span className="text-slate-400 block font-medium mb-0.5">Nama Lengkap PJ:</span>
                <p className="text-sm font-bold text-white">{entity.pj_name || '-'}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-medium mb-0.5">Jabatan:</span>
                <p className="text-xs font-semibold text-indigo-300">{entity.jabatan_name || '-'}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-medium mb-0.5">NIK / KTP PJ:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-200">{entity.pj_ktp || '-'}</span>
                  {entity.pj_ktp && (
                    <button
                      onClick={() => copyToClipboard(entity.pj_ktp, 'ktp')}
                      className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                      title="Copy KTP"
                    >
                      {copiedField === 'ktp' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-medium mb-0.5">No. Telepon PJ:</span>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-slate-200">{entity.pj_phone || '-'}</span>
                  {entity.pj_phone && (
                    <button
                      onClick={() => copyToClipboard(entity.pj_phone, 'pj_phone')}
                      className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                    >
                      {copiedField === 'pj_phone' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <span className="text-slate-400 block font-medium mb-0.5">Email PJ:</span>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-slate-200">{entity.pj_email || '-'}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Alamat & Wilayah */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/50">
            <div className="flex items-center gap-2 mb-4 text-purple-400 font-bold text-sm">
              <MapPin className="w-4 h-4" />
              <h3>Alamat & Lokasi Badan Usaha</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <span className="text-slate-400 block font-medium mb-0.5">Alamat Lengkap:</span>
                <p className="text-slate-200 font-medium leading-relaxed">{entity.badan_usaha_alamat || '-'}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-medium mb-0.5">Kelurahan & Kecamatan:</span>
                <p className="text-slate-200">{entity.kelurahan_name || '-'}, {entity.kecamatan_name || '-'}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-medium mb-0.5">Kota / Kabupaten:</span>
                <p className="text-slate-200 font-semibold">{entity.kota_name || '-'}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-medium mb-0.5">Provinsi:</span>
                <p className="text-indigo-300 font-semibold">{entity.provinsi_name || '-'}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-medium mb-0.5">Kode Pos:</span>
                <p className="font-mono text-slate-300">{entity.kode_pos || '-'}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Kontak & Pendaftaran Perusahaan */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/50">
            <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold text-sm">
              <FileText className="w-4 h-4" />
              <h3>Kontak & Pendaftaran Perusahaan</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 block font-medium mb-0.5">Telepon Perusahaan:</span>
                <p className="text-slate-200 font-medium">{entity.badan_usaha_tlp || '-'}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-medium mb-0.5">Fax Perusahaan:</span>
                <p className="text-slate-200 font-medium">{entity.badan_usaha_fax || '-'}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-medium mb-0.5">Email Perusahaan:</span>
                <p className="text-indigo-300 font-medium">{entity.badan_usaha_email || '-'}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-medium mb-0.5">Tanggal Terdaftar:</span>
                <div className="flex items-center gap-1.5 text-slate-200">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{entity.badan_usaha_daftar || '-'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20"
          >
            Tutup Profil
          </button>
        </div>

      </div>
    </div>
  );
}
