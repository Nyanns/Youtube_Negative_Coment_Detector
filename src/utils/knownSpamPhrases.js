// src/utils/knownSpamPhrases.js

// Daftar frasa Judol/Spam yang lebih lengkap untuk fuzzy matching atau pencocokan langsung.
// Daftar ini mencakup berbagai variasi kata kunci terkait judi online, promosi,
// ajakan, dan istilah umum yang digunakan dalam spam.
export const knownSpamPhrasesSimple = [
    // Ajakan dan Instruksi
    'daftar sekarang',
    'link di bio',
    'klik link di profil', // BARU
    'cek bio sekarang', // BARU
    'gabung sekarang',
    'join grup',
    'masuk grup',
    'link grup wa',
    'link telegram',
    'chat admin',
    'hubungi kami',
    'kontak admin',
    'nomor wa',
    'login situs',
    'link login',
    'main sekarang',
    'coba gratis',
    'download aplikasi',
    'buka blokir',
    'anti banned',
    'kunjungi situs kami', // BARU

    // Bonus dan Promosi
    'bonus new member',
    'bonus member baru',
    'bonus deposit',
    'bonus harian',
    'bonus mingguan',
    'bonus referral',
    'bonus rollingan',
    'bonus cashback',
    'cashback mingguan', // BARU
    'bonus turnover',
    'freebet',
    'saldo gratis',
    'pulsa gratis',
    'dana kaget',
    'link dana kaget',
    'promo terbatas',
    'event menarik',
    'hadiah langsung',
    'klaim bonus',
    'kode promo',
    'voucher gratis',
    'dapatkan bonus',
    'bonus 100%', // BARU

    // Kemenangan dan Keuntungan
    'jp pasti',
    'auto jp',
    'jp besar',
    'jp paus', // BARU
    'sensational jackpot', // BARU
    'wd aman',
    'pasti bayar',
    'dijamin wd', // BARU
    'wd cepat',
    'wd lancar',
    'withdraw cepat',
    'withdraw aman',
    'gampang menang',
    'menang banyak',
    'menang setiap hari',
    'cuan', // Catatan: Kata ini bisa bersifat umum, tergantung konteks channel.
    'cuan tiap putaran',
    'profit konsisten',
    'dijamin profit',
    'modal kecil untung besar',
    'modal receh jadi sultan', // BARU
    'untung jutaan',
    'kaya mendadak',
    'solusi finansial',
    'bebas hutang',
    'cara cepat kaya',
    'pasif income',
    'uang tambahan',
    'kerja online', // Catatan: Kata ini bisa bersifat umum.
    'bisnis online',
    'bukti jp',
    'hasil jp',
    '100 pasti wd',
    '100 dijamin bayar',

    // Istilah Judi Online Spesifik
    'slot online',
    'togel online',
    'live casino',
    'poker online',
    'dominoqq',
    'bandarqq',
    'situs gacor',
    'pola gacor',
    'rtp live',
    'rtp akurat', // BARU
    'rtp tertinggi',
    'jam gacor',
    'jam hoki main', // BARU
    'pola room', // BARU
    'trik menang',
    'bocoran slot',
    'bocoran admin', // BARU
    'maxwin',
    'maxwin x500', // BARU
    'scatter',
    'bigwin',
    'megawin',
    'judi online',
    'akun pro',
    'akun vip',
    'modal receh',
    'parlay',
    'mix parlay',
    'betting',
    'toto',
    'pragmatic',
    'pg soft', // BARU
    'gates of olympus', // BARU
    'sweet bonanza', // BARU
    'mahjong ways', // BARU
    'super gacor',
    'gacor parah', // BARU
    'anti rungkad',
    'rungkat',
    'pasang nomor',
    'tebak angka',
    '4d', '3d', '2d',
    'colok bebas',
    'shio',
    'putaran gratis',
    'free spin',
    'jackpot progresif',
    'turnamen slot',
    'event slot',
    'promo judi',

    // Situs dan Platform
    'link alternatif',
    'situs terpercaya',
    'situs terbaik',
    'situs terbesar',
    'situs resmi',
    'situs no 1 di indonesia', // BARU
    'agen slot',
    'agen terpercaya', // BARU
    'bandar judi',
    'situs slot',

    // Transaksi
    'deposit pulsa',
    'depo via pulsa', // BARU
    'deposit via dana',
    'deposit via ovo',
    'deposit via gopay',
    'deposit via linkaja',
    'deposit bank',
    'deposit minimal',
    'depo 10k', // BARU
    'withdraw maksimal',
    'wd tanpa batas', // BARU
    'proses cepat',
    'proses hitungan detik', // BARU

    // Lain-lain & Seruan Komunitas Spam
    'jangan lewatkan',
    'jangan bilang siapa siapa',
    'rahasia menang',
    'bocoran rahasia',
    'panduan lengkap',
    'tips dan trik',
    'trik jitu',
    'pola jitu',
    'jam hoki',
    'jam keberuntungan',
    'jangan ragu',
    'buktikan sendiri',
    'pengalaman member',
    'layanan 24 jam',
    'customer service',
    'cs online',
    'live chat',
    'id data',
    'testimoni',
    'review jujur',
    'link viral',
    'video viral',
    'akun hoki',
    'akun super',
    'akun dewa',
    'daftar akun',
    'bikin akun',
    'cara daftar',
    'gaskeun', // BARU
    'salam jp', // BARU
    'salam dari binjai', // BARU, sering digunakan sebagai lelucon spam

    'king88', // BARU
    'akun pro',
    'akun vip',
];

// Anda bisa mengimpor daftar ini di file lain, misalnya di judolSpamPatterns.js
// atau di komponen/fungsi yang melakukan deteksi spam.
// Contoh impor:
// import { knownSpamPhrasesSimple } from './knownSpamPhrases';
