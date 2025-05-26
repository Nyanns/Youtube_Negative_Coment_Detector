// src/services/perspectiveApi.js

// Endpoint untuk Perspective API analyze endpoint
const PERSPECTIVE_API_ENDPOINT = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';

// Daftar atribut yang diminta dari Perspective API.
// Atribut ini dipilih karena relevan untuk deteksi toksisitas/negatif
// dan umumnya didukung untuk bahasa 'id' (Indonesia) dan 'en' (Inggris).
// Jika menambah atribut baru, pastikan untuk memeriksa dukungan bahasa pada dokumentasi Perspective API.
const REQUESTED_ATTRIBUTES = {
    TOXICITY: {},          // Deteksi toksisitas umum
    SEVERE_TOXICITY: {},   // Deteksi toksisitas yang parah
    IDENTITY_ATTACK: {},   // Deteksi serangan terhadap identitas
    INSULT: {},            // Deteksi penghinaan
    PROFANITY: {},         // Deteksi kata-kata kotor/kasar
    THREAT: {},            // Deteksi ancaman
    // Atribut opsional lain yang mungkin dipertimbangkan (cek dukungan bahasa):
    // SEXUALLY_EXPLICIT: {},
    // SPAM: {}, // Perspective API juga memiliki atribut SPAM, namun mungkin kurang spesifik untuk kasus "judol" (judi online).
};

/**
 * Menganalisis teks menggunakan Google Perspective API.
 * @param {string} text - Teks komentar yang akan dianalisis.
 * @param {string} apiKey - Kunci API untuk Perspective API. Kunci API diteruskan sebagai argumen
 * untuk fleksibilitas dan keamanan (agar tidak hardcode atau terekspos langsung di
 * kode sisi klien jika tidak melalui backend proxy).
 * @returns {Promise<object>} Sebuah promise yang resolve dengan objek berisi skor atribut.
 * @throws {Error} Melempar error jika terjadi masalah saat pemanggilan API atau jika API Key tidak ada.
 */
export const analyzeText = async (text, apiKey) => {
    // 1. Validasi Input
    // Pastikan API Key tersedia sebelum memanggil API.
    if (!apiKey) {
        console.error("Perspective API Key tidak disediakan.");
        // Mengembalikan error yang lebih informatif jika API Key hilang.
        throw new Error("Perspective API Key tidak ditemukan. Tidak dapat memanggil API.");
    }

    // Pastikan teks tidak kosong.
    if (!text || text.trim() === '') {
        console.warn("analyzeText: Teks komentar kosong, melewati panggilan API Perspective.");
        // Mengembalikan struktur data default jika teks kosong, agar pemanggil dapat menanganinya secara konsisten.
        return {
            toxicityScore: null,
            severeToxicityScore: null,
            identityAttackScore: null,
            insultScore: null,
            profanityScore: null,
            threatScore: null,
            // Tambahkan null untuk atribut lain jika ada dalam REQUESTED_ATTRIBUTES
            fullResponse: null, // Tidak ada respons API untuk teks kosong
        };
    }

    // 2. Persiapan dan Pemanggilan API
    try {
        const response = await fetch(`${PERSPECTIVE_API_ENDPOINT}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                comment: { text: text },
                requestedAttributes: REQUESTED_ATTRIBUTES,
                languages: ['id', 'en'], // Prioritaskan deteksi untuk Bahasa Indonesia dan Inggris.
                // doNotStore: true, // Opsional: jika Anda tidak ingin Google menyimpan teks komentar. Pertimbangkan kebijakan privasi.
            }),
        });

        // 3. Penanganan Respons API
        if (!response.ok) {
            // Jika respons tidak OK (misal, status 4xx atau 5xx), coba parse body error.
            let errorBody;
            try {
                errorBody = await response.json();
            } catch (e) {
                // Jika body error bukan JSON, gunakan statusText.
                errorBody = { error: { message: response.statusText } };
            }
            console.error("Error response from Perspective API:", response.status, errorBody);
            // Melempar error dengan detail dari API.
            throw new Error(`Perspective API error (${response.status}): ${errorBody.error?.message || response.statusText}`);
        }

        const result = await response.json();

        // 4. Ekstraksi Skor Atribut
        const attributeScores = result?.attributeScores || {}; // Fallback ke objek kosong jika attributeScores tidak ada.

        // Mengembalikan objek yang berisi skor untuk setiap atribut.
        // Menggunakan optional chaining (?.) untuk mengakses properti secara aman dan || null sebagai fallback.
        return {
            toxicityScore: attributeScores.TOXICITY?.summaryScore?.value || null,
            severeToxicityScore: attributeScores.SEVERE_TOXICITY?.summaryScore?.value || null,
            identityAttackScore: attributeScores.IDENTITY_ATTACK?.summaryScore?.value || null,
            insultScore: attributeScores.INSULT?.summaryScore?.value || null,
            profanityScore: attributeScores.PROFANITY?.summaryScore?.value || null,
            threatScore: attributeScores.THREAT?.summaryScore?.value || null,
            // Pastikan untuk menambahkan properti lain di sini jika Anda menambahkan atribut di REQUESTED_ATTRIBUTES
            fullResponse: import.meta.env.DEV ? result : undefined, // Sertakan seluruh respons API hanya dalam mode DEV untuk debugging.
        };

    } catch (error) {
        // 5. Penanganan Error Umum (Jaringan, dll.)
        // Menangkap error jaringan atau error yang dilempar dari blok `if (!response.ok)`.
        console.error("Error calling Perspective API:", error.message);
        // Melempar error lebih lanjut agar bisa ditangani oleh kode pemanggil (misalnya, di custom hook).
        // Menyertakan pesan error asli untuk konteks.
        throw new Error(`Gagal menganalisis teks dengan Perspective API: ${error.message}`);
    }
};
