// testThreshold.js

// Impor library dan data yang diperlukan
import * as fuzzball from 'fuzzball';
import { knownSpamPhrasesSimple } from './src/utils/knownSpamPhrases.js';
import { normalizeLeetspeak } from './src/utils/judolSpamPatterns.js';

// --- DATASET KOMENTAR SPAM (50 KOMENTAR) ---
const spamComments = [
    "S1tus G4COR hari ini infonya ada di bio, cek aja langsung!",
    "Nonton video ini sambil nungguin WD cair, hehe. Kunjungi website kami kalau mau tau.",
    "Mantap videonya, btw ada bonus new member 100% dijamin wd loh, daftar sekarang!",
    "Ada yg tau info RTP l1ve akurat 98%? Jangan sampai ketinggalan infonya di profil.",
    "Khusus hari ini aja, depo 25 bonus 25, buruan klik link di profil.",
    "Adminnya baik banget, dapet bocoran dari admin slot pragmatic play, chat aja.",
    "Gampang mmenang ternyata, cuma di K1NG_88, aku udah buktiin sendiri.",
    "Capek kerja? Mending deposit pulsa tanpa potongan, proses wd nya cepet banget.",
    "Punya akun wso asli anti rungkad itu terbukti penting, info lanjut wa aja ya 08xx...",
    "Link dana kaget spesial buat yang join grup telegram kami, terbatas!",
    "JP PASTI CAIR, tapi jangan bilang siapa siapa ya, infonya di bio.",
    "Info lengkap ada di bio, ada bonus referal seumur hidup juga.",
    "Sltus terprcaya nih, depo via qris aman dan cepat.",
    "Malam ini ada pola gacor, dijamin maxwin, cek profil.",
    "Capek nonton? Gabung sekarang dan klaim bonus selamat datang dari kami.",
    "Butuh bantuan? Layanan 24 jam nonstop, live chat online terus.",
    "Aku kemarin menang banyak di bandar togel terpercaya, diskonnya terbesar.",
    "Kalau mau hoki, main di sini aja, akun hoki menanti.",
    "Rahasia menang slot? Gampang, ada di profil, cek sekarang!",
    "Ada event bagi bagi saldo gratis buat 100 orang pertama, join tele!",
    "Suka bola? Mix parlay jalan terus, modal kecil untung besar.",
    "Selain nonton, aku juga suka sabung ayam online live, daftar gratis kok.",
    "Cuma di sini ada garansi kekalahan 100% kembali, ga ada ruginya.",
    "Info selengkapnya ada di bio, jangan sampai kelewatan promonya.",
    "DEPOSIT VIA DANA minimal 10k, bisa langsung main sepuasnya.",
    "Katanya ini situs slot terbaik dengan winrate tertinggi, bener gak ya?",
    "Cek profil kami ya guys, ada link alternatif resmi biar gak bingung.",
    "Ada jam gacor buat main slot mahjong ways, inbox aja untuk daftar.",
    "Gak percaya? Bukti jp member ada di grup tele kami, join aja.",
    "Denger-denger mpo slot lagi ada bonus rollingan terbesar bulan ini.",
    "Aku main di Gacor77 pasti bayar berapapun kemenangannya, mantap.",
    "Kalau mau daftar gratis, bisa kunjungi link di bio.",
    "Bonus cashback mingguan tanpa syarat, lumayan buat tambahan.",
    "Aku pake akun pro vip dari server luar, gampang menang banget.",
    "Iseng main tembak ikan online, eh modal 10k bisa wd 50k.",
    "Jangan lupa join grup wa untuk info rtp live akurat setiap hari.",
    "Tiap hari bisa dapet cuan gratis, add wa admin aja.",
    "Enaknya di sini, bonus deposit harian bisa diklaim setiap hari.",
    "Ini situs anti rungkad, sudah terbukti membayar membernya.",
    "Daftar sekarang, langsung dapatkan freebet gratis tanpa deposit.",
    "Coba hubungi cs kami deh, minta buatin akun hoki.",
    "Ada promo terbesar dari agen resmi slot88, cek bio.",
    "Linknya ada di profil ya, ada bonus member baru 100% juga.",
    "WD tanpa batas, proses cepat gak sampe 3 menit.",
    "Cek bio, ada link dana kaget menantimu! Buruan sebelum habis.",
    "Gates of olympus lagi gacor parah, polanya ada di grup.",
    "Kunjungi website kami untuk dapat bonus turnover mingguan.",
    "Untuk info lanjut bisa chat via whatsapp ya bos, fast respon.",
    "Pasti profit kalau tau rahasianya, jp terus, infonya di bio.",
    "Yuk daftar dan mainkan sekarang, menangkan hadiah jutaan rupiah!"
];

// --- DATASET KOMENTAR BERSIH TANTANGAN (50 KOMENTAR) ---
const cleanComments = [
    "Ada info penting di video ini, tolong cek dan kasih feedback ya.",
    "Btw, link yang dibahas tadi bisa diakses di deskripsi video ini.",
    "Kak, saya ikut event yang disarankan kemarin, beneran menarik.",
    "Langsung saya tonton ulang, takut ketinggalan bagian penting.",
    "Video ini cocok banget buat referensi tugas dan praktikum.",
    "Siapa yang ikut komunitas di telegram? Mau tanya-tanya.",
    "Kalau ada update tentang topik ini, tolong kabari ya.",
    "Saya bookmark videonya, takut nanti lupa caranya.",
    "Akhirnya saya bisa praktek juga setelah nonton ini.",
    "Dari semua channel, ini paling konsisten update kontennya.",
    "Penasaran sama langkah selanjutnya, semoga dibahas lagi.",
    "Saya lagi nyari info tambahan, video ini bantu banget.",
    "Boleh share file yang tadi disebut? Butuh buat belajar.",
    "Udah dicatat semua poin penting dari videonya.",
    "Saya suka kontennya, tapi tolong buat part 2 ya.",
    "Video ini rame banget, sampai trending loh.",
    "Langsung saya praktekin, dan hasilnya memuaskan.",
    "Channel ini layak banget dapat lebih banyak subscriber.",
    "Saya save video ini, nanti mau share ke grup.",
    "Udah saya tulis ringkasannya, bantu banget.",
    "Jadi paham karena penjelasan yang simpel dan jelas.",
    "Tolong bahas juga platform lain ya, biar lengkap.",
    "Nonton ini bener-bener nambah ilmu dan wawasan.",
    "Gak rugi nonton dari awal sampai akhir.",
    "Tolong jawab di komentar, ada hal penting mau ditanya.",
    "Pas banget ada masalah serupa, ini ngebantu.",
    "Sudah saya tonton dua kali, masih tetap menarik.",
    "Kalau ada webinar lagi, mohon infokan ya.",
    "Saya juga pakai tools yang direkomendasikan.",
    "Konten seperti ini harus sering dibuat.",
    "Masih relevan meski videonya udah lama.",
    "Saya penasaran, ada playlist khusus ga ya?",
    "Langsung klik tombol like, mantap!",
    "Ini topik yang jarang dibahas, terima kasih.",
    "Buat tutorial serupa dengan topik Y ya kak.",
    "Sudah saya catat semua, dan sudah dipraktekkan.",
    "Cocok banget buat yang baru mulai belajar.",
    "Udah di share ke grup kantor.",
    "Saya baru tahu cara ini, keren banget.",
    "Nonton pas jam istirahat, pas banget.",
    "Pembahasan to the point dan efisien.",
    "Setuju banget, saya juga mengalami hal yang sama.",
    "Tertarik ikut workshopnya, ada infonya ga?",
    "Sumber belajar seperti ini harus didukung.",
    "Kualitas video makin bagus dari waktu ke waktu.",
    "Ditunggu kolaborasi dengan channel X.",
    "Gaya editingnya unik dan enak ditonton.",
    "Setelah nonton, langsung coba dan berhasil.",
    "Udah ikutin semua stepnya, dan works.",
    "Semoga tetap konsisten bikin konten ya."
];

// --- FUNGSI PENGUJIAN ---
function testFuzzballOnly(commentText, threshold) {
    const normalizedText = normalizeLeetspeak(commentText);

    const matches = fuzzball.extract(normalizedText, knownSpamPhrasesSimple, {
        scorer: fuzzball.token_set_ratio,
        limit: 1,
        cutoff: threshold,
    });

    return matches.length > 0;
}

// --- PROSES EKSPERIMEN ---
console.log("Memulai Eksperimen Penentuan Threshold Fuzzball...");
console.log("=================================================");

const thresholdsToTest = [50, 60, 70, 75, 80, 85, 90, 95];

thresholdsToTest.forEach(threshold => {
    let spamDetectedCount = 0;
    let falsePositiveCount = 0;

    spamComments.forEach(comment => {
        if (testFuzzballOnly(comment, threshold)) {
            spamDetectedCount++;
        }
    });

    cleanComments.forEach(comment => {
        if (testFuzzballOnly(comment, threshold)) {
            falsePositiveCount++;
        }
    });

    console.log(`\n--- HASIL UNTUK THRESHOLD: ${threshold} ---`);
    console.log(`Spam Terdeteksi   : ${spamDetectedCount}/${spamComments.length}`);
    console.log(`False Positive    : ${falsePositiveCount}/${cleanComments.length}`);
    const precision = spamDetectedCount / (spamDetectedCount + falsePositiveCount) || 0;
    const recall = spamDetectedCount / spamComments.length;
    const f1 = precision && recall ? (2 * precision * recall) / (precision + recall) : 0;

    console.log(`Precision         : ${(precision * 100).toFixed(2)}%`);
    console.log(`Recall            : ${(recall * 100).toFixed(2)}%`);
    console.log(`F1 Score          : ${(f1 * 100).toFixed(2)}%`);
});

console.log("\n=================================================");
console.log("Eksperimen Selesai.");
