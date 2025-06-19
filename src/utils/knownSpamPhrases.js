// src/utils/knownSpamPhrases.js

// Daftar frasa Judol/Spam yang lebih spesifik untuk fuzzy matching.
// Semua kata tunggal dan frasa ambigu (seperti 'akun pro') telah dihapus
// untuk mencegah false positive.
export const knownSpamPhrasesSimple = [
    // === Ajakan & Instruksi ===
    'daftar sekarang',
    'klik link di profil',
    'cek bio sekarang',
    'gabung sekarang',
    'join grup wa',
    'link grup telegram',
    'chat admin sekarang',
    'kunjungi situs kami',
    'download aplikasi',

    // === Bonus & Promosi ===
    'bonus new member',
    'bonus member baru',
    'bonus deposit 100',
    'bonus referral',
    'bonus rollingan',
    'bonus cashback',
    'saldo gratis',
    'dana kaget',
    'link dana kaget',
    'klaim bonus',

    // === Kemenangan & Keuntungan ===
    'jp pasti cair',
    'pasti bayar',
    'dijamin wd',
    'wd cepat',
    'gampang menang',
    'modal kecil untung besar',
    'modal receh jadi sultan',
    'bukti jp member',
    '100 dijamin bayar',

    // === Istilah Judi & Game (Hanya Frasa) ===
    'slot online terpercaya',
    'togel online resmi',
    'live casino online',
    'poker online uang asli',
    'situs gacor hari ini',
    'pola gacor malam ini',
    'rtp live akurat',
    'jam gacor main slot',
    'bocoran slot gacor',
    'bocoran admin slot',
    'akun pro vip',
    'mix parlay jalan',
    'sabung ayam online',
    'tembak ikan online',
    'anti rungkad terbukti',
    'jackpot progresif',

    // === Situs & Platform ===
    'link alternatif resmi',
    'situs terpercaya',
    'agen slot terpercaya',
    'bandar judi online',

    // === Transaksi ===
    'deposit pulsa tanpa potongan',
    'depo via pulsa',
    'depo 10k wd 50k',
    'wd tanpa batas',
    'proses wd cepat',

    // === Lain-lain & Seruan Spam ===
    'jangan bilang siapa siapa',
    'rahasia menang slot',
    'layanan 24 jam nonstop',
    'customer service online',
    'live chat 24 jam',
    'akun hoki',

    // === Brand Spesifik ===
    'king88',
    'k1ng88',
    'king_88',
];
