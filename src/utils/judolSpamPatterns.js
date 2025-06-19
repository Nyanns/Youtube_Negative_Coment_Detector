// src/utils/judolSpamPatterns.js

/**
 * Fungsi untuk melakukan normalisasi dasar pada teks,
 * mengubah huruf menjadi lowercase dan mengganti beberapa karakter umum
 * yang digunakan untuk menyamarkan kata kunci (leetspeak sederhana).
 * Titik (.) dipertahankan untuk pemrosesan URL, underscore (_) diubah jadi spasi.
 * @param {string} text - Teks komentar yang akan dinormalisasi.
 * @returns {string} Teks yang sudah dinormalisasi.
 */
/**
 * Fungsi untuk melakukan normalisasi dasar pada teks.
 * Versi ini disederhanakan untuk memastikan tidak ada kerusakan teks.
 */
export const normalizeLeetspeak = (text) => {
  if (!text || typeof text !== 'string') return '';

  // Proses normalisasi langkah demi langkah untuk kejelasan
  let normalized = text.toLowerCase();

  // 1. Ganti karakter leetspeak umum
  normalized = normalized
    .replace(/@/g, 'a')
    .replace(/4/g, 'a')
    .replace(/€/g, 'e')
    .replace(/3/g, 'e')
    .replace(/1/g, 'i')
    .replace(/!/g, 'i')
    .replace(/\|/g, 'i')
    .replace(/0/g, 'o')
    .replace(/\$/g, 's')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/9/g, 'p');

  // 2. Tangani cara-cara umum untuk menyamarkan titik pada URL
  normalized = normalized
    .replace(/\[\s*(?:dot|titik)\s*\]/gi, '.')
    .replace(/\(\s*(?:dot|titik)\s*\)/gi, '.');

  // 3. Ganti karakter pemisah dengan spasi
  normalized = normalized.replace(/[_-]/g, ' ');

  // 4. Hapus karakter yang tidak diinginkan (selain huruf, angka, spasi, dan titik/koma)
  // Ini akan membersihkan emoji dan simbol aneh lainnya.
  normalized = normalized.replace(/[^a-z0-9\s.,[]()]/g, '');

  // 5. Normalisasi spasi berlebih menjadi satu spasi
  normalized = normalized.replace(/\s+/g, ' ').trim();

  return normalized;
};


// Separator untuk menyisipkan di antara huruf (menangkap .,-,_ dll)
const SEP = '[^\\w\\s]*';

export const judolSpamCombinedRegex = new RegExp(
  [
    // === KATEGORI: KATA KUNCI JUDI & SLOT UTAMA (VERSI DIPERBAIKI) ===
    // Pola yang terlalu umum telah dihapus atau dibuat lebih spesifik.

    // --- Konsep Inti & Jenis Permainan (Aman) ---
    `s${SEP}l${SEP}o${SEP}t(?:${SEP}o${SEP}n${SEP}l${SEP}ine)?`, // slot, slot online
    `j${SEP}u${SEP}d${SEP}i(?:${SEP}o${SEP}n${SEP}l${SEP}ine)?`, // judi, judi online
    `c${SEP}a${SEP}s${SEP}ino`, // casino
    `t${SEP}o${SEP}g${SEP}el`, // togel
    `p${SEP}o${SEP}k${SEP}er`, // poker
    `d${SEP}o${SEP}m${SEP}i${SEP}n${SEP}o`, // domino
    `\\b${SEP}t${SEP}o${SEP}t${SEP}o${SEP}\\b`, // PERBAIKAN: 'toto' harus berupa kata utuh. Ini adalah perbaikan utama.
    `q${SEP}q`, // qq

    // --- Istilah Dalam Game & Mekanisme (Diperbaiki) ---
    `m${SEP}a${SEP}x${SEP}win`, // maxwin
    `j${SEP}a${SEP}c${SEP}k${SEP}p${SEP}ot`, // jackpot
    `s${SEP}c${SEP}a${SEP}t${SEP}t${SEP}er`, // scatter
    `\\b${SEP}g${SEP}a${SEP}c${SEP}or${SEP}\\b`, // PERBAIKAN: 'gacor' harus kata utuh
    `\\b${SEP}r${SEP}t${SEP}p(?:${SEP}l${SEP}i${SEP}v${SEP}e)?${SEP}\\b`, // PERBAIKAN: 'rtp' harus kata utuh
    `j${SEP}p`, // jp (jackpot)
    `b${SEP}i${SEP}g${SEP}w${SEP}i${SEP}n`, // bigwin
    `m${SEP}e${SEP}g${SEP}a${SEP}w${SEP}i${SEP}n`, // megawin
    `p${SEP}a${SEP}r${SEP}l${SEP}a${SEP}y`, // parlay
    `m${SEP}i${SEP}x${SEP}p${SEP}a${SEP}r${SEP}l${SEP}a${SEP}y`, // mix parlay

    // --- Tindakan & Peran (Diperbaiki) ---
    `\\b${SEP}b${SEP}e${SEP}t(?:${SEP}t${SEP}ing)?${SEP}\\b`, // PERBAIKAN: 'bet' harus berupa kata utuh.
    `t${SEP}a${SEP}r${SEP}u${SEP}h${SEP}an`, // taruhan
    // `p${SEP}a${SEP}s${SEP}a${SEP}n${SEP}g`, // Dihapus: Terlalu umum (cth: "pasang lampu"). Lebih baik andalkan frasa "pasang nomor" dari knownSpamPhrases.js
    `d${SEP}e${SEP}p${SEP}o(?:${SEP}s${SEP}it)?`, // deposit, depo
    `b${SEP}a${SEP}n${SEP}d${SEP}ar`, // bandar
    `a${SEP}g${SEP}en`, // agen
    // `s${SEP}i${SEP}t${SEP}u${SEP}s`, // Dihapus: Terlalu umum. Andalkan frasa seperti "situs gacor", "kunjungi situs".
    `w${SEP}e${SEP}b${SEP}s${SEP}it${SEP}e`, // website
    // `a${SEP}p${SEP}k`, // Dihapus: Terlalu umum di channel teknologi. Andalkan frasa "download aplikasi".

    // --- Istilah Slang & Frasa Populer (Diperbaiki) ---
    `g${SEP}a${SEP}c${SEP}o${SEP}r(?:${SEP}r+)?(?:${SEP}p${SEP}a${SEP}r${SEP}a${SEP}h)?`, // gacor, gacorrr, gacor parah
    `a${SEP}n${SEP}t${SEP}i${SEP}r${SEP}u${SEP}n${SEP}g${SEP}k${SEP}a${SEP}d`, // anti rungkad
    `p${SEP}a${SEP}s${SEP}t${SEP}i${SEP}w${SEP}d`, // pasti wd
    `p${SEP}a${SEP}s${SEP}t${SEP}i${SEP}j${SEP}p`, // pasti jp
    `g${SEP}a${SEP}m${SEP}p${SEP}a${SEP}n${SEP}g${SEP}m${SEP}e${SEP}n${SEP}a${SEP}n${SEP}g`, // gampang menang
    // `s${SEP}e${SEP}n${SEP}s${SEP}a`, // Dihapus: Terlalu umum (cth: "rasakan sensasinya")

    // === KATEGORI: NAMA GAME, PROVIDER, & ISTILAH POPULER (VERSI DIPERBAIKI) ===

    // --- Nama Game Spesifik & Populer (Aman & Spesifik) ---
    `k${SEP}a${SEP}k${SEP}e${SEP}k${SEP}z${SEP}e${SEP}us`, // kakek zeus
    `g${SEP}a${SEP}t${SEP}e${SEP}s${SEP}o${SEP}f${SEP}o${SEP}l${SEP}y${SEP}m${SEP}p${SEP}us`, // gates of olympus
    `s${SEP}t${SEP}a${SEP}r${SEP}l${SEP}i${SEP}g${SEP}h${SEP}t`, // starlight princess
    `m${SEP}a${SEP}h${SEP}j${SEP}o${SEP}n${SEP}g(?:${SEP}w${SEP}a${SEP}y${SEP}s)?`, // mahjong, mahjong ways
    `k${SEP}o${SEP}i${SEP}g${SEP}a${SEP}t${SEP}e`, // koi gate
    `s${SEP}w${SEP}ee${SEP}t${SEP}b${SEP}o${SEP}n${SEP}a${SEP}n${SEP}z${SEP}a`, // sweet bonanza

    // --- Jenis Permainan Lainnya (Aman & Spesifik) ---
    `s${SEP}a${SEP}b${SEP}u${SEP}n${SEP}g${SEP}a${SEP}y${SEP}a${SEP}m`, // sabung ayam
    `t${SEP}e${SEP}m${SEP}b${SEP}a${SEP}k${SEP}i${SEP}k${SEP}a${SEP}n`, // tembak ikan
    `b${SEP}o${SEP}l${SEP}a${SEP}t${SEP}a${SEP}n${SEP}g${SEP}k${SEP}a${SEP}s`, // bola tangkas
    `s${SEP}i${SEP}c${SEP}b${SEP}o`, // sicbo
    `b${SEP}a${SEP}c${SEP}c${SEP}a${SEP}r${SEP}a${SEP}t`, // baccarat
    `r${SEP}o${SEP}u${SEP}l${SEP}e${SEP}t${SEP}t${SEP}e`, // roulette

    // --- Provider Game (Aman & Spesifik) ---
    `p${SEP}r${SEP}a${SEP}g${SEP}m${SEP}a${SEP}t${SEP}ic(?:${SEP}p${SEP}l${SEP}a${SEP}y)?`, // pragmatic, pragmatic play
    `p${SEP}g${SEP}s${SEP}o${SEP}f${SEP}t`, // pgsoft
    `h${SEP}a${SEP}b${SEP}a${SEP}n${SEP}e${SEP}r${SEP}o`, // habanero
    `j${SEP}o${SEP}k${SEP}er(?:${SEP}g${SEP}a${SEP}m${SEP}ing|${SEP}1${SEP}2${SEP}3)?`, // joker, joker gaming, joker123
    `s${SEP}p${SEP}a${SEP}d${SEP}e${SEP}g${SEP}a${SEP}m${SEP}i${SEP}n${SEP}g`, // spadegaming
    `m${SEP}i${SEP}c${SEP}r${SEP}o${SEP}g${SEP}a${SEP}m${SEP}i${SEP}n${SEP}g`, // microgaming

    // --- Istilah Populer & Slang (Diperbaiki) ---
    `g${SEP}a${SEP}c${SEP}o${SEP}r(?:nya|r+|x)?`, // gacor, gacornya, dll.
    `m${SEP}a${SEP}x${SEP}w${SEP}i${SEP}n`, // maxwin
    `j${SEP}a${SEP}c${SEP}k${SEP}p${SEP}o${SEP}t`, // jackpot
    `s${SEP}c${SEP}a${SEP}t${SEP}t${SEP}e${SEP}r`, // scatter
    `\\b${SEP}r${SEP}t${SEP}p(?:${SEP}l${SEP}i${SEP}v${SEP}e)?${SEP}\\b`, // PERBAIKAN: 'rtp' harus kata utuh
    `a${SEP}n${SEP}t${SEP}i${SEP}r${SEP}u${SEP}n${SEP}g${SEP}k${SEP}a${SEP}t?d?`, // anti rungkad, anti rungkat
    `p${SEP}o${SEP}l${SEP}a${SEP}g${SEP}a${SEP}c${SEP}or`, // Diperbaiki: Hanya menangkap frasa spesifik "pola gacor"
    // `w${SEP}i${SEP}n${SEP}r${SEP}a${SEP}t${SEP}e`, // Dihapus: Terlalu umum untuk banyak jenis game (Mobile Legends, Valorant, dll).
    `b${SEP}o${SEP}c${SEP}o${SEP}r${SEP}a${SEP}n(?:${SEP}a${SEP}d${SEP}m${SEP}i${SEP}n|${SEP}s${SEP}l${SEP}o${SEP}t)`, // Diperbaiki: Hanya menangkap frasa spesifik "bocoran admin" atau "bocoran slot"

    // === KATEGORI: PROVIDER, KEUANGAN, & PROMOSI (VERSI DIPERBAIKI) ===

    // --- Provider Game (Aman & Spesifik) ---
    `p${SEP}r${SEP}a${SEP}g${SEP}m${SEP}a${SEP}t${SEP}ic(?:${SEP}p${SEP}l${SEP}a${SEP}y)?`, // pragmatic, pragmatic play
    `p${SEP}g${SEP}s${SEP}o${SEP}f${SEP}t`, // pgsoft
    `h${SEP}a${SEP}b${SEP}a${SEP}n${SEP}e${SEP}r${SEP}o`, // habanero
    `j${SEP}o${SEP}k${SEP}er(?:${SEP}g${SEP}a${SEP}m${SEP}i${SEP}n${SEP}g|${SEP}1${SEP}2${SEP}3)?`, // joker, joker gaming, joker123
    `s${SEP}p${SEP}a${SEP}d${SEP}e${SEP}g${SEP}a${SEP}m${SEP}i${SEP}n${SEP}g`, // spadegaming
    `m${SEP}i${SEP}c${SEP}r${SEP}o${SEP}g${SEP}a${SEP}m${SEP}i${SEP}n${SEP}g`, // microgaming
    `c${SEP}q${SEP}9`, // cq9
    `n${SEP}o${SEP}l${SEP}i${SEP}m${SEP}i${SEP}t(?:${SEP}c${SEP}i${SEP}t${SEP}y)?`, // nolimit, nolimit city
    `p${SEP}l${SEP}a${SEP}y${SEP}t${SEP}e${SEP}c${SEP}h`, // playtech
    `r${SEP}e${SEP}l${SEP}a${SEP}x(?:${SEP}g${SEP}a${SEP}m${SEP}i${SEP}n${SEP}g)?`, // relax, relax gaming

    // --- Istilah Keuangan & Transaksi (Diperbaiki agar lebih spesifik) ---
    `w${SEP}d(?:${SEP}(?:c${SEP}e${SEP}p${SEP}a${SEP}t|k${SEP}i${SEP}l${SEP}a${SEP}t))?`, // wd, wd cepat, wd kilat
    `w${SEP}i${SEP}t${SEP}h${SEP}d${SEP}r${SEP}a${SEP}w`, // withdraw
    // `s${SEP}a${SEP}l${SEP}d${SEP}o`, // Dihapus: Terlalu umum (saldo e-wallet, saldo pulsa, dll).
    // `t${SEP}r${SEP}a${SEP}n${SEP}s${SEP}f${SEP}e${SEP}r`, // Dihapus: Terlalu umum.
    // `m${SEP}o${SEP}d${SEP}a${SEP}l(?:${SEP}r${SEP}e${SEP}c${SEP}e${SEP}h)?`, // Dihapus: Terlalu umum (modal usaha, dll).
    // `c${SEP}u${SEP}a${SEP}n`, // Dihapus: Terlalu umum.

    // --- Metode Pembayaran (Diperbaiki agar lebih aman) ---
    // `p${SEP}u${SEP}l${SEP}s${SEP}a`, // Dihapus: Terlalu umum. Andalkan frasa 'deposit pulsa'.
    // `d${SEP}a${SEP}n${SEP}a`, // Dihapus: Terlalu umum (bisa berarti 'dana' atau e-wallet).
    `ovo`, // ovo (cukup spesifik)
    `gopay`, // gopay (cukup spesifik)
    `linkaja`, // linkaja (cukup spesifik)
    `qris`, // qris (cukup spesifik)
    `ewallet`,
    // `b${SEP}a${SEP}n${SEP}k(?:${SEP}l${SEP}o${SEP}k${SEP}a${SEP}l)?`, // Dihapus: Terlalu umum.

    // --- Istilah Bonus & Promosi (Diperbaiki agar lebih spesifik) ---
    `bonus(?:${SEP}deposit|${SEP}new${SEP}member|${SEP}referral)`, // Diperbaiki: 'bonus' harus diikuti kata spesifik.
    // `p${SEP}r${SEP}o${SEP}m${SEP}o(?:s${SEP}i|${SEP}b${SEP}e${SEP}s${SEP}a${SEP}r)?`, // Dihapus: Terlalu umum.
    `free(?:${SEP}bet|${SEP}chip|${SEP}spin)`, // Diperbaiki: 'free' harus diikuti kata spesifik.
    `spin${SEP}gratis`,
    `cashback(?:${SEP}mingguan)?`,
    `rollingan`,
    `kode(?:${SEP}referral|${SEP}promo)`, // Diperbaiki: 'kode' harus diikuti kata spesifik.
    // `h${SEP}a${SEP}d${SEP}i${SEP}a${SEP}h`, // Dihapus: Terlalu umum.
    // `p${SEP}r${SEP}i${SEP}z${SEP}e`, // Dihapus: Terlalu umum.
    `turnover`,

    // --- Istilah Event & Keanggotaan (Diperbaiki agar lebih aman) ---
    `welcome${SEP}bonus`, // Diperbaiki: Harus berupa frasa lengkap.
    `new${SEP}member`,
    `vip`,
    // `e${SEP}v${SEP}e${SEP}n${SEP}t(?:${SEP}m${SEP}e${SEP}n${SEP}a${SEP}r${SEP}i${SEP}k)?`, // Dihapus: Terlalu umum.
    // `t${SEP}u${SEP}r${SEP}n${SEP}a${SEP}m${SEP}e${SEP}n`, // Dihapus: Terlalu umum di channel game.
    // `k${SEP}o${SEP}n${SEP}t${SEP}e${SEP}s`, // Dihapus: Terlalu umum.

    // === KATEGORI: AKUN, AKSES, KONTAK, & INFO (VERSI DIPERBAIKI & DILENGKAPI) ===

    // --- Akun & Pendaftaran (Diperbaiki agar sangat spesifik) ---
    `(?:akun|id)${SEP}(?:pro|vip|bos|sultan|hoki|dewa)`, // Diperbaiki: Hanya menangkap 'akun' atau 'id' jika diikuti kata spesifik (pro, vip, dll)
    `userid`, // userid (cukup spesifik)
    `login`,
    // `d${SEP}[a4@]${SEP}f${SEP}t${SEP}[a4@]${SEP}r`, // Dihapus: Terlalu umum (daftar isi, daftar hadir). Andalkan 'daftar sekarang'.
    // `g${SEP}[a4@]${SEP}b${SEP}u${SEP}n${SEP}g`, // Dihapus: Terlalu umum (ayo gabung mabar). Andalkan 'gabung grup'.

    // --- Akses & Ajakan (Call to Action) (Diperbaiki) ---
    // `k${SEP}u${SEP}n${SEP}j${SEP}u${SEP}n${SEP}g${SEP}[i1!]`, // Dihapus: Terlalu umum. Andalkan 'kunjungi situs'.
    // `[i1!]${SEP}n${SEP}v${SEP}[i1!]${SEP}t${SEP}[e3]`, // Dihapus: Terlalu umum.
    `bio`, // Dipertahankan, karena sering dalam konteks 'link di bio'. Risiko rendah.
    `profile`, // Dipertahankan, karena sering dalam konteks 'link di profile'. Risiko rendah.

    // --- Info Kontak (Diperbaiki agar sangat spesifik) ---
    // `h${SEP}u${SEP}b${SEP}u${SEP}n${SEP}g${SEP}[i1!]`, // Dihapus: Terlalu umum. Andalkan 'hubungi kami'.
    // `[a4@]${SEP}d${SEP}m${SEP}[i1!]${SEP}n`, // Dihapus: Terlalu umum (tanya admin channel). Andalkan 'chat admin'.
    // `c${SEP}s`, // Dihapus: Terlalu umum. Andalkan 'customer service' atau 'cs online'.
    `livechat`,
    `telegram`,
    `whatsapp`, // whats app
    // `g${SEP}r${SEP}u${SEP}p`, // Dihapus: Terlalu umum (grup keluarga, grup mabar). Andalkan 'join grup'.
    // `c${SEP}h${SEP}[a4@]${SEP}n${SEP}n${SEP}[e3]${SEP}l`, // Dihapus: Terlalu umum. Kata 'channel' ada di setiap komentar YouTube.

    // --- Info Game (Prediksi & Bocoran) (Diperbaiki) ---
    // `p${SEP}r${SEP}[e3]${SEP}d${SEP}[i1!]${SEP}k${SEP}s${SEP}[i1!](?:${SEP}j${SEP}[i1!]${SEP}t${SEP}u)?`, // Dihapus: Terlalu umum (prediksi skor bola, dll).
    `bocoran(?:${SEP}admin|${SEP}slot)`, // Diperbaiki: Hanya menangkap frasa spesifik "bocoran admin" atau "bocoran slot".

    // === KATEGORI: FRASA UMUM SPAM (VERSI DIPERBAIKI & DILENGKAPI) ===
    // Pola yang sangat umum telah dihapus untuk mengurangi false positive.

    // --- Ajakan & Urgensi (Call to Action & Urgency) (Diperbaiki) ---
    'g[a4@]b[uon]ng\\s*s[e3]k[a4@]r[a4@]ng', // gabung sekarang
    'd[a4@]p[a4@]tk[a4@]n\\s*s[e3]g[e3]r[a4@]', // dapatkan segera
    'kl[i1!]k\\s*l[i1!]nk\\s*d[i1!]\\s*b[i1!]o', // klik link di bio
    'kl[i1!]k\\s*d[i1!]s[i1!]n[i1!]', // klik disini
    'ayo\\s*mulai\\s*bermain', // ayo mulai bermain
    // 'tungg[uon]\\s*[a4@]p[a4@]l[a4@]?g[i1!]', // Dihapus: Terlalu umum.
    // 'j[a4@]ng[a4@]n\\s*l[e3]w[a4@]tk[a4@]n', // Dihapus: Terlalu umum.
    // 'j[a4@]ng[a4@]n\\s*r[a4@]g[uon]', // Dihapus: Terlalu umum.
    // 'khusus\\s*h[a4@]r[i1!]\\s*[i1!]n[i1!]', // Dihapus: Terlalu umum.
    // 't[e3]rb[a4@]t[a4@]s', // Dihapus: Terlalu umum.
    // 'b[uon]kt[i1!]k[a4@]n\\s*s[e3]nd[i1!]r[i1!]', // Dihapus: Terlalu umum.
    'g[a4@]?k\\s*pake\\s*lama', // gak pake lama
    'jangan\\s*nyesel', // jangan nyesel

    // --- Jaminan & Keuntungan (Guarantees & Benefits) (Diperbaiki) ---
    'terbukti\\s*membayar', // Diperbaiki: Harus menjadi frasa lengkap.
    'dijamin\\s*wd', // Diperbaiki: Harus menjadi frasa lengkap.
    'situs\\s*aman(?:\\s*dan\\s*terpercaya)?', // situs aman, situs aman dan terpercaya
    'rekomendasi\\s*admin', // Diperbaiki: Harus menjadi frasa lengkap.
    'win\\s*tanpa\\s*batas', // win tanpa batas
    'menang\\s*banyak', // menang banyak
    'wd\\s*tiap\\s*jam', // wd tiap jam
    'cuan\\s*tiap\\s*hari', // cuan tiap hari
    'cuan\\s*auto\\s*nambah', // cuan auto nambah
    'auto\\s*(?:jp|kaya)', // auto jp, auto kaya
    'bonus\\s*100\\s*[%persen]+', // bonus 100%, bonus 100 persen
    // 'gr[a4@]t[i1!]s', // Dihapus: Terlalu umum, akan menangkap banyak komentar positif.

    // --- Frasa Clickbait & Spesifik Lainnya (Diperbaiki) ---
    'bosan\\s*miskin', // bosan miskin
    'cuman\\s*modal', // cuman modal
    // 's[o0]lus[i1!]\\s*k[e3][uon][a4@]ng[a4@]n', // Dihapus: Terlalu umum di channel finansial.
    'buka\\s*slot', // buka slot
    'banyak\\s*yang\\s*(?:ud[a4@]?h|udah)\\s*wd', // banyak yang udah wd
    // 'm[i1!]s[i1!]\\s*h[a4@]r[i1!][a4@]n', // Dihapus: Terlalu umum di channel game (daily mission).
    // 'r[a4@]s[a4@]k[a4@]n\\s*s[e3]ns[a4@]s[i1!]nya', // Dihapus: Terlalu umum.
    'kalah\\s*disini', // kalah disini
    'jangan\\s*bilang\\s*siapa\\s*siapa', // jangan bilang siapa siapa

    // === KATEGORI: URL, KONTAK, & ANGKA (VERSI DIPERBAIKI & DILENGKAPI) ===

    // --- Pola URL & Link (Aman & Spesifik) ---
    '\\b(?:https?://|www\\.)[a-zA-Z0-9\\-]+(?:\\.[a-zA-Z0-9\\-]+)+(?:/[^\\s]*)?', // URL Standar
    '\\b(?:bit\\.ly|cutt\\.ly|linktr\\.ee|tinyurl\\.com|rebrand\\.ly|s\\.id|t\\.co|youtu\\.be)/[\\w\\-]+', // Gabungan URL Shorteners
    '\\b(?:[a-zA-Z0-9\\-]+\\.)+(?:com|net|org|info|biz|xyz|vip|site|online|club|live|app|asia|pro|link|win|fun|id)(?:/[^\\s]*)?', // Domain umum
    '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(?::\\d+)?(?:/[^\\s]*)?', // Alamat IP
    '\\b(?:t\\.me|telegram\\.me)/[^\\s]+', // Link Telegram
    '\\bwa\\.me/(?:\\+)?\\d+', // Link wa.me
    '\\b\\w+\\s*(?:\\(dot\\)|\\[dot\\]|\\s*d[o0]t\\s*|\\s*\\.\\s*)\\s*(?:com|net|vip|xyz|link|site|org)\\b', // Link yang disamarkan

    // --- Pola Nomor Telepon & Kontak (Aman & Spesifik) ---
    '\\b(?:\\+?62|0)8[1-9]\\d{7,12}\\b', // Nomor HP Indonesia (format standar)
    '\\b08[1-9]\\d(?:[\\s.-]?\\d{3,4}){2,3}\\b', // Nomor HP dengan pemisah
    '\\b(?:cs|admin|no|nomor)\\s*(?:wa|whatsapp|tele)', // Konteks kontak (cs wa, nomor admin, dll)

    // --- Pola Angka & Mata Uang (Diperbaiki agar lebih aman) ---
    '\\b(?:rp|idr)\\s*[.,]?\\d{1,3}(?:[.,\\d]{3,})*(?:[.,]\\d{2})?\\b', // Mata uang Rupiah
    '\\b(?:usd|\\$)\\s*\\d{1,3}(?:[,.]\\d{3})*(?:[.]\\d{2})?\\b', // Mata uang Dolar
    // '\\b\\d{1,3}(?:[.,\\d]{3,})*\\s*(?:ribu|rb|k|jt|juta)\\b', // Dihapus: Terlalu umum (10k subscriber, 1 juta view).
    // '\\d+\\s*%', // Dihapus: Terlalu umum (diskon 50%, baterai 20%).
    '(?:depo|deposit|setor|wd|withdraw)\\s*\\d{1,3}(?:[.,\\d]{3,})*\\s*(?:ribu|rb|k|jt|juta)?', // Dipertahankan: Nominal dalam konteks transaksi spesifik.

    // === KATEGORI: NAMA SITUS, BRAND, & POLA SPESIFIK (VERSI DIPERBAIKI) ===
    // Duplikasi, error, dan pola usang telah dihapus.

    // --- Pola Nama Situs & Brand yang Sangat Spesifik ---
    '\\b(?:k[\\s._-]*)?in[\\s._-]*g[\\s._-]*8[\\s._-]*8\\b(?:(?:\\s*d[o0]t\\s*|\\s*[\\[.]\\s*)(?:com|vip|net|org|site|link|xyz))?', // Pola terpusat untuk semua variasi "king88"
    `m${SEP}a${SEP}x${SEP}x${SEP}8${SEP}8${SEP}8`,
    `j${SEP}u${SEP}d${SEP}o${SEP}l${SEP}k${SEP}i${SEP}n${SEP}g${SEP}s${SEP}8${SEP}8${SEP}8`,
    `s${SEP}l${SEP}o${SEP}t${SEP}m${SEP}e${SEP}t${SEP}r${SEP}i${SEP}k${SEP}8${SEP}8`,
    `w${SEP}i${SEP}n${SEP}n${SEP}e${SEP}r${SEP}7${SEP}7${SEP}7`,
    's[\\W_]*l[\\W_]*o[\\W_]*t[\\W_]*m[\\W_]*a[\\W_]*x[\\W_]*\\.win',
    // `k${SEP}[i1!]<span...>...` // Dihapus karena ada syntax error dan sudah dicakup oleh pola king88 utama.
    // `k${SEP}[i1!]<span...>...` // Dihapus karena ada syntax error dan sudah dicakup oleh pola king88 utama.


    // --- Pola Nama Situs Generik (BARU) ---
    '\\b(?:dewa|raja|ratu|jago|master)[\\s._-]*(?:slot|toto|poker)\\b', // cth: dewaslot, rajapoker
    '\\b(?:slot|toto|bet)[\\s._-]*(?:88|138|365|777)\\b', // cth: slot88, toto777
    '\\b(?:asia|jakarta|nusantara)[\\s._-]*(?:slot|bet)\\b', // cth: asiabet, jakartaslot

    // === KATEGORI: HASHTAG SPAM ===
    '#slotgacor(?:hariini)?', '#slotonline', '#judionline', '#situsterpercaya', '#maxwin', '#jp',


    // === KATEGORI: NAMA SITUS & BRAND SPESIFIK ===
    // Pola terpusat dan sangat efektif untuk semua variasi "king88"
    '\\b(?:k[\\s._-]*)?in[\\s._-]*g[\\s._-]*8[\\s._-]*8\\b(?:(?:\\s*d[o0]t\\s*|\\s*[\\[.]\\s*)(?:com|vip|net|org|site|link|xyz))?',

    // Pola untuk brand generik lainnya
    '\\b(?:dewa|raja|ratu|jago|master)[\\s._-]*(?:slot|toto|poker)\\b', // cth: dewaslot
    '\\b(?:slot|toto|bet)[\\s._-]*(?:88|138|365|777)\\b', // cth: slot88


    // === KATEGORI: POLA URL & KONTAK AMAN ===
    '\\b(?:https?://|www\\.)[\\w\\-]+(?:\\.[\\w\\-]+)+(?:/[^\\s]*)?', // URL standar
    '\\b(?:bit\\.ly|cutt\\.ly|tinyurl\\.com|s\\.id)/[\\w\\-]+', // URL Shortener umum
    '\\bwa\\.me/(?:\\+)?\\d+', // Link WhatsApp

  ].join("|"),
  "gi" // Flag 'g' untuk global, 'i' untuk case-insensitivity (meskipun normalisasi sudah lowercase)
);

// Untuk penggunaan, Anda sekarang akan mengimpor `judolSpamCombinedRegex`
// dan `normalizeLeetspeak` dari file ini.
// Daftar frasa seperti `knownSpamPhrasesSimple` tetap di file terpisah (`knownSpamPhrases.js`).
