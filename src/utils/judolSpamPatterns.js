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

  // Tangani [dot] dan [.] secara spesifik, ubah menjadi titik aktual untuk pemrosesan URL
  normalized = normalized
    .replace(/\[dot\]/gi, '.') // gi untuk case-insensitive [Dot]
    .replace(/\[\.\]/g, '.');

  // Hapus karakter obfuscating spesifik atau ubah menjadi spasi
  normalized = normalized
    .replace(/_/g, ' ') // Ganti underscore dengan spasi untuk pemisahan kata
    .replace(/`/g, '')   // Hapus backtick
    .replace(/[⸝ உச்சiksaanเเละเเนะนำ]/g, '') // Karakter Unicode spam spesifik (tambahkan lebih banyak jika ditemukan)
    .replace(/[\u200B-\u200D\uFEFF]/g, ''); // Hapus zero-width spaces dan karakter format lainnya

  // Normalisasi spasi (setelah underscore diubah jadi spasi)
  normalized = normalized
    .replace(/\s+/g, ' ') // Ganti beberapa spasi dengan satu spasi
    .trim(); // Hapus spasi di awal/akhir

  // Pertimbangkan untuk menghapus tanda baca berulang atau yang tidak standar jika sering muncul dalam spam
  // Contoh: .replace(/[.,!?;:"'`~#^*()\\[\\]{}<>+=|\\/\-]{2,}/g, match => match[0]) // Kurangi tanda baca berulang jadi satu

  return normalized;
};

// Gabungan pola regex yang lebih kompleks dan tajam untuk mendeteksi judol/spam
// Pola [^\\w\\s]* digunakan untuk menangkap karakter non-alphanumeric dan non-whitespace
// yang mungkin disisipkan di antara huruf-huruf kata kunci setelah normalisasi.
// Normalisasi di atas mempertahankan titik (.) dan beberapa tanda baca lain, jadi [^\\w\\s]* akan cocok dengannya.
const SEP = '[^\\w\\s]*'; // Separator yang diizinkan antar huruf kata kunci

export const judolSpamCombinedRegex = new RegExp(
  [
    // === KATA KUNCI JUDI & SLOT UTAMA ===
    `s${SEP}l${SEP}o${SEP}t`,
    `j${SEP}u${SEP}d${SEP}[i1!]`, // judi
    `c${SEP}[a4@]${SEP}s${SEP}[i1!]${SEP}n${SEP}[o0]`, // casino
    `k${SEP}[a4@]${SEP}s${SEP}[i1!]${SEP}n${SEP}[o0]`, // kasino (variasi)
    `m${SEP}[a4@]${SEP}x${SEP}w${SEP}[i1!]n`, // maxwin
    `j${SEP}[a4@]${SEP}c${SEP}k${SEP}p${SEP}[o0]${SEP}t`, // jackpot
    `d${SEP}[e3]${SEP}p${SEP}[o0](?:${SEP}s${SEP}[i1!]${SEP}t)?`, // deposit, depo
    `t${SEP}[a4@]${SEP}r${SEP}u${SEP}h${SEP}[a4@]${SEP}n`, // taruhan
    `p${SEP}[a4@]${SEP}s${SEP}[a4@]${SEP}n${SEP}g`, // pasang
    `t${SEP}[o0]${SEP}g${SEP}[e3]${SEP}l`, // togel
    `p${SEP}[o0]${SEP}k${SEP}[e3]${SEP}r`, // poker
    `d${SEP}[o0]${SEP}m${SEP}[i1!]${SEP}n${SEP}[o0]`, // domino
    `q${SEP}q`, // qq
    `b${SEP}[a4@]${SEP}n${SEP}d${SEP}[a4@]${SEP}r`, // bandar
    `[a4@]${SEP}g${SEP}[e3]n`, // agen
    `s${SEP}[i1!]${SEP}t${SEP}u${SEP}s`, // situs
    `w${SEP}[e3]${SEP}b${SEP}s${SEP}[i1!]${SEP}t${SEP}[e3]`, // website
    `a${SEP}p${SEP}k`, // apk
    `r${SEP}t${SEP}p`, // rtp (return to player)
    `p${SEP}[o0]${SEP}l${SEP}[a4@]`, // pola
    `s${SEP}c${SEP}[a4@]${SEP}t${SEP}t${SEP}[e3]${SEP}r`, // scatter
    `j${SEP}p`, // jp (jackpot)
    `s${SEP}[e3]${SEP}n${SEP}s${SEP}[a4@]`, // sensa (sensational)
    `b${SEP}[i1!]${SEP}g${SEP}w${SEP}[i1!]n`, // bigwin
    `m${SEP}[e3]${SEP}g${SEP}[a4@]${SEP}w${SEP}[i1!]n`, // megawin
    `p${SEP}[a4@]${SEP}r${SEP}l${SEP}[a4@]${SEP}y`, // parlay
    `m${SEP}[i1!]${SEP}x${SEP}p${SEP}[a4@]${SEP}r${SEP}l${SEP}[a4@]${SEP}y`, // mix parlay
    `s${SEP}l${SEP}o${SEP}t(?:${SEP}o${SEP}n${SEP}l${SEP}[i1!]${SEP}n${SEP}[e3])?`, // slot online
    `j${SEP}u${SEP}d${SEP}[i1!](?:${SEP}o${SEP}n${SEP}l${SEP}[i1!]${SEP}n${SEP}[e3])?`, // judi online
    `b${SEP}[e3]${SEP}t(?:${SEP}t${SEP}[i1!]${SEP}n${SEP}g)?`, // bet, betting
    `t${SEP}[o0]${SEP}t${SEP}[o0]`, // toto
    `g${SEP}[a4@]${SEP}c${SEP}[o0]${SEP}r(?:${SEP}r+)?(?:${SEP}p${SEP}[a4@]${SEP}r${SEP}[a4@]${SEP}h)?`, // gacor, gacorrr, gacor parah
    `[a4@]${SEP}n${SEP}t${SEP}[i1!]${SEP}r${SEP}u${SEP}n${SEP}g${SEP}k${SEP}[a4@]${SEP}d`, // anti rungkad
    `p${SEP}[a4@]${SEP}s${SEP}t${SEP}[i1!]${SEP}w${SEP}d`, // pasti wd
    `p${SEP}[a4@]${SEP}s${SEP}t${SEP}[i1!]${SEP}j${SEP}p`, // pasti jp
    `g${SEP}[a4@]${SEP}m${SEP}p${SEP}[a4@]${SEP}n${SEP}g${SEP}m${SEP}[e3]${SEP}n${SEP}[a4@]${SEP}n${SEP}g`, // gampang menang

    // === JENIS PERMAINAN JUDI LAIN ===
    `s${SEP}[a4@]${SEP}b${SEP}u${SEP}n${SEP}g${SEP}[a4@]${SEP}y${SEP}[a4@]${SEP}m`, // sabung ayam
    `t${SEP}[e3]${SEP}m${SEP}b${SEP}[a4@]${SEP}k${SEP}[i1!]${SEP}k${SEP}[a4@]${SEP}n`, // tembak ikan
    `b${SEP}[o0]${SEP}l${SEP}[a4@]${SEP}t${SEP}[a4@]${SEP}n${SEP}g${SEP}k${SEP}[a4@]${SEP}s`, // bola tangkas
    `s${SEP}[i1!]${SEP}c${SEP}b${SEP}[o0]`, // sicbo
    `b${SEP}[a4@]${SEP}c${SEP}c${SEP}[a4@]${SEP}r${SEP}[a4@]${SEP}t`, // baccarat
    `r${SEP}[o0]${SEP}u${SEP}l${SEP}[e3]${SEP}t${SEP}t${SEP}[e3]`, // roulette

    // === PROVIDER GAME ===
    `p${SEP}r${SEP}[a4@]${SEP}g${SEP}m${SEP}[a4@]${SEP}t${SEP}[i1!]${SEP}c(?:${SEP}p${SEP}l${SEP}[a4@]${SEP}y)?`, // pragmatic, pragmatic play
    `p${SEP}g${SEP}s${SEP}[o0]${SEP}f${SEP}t`, // pgsoft
    `h${SEP}[a4@]${SEP}b${SEP}[a4@]${SEP}n${SEP}[e3]${SEP}r${SEP}[o0]`, // habanero
    `j${SEP}[o0]${SEP}k${SEP}[e3]${SEP}r(?:${SEP}g${SEP}[a4@]${SEP}m${SEP}[i1!]${SEP}n${SEP}g|${SEP}1${SEP}2${SEP}3)?`, // joker, joker gaming, joker123
    `s${SEP}p${SEP}[a4@]${SEP}d${SEP}[e3]${SEP}g${SEP}[a4@]${SEP}m${SEP}[i1!]${SEP}n${SEP}g`, // spadegaming
    `m${SEP}[i1!]${SEP}c${SEP}r${SEP}[o0]${SEP}g${SEP}[a4@]${SEP}m${SEP}[i1!]${SEP}n${SEP}g`, // microgaming

    // === ISTILAH KEUANGAN & TRANSAKSI ===
    `w${SEP}d`, // wd (withdraw)
    `w${SEP}d${SEP}c${SEP}[e3]${SEP}p${SEP}[a4@]${SEP}t`, // wd cepat
    `w${SEP}d${SEP}k${SEP}[i1!]${SEP}l${SEP}[a4@]${SEP}t`, // wd kilat
    `w${SEP}[i1!]${SEP}t${SEP}h${SEP}d${SEP}r${SEP}[a4@]${SEP}w`, // withdraw
    `s${SEP}[a4@]${SEP}l${SEP}d${SEP}[o0]`, // saldo
    `p${SEP}u${SEP}l${SEP}s${SEP}[a4@]`, // pulsa
    `d${SEP}[a4@]${SEP}n${SEP}[a4@]`, // dana
    `[o0]${SEP}v${SEP}[o0]`, // ovo
    `g${SEP}[o0]${SEP}p${SEP}[a4@]${SEP}y`, // gopay
    `l${SEP}[i1!]${SEP}n${SEP}k${SEP}[a4@]${SEP}j${SEP}[a4@]`, // linkaja
    `q${SEP}r${SEP}[i1!]${SEP}s`, // qris
    `t${SEP}r${SEP}[a4@]${SEP}n${SEP}s${SEP}f${SEP}[e3]${SEP}r`, // transfer
    `b${SEP}[a4@]${SEP}n${SEP}k(?:${SEP}l${SEP}[o0]${SEP}k${SEP}[a4@]${SEP}l)?`, // bank, bank lokal
    `[e3]${SEP}w${SEP}[a4@]${SEP}l${SEP}l${SEP}[e3]${SEP}t`, // ewallet
    `r${SEP}[e3]${SEP}k${SEP}[e3]${SEP}n${SEP}[i1!]${SEP}n${SEP}g`, // rekening
    `c${SEP}u${SEP}[a4@]${SEP}n`, // cuan
    `m${SEP}[o0]${SEP}d${SEP}[a4@]${SEP}l(?:${SEP}r${SEP}[e3]${SEP}c${SEP}[e3]${SEP}h)?`, // modal, modal receh

    // === ISTILAH BONUS & PROMOSI ===
    `f${SEP}r${SEP}[e3]${SEP}[e3](?:${SEP}c${SEP}h${SEP}[i1!]${SEP}p|${SEP}b${SEP}[e3]${SEP}t|${SEP}s${SEP}p${SEP}[i1!]${SEP}n)?`, // free chip, free bet, free spin
    `s${SEP}p${SEP}[i1!]${SEP}n${SEP}g${SEP}r${SEP}[a4@]${SEP}t${SEP}[i1!]${SEP}s`, // spin gratis
    `b${SEP}[o0]${SEP}n${SEP}u${SEP}s`, // bonus
    `b${SEP}[o0]${SEP}n${SEP}u${SEP}s${SEP}d${SEP}[e3]${SEP}p${SEP}[o0](?:${SEP}s${SEP}[i1!]${SEP}t)?`, // bonus deposit
    `p${SEP}r${SEP}[o0]${SEP}m${SEP}[o0](?:${SEP}s${SEP}[i1!])?`, // promo, promosi
    `p${SEP}r${SEP}[o0]${SEP}m${SEP}[o0]${SEP}b${SEP}[e3]${SEP}s${SEP}[a4@]${SEP}r`, // promo besar
    `[e3]${SEP}v${SEP}[e3]${SEP}n${SEP}t(?:${SEP}m${SEP}[e3]${SEP}n${SEP}[a4@]${SEP}r${SEP}[i1!]${SEP}k)?`, // event, event menarik
    `c${SEP}[a4@]${SEP}s${SEP}h${SEP}b${SEP}[a4@]${SEP}c${SEP}k(?:${SEP}m${SEP}[i1!]${SEP}n${SEP}g${SEP}g${SEP}u${SEP}[a4@]${SEP}n)?`, // cashback, cashback mingguan
    `r${SEP}[o0]${SEP}l${SEP}l${SEP}[i1!]${SEP}n${SEP}g${SEP}[a4@]${SEP}n`, // rollingan
    `r${SEP}[e3]${SEP}f${SEP}[e3]${SEP}r${SEP}r${SEP}[a4@]${SEP}l`, // referral
    `k${SEP}[o0]${SEP}d${SEP}[e3](?:${SEP}r${SEP}[e3]${SEP}f${SEP}[e3]${SEP}r${SEP}r${SEP}[a4@]${SEP}l|${SEP}p${SEP}r${SEP}[o0]${SEP}m${SEP}[o0])?`, // kode referral, kode promo
    `w${SEP}[e3]${SEP}l${SEP}c${SEP}[o0]${SEP}m${SEP}[e3](?:${SEP}b${SEP}[o0]${SEP}n${SEP}u${SEP}s)?`, // welcome bonus
    `n${SEP}[e3]${SEP}w${SEP}m${SEP}[e3]${SEP}m${SEP}b${SEP}[e3]${SEP}r`, // new member
    `v${SEP}[i1!]${SEP}p`, // vip
    `t${SEP}u${SEP}r${SEP}n${SEP}[a4@]${SEP}m${SEP}[e3]${SEP}n`, // turnamen
    `k${SEP}[o0]${SEP}n${SEP}t${SEP}[e3]${SEP}s`, // kontes
    `h${SEP}[a4@]${SEP}d${SEP}[i1!]${SEP}[a4@]`, // hadiah
    `p${SEP}r${SEP}[i1!]${SEP}z${SEP}[e3]`, // prize
    `t${SEP}u${SEP}r${SEP}n${SEP}[o0]${SEP}v${SEP}[e3]${SEP}r`, // turnover (TO)

    // === ISTILAH AKUN, AKSES, KONTAK ===
    `[a4@]${SEP}k${SEP}u${SEP}n${SEP}p${SEP}r${SEP}[o0]`, // akun pro
    `[a4@]${SEP}k${SEP}u${SEP}n${SEP}b${SEP}[o0]${SEP}s`, // akun bos
    `[a4@]${SEP}k${SEP}u${SEP}n${SEP}s${SEP}u${SEP}l${SEP}t${SEP}[a4@]${SEP}n`, // akun sultan
    `d${SEP}[a4@]${SEP}f${SEP}t${SEP}[a4@]${SEP}r`, // daftar
    `g${SEP}[a4@]${SEP}b${SEP}u${SEP}n${SEP}g`, // gabung
    `m${SEP}[a4@]${SEP}[i1!]${SEP}n`, // main
    `l${SEP}[o0]${SEP}g${SEP}[i1!]${SEP}n`, // login
    `k${SEP}l${SEP}[i1!]${SEP}k`, // klik
    `k${SEP}u${SEP}n${SEP}j${SEP}u${SEP}n${SEP}g${SEP}[i1!]`, // kunjungi
    `h${SEP}u${SEP}b${SEP}u${SEP}n${SEP}g${SEP}[i1!]`, // hubungi
    `[a4@]${SEP}d${SEP}m${SEP}[i1!]${SEP}n`, // admin
    `c${SEP}s`, // cs (customer service)
    `t${SEP}[e3]${SEP}l${SEP}[e3]${SEP}g${SEP}r${SEP}[a4@]${SEP}m`, // telegram
    `l${SEP}[i1!]${SEP}n${SEP}[e3](?:${SEP}[i1!]${SEP}d)?`, // line, line id
    `w${SEP}h${SEP}[a4@]${SEP}t${SEP}s${SEP}[a4@]${SEP}p${SEP}p?`, // whatsapp, whats app
    `g${SEP}r${SEP}u${SEP}p`, // grup
    `c${SEP}h${SEP}[a4@]${SEP}n${SEP}n${SEP}[e3]${SEP}l`, // channel
    `[i1!]${SEP}n${SEP}v${SEP}[i1!]${SEP}t${SEP}[e3]`, // invite
    `l${SEP}[i1!]${SEP}n${SEP}k`, // link
    `b${SEP}[i1!]${SEP}o`, // bio
    `p${SEP}r${SEP}[o0]${SEP}f${SEP}[i1!]${SEP}l${SEP}[e3]`, // profile
    `c${SEP}[e3]${SEP}k`, // cek

    // === ISTILAH HASIL & PREDIKSI ===
    `m${SEP}[e3]${SEP}n${SEP}[a4@]${SEP}n${SEP}g`, // menang
    `k${SEP}[a4@]${SEP}l${SEP}[a4@]${SEP}h`, // kalah
    `h${SEP}[a4@]${SEP}s${SEP}[i1!]${SEP}l`, // hasil
    `p${SEP}r${SEP}[e3]${SEP}d${SEP}[i1!]${SEP}k${SEP}s${SEP}[i1!]`, // prediksi
    `b${SEP}[o0]${SEP}c${SEP}[o0]${SEP}r${SEP}[a4@]${SEP}n`, // bocoran

    // === FRASA UMUM SPAM (dengan asumsi normalisasi menangani spasi) ===
    'g[a4@]b[uon]ng\\s*s[e3]k[a4@]r[a4@]ng', // gabung sekarang
    'w[i1!]n\\s*t[a4@]np[a4@]\\s*b[a4@]t[a4@]s', // win tanpa batas
    '[a4@]ut[o0]\\s*jp', // auto jp
    't[e3]rbukt[i1!]', // terbukti
    'd[i1!]b[a4@]y[a4@]r', // dibayar
    'b[o0]s[a4@]n\\s*m[i1!]sk[i1!]n', // bosan miskin
    'cum[a4@]n\\s*m[o0]d[a4@]l', // cuman modal
    '[a4@]ut[o0]\\s*k[a4@]y[a4@]', // auto kaya
    'wd\\s*t[i1!][a4@]p\\s*j[a4@]m', // wd tiap jam
    'buk[a4@]\\s*sl[o0]t', // buka slot
    'g[a4@]?k\\s*p[a4@]k[e3]\\s*r[i1!]b[e3]t', // gk pake ribet, gak pake ribet
    'b[o0]nus\\s*100\\s*[%persen]+', // bonus 100%, bonus 100 persen
    'gr[a4@]t[i1!]s', // gratis
    'j[a4@]ng[a4@]n\\s*l[e3]w[a4@]tk[a4@]n', // jangan lewatkan
    'r[a4@][i1!]h', // raih
    'tungg[uon]\\s*[a4@]p[a4@]l[a4@]?g[i1!]', // tunggu apalagi
    'd[a4@]p[a4@]tk[a4@]n', // dapatkan
    'm[e3]n[a4@]ng\\s*b[a4@]ny[a4@]k', // menang banyak
    'kl[i1!]k\\s*l[i1!]nk', // klik link
    'l[i1!]nk\\s*d[i1!]\\s*b[i1!]o', // link di bio
    'kl[i1!]k\\s*d[i1!]s[i1!]n[i1!]', // klik disini
    '[a4@]y[o0]\\s*mul[a4@][i1!]\\s*b[e3]rm[a4@][i1!]n', // ayo mulai bermain
    'j[a4@]ng[a4@]n\\s*ny[e3]s[e3]l', // jangan nyesel
    's[i1!]tus\\s*[a4@]m[a4@]n', // situs aman
    'b[a4@]ny[a4@]k\\s*y[a4@]ng\\s*(?:ud[a4@]?h|udah)\\s*wd', // banyak yang udah wd
    'm[i1!]s[i1!]\\s*h[a4@]r[i1!][a4@]n', // misi harian
    'cu[a4@]n\\s*[a4@]ut[o0]\\s*n[a4@]mb[a4@]h', // cuan auto nambah
    's[e3]cr[e3]t', // secret
    'j[a4@]ng[a4@]n\\s*b[i1!]l[a4@]ng\\s*s[i1!][a4@]p[a4@]\\s*s[i1!][a4@]p[a4@]', // jangan bilang siapa siapa
    'cu[a4@]n\\s*t[i1!][a4@]p\\s*put[a4@]r[a4@]n', // cuan tiap putaran
    'wd\\s*[a4@]m[a4@]n', // wd aman

    // === POLA URL/LINK (setelah normalisasi mempertahankan titik) ===
    // URL standar (lebih permisif pada karakter domain)
    '\\b(?:https?://|www\\.)[a-zA-Z0-9\\-]+(?:\\.[a-zA-Z0-9\\-]+)+(?:/[^\\s]*)?',
    // Shortened URLs
    '\\bbit\\.ly/[\\w\\-]+',
    '\\bcutt\\.ly/[\\w\\-]+',
    '\\blinktr\\.ee/[\\w\\-]+',
    '\\btinyurl\\.com/[\\w\\-]+',
    '\\brebrand\\.ly/[\\w\\-]+',
    // Domain umum dengan TLD yang diperluas
    '\\b(?:[a-zA-Z0-9\\-]+\\.)+(?:com|net|org|info|biz|xyz|vip|site|online|club|live|store|shop|app|io|co|asia|pro|link|win|fun|icu|website|tech|space|world|today|top|pw|ws|click|digital|fans|guru|host|loan|money|pics|press|solutions|studio|uno|zone|id|sg|my|th|vn|ph|hk|jp|kr|au|nz|ca|uk|us)(?:/[^\\s]*)?',
    // IP Address dengan port dan path opsional
    '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(?::\\d+)?(?:/[^\\s]*)?',
    // Tautan media sosial
    '\\b(?:t\\.me|telegram\\.me)/[^\\s]+', // Telegram
    '\\bwa\\.me/(?:\\+)?\\d+', // WhatsApp (wa.me/<nomor>)
    '\\bl(?:i|1)ne\\.me/ti/p/[\\w\\-]+', // Line

    // === POLA NOMOR TELEPON & KONTAK ===
    // Nomor telepon Indonesia (lebih komprehensif)
    '\\b(?:\\+?62|0)8[1-9]\\d{7,12}\\b', // +628xxx, 628xxx, 08xxx (8-13 digit setelah 08)
    '\\bcs\\s*wa\\b', // CS WA
    '\\badmin\\s*wa\\b', // Admin WA

    // === POLA ANGKA & MATA UANG ===
    '\\b(?:rp|idr)\\s*[.,]?\\s*\\d{1,3}(?:[.,\\d]{3,})*(?:[.,]\\d{2})?\\b', // Rp/IDR (lebih baik untuk ribuan)
    '\\b\\d{1,3}(?:[.,\\d]{3,})*\\s*(?:ribu|rb|k|jt|juta)\\b', // 10k, 100rb, 1jt
    '\\b(?:usd|\\$)\\s*\\d{1,3}(?:[,.]\\d{3})*(?:[.]\\d{2})?\\b', // USD/$
    '\\b\\d{4,}\\b', // Angka umum >= 4 digit (mungkin perlu penyesuaian agar tidak terlalu banyak false positive)
    '\\d+\\s*%', // Persentase

    // === NAMA SITUS SPESIFIK (dari contoh dan umum, dengan gaya SEP) ===
    // Pola ini menggunakan SEP untuk fleksibilitas antar huruf
    `m${SEP}[a4@]${SEP}x${SEP}x${SEP}8${SEP}8${SEP}8`,
    `j${SEP}u${SEP}d${SEP}[o0]${SEP}l${SEP}k${SEP}[i1!]${SEP}n${SEP}g${SEP}s${SEP}8${SEP}8${SEP}8`,
    `j${SEP}u${SEP}d${SEP}l${SEP}[\\-_.]?${SEP}[a4@]${SEP}j${SEP}[a4@]\\.site`, // judl-aja.site, judl.aja.site
    `j${SEP}u${SEP}d${SEP}[o0]${SEP}l${SEP}9${SEP}9`,
    `j${SEP}[o0]${SEP}d${SEP}l${SEP}w${SEP}[i1!]${SEP}n${SEP}8${SEP}8`,
    `j${SEP}u${SEP}d${SEP}l${SEP}p${SEP}r${SEP}[o0]`,
    `s${SEP}l${SEP}[o0]${SEP}t${SEP}m${SEP}[e3]${SEP}t${SEP}r${SEP}[i1!]${SEP}k${SEP}8${SEP}8`,
    `j${SEP}u${SEP}d${SEP}[o0]${SEP}l${SEP}z${SEP}[^\\w\\s]*\\.xyz`,
    `s${SEP}l${SEP}[o0]${SEP}t${SEP}[\\-_.]?${SEP}w${SEP}[i1!]${SEP}n`,
    `j${SEP}u${SEP}d${SEP}[i1!]${SEP}[\\-_.]?${SEP}l${SEP}[o0]${SEP}l${SEP}8${SEP}8${SEP}[^\\w\\s]*\\.vip`,
    `j${SEP}u${SEP}d${SEP}[i1!]${SEP}l${SEP}[e3]${SEP}g${SEP}[e3]${SEP}n${SEP}d${SEP}[^\\w\\s]*\\.net`,
    `j${SEP}d${SEP}l${SEP}p${SEP}l${SEP}[a4@]${SEP}y${SEP}z`,
    `w${SEP}[i1!]${SEP}n${SEP}n${SEP}[e3]${SEP}r${SEP}7${SEP}7${SEP}7`,
    `j${SEP}d${SEP}8${SEP}8${SEP}8${SEP}[^\\w\\s]*\\.pro`,
    `j${SEP}[uU]${SEP}[dD]${SEP}[o0]${SEP}l${SEP}g${SEP}[o0]`,
    `j${SEP}u${SEP}d${SEP}[a4@L1|!]${SEP}z${SEP}[^\\w\\s]*w${SEP}[i1!]${SEP}n${SEP}[^\\w\\s]*\\.net`,
    `j${SEP}u${SEP}d${SEP}[o0]${SEP}l${SEP}v${SEP}[i1!]${SEP}p${SEP}8${SEP}8`,
    `j${SEP}u${SEP}d${SEP}[o0]${SEP}l${SEP}k${SEP}[i1!]${SEP}n${SEP}g${SEP}s${SEP}[^\\w\\s]*\\.pro`,
    's[\\W_]*l[\\W_]*o[\\W_]*t[\\W_]*m[\\W_]*[a4@][\\W_]*x[\\W_]*\\.win', // Pola S-L-O-T-M-A-X.win
    `j${SEP}u${SEP}d${SEP}u${SEP}l${SEP}m${SEP}[a4@]${SEP}n${SEP}[i1!]${SEP}[a4@]${SEP}[^\\w\\s]*\\.vip`,

    // Pola spesifik "king88" dan variasinya
    `k${SEP}[i1!]${SEP}n${SEP}g${SEP}8${SEP}8(?:${SEP}[^\\w\\s]*\\.(?:vip|com|net|org|xyz|site|online|link|pro|live|id))?`, // king88, king88.vip, king88.com, dll.
    `k${SEP}[i1!]${SEP}n${SEP}g${SEP}8${SEP}8${SEP}[^\\w\\s]*\\[(?:\\.|dot)\\](?:vip|com|net|org|xyz|site|online|link|pro|live|id)`, // king88[.]vip, king88[dot]com

    // Pola tambahan dari judolSpamSimpleRegex (diintegrasikan dan diperluas)
    '\\b(?:bonus|daftar|link|wa|telegram|admin|cs|slot|gacor|maxwin|jp|wd|rtp|deposit|situs|agen|bandar|login|klik|main|bet|online)\\b', // Kata kunci umum tanpa obfuscation ekstrim, berdiri sendiri

  ].join("|"),
  "gi" // Flag 'g' untuk global, 'i' untuk case-insensitivity (meskipun normalisasi sudah lowercase)
);

// Untuk penggunaan, Anda sekarang akan mengimpor `judolSpamCombinedRegex`
// dan `normalizeLeetspeak` dari file ini.
// Daftar frasa seperti `knownSpamPhrasesSimple` tetap di file terpisah (`knownSpamPhrases.js`).
