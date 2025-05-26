# Youtube Negative Comment Detector

[![Lisensi: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Filter Komentar YouTube Otomatis: Deteksi Hibrida Berbasis Perspective API dan Pola Spesifik.

Aplikasi web ini dirancang untuk membantu kreator konten YouTube dalam mengelola dan memoderasi komentar pada video mereka secara lebih efisien. Dengan memanfaatkan pendekatan hibrida, aplikasi ini mampu mendeteksi komentar yang berpotensi negatif, termasuk komentar "Judol/Spam" (Judi Online/Spam) dan komentar "Toxic" (kasar, tidak sopan, atau mengandung ujaran kebencian).

### **_Latar Belakang Proyek_**

Di era digital saat ini, YouTube telah menjadi sarana utama untuk interaksi dan ekspresi. Namun, kebebasan ini sering disalahgunakan dengan munculnya komentar negatif yang mengganggu pengalaman pengguna, merusak reputasi kreator, bahkan mempromosikan aktivitas ilegal seperti judi online. Volume komentar yang masif membuat moderasi manual tidak lagi efektif. Aplikasi ini bertujuan memberikan solusi otomatis untuk tantangan tersebut. (Informasi ini diambil dari konteks umum skripsi "Filter Komentar YouTube Otomatis: Deteksi Hibrida Berbasis Perspective API dan Pola Spesifik").

### **_Fitur Utama_**

- **Autentikasi Google:** Login aman menggunakan Akun Google untuk mengakses data channel YouTube pengguna.
- **Manajemen Video:** Menampilkan daftar video dari channel YouTube pengguna.
- **Pemindaian Komentar:** Mengambil dan memproses komentar dari video yang dipilih.
- **Deteksi Hibrida:**
  - **Deteksi Judol/Spam:** Menggunakan pola regex yang dikombinasikan dengan pencocokan fuzzy (menggunakan `fuzzball`) terhadap daftar frasa spam yang diketahui untuk mengidentifikasi komentar terkait judi online dan spam umum.
  - **Deteksi Toksisitas:** Memanfaatkan Google Perspective API untuk menganalisis dan menilai tingkat toksisitas komentar berdasarkan berbagai atribut (TOXICITY, SEVERE_TOXICITY, INSULT, PROFANITY, THREAT).
- **Visualisasi Hasil Deteksi:** Menampilkan komentar yang terdeteksi dengan label yang jelas (Judol/Spam, Toxic, Ditandai).
- **Filter Komentar:** Memungkinkan pengguna untuk memfilter tampilan komentar berdasarkan kategori deteksi (Semua, Judol/Spam, Toxic, Gabungan).
- **Manajemen Komentar:** Memungkinkan pengguna untuk memilih satu atau beberapa komentar yang terdeteksi untuk dihapus.
- **Penghapusan Komentar:** Mengintegrasikan dengan YouTube Data API v3 untuk melakukan penghapusan komentar yang dipilih.
- **Umpan Balik Proses:** Memberikan notifikasi sukses atau detail error setelah proses penghapusan.

### **_Teknologi yang Digunakan_**

- **Frontend:** React (v19), Vite
- **Autentikasi & API Google:**
  - Google Identity Services (GIS)
  - Google APIs Client Library for JavaScript (GAPI)
  - YouTube Data API v3
  - Perspective API
- **Deteksi Pola Teks:**
  - Regular Expressions (Regex)
  - Fuzzball.js (untuk fuzzy string matching)
- **Styling:** CSS murni dengan variabel CSS.
- **Linting:** ESLint
- **Build Tool:** Vite
- **Package Manager (Contoh):** npm/yarn/bun (Proyek ini menyertakan `bun.lockb` dari output konflik sebelumnya, namun `package.json` bersifat universal).

### **_Prasyarat_**

- Node.js (versi LTS direkomendasikan) atau Bun.
- Akun Google.
- Proyek di Google Cloud Platform dengan:
  - YouTube Data API v3 diaktifkan.
  - Perspective API diaktifkan.
  - Kredensial OAuth 2.0 Client ID (untuk aplikasi web).
  - API Key untuk Perspective API.

### **_Konfigurasi Lingkungan_**

Untuk menjalankan aplikasi ini, Anda perlu membuat file `.env` di direktori root proyek dan mengisi variabel lingkungan berikut:

```env
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID
VITE_PERSPECTIVE_API_KEY=YOUR_PERSPECTIVE_API_KEY
Ganti YOUR_GOOGLE_OAUTH_CLIENT_ID dengan OAuth 2.0 Client ID Anda dan YOUR_PERSPECTIVE_API_KEY dengan API Key untuk Perspective API Anda.

Pastikan juga untuk mengkonfigurasi Authorized JavaScript origins dan Authorized redirect URIs pada kredensial OAuth 2.0 Client ID Anda di Google Cloud Console agar sesuai dengan URL pengembangan lokal Anda (misalnya, http://localhost:5173 jika menggunakan Vite default) dan URL produksi jika di-deploy.

Instalasi dan Menjalankan Proyek
Clone repository:

Bash

git clone [https://github.com/Nyanns/Youtube_Negative_Coment_Detector.git](https://github.com/Nyanns/Youtube_Negative_Coment_Detector.git)
cd Youtube_Negative_Coment_Detector
Install dependensi:
Pilih salah satu sesuai package manager yang Anda gunakan:

Bash

npm install
atau

Bash

yarn install
atau

Bash

bun install
Buat dan konfigurasi file .env seperti yang dijelaskan di bagian "Konfigurasi Lingkungan".

Jalankan server pengembangan:

Bash

npm run dev
Aplikasi akan berjalan secara default di http://localhost:5173.

Struktur Proyek (Ringkasan)
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
├── .eslintrc.cjs (atau eslint.config.js)
├── .gitignore
├── bun.lockb (Jika menggunakan Bun)
├── index.html
├── LICENSE (MIT License)
├── package.json
├── README.md
└── vite.config.js
Lisensi
Proyek ini dilisensikan di bawah MIT License.
```
