# Portal KKDN Kalbar 2026

Situs statis (HTML, CSS dan JavaScript biasa) untuk Kunjungan Kerja Dalam Negeri Kedeputian Bidang Geoekonomi DPN ke Kalimantan Barat, 24–28 November 2026. Tidak perlu build, server khusus, atau instalasi apa pun.

## Isi folder

| File | Isi |
|---|---|
| `index.html` | Portal utama: konteks Kalbar, peta, pointer diskusi per sasaran, rencana kegiatan, kalender dan komposisi tim |
| `forum-diskusi-karhutla.html` | Halaman Forum Diskusi Karhutla |
| `profil-01-…html` s.d. `profil-12-…html` | Profil 12 sasaran kunjungan |
| `assets/dc-lite.js` | Penggerak kecil untuk bagian interaktif portal (tab, buka-tutup, hitung mundur) |
| `assets/leaflet/` | Pustaka peta Leaflet 1.9.4 (lisensi BSD-2, lihat `LICENSE`) |
| `assets/favicon.svg` | Ikon tab browser |
| `.nojekyll` | Agar GitHub Pages menyajikan file apa adanya |

## Cara publikasi di GitHub Pages

**Lewat browser (tanpa git):**

1. Buat repository baru di github.com, misalnya `portal-kkdn-kalbar`.
2. Di repository itu, klik **Add file → Upload files**, lalu seret **seluruh isi folder ini** (bukan file zip-nya). Pastikan `index.html` berada langsung di root repository, bukan di dalam subfolder. Klik **Commit changes**.
3. Buka **Settings → Pages**. Pada *Build and deployment*, pilih **Source: Deploy from a branch**, branch **main**, folder **/ (root)**, lalu **Save**.
4. Tunggu 1–2 menit. Situs bisa dibuka di `https://<username>.github.io/<nama-repository>/`.

File `.nojekyll` tersembunyi di sebagian sistem operasi. Kalau tidak ikut terunggah, situs tetap berjalan.

**Lewat git:**

```bash
cd portal-kkdn-kalbar-2026
git init
git add .
git commit -m "Portal KKDN Kalbar 2026"
git branch -M main
git remote add origin https://github.com/<username>/<nama-repository>.git
git push -u origin main
```

Lalu aktifkan Pages seperti langkah 3 di atas.

## Penting: siapa yang bisa melihat situs ini

Dengan akun GitHub gratis, GitHub Pages hanya bisa dipakai dari repository publik, dan situsnya bisa dibuka siapa saja yang tahu alamatnya. Halaman Pages yang dibatasi hanya untuk orang tertentu memerlukan akun organisasi dengan GitHub Enterprise Cloud.

Portal ini memuat rundown internal, nama hotel, jadwal per jam, dan susunan tim pejabat. Pertimbangkan apakah semua itu boleh terbuka untuk umum sebelum dipublikasikan, atau hapus bagian yang sensitif terlebih dahulu.

## Membuka tanpa GitHub

Klik dua kali `index.html` sudah cukup untuk melihat portal di komputer sendiri. Peta (OpenStreetMap) dan huruf Archivo (Google Fonts) memerlukan koneksi internet; tanpa internet, peta kosong dan huruf memakai font bawaan sistem.

## Mengubah isi

- **Halaman profil dan forum:** ubah teks langsung di file HTML-nya.
- **Portal utama (`index.html`):**
  - Teks tetap (judul, kartu angka, kotak posisi, bahan forum) ada di dalam `<template id="tpl">`.
  - Data yang diulang ada di `<script>` paling bawah: pointer sasaran (`SASARAN`), benang merah (`ISU`), rencana kegiatan (`DAYS`), komposisi tim (`TEAMS`) dan titik peta (`LOKASI`).
  - Tanda `{{ ... }}` di dalam template adalah tempat data diisi otomatis; jangan dihapus.

Sumber data: rundown internal KKDN Kalbar (versi 3), rundown dan TOR Forum Diskusi, TOR KKDN, dan 12 profil instansi (riset sumber terbuka per 20 November 2026). Angka bertanda [Est.] adalah estimasi penyusun.
