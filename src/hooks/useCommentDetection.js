// src/hooks/useCommentDetection.js

import { useState, useEffect } from 'react';
import { judolSpamCombinedRegex, normalizeLeetspeak } from '../utils/judolSpamPatterns';
import { knownSpamPhrasesSimple } from '../utils/knownSpamPhrases';
import * as fuzzball from 'fuzzball';
import { analyzeText } from '../services/perspectiveApi';

// --- KONSTANTA ---
const PERSPECTIVE_API_KEY = import.meta.env.VITE_PERSPECTIVE_API_KEY;

const FUZZY_MATCH_THRESHOLD = 85;
const PARTIAL_MATCH_THRESHOLD = 90; // Dinonaktifkan sementara, tetapi konstanta disimpan

// Thresholds untuk berbagai kategori deteksi komentar.
const TOXICITY_THRESHOLD = 0.15;
const INSULT_THRESHOLD = 0.40;
const PROFANITY_THRESHOLD = 0.38;
const SEVERE_TOXICITY_THRESHOLD = 0.30;
const THREAT_THRESHOLD = 0.30;

// ## PERBAIKAN DI SINI ##
// BATCH_SIZE dikurangi menjadi 3 untuk mengirim lebih sedikit permintaan sekaligus.
const BATCH_SIZE = 5;

// Jeda antar batch diperpanjang menjadi 5000ms (2 detik) untuk
// memberikan jeda yang lebih aman dan menghindari error "429: Quota Exceeded".
const BATCH_DELAY = 5000;

// --- CACHE ---
const analysisCache = new Map(); // Cache untuk hasil analisis
const getCacheKey = (comment) => `${comment.id}-${comment.text}`; // Fungsi untuk membuat kunci cache

// ===================================================================================
// =================== FUNGSI DETEKSI LOKAL (DENGAN LOGGING) =========================
// ===================================================================================
const detectJudolSpam = async (commentText) => {
    // isDevMode akan bernilai true saat Anda menjalankan 'npm run dev'
    const isDevMode = import.meta.env.DEV;

    // Bagian ini HANYA akan berjalan jika isDevMode adalah true.
    if (isDevMode) {
        console.log(`\n\n====================================================`);
        console.log(`[DIAGNOSA] Memulai deteksi untuk komentar: "${commentText}"`);
        console.log(`====================================================`);
    }

    if (!commentText || typeof commentText !== 'string' || commentText.trim() === '') {
        if (isDevMode) console.warn('[DIAGNOSA] Komentar kosong atau tidak valid.');
        return { isSpam: false, reason: 'Empty Comment', matched: null };
    }

    const normalizedText = normalizeLeetspeak(commentText);
    if (isDevMode) {
        console.log(`[DIAGNOSA] Teks SETELAH Normalisasi:`, `%c"${normalizedText}"`, 'color: orange; font-weight: bold;');
    }

    // Lapis 1: Regex
    judolSpamCombinedRegex.lastIndex = 0;
    const regexMatch = judolSpamCombinedRegex.exec(normalizedText);
    if (regexMatch) {
        if (isDevMode) {
            console.log(`%c[DIAGNOSA] HASIL: SPAM TERDETEKSI (via Regex)`, 'color: red; font-size: 14px; font-weight: bold;');
            console.log(`[DIAGNOSA] Cocok dengan pola: "${regexMatch[0]}"`);
        }
        return { isSpam: true, reason: 'Regex Match', matched: regexMatch[0] };
    }

    if (isDevMode) console.log(`[DIAGNOSA] Hasil Tes Regex: %cTIDAK COCOK`, 'color: green;');

    // Lapis 2: Fuzzy Matching (Token Set Ratio)
    const tokenSetMatches = fuzzball.extract(normalizedText, knownSpamPhrasesSimple, {
        scorer: fuzzball.token_set_ratio,
        limit: 1,
        cutoff: FUZZY_MATCH_THRESHOLD,
    });

    if (tokenSetMatches.length > 0) {
        if (isDevMode) {
            console.log(`%c[DIAGNOSA] HASIL: SPAM TERDETEKSI (via Fuzzy Set)`, 'color: red; font-size: 14px; font-weight: bold;');
            console.log(`[DIAGNOSA] Kemiripan dengan frasa: "${tokenSetMatches[0][0]}" (Skor: ${tokenSetMatches[0][1]})`);
        }
        return { isSpam: true, reason: 'Fuzzy Match (Set)', matched: tokenSetMatches[0][0] };
    }

    if (isDevMode) {
        console.log(`%c[DIAGNOSA] HASIL AKHIR LOKAL: BUKAN SPAM`, 'color: green; font-size: 14px; font-weight: bold;');
    }
    return { isSpam: false, reason: null, matched: null };
};

// --- FUNGSI BANTUAN UNTUK LOGIKA PENANDAAN ---
const determineFlagStatus = (isJudolSpam, perspectiveScores) => {
    // 1. Ambil semua skor dari objek perspectiveScores dengan aman.
    // Jika perspectiveScores tidak ada, anggap semua skor 0 atau tidak ada.
    const {
        toxicityScore,
        severeToxicityScore,
        insultScore,
        profanityScore,
        threatScore,
    } = perspectiveScores || {};

    let isFlaggedByApi = false;
    let isToxicBasedOnApi = false;

    if (toxicityScore > TOXICITY_THRESHOLD) isFlaggedByApi = true;
    if (toxicityScore > TOXICITY_THRESHOLD) isToxicBasedOnApi = true;
    if (insultScore > INSULT_THRESHOLD) isFlaggedByApi = true;
    if (profanityScore > PROFANITY_THRESHOLD) isFlaggedByApi = true;
    if (severeToxicityScore > SEVERE_TOXICITY_THRESHOLD) isFlaggedByApi = true;
    if (threatScore > THREAT_THRESHOLD) isFlaggedByApi = true;

    return {
        isFlagged: isJudolSpam || isFlaggedByApi,
        isToxic: isToxicBasedOnApi,
    };
};


// --- HOOK KUSTOM UTAMA ---
export const useCommentDetection = (comments) => {
    const [detectedComments, setDetectedComments] = useState([]);
    const [loadingDetections, setLoadingDetections] = useState(false);
    const [detectionError, setDetectionError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const runDetectionsInternal = async () => {
            if (!comments || comments.length === 0) {
                if (isMounted) {
                    setDetectedComments([]);
                    setLoadingDetections(false);
                    setDetectionError(null);
                }
                return;
            }

            if (isMounted) {
                setLoadingDetections(true);
                setDetectionError(null);
            }

            try {
                const allProcessedComments = [];
                for (let i = 0; i < comments.length; i += BATCH_SIZE) {
                    if (!isMounted) return;

                    const batch = comments.slice(i, i + BATCH_SIZE);
                    const batchPromises = batch.map(async (comment) => {
                        if (!isMounted) return null;
                        const cacheKey = getCacheKey(comment);
                        if (analysisCache.has(cacheKey)) {
                            return { ...comment, ...analysisCache.get(cacheKey) };
                        }

                        const judolResult = await detectJudolSpam(comment.text);
                        let perspectiveScores = null;

                        if (PERSPECTIVE_API_KEY) {
                            try {
                                const apiResults = await analyzeText(comment.text, PERSPECTIVE_API_KEY);
                                perspectiveScores = {
                                    toxicityScore: apiResults?.toxicityScore || 0,
                                    severeToxicityScore: apiResults?.severeToxicityScore || 0,
                                    insultScore: apiResults?.insultScore || 0,
                                    profanityScore: apiResults?.profanityScore || 0,
                                    threatScore: apiResults?.threatScore || 0,
                                };

                                if (import.meta.env.DEV) {
                                    const scoresLog = `Tox: ${perspectiveScores.toxicityScore.toFixed(2)}, Ins: ${perspectiveScores.insultScore.toFixed(2)}, Prof: ${perspectiveScores.profanityScore.toFixed(2)}`;
                                    console.log(`[DIAGNOSA] Perspective API Scores: %c${scoresLog}`, 'color: blue;');
                                }

                            } catch (apiError) {
                                // PERBAIKAN: Mengganti template literal dengan string concatenation untuk menghindari masalah parsing.
                                console.error('useCommentDetection: Gagal memanggil Perspective API untuk komentar ID ' + comment.id + ':', apiError);
                            }
                        }

                        const { isFlagged, isToxic } = determineFlagStatus(judolResult.isSpam, perspectiveScores);

                        const analysisResult = {
                            isJudolSpam: judolResult.isSpam,
                            judolReason: judolResult.reason,
                            matchedPattern: judolResult.matched,
                            isToxic,
                            isFlagged,
                            ...(perspectiveScores || {
                                toxicityScore: null,
                                severeToxicityScore: null,
                                insultScore: null,
                                profanityScore: null,
                                threatScore: null,
                            }),
                        };

                        if (isMounted) analysisCache.set(cacheKey, analysisResult);
                        return { ...comment, ...analysisResult };
                    });

                    const validBatchResults = (await Promise.all(batchPromises)).filter(Boolean);
                    allProcessedComments.push(...validBatchResults);

                    if (isMounted) {
                        setDetectedComments([...allProcessedComments]);
                    }

                    if (i + BATCH_SIZE < comments.length && isMounted) {
                        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
                    }
                }
            } catch (error) {
                console.error("Terjadi error besar saat proses deteksi:", error);
                if (isMounted) setDetectionError(error);
            } finally {
                if (isMounted) setLoadingDetections(false);
            }
        };

        runDetectionsInternal();

        return () => {
            isMounted = false;
        };
    }, [comments]);

    return {
        detectedComments,
        loadingDetections,
        detectionError,
    };
};