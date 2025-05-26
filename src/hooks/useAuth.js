// src/hooks/useAuth.js - NEW VERSION using Google Identity Services (GIS)
import { useState, useEffect, useCallback, useRef } from "react";
// Library GAPI (untuk gapi.client) dan GIS (untuk google.accounts)
// diasumsikan tersedia secara global setelah scriptnya dimuat di index.html.

/**
 * Hook kustom untuk mengelola status autentikasi menggunakan Google Identity Services (GIS) OAuth 2.0 client.
 * @param {function} onLoginSuccess - Callback yang dipanggil setelah login berhasil. Defaultnya adalah fungsi kosong.
 * @param {object} readiness - Objek yang menunjukkan kesiapan library eksternal, cth: { isGISReady: boolean, isGapiClientReady: boolean }.
 * @param {string} clientId - Client ID Google Cloud untuk aplikasi Anda.
 * @param {string} scopes - String berisi daftar scope OAuth 2.0 yang diminta, dipisahkan spasi.
 * @returns {object} Mengembalikan objek dengan status login, token akses, profil pengguna, status loading, error, dan fungsi handler.
 */
export const useAuth = (onLoginSuccess = () => { }, readiness, clientId, scopes) => {
    // State untuk status login aplikasi
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // State untuk token akses OAuth 2.0
    const [accessToken, setAccessToken] = useState(null);
    // State untuk data profil pengguna dari YouTube API
    const [userProfile, setUserProfile] = useState(null);
    // State untuk status loading proses autentikasi (inisialisasi, login, fetch profil)
    const [authLoading, setAuthLoading] = useState(true); // Mulai dengan true untuk proses inisialisasi awal
    // State untuk menyimpan error yang mungkin terjadi
    const [error, setError] = useState(null);

    // Ref untuk menyimpan instance token client GIS agar persisten antar render
    const tokenClient = useRef(null);
    // Ref untuk melacak apakah komponen masih ter-mount, untuk mencegah update state pada unmounted component
    const isMounted = useRef(true);

    // Effect untuk mengatur isMounted.current saat komponen mount dan unmount
    useEffect(() => {
        isMounted.current = true; // Set true saat komponen mount
        return () => {
            isMounted.current = false; // Set false saat komponen unmount (cleanup)
        };
    }, []); // Dijalankan sekali saat mount dan cleanup saat unmount

    // Callback yang dipanggil oleh GIS setelah requestAccessToken()
    const handleAccessTokenResponse = useCallback(async (tokenResponse) => {
        console.log("GIS Access Token Response received:", tokenResponse);
        if (!isMounted.current) {
            console.log("useAuth: Component unmounted, skipping access token response processing.");
            return; // Hentikan jika komponen sudah tidak ter-mount
        }

        setAuthLoading(true);
        setError(null); // Reset error sebelumnya

        if (tokenResponse.error) {
            console.error("GIS Access Token Error:", tokenResponse.error);
            let errorMessage = `Authentication failed: ${tokenResponse.error}`;
            if (tokenResponse.error === 'popup_closed_by_user' || tokenResponse.error === 'access_denied') {
                console.log("Login process cancelled or denied by user.");
                errorMessage = "Login process cancelled by user.";
            }
            if (isMounted.current) {
                setError(new Error(errorMessage));
                setIsLoggedIn(false);
                setAccessToken(null);
                setUserProfile(null);
                setAuthLoading(false);
            }
            return;
        }

        const token = tokenResponse.access_token;
        if (isMounted.current) {
            setAccessToken(token);
            setIsLoggedIn(true); // Pengguna berhasil mendapatkan token
        }

        // Ambil profil pengguna jika GAPI client siap
        if (!readiness.isGapiClientReady || typeof gapi === 'undefined' || !gapi.client || !gapi.client.youtube) {
            console.warn("GIS Auth Callback: GAPI client or YouTube API not ready to fetch profile.");
            if (isMounted.current) {
                setUserProfile(null); // Profil tidak bisa diambil saat ini
                setAuthLoading(false); // Selesai loading (meskipun profil gagal)
            }
            // Panggil onLoginSuccess meskipun profil null, token tetap ada
            if (typeof onLoginSuccess === 'function') {
                onLoginSuccess(token, null);
            }
            return;
        }

        try {
            // Pastikan gapi.client.setToken ada sebelum dipanggil
            if (gapi.client.setToken) {
                gapi.client.setToken({ access_token: token });
            } else {
                console.warn("gapi.client.setToken is not available. Token might not be set for subsequent GAPI calls.");
            }

            console.log("Fetching user profile using GAPI client...");
            const profileResponse = await gapi.client.youtube.channels.list({
                part: 'snippet',
                mine: true
            });

            if (!isMounted.current) return; // Cek lagi setelah await

            const profileData = profileResponse.result;

            if (profileData.error) {
                console.error("GIS Auth Callback: Error fetching user profile:", profileData.error);
                throw new Error(`Failed to fetch user profile: ${profileData.error.message || profileResponse.statusText || 'Unknown GAPI error'}`);
            }

            if (profileData.items && profileData.items.length > 0) {
                const basicProfile = profileData.items[0].snippet;
                const profile = {
                    id: profileData.items[0].id,
                    name: basicProfile.title,
                    imageUrl: basicProfile.thumbnails?.high?.url || basicProfile.thumbnails?.default?.url || '',
                };
                if (isMounted.current) setUserProfile(profile);
                console.log("User profile fetched:", profile);
                if (typeof onLoginSuccess === 'function') {
                    onLoginSuccess(token, profile);
                }
            } else {
                console.warn("GIS Auth Callback: Could not fetch user profile details (no items found).");
                if (isMounted.current) setUserProfile(null);
                if (typeof onLoginSuccess === 'function') {
                    onLoginSuccess(token, null);
                }
            }
        } catch (profileError) {
            console.error("GIS Auth Callback: Exception during profile fetch:", profileError);
            if (isMounted.current) {
                setError(profileError);
                setUserProfile(null);
            }
            if (typeof onLoginSuccess === 'function') {
                onLoginSuccess(token, null); // Kirim token, tapi profil null karena error
            }
        } finally {
            if (isMounted.current) {
                setAuthLoading(false);
            }
        }
    }, [onLoginSuccess, readiness.isGapiClientReady]); // Dependencies: onLoginSuccess dan readiness.isGapiClientReady. Setter state tidak perlu.

    // Effect untuk inisialisasi GIS OAuth2 Token Client
    useEffect(() => {
        console.log("useAuth Effect: Checking GIS library readiness for client init...");

        if (readiness.isGISReady && typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
            console.log("useAuth Effect: GIS library ready, initializing Token Client...");
            try {
                tokenClient.current = google.accounts.oauth2.initTokenClient({
                    client_id: clientId,
                    scope: scopes,
                    callback: handleAccessTokenResponse, // Callback yang sudah di-memoize
                });
                console.log("useAuth Effect: GIS Token Client initialized.");
                if (isMounted.current) setAuthLoading(false); // Inisialisasi GIS selesai, loading awal selesai
            } catch (initError) {
                console.error("useAuth Effect: Error initializing GIS Token Client:", initError);
                if (isMounted.current) {
                    setError(initError);
                    setAuthLoading(false);
                }
            }
        } else if (!readiness.isGISReady) {
            console.log("useAuth Effect: GIS library not ready yet. Waiting...");
            if (isMounted.current) setAuthLoading(true); // Pastikan loading tetap true jika GIS belum siap
        } else {
            // Kasus di mana readiness.isGISReady true tapi objek google tidak ada (seharusnya tidak terjadi jika readiness dikelola dengan benar)
            console.error("useAuth Effect: GIS ready flag is true, but 'google.accounts.oauth2' was not found.");
            if (isMounted.current) {
                setError(new Error("Google Identity Services library not fully available."));
                setAuthLoading(false);
            }
        }
        // Tidak ada cleanup spesifik yang diperlukan untuk tokenClient dari GIS
    }, [readiness.isGISReady, clientId, scopes, handleAccessTokenResponse]); // Dependencies effect

    // Handler untuk memicu proses login
    const handleLogin = useCallback(() => {
        console.log("handleLogin called. Attempting to request access token...");
        if (!readiness.isGISReady || !tokenClient.current) {
            console.warn("handleLogin: GIS Token Client not ready or not initialized.");
            setError(new Error("Authentication service not ready. Please wait a moment and try again."));
            // Tidak set authLoading true di sini karena request tidak bisa dimulai
            return;
        }

        setAuthLoading(true); // Mulai proses loading untuk login
        setError(null); // Hapus error sebelumnya

        try {
            tokenClient.current.requestAccessToken({
                // prompt: 'consent' // Bisa ditambahkan jika ingin selalu menampilkan dialog consent
            });
            // Hasil akan ditangani oleh handleAccessTokenResponse
        } catch (requestError) {
            console.error("handleLogin: Error initiating access token request:", requestError);
            setError(requestError);
            setAuthLoading(false); // Gagal memulai request, hentikan loading
        }
    }, [readiness.isGISReady]); // tokenClient.current tidak perlu di deps, setter state juga tidak.

    // Handler untuk logout (membersihkan state lokal)
    const handleLogout = useCallback(() => {
        console.log("handleLogout called. Clearing local state.");
        // Tidak perlu cek isMounted karena ini handler sinkron yang dipanggil dari UI
        setAuthLoading(true); // Set loading untuk proses logout

        setAccessToken(null);
        setIsLoggedIn(false);
        setUserProfile(null);
        setError(null);

        // Hapus token dari gapi.client jika sudah disetel
        if (typeof gapi !== 'undefined' && gapi.client && gapi.client.setToken) {
            gapi.client.setToken(null);
            console.log("GAPI client token cleared.");
        }
        // Pertimbangkan google.accounts.oauth2.revoke(accessToken, () => {...}) jika ingin mencabut token sepenuhnya
        // Namun, ini adalah operasi async dan mungkin memerlukan penanganan state loading/error tambahan.
        // Untuk logout sederhana sisi klien, menghapus token dari state sudah cukup.

        console.log("Logout successful (local state cleared).");
        setAuthLoading(false);
    }, []); // Setter state stabil, tidak perlu dependensi

    return {
        isLoggedIn,
        accessToken,
        userProfile,
        authLoading,
        error,
        handleLogin,
        handleLogout,
    };
};
