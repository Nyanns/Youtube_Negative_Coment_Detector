// src/components/SuccessPage.jsx

import React from "react";
// Import file CSS yang baru dibuat
import "../styles/successpage.css";

// Anda bisa menggunakan ikon dari library seperti Lucide React atau Font Awesome
// import { CheckCircle, XCircle } from 'lucide-react'; // Contoh import dari Lucide React
// Atau menggunakan emoji sederhana seperti di bawah ini

/**
 * Komponen halaman yang ditampilkan setelah proses penghapusan komentar selesai.
 * Memberikan umpan balik kepada pengguna dan opsi untuk kembali ke dashboard.
 *
 * @param {object} props - Props komponen.
 * @param {function} props.onBackToDashboard - Fungsi callback untuk kembali ke halaman dashboard.
 * @param {string|null} [props.deleteError] - Pesan error jika ada kegagalan parsial saat menghapus.
 * @param {number} [props.deletedCount] - Opsional: Jumlah komentar yang berhasil dihapus.
 */
export default function SuccessPage({
  onBackToDashboard,
  deleteError,
  deletedCount,
}) {
  // Tentukan apakah ada error delete
  const hasError = deleteError !== null && deleteError !== undefined;

  // Tentukan teks judul berdasarkan status dan jumlah
  const mainTitleText = hasError
    ? "Proses Selesai dengan Catatan" // Judul jika ada error
    : deletedCount !== undefined && deletedCount > 0
    ? "Penghapusan Berhasil!" // Judul jika sukses dan ada yang dihapus
    : "Proses Selesai"; // Judul default jika tidak ada error dan tidak ada yang dihapus (misal: tidak ada yang dipilih)

  // Tentukan teks pesan utama
  const mainMessageText = hasError
    ? "Beberapa komentar mungkin gagal dihapus. Silakan periksa detail di bawah." // Pesan jika ada error
    : deletedCount !== undefined && deletedCount > 0
    ? `Berhasil menghapus ${deletedCount} komentar yang dipilih dari sistem.` // Pesan jika sukses dan ada yang dihapus
    : "Tidak ada komentar yang dipilih untuk dihapus, atau proses selesai tanpa aksi penghapusan."; // Pesan default

  return (
    // Menggunakan kelas CSS dari successpage.css
    <div className="success-page-container">
      {/* Menghapus div success-card di sini */}
      {/* Kontainer Ikon Status */}
      <div className="status-icon-container">
        {/* Tampilkan ikon centang jika tidak ada error, ikon silang jika ada error */}
        {hasError ? (
          // Menggunakan emoji sederhana sebagai ikon
          <span
            role="img"
            aria-label="Error icon"
            className="status-icon error"
          >
            ❌
          </span>
        ) : (
          // Atau menggunakan library ikon: <XCircle size={48} className="status-icon error" />
          // Menggunakan emoji sederhana sebagai ikon
          <span
            role="img"
            aria-label="Success icon"
            className="status-icon success"
          >
            ✅
          </span>
        )}
      </div>
      {/* Judul Halaman Sukses */}{" "}
      <h2>
        {mainTitleText} {/* Menggunakan teks judul yang dinamis */}{" "}
      </h2>
      {/* Pesan Utama */}{" "}
      <p>
        {mainMessageText} {/* Menggunakan teks pesan yang dinamis */}{" "}
      </p>
      {/* Tampilkan pesan error jika ada kegagalan parsial */}{" "}
      {hasError && (
        <p className="error-message">
          {" "}
          {/* Menggunakan kelas CSS untuk pesan error */} Detail: {deleteError}{" "}
          {/* Tampilkan detail error */}{" "}
        </p>
      )}
      {/* Tombol Kembali ke Dashboard */}{" "}
      <button
        onClick={onBackToDashboard}
        aria-label="Kembali ke Dashboard" // Tambahkan aria-label untuk aksesibilitas // Gaya tombol sekarang dikelola oleh CSS class di successpage.css
      >
        {/* Ikon panah kiri (menggunakan emoji sederhana) */}
        <span role="img" aria-label="Left arrow">
          🡐
        </span>
        Kembali ke Dashboard{" "}
      </button>{" "}
    </div> // Akhir success-page-container
  );
}
