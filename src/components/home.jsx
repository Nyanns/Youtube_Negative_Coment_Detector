import React from "react";
import "../styles/home.css"; // Impor file CSS yang baru dibuat
import GoogleSvgIcon from "../assets/icons8-google.svg"; // Impor ikon SVG

// Komponen Home untuk menampilkan halaman login.
// Menerima props:
// - onLogin: Fungsi callback yang dipanggil saat tombol login diklik.
//   (Diharapkan di-memoize dengan useCallback di komponen parent).
// - authLoading: Boolean, status loading proses autentikasi.
function Home({ onLogin, authLoading }) {
  return (
    <div className="home-page">
      {/* Judul halaman */}
      <h1>Selamat Datang</h1>
      {/* Paragraf penjelasan */}
      <p>
        Silakan masuk untuk memanfaatkan fitur deteksi komentar spam pada kanal
        YouTube Anda.
      </p>

      {/* Tombol login */}
      <button
        onClick={onLogin}
        disabled={authLoading} // Tombol dinonaktifkan selama proses loading.
        className="login-button"
      >
        {authLoading ? (
          // Tampilan saat loading
          <>
            <div className="loading-spinner-small"></div> Memuat...
          </>
        ) : (
          // Tampilan normal tombol login
          <>
            <img
              src={GoogleSvgIcon} // Menggunakan variabel ikon SVG yang diimpor.
              alt="Google" // Teks alternatif untuk ikon.
              className="google-icon" // Kelas CSS untuk styling ikon.
            />
            Masuk dengan Akun Google {/* Teks tombol yang jelas */}
          </>
        )}
      </button>
    </div>
  );
}

// Menggunakan React.memo untuk optimasi.
// Komponen Home hanya akan di-render ulang jika props 'onLogin' atau 'authLoading' berubah.
// Penting: 'onLogin' harus di-memoize menggunakan React.useCallback di komponen parent
// agar referensinya stabil dan React.memo bekerja efektif.
export default React.memo(Home);
