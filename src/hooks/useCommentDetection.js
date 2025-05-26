// src/hooks/useCommentDetection.js

import { useState, useEffect } from 'react'; // useCallback tidak lagi diperlukan untuk runDetections
import { judolSpamCombinedRegex, normalizeLeetspeak } from '../utils/judolSpamPatterns';
import { knownSpamPhrasesSimple } from '../utils/knownSpamPhrases';
import * as fuzzball from 'fuzzball';
import { analyzeText } from '../services/perspectiveApi';

// --- KONSTANTA ---
const PERSPECTIVE_API_KEY = import.meta.env.VITE_PERSPECTIVE_API_KEY;

const FUZZY_MATCH_THRESHOLD = 70;

// Thresholds untuk berbagai kategori deteksi komentar.
const TOXICITY_THRESHOLD = 0.45;
const INSULT_THRESHOLD = 0.40;
const PROFANITY_THRESHOLD = 0.38;
const SEVERE_TOXICITY_THRESHOLD = 0.30;
const THREAT_THRESHOLD = 0.30;

const BATCH_SIZE = 10; // Jumlah komentar yang diproses per batch API
const BATCH_DELAY = 500; // Jeda antar batch dalam milidetik

// --- CACHE ---
const analysisCache = new Map(); // Cache untuk hasil analisis
const getCacheKey = (comment) => `${comment.id}-${comment.text}`; // Fungsi untuk membuat kunci cache

// --- FUNGSI DETEKSI LOKAL ---
// Fungsi untuk mendeteksi judol/spam secara lokal menggunakan regex dan fuzzy matching
const detectJudolSpam = async (commentText) => {
    if (!commentText || typeof commentText !== 'string' || commentText.trim() === '') {
        return false;
    }
    const normalizedText = normalizeLeetspeak(commentText);

    // Reset lastIndex untuk regex global sebelum pengujian
    if (judolSpamCombinedRegex.global) {
        judolSpamCombinedRegex.lastIndex = 0;
    }
    const isRegexMatch = judolSpamCombinedRegex.test(normalizedText);

    if (isRegexMatch) {
        if (import.meta.env.DEV) {
            // Logging detail match untuk debugging di mode DEV
            if (judolSpamCombinedRegex.global) judolSpamCombinedRegex.lastIndex = 0; // Reset lagi untuk exec
            const matches = [];
            let match;
            while ((match = judolSpamCombinedRegex.exec(normalizedText)) !== null) {
                matches.push(match[0]);
                if (match.index === judolSpamCombinedRegex.lastIndex) { // Hindari infinite loop dengan zero-width matches
                    judolSpamCombinedRegex.lastIndex++;
                }
            }
            console.log(`[Deteksi Judol/Spam] Regex Match: "${commentText.substring(0, 50)}..." -> Pola: ${matches.join(', ')}`);
            if (judolSpamCombinedRegex.global) judolSpamCombinedRegex.lastIndex = 0; // Reset setelah selesai
        }
        return true;
    }

    // Fuzzy matching jika regex tidak cocok
    const fuzzyMatches = fuzzball.extract(
        normalizedText,
        knownSpamPhrasesSimple,
        {
            scorer: fuzzball.token_set_ratio,
            limit: 3, // Ambil 3 kandidat teratas
            cutoff: FUZZY_MATCH_THRESHOLD - 10 // Cutoff sedikit lebih rendah untuk kandidat awal
        }
    );

    const isFuzzyMatch = fuzzyMatches.some(matchDetails => {
        const [phrase, score] = matchDetails;
        if (import.meta.env.DEV && score >= FUZZY_MATCH_THRESHOLD - 10) {
            console.log(`[Deteksi Judol/Spam] Fuzzy Check: "${normalizedText.substring(0, 50)}..." vs "${phrase}" (Skor: ${score})`);
        }
        return score >= FUZZY_MATCH_THRESHOLD;
    });

    return isFuzzyMatch;
};

// --- FUNGSI BANTUAN UNTUK LOGIKA PENANDAAN ---
const determineFlagStatus = (isJudolSpam, perspectiveScores) => {
    const {
        toxicityScore,
        severeToxicityScore,
        insultScore,
        profanityScore,
        threatScore,
    } = perspectiveScores || {}; // Default ke objek kosong jika perspectiveScores null/undefined

    let isFlaggedByApi = false;
    let isToxicBasedOnApi = false;

    if (toxicityScore !== null && toxicityScore > TOXICITY_THRESHOLD) {
        isFlaggedByApi = true;
        isToxicBasedOnApi = true; // Ditandai sebagai toxic jika skor toxicity melewati threshold
    }
    if (insultScore !== null && insultScore > INSULT_THRESHOLD) {
        isFlaggedByApi = true;
    }
    if (profanityScore !== null && profanityScore > PROFANITY_THRESHOLD) {
        isFlaggedByApi = true;
    }
    if (severeToxicityScore !== null && severeToxicityScore > SEVERE_TOXICITY_THRESHOLD) {
        isFlaggedByApi = true;
    }
    if (threatScore !== null && threatScore > THREAT_THRESHOLD) {
        isFlaggedByApi = true;
    }
    // Tambahkan pemeriksaan untuk atribut lain jika Anda menetapkan threshold untuknya

    return {
        isFlagged: isJudolSpam || isFlaggedByApi, // Komentar ditandai jika judol/spam ATAU di-flag oleh API
        isToxic: isToxicBasedOnApi, // Status isToxic spesifik dari API
    };
};


// --- HOOK KUSTOM ---
export const useCommentDetection = (comments) => {
    const [detectedComments, setDetectedComments] = useState([]);
    const [loadingDetections, setLoadingDetections] = useState(false);
    const [detectionError, setDetectionError] = useState(null);

    useEffect(() => {
        let isMounted = true; // Flag untuk melacak apakah effect/komponen masih ter-mount

        // Fungsi inti untuk menjalankan semua deteksi, didefinisikan di dalam useEffect
        // agar dapat mengakses `isMounted` dari closure-nya.
        const runDetectionsInternal = async () => {
            if (!comments || comments.length === 0) {
                if (isMounted) {
                    setDetectedComments([]);
                    setLoadingDetections(false);
                    setDetectionError(null);
                }
                return;
            }

            console.log(`useCommentDetection: Memulai deteksi pada ${comments.length} komentar. Ukuran Cache: ${analysisCache.size}`);
            if (isMounted) {
                setLoadingDetections(true);
                setDetectionError(null); // Reset error di awal setiap proses deteksi baru
            }

            const allProcessedComments = [];
            let overallDetectionFailed = false;
            let lastErrorMessage = null;

            // Kasus jika Perspective API Key tidak tersedia
            if (!PERSPECTIVE_API_KEY) {
                console.warn("useCommentDetection: Perspective API Key tidak ditemukan. Hanya deteksi Judol/Spam lokal yang akan dijalankan.");
                if (isMounted) {
                    setDetectionError(new Error("Perspective API Key tidak tersedia. Fitur analisis toksisitas dinonaktifkan."));
                }

                for (const comment of comments) {
                    if (!isMounted) return; // Cek sebelum operasi async
                    const cacheKey = getCacheKey(comment);
                    let analysisResult;

                    if (analysisCache.has(cacheKey)) {
                        analysisResult = analysisCache.get(cacheKey);
                        if (import.meta.env.DEV) console.log(`[Cache] Menggunakan hasil dari cache untuk komentar ID ${comment.id} (No API Key mode)`);
                    } else {
                        const isJudolSpam = await detectJudolSpam(comment.text);
                        if (!isMounted) return; // Cek setelah operasi async

                        const { isFlagged, isToxic } = determineFlagStatus(isJudolSpam, null); // Skor API null
                        analysisResult = {
                            isJudolSpam,
                            toxicityScore: null, severeToxicityScore: null, identityAttackScore: null,
                            insultScore: null, profanityScore: null, threatScore: null,
                            isToxic, // Hasil dari determineFlagStatus
                            perspectiveApiResults: null,
                            isFlagged,
                        };
                        if (isMounted) analysisCache.set(cacheKey, analysisResult);
                    }
                    allProcessedComments.push({ ...comment, ...analysisResult });
                }
                if (isMounted) {
                    setDetectedComments(allProcessedComments);
                    setLoadingDetections(false);
                }
                return; // Selesai jika tidak ada API Key
            }

            // Proses komentar dalam batch jika API Key TERSEDIA
            for (let i = 0; i < comments.length; i += BATCH_SIZE) {
                if (!isMounted) return; // Cek di awal setiap iterasi batch

                const batch = comments.slice(i, i + BATCH_SIZE);
                console.log(`useCommentDetection: Memproses batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(comments.length / BATCH_SIZE)} (${batch.length} komentar)...`);

                const batchPromises = batch.map(async (comment) => {
                    if (!isMounted) return { ...comment, _unmountedMarker: true }; // Tandai untuk difilter jika unmounted

                    const cacheKey = getCacheKey(comment);
                    if (analysisCache.has(cacheKey)) {
                        if (import.meta.env.DEV) console.log(`[Cache] Menggunakan hasil dari cache untuk komentar ID ${comment.id}`);
                        return { ...comment, ...analysisCache.get(cacheKey) };
                    }

                    let perspectiveScores = null;
                    let perspectiveApiResultsForStorage = null; // Untuk disimpan, bisa termasuk error API
                    let isJudolSpamLocal = false;

                    try {
                        isJudolSpamLocal = await detectJudolSpam(comment.text);
                        if (!isMounted) return { ...comment, _unmountedMarker: true };

                        try {
                            const apiResults = await analyzeText(comment.text, PERSPECTIVE_API_KEY);
                            if (!isMounted) return { ...comment, _unmountedMarker: true };

                            perspectiveScores = {
                                toxicityScore: apiResults?.toxicityScore || null,
                                severeToxicityScore: apiResults?.severeToxicityScore || null,
                                identityAttackScore: apiResults?.identityAttackScore || null,
                                insultScore: apiResults?.insultScore || null,
                                profanityScore: apiResults?.profanityScore || null,
                                threatScore: apiResults?.threatScore || null,
                            };
                            perspectiveApiResultsForStorage = apiResults?.fullResponse || apiResults; // Simpan hasil mentah atau error

                            if (import.meta.env.DEV) {
                                console.log(`[Perspective API Scores] Comment ID ${comment.id} ("${comment.text.substring(0, 50)}..."):`);
                                Object.entries(perspectiveScores).forEach(([key, value]) => console.log(`  ${key}: ${value}`));
                            }
                        } catch (apiError) {
                            console.error(`useCommentDetection: Gagal memanggil Perspective API untuk komentar ID ${comment.id}:`, apiError);
                            overallDetectionFailed = true;
                            lastErrorMessage = apiError.message || `Analisis Perspective API gagal untuk komentar ID ${comment.id}.`;
                            perspectiveApiResultsForStorage = { error: lastErrorMessage };
                            // Skor tetap null jika API gagal
                        }

                        const { isFlagged, isToxic } = determineFlagStatus(isJudolSpamLocal, perspectiveScores);

                        const analysisResult = {
                            isJudolSpam: isJudolSpamLocal,
                            ...(perspectiveScores || { // Pastikan semua field skor ada, meskipun null
                                toxicityScore: null, severeToxicityScore: null, identityAttackScore: null,
                                insultScore: null, profanityScore: null, threatScore: null,
                            }),
                            isToxic, // Hasil dari determineFlagStatus
                            perspectiveApiResults: perspectiveApiResultsForStorage,
                            isFlagged,
                        };
                        if (isMounted) analysisCache.set(cacheKey, analysisResult);
                        return { ...comment, ...analysisResult };

                    } catch (processingError) {
                        console.error(`useCommentDetection: Error saat memproses komentar ID ${comment.id} (di luar API call):`, processingError);
                        overallDetectionFailed = true;
                        lastErrorMessage = processingError.message || `Pemrosesan lokal gagal untuk komentar ID ${comment.id}.`;
                        // Kembalikan dengan status default jika ada error parah
                        const { isFlagged, isToxic } = determineFlagStatus(false, null); // Default jika error
                        return {
                            ...comment,
                            isJudolSpam: false,
                            toxicityScore: null, severeToxicityScore: null, identityAttackScore: null,
                            insultScore: null, profanityScore: null, threatScore: null,
                            isToxic,
                            perspectiveApiResults: { error: lastErrorMessage },
                            isFlagged,
                        };
                    }
                });

                const batchResultsRaw = await Promise.all(batchPromises);
                if (!isMounted) return; // Cek setelah semua promise batch selesai

                const validBatchResults = batchResultsRaw.filter(result => !result._unmountedMarker);
                allProcessedComments.push(...validBatchResults);

                if (isMounted) {
                    setDetectedComments([...allProcessedComments]); // Update progresif setelah setiap batch
                }

                // Jeda antar batch jika masih ada komentar dan komponen masih ter-mount
                if (i + BATCH_SIZE < comments.length && isMounted) {
                    console.log(`useCommentDetection: Jeda ${BATCH_DELAY}ms sebelum batch berikutnya...`);
                    await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
                    if (!isMounted) return; // Cek lagi setelah jeda
                }
            }

            // Setelah semua batch selesai
            if (isMounted) {
                setLoadingDetections(false);
                if (overallDetectionFailed) {
                    setDetectionError(new Error(`Deteksi selesai dengan beberapa kegagalan. Error terakhir: ${lastErrorMessage || 'Detail tidak tersedia.'}`));
                } else {
                    setDetectionError(null); // Hapus error jika semua berhasil
                }
                console.log("useCommentDetection: Semua proses deteksi batch selesai.");
                if (import.meta.env.DEV) {
                    console.log("useCommentDetection: Final detectedComments state:", allProcessedComments);
                }
            }
        };

        runDetectionsInternal(); // Panggil fungsi internal

        // Fungsi cleanup untuk useEffect
        return () => {
            isMounted = false; // Set flag ke false saat komponen unmount atau dependensi berubah
            console.log("useCommentDetection: Detection effect cleanup, isMounted set to false.");
            // TODO: Pertimbangkan implementasi AbortController jika Perspective API atau fetch mendukungnya
            // untuk membatalkan permintaan jaringan yang sedang berjalan.
        };
    }, [comments]); // Dependensi utama: 'comments'. Perubahan pada 'comments' akan memicu ulang effect.

    return {
        detectedComments,
        loadingDetections,
        detectionError,
    };
};
