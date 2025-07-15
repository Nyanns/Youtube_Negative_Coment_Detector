// src/hooks/useCommentDetection.js

import { analyzeText } from '../services/perspectiveApi';

const PERSPECTIVE_API_KEY = import.meta.env.VITE_PERSPECTIVE_API_KEY;

// ... di dalam loop pemrosesan komentar ...

try {
    // 1. Memanggil fungsi analyzeText untuk berinteraksi dengan API.
    // Kunci API diambil dari variabel lingkungan VITE_PERSPECTIVE_API_KEY.
    const apiResults = await analyzeText(comment.text, PERSPECTIVE_API_KEY);

    // 2. Mengekstrak skor dari respons API.
    // Jika ada atribut yang tidak ditemukan, nilainya akan diatur ke null.
    perspectiveScores = {
        toxicityScore: apiResults?.toxicityScore || null,
        severeToxicityScore: apiResults?.severeToxicityScore || null,
        insultScore: apiResults?.insultScore || null,
        profanityScore: apiResults?.profanityScore || null,
        threatScore: apiResults?.threatScore || null,
    };

} catch (apiError) {
    // 3. Penanganan kesalahan jika panggilan API gagal.
    console.error(`Gagal memanggil Perspective API untuk komentar ID ${comment.id}:`, apiError);
    // Skor akan tetap null dan proses berlanjut.
}

// ...