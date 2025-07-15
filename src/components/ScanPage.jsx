// src/components/ScanPage.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import "../styles/scanpage.css";
import { useCommentDetection } from "../hooks/useCommentDetection";

function ScanPage({
  video,
  onBackToDashboard,
  accessToken,
  onDeleteComments,
  isDeleting,
  deleteError,
  rawComments,
  commentsLoading,
  commentsError,
}) {
  const [displayMode, setDisplayMode] = useState("none"); // none, judol, toxic, flagged_only, clean

  const { detectedComments, loadingDetections, detectionError } =
    useCommentDetection(rawComments, accessToken);

  useEffect(() => {
    setCheckedComments([]);
    setDisplayMode("none");
  }, [video]);

  // --- Logika Filter Komentar (di-memoize) ---
  const filteredComments = useMemo(() => {
    console.log(
      "ScanPage: Calculating filteredComments based on displayMode:",
      displayMode
    );
    return detectedComments.filter((comment) => {
      switch (displayMode) {
        case "judol":
          return comment.isJudolSpam;
        case "toxic":
          return comment.isToxic;
        case "flagged_only":
          return comment.isFlagged && !comment.isJudolSpam && !comment.isToxic;
        case "clean":
          return !comment.isFlagged;
        case "none":
        default:
          return true;
      }
    });
  }, [detectedComments, displayMode]);

  // --- Kalkulasi Jumlah Komentar untuk Setiap Tombol Filter (di-memoize) ---
  const {
    judolSpamCount,
    toxicCount,
    flaggedOnlyCount,
    cleanCount,
    allCommentsCount,
  } = useMemo(() => {
    let judol = 0,
      toxic = 0,
      flaggedOnly = 0,
      clean = 0;

    detectedComments.forEach((comment) => {
      if (comment.isJudolSpam) judol++;
      if (comment.isToxic) toxic++;
      if (comment.isFlagged && !comment.isJudolSpam && !comment.isToxic) {
        flaggedOnly++;
      }
      if (!comment.isFlagged) {
        clean++;
      }
    });

    return {
      judolSpamCount: judol,
      toxicCount: toxic,
      flaggedOnlyCount: flaggedOnly,
      cleanCount: clean,
      allCommentsCount: detectedComments.length,
    };
  }, [detectedComments]);

  const [checkedComments, setCheckedComments] = useState([]);

  const handleToggleCheck = useCallback((commentId) => {
    setCheckedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  }, []);

  const handleToggleCheckAllVisible = useCallback(() => {
    const visibleCommentIds = filteredComments.map((comment) => comment.id);
    const allCurrentlyVisibleChecked =
      visibleCommentIds.length > 0 &&
      visibleCommentIds.every((id) => checkedComments.includes(id));

    if (allCurrentlyVisibleChecked) {
      setCheckedComments((prev) =>
        prev.filter((id) => !visibleCommentIds.includes(id))
      );
    } else {
      setCheckedComments((prev) => [
        ...new Set([...prev, ...visibleCommentIds]),
      ]);
    }
  }, [filteredComments, checkedComments]);

  const handleDeleteChecked = useCallback(() => {
    if (checkedComments.length === 0) {
      console.warn("ScanPage: No comments selected for deletion.");
      return;
    }
    onDeleteComments(checkedComments);
  }, [checkedComments, onDeleteComments]);

  // --- Handlers untuk mengubah mode filter ---
  const handleFilterJudol = useCallback(() => setDisplayMode("judol"), []);
  const handleFilterToxic = useCallback(() => setDisplayMode("toxic"), []);
  const handleFilterFlaggedOnly = useCallback(
    () => setDisplayMode("flagged_only"),
    []
  );
  const handleFilterClean = useCallback(() => setDisplayMode("clean"), []);
  const handleFilterAll = useCallback(() => setDisplayMode("none"), []);

  // Tampilan loading dan error (tidak ada perubahan di sini)
  if (commentsLoading) {
    return (
      <div className="scan-page-loading">
        <div className="loading-spinner"></div>
        <p>Mengambil komentar ({rawComments.length} sudah ada)...</p>
      </div>
    );
  }
  if (loadingDetections && !commentsError) {
    return (
      <div className="scan-page-loading">
        <div className="loading-spinner"></div>
        <p>Mendeteksi komentar ({detectedComments.length} diproses)...</p>
      </div>
    );
  }
  if (commentsError || detectionError) {
    const error = commentsError || detectionError;
    return (
      <div className="scan-page-error">
        <p>Gagal memuat data: {error.message || String(error)}</p>
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
          <img
            src={video.thumbnail}
            alt={`Thumbnail ${video.title}`}
            className="video-thumbnail-scan"
          />
          <div className="video-details-scan">
            <h2>{video.title}</h2>
          </div>
        </div>
      )}
      <div className="scan-controls">
        <div className="scan-detection-buttons">
          <button
            onClick={handleFilterJudol}
            disabled={isDeleting}
            className={`detection-button ${
              displayMode === "judol" ? "active" : ""
            }`}
          >
            Spam/Judol ({judolSpamCount})
          </button>
          <button
            onClick={handleFilterToxic}
            disabled={isDeleting}
            className={`detection-button ${
              displayMode === "toxic" ? "active" : ""
            }`}
          >
            Toxic ({toxicCount})
          </button>
          {/* ## PERUBAHAN DI SINI ## */}
          <button
            onClick={handleFilterFlaggedOnly}
            disabled={isDeleting}
            className={`detection-button ${
              // Diubah dari 'outline-button'
              displayMode === "flagged_only" ? "active" : ""
            }`}
          >
            Ditandai ({flaggedOnlyCount})
          </button>
          <button
            onClick={handleFilterClean}
            disabled={isDeleting}
            className={`outline-button ${
              displayMode === "clean" ? "active" : ""
            }`}
          >
            Komen Bersih ({cleanCount})
          </button>
          <button
            onClick={handleFilterAll}
            disabled={isDeleting}
            className={`outline-button ${
              displayMode === "none" ? "active" : ""
            }`}
          >
            Semua Komen ({allCommentsCount})
          </button>
        </div>
      </div>
      <div className="comments-separator"></div>
      <div className="comments-list-container scrollable-box">
        {detectedComments.length > 0 && filteredComments.length === 0 && (
          <div className="no-comments-message">
            Tidak ada komentar yang cocok dengan filter saat ini.
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
                  comment.isFlagged && !comment.isToxic && !comment.isJudolSpam
                    ? "is-flagged"
                    : ""
                } ${!comment.isFlagged ? "is-clean" : ""}`}
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
                        Spam/Judol
                      </span>
                    )}
                    {comment.isToxic && (
                      <span className="detection-label toxic">
                        Toxic ({comment.toxicityScore?.toFixed(2)})
                      </span>
                    )}
                    {comment.isFlagged &&
                      !comment.isJudolSpam &&
                      !comment.isToxic && (
                        <span className="detection-label flagged">
                          Ditandai
                        </span>
                      )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {filteredComments.length > 0 && (
        <div className="bottom-controls">
          <button
            onClick={handleToggleCheckAllVisible}
            disabled={isDeleting}
            className="select-all-button check-all-button outline-button"
          >
            {filteredComments.length > 0 &&
            filteredComments.every((c) => checkedComments.includes(c.id))
              ? "Batalkan Centang Semua"
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
                : `Hapus Dicentang (${checkedComments.length})`}
            </button>
          )}
          {deleteError && (
            <div className="delete-error-message">
              {deleteError.message || String(deleteError)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default React.memo(ScanPage);
