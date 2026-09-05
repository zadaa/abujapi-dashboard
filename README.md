# ABUJAPI Corporate Intelligence & Web Dashboard

Dashboard Eksekutif modern untuk menyajikan dan menganalisis 6.000+ data Badan Usaha & Penanggung Jawab ABUJAPI.

## 🚀 Fitur Utama
1. **Interactive Charts**: Grafik Bar (Top Provinsi `provinsi_name`) & Grafik Donut (Status Badan Usaha `badan_usaha_status`).
2. **Instant Search & Multi-Filter**: Pencarian serentak seluruh kolom (Nama PJ, NIK, Telp, Nama PT, Kota, Provinsi, Status).
3. **Local In-Browser Excel Loader**: Fitur Drag & Drop untuk mengurai file `.xls` / `.xlsx` (seperti `data perusahaan abujapi.xls`) secara 100% lokal tanpa mengunggah data ke server luar.
4. **Interactive Data Table**: Pagination 6.000+ baris data, sorting, & ekspor data ke CSV.
5. **Entity Detail Modal**: Pop-up profil lengkap 18 kolom untuk setiap perusahaan.

## 💻 Cara Menjalankan Secara Lokal
```bash
# 1. Masuk ke folder proyek
cd abujapi-dashboard

# 2. Install dependensi
npm install

# 3. Jalankan server pengembang
npm run dev
```

## ☁️ Cara Deploy ke Koyeb (1-Click GitHub Deploy)
1. Push repository ini ke GitHub Anda.
2. Buka dashboard [Koyeb.com](https://app.koyeb.com).
3. Klik **Create Service** -> Pilih **GitHub Repository**.
4. Pilih repositori `abujapi-dashboard`. Koyeb akan mengidentifikasi `Dockerfile` secara otomatis.
5. Klik **Deploy**! Web app Anda akan aktif dalam hitungan detik dengan HTTPS gratis.
