// src/components/ScanPage.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react"; // Tambahkan useMemo
import "../styles/scanpage.css"; // Pastikan file CSS ini ada
// Import hook deteksi komentar kustom yang telah dioptimasi
import { useCommentDetection } from "../hooks/useCommentDetection";

// Komponen ScanPage untuk menampilkan dan mengelola komentar video
// Menerima berbagai props dari App.jsx untuk data dan fungsionalitas
function ScanPage({
  video,
  onBackToDashboard,
  accessToken,
  onDeleteComments,
  isDeleting,
  deleteError,
  // Props dari App.jsx (dari useCommentManagement)
  rawComments,
  commentsLoading,
  commentsError,
}) {
  // State untuk komentar yang dicentang (untuk dihapus)
  const [checkedComments, setCheckedComments] = useState([]);
  // State untuk melacak mode tampilan/filter yang aktif
  const [displayMode, setDisplayMode] = useState("none");

  // --- Menggunakan hook useCommentDetection ---
  const {
    detectedComments, // Array komentar dengan properti deteksi
    loadingDetections, // Boolean, status loading deteksi
    detectionError, // Error object jika terjadi kesalahan saat deteksi
  } = useCommentDetection(rawComments, accessToken); // Teruskan rawComments dari props

  // Effect untuk mereset centang dan display mode ketika video (dan rawComments implisit) berubah
  useEffect(() => {
    console.log(
      "ScanPage: Video prop changed, resetting checked comments and display mode."
    );
    setCheckedComments([]);
    setDisplayMode("none");
  }, [video]); // Dependensi pada 'video' karena ini menandakan konten utama telah berubah.

  // --- Logika Filter Komentar yang Ditampilkan (di-memoize) ---
  const filteredComments = useMemo(() => {
    console.log(
      "ScanPage: Calculating filteredComments based on displayMode:",
      displayMode
    );
    return detectedComments.filter((comment) => {
      if (displayMode === "judol") {
        return comment.isJudolSpam;
      }
      if (displayMode === "toxic") {
        return comment.isToxic;
      }
      if (displayMode === "combined") {
        return comment.isFlagged; // isFlagged adalah gabungan isJudolSpam ATAU isToxic
      }
      return true; // 'none' atau mode tidak dikenal, tampilkan semua
    });
  }, [detectedComments, displayMode]);

  // --- Kalkulasi Jumlah Komentar untuk Tombol Filter (di-memoize) ---
  const judolSpamCount = useMemo(() => {
    console.log("ScanPage: Calculating judolSpamCount");
    return detectedComments.filter((comment) => comment.isJudolSpam).length;
  }, [detectedComments]);

  const toxicCount = useMemo(() => {
    console.log("ScanPage: Calculating toxicCount");
    return detectedComments.filter((comment) => comment.isToxic).length;
  }, [detectedComments]);

  const combinedCount = useMemo(() => {
    console.log("ScanPage: Calculating combinedCount (isFlagged)");
    return detectedComments.filter((comment) => comment.isFlagged).length;
  }, [detectedComments]);

  const allCommentsCount = useMemo(() => {
    console.log("ScanPage: Calculating allCommentsCount");
    return detectedComments.length;
  }, [detectedComments]);

  // --- Logika Centang Komentar ---
  const handleToggleCheck = useCallback((commentId) => {
    setCheckedComments((prevChecked) =>
      prevChecked.includes(commentId)
        ? prevChecked.filter((id) => id !== commentId)
        : [...prevChecked, commentId]
    );
  }, []); // setCheckedComments dijamin stabil oleh React

  const handleToggleCheckAllVisible = useCallback(() => {
    const visibleCommentIds = filteredComments.map((comment) => comment.id);
    // Cek apakah semua komentar yang terlihat saat ini sudah dicentang
    const allCurrentlyVisibleChecked =
      visibleCommentIds.length > 0 && // Pastikan ada komentar yang terlihat
      visibleCommentIds.every((id) => checkedComments.includes(id));

    if (allCurrentlyVisibleChecked) {
      // Jika semua yang terlihat sudah dicentang, maka batalkan centang hanya pada yang terlihat
      setCheckedComments((prevChecked) =>
        prevChecked.filter((id) => !visibleCommentIds.includes(id))
      );
    } else {
      // Jika tidak semua yang terlihat dicentang (atau tidak ada yang dicentang),
      // maka centang semua yang terlihat (tambahkan ke yang sudah ada tanpa duplikasi)
      setCheckedComments((prevChecked) => [
        ...new Set([...prevChecked, ...visibleCommentIds]),
      ]);
    }
  }, [filteredComments, checkedComments]); // Dependensi: filteredComments dan checkedComments

  const handleDeleteChecked = useCallback(() => {
    if (checkedComments.length === 0) {
      // TODO: Ganti alert dengan UI non-blocking (misal, modal atau pesan di UI)
      console.warn("ScanPage: Tidak ada komentar yang dipilih untuk dihapus.");
      // Anda bisa menampilkan pesan di UI di sini
      return;
    }
    onDeleteComments(checkedComments);
  }, [checkedComments, onDeleteComments]);

  // --- Handler untuk mengubah mode tampilan/filter ---
  const handleFilterJudol = useCallback(() => setDisplayMode("judol"), []);
  const handleFilterToxic = useCallback(() => setDisplayMode("toxic"), []);
  const handleFilterCombined = useCallback(
    () => setDisplayMode("combined"),
    []
  );
  const handleFilterAll = useCallback(() => setDisplayMode("none"), []);

  // Tampilan loading utama untuk komentar atau deteksi
  if (commentsLoading) {
    return (
      <div className="scan-page-loading">
        <div className="loading-spinner"></div>
        <p>
          Mengambil komentar dari YouTube ({rawComments.length} sudah ada)...
        </p>
      </div>
    );
  }
  if (loadingDetections && !commentsError) {
    // Hanya tampilkan loading deteksi jika fetch komentar selesai & tidak error
    return (
      <div className="scan-page-loading">
        <div className="loading-spinner"></div>
        <p>Mendeteksi komentar ({detectedComments.length} diproses)...</p>
      </div>
    );
  }

  // Tampilan error utama
  if (commentsError) {
    return (
      <div className="scan-page-error">
        <p>
          Gagal mengambil komentar:{" "}
          {commentsError.message || String(commentsError)}
        </p>
        <button onClick={onBackToDashboard} className="back-button">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }
  if (detectionError && !loadingDetections) {
    // Hanya tampilkan error deteksi jika proses deteksi selesai
    return (
      <div className="scan-page-error">
        <p>
          Gagal melakukan deteksi komentar:{" "}
          {detectionError.message || String(detectionError)}
        </p>
        <button onClick={onBackToDashboard} className="back-button">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="scan-page">
      <button onClick={onBackToDashboard} className="back-button">
        Kembali ke Dashboard
      </button>
      {video && (
        <div className="video-info-scan">
          {video.thumbnail && (
            <img
              src={video.thumbnail}
              alt={`Thumbnail ${video.title}`}
              className="video-thumbnail-scan"
            />
          )}
          <div className="video-details-scan">
            <h2>{video.title}</h2>
          </div>
        </div>
      )}
      <div className="scan-controls">
        <div className="scan-detection-buttons">
          <button
            onClick={handleFilterJudol}
            disabled={isDeleting || detectedComments.length === 0}
            className={`detection-button ${
              displayMode === "judol" ? "active" : ""
            }`}
          >
            Tampilkan Judol/Spam ({judolSpamCount})
          </button>
          <button
            onClick={handleFilterToxic}
            disabled={isDeleting || detectedComments.length === 0}
            className={`detection-button ${
              displayMode === "toxic" ? "active" : ""
            }`}
          >
            Tampilkan Toxic/Negatif ({toxicCount})
          </button>
          <button
            onClick={handleFilterCombined}
            disabled={isDeleting || detectedComments.length === 0}
            className={`outline-button ${
              displayMode === "combined" ? "active" : ""
            }`}
          >
            Tampilkan Gabungan ({combinedCount})
          </button>
          {(displayMode !== "none" || detectedComments.length > 0) && (
            <button
              onClick={handleFilterAll}
              disabled={isDeleting}
              className={`outline-button ${
                displayMode === "none" ? "active" : ""
              }`}
            >
              Tampilkan Semua ({allCommentsCount})
            </button>
          )}
        </div>
      </div>
      <div className="comments-separator"></div>
      <div className="comments-list-container scrollable-box">
        {/* Kondisi ini disederhanakan karena loading utama sudah ditangani di atas */}
        {rawComments.length === 0 && !commentsLoading && !loadingDetections && (
          <div className="no-comments-message">
            Tidak ada komentar ditemukan untuk video ini.
          </div>
        )}
        {rawComments.length > 0 &&
          filteredComments.length === 0 &&
          !commentsLoading &&
          !loadingDetections && (
            <div className="no-comments-message">
              Tidak ada komentar yang cocok dengan filter atau hasil deteksi
              saat ini.
            </div>
          )}

        {filteredComments.length > 0 && (
          <ul className="comments-list">
            {filteredComments.map((comment) => (
              <li
                key={comment.id}
                className={`comment-item ${
                  comment.isJudolSpam ? "is-judol-spam" : ""
                } ${comment.isToxic ? "is-toxic" : ""} ${
                  comment.isFlagged ? "is-flagged" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={checkedComments.includes(comment.id)}
                  onChange={() => handleToggleCheck(comment.id)}
                  disabled={isDeleting}
                  className="comment-checkbox"
                />
                <div className="comment-content">
                  <div className="comment-author">{comment.author}</div>
                  <div className="comment-text">{comment.text}</div>
                  <div className="comment-meta">
                    {comment.isJudolSpam && (
                      <span className="detection-label judol-spam">
                        Judol/Spam
                      </span>
                    )}
                    {comment.isToxic && (
                      <span className="detection-label toxic">
                        Toxic (
                        {comment.toxicityScore !== null
                          ? comment.toxicityScore.toFixed(2)
                          : "N/A"}
                        )
                      </span>
                    )}
                    {comment.isFlagged &&
                      !comment.isJudolSpam &&
                      !comment.isToxic && (
                        <span className="detection-label flagged">
                          Ditandai
                        </span>
                      )}
                    {import.meta.env.DEV && comment.perspectiveApiResults && (
                      <span className="detection-label debug-scores">
                        Scores: Tox=
                        {comment.toxicityScore?.toFixed(2) || "N/A"}, Ins=
                        {comment.insultScore?.toFixed(2) || "N/A"}, Prof=
                        {comment.profanityScore?.toFixed(2) || "N/A"}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {filteredComments.length > 0 &&
        !commentsLoading &&
        !loadingDetections && (
          <div className="bottom-controls">
            <button
              onClick={handleToggleCheckAllVisible}
              disabled={isDeleting}
              className="select-all-button check-all-button outline-button"
            >
              {/* Logika teks tombol "Centang Semua / Batalkan Centang Semua" disederhanakan */}
              {filteredComments.length > 0 &&
              filteredComments.every((id) => checkedComments.includes(id.id))
                ? "Batalkan Centang Semua Terlihat"
                : `Centang Semua Terlihat (${filteredComments.length})`}
            </button>

            {checkedComments.length > 0 && (
              <button
                onClick={handleDeleteChecked}
                disabled={isDeleting}
                className="delete-button"
              >
                {isDeleting
                  ? "Menghapus..."
                  : `Hapus yang Dicentang (${checkedComments.length})`}
              </button>
            )}
            {deleteError && ( // Menampilkan error penghapusan jika ada
              <div className="delete-error-message">
                {deleteError.message || String(deleteError)}
              </div>
            )}
          </div>
        )}
    </div>
  );
}

// Bungkus komponen dengan React.memo untuk optimasi render
// Ini hanya efektif jika props yang diterima stabil (primitive, atau memoized object/function)
export default React.memo(ScanPage);
