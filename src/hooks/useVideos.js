// src/hooks/useVideos.js
import { useState, useEffect } from "react";
// Diasumsikan objek global 'gapi' tersedia setelah script apis.google.com/js/api.js dimuat
// dan gapi.client sudah diinisialisasi di App.jsx.

// Hook untuk mengambil daftar video dari playlist 'uploads' channel YouTube pengguna yang sedang login
// Menerima accessToken sebagai input.
// Membutuhkan gapi.client.youtube untuk tersedia.
export const useVideos = (accessToken) => {
    // State untuk menyimpan daftar video yang berhasil diambil
    const [videos, setVideos] = useState([]);
    // State untuk status loading pengambilan video
    const [loading, setLoading] = useState(false);
    // State untuk menyimpan error jika terjadi
    const [error, setError] = useState(null);

    // Effect untuk memicu pengambilan video kapan pun accessToken berubah
    useEffect(() => {
        let isMounted = true; // Flag untuk melacak apakah effect masih aktif

        // Fungsi async di dalam useEffect untuk fetch data
        const fetchUserVideos = async () => {
            // Cek GAPI client readiness di awal fetchUserVideos juga, sebagai lapisan tambahan
            // meskipun idealnya App.jsx yang mengatur ini.
            if (typeof gapi === 'undefined' || !gapi.client || !gapi.client.youtube) {
                console.warn("useVideos (fetchUserVideos): GAPI client or youtube API not ready.");
                if (isMounted) {
                    setLoading(false);
                    // Tidak set error di sini, biarkan App.jsx menangani GAPI readiness error
                }
                return;
            }

            console.log("useVideos: Access token and GAPI client ready, starting fetch...");
            if (isMounted) {
                setLoading(true); // Set loading jadi true saat proses dimulai
                setError(null);   // Reset error state dari proses sebelumnya
            }

            try {
                // Penting: set token untuk permintaan gapi.client ini!
                // Pastikan gapi.client.setToken tersedia dan berfungsi
                if (gapi.client.setToken) {
                    gapi.client.setToken({ access_token: accessToken });
                } else {
                    console.warn("useVideos: gapi.client.setToken is not available. Token may not be set for GAPI requests.");
                    // Jika aplikasi Anda menggunakan cara lain untuk menyetel token global untuk gapi.client,
                    // atau jika token sudah disetel di level yang lebih tinggi (misal, saat init gapi.auth2),
                    // baris ini mungkin tidak krusial. Namun, untuk API call spesifik, ini adalah praktik yang aman.
                }

                // --- Langkah 1: Ambil ID playlist 'uploads' channel pengguna ---
                console.log("useVideos: Fetching channel details...");
                const channelResponse = await gapi.client.youtube.channels.list({
                    part: 'contentDetails', // Hanya butuh bagian contentDetails
                    mine: true             // Ambil channel milik user yang sedang login
                });

                if (!isMounted) return; // Cek setelah await pertama

                const channelData = channelResponse.result;

                if (channelData.error) {
                    console.error("useVideos: Error fetching channel details:", channelData.error);
                    throw new Error(`Failed to fetch channel details: ${channelData.error.message || channelResponse.status}`);
                }

                if (!channelData.items || channelData.items.length === 0 || !channelData.items[0].contentDetails?.relatedPlaylists?.uploads) {
                    console.warn("useVideos: Could not retrieve channel or uploads playlist info.");
                    if (isMounted) {
                        setVideos([]);
                        setLoading(false);
                        // setError(new Error("Channel or uploads playlist not found.")); // Opsional
                    }
                    return;
                }

                const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
                console.log("useVideos: Uploads Playlist ID found:", uploadsPlaylistId);

                // --- Langkah 2: Ambil SEMUA item video dari playlist 'uploads' menggunakan paginasi ---
                let allVideos = [];
                let nextPageToken = null;

                console.log("useVideos: Starting fetching playlist items with pagination...");
                do {
                    if (!isMounted) return; // Cek di awal setiap iterasi loop

                    const playlistResponse = await gapi.client.youtube.playlistItems.list({
                        part: 'snippet',
                        playlistId: uploadsPlaylistId,
                        maxResults: 50,
                        pageToken: nextPageToken
                    });

                    if (!isMounted) return; // Cek setelah await di dalam loop

                    const playlistData = playlistResponse.result;

                    if (playlistData.error) {
                        console.error("useVideos: Error fetching playlist items page:", playlistData.error);
                        throw new Error(`Failed to fetch playlist items page: ${playlistData.error.message || playlistResponse.status}`);
                    }

                    if (playlistData.items && playlistData.items.length > 0) {
                        const videosOnPage = playlistData.items
                            .filter(item => item.snippet?.resourceId?.videoId) // Pastikan videoId ada
                            .map(item => ({
                                id: item.snippet.resourceId.videoId,
                                title: item.snippet.title || 'Untitled Video',
                                description: item.snippet.description || '',
                                publishedAt: item.snippet.publishedAt,
                                thumbnail: item.snippet.thumbnails?.maxres?.url ||
                                    item.snippet.thumbnails?.standard?.url ||
                                    item.snippet.thumbnails?.high?.url ||
                                    item.snippet.thumbnails?.medium?.url ||
                                    item.snippet.thumbnails?.default?.url || '',
                            }));
                        allVideos = allVideos.concat(videosOnPage);
                    }
                    nextPageToken = playlistData.nextPageToken;
                } while (nextPageToken && isMounted); // Tambahkan isMounted ke kondisi loop juga

                if (!isMounted) return; // Cek sebelum state update terakhir

                console.log(`useVideos: Successfully fetched ${allVideos.length} videos.`);
                if (isMounted) {
                    setVideos(allVideos);
                }
            } catch (err) {
                if (isMounted) { // Hanya set error jika komponen masih ter-mount
                    console.error("useVideos: Global fetch error:", err);
                    setError(err);
                    setVideos([]); // Kosongkan video jika error
                }
            } finally {
                if (isMounted) { // Hanya set loading false jika komponen masih ter-mount
                    setLoading(false);
                }
            }
        };

        // Panggil fungsi fetch hanya jika accessToken tersedia DAN GAPI client siap
        if (accessToken && typeof gapi !== 'undefined' && gapi.client && gapi.client.youtube) {
            fetchUserVideos();
        } else {
            // Jika tidak ada accessToken atau GAPI belum siap, reset state
            if (isMounted) {
                setVideos([]);
                setLoading(false);
                setError(null);
                if (accessToken && !(typeof gapi !== 'undefined' && gapi.client && gapi.client.youtube)) {
                    console.warn("useVideos: Access token present, but GAPI client or youtube API not ready. Waiting for GAPI readiness from App.jsx.");
                } else if (!accessToken) {
                    console.log("useVideos: No access token, state reset.");
                }
            }
        }

        // Fungsi cleanup: akan dijalankan saat komponen unmount atau sebelum effect dijalankan lagi
        return () => {
            isMounted = false;
            console.log("useVideos: Effect cleanup, isMounted set to false.");
            // Di sini Anda bisa mempertimbangkan untuk membatalkan request API jika GAPI client mendukung AbortController
            // Namun, dengan `isMounted` flag, kita mencegah state update pada unmounted component.
        };
    }, [accessToken]); // Dependency array: Effect ini dijalankan ulang setiap kali nilai 'accessToken' berubah.

    // Kembalikan state dan error dari hook
    return { videos, loading, error };
};
