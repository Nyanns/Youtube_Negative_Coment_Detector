# 🎯 Youtube Negative Comment Detector

[![Lisensi: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Filter Komentar YouTube Otomatis: Deteksi Hibrida Berbasis Perspective API dan Pola Spesifik**

Aplikasi web ini dirancang untuk membantu kreator konten YouTube dalam mengelola dan memoderasi komentar secara lebih efisien. Dengan pendekatan hibrida, aplikasi ini mampu mendeteksi komentar negatif, termasuk komentar **Judol/Spam** (Judi Online/Spam) dan **Toxic** (kasar, tidak sopan, atau mengandung ujaran kebencian).

---

## 📌 Latar Belakang Proyek

Di era digital, YouTube menjadi sarana utama untuk interaksi dan ekspresi. Sayangnya, kebebasan ini sering disalahgunakan oleh pengguna untuk menuliskan komentar negatif, spam, atau bahkan promosi aktivitas ilegal seperti **judi online**.

Volume komentar yang besar membuat moderasi manual tidak efektif. Aplikasi ini memberikan solusi otomatis melalui deteksi berbasis **Perspective API** dan pola spam khusus.

---

## 🚀 Fitur Utama

- 🔐 **Autentikasi Google**: Login aman menggunakan Akun Google.
- 🎞 **Manajemen Video**: Menampilkan daftar video dari channel pengguna.
- 💬 **Pemindaian Komentar**: Mengambil dan memproses komentar dari video yang dipilih.
- 🧠 **Deteksi Hibrida**:

  - 🎯 **Judol/Spam**: Menggunakan regex + fuzzy matching dengan `fuzzball` berdasarkan daftar frasa spam.
  - ☠️ **Toxic**: Menggunakan **Google Perspective API** untuk mendeteksi:

    - TOXICITY
    - SEVERE_TOXICITY
    - INSULT
    - PROFANITY
    - THREAT

- 📊 **Visualisasi Hasil Deteksi**: Label komentar (Judol/Spam, Toxic, Ditandai).
- 🧹 **Filter Komentar**: Berdasarkan kategori deteksi (Semua, Judol/Spam, Toxic, Gabungan).
- 🗑 **Manajemen & Penghapusan Komentar**: Pilih dan hapus komentar terdeteksi melalui YouTube Data API v3.
- 🔔 **Umpan Balik Proses**: Notifikasi sukses atau error saat penghapusan komentar.

---

## 🛠 Teknologi yang Digunakan

- **Frontend**: React (v19), Vite
- **Google API**:

  - Google Identity Services (GIS)
  - GAPI (Google APIs Client Library for JavaScript)
  - YouTube Data API v3
  - Perspective API

- **Analisis Teks**:

  - Regex (Regular Expressions)
  - Fuzzball.js (fuzzy matching)

- **Styling**: CSS murni dengan variabel CSS
- **Linting**: ESLint
- **Build Tool**: Vite
- **Package Manager**: `npm`, `yarn`, atau `bun` (disediakan `bun.lockb`)

---

## 📋 Prasyarat

- Node.js (disarankan versi LTS) atau **Bun**
- Akun Google
- Proyek di Google Cloud Platform dengan:

  - ✅ YouTube Data API v3
  - ✅ Perspective API
  - 🎫 OAuth 2.0 Client ID (untuk login)
  - 🔑 API Key untuk Perspective API

---

## ⚙️ Konfigurasi Lingkungan

Buat file `.env` di root proyek:

```env
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID
VITE_PERSPECTIVE_API_KEY=YOUR_PERSPECTIVE_API_KEY
```

Pastikan konfigurasi **Authorized origins** dan **redirect URIs** di Google Cloud Console sesuai dengan:

- URL lokal: `http://localhost:5173`
- URL produksi (jika di-deploy)

---

## 🧪 Instalasi dan Menjalankan Proyek

### 1. Clone Repository

```bash
git clone https://github.com/Nyanns/Youtube_Negative_Coment_Detector.git
cd Youtube_Negative_Coment_Detector
```

### 2. Install Dependensi

Pilih salah satu:

```bash
npm install
# atau
yarn install
# atau
bun install
```

### 3. Jalankan Server Development

```bash
npm run dev
```

Aplikasi akan berjalan di: [http://localhost:5173](http://localhost:5173)

---

## 📁 Struktur Proyek (Ringkasan)

```
/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── icons-google.gif, icons8-google.svg, react.svg
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── ScanPage.jsx
│   │   └── SuccessPage.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCommentDetection.js
│   │   ├── useCommentManagement.js
│   │   └── useVideos.js
│   ├── services/
│   │   └── perspectiveApi.js
│   ├── styles/
│   │   ├── colors.css, dashboard.css, home.css, scanpage.css, successpage.css
│   ├── utils/
│   │   ├── dummyComments.js
│   │   ├── judolSpamPatterns.js
│   │   └── knownSpamPhrases.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .eslintrc.cjs
├── .gitignore
├── bun.lockb
├── index.html
├── LICENSE
├── package.json
├── README.md
└── vite.config.js
```

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](https://opensource.org/licenses/MIT).

---
