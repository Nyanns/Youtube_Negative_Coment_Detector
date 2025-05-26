// src/components/Dashboard.jsx
import React from "react";
// Impor ikon dari react-icons. Sesuaikan prefix (misal: Fa, Md, Io) dan nama ikon
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa"; // Contoh ikon dari Font Awesome
// --- KOREKSI JALUR IMPOR CSS ---
import "../styles/dashboard.css"; // Impor file CSS untuk Dashboard
// --- END KOREKSI ---

// Komponen Dashboard untuk menampilkan daftar video pengguna
// Menerima props:
// - videos: Array objek video
// - videosLoading: Boolean, status loading dari useVideos
// - videosError: Error object, error dari useVideos
// - onSelectVideo: Fungsi callback saat pengguna memilih video
// - onLogout: Fungsi callback saat pengguna logout
// - userProfile: Objek data profil pengguna
// isDarkMode dan toggleDarkMode props DIHAPUS
export default function Dashboard({
  videos,
  videosLoading, // Terima prop loading
  videosError, // Terima prop error (opsional, error utama ditangani di App)
  onSelectVideo,
  onLogout,
  userProfile,
  // isDarkMode,     // Prop dark mode DIHAPUS
  // toggleDarkMode  // Prop toggle dark mode DIHAPUS
}) {
  // Jumlah item skeleton yang akan ditampilkan saat loading
  const skeletonItemCount = 12; // Tampilkan 12 item skeleton

  return (
    // Kontainer utama halaman Dashboard
    // Menggunakan display flex/grid di CSS untuk tata letak sidebar dan konten utama
    <div className="dashboard-page">
      {/* --- Sidebar Kiri --- */}
      <aside className="dashboard-sidebar">
        {/* Konten Sidebar: Gambar Profil, Nama, Tombol Logout */}
        <div className="sidebar-profile-section">
          {/* Tampilkan gambar profil atau ikon default jika tidak ada */}
          {userProfile?.imageUrl ? (
            <img
              src={userProfile.imageUrl}
              alt={userProfile?.name || "User"}
              className="profile-image-sidebar" // Class baru untuk gambar di sidebar
            />
          ) : (
            // Tampilkan ikon user default jika tidak ada gambar profil
            <FaUserCircle className="profile-icon-sidebar" size={60} /> // Ikon lebih besar di sidebar
          )}
          {/* Tampilkan nama pengguna/channel */}
          {/* Menggunakan h3 atau p untuk nama di sidebar agar hierarki judul tetap rapi (h1 di konten utama) */}
          <h3 className="profile-name-sidebar">
            @{userProfile?.name || "Pengguna"}
          </h3>
        </div>

        {/* Area Navigasi Sidebar (Opsional, jika nanti ada menu lain) */}
        {/* <nav className="sidebar-nav"> ... </nav> */}

        {/* Tombol Logout di bagian bawah sidebar (akan ditata di CSS) */}
        <button onClick={onLogout} className="logout-button-sidebar">
          <FaSignOutAlt style={{ marginRight: "8px" }} /> Logout{" "}
          {/* Ikon Logout */}
        </button>
      </aside>{" "}
      {/* --- Akhir Sidebar --- */}
      {/* --- Konten Utama Kanan --- */}
      <main className="dashboard-main-content">
        {/* Konten Utama: Judul, Teks Deskriptif, Kotak Daftar Video */}
        {/* Judul Utama */}
        <h1>ClarityTube</h1>
        {/* --- Teks Deskriptif di Tengah (Rata Kiri sekarang) --- */}
        {/* Tampilkan teks ini hanya jika tidak sedang loading dan tidak ada error */}
        {!videosLoading && !videosError && (
          <p className="dashboard-description">
            Moderasi Komentar YouTube dengan Cepat & Cerdas
            <br />
            Mulai deteksi komentar spam, kasar, atau mencurigakan hanya dengan
            sekali klik.
          </p>
        )}
        {/* --- Tambahkan elemen garis pemisah di sini --- */}
        {/* Tampilkan garis hanya jika ada video atau sedang loading skeleton */}
        {(videosLoading || videos.length > 0) && (
          <div className="video-list-separator"></div>
        )}
        {/* --- Kontainer Daftar Video (sama seperti sebelumnya, tapi sekarang di dalam main content) --- */}
        <div className="dashboard-content-box">
          {/* Tampilkan pesan jika tidak ada video (setelah loading selesai dan tidak ada error) */}
          {!videosLoading && videos.length === 0 && !videosError && (
            <p className="no-videos-message">
              Tidak ada video yang dapat dikelola komentar spamnya di channel
              Anda.
            </p>
          )}

          {/* --- Tampilkan Skeleton Loading atau Daftar Video --- */}
          {videosLoading ? (
            // Tampilkan Skeleton Loading saat videosLoading true
            // video-list-container dan video-list sekarang di dalam dashboard-content-box
            <div className="video-list-container">
              <ul className="video-list">
                {/* Buat sejumlah item skeleton */}
                {Array.from({ length: skeletonItemCount }).map((_, index) => (
                  <li key={index} className="video-item">
                    <div className="video-card skeleton">
                      {" "}
                      {/* Tambahkan class skeleton */}
                      <div className="skeleton-thumbnail"></div>{" "}
                      {/* Placeholder thumbnail */}
                      <div className="skeleton-details">
                        <div className="skeleton-title"></div>{" "}
                        {/* Placeholder judul */}
                      </div>
                      <div className="skeleton-button-placeholder"></div>{" "}
                      {/* Placeholder tombol terpisah */}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            // Tampilkan Daftar Video saat videosLoading false
            videos.length > 0 && (
              // video-list-container dan video-list sekarang di dalam dashboard-content-box
              <div className="video-list-container">
                <ul className="video-list">
                  {/* Mapping array videos untuk menampilkan setiap item video sebagai CARD */}
                  {videos.map((video) => (
                    <li key={video.id} className="video-item">
                      <div
                        className="video-card"
                        onClick={() => onSelectVideo(video)}
                        role="button"
                        tabIndex="0"
                      >
                        <div className="video-info">
                          {video.thumbnail && (
                            <img
                              src={video.thumbnail}
                              alt={`Thumbnail ${video.title}`}
                              className="video-thumbnail"
                              loading="lazy" // --- Tambahkan lazy loading ---
                            />
                          )}
                          <div className="video-details">
                            <h4 className="video-title">{video.title}</h4>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectVideo(video);
                          }}
                          className="select-video-button"
                        >
                          Scan Komentar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>{" "}
        {/* --- Akhir Kontainer Daftar Video --- */}
      </main>{" "}
      {/* --- Akhir Konten Utama --- */}
    </div>
  );
}
