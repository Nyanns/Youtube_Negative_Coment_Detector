// src/hooks/useCommentDetection.js

import { useState, useEffect } from 'react';
import { judolSpamCombinedRegex, normalizeLeetspeak } from '../utils/judolSpamPatterns';
import { knownSpamPhrasesSimple } from '../utils/knownSpamPhrases';
import * as fuzzball from 'fuzzball';
import { analyzeText } from '../services/perspectiveApi';

// --- KONSTANTA ---
const PERSPECTIVE_API_KEY = import.meta.env.VITE_PERSPECTIVE_API_KEY;

// Threshold untuk fuzzy matching. Nilai 85 adalah titik awal yang baik untuk mengurangi false positive.
const FUZZY_MATCH_THRESHOLD = 85;
// Threshold lebih tinggi khusus untuk partial match agar lebih akurat dan tidak terlalu sensitif.
const PARTIAL_MATCH_THRESHOLD = 90;

// Thresholds untuk berbagai kategori deteksi dari Perspective API.
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

// --- FUNGSI DETEKSI LOKAL (LOGIKA INTI DIPERBAIKI) ---
const detectJudolSpam = async (commentText) => {
    if (!commentText || typeof commentText !== 'string' || commentText.trim() === '') {
        return false;
    }
    const normalizedText = normalizeLeetspeak(commentText);

    // --- LAPIS 1: PENCOCOKAN REGEX (Paling Cepat & Efisien) ---
    if (judolSpamCombinedRegex.test(normalizedText)) {
        if (import.meta.env.DEV) {
            judolSpamCombinedRegex.lastIndex = 0;
            const match = judolSpamCombinedRegex.exec(normalizedText);
            console.log(`[DETEKSI SPAM - REGEX] Komentar cocok dengan pola: "${match ? match[0] : 'N/A'}"`);
        }
        return true;
    }

    // --- LAPIS 2: FUZZY MATCHING (Jika Regex tidak cocok) ---

    // Metode A: Cek kemiripan set token keseluruhan (baik untuk frasa yang mirip)
    const tokenSetMatches = fuzzball.extract(normalizedText, knownSpamPhrasesSimple, {
        scorer: fuzzball.token_set_ratio,
        limit: 1,
        cutoff: FUZZY_MATCH_THRESHOLD
    });

    if (tokenSetMatches.length > 0) {
        if (import.meta.env.DEV) {
            console.log(`[DETEKSI SPAM - FUZZY SET] Kemiripan: "${commentText.substring(0, 50)}..." vs "${tokenSetMatches[0][0]}" (Skor: ${tokenSetMatches[0][1]})`);
        }
        return true;
    }

    // Metode B: Cek kemiripan parsial (baik untuk spam yang disisipkan di tengah kalimat panjang)
    const partialTokenSetMatches = fuzzball.extract(normalizedText, knownSpamPhrasesSimple, {
        scorer: fuzzball.partial_token_set_ratio,
        limit: 1,
        cutoff: PARTIAL_MATCH_THRESHOLD
    });

    if (partialTokenSetMatches.length > 0) {
        if (import.meta.env.DEV) {
            console.log(`[DETEKSI SPAM - FUZZY PARTIAL] Kemiripan: "${commentText.substring(0, 50)}..." vs "${partialTokenSetMatches[0][0]}" (Skor: ${partialTokenSetMatches[0][1]})`);
        }
        return true;
    }

    // Jika semua lapisan deteksi tidak menemukan spam, kembalikan false.
    return false;
};


// --- FUNGSI BANTUAN UNTUK LOGIKA PENANDAAN ---
const determineFlagStatus = (isJudolSpam, perspectiveScores) => {
    const {
        toxicityScore,
        severeToxicityScore,
        insultScore,
        profanityScore,
        threatScore,
    } = perspectiveScores || {};

    let isFlaggedByApi = false;
    let isToxicBasedOnApi = false;

    if (toxicityScore !== null && toxicityScore > TOXICITY_THRESHOLD) {
        isFlaggedByApi = true;
        isToxicBasedOnApi = true;
    }
    if (insultScore !== null && insultScore > INSULT_THRESHOLD) isFlaggedByApi = true;
    if (profanityScore !== null && profanityScore > PROFANITY_THRESHOLD) isFlaggedByApi = true;
    if (severeToxicityScore !== null && severeToxicityScore > SEVERE_TOXICITY_THRESHOLD) isFlaggedByApi = true;
    if (threatScore !== null && threatScore > THREAT_THRESHOLD) isFlaggedByApi = true;

    return {
        isFlagged: isJudolSpam || isFlaggedByApi, // Ditandai jika terdeteksi sebagai Judol/Spam ATAU di-flag oleh API
        isToxic: isToxicBasedOnApi, // Status isToxic khusus dari API
    };
};


// --- HOOK KUSTOM ---
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

            const allProcessedComments = [];

            // Proses komentar dalam batch jika API Key TERSEDIA
            for (let i = 0; i < comments.length; i += BATCH_SIZE) {
                if (!isMounted) return;

                const batch = comments.slice(i, i + BATCH_SIZE);

                const batchPromises = batch.map(async (comment) => {
                    if (!isMounted) return { ...comment, _unmountedMarker: true };

                    const cacheKey = getCacheKey(comment);
                    if (analysisCache.has(cacheKey)) {
                        return { ...comment, ...analysisCache.get(cacheKey) };
                    }

                    let perspectiveScores = null;
                    let isJudolSpamLocal = false;

                    try {
                        // Pertama, jalankan deteksi spam lokal yang sudah disempurnakan
                        isJudolSpamLocal = await detectJudolSpam(comment.text);
                        if (!isMounted) return { ...comment, _unmountedMarker: true };

                        // Jika API Key ada, lanjutkan dengan analisis toksisitas
                        if (PERSPECTIVE_API_KEY) {
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
                            } catch (apiError) {
                                console.error(`useCommentDetection: Gagal memanggil Perspective API untuk komentar ID ${comment.id}:`, apiError);
                                // Biarkan proses berjalan, skor akan tetap null
                            }
                        }

                        // Tentukan status akhir komentar
                        const { isFlagged, isToxic } = determineFlagStatus(isJudolSpamLocal, perspectiveScores);

                        const analysisResult = {
                            isJudolSpam: isJudolSpamLocal,
                            ...(perspectiveScores || {
                                toxicityScore: null, severeToxicityScore: null, identityAttackScore: null,
                                insultScore: null, profanityScore: null, threatScore: null,
                            }),
                            isToxic,
                            isFlagged,
                        };
                        if (isMounted) analysisCache.set(cacheKey, analysisResult);
                        return { ...comment, ...analysisResult };

                    } catch (processingError) {
                        console.error(`useCommentDetection: Error saat memproses komentar ID ${comment.id}:`, processingError);
                        const { isFlagged, isToxic } = determineFlagStatus(false, null);
                        return { ...comment, isJudolSpam: false, isToxic, isFlagged };
                    }
                });

                const validBatchResults = (await Promise.all(batchPromises)).filter(result => !result._unmountedMarker);
                allProcessedComments.push(...validBatchResults);

                if (isMounted) {
                    setDetectedComments([...allProcessedComments]);
                }

                if (i + BATCH_SIZE < comments.length && isMounted) {
                    await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
                }
            }

            if (isMounted) {
                setLoadingDetections(false);
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