// src/hooks/useCommentManagement.js

import { useState, useEffect, useCallback } from 'react';

// Hook kustom untuk mengelola pengambilan dan penghapusan komentar YouTube
// Menerima:
// - accessToken: Access token dari Google API
// - videoId: ID video YouTube yang komentarnya ingin dikelola
export const useCommentManagement = (accessToken, videoId) => {
    // State untuk daftar komentar mentah (dari YouTube API)
    const [rawComments, setRawComments] = useState([]);
    // State untuk status loading saat mengambil komentar
    const [commentsLoading, setCommentsLoading] = useState(false);
    // State untuk error saat mengambil komentar
    const [commentsError, setCommentsError] = useState(null);

    // State untuk status loading saat menghapus komentar
    const [isDeletingComments, setIsDeletingComments] = useState(false);
    // State untuk error saat menghapus komentar
    const [deleteCommentsError, setDeleteCommentsError] = useState(null);
    // State untuk menyimpan ID komentar yang berhasil dihapus (untuk filtering di App.jsx)
    const [deletedCommentIds, setDeletedCommentIds] = useState([]);

    // Efek untuk mengambil komentar saat videoId atau accessToken berubah
    useEffect(() => {
        let isMounted = true; // Flag untuk melacak apakah effect masih aktif

        const fetchComments = async () => {
            // Reset state saat memulai fetch atau jika video/token hilang
            if (!videoId || !accessToken) {
                console.log("useCommentManagement: Tidak ada ID video atau access token, skip fetching comments.");
                if (isMounted) {
                    setRawComments([]);
                    setCommentsLoading(false);
                    setCommentsError(null);
                    setDeletedCommentIds([]); // Reset deleted IDs untuk konteks video baru
                }
                return;
            }

            // Pastikan gapi dan gapi.client.youtube sudah siap sebelum melanjutkan
            if (typeof gapi === 'undefined' || !gapi.client || !gapi.client.youtube) {
                console.error("useCommentManagement: GAPI client atau YouTube API belum siap untuk fetchComments.");
                if (isMounted) {
                    setCommentsError(new Error("Layanan Google API belum siap.")); // Gunakan objek Error
                    setCommentsLoading(false);
                    setRawComments([]);
                    setDeletedCommentIds([]);
                }
                return;
            }

            console.log(`useCommentManagement: Mengambil komentar untuk video ID: ${videoId}`);
            if (isMounted) {
                setCommentsLoading(true);
                setCommentsError(null);
                setRawComments([]); // Kosongkan komentar sebelumnya sebelum fetch baru
                setDeletedCommentIds([]); // Reset deleted IDs untuk fetch baru
            }

            try {
                // Set token untuk GAPI client jika tersedia (praktik baik, meskipun mungkin sudah di-set global)
                if (gapi.client.setToken && accessToken) {
                    gapi.client.setToken({ access_token: accessToken });
                }

                let allComments = [];
                let nextPageToken = null;
                const maxPages = 5; // Batasi jumlah halaman yang diambil, sesuaikan jika perlu
                let pageCount = 0;

                do {
                    if (!isMounted) return; // Cek sebelum setiap panggilan API dalam loop

                    if (pageCount >= maxPages) {
                        console.log(`useCommentManagement: Menghentikan pengambilan komentar setelah ${maxPages} halaman.`);
                        break; // Hentikan jika sudah mencapai batas halaman
                    }

                    const response = await gapi.client.youtube.commentThreads.list({
                        part: "snippet", // Ambil snippet komentar (untuk teks dan info dasar)
                        videoId: videoId,
                        maxResults: 100, // Ambil 100 komentar per halaman (maksimum)
                        pageToken: nextPageToken, // Gunakan token untuk halaman berikutnya
                        order: "time", // Urutkan berdasarkan waktu (terbaru lebih dulu)
                    });

                    if (!isMounted) return; // Cek setelah panggilan API dalam loop

                    const result = response.result;
                    if (result.error) {
                        console.error("useCommentManagement: Error dari API saat mengambil halaman komentar:", result.error);
                        throw new Error(result.error.message || "Gagal mengambil halaman komentar.");
                    }

                    const items = result.items;
                    if (items && items.length > 0) {
                        const topLevelComments = items
                            .filter(item => item.snippet?.topLevelComment?.snippet) // Pastikan struktur ada
                            .map(item => ({
                                id: item.id, // ID dari commentThread, bisa juga item.snippet.topLevelComment.id
                                author: item.snippet.topLevelComment.snippet.authorDisplayName,
                                text: item.snippet.topLevelComment.snippet.textOriginal,
                                publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
                                likeCount: item.snippet.topLevelComment.snippet.likeCount,
                            }));
                        allComments = [...allComments, ...topLevelComments];
                        nextPageToken = result.nextPageToken;
                        pageCount++;
                    } else {
                        nextPageToken = null; // Tidak ada item atau halaman berikutnya
                    }
                } while (nextPageToken && isMounted); // Tambahkan isMounted ke kondisi loop

                if (!isMounted) return; // Cek sebelum update state terakhir

                console.log(`useCommentManagement: Total komentar diambil: ${allComments.length}`);
                if (isMounted) {
                    setRawComments(allComments);
                }
            } catch (error) {
                console.error("useCommentManagement: Error fetching comments:", error);
                if (isMounted) {
                    const errorMessage = error.result?.error?.message || error.message || "Terjadi kesalahan saat mengambil komentar.";
                    setCommentsError(new Error(`Gagal mengambil komentar: ${errorMessage}`)); // Gunakan objek Error
                    setRawComments([]);
                }
            } finally {
                if (isMounted) {
                    setCommentsLoading(false); // Selesai fetching
                }
            }
        };

        fetchComments();

        return () => {
            isMounted = false; // Set isMounted ke false saat cleanup
            console.log("useCommentManagement: fetchComments effect cleanup, isMounted set to false.");
            // TODO: Pertimbangkan implementasi AbortController jika GAPI mendukungnya untuk fetch
        };
    }, [accessToken, videoId]); // Dependensi: accessToken, videoId

    // Fungsi untuk menghapus komentar
    const deleteComments = useCallback(async (commentIdsToDelete) => {
        // Flag isMounted tidak diperlukan di sini karena useCallback akan selalu
        // menggunakan versi terbaru dari state setter dan accessToken dari closure-nya
        // saat dipanggil. Jika komponen unmount, panggilan ke setter tidak akan error.
        // Namun, pengecekan GAPI readiness tetap penting.

        if (!accessToken || !commentIdsToDelete || commentIdsToDelete.length === 0) {
            console.warn("useCommentManagement: Tidak ada access token atau ID komentar yang diberikan untuk dihapus.");
            const errorMsg = "Tidak ada token akses atau ID komentar yang dipilih.";
            setDeleteCommentsError(new Error(errorMsg)); // Gunakan objek Error
            return { successCount: 0, error: new Error(errorMsg) };
        }

        // Pastikan gapi dan gapi.client.youtube sudah siap sebelum melanjutkan
        if (typeof gapi === 'undefined' || !gapi.client || !gapi.client.youtube) {
            console.error("useCommentManagement: GAPI client atau YouTube API belum siap untuk deleteComments.");
            const errorMsg = "Layanan Google API belum siap untuk penghapusan.";
            setDeleteCommentsError(new Error(errorMsg));
            setIsDeletingComments(false); // Pastikan loading direset
            return { successCount: 0, error: new Error(errorMsg) };
        }

        setIsDeletingComments(true);
        setDeleteCommentsError(null);

        // Set token untuk GAPI client jika tersedia
        if (gapi.client.setToken && accessToken) {
            gapi.client.setToken({ access_token: accessToken });
        }

        console.log("useCommentManagement: Memulai proses penghapusan untuk ID:", commentIdsToDelete);

        const failedDeletions = [];
        let successfulDeletionsCount = 0;
        const newDeletedCommentIds = []; // Kumpulkan ID yang berhasil dihapus di batch ini

        for (const commentId of commentIdsToDelete) {
            try {
                console.log(`useCommentManagement: Menghapus komentar ID: ${commentId}`);
                await gapi.client.youtube.comments.delete({
                    id: commentId,
                });
                console.log(`useCommentManagement: Komentar ID ${commentId} berhasil dihapus.`);
                successfulDeletionsCount++;
                newDeletedCommentIds.push(commentId);
            } catch (error) {
                console.error(`useCommentManagement: Gagal menghapus komentar ID ${commentId}:`, error);
                const errorMessage = error.result?.error?.message || error.message || `Gagal menghapus ID ${commentId}.`;
                failedDeletions.push({ id: commentId, error: errorMessage });
            }
        }

        // Update deletedCommentIds setelah loop selesai untuk menghindari banyak re-render
        if (newDeletedCommentIds.length > 0) {
            setDeletedCommentIds(prev => [...new Set([...prev, ...newDeletedCommentIds])]); // Gabungkan dengan yang lama, pastikan unik
        }

        setIsDeletingComments(false); // Proses penghapusan selesai

        if (failedDeletions.length > 0) {
            const errorSummary = `Gagal menghapus ${failedDeletions.length} dari ${commentIdsToDelete.length} komentar. Detail di console.`;
            setDeleteCommentsError(new Error(errorSummary)); // Gunakan objek Error
            console.error("useCommentManagement: Detail komentar yang gagal dihapus:", failedDeletions);
            return { successCount: successfulDeletionsCount, error: new Error(errorSummary) };
        }

        console.log(`useCommentManagement: Berhasil menghapus ${successfulDeletionsCount} komentar.`);
        return { successCount: successfulDeletionsCount, error: null };
    }, [accessToken]); // Dependensi: accessToken. setDeletedCommentIds stabil.

    return {
        rawComments,
        commentsLoading,
        commentsError,
        isDeletingComments,
        deleteCommentsError,
        deletedCommentIds,
        deleteComments,
    };
};
