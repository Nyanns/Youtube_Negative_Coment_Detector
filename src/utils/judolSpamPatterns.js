// src/utils/judolSpamPatterns.js

/**
 * Fungsi untuk melakukan normalisasi dasar pada teks,
 * mengubah huruf menjadi lowercase dan mengganti beberapa karakter umum
 * yang digunakan untuk menyamarkan kata kunci (leetspeak sederhana).
 * Titik (.) dipertahankan untuk pemrosesan URL, underscore (_) diubah jadi spasi.
 * @param {string} text - Teks komentar yang akan dinormalisasi.
 * @returns {string} Teks yang sudah dinormalisasi.
 */
export const normalizeLeetspeak = (text) => {
  if (!text || typeof text !== 'string') return ''; // Pemeriksaan tipe tambahan
  let normalized = text.toLowerCase(); // Ubah ke huruf kecil

  // Konversi leetspeak umum
  normalized = normalized
    .replace(/@/g, 'a')
    .replace(/4/g, 'a')
    .replace(/€/g, 'e') // Simbol Euro sebagai 'e'
    .replace(/3/g, 'e')
    .replace(/1/g, 'i')
    // .replace(/!/g, 'i') // Biarkan '!', regex akan menanganinya jika bagian dari spam
    .replace(/\|/g, 'i') // Karakter pipe sebagai 'i'
    .replace(/0/g, 'o')
    .replace(/\$/g, 's') // Simbol dolar sebagai 's'
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/6/g, 'g') // Kurang umum, tapi mungkin
    .replace(/8/g, 'b') // Kurang umum
    .replace(/9/g, 'p'); // atau 'g'

  // Tangani [dot] dan obfuscation titik lainnya
  normalized = normalized
    .replace(/\[\s*(?:dot|titik)\s*\]/gi, '.')
    .replace(/\(\s*(?:dot|titik)\s*\)/gi, '.')
    .replace(/\s*d[o0]t\s*/g, '.');

  // Hapus karakter obfuscating atau ubah menjadi spasi
  normalized = normalized
    .replace(/_/g, ' ') // Ganti underscore dengan spasi
    .replace(/`/g, '')   // Hapus backtick
    .replace(/[⸝ உச்சiksaanเเละเเนะนำ]/g, '') // Karakter Unicode spam spesifik
    .replace(/[\u200B-\u200D\uFEFF]/g, ''); // Hapus zero-width spaces

  // Normalisasi spasi
  normalized = normalized.replace(/\s+/g, ' ').trim();

  // Pertimbangkan untuk menghapus tanda baca berulang atau yang tidak standar jika sering muncul dalam spam
  // Contoh: .replace(/[.,!?;:"'`~#^*()\\[\\]{}<>+=|\\/\-]{2,}/g, match => match[0]) // Kurangi tanda baca berulang jadi satu

  return normalized;
};

// Gabungan pola regex yang lebih kompleks dan tajam untuk mendeteksi judol/spam
// Pola [^\\w\\s]* digunakan untuk menangkap karakter non-alphanumeric dan non-whitespace
// yang mungkin disisipkan di antara huruf-huruf kata kunci setelah normalisasi.
// Normalisasi di atas mempertahankan titik (.) dan beberapa tanda baca lain, jadi [^\\w\\s]* akan cocok dengannya.
// === SEPARATOR YANG DIPERBAIKI ===
// Separator ini HANYA mengizinkan karakter non-alfanumerik dan BUKAN SPASI.
// Ini mencegah regex melompat dari satu kata ke kata lain.
const SEP = '[^\\w\\s]*';

export const judolSpamCombinedRegex = new RegExp(
  [
    // === KATEGORI: KATA KUNCI JUDI & SLOT UTAMA (VERSI DIPERBAIKI) ===
    // Duplikasi telah dihapus dan pola telah dioptimalkan.

    // --- Konsep Inti & Jenis Permainan ---
    `s${SEP}l${SEP}o${SEP}t(?:${SEP}o${SEP}n${SEP}l${SEP}[i1!]${SEP}n${SEP}[e3])?`, // slot, slot online
    `j${SEP}u${SEP}d${SEP}[i1!](?:${SEP}o${SEP}n${SEP}l${SEP}[i1!]${SEP}n${SEP}[e3])?`, // judi, judi online
    `c${SEP}[a4@]${SEP}s${SEP}[i1!]${SEP}n${SEP}[o0]`, // casino (mencakup variasi 'kasino' dari normalisasi)
    `t${SEP}[o0]${SEP}g${SEP}[e3]${SEP}l`, // togel
    `p${SEP}[o0]${SEP}k${SEP}[e3]${SEP}r`, // poker
    `d${SEP}[o0]${SEP}m${SEP}[i1!]${SEP}n${SEP}[o0]`, // domino
    `t${SEP}[o0]${SEP}t${SEP}[o0]`, // toto
    `q${SEP}q`, // qq

    // --- Istilah Dalam Game & Mekanisme ---
    `m${SEP}[a4@]${SEP}x${SEP}w${SEP}[i1!]n`, // maxwin
    `j${SEP}[a4@]${SEP}c${SEP}k${SEP}p${SEP}[o0]${SEP}t`, // jackpot
    `s${SEP}c${SEP}[a4@]${SEP}t${SEP}t${SEP}[e3]${SEP}r`, // scatter
    `r${SEP}t${SEP}p`, // rtp (return to player)
    `p${SEP}[o0]${SEP}l${SEP}[a4@]`, // pola
    `j${SEP}p`, // jp (jackpot)
    `b${SEP}[i1!]${SEP}g${SEP}w${SEP}[i1!]n`, // bigwin
    `m${SEP}[e3]${SEP}g${SEP}[a4@]${SEP}w${SEP}[i1!]n`, // megawin
    `p${SEP}[a4@]${SEP}r${SEP}l${SEP}[a4@]${SEP}y`, // parlay
    `m${SEP}[i1!]${SEP}x${SEP}p${SEP}[a4@]${SEP}r${SEP}l${SEP}[a4@]${SEP}y`, // mix parlay

    // --- Tindakan & Peran ---
    `b${SEP}[e3]${SEP}t(?:${SEP}t${SEP}[i1!]${SEP}n${SEP}g)?`, // bet, betting
    `t${SEP}[a4@]${SEP}r${SEP}u${SEP}h${SEP}[a4@]${SEP}n`, // taruhan
    `p${SEP}[a4@]${SEP}s${SEP}[a4@]${SEP}n${SEP}g`, // pasang
    `d${SEP}[e3]${SEP}p${SEP}[o0](?:${SEP}s${SEP}[i1!]${SEP}t)?`, // deposit, depo
    `b${SEP}[a4@]${SEP}n${SEP}d${SEP}[a4@]${SEP}r`, // bandar
    `[a4@]${SEP}g${SEP}[e3]n`, // agen
    `s${SEP}[i1!]${SEP}t${SEP}u${SEP}s`, // situs
    `w${SEP}[e3]${SEP}b${SEP}s${SEP}[i1!]${SEP}t${SEP}[e3]`, // website
    `a${SEP}p${SEP}k`, // apk

    // --- Istilah Slang & Frasa Populer ---
    `g${SEP}[a4@]${SEP}c${SEP}[o0]${SEP}r(?:${SEP}r+)?(?:${SEP}p${SEP}[a4@]${SEP}r${SEP}[a4@]${SEP}h)?`, // gacor, gacorrr, gacor parah
    `[a4@]${SEP}n${SEP}t${SEP}[i1!]${SEP}r${SEP}u${SEP}n${SEP}g${SEP}k${SEP}[a4@]${SEP}d`, // anti rungkad
    `p${SEP}[a4@]${SEP}s${SEP}t${SEP}[i1!]${SEP}w${SEP}d`, // pasti wd
    `p${SEP}[a4@]${SEP}s${SEP}t${SEP}[i1!]${SEP}j${SEP}p`, // pasti jp
    `g${SEP}[a4@]${SEP}m${SEP}p${SEP}[a4@]${SEP}n${SEP}g${SEP}m${SEP}[e3]${SEP}n${SEP}[a4@]${SEP}n${SEP}g`, // gampang menang
    `s${SEP}[e3]${SEP}n${SEP}s${SEP}[a4@]`, // sensa (sensational)

    // === KATEGORI: NAMA GAME, PROVIDER, & ISTILAH POPULER (VERSI DIRAPIKAN) ===

    // --- Nama Game Spesifik & Populer ---
    `k${SEP}[a4@]${SEP}k${SEP}[e3]${SEP}k${SEP}z${SEP}[e3]${SEP}u${SEP}s`, // kakek zeus
    `g${SEP}[a4@]${SEP}t${SEP}[e3]${SEP}s${SEP}[o0]${SEP}f${SEP}[o0]${SEP}l${SEP}y${SEP}m${SEP}p${SEP}u${SEP}s`, // gates of olympus
    `s${SEP}t${SEP}[a4@]${SEP}r${SEP}l${SEP}[i1!]${SEP}g${SEP}h${SEP}t`, // starlight princess
    `m${SEP}[a4@]${SEP}h${SEP}j${SEP}[o0]${SEP}n${SEP}g(?:${SEP}w${SEP}[a4@]${SEP}y${SEP}s)?`, // mahjong, mahjong ways
    `k${SEP}[o0]${SEP}[i1!]${SEP}g${SEP}[a4@]${SEP}t${SEP}[e3]`, // koi gate
    `s${SEP}w${SEP}[e3]${SEP}[e3]${SEP}t${SEP}b${SEP}[o0]${SEP}n${SEP}[a4@]${SEP}n${SEP}z${SEP}[a4@]`, // sweet bonanza

    // --- Jenis Permainan Lainnya ---
    `s${SEP}[a4@]${SEP}b${SEP}u${SEP}n${SEP}g${SEP}[a4@]${SEP}y${SEP}[a4@]${SEP}m`, // sabung ayam
    `t${SEP}[e3]${SEP}m${SEP}b${SEP}[a4@]${SEP}k${SEP}[i1!]${SEP}k${SEP}[a4@]${SEP}n`, // tembak ikan
    `b${SEP}[o0]${SEP}l${SEP}[a4@]${SEP}t${SEP}[a4@]${SEP}n${SEP}g${SEP}k${SEP}[a4@]${SEP}s`, // bola tangkas
    `s${SEP}[i1!]${SEP}c${SEP}b${SEP}[o0]`, // sicbo
    `b${SEP}[a4@]${SEP}c${SEP}c${SEP}[a4@]${SEP}r${SEP}[a4@]${SEP}t`, // baccarat
    `r${SEP}[o0]${SEP}u${SEP}l${SEP}[e3]${SEP}t${SEP}t${SEP}[e3]`, // roulette

    // --- Provider Game ---
    `p${SEP}r${SEP}[a4@]${SEP}g${SEP}m${SEP}[a4@]${SEP}t${SEP}[i1!]${SEP}c(?:${SEP}p${SEP}l${SEP}[a4@]${SEP}y)?`, // pragmatic, pragmatic play
    `p${SEP}g${SEP}s${SEP}[o0]${SEP}f${SEP}t`, // pgsoft
    `h${SEP}[a4@]${SEP}b${SEP}[a4@]${SEP}n${SEP}[e3]${SEP}r${SEP}[o0]`, // habanero
    `j${SEP}[o0]${SEP}k${SEP}[e3]${SEP}r(?:${SEP}g${SEP}[a4@]${SEP}m${SEP}[i1!]${SEP}n${SEP}g|${SEP}1${SEP}2${SEP}3)?`, // joker, joker gaming, joker123
    `s${SEP}p${SEP}[a4@]${SEP}d${SEP}[e3]${SEP}g${SEP}[a4@]${SEP}m${SEP}[i1!]${SEP}n${SEP}g`, // spadegaming
    `m${SEP}[i1!]${SEP}c${SEP}r${SEP}[o0]${SEP}g${SEP}[a4@]${SEP}m${SEP}[i1!]${SEP}n${SEP}g`, // microgaming

    // --- Istilah Populer & Slang ---
    `g${SEP}[a4@]${SEP}c${SEP}[o0]${SEP}r(?:nya|r+|x)?`, // gacor, gacornya, dll.
    `m${SEP}[a4@]${SEP}x${SEP}w${SEP}[i1!]n`, // maxwin
    `j${SEP}[a4@]${SEP}c${SEP}k${SEP}p${SEP}[o0]${SEP}t`, // jackpot
    `s${SEP}c${SEP}[a4@]${SEP}t${SEP}t${SEP}[e3]${SEP}r`, // scatter
    `r${SEP}t${SEP}p(?:${SEP}l${SEP}[i1!]${SEP}v${SEP}[e3]|${SEP}[a4@]${SEP}k${SEP}u${SEP}r${SEP}[a4@]${SEP}t)?`, // rtp, rtp live, rtp akurat
    `[a4@]${SEP}n${SEP}t${SEP}[i1!]${SEP}r${SEP}u${SEP}n${SEP}g${SEP}k${SEP}[a4@]${SEP}t?d?`, // anti rungkad, anti rungkat
    `p${SEP}[o0]${SEP}l${SEP}[a4@](?:${SEP}g${SEP}[a4@]${SEP}c${SEP}[o0]${SEP}r)?`, // pola, pola gacor
    `w${SEP}[i1!]${SEP}n${SEP}r${SEP}[a4@]${SEP}t${SEP}[e3]`, // winrate
    `b${SEP}[o0]${SEP}c${SEP}[o0]${SEP}r${SEP}[a4@]${SEP}n(?:${SEP}[a4@]${SEP}d${SEP}m${SEP}[i1!]${SEP}n)?`, // bocoran, bocoran admin

    // === KATEGORI: PROVIDER, KEUANGAN, & PROMOSI (VERSI DIPERBAIKI) ===

    // --- Provider Game (Format diseragamkan) ---
    `p${SEP}r${SEP}[a4@]${SEP}g${SEP}m${SEP}[a4@]${SEP}t${SEP}[i1!]${SEP}c(?:${SEP}p${SEP}l${SEP}[a4@]${SEP}y)?`, // pragmatic, pragmatic play
    `p${SEP}g${SEP}s${SEP}[o0]${SEP}f${SEP}t`, // pgsoft
    `h${SEP}[a4@]${SEP}b${SEP}[a4@]${SEP}n${SEP}[e3]${SEP}r${SEP}[o0]`, // habanero
    `j${SEP}[o0]${SEP}k${SEP}[e3]${SEP}r(?:${SEP}g${SEP}[a4@]${SEP}m${SEP}[i1!]${SEP}n${SEP}g|${SEP}1${SEP}2${SEP}3)?`, // joker, joker gaming, joker123
    `s${SEP}p${SEP}[a4@]${SEP}d${SEP}[e3]${SEP}g${SEP}[a4@]${SEP}m${SEP}[i1!]${SEP}n${SEP}g`, // spadegaming
    `m${SEP}[i1!]${SEP}c${SEP}r${SEP}[o0]${SEP}g${SEP}[a4@]${SEP}m${SEP}[i1!]${SEP}n${SEP}g`, // microgaming
    `c${SEP}q${SEP}9`, // cq9
    `n${SEP}[o0]${SEP}l${SEP}[i1!]${SEP}m${SEP}[i1!]${SEP}t(?:${SEP}c${SEP}[i1!]${SEP}t${SEP}y)?`, // nolimit, nolimit city
    `p${SEP}l${SEP}[a4@]${SEP}y${SEP}t${SEP}[e3]${SEP}c${SEP}h`, // playtech
    `r${SEP}[e3]${SEP}l${SEP}[a4@]${SEP}x(?:${SEP}g${SEP}[a4@]${SEP}m${SEP}[i1!]${SEP}n${SEP}g)?`, // relax, relax gaming

    // --- Istilah Keuangan & Transaksi (Pola 'wd' dioptimalkan) ---
    `w${SEP}d(?:${SEP}(?:c${SEP}[e3]${SEP}p${SEP}[a4@]${SEP}t|k${SEP}[i1!]${SEP}l${SEP}[a4@]${SEP}t))?`, // wd, wd cepat, wd kilat
    `w${SEP}[i1!]${SEP}t${SEP}h${SEP}d${SEP}r${SEP}[a4@]${SEP}w`, // withdraw
    `s${SEP}[a4@]${SEP}l${SEP}d${SEP}[o0]`, // saldo
    `t${SEP}r${SEP}[a4@]${SEP}n${SEP}s${SEP}f${SEP}[e3]${SEP}r`, // transfer
    `m${SEP}[o0]${SEP}d${SEP}[a4@]${SEP}l(?:${SEP}r${SEP}[e3]${SEP}c${SEP}[e3]${SEP}h)?`, // modal, modal receh
    `c${SEP}u${SEP}[a4@]${SEP}n`, // cuan

    // --- Metode Pembayaran ---
    `p${SEP}u${SEP}l${SEP}s${SEP}[a4@]`, // pulsa
    `d${SEP}[a4@]${SEP}n${SEP}[a4@]`, // dana
    `[o0]${SEP}v${SEP}[o0]`, // ovo
    `g${SEP}[o0]${SEP}p${SEP}[a4@]${SEP}y`, // gopay
    `l${SEP}[i1!]${SEP}n${SEP}k${SEP}[a4@]${SEP}j${SEP}[a4@]`, // linkaja
    `q${SEP}r${SEP}[i1!]${SEP}s`, // qris
    `[e3]${SEP}w${SEP}[a4@]${SEP}l${SEP}l${SEP}[e3]${SEP}t`, // ewallet
    `b${SEP}[a4@]${SEP}n${SEP}k(?:${SEP}l${SEP}[o0]${SEP}k${SEP}[a4@]${SEP}l)?`, // bank, bank lokal

    // --- Istilah Bonus & Promosi ---
    `b${SEP}[o0]${SEP}n${SEP}u${SEP}s(?:${SEP}d${SEP}[e3]${SEP}p${SEP}[o0](?:${SEP}s${SEP}[i1!]${SEP}t)?)?`, // bonus, bonus deposit
    `p${SEP}r${SEP}[o0]${SEP}m${SEP}[o0](?:s${SEP}[i1!]|${SEP}b${SEP}[e3]${SEP}s${SEP}[a4@]${SEP}r)?`, // promo, promosi, promo besar
    `f${SEP}r${SEP}[e3]${SEP}[e3](?:${SEP}c${SEP}h${SEP}[i1!]${SEP}p|${SEP}b${SEP}[e3]${SEP}t|${SEP}s${SEP}p${SEP}[i1!]${SEP}n)?`, // free chip, free bet, free spin
    `s${SEP}p${SEP}[i1!]${SEP}n${SEP}g${SEP}r${SEP}[a4@]${SEP}t${SEP}[i1!]${SEP}s`, // spin gratis
    `c${SEP}[a4@]${SEP}s${SEP}h${SEP}b${SEP}[a4@]${SEP}c${SEP}k(?:${SEP}m${SEP}[i1!]${SEP}n${SEP}g${SEP}g${SEP}u${SEP}[a4@]${SEP}n)?`, // cashback, cashback mingguan
    `r${SEP}[o0]${SEP}l${SEP}l${SEP}[i1!]${SEP}n${SEP}g${SEP}[a4@]${SEP}n`, // rollingan
    `r${SEP}[e3]${SEP}f${SEP}[e3]${SEP}r${SEP}r${SEP}[a4@]${SEP}l`, // referral
    `k${SEP}[o0]${SEP}d${SEP}[e3](?:${SEP}r${SEP}[e3]${SEP}f${SEP}[e3]${SEP}r${SEP}r${SEP}[a4@]${SEP}l|${SEP}p${SEP}r${SEP}[o0]${SEP}m${SEP}[o0])?`, // kode referral, kode promo
    `h${SEP}[a4@]${SEP}d${SEP}[i1!]${SEP}[a4@]`, // hadiah
    `p${SEP}r${SEP}[i1!]${SEP}z${SEP}[e3]`, // prize
    `t${SEP}u${SEP}r${SEP}n${SEP}[o0]${SEP}v${SEP}[e3]${SEP}r`, // turnover (TO)

    // --- Istilah Event & Keanggotaan ---
    `w${SEP}[e3]${SEP}l${SEP}c${SEP}[o0]${SEP}m${SEP}[e3](?:${SEP}b${SEP}[o0]${SEP}n${SEP}u${SEP}s)?`, // welcome bonus
    `n${SEP}[e3]${SEP}w${SEP}m${SEP}[e3]${SEP}m${SEP}b${SEP}[e3]${SEP}r`, // new member
    `v${SEP}[i1!]${SEP}p`, // vip
    `[e3]${SEP}v${SEP}[e3]${SEP}n${SEP}t(?:${SEP}m${SEP}[e3]${SEP}n${SEP}[a4@]${SEP}r${SEP}[i1!]${SEP}k)?`, // event, event menarik
    `t${SEP}u${SEP}r${SEP}n${SEP}[a4@]${SEP}m${SEP}[e3]${SEP}n`, // turnamen
    `k${SEP}[o0]${SEP}n${SEP}t${SEP}[e3]${SEP}s`, // kontes

    // === KATEGORI: AKUN, AKSES, KONTAK, & INFO (VERSI DIPERBAIKI & DILENGKAPI) ===

    // --- Akun & Pendaftaran ---
    `[a4@]${SEP}k${SEP}u${SEP}n(?:${SEP}(?:p${SEP}r${SEP}[o0]|v${SEP}[i1!]${SEP}p|b${SEP}[o0]${SEP}s|s${SEP}u${SEP}l${SEP}t${SEP}[a4@]${SEP}n))?`, // akun, akun pro, akun vip, akun bos, akun sultan
    `[i1!]${SEP}d(?:${SEP}p${SEP}r${SEP}[o0])?`, // id, id pro
    `u${SEP}s${SEP}[e3]${SEP}r${SEP}[i1!]${SEP}d`, // userid
    `d${SEP}[a4@]${SEP}f${SEP}t${SEP}[a4@]${SEP}r`, // daftar
    `g${SEP}[a4@]${SEP}b${SEP}u${SEP}n${SEP}g`, // gabung
    `l${SEP}[o0]${SEP}g${SEP}[i1!]${SEP}n`, // login

    // --- Akses & Ajakan (Call to Action) ---
    `k${SEP}u${SEP}n${SEP}j${SEP}u${SEP}n${SEP}g${SEP}[i1!]`, // kunjungi
    `[i1!]${SEP}n${SEP}v${SEP}[i1!]${SEP}t${SEP}[e3]`, // invite
    `b${SEP}[i1!]${SEP}o`, // bio
    `p${SEP}r${SEP}[o0]${SEP}f${SEP}[i1!]${SEP}l${SEP}[e3]`, // profile

    // --- Info Kontak ---
    `h${SEP}u${SEP}b${SEP}u${SEP}n${SEP}g${SEP}[i1!]`, // hubungi
    `[a4@]${SEP}d${SEP}m${SEP}[i1!]${SEP}n`, // admin
    `c${SEP}s`, // cs (customer service)
    `l${SEP}[i1!]${SEP}v${SEP}[e3]${SEP}c${SEP}h${SEP}[a4@]${SEP}t`, // livechat
    `t${SEP}[e3]${SEP}l${SEP}[e3]${SEP}g${SEP}r${SEP}[a4@]${SEP}m`, // telegram
    `w${SEP}h${SEP}[a4@]${SEP}t${SEP}s${SEP}[a4@]${SEP}p${SEP}p?`, // whatsapp, whats app
    `g${SEP}r${SEP}u${SEP}p`, // grup
    `c${SEP}h${SEP}[a4@]${SEP}n${SEP}n${SEP}[e3]${SEP}l`, // channel

    // --- Info Game (Prediksi & Bocoran) ---
    `p${SEP}r${SEP}[e3]${SEP}d${SEP}[i1!]${SEP}k${SEP}s${SEP}[i1!](?:${SEP}j${SEP}[i1!]${SEP}t${SEP}u)?`, // prediksi, prediksi jitu
    `b${SEP}[o0]${SEP}c${SEP}[o0]${SEP}r${SEP}[a4@]${SEP}n(?:${SEP}(?:[a4@]${SEP}d${SEP}m${SEP}[i1!]${SEP}n|s${SEP}l${SEP}o${SEP}t))?`, // bocoran, bocoran admin, bocoran slot

    // === KATEGORI: FRASA UMUM SPAM (VERSI DIPERBAIKI & DILENGKAPI) ===
    // Duplikasi telah dihapus, pola dioptimalkan, dan frasa baru ditambahkan.

    // --- Ajakan & Urgensi (Call to Action & Urgency) ---
    'g[a4@]b[uon]ng\\s*s[e3]k[a4@]r[a4@]ng', // gabung sekarang
    'd[a4@]p[a4@]tk[a4@]n\\s*s[e3]g[e3]r[a4@]', // dapatkan segera
    'kl[i1!]k\\s*l[i1!]nk\\s*d[i1!]\\s*b[i1!]o', // klik link di bio
    'kl[i1!]k\\s*d[i1!]s[i1!]n[i1!]', // klik disini
    '[a4@]y[o0]\\s*mul[a4@][i1!]\\s*b[e3]rm[a4@][i1!]n', // ayo mulai bermain
    'tungg[uon]\\s*[a4@]p[a4@]l[a4@]?g[i1!]', // tunggu apalagi
    'j[a4@]ng[a4@]n\\s*l[e3]w[a4@]tk[a4@]n', // jangan lewatkan
    'j[a4@]ng[a4@]n\\s*r[a4@]g[uon]', // jangan ragu
    'khusus\\s*h[a4@]r[i1!]\\s*[i1!]n[i1!]', // khusus hari ini
    't[e3]rb[a4@]t[a4@]s', // terbatas
    'b[uon]kt[i1!]k[a4@]n\\s*s[e3]nd[i1!]r[i1!]', // buktikan sendiri
    'g[a4@]?k\\s*p[a4@]k[e3]\\s*l[a4@]m[a4@]', // gak pake lama
    'j[a4@]ng[a4@]n\\s*ny[e3]s[e3]l', // jangan nyesel

    // --- Jaminan & Keuntungan (Guarantees & Benefits) ---
    't[e3]rbukt[i1!](?:\\s*m[e3]mb[a4@]y[a4@]r)?', // terbukti, terbukti membayar
    'd[i1!]j[a4@]m[i1!]n(?:\\s*wd)?', // dijamin, dijamin wd
    's[i1!]tus\\s*[a4@]m[a4@]n(?:\\s*d[a4@]n\\s*t[e3]rp[e3]rc[a4@]y[a4@])?', // situs aman, situs aman dan terpercaya
    'r[e3]k[o0]m[e3]nd[a4@]s[i1!](?:\\s*[a4@]d[a4@]m[i1!]n)?', // rekomendasi, rekomendasi admin
    'w[i1!]n\\s*t[a4@]np[a4@]\\s*b[a4@]t[a4@]s', // win tanpa batas
    'm[e3]n[a4@]ng\\s*b[a4@]ny[a4@]k', // menang banyak
    'wd\\s*t[i1!][a4@]p\\s*j[a4@]m', // wd tiap jam
    'cu[a4@]n\\s*t[i1!][a4@]p\\s*h[a4@]r[i1!]', // cuan tiap hari
    'cu[a4@]n\\s*[a4@]ut[o0]\\s*n[a4@]mb[a4@]h', // cuan auto nambah
    '[a4@]ut[o0]\\s*(?:jp|k[a4@]y[a4@])', // auto jp, auto kaya
    'b[o0]nus\\s*100\\s*[%persen]+', // bonus 100%, bonus 100 persen
    'gr[a4@]t[i1!]s', // gratis

    // --- Frasa Clickbait & Spesifik Lainnya ---
    'b[o0]s[a4@]n\\s*m[i1!]sk[i1!]n', // bosan miskin
    'cum[a4@]n\\s*m[o0]d[a4@]l', // cuman modal
    's[o0]lus[i1!]\\s*k[e3][uon][a4@]ng[a4@]n', // solusi keuangan
    'buk[a4@]\\s*sl[o0]t', // buka slot
    'b[a4@]ny[a4@]k\\s*y[a4@]ng\\s*(?:ud[a4@]?h|udah)\\s*wd', // banyak yang udah wd
    'm[i1!]s[i1!]\\s*h[a4@]r[i1!][a4@]n', // misi harian
    'r[a4@]s[a4@]k[a4@]n\\s*s[e3]ns[a4@]s[i1!]nya', // rasakan sensasinya
    'k[a4@]l[a4@]h\\s*d[i1!]\\s*s[i1!]n[i1!]', // kalah disini
    'j[a4@]ng[a4@]n\\s*b[i1!]l[a4@]ng\\s*s[i1!][a4@]p[a4@]\\s*s[i1!][a4@]p[a4@]', // jangan bilang siapa siapa

    // === KATEGORI: URL, KONTAK, & ANGKA (VERSI DIPERBAIKI & DILENGKAPI) ===

    // --- Pola URL & Link ---
    '\\b(?:https?://|www\\.)[a-zA-Z0-9\\-]+(?:\\.[a-zA-Z0-9\\-]+)+(?:/[^\\s]*)?', // URL Standar
    '\\b(?:bit\\.ly|cutt\\.ly|linktr\\.ee|tinyurl\\.com|rebrand\\.ly|s\\.id|t\\.co|youtu\\.be)/[\\w\\-]+', // Gabungan URL Shorteners
    '\\b(?:[a-zA-Z0-9\\-]+\\.)+(?:com|net|org|info|biz|xyz|vip|site|online|club|live|store|shop|app|io|co|asia|pro|link|win|fun|icu|website|tech|space|world|today|top|pw|ws|click|digital|fans|guru|host|loan|money|pics|press|solutions|studio|uno|zone|id|sg|my|th|vn|ph|hk|jp|kr|au|nz|ca|uk|us)(?:/[^\\s]*)?', // Domain umum dengan TLD
    '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(?::\\d+)?(?:/[^\\s]*)?', // Alamat IP
    '\\b(?:t\\.me|telegram\\.me)/[^\\s]+', // Link Telegram
    '\\bwa\\.me/(?:\\+)?\\d+', // Link wa.me
    '\\b\\w+\\s*(?:\\(dot\\)|\\[dot\\]|\\s*d[o0]t\\s*|\\s*\\.\\s*)\\s*(?:com|net|vip|xyz|link|site|org)\\b', // Link yang disamarkan, cth: situs (dot) com atau situs . com

    // --- Pola Nomor Telepon & Kontak ---
    '\\b(?:\\+?62|0)8[1-9]\\d{7,12}\\b', // Nomor HP Indonesia (format standar)
    '\\b08[1-9]\\d(?:[\\s.-]?\\d{3,4}){2,3}\\b', // Nomor HP dengan pemisah (spasi, -, .)
    '\\b(?:cs|admin|no|nomor)\\s*(?:wa|whatsapp|tele)\\b', // Konteks kontak (cs wa, nomor admin, dll)

    // --- Pola Angka & Mata Uang (Lebih Aman) ---
    '\\b(?:rp|idr)\\s*[.,]?\\d{1,3}(?:[.,\\d]{3,})*(?:[.,]\\d{2})?\\b', // Mata uang Rupiah
    '\\b(?:usd|\\$)\\s*\\d{1,3}(?:[,.]\\d{3})*(?:[.]\\d{2})?\\b', // Mata uang Dolar
    '\\b\\d{1,3}(?:[.,\\d]{3,})*\\s*(?:ribu|rb|k|jt|juta)\\b', // Angka dengan singkatan (10k, 50rb, 1jt)
    '\\d+\\s*%', // Persentase
    '(?:depo|deposit|setor|wd|withdraw)\\s*\\d{1,3}(?:[.,\\d]{3,})*\\s*(?:ribu|rb|k|jt|juta)?', // Nominal dalam konteks transaksi

    // === KATEGORI: NAMA SITUS, BRAND, & POLA SPESIFIK (VERSI DIPERBAIKI) ===
    // Duplikasi telah dihapus total, pola usang diganti, dan pola generik baru ditambahkan.

    // --- Pola Nama Situs & Brand yang Sangat Spesifik ---
    '\\b(?:k[\\s._-]*)?[i1!|]n[\\s._-]*g[\\s._-]*8[\\s._-]*8\\b(?:(?:\\s*d[o0]t\\s*|\\s*[\\[.]\\s*)(?:com|vip|net|org|site|link|xyz))?', // Pola terpusat untuk semua variasi "king88"
    `m${SEP}[a4@]${SEP}x${SEP}x${SEP}8${SEP}8${SEP}8`,
    `j${SEP}u${SEP}d${SEP}[o0]${SEP}l${SEP}k${SEP}[i1!]${SEP}n${SEP}g${SEP}s${SEP}8${SEP}8${SEP}8`,
    `s${SEP}l${SEP}[o0]${SEP}t${SEP}m${SEP}[e3]${SEP}t${SEP}r${SEP}[i1!]${SEP}k${SEP}8${SEP}8`,
    `w${SEP}[i1!]${SEP}n${SEP}n${SEP}[e3]${SEP}r${SEP}7${SEP}7${SEP}7`,
    `j${SEP}u${SEP}d${SEP}[i1!]${SEP}l${SEP}[e3]${SEP}g${SEP}[e3]${SEP}n${SEP}d${SEP}[^\\w\\s]*\\.net`,
    `j${SEP}u${SEP}d${SEP}l${SEP}[\\-_.]?${SEP}[a4@]${SEP}j${SEP}[a4@]\\.site`,
    `j${SEP}u${SEP}d${SEP}[o0]${SEP}l${SEP}9${SEP}9`,
    `j${SEP}[o0]${SEP}d${SEP}l${SEP}w${SEP}[i1!]${SEP}n${SEP}8${SEP}8`,
    `j${SEP}u${SEP}d${SEP}l${SEP}p${SEP}r${SEP}[o0]`,
    `j${SEP}u${SEP}d${SEP}[o0]${SEP}l${SEP}z${SEP}[^\\w\\s]*\\.xyz`,
    `s${SEP}l${SEP}[o0]${SEP}t${SEP}[\\-_.]?${SEP}w${SEP}[i1!]${SEP}n`,
    `j${SEP}d${SEP}l${SEP}p${SEP}l${SEP}[a4@]${SEP}y${SEP}z`,
    `j${SEP}d${SEP}8${SEP}8${SEP}8${SEP}[^\\w\\s]*\\.pro`,
    `j${SEP}[uU]${SEP}[dD]${SEP}[o0]${SEP}l${SEP}g${SEP}[o0]`,
    `j${SEP}u${SEP}d${SEP}[o0]${SEP}l${SEP}v${SEP}[i1!]${SEP}p${SEP}8${SEP}8`,
    's[\\W_]*l[\\W_]*o[\\W_]*t[\\W_]*m[\\W_]*[a4@][\\W_]*x[\\W_]*\\.win',
    `j${SEP}u${SEP}d${SEP}u${SEP}l${SEP}m${SEP}[a4@]${SEP}n${SEP}[i1!]${SEP}[a4@]${SEP}[^\\w\\s]*\\.vip`,

    // --- Pola Nama Situs Generik (BARU) ---
    '\\b(?:d[e3]w[a4@]|r[a4@]j[a4@]|r[a4@]t[uon]|j[a4@]g[o0]|m[a4@]st[e3]r)[\\s._-]*(?:sl[o0]t|t[o0]t[o0]|p[o0]k[e3]r)\\b', // cth: dewaslot, rajapoker
    '\\b(?:sl[o0]t|t[o0]t[o0]|b[e3]t)[\\s._-]*(?:88|138|365|777)\\b', // cth: slot88, toto777
    '\\b(?:[a4@]s[i1!]a|j[a4@]k[a4@]rt[a4@]|nus[a4@]nt[a4@]r[a4@])[\\s._-]*(?:sl[o0]t|b[e3]t)\\b', // cth: asiabet, jakartaslot

    // === KATEGORI: KATA KUNCI SPAM UMUM (YANG TELAH DIPERBAIKI) ===
    // Menggunakan \b (word boundary). Kata yang terlalu umum seperti "main" atau "link" telah dihapus untuk menghindari false positive.
    '\\b(?:daftar|telegram|admin|cs|slot|gacor|maxwin|jp|wd|rtp|deposit|situs|agen|bandar|login|bet|cuan)\\b',

    // === KATEGORI: HASHTAG & EMOJI ===
    '#slotgacor(?:hariini)?', '#slotonline', '#judionline', '#situsterpercaya', '#maxwin', '#jp',


    // =========================================================================================
    // === KATEGORI 3: NAMA SITUS & BRAND SPESIFIK ===
    // Pola terpusat dan sangat efektif untuk semua variasi "king88"
    // Pola ini menangkap: spasi, underscore, titik, strip, leetspeak 'i', dan huruf 'k' yang hilang.
    '\\b(?:k[\\s._-]*)?[i1!|]n[\\s._-]*g[\\s._-]*8[\\s._-]*8\\b(?:(?:\\s*d[o0]t\\s*|\\s*[\\[.]\\s*)(?:com|vip|net|org|site|link|xyz))?',

    // Pola untuk brand lain
    '\\b(?:d[e3]w[a4@]|r[a4@]j[a4@]|r[a4@]t[uon]|j[a4@]g[o0]|m[a4@]st[e3]r)[\\s._-]*(?:sl[o0]t|t[o0]t[o0]|p[o0]k[e3]r)\\b', // cth: dewaslot
    '\\b(?:sl[o0]t|t[o0]t[o0]|b[e3]t)[\\s._-]*(?:88|138|365|777)\\b', // cth: slot88

    // === KATEGORI 4: KATA KUNCI SPAM UMUM (AMAN) ===
    '\\b(?:daftar|telegram|admin|cs|slot|gacor|maxwin|jp|wd|rtp|deposit|situs|agen|bandar|login|bet|cuan)\\b',

    // === KATEGORI 5: POLA URL & KONTAK ===
    '\\b(?:https?://|www\\.)[\\w\\-]+(?:\\.[\\w\\-]+)+(?:/[^\\s]*)?',
    '\\b(?:bit\\.ly|cutt\\.ly|tinyurl\\.com|s\\.id)/[\\w\\-]+',
    '\\bwa\\.me/(?:\\+)?\\d+',


  ].join("|"),
  "gi" // Flag 'g' untuk global, 'i' untuk case-insensitivity (meskipun normalisasi sudah lowercase)
);

// Untuk penggunaan, Anda sekarang akan mengimpor `judolSpamCombinedRegex`
// dan `normalizeLeetspeak` dari file ini.
// Daftar frasa seperti `knownSpamPhrasesSimple` tetap di file terpisah (`knownSpamPhrases.js`).
