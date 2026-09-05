// Rich 6,000 dataset generator matching all 18 columns for Abujapi Corporate Dashboard

const PROVINCES = [
  { name: 'DKI Jakarta', cities: ['JAKARTA SELATAN', 'JAKARTA PUSAT', 'JAKARTA BARAT', 'JAKARTA TIMUR', 'JAKARTA UTARA'] },
  { name: 'Jawa Barat', cities: ['BANDUNG', 'BEKASI', 'BOGOR', 'DEPOK', 'CIMAHI', 'KARAWANG'] },
  { name: 'Jawa Timur', cities: ['SURABAYA', 'MALANG', 'SIDOARJO', 'GRESIK', 'KEDIRI'] },
  { name: 'Jawa Tengah', cities: ['SEMARANG', 'SOLO', 'MAGELANG', 'KUDUS', 'PURWOKERTO'] },
  { name: 'Sumatera Utara', cities: ['MEDAN', 'DELI SERDANG', 'BINJAI', 'PEMATANG SIANTAR'] },
  { name: 'Banten', cities: ['TANGERANG', 'TANGERANG SELATAN', 'SERANG', 'CILEGON'] },
  { name: 'Bali', cities: ['DENPASAR', 'BADUNG', 'GIANYAR', 'TABANAN'] },
  { name: 'Sulawesi Selatan', cities: ['MAKASSAR', 'GOWA', 'MAROS'] },
  { name: 'Riau', cities: ['PEKANBARU', 'DUMAI'] },
  { name: 'Kalimantan Timur', cities: ['BALIKPAPAN', 'SAMARINDA', 'PENAJAM PASER UTARA'] }
];

const JABATAN_LIST = ['DIREKTUR UTAMA', 'DIREKTUR', 'KOMISARIS UTAMA', 'MANAGER OPERASIONAL', 'GENERAL MANAGER'];
const STATUS_LIST = ['Aktif', 'Aktif', 'Aktif', 'Aktif', 'Aktif', 'Dalam Proses Pembaruan', 'Non-Aktif'];
const PREFIX_PT = ['PT. GARUDA SEKURITI INDONESIA', 'PT. BRAVO GUARD UTAMA', 'PT. ABADI SEJAHTERA NUSA', 'PT. CIPTA MANDIRI PERKASA', 'PT. SATRIA JAYA WIRATAMA', 'PT. TANGGUK SEJAHTERA INDONESIA', 'PT. NUSANTARA WIRA GUARD', 'PT. PRATAMA BINTANG SEKURITI', 'PT. MULTI PROTEKSI UTAMA', 'PT. CAHAYA WIRA KENCANA'];

const FIRST_NAMES = ['BAMBANG', 'HERU', 'AGUS', 'BUDI', 'EKO', 'SUJATMIKO', 'HENDRA', 'DEDDY', 'WIBOWO', 'PRIYANTO', 'SITI', 'DEWI', 'RINA'];
const LAST_NAMES = ['SANTOSO', 'WIJAYA', 'PRASETYO', 'SAPUTRA', 'KUSUMA', 'HIDAYAT', 'SETIAWAN', 'GUNAWAN', 'NUGROHO', 'UTOMO'];

export function generateInitialData(count = 6000) {
  const data = [];
  for (let i = 1; i <= count; i++) {
    const provObj = PROVINCES[i % PROVINCES.length];
    const city = provObj.cities[i % provObj.cities.length];
    const status = STATUS_LIST[i % STATUS_LIST.length];
    const jabatan = JABATAN_LIST[i % JABATAN_LIST.length];
    const fname = FIRST_NAMES[i % FIRST_NAMES.length];
    const lname = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const pjName = `${fname} ${lname}`;
    
    const companyBase = PREFIX_PT[i % PREFIX_PT.length];
    const companyName = `${companyBase} ${Math.floor(i / PREFIX_PT.length) + 1}`;
    
    data.push({
      pj_name: pjName,
      pj_ktp: `3175${(100000000000 + (i * 9876543) % 900000000000)}`,
      pj_phone: `081${Math.floor(100000000 + (i * 123456) % 900000000)}`,
      pj_email: `${fname.toLowerCase()}.${lname.toLowerCase()}${i}@abujapi.or.id`,
      jabatan_name: jabatan,
      badan_usaha_name: companyName,
      badan_usaha_sertifikat: `SBU/BUJP/${2023 + (i % 3)}/${10000 + i}`,
      badan_usaha_alamat: `Jl. Raya Industri No. ${(i % 250) + 1}, Blok C-${(i % 20) + 1}`,
      provinsi_name: provObj.name,
      kota_name: city,
      kecamatan_name: `KECAMATAN ${(i % 15) + 1}`,
      kelurahan_name: `KELURAHAN ${(i % 30) + 1}`,
      kode_pos: `${10000 + (i % 80000)}`,
      badan_usaha_tlp: `021-${5500000 + (i % 900000)}`,
      badan_usaha_fax: `021-${5500001 + (i % 900000)}`,
      badan_usaha_email: `info@${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.co.id`,
      badan_usaha_daftar: `${2020 + (i % 5)}-0${(i % 9) + 1}-15`,
      badan_usaha_status: status
    });
  }
  return data;
}
