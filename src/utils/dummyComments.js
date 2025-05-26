// dummyComments.js

// Array berisi data komentar dummy untuk pengujian
// Sertakan berbagai jenis komentar: normal, judol/spam jelas, judol/spam dengan variasi (leetspeak, typo, dll.)
export const dummyComments = [
    // --- Komentar Normal ---
    { id: 'normal_001', text: 'Terima kasih banyak untuk videonya, sangat informatif!' },
    { id: 'normal_002', text: 'Mantap sekali penjelasannya, mudah dipahami.' },
    { id: 'normal_003', text: 'Saya suka konten seperti ini, terus berkarya!' },
    { id: 'normal_004', text: 'Pertanyaan bagus! Saya juga penasaran.' },
    { id: 'normal_005', text: 'Semangat terus channel-nya!' },
    { id: 'normal_006', text: 'Apakah ada video lanjutan tentang topik ini?' },
    { id: 'normal_007', text: 'Kualitas audionya jernih.' },
    { id: 'normal_008', text: 'Visualnya menarik.' },
    { id: 'normal_009', text: 'Saya sudah subscribe!' },
    { id: 'normal_010', text: 'Kapan upload video baru lagi?' },
    { id: 'normal_011', text: 'Ini sangat membantu tugas sekolah saya.' },
    { id: 'normal_012', text: 'Saya setuju dengan pendapat Anda.' },
    { id: 'normal_013', text: 'Bisa tolong jelaskan lebih detail bagian ini?' },
    { id: 'normal_014', text: 'Komentar positif!' },
    { id: 'normal_015', text: 'Nice video!' },
    { id: 'normal_016', text: 'Good job!' },
    { id: 'normal_017', text: 'Saya tunggu video berikutnya.' },
    { id: 'normal_018', text: 'Sangat menginspirasi.' },
    { id: 'normal_019', text: 'Terima kasih atas ilmunya.' },
    { id: 'normal_020', text: 'Saya baru tahu tentang ini.' },
    { id: 'normal_021', text: 'Bagaimana cara melakukannya?' },
    { id: 'normal_022', text: 'Ada tips lain?' },
    { id: 'normal_023', text: 'Saya akan coba ini di rumah.' },
    { id: 'normal_024', text: 'Pengalaman yang menarik.' },
    { id: 'normal_025', text: 'Tetap semangat!' },
    { id: 'normal_026', text: 'Konten berkualitas!' },
    { id: 'normal_027', text: 'Saya rekomendasikan video ini.' },
    { id: 'normal_028', text: 'Sangat bermanfaat.' },
    { id: 'normal_029', text: 'Penjelasan yang clear.' },
    { id: 'normal_030', text: 'Saya suka gaya penyampaiannya.' },

    // --- Komentar Judol/Spam (Jelas) ---
    { id: 'spam_001', text: 'Daftar di situs kami untuk bonus new member! link ada di bio' },
    { id: 'spam_002', text: 'Main slot gacor hari ini? Kunjungi w3bsite kami sekarang!' },
    { id: 'spam_003', text: 'Link alternatif terbaru: [link situs judol]. Menang mudah!' },
    { id: 'spam_004', text: 'Gabung grup telegram kami untuk info bocoran s10t: t.me/judolinfo' },
    { id: 'spam_005', text: 'Dapatkan JP paus setiap hari di [nama situs]. Link di deskripsi!' },
    { id: 'spam_006', text: 'Situs terpercaya 2024, depo via pulsa tanpa potongan! cek profil' },
    { id: 'spam_007', text: 'Promo besar-besaran! Free spin 100x untuk member baru. Klik sini!' },
    { id: 'spam_008', text: 'Menang jutaan rupiah dengan modal kecil? Hanya di situs kami!' },
    { id: 'spam_009', text: 'RTP live tertinggi hari ini! Buktikan sendiri di [link].' },
    { id: 'spam_010', text: 'Jangan lewatkan kesempatan emas ini! Daftar sekarang juga!' },
    { id: 'spam_011', text: 'Situs resmi [nama situs], aman dan terpercaya. Kunjungi segera!' },
    { id: 'spam_012', text: 'Info terbaru s10t gacor malam ini, cek di channel kami!' },
    { id: 'spam_013', text: 'Daftar, depo, main, withdraw! Proses cepat 24 jam.' },
    { id: 'spam_014', text: 'Bonus deposit harian 10%! Ajak teman dapat bonus referral.' },
    { id: 'spam_015', text: 'Link login dan daftar terbaru [nama situs].' },
    { id: 'spam_016', text: 'Kumpulan situs judol terpercaya 2024, ada di sini!' },
    { id: 'spam_017', text: 'Modal 10rb bisa menang jutaan? Cuma di [nama situs]!' },
    { id: 'spam_018', text: 'Raih kemenangan maksimal di situs rekomendasi kami!' },
    { id: 'spam_019', text: 'Tersedia berbagai jenis permainan, s10t, poker, dll.' },
    { id: 'spam_020', text: 'Link pendaftaran gratis, langsung dapat bonus!' },

    // --- Komentar Judol/Spam (dengan Variasi/Leetspeak/Typo) ---
    { id: 'spam_var_001', text: 'Daftar di s1tu5 kami untuk b0nu5 n3w m3mb3r! l1nk ada di b10' }, // Leetspeak
    { id: 'spam_var_002', text: 'Main s10t g4c0r hari ini? Kunjungi w3b51t3 kami 53k4r4ng!' }, // Leetspeak
    { id: 'spam_var_003', text: 'Link alt3rn4t1f terbaru: [link situs judol]. M3n4ng mudah!' }, // Leetspeak
    { id: 'spam_var_004', text: 'Gabung grup t3l3gr4m kami untuk info bocoran s10t: t.me/judolinfo' }, // Leetspeak
    { id: 'spam_var_005', text: 'Dapatkan JP p4u5 setiap hari di [nama situs]. L1nk di deskripsi!' }, // Leetspeak
    { id: 'spam_var_006', text: 'Situs terpercaya 2024, depo via pulsa t4np4 potongan! cek profil' }, // Leetspeak
    { id: 'spam_var_007', text: 'Promo besar-besaran! Fr33 5p1n 100x untuk member baru. Kl1k sini!' }, // Leetspeak
    { id: 'spam_var_008', text: 'Menang jutaan rupiah dengan modal kecil? Hanya di situs kami!!' }, // Extra character
    { id: 'spam_var_009', text: 'RTP live tertinggi hari ini! Buktikan sendiri di [link]..' }, // Extra character
    { id: 'spam_var_010', text: 'Jangan lewatkan kesempatan emas ini! Daftar sekarang juga!!!' }, // Extra character
    { id: 'spam_var_011', text: 'Situs resmi [nama situs], aman dan terpercaya. Kunjungi segera!!!' }, // Extra character
    { id: 'spam_var_012', text: 'Info terbaru slot gacor malam ini, cek di channel kami ya!' }, // Added normal words
    { id: 'spam_var_013', text: 'Daftar, depo, main, withdraw! Proses cepat 24 jam lho.' }, // Added normal words
    { id: 'spam_var_014', text: 'Bonus deposit harian 10%! Ajak teman dapat bonus referral yang besar.' }, // Added normal words
    { id: 'spam_var_015', text: 'Link login dan daftar terbaru [nama situs] nih.' }, // Added normal words
    { id: 'spam_var_016', text: 'Kumpulan situs judol terpercaya 2024, ada di sini saja!' }, // Added normal words
    { id: 'spam_var_017', text: 'Modal 10rb bisa menang jutaan? Cuma di [nama situs] dong!' }, // Added normal words
    { id: 'spam_var_018', text: 'Raih kemenangan maksimal di situs rekomendasi kami, yuk!' }, // Added normal words
    { id: 'spam_var_019', text: 'Tersedia berbagai jenis permainan, slot, poker, dll di sini.' }, // Added normal words
    { id: 'spam_var_020', text: 'Link pendaftaran gratis, langsung dapat bonus besar!' }, // Added normal words
    { id: 'spam_var_021', text: 'Daftar dan menang di situs kami!' }, // Shorter spam
    { id: 'spam_var_022', text: 'Situs gacor terbaru!' }, // Shorter spam
    { id: 'spam_var_023', text: 'Link bonus di sini.' }, // Shorter spam
    { id: 'spam_var_024', text: 'Info JP hari ini.' }, // Shorter spam
    { id: 'spam_var_025', text: 'Depo pulsa termurah.' }, // Shorter spam
    { id: 'spam_var_026', text: 'Situs terpercaya 2025.' }, // Variation year
    { id: 'spam_var_027', text: 'Main s.l.o.t di sini!' }, // Added dots
    { id: 'spam_var_028', text: 'j.u.d.o.l online terpercaya' }, // Added dots
    { id: 'spam_var_029', text: 'link situs gacor 2024' }, // Missing brackets
    { id: 'spam_var_030', text: 'daftar dan dapatkan bonus' }, // Missing link/site name
    { id: 'spam_var_031', text: 'situs judi online terbaik' }, // Generic term
    { id: 'spam_var_032', text: 'agen slot terpercaya' }, // Generic term
    { id: 'spam_var_033', text: 'bandar judi terbesar' }, // Generic term
    { id: 'spam_var_034', text: 'main dan menang setiap hari' }, // Generic benefit
    { id: 'spam_var_035', text: 'link daftar terbaru 2024' }, // Generic link
    { id: 'spam_var_036', text: 'promo bonus new member' }, // Generic promo
    { id: 'spam_var_037', text: 'rtp live tertinggi' }, // Generic term
    { id: 'spam_var_038', text: 'depo via dana' }, // Payment method
    { id: 'spam_var_039', text: 'withdraw cepat dan mudah' }, // Benefit
    { id: 'spam_var_040', text: 'gabung sekarang juga!' }, // Call to action

    // --- Komentar Campuran/Borderline (untuk menguji akurasi) ---
    { id: 'mixed_001', text: 'Videonya bagus, tapi saya pernah lihat situs yang menawarkan bonus mirip seperti yang Anda sebutkan di awal.' }, // Mengandung frasa terkait
    { id: 'mixed_002', text: 'Apakah topik ini ada hubungannya dengan permainan online?' }, // Pertanyaan polos?
    { id: 'mixed_003', text: 'Saya mencari cara untuk mendapatkan penghasilan tambahan online.' }, // Bisa jadi spammer atau orang biasa
    { id: 'mixed_004', text: 'Info lebih lanjut tentang ini bisa dilihat di mana ya?' }, // Bisa jadi spammer atau orang biasa
    { id: 'mixed_005', text: 'Ada yang punya rekomendasi situs belajar coding?' }, // Normal, tapi mungkin ada spammer yang menyisipkan link
];
