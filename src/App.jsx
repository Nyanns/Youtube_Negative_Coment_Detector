import React, { useState, useEffect, useCallback, useMemo } from "react"; // Tambahkan useMemo

// Import komponen halaman yang akan digunakan
import Home from "./components/Home"; // Pastikan path dan kapitalisasi benar (Home.jsx)
import Dashboard from "./components/Dashboard";
import ScanPage from "./components/ScanPage";
import SuccessPage from "./components/SuccessPage"; // Import komponen SuccessPage

// Import hook kustom kita
import { useAuth } from "./hooks/useAuth"; // GIS version
import { useVideos } from "./hooks/useVideos"; // Import useVideos hook
import { useCommentManagement } from "./hooks/useCommentManagement"; // Import hook baru

// Import library GAPI (masih perlu untuk gapi.client)
import { gapi } from "gapi-script";
// Objek global GIS (google.accounts) akan tersedia setelah script dimuat

// Ambil Client ID dari environment variables (pastikan nama VITE_... benar sesuai setup Bun/Vite)
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// Definisikan scope (izin akses) yang dibutuhkan aplikasi dari pengguna
const SCOPES =
  "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl";

function App() {
  // --- State Global Aplikasi (Managed by App) ---
  const [isGapiClientReady, setIsGapiClientReady] = useState(false);
  const [isGISReady, setIsGISReady] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [deletedCountOnSuccess, setDeletedCountOnSuccess] = useState(0);

  // --- Hooks Kustom ---
  const handleLoginSuccessInApp = useCallback((token, profile) => {
    console.log("Login successful in App!", token, profile);
  }, []);

  const {
    isLoggedIn,
    accessToken,
    userProfile,
    authLoading,
    error: authError,
    handleLogin,
    handleLogout,
  } = useAuth(
    handleLoginSuccessInApp,
    { isGISReady, isGapiClientReady },
    CLIENT_ID,
    SCOPES
  );

  const {
    videos,
    loading: videosLoading,
    error: videosError,
  } = useVideos(accessToken);

  const {
    rawComments,
    commentsLoading,
    commentsError,
    isDeletingComments,
    deleteCommentsError,
    deletedCommentIds,
    deleteComments,
  } = useCommentManagement(accessToken, selectedVideo?.id);

  // Menggunakan useMemo untuk memfilter komentar yang sudah dihapus.
  // Ini memastikan bahwa array filteredRawComments hanya dihitung ulang
  // jika rawComments atau deletedCommentIds berubah.
  const filteredRawComments = useMemo(() => {
    console.log("Calculating filteredRawComments..."); // Untuk debugging, bisa dihapus
    return rawComments.filter(
      (comment) => !deletedCommentIds.includes(comment.id)
    );
  }, [rawComments, deletedCommentIds]);

  const handleDeleteComments = useCallback(
    async (commentIdsToDelete) => {
      const { successCount } = await deleteComments(commentIdsToDelete);
      setDeletedCountOnSuccess(successCount);
      setShowSuccessPage(true);
    },
    [deleteComments] // deleteComments dari hook diharapkan stabil
  );

  const handleCancelScan = useCallback(() => {
    setSelectedVideo(null);
    setShowSuccessPage(false);
    setDeletedCountOnSuccess(0);
  }, []); // Setters dari useState dijamin stabil, dependensi bisa kosong

  const handleBackToDashboard = useCallback(() => {
    setShowSuccessPage(false);
    setDeletedCountOnSuccess(0);
    setSelectedVideo(null);
  }, []); // Setters dari useState dijamin stabil

  useEffect(() => {
    const initGapiClient = () => {
      if (typeof gapi !== "undefined" && gapi.client) {
        gapi.client
          .init({
            // clientId and scope di sini opsional jika GIS handle auth init
          })
          .then(() => gapi.client.load("youtube", "v3"))
          .then(() => {
            console.log("YouTube API v3 loaded successfully.");
            setIsGapiClientReady(true);
          })
          .catch((error) => {
            console.error(
              "Error initializing GAPI client or loading YouTube API:",
              error
            );
            alert(
              `Gagal memuat Google API Client atau YouTube API. Silakan coba refresh. Detail: ${
                error.details || error.message || String(error)
              }`
            );
            setIsGapiClientReady(false);
          });
      } else {
        console.error("GAPI script loaded but gapi.client is not available.");
        setIsGapiClientReady(false);
      }
    };

    const checkGISReady = () => {
      if (typeof window.google !== "undefined" && window.google.accounts) {
        setIsGISReady(true);
        return true;
      }
      return false;
    };

    if (checkGISReady()) {
      if (typeof gapi !== "undefined" && gapi.load) {
        gapi.load("client:auth2", initGapiClient);
      } else {
        console.error("GAPI script not available immediately.");
        setIsGapiClientReady(false); // Pastikan state diupdate jika gapi tidak ada
      }
    } else {
      const handleWindowLoad = () => {
        if (checkGISReady()) {
          if (typeof gapi !== "undefined" && gapi.load) {
            gapi.load("client:auth2", initGapiClient);
          } else {
            console.error("GAPI script not available on window load.");
            setIsGapiClientReady(false);
          }
        } else {
          console.error("GIS library still not ready after window load.");
          // Pertimbangkan menampilkan error kepada pengguna jika GIS gagal dimuat
          alert(
            "Gagal memuat layanan Google Sign-In. Silakan coba refresh halaman."
          );
          setIsGISReady(false); // Eksplisit set false
        }
      };
      window.addEventListener("load", handleWindowLoad);
      return () => {
        window.removeEventListener("load", handleWindowLoad);
      };
    }
  }, []); // Effect ini hanya berjalan sekali saat mount

  // --- Conditional Rendering (Routing Halaman) ---
  const areLibrariesReady = isGapiClientReady && isGISReady;
  const showLoadingScreen =
    !areLibrariesReady || authLoading || (isLoggedIn && videosLoading);

  if (showLoadingScreen) {
    // Pindahkan style ke class CSS jika sering digunakan atau kompleks
    return (
      <div className="app-loading-screen">
        {" "}
        {/* Contoh penggunaan class CSS */}
        <div className="loading-spinner" style={{ marginBottom: "15px" }}></div>
        {!areLibrariesReady && <p>Memuat layanan Google...</p>}
        {areLibrariesReady && authLoading && <p>Memproses autentikasi...</p>}
        {areLibrariesReady && !authLoading && isLoggedIn && videosLoading && (
          <p>Mengambil daftar video...</p>
        )}
        {authError && (
          <p className="error-message">
            {" "}
            {/* Contoh penggunaan class CSS */}
            Error Autentikasi: {authError.message}
          </p>
        )}
        {videosError && (
          <p className="error-message">
            Error Mengambil Video: {videosError.message}
          </p>
        )}
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Home onLogin={handleLogin} authLoading={authLoading} />;
  }

  if (videosError && !videosLoading) {
    return (
      <div className="app-error-screen">
        {" "}
        {/* Contoh penggunaan class CSS */}
        <p className="error-message large-error">
          Gagal memuat daftar video Anda.
        </p>
        <p className="error-detail">Detail Error: {videosError.message}</p>
        <button onClick={handleLogout} className="button error-logout-button">
          Logout
        </button>
      </div>
    );
  }

  if (showSuccessPage) {
    return (
      <SuccessPage
        onBackToDashboard={handleBackToDashboard}
        deleteError={deleteCommentsError}
        deletedCount={deletedCountOnSuccess}
      />
    );
  }

  if (selectedVideo) {
    return (
      <ScanPage
        video={selectedVideo}
        accessToken={accessToken}
        onDeleteComments={handleDeleteComments}
        isDeleting={isDeletingComments}
        deleteError={deleteCommentsError}
        rawComments={filteredRawComments} // Gunakan nilai yang sudah di-memoize
        commentsLoading={commentsLoading}
        commentsError={commentsError}
        onBackToDashboard={handleCancelScan}
      />
    );
  }

  return (
    <Dashboard
      videos={videos}
      videosLoading={videosLoading}
      videosError={videosError} // Untuk ditangani lebih lanjut di Dashboard jika perlu
      onSelectVideo={setSelectedVideo} // Setter state stabil
      onLogout={handleLogout} // Dari useAuth, diharapkan stabil
      userProfile={userProfile} // Dari useAuth
    />
  );
}

export default App;
