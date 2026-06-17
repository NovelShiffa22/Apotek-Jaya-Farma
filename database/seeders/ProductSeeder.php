<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $now = now();

        $rawData = [
            // 1. PROTHYRA 5MG
            // Sumber: KlikDokter, Medicastore
            [
                'PROTHYRA 5MG TAB@30',
                'TAB',
                2350,
                'Obat-Obatan',
                'Prothyra merupakan obat yang mengandung Medroxyprogesterone Acetate (hormon progesteron sintetis). Digunakan untuk mengatasi berbagai gangguan pada sistem reproduksi wanita seperti amenore sekunder, perdarahan rahim disfungsional, dan endometriosis.',
                'Amenore (tidak haid) sekunder, perdarahan uterus disfungsional akibat ketidakseimbangan hormonal, endometriosis, penundaan haid, dan terapi hormon pengganti.',
                ['Nyeri', 'Lemas'],
                'Medroxyprogesterone Acetate 5 mg',
                'Sesuai petunjuk dokter. Amenore: 5–10 mg/hari selama 5–10 hari. Perdarahan rahim disfungsional: 5–10 mg/hari mulai hari ke-16 atau ke-21 siklus haid. Endometriosis: 10 mg 3x/hari selama 90 hari.',
                'Depresi, retensi cairan, kelelahan, susah tidur, pusing, sakit kepala, mual, nyeri payudara, anoreksia.',
                'Hipersensitivitas terhadap komponen obat, perdarahan vagina yang tidak terdiagnosis, kanker payudara, tromboflebitis atau penyakit tromboemboli, kehamilan.',
            ],
         
            // 2. PANADOL COLD & FLU
            // Sumber: Halodoc, Panadol.com, HonestDocs
            [
                'PANADOL COLD & FLU',
                'TAB',
                15000,
                'Obat Batuk & Pilek',
                'Panadol Cold & Flu merupakan obat flu kombinasi yang mengandung Paracetamol, Pseudoephedrine HCl, dan Dextromethorphan HBr. Diformulasikan untuk meredakan gejala flu secara menyeluruh termasuk demam, hidung tersumbat, dan batuk kering.',
                'Meredakan gejala flu seperti demam, sakit kepala, hidung tersumbat, dan batuk tidak berdahak (batuk kering).',
                ['Flu', 'Batuk', 'Pilek', 'Demam'],
                'Paracetamol 500 mg, Pseudoephedrine HCl 30 mg, Dextromethorphan HBr 15 mg',
                'Dewasa dan anak >12 tahun: 1 kaplet 3 kali sehari. Jangan melebihi 8 kaplet dalam 24 jam. Sesudah makan.',
                'Penggunaan jangka panjang atau dosis besar dapat menyebabkan kerusakan hati. Reaksi hipersensitivitas seperti kemerahan or gatal pada kulit.',
                'Hipersensitif terhadap komponen obat, gangguan fungsi hati berat, gangguan jantung, diabetes mellitus, hipertensi berat, sedang menggunakan obat golongan MAO inhibitor.',
            ],
         
            // 3. PARACETAMOL 500MG
            // Data umum / generik
            [
                'PARACETAMOL 500MG',
                'TAB',
                5000,
                'Analgesik & Antipiretik',
                'Paracetamol 500 mg merupakan obat generik analgesik (pereda nyeri) dan antipiretik (penurun demam) yang bekerja di pusat pengatur suhu tubuh di hipotalamus. Tersedia bebas di apotek tanpa resep dokter.',
                'Meringankan rasa sakit pada sakit kepala, sakit gigi, nyeri otot, nyeri sendi, serta menurunkan demam.',
                ['Demam', 'Pusing', 'Nyeri'],
                'Paracetamol 500 mg',
                'Dewasa dan anak >12 tahun: 1–2 tablet tiap 4–6 jam (maksimal 8 tablet/hari). Anak 6–12 tahun: ½–1 tablet tiap 4–6 jam. Sesudah makan.',
                'Reaksi alergi kulit (jarang terjadi). Penggunaan dosis berlebih dapat menyebabkan kerusakan hati serius.',
                'Hipersensitif terhadap paracetamol. Gangguan fungsi hati berat. Tidak untuk pemakai alkohol kronis.',
            ],
         
            // 4. IMBOOST FORCE
            // Sumber: Halodoc, Medicastore, HelloSehat
            [
                'IMBOOST FORCE',
                'TAB',
                75000,
                'Suplemen & Vitamin',
                'Imboost Force adalah suplemen kesehatan yang mengandung Echinacea Purpurea, Black Elderberry, dan Zinc Picolinate. Ketiga kandungan ini bekerja sinergis untuk merangsang dan memelihara sistem imun tubuh, serta mempercepat pemulihan setelah sakit.',
                'Sebagai suplemen untuk membantu memelihara daya tahan tubuh dan mempercepat pemulihan kondisi setelah sakit.',
                ['Lemas'],
                'Echinacea Purpurea herb dry extract 250 mg, Black Elderberry fruit dry extract 400 mg, Zinc Picolinate 10 mg',
                'Dewasa: 1 kaplet 3 kali sehari. Dapat diminum sebelum atau sesudah makan. Tidak dianjurkan digunakan lebih dari 8 minggu berturut-turut.',
                'Gangguan perut ringan dan reaksi alergi (sangat jarang, biasanya hanya pada dosis tinggi).',
                'Hipersensitif terhadap salah satu komponen. Penyakit autoimun (lupus, multiple sclerosis, rheumatoid arthritis). Pasien transplantasi yang menerima obat imunosupresan. Penderita HIV/AIDS, TBC.',
            ],
         
            // 5. HEPA-MERZ GRANUL@10
            // Sumber: K24Klik, GoapotikS, HaloSehat
            [
                'HEPA-MERZ GRANUL@10',
                'SC',
                57997,
                'Obat-Obatan',
                'Hepa-Merz Granul adalah obat hepatoprotektor yang mengandung L-Ornithine L-Aspartate (LOLA). Bekerja dengan mendetoksifikasi amonia dalam darah pada penderita penyakit hati kronis seperti sirosis dan hepatitis, sehingga membantu mencegah ensefalopati hepatik.',
                'Terapi hyperammonemia (kadar amonia tinggi) pada penyakit hati akut dan kronis, ensefalopati hepatik (pra-koma dan koma hepatik), serta detoksifikasi pada sirosis hati dan perlemakan hati.',
                ['Mual'],
                'L-Ornithine L-Aspartate 3 g per sachet',
                'Sesuai petunjuk dokter. Umumnya 3 kali sehari 1–2 sachet, dilarutkan dalam air sebelum diminum.',
                'Mual, muntah, palpitasi (berdebar-debar).',
                'Gangguan ginjal berat (klirens kreatinin >3 mg/100 ml). Intoleransi fruktosa. Kehamilan.',
            ],
         
            // 6. KIFAMED KURSI RODA RACING (KFM-R)
            // Alat kesehatan
            [
                'KIFAMED KURSI RODA RACING (KFM-R)',
                'UNT',
                1599998,
                'Alat Kesehatan',
                'Kursi roda Kifamed Racing KFM-R merupakan kursi roda manual berdesain ringan dan ergonomis. Dirancang untuk memberikan kemudahan mobilitas bagi pasien yang membutuhkan alat bantu gerak, dengan rangka yang kokoh namun tetap ringan.',
                'Alat bantu mobilitas untuk pasien yang mengalami keterbatasan gerak, pemulihan pasca operasi, atau disabilitas fisik permanen.',
                [],
                '-',
                'Sesuaikan posisi sandaran dan footrest dengan kondisi pengguna. Gunakan di permukaan rata.',
                '-',
                'Tidak dianjurkan digunakan tanpa pengawasan pada medan yang tidak rata atau bergelombang curam.',
            ],
         
            // 7. MARVEE PRIME YOUTH ULTIMATE SERUM 20ML
            // Produk kecantikan
            [
                'MARVEE PRIME YOUTH ULTIMATE SERUM 20ML',
                'BT',
                222000,
                'Kecantikan & Skincare',
                'Marvee Prime Youth Ultimate Serum adalah serum wajah anti-aging yang diformulasikan untuk membantu meremajakan kulit, menyamarkan kerutan halus, dan meningkatkan elastisitas kulit. Mengandung bahan aktif pilihan untuk hasil kulit yang tampak lebih muda dan bercahaya.',
                'Membantu meremajakan kulit wajah, menyamarkan tanda-tanda penuaan (kerutan, garis halus), dan mencerahkan kulit.',
                [],
                'Lihat kemasan (bahan aktif bervariasi per varian)',
                'Aplikasikan 2–3 tetes serum pada wajah yang sudah dibersihkan, pagi dan malam hari. Ratakan dengan lembut hingga meresap.',
                'Reaksi iritasi atau kemerahan pada kulit sensitif.',
                'Hindari kontak dengan mata. Hentikan pemakaian jika terjadi iritasi.',
            ],
         
            // 8. MOLACORT 0.75MG TAB@200 MOL
            // Sumber: Halodoc, Medicastore, Alodokter
            [
                'MOLACORT 0.75MG TAB@200 MOL',
                'TAB',
                277,
                'Obat-Obatan',
                'Molacort mengandung Dexamethasone, kortikosteroid sintetis golongan glukokortikoid yang memiliki aktivitas anti-inflamasi dan imunosupresif kuat. Bekerja dengan menstabilkan membran lisosom leukosit sehingga mencegah pelepasan mediator peradangan.',
                'Kondisi yang membutuhkan terapi kortikosteroid: alergi berat, peradangan akut dan kronis (asma bronkial, artritis reumatoid), penyakit autoimun (lupus, psoriasis), penyakit kulit inflamasi, gangguan kelenjar adrenal.',
                ['Alergi', 'Sesak Napas'],
                'Dexamethasone 0,75 mg',
                'Sesuai petunjuk dokter. Dewasa: 0,5–10 mg/hari dalam 2–4 dosis terbagi. Anak: 0,08–0,3 mg/kg BB/hari dalam 3–4 dosis terbagi. Sesudah makan.',
                'Moonface, tukak lambung, osteoporosis, glaukoma, retensi cairan dan natrium, kelemahan otot, penekanan aksis HPA, peningkatan risiko infeksi.',
                'Infeksi jamur sistemik, infeksi sistemik yang tidak diobati dengan antibiotik spesifik, hipersensitif terhadap deksametason, perforasi membran timpani (penggunaan otik), pemberian vaksin virus hidup.',
            ],
         
            // 9. CELEBON ALOE COLLAGEN MASK
            // Produk kecantikan
            [
                'CELEBON ALOE COLLAGEN MASK',
                'SC',
                20812,
                'Kecantikan & Skincare',
                'Celebon Aloe Collagen Mask adalah masker wajah berbentuk sheet mask yang mengandung ekstrak aloe vera dan kolagen. Diformulasikan untuk melembapkan, mengencangkan, dan menyegarkan kulit wajah secara intensif.',
                'Melembapkan dan menyegarkan kulit wajah, membantu mengencangkan dan melembutkan kulit dengan kandungan kolagen dan aloe vera.',
                [],
                'Aloe Vera Extract, Collagen (lihat kemasan untuk detail lengkap)',
                'Bersihkan wajah, tempelkan masker selama 15–20 menit, lepaskan dan tepuk-tepuk sisa essence hingga meresap. Gunakan 2–3 kali seminggu.',
                'Reaksi iritasi atau kemerahan pada kulit sangat sensitif.',
                'Hentikan pemakaian jika terjadi iritasi. Hindari area mata.',
            ],
         
            // 10. WETKINS BABY WET WIPES@50 PINK
            // Produk bayi
            [
                'WETKINS BABY WET WIPES@50 PINK',
                'BH',
                15944,
                'Ibu & Anak',
                'Wetkins Baby Wet Wipes adalah tisu basah lembut yang diformulasikan khusus untuk membersihkan kulit sensitif bayi. Bebas alkohol, bebas parfum, dan hipoalergenik sehingga aman untuk digunakan setiap hari.',
                'Membersihkan kulit bayi dari kotoran, sisa makanan, dan minyak berlebih. Cocok untuk membersihkan area popok.',
                [],
                'Air murni, bahan pelembap lembut (bebas alkohol)',
                'Gunakan untuk menyeka area yang perlu dibersihkan. Buang setelah digunakan, jangan disiram ke toilet.',
                '-',
                'Hentikan pemakaian jika terjadi reaksi iritasi pada kulit bayi.',
            ],
         
            // 11. CUSSON PREMIER B.FOAM 250 EXTR
            // Produk perawatan tubuh
            [
                'CUSSON PREMIER B.FOAM 250 EXTR',
                'BT',
                7604,
                'Perawatan Tubuh',
                'Cussons Premier Baby Foam adalah sabun mandi busa yang lembut dan aman untuk kulit. Diformulasikan dengan bahan-bahan pilihan yang memberikan busa halus untuk membersihkan tubuh secara menyeluruh tanpa membuat kulit kering.',
                'Membersihkan tubuh dari kotoran, minyak berlebih, dan bakteri sehari-hari.',
                [],
                'Surfaktan lembut, moisturizer, aqua (lihat kemasan untuk detail lengkap)',
                'Tuang secukupnya pada badan yang telah dibasahi air, busakan, bilas hingga bersih.',
                'Reaksi iritasi pada kulit sangat sensitif.',
                'Hindari kontak dengan mata. Hentikan pemakaian jika terjadi iritasi.',
            ],
         
            // 12. HAEMOVEN CR 10GR
            // Krim untuk varises/memar - komposisi tidak berhasil ditemukan secara spesifik
            // Berdasarkan nama "Haemoven", kemungkinan mengandung heparinoid/troxerutin untuk varises
            [
                'HAEMOVEN CR 10GR',
                'TUB',
                2876,
                'Obat-Obatan',
                'Haemoven Krim adalah sediaan topikal yang digunakan untuk membantu meredakan gejala varises ringan, memar, dan gangguan sirkulasi superfisial. Bekerja secara lokal pada pembuluh darah di bawah kulit.',
                'Meredakan memar, lebam, dan gejala varises ringan (pembengkakan, rasa berat, nyeri pada tungkai).',
                ['Luka', 'Nyeri'],
                'Heparin sodium / Heparinoid (lihat kemasan untuk detail komposisi lengkap)',
                'Oleskan tipis-tipis pada area yang sakit 2–3 kali sehari, atau sesuai petunjuk dokter.',
                'Reaksi alergi lokal (kemerahan, gatal) pada kulit sensitif.',
                'Jangan dioleskan pada luka terbuka atau kulit yang terinfeksi. Hipersensitif terhadap komponen obat.',
            ],
         
            // 13. FORMULA PG XP PEACH 100GR
            // Pasta gigi
            [
                'FORMULA PG XP PEACH 100GR',
                'TUB',
                5524,
                'Perawatan Tubuh',
                'Formula Pasta Gigi PG XP Peach adalah pasta gigi dengan rasa persik yang memberikan perlindungan menyeluruh pada gigi dan gusi. Mengandung fluoride untuk membantu mencegah gigi berlubang dan menjaga kesehatan mulut.',
                'Membersihkan gigi dari plak dan sisa makanan, mencegah gigi berlubang, menyegarkan napas.',
                [],
                'Sodium Fluoride, Calcium Carbonate, Sorbitol, Silica (lihat kemasan untuk detail lengkap)',
                'Gosok gigi minimal 2 kali sehari (pagi setelah sarapan dan malam sebelum tidur) selama 2 menit.',
                '-',
                'Jangan ditelan. Jauhkan dari jangkauan anak-anak di bawah 6 tahun.',
            ],
         
            // 14. LEUKOTAPE K 5CMX5M SKIN
            // Sumber: Watsons, Medicastore
            [
                'LEUKOTAPE K 5CMX5M SKIN',
                'RLL',
                390000,
                'Alat Kesehatan',
                'Leukotape K is plester kinesiologi elastis (kinesio tape) terbuat dari 97% katun dan 3% lycra dengan perekat polyacrylate ramah kulit. Bekerja dengan memberikan dukungan pada otot dan sendi tanpa membatasi gerakan, meningkatkan sirkulasi darah dan limfatik.',
                'Trauma pergelangan kaki, kerusakan tendon, cedera otot, ketidakstabilan bahu, nyeri punggung (sindrom servikal/lumbal), radang selubung tendon, mengurangi pembengkakan limfe.',
                ['Pegal', 'Nyeri Otot'],
                'Bahan katun 97%, Lycra 3%, perekat polyacrylate (tidak mengandung lateks)',
                'Aplikasikan pada kulit yang bersih dan kering menggunakan teknik kinesio taping yang sesuai. Dapat bertahan 3–5 hari.',
                '-',
                'Tumor ganas. Penyakit kulit akut/kronis seperti infeksi jamur, eritema, erisipelas. Luka terbuka. Deep Vein Thrombosis (DVT).',
            ],
         
            // 15. NUTRIBABY ROYAL PRONUTRA 1 400
            // Susu formula bayi
            [
                'NUTRIBABY ROYAL PRONUTRA 1 400',
                'DUS',
                107430,
                'Ibu & Anak',
                'Nutribaby Royal Pronutra 1 adalah susu formula untuk bayi usia 0–6 bulan yang diformulasikan dengan nutrisi lengkap mendekati ASI. Mengandung DHA, ARA, prebiotik, dan berbagai vitamin serta mineral untuk mendukung tumbuh kembang optimal bayi.',
                'Pengganti atau pendamping ASI untuk bayi usia 0–6 bulan guna memenuhi kebutuhan nutrisi pertumbuhan dan perkembangan.',
                [],
                'Whey protein, laktosa, minyak nabati, DHA, ARA, prebiotik GOS/FOS, vitamin A, D, E, C, B kompleks, Kalsium, Zat Besi, dll.',
                'Larutkan sesuai takaran yang tertera pada kemasan. Umumnya 1 sendok takar (4,4 g) untuk 30 ml air matang.',
                '-',
                'Tidak untuk menggantikan ASI bila ASI masih tersedia. Konsultasikan dengan dokter anak sebelum penggunaan.',
            ],
         
            // 16. CIMANTIN 10MG TAB@28
            // Sumber: Alodokter, Medicastore
            [
                'CIMANTIN 10MG TAB@28',
                'TAB',
                36630,
                'Obat-Obatan',
                'Cimantin mengandung Memantine Hydrochloride, suatu antagonis reseptor NMDA yang bekerja dengan menghambat kelebihan glutamat di otak. Digunakan untuk memperlambat penurunan daya ingat, kemampuan berpikir, dan fungsi sehari-hari pada pasien Alzheimer sedang hingga berat.',
                'Pengobatan demensia pada penyakit Alzheimer derajat sedang hingga berat. Membantu mengurangi keluhan linglung, pikun, dan kesulitan berpikir.',
                ['Pusing'],
                'Memantine Hydrochloride 10 mg',
                'Sesuai petunjuk dokter. Dosis awal 5 mg 1x sehari pada minggu pertama, ditingkatkan 5 mg setiap minggu hingga dosis pemeliharaan 10 mg 2x sehari (maks 20 mg/hari). Dapat diminum sebelum atau sesudah makan.',
                'Halusinasi, kebingungan, pusing, sakit kepala, kelelahan.',
                'Hipersensitif terhadap memantine. Ibu menyusui. Hati-hati pada pasien dengan epilepsi dan gangguan fungsi ginjal.',
            ],
         
            // 17. PEEPIS DISP URINE BAG FOR WOMEN @600 CC
            // Alat kesehatan
            [
                'PEEPIS DISP URINE BAG FOR WOMEN @600 CC',
                'PC',
                17500,
                'Alat Kesehatan',
                'Peepis Disposable Urine Bag for Women adalah kantong urin sekali pakai yang dirancang khusus untuk anatomi wanita. Dilengkapi dengan corong berbentuk ergonomis untuk memudahkan penggunaan, berguna saat perjalanan jauh, kondisi darurat, atau pasca operasi.',
                'Menampung urin pada wanita yang tidak bisa menggunakan toilet konvensional (perjalanan, pasca operasi, kondisi darurat, imobilisasi).',
                [],
                'Plastik medis steril dengan kapasitas 600 cc',
                'Buka kemasan steril, posisikan corong pada area genital, gunakan sekali pakai lalu buang.',
                '-',
                'Sekali pakai, tidak untuk digunakan ulang.',
            ],
         
            // 18. MINOSEP GARGLE 0.001 -BI
            // Sumber: Deskripsi produk - obat kumur antiseptik
            [
                'MINOSEP GARGLE 0.001 -BI',
                'BT',
                23310,
                'Perawatan Tubuh',
                'Minosep Gargle adalah obat kumur antiseptik yang mengandung Cetylpyridinium Chloride atau bahan antiseptik setara. Membantu menjaga kebersihan rongga mulut, mengurangi pertumbuhan bakteri penyebab bau mulut dan infeksi ringan.',
                'Menjaga kebersihan mulut dan tenggorokan, meredakan iritasi ringan tenggorokan, membantu mengurangi bakteri penyebab bau mulut.',
                ['Batuk Kering', 'Batuk'],
                'Cetylpyridinium Chloride 0,05% atau antiseptik setara (lihat kemasan)',
                'Kumur selama 30 detik dengan 15–20 ml larutan, 2–3 kali sehari setelah sikat gigi. Jangan ditelan.',
                '-',
                'Jangan ditelan. Tidak untuk anak di bawah 6 tahun.',
            ],
         
            // 19. THERASORB C 10CM X 10CM
            // Sumber: Deskripsi produk pembalut luka
            [
                'THERASORB C 10CM X 10CM',
                'LBR',
                92705,
                'Alat Kesehatan',
                'Therasorb C adalah pembalut luka dengan daya serap tinggi (superabsorben) yang dirancang untuk mengelola luka dengan eksudat (cairan) berlebih. Mencegah maserasi kulit sekitar luka dan mendukung lingkungan luka yang kondusif untuk penyembuhan.',
                'Pengelolaan luka dengan eksudat sedang hingga berat, seperti luka kronik (ulkus diabetikum, ulkus dekubitus), luka pasca operasi, dan luka bakar derajat ringan.',
                ['Luka'],
                'Superabsorbent polymer core, lapisan luka non-adherent, film backing transparan',
                'Sesuaikan ukuran pembalut dengan luka. Ganti pembalut setiap 2–5 hari tergantung jumlah eksudat, atau sesuai instruksi tenaga medis.',
                '-',
                'Jangan gunakan pada luka yang terinfeksi parah tanpa penanganan medis. Hentikan penggunaan jika terjadi reaksi alergi.',
            ],
         
            // 20. APPETON 60+ 400GR VANILA
            // Susu lansia
            [
                'APPETON 60+ 400GR VANILA',
                'KLG',
                347106,
                'Ibu & Anak',
                'Appeton 60+ is susu nutrisi khusus yang diformulasikan untuk memenuhi kebutuhan nutrisi lansia usia 60 tahun ke atas. Mengandung protein tinggi, kalsium, vitamin D, dan berbagai mikronutrien untuk mendukung kesehatan tulang, otot, dan vitalitas lansia.',
                'Memenuhi kebutuhan nutrisi lansia usia 60 tahun ke atas, menjaga massa otot, kekuatan tulang, dan mendukung kesehatan secara keseluruhan.',
                ['Lemas'],
                'Protein whey dan kasein, kalsium, vitamin D3, vitamin E, vitamin C, vitamin B kompleks, omega-3, serat pangan (lihat kemasan untuk detail lengkap)',
                'Larutkan 4 sendok makan (40 g) dalam 200 ml air matang bersuhu hangat. Minum 1–2 kali sehari atau sesuai anjuran dokter/ahli gizi.',
                '-',
                'Konsultasikan dengan dokter pada lansia dengan kondisi medis khusus (diabetes, gagal ginjal).',
            ],
         
            // 21. DETTOL BS FRESH 70 GR
            // Sabun antiseptik
            [
                'DETTOL BS FRESH 70 GR',
                'PC',
                3885,
                'Perawatan Tubuh',
                'Dettol Bar Soap Fresh adalah sabun mandi padat antiseptik dengan aroma segar yang mengandung bahan aktif antibakteri. Diformulasikan untuk melidungi kulit dari kuman dan bakteri penyebab penyakit sekaligus memberikan kesegaran sepanjang hari.',
                'Membersihkan dan melindungi kulit dari kuman dan bakteri penyebab penyakit, menjaga kebersihan tubuh sehari-hari.',
                [],
                'Chloroxylenol (PCMX), surfaktan, parfum (lihat kemasan untuk detail lengkap)',
                'Basahi tubuh, gosokkan sabun hingga berbusa, bilas hingga bersih.',
                'Reaksi iritasi atau alergi pada kulit sangat sensitif.',
                'Hindari kontak dengan mata. Hentikan pemakaian jika terjadi reaksi alergi.',
            ],
         
            // 22. ZZNUTRIMAX URICARE CAP@60
            // Suplemen kesehatan ginjal
            [
                'ZZNUTRIMAX URICARE CAP@60',
                'BT',
                413726,
                'Vitamin & Suplement',
                'ZZ Nutrimax Uricare adalah suplemen kesehatan yang diformulasikan untuk mendukung kesehatan saluran kemih dan ginjal. Mengandung kombinasi ekstrak herbal dan nutrisi yang membantu menjaga fungsi ginjal optimal dan mencegah infeksi saluran kemih.',
                'Mendukung kesehatan ginjal dan saluran kemih, membantu mencegah infeksi saluran kemih berulang, dan memelihara fungsi ginjal.',
                [],
                'Cranberry Extract, D-Mannose, Vitamin C, Zinc (lihat kemasan untuk detail komposisi lengkap)',
                '1–2 kapsul sehari atau sesuai petunjuk pada kemasan / anjuran dokter.',
                'Reaksi alergi terhadap komponen produk (jarang terjadi).',
                'Hipersensitif terhadap salah satu komponen. Konsultasikan dengan dokter jika memiliki batu ginjal atau gangguan ginjal berat.',
            ],

            // ==================== DATA BARU (dari Excel) ====================
            // 1. PARAMEX FLU & BATUK TAB@100
            ['PARAMEX FLU & BATUK TAB@100', 'TAB', 46200, 'Analgesik & Antipiretik',
                'Paramex Flu dan Batuk merupakan obat untuk meringankan gejala flu seperti demam, sakit kepala, hidung tersumbat dan bersin-bersin yang disertai batuk kering atau tidak berdahak.',
                'Meringankan gejala flu seperti demam, sakit kepala, hidung tersumbat, bersin-bersin yang disertai batuk kering (tidak berdahak).',
                ['Demam', 'Flu', 'Batuk'],
                'Paracetamol 500mg, Pseudoefedrin HCl 30mg, Dextromethorphan HBr 15mg',
                '3 kali sehari. Anak 6-12 tahun: 1/2 tablet. Dewasa dan anak >12 tahun: 1 tablet. Sesudah makan.',
                '-',
                'Hipersensitif terhadap komponen obat ini'],
            // 2. BYE BYE FEVER FOR CHILDREN
            ['BYE BYE FEVER FOR CHILDREN', 'PC', 25100, 'Analgesik & Antipiretik',
                'Digunakan untuk kompres demam dan atau nyeri. Kompres demam dan nyeri yang lembut di kulit, aman digunakan bersama obat, dan memiliki daya lekat kuat.',
                'Kompres penurun demam, nyeri sakit kepala, sakit gigi, dan rasa tidak nyaman akibat cuaca panas pada anak dan bayi.',
                ['Demam'],
                '-',
                'Tempelkan pada dahi/pipi/punggung/bagian yang nyeri. Ganti setiap 10 jam sampai demam atau nyeri reda.',
                '-',
                'Jangan digunakan pada mata, daerah sekitar mata, selaput lunak atau kulit yang terkena eksim, ruam/luka.'],
            // 3. PRORIS FORTE SYR 50ML SUSP (ETH)
            ['PRORIS FORTE SYR 50ML SUSP (ETH)', 'BT', 37400, 'Analgesik & Antipiretik',
                'Proris Forte adalah obat yang digunakan sebagai pereda demam, nyeri ringan khususnya ketika pasien juga mengalami peradangan, dan mengurangi gangguan inflamasi (peradangan) secara umum.',
                'Meringankan demam, nyeri ringan hingga sedang, dan peradangan pada anak, termasuk nyeri akibat sakit gigi dan sakit kepala.',
                ['Demam', 'Nyeri'],
                'Ibuprofen 200mg/5ml',
                'Anak 1-2 tahun: 3-4x sehari 1,25ml. Anak 3-7 tahun: 3-4x sehari 2,5ml. Anak 8-12 tahun: 3-4x sehari 5ml. Sesudah makan.',
                'Reaksi alergi',
                'Peptic ulcer, pasien yang mengkonsumsi aspirin, asma, rhinitis dan urtikaria'],
            // 4. PANADOL EXTRA @26 X 4 KPL
            ['PANADOL EXTRA @26 X 4 KPL', 'TAB', 21600, 'Analgesik & Antipiretik',
                'Panadol Extra merupakan obat yang digunakan untuk meredakan demam dan rasa nyeri atau sakit kepala. Dikombinasikan dengan kafein yang berfungsi untuk mencegah rasa kantuk.',
                'Meringankan sakit kepala (termasuk migrain), demam, pusing, nyeri gigi, dan nyeri otot ringan pada dewasa dan anak di atas 12 tahun.',
                ['Demam', 'Nyeri', 'Pusing'],
                'Paracetamol 500 mg, Caffeine 65 mg',
                'Dewasa & anak >12 tahun: 1-2 kaplet, 3-4 kali sehari. Maksimal 8 kaplet/24 jam. Tidak untuk anak. Sesudah makan.',
                'Dosis besar dapat menyebabkan kerusakan hati',
                'Gangguan fungsi hati'],
            // 5. PARACETAMOL
            ['PARACETAMOL', 'PC', 19900, 'Analgesik & Antipiretik',
                'Paracetamol generik untuk menurunkan demam dan meredakan nyeri ringan-sedang.',
                'Menurunkan demam dan meredakan nyeri ringan hingga sedang, seperti sakit kepala, sakit gigi, nyeri otot, dan nyeri haid.',
                ['Demam', 'Nyeri'],
                'Paracetamol 500mg',
                'Dewasa: 1-2 tablet (500-1000mg), 3-4x sehari. Maks 4000mg/hari. Sesudah makan.',
                'Mual, nyeri lambung ringan. Jarang: reaksi alergi kulit.',
                'Gangguan hati berat, alergi paracetamol.'],
            // 6. PARAMEX TAB@200
            ['PARAMEX TAB@200', 'TAB', 31100, 'Analgesik & Antipiretik',
                'Meredakan nyeri kepala, nyeri gigi, demam, dan pegal-pegal.',
                'Meringankan sakit kepala, sakit gigi, nyeri otot, pegal-pegal, dan demam.',
                ['Demam', 'Nyeri', 'Pusing'],
                'Paracetamol, Propyphenazone, Kafein',
                'Dewasa: 1 tablet, 3x sehari sesudah makan.',
                'Mengantuk, mual, gangguan lambung ringan.',
                'Gangguan hati, anak <12 tahun.'],
            // 7. IBUPROFEN 200MG TAB
            ['IBUPROFEN 200MG TAB', 'TAB', 47700, 'Obat-Obatan',
                'Anti-inflamasi non-steroid untuk demam, nyeri, and peradangan ringan-sedang.',
                'Meredakan nyeri ringan hingga sedang (sakit kepala, nyeri gigi, nyeri haid, nyeri otot), menurunkan demam, dan mengurangi peradangan.',
                ['Demam', 'Nyeri', 'Nyeri Otot'],
                'Ibuprofen 200mg',
                'Dewasa: 1-2 tablet (200-400mg), 3x sehari sesudah makan.',
                'Nyeri lambung, mual, diare, pusing, rasa tidak enak di perut.',
                'Tukak lambung, gangguan ginjal, hamil trimester 3, anak <12 tahun.'],
            // 8. BODREX MIGRA
            ['BODREX MIGRA', 'TUB', 23500, 'Obat-Obatan',
                'Membantu meringankan rasa sakit kepala pada migrain.',
                'Meringankan rasa sakit kepala terutama pada kondisi migrain.',
                ['Nyeri', 'Demam', 'Pusing'],
                'Paracetamol 350 mg, Propyphenazone 150 mg, Caffeine 50 mg',
                'Dewasa: 1 kaplet 3 kali sehari atau menurut petunjuk dokter. Sesudah makan.',
                'Penggunaan jangka panjang dan dosis besar dapat menyebabkan kerusakan fungsi ginjal. Reaksi hipersensitif.',
                'Hati-hati pada penderita porfiria, penyakit ginjal, dan yang mengkonsumsi alkohol'],
            // 9. DEXTROMETHORPHAN SYR GIF ASK
            ['DEXTROMETHORPHAN SYR GIF ASK', 'BT', 2119, 'Obat Batuk & Pilek',
                'Menekan refleks batuk kering yang tidak produktif.',
                'Menekan batuk kering (tidak produktif/tidak berdahak) akibat iritasi tenggorokan dan bronkus ringan.',
                ['Batuk Kering'],
                'Dextromethorphan HBr 10mg/5ml',
                'Dewasa: 10-20ml, 3-4x sehari. Anak 6-12 th: 5-10ml, 3-4x sehari.',
                'Mengantuk, pusing, mual, konstipasi.',
                'Batuk berdahak, penggunaan bersama MAO inhibitor, hamil trimester 1.'],
            // 10. SILADEX ANTITUSSIVE SYR 30ML
            ['SILADEX ANTITUSSIVE SYR 30ML', 'BT', 43900, 'Obat Batuk & Pilek',
                'Sirup untuk meredakan batuk kering/tidak berdahak.',
                'Meredakan batuk kering yang tidak berdahak pada dewasa and anak.',
                ['Batuk Kering'],
                'Dextromethorphan HBr',
                'Dewasa: 10ml, 3x sehari. Anak 6-12 th: 5ml, 3x sehari.',
                'Mengantuk, pusing ringan, mual.',
                'Batuk berdahak, asma, gangguan pernapasan.'],
            // 11. COMTUSI CAP@30
            ['COMTUSI CAP@30', 'BT', 43500, 'Obat Batuk & Pilek',
                'Kapsul kombinasi antitusif dan antihistamin untuk batuk kering disertai alergi.',
                'Meringankan gejala batuk kering akibat alergi disertai batuk berdahak.',
                ['Batuk Kering'],
                'Dextromethorphan HBr, Diphenhydramine',
                'Dewasa: 1 kapsul, 3x sehari sesudah makan.',
                'Kantuk, mulut kering, pusing.',
                'Anak <6 th, glaukoma, hamil.'],
            // 12. NO COUGH FOR KIDS 100ML
            ['NO COUGH FOR KIDS 100ML', 'PC', 40700, 'Obat Batuk & Pilek',
                'Sirup batuk kering khusus anak dengan rasa manis.',
                'Meredakan batuk kering pada anak usia 2–12 tahun.',
                ['Batuk Kering'],
                'Dextromethorphan, Diphenhydramine',
                'Anak 2-6 th: 2.5ml, 6-12 th: 5ml, 3-4x sehari.',
                'Kantuk ringan, mulut kering.',
                'Anak <2 tahun, asma.'],
            // 13. HUSTAB P
            ['HUSTAB P', 'TAB', 17300, 'Obat Batuk & Pilek',
                'Tablet untuk menekan batuk kering yang mengganggu.',
                'Menekan refleks batuk kering (tidak produktif) yang mengganggu pada dewasa.',
                ['Batuk Kering'],
                'Dextromethorphan HBr 15mg',
                'Dewasa: 1 tablet, 3-4x sehari.',
                'Mengantuk, pusing, konstipasi.',
                'Batuk berdahak, bayi & anak kecil.'],
            // 14. OB COMBI ANTITUSSIVE 60ML
            ['OB COMBI ANTITUSSIVE 60ML', 'PC', 11000, 'Obat Batuk & Pilek',
                'Sirup batuk kering kombinasi antitusif dan antihistamin.',
                'Meredakan batuk kering (tidak berdahak) yang disertai gejala alergi seperti bersin dan hidung berair.',
                ['Batuk Kering'],
                'Dextromethorphan HBr, Chlorpheniramine',
                'Dewasa: 10ml, 3x sehari. Anak 6-12 th: 5ml, 3x sehari.',
                'Kantuk, mulut kering, penglihatan kabur.',
                'Glaukoma, hipertrofi prostat, batuk berdahak.'],
            // 15. DECOLSIN KAPSUL @ 100 (UN)
            ['DECOLSIN KAPSUL @ 100 (UN)', 'BT', 18300, 'Obat Batuk & Pilek',
                'Meredakan hidung tersumbat, bersin, dan gejala flu/pilek.',
                'Meringankan gejala flu dan pilek seperti hidung tersumbat, bersin, sakit kepala, demam, dan batuk yang disertai dahak.',
                ['Flu', 'Pilek'],
                'Pseudoephedrine HCl, Triprolidine HCl',
                'Dewasa: 1 kapsul, 3x sehari sesudah makan.',
                'Kantuk, mulut kering, palpitasi, insomnia.',
                'Hipertensi, penyakit jantung, glaukoma, anak <12 th.'],
            // 16. ALCO FLU PLUS BATUK SIRUP 100ML
            ['ALCO FLU PLUS BATUK SIRUP 100ML', 'BT', 29500, 'Obat Batuk & Pilek',
                'Sirup multisymptom untuk flu disertai batuk dan demam.',
                'Meringankan gejala flu disertai batuk dan demam, seperti hidung tersumbat, bersin, sakit kepala, dan batuk kering.',
                ['Flu', 'Batuk', 'Demam'],
                'Paracetamol, Phenylpropanolamine, Dextromethorphan, Chlorpheniramine',
                'Dewasa: 3 sendok takar (15ml), 3x sehari. Anak 6-12 th: 1.5 sendok takar, 3x sehari.',
                'Kantuk, mulut kering, mual.',
                'Hipertensi, penyakit jantung, hamil, menyusui.'],
            // 17. BASMINGIN FLU SACH@10
            ['BASMINGIN FLU SACH@10', 'DUS', 30800, 'Obat Batuk & Pilek',
                'Serbuk sachet praktis untuk flu dengan vitamin C tambahan.',
                'Meringankan gejala flu seperti demam, hidung tersumbat, bersin-bersin, dan sakit kepala.',
                ['Flu', 'Demam', 'Pilek'],
                'Paracetamol, Phenylephrine, Chlorpheniramine, Vitamin C',
                'Dewasa: 1 sachet, 3x sehari, larutkan dalam air hangat.',
                'Kantuk, mulut kering, pusing.',
                'Hipertensi, hamil trimester 1.'],
            // 18. SILADEX COUGH & COLD SYR 100ML
            ['SILADEX COUGH & COLD SYR 100ML', 'BT', 26700, 'Obat Batuk & Pilek',
                'Sirup kombinasi untuk batuk, pilek, dan hidung tersumbat.',
                'Meredakan batuk, pilek (rhinitis), hidung tersumbat, dan gejala flu pada dewasa dan anak.',
                ['Flu', 'Batuk', 'Pilek'],
                'Dextromethorphan, Phenylephrine, Chlorpheniramine',
                'Dewasa: 10ml, 3-4x sehari. Anak 6-12 th: 5ml, 3-4x sehari.',
                'Kantuk, mulut kering, mual, pusing.',
                'Anak <2 th, hipertensi, glaukoma.'],
            // 19. ACTIFED PLUS EXP SYR 120ML
            ['ACTIFED PLUS EXP SYR 120ML', 'BT', 10800, 'Obat Batuk & Pilek',
                'Sirup untuk flu dengan batuk berdahak dan hidung tersumbat.',
                'Meringankan gejala flu disertai batuk berdahak dan hidung tersumbat (kongesti nasal).',
                ['Flu', 'Batuk Berdahak', 'Pilek'],
                'Triprolidine, Pseudoephedrine, Guaifenesin',
                'Dewasa: 10ml, 3-4x sehari. Anak 6-12 th: 5ml, 3-4x sehari.',
                'Kantuk, mulut kering, insomnia, palpitasi.',
                'Hipertensi berat, glaukoma, anak <2 th.'],
            // 20. ACTIFED PLUS COUGH DM SYR 25 ML
            ['ACTIFED PLUS COUGH DM SYR 25 ML', 'BT', 5800, 'Obat Batuk & Pilek',
                'Sirup kombinasi untuk flu dengan batuk kering dan hidung tersumbat.',
                'Meringankan gejala flu disertai batuk kering dan hidung tersumbat.',
                ['Flu', 'Batuk Kering', 'Pilek'],
                'Triprolidine, Pseudoephedrine, Dextromethorphan',
                'Dewasa: 10ml, 3-4x sehari. Anak 6-12 th: 5ml, 3-4x sehari.',
                'Kantuk, mulut kering, insomnia.',
                'Hipertensi, glaukoma, anak <2 th.'],
            // 21. OBH COMBI HERBAL 100 ML
            ['OBH COMBI HERBAL 100 ML', 'PC', 10300, 'Obat Tradisional / Herbal',
                'Obat batuk herbal berbahan alami untuk flu dan batuk.',
                'Meredakan batuk berdahak dan gejala flu ringan dengan bahan herbal alami.',
                ['Flu', 'Batuk', 'Pilek'],
                'Ekstrak Jahe, Madu, Jeruk Nipis, Menthol',
                'Dewasa: 3 sendok takar (15ml), 3x sehari. Anak 6-12 th: 1 sendok takar, 3x sehari.',
                'Umumnya aman. Jarang: mual ringan.',
                'Alergi komponen herbal.'],
            // 22. ANTIMO DEWASA TAB
            ['ANTIMO DEWASA TAB', 'TAB', 13500, 'Obat-Obatan',
                'Mencegah dan mengatasi mual, muntah, dan pusing akibat mabuk perjalanan.',
                'Mencegah dan mengobati mual, muntah, dan pusing akibat mabuk perjalanan (motion sickness) pada dewasa.',
                ['Pusing', 'Mual', 'Mabuk Perjalanan'],
                'Dimenhydrinate 50mg',
                'Dewasa: 1-2 tablet, 30 menit sebelum perjalanan. Maks 8 tablet/hari.',
                'Kantuk, mulut kering, penglihatan kabur, konstipasi.',
                'Glaukoma, hipertrofi prostat, asma, anak <2 th.'],
            // 23. ANTIMO ANAK STRAWBERRY@10
            ['ANTIMO ANAK STRAWBERRY@10', 'PC', 19100, 'Obat-Obatan',
                'Tablet kunyah rasa stroberi khusus anak untuk mencegah mabuk perjalanan.',
                'Mencegah dan mengobati mual, pusing, dan muntah akibat mabuk perjalanan pada anak usia 2–12 tahun.',
                ['Pusing', 'Mual', 'Mabuk Perjalanan'],
                'Dimenhydrinate 12.5mg',
                'Anak 2-6 th: ½-1 tablet. 6-12 th: 1-2 tablet. 30 menit sebelum perjalanan.',
                'Kantuk, mulut kering.',
                'Anak <2 tahun.'],
            // 24. ANTIMO ANAK JERUK SACH @10
            ['ANTIMO ANAK JERUK SACH @10', 'DUS', 15400, 'Obat-Obatan',
                'Serbuk sachet rasa jeruk untuk anak mencegah mabuk perjalanan.',
                'Mencegah dan mengobati mual, pusing, dan muntah akibat mabuk perjalanan pada anak usia 2–12 tahun.',
                ['Pusing', 'Mual', 'Mabuk Perjalanan'],
                'Dimenhydrinate 12.5mg',
                'Anak 2-6 th: ½ sachet. 6-12 th: 1 sachet. Larutkan dalam air, 30 menit sebelum perjalanan.',
                'Kantuk ringan, mulut kering.',
                'Anak <2 tahun.'],
            // 25. DIMENHYDRINATE 50 MG (BTL 100 TAB)
            ['DIMENHYDRINATE 50 MG (BTL 100 TAB)', 'TAB', 31200, 'Obat-Obatan',
                'Generik Antimo. Mencegah mual, muntah, dan pusing karena mabuk perjalanan atau vertigo ringan.',
                'Mencegah dan mengobati mual, muntah, dan pusing akibat mabuk perjalanan serta vertigo ringan.',
                ['Pusing', 'Mual', 'Mabuk Perjalanan'],
                'Dimenhydrinate 50mg',
                'Dewasa: 1-2 tablet, 3-4x sehari atau 30 menit sebelum perjalanan.',
                'Kantuk, mulut kering, penglihatan kabur.',
                'Glaukoma, hipertrofi prostat, anak <2 th.'],
            // 26. COUNTERPAIN COOL 15 GRAM
            ['COUNTERPAIN COOL 15 GRAM', 'TUB', 30500, 'Obat-Obatan',
                'Krim oles analgesik dengan sensasi dingin untuk nyeri otot dan sendi.',
                'Meredakan nyeri otot, pegal linu, kekakuan sendi, memar, dan keseleo secara topikal dengan sensasi dingin.',
                ['Nyeri Otot', 'Pegal', 'Keseleo'],
                'Methyl Salicylate, Menthol, Eugenol',
                'Oleskan tipis pada area yang sakit, 3-4x sehari. Pijat lembut.',
                'Iritasi kulit, rasa panas/dingin berlebih pada kulit sensitif.',
                'Luka terbuka, kulit rusak, anak <2 th. Hindari kontak mata dan mukosa.'],
            // 27. COUNTERPAIN CR 15GR
            ['COUNTERPAIN CR 15GR', 'TUB', 6500, 'Obat-Obatan',
                'Versi krim Counterpain tanpa efek dingin berlebih.',
                'Meredakan nyeri otot, pegal-pegal, kekakuan sendi, dan keseleo secara topikal.',
                ['Nyeri Otot', 'Pegal'],
                'Methyl Salicylate, Menthol',
                'Oleskan 2-3x sehari pada area yang nyeri.',
                'Iritasi kulit ringan.',
                'Luka terbuka, alergi salicylate.'],
            // 28. SIDO M TOLAK LINU MINT 15ML DUSSC @5
            ['SIDO M TOLAK LINU MINT 15ML DUSSC @5', 'DUS', 15136, 'Obat Tradisional / Herbal',
                'Obat herbal tradisional dalam bentuk cair untuk pegal linu dan nyeri sendi.',
                'Meringankan pegal linu, nyeri sendi, dan masuk angin.',
                ['Pegal', 'Nyeri Otot', 'Linu'],
                'Ekstrak Jahe, Cabe Jawa, Minyak Kayu Putih, Menthol',
                'Minum 1 sachet (15ml), 2-3x sehari.',
                'Umumnya aman. Kadang: rasa hangat di tenggorokan, mual ringan.',
                'Maag akut, hamil.'],
            // 29. REFLEXOR CR 30GR
            ['REFLEXOR CR 30GR', 'TUB', 49500, 'Obat-Obatan',
                'Krim hangat untuk meredakan nyeri otot, pegal, dan keseleo.',
                'Meredakan nyeri otot, pegal-pegal, keseleo, dan kekakuan sendi secara topikal.',
                ['Nyeri Otot', 'Pegal'],
                'Methyl Salicylate, Menthol, Camphor',
                'Oleskan pada area yang nyeri 3-4x sehari. Pijat ringan.',
                'Iritasi atau kemerahan kulit.',
                'Luka terbuka, kulit iritasi, anak <2 th.'],
            // 30. FLEXAMINE CR 30GR
            ['FLEXAMINE CR 30GR', 'TUB', 20300, 'Obat-Obatan',
                'Krim analgesik topikal untuk nyeri otot dan pegal.',
                'Meredakan nyeri otot and pegal-pegal secara topikal.',
                ['Nyeri Otot', 'Pegal'],
                'Methyl Salicylate, Menthol',
                'Oleskan tipis 3x sehari pada bagian yang sakit.',
                'Iritasi kulit ringan.',
                'Luka terbuka, alergi salicylate.'],
            // 31. BALSAMEX OINT 20GR
            ['BALSAMEX OINT 20GR', 'TUB', 29000, 'Obat-Obatan',
                'Balsam untuk nyeri otot, pegal, dan melegakan pernapasan.',
                'Meredakan nyeri otot, pegal linu, dan membantu melegakan pernapasan (hidung tersumbat) serta meredakan gejala masuk angin.',
                ['Nyeri Otot', 'Pegal', 'Hidung Tersumbat'],
                'Methyl Salicylate, Menthol, Camphor, Eucalyptol',
                'Oleskan pada area nyeri atau dada/punggung untuk pernapasan, 2-3x sehari.',
                'Iritasi kulit ringan, hangat berlebihan.',
                'Luka terbuka, kulit sensitif, anak <2 th.'],
            // 32. PHARMATON GO @10X6 KPL
            ['PHARMATON GO @10X6 KPL', 'TAB', 64200, 'Suplemen & Vitamin',
                'Suplemen multivitamin dengan ginseng untuk meningkatkan stamina dan mengurangi kelelahan.',
                'Membantu mengatasi kelelahan fisik dan mental, meningkatkan stamina, daya tahan tubuh, dan konsentrasi.',
                ['Lemas', 'Kelelahan'],
                'Ginseng, Vitamin A, B1, B2, B6, B12, C, D, E, Mineral',
                'Dewasa: 1 kapsul, 1x sehari sesudah makan pagi.',
                'Mual ringan jika diminum perut kosong. Jarang: insomnia.',
                'Hipersensitif ginseng, hamil trimester 1.'],
            // 33. LIVRON - B PLEX TAB @ 100
            ['LIVRON - B PLEX TAB @ 100', 'TAB', 25600, 'Suplemen & Vitamin',
                'Suplemen vitamin B kompleks dengan ekstra liver untuk energi dan kesehatan darah.',
                'Membantu memenuhi kebutuhan vitamin B kompleks, mengatasi kelelahan, dan mendukung kesehatan darah serta metabolisme tubuh.',
                ['Lemas', 'Anemia', 'Kelelahan'],
                'Vitamin B1, B2, B6, B12, Niacinamide, Pantothenic Acid, Liver Extract',
                '1-2 tablet, 3x sehari sesudah makan.',
                'Mual, gangguan lambung ringan.',
                'Alergi komponen.'],
            // 34. VITACIMIN SWEET FAMILY PACK TAB@20
            ['VITACIMIN SWEET FAMILY PACK TAB@20', 'TAB', 24100, 'Suplemen & Vitamin',
                'Tablet hisap Vitamin C untuk meningkatkan daya tahan tubuh.',
                'Membantu memenuhi kebutuhan Vitamin C, menjaga daya tahan tubuh, dan membantu penyembuhan luka.',
                ['Lemas', 'Daya Tahan Tubuh'],
                'Vitamin C 250mg',
                '1-2 tablet per hari, diisap/dikunyah.',
                'Iritasi lambung jika dosis berlebih, batu ginjal (konsumsi sangat tinggi).',
                'Alergi Vitamin C.'],
            // 35. NEUROBION TAB@250
            ['NEUROBION TAB@250', 'TAB', 66200, 'Suplemen & Vitamin',
                'Tablet vitamin B kompleks dosis tinggi untuk kesehatan saraf dan mengatasi kesemutan.',
                'Membantu mengatasi neuritis (peradangan saraf), kesemutan, kaki/tangan mati rasa, dan nyeri saraf perifer.',
                ['Lemas', 'Nyeri Saraf', 'Kesemutan'],
                'Vitamin B1 100mg, B6 200mg, B12 200mcg',
                '1 tablet, 1-3x sehari sesudah makan.',
                'Mual ringan, reaksi alergi jarang.',
                'Hipersensitif vitamin B.'],
            // 36. ENERVON ACTIVE 100pcs
            ['ENERVON ACTIVE 100pcs', 'PC', 22600, 'Suplemen & Vitamin',
                'Suplemen multivitamin untuk meningkatkan energi dan stamina sehari-hari.',
                'Membantu memenuhi kebutuhan vitamin and mineral, meningkatkan energi dan stamina sehari-hari.',
                ['Lemas', 'Kelelahan'],
                'Vitamin C, B1, B2, B6, B12, Niacinamide, Calcium Pantothenate',
                '1 tablet, 1x sehari sesudah makan.',
                'Jarang: mual ringan.',
                'Alergi komponen vitamin.'],
            // 37. VITAMIN C 500 MG (DUS 100 TAB)
            ['VITAMIN C 500 MG (DUS 100 TAB)', 'TAB', 38300, 'Suplemen & Vitamin',
                'Vitamin C dosis 500mg untuk menjaga daya tahan tubuh and antioksidan.',
                'Membantu memenuhi kebutuhan Vitamin C, meningkatkan daya tahan tubuh, dan berfungsi sebagai antioksidan.',
                ['Lemas', 'Daya Tahan Tubuh'],
                'Ascorbic Acid 500mg',
                '1 tablet, 1-2x sehari sesudah makan.',
                'Mual, diare jika dosis tinggi, iritasi lambung.',
                'Batu ginjal (riwayat), konsumsi > 1000mg/hari jangka panjang.'],
            // 38. PRITASMA TAB@100 INHEALTH
            ['PRITASMA TAB@100 INHEALTH', 'TAB', 24100, 'Obat-Obatan',
                'Tablet kombinasi untuk melebarkan saluran napas pada asma ringan.',
                'Meringankan dan mencegah serangan asma bronkial ringan serta bronkospasme.',
                ['Sesak Napas', 'Asma'],
                'Theophylline, Ephedrine, Phenobarbital',
                'Dewasa: 1 tablet, 3x sehari sesudah makan.',
                'Jantung berdebar, mual, insomnia, sakit kepala, gemetar.',
                'Aritmia, hipertensi berat, anak <6 th, hamil.'],
            // 39. ASMASOLON TABLET @ 100 (UN)
            ['ASMASOLON TABLET @ 100 (UN)', 'BT', 29500, 'Obat-Obatan',
                'Tablet bronkodilator untuk melegakan napas pada serangan asma ringan.',
                'Meringankan sesak napas and gejala asma bronkial ringan, serta bronkitis dengan komponen bronkospasme.',
                ['Sesak Napas', 'Asma'],
                'Theophylline, Ephedrine, Chlorpheniramine',
                'Dewasa: 1 tablet, 3x sehari. Anak: sesuai anjuran dokter.',
                'Jantung berdebar, gelisah, insomnia, mual.',
                'Aritmia, hipertiroid, hipertensi, hamil.'],
            // 40. BRICASMA SYR 100ML
            ['BRICASMA SYR 100ML', 'BT', 46500, 'Obat-Obatan',
                'Sirup bronkodilator untuk melebarkan saluran napas pada asma dan bronkitis.',
                'Mencegah dan mengobati bronkospasme pada asma bronkial, bronkitis kronis, dan emfisema.',
                ['Sesak Napas', 'Asma', 'Mengi'],
                'Terbutaline Sulfate 1.5mg/5ml',
                'Dewasa: 10ml, 3x sehari. Anak 3-7 th: 5ml, 3x sehari. Sesudah makan.',
                'Tremor, jantung berdebar, sakit kepala, pusing.',
                'Aritmia, hipertensi berat. Hati-hati pada diabetes.'],
            // 41. REGIT DROP 10ML
            ['REGIT DROP 10ML', 'BT', 67300, 'Obat-Obatan',
                'Tetes antiemetik untuk mual dan muntah pada bayi/anak.',
                'Mencegah dan mengobati mual serta muntah pada bayi dan anak, termasuk mual akibat gangguan motilitas lambung.',
                ['Mual', 'Muntah'],
                'Domperidone 5mg/ml',
                'Bayi & anak: 0.25mg/kgBB, 3x sehari sebelum makan. Sesuai petunjuk dokter.',
                'Kantuk, sakit kepala, mulut kering.',
                'Gangguan hati, perdarahan GI, anak <1 th (hati-hati).'],
            // 42. NORVOM 10MG TAB@100
            ['NORVOM 10MG TAB@100', 'TAB', 38200, 'Obat-Obatan',
                'Tablet untuk mengatasi mual dan muntah serta mempercepat pengosongan lambung.',
                'Mengobati mual dan muntah, serta mempercepat pengosongan lambung pada dispepsia fungsional.',
                ['Mual', 'Muntah'],
                'Domperidone 10mg',
                'Dewasa: 1 tablet, 3x sehari 15-30 menit sebelum makan.',
                'Sakit kepala, mulut kering, diare, kantuk.',
                'Gangguan hati berat, perdarahan saluran cerna.'],
            // 43. NORVOM SYR 60ML
            ['NORVOM SYR 60ML', 'BT', 12200, 'Obat-Obatan',
                'Sirup antiemetik untuk anak dengan mual dan muntah.',
                'Mengobati mual dan muntah pada anak, termasuk mual akibat gangguan motilitas lambung.',
                ['Mual', 'Muntah'],
                'Domperidone 5mg/5ml',
                'Anak: 0.25mg/kgBB, 3x sehari. 15-30 menit sebelum makan.',
                'Kantuk, sakit kepala, mulut kering.',
                'Gangguan hati berat, anak <1 th (hati-hati).'],
            // 44. HERBA VOMITZ TAB@10
            ['HERBA VOMITZ TAB@10', 'TAB', 28200, 'Obat Tradisional / Herbal',
                'Tablet herbal untuk mengatasi mual ringan.',
                'Membantu meredakan mual ringan, seperti mual akibat perjalanan atau mual di pagi hari.',
                ['Mual', 'Muntah'],
                'Ekstrak Jahe, Ekstrak Daun Mint',
                '1-2 tablet, 3x sehari sesudah makan.',
                'Umumnya aman. Rasa hangat di lambung.',
                'Maag akut.'],
            // 45. ASAM MEFENAMAT 500MG TAB GHX
            ['ASAM MEFENAMAT 500MG TAB GHX', 'TAB', 75900, 'Obat-Obatan',
                'Anti-inflamasi dan analgesik untuk nyeri ringan-sedang, terutama nyeri haid dan gigi.',
                'Meredakan nyeri ringan hingga sedang seperti nyeri haid (dismenore), sakit gigi, sakit kepala, nyeri pasca operasi, dan nyeri otot.',
                ['Nyeri', 'Nyeri Haid', 'Nyeri Gigi'],
                'Mefenamic Acid 500mg',
                'Dewasa: 500mg (1 tablet), 3x sehari sesudah makan. Maks 7 hari.',
                'Nyeri lambung, mual, diare, pusing, mengantuk.',
                'Tukak lambung, gangguan ginjal/hati, hamil trimester 3, anak <14 th.'],
            // 46. GORALGIN TAB @ 100 (GDN)
            ['GORALGIN TAB @ 100 (GDN)', 'TAB', 38800, 'Obat-Obatan',
                'Analgesik dan antispasmodik untuk nyeri kolik dan nyeri ringan-sedang.',
                'Meredakan nyeri kolik (saluran kemih, saluran empedu, usus) dan nyeri ringan-sedang lainnya.',
                ['Nyeri', 'Demam'],
                'Metamizole Sodium, Pitofenone, Fenpiverinium',
                'Dewasa: 1-2 tablet, 3x sehari sesudah makan.',
                'Mual, pusing, reaksi alergi.',
                'Gangguan sumsum tulang, anak <3 bulan, hamil trimester 1 & 3.'],
            // 47. MARINOX HARVEST COUGH MIXT 60
            ['MARINOX HARVEST COUGH MIXT 60', 'BT', 24200, 'Obat Tradisional / Herbal',
                'Obat batuk herbal untuk mengencerkan dan mengeluarkan dahak.',
                'Meredakan batuk berdahak dengan mengencerkan dan memudahkan pengeluaran dahak (sekret bronkus).',
                ['Batuk Berdahak'],
                'Ekstrak Thyme, Ekstrak Ivy',
                'Dewasa: 15ml, 3x sehari. Anak 6-12 th: 7.5ml, 3x sehari.',
                'Mual ringan, gangguan lambung.',
                'Alergi tumbuhan Apiaceae/Araliaceae.'],
            // 48. OBAT BATUK IBU & ANAK 300ML
            ['OBAT BATUK IBU & ANAK 300ML', 'PC', 42600, 'Obat Batuk & Pilek',
                'Sirup ekspektoran tradisional untuk batuk berdahak cocok untuk ibu dan anak.',
                'Meredakan batuk berdahak pada ibu dan anak dengan membantu mengencerkan dan mengeluarkan dahak.',
                ['Batuk Berdahak'],
                'Ammonium Chloride, Glycyrrhiza Extract, Menthol',
                'Dewasa: 3 sendok teh (15ml), 3x sehari. Anak 6-12 th: 1.5 sendok teh, 3x sehari.',
                'Mual, gangguan lambung ringan.',
                'Hamil (kandungan Glycyrrhiza), anak <2 th.'],
            // 49. VECTRINE SYR 60ML
            ['VECTRINE SYR 60ML', 'BT', 68600, 'Obat Batuk & Pilek',
                'Sirup mukolitik untuk mengencerkan dahak pada batuk produktif.',
                'Mengencerkan dan memudahkan pengeluaran dahak yang kental pada infeksi saluran napas akut dan kronis.',
                ['Batuk Berdahak'],
                'Erdosteine 175mg/5ml',
                'Dewasa: 10ml, 2-3x sehari. Anak sesuai dosis dokter.',
                'Mual, diare, nyeri lambung.',
                'Gangguan ginjal berat, homocystinuria.'],
            // 50. MAXOCIL SYR 60ML
            ['MAXOCIL SYR 60ML', 'BT', 37100, 'Obat Batuk & Pilek',
                'Sirup kombinasi untuk batuk dengan dahak sekaligus batuk kering.',
                'Meredakan batuk produktif (berdahak) sekaligus batuk kering pada infeksi saluran napas.',
                ['Batuk Berdahak', 'Batuk Kering'],
                'Ambroxol, Dextromethorphan, Guaifenesin',
                'Dewasa: 10ml, 3x sehari. Anak 6-12 th: 5ml, 3x sehari.',
                'Mual, nyeri lambung, kantuk.',
                'Anak <2 th, gangguan hati berat.'],
            // 51. PLUG NASAL FILTER@6
            ['PLUG NASAL FILTER@6', 'PC', 121900, 'Alat Kesehatan',
                'Filter hidung fisik untuk memblokir partikel debu, pollen, dan polutan penyebab pilek/alergi.',
                'Memfilter partikel debu, serbuk sari (pollen), polutan, dan alergen di udara yang masuk melalui hidung untuk mencegah pilek dan reaksi alergi.',
                ['Pilek', 'Alergi Hidung'],
                '-',
                'Masukkan ke lubang hidung saat di lingkungan berdebu atau berpolutan.',
                'Ketidaknyamanan fisik jika tidak pas ukurannya.',
                'Alergi bahan filter.'],
            // 52. AQUA MARIS BABY NASAL DROPS
            ['AQUA MARIS BABY NASAL DROPS', 'BT', 45400, 'Obat Batuk & Pilek',
                'Tetes hidung saline isotonis untuk membersihkan dan melembabkan hidung tersumbat pada bayi.',
                'Membersihkan dan melembabkan rongga hidung bayi yang tersumbat akibat pilek, sekresi berlebih, atau udara kering.',
                ['Pilek', 'Hidung Tersumbat'],
                'Larutan NaCl fisiologis 0.9%',
                'Bayi: 1-2 tetes per lubang hidung, 3-4x sehari. Anak: 2-3 tetes.',
                'Bersin setelah pemakaian (wajar).',
                'Tidak ada kontraindikasi signifikan.'],
            // 53. INSTO MOIST 7.5 ML
            ['INSTO MOIST 7.5 ML', 'BT', 46300, 'Obat-Obatan',
                'Tetes mata dan hidung untuk melembabkan membran mukosa yang kering akibat pilek.',
                'Melembabkan dan meringankan iritasi mata kering akibat penggunaan lensa kontak, lingkungan kering, atau terlalu lama menatap layar.',
                ['Pilek', 'Mata Kering', 'Iritasi'],
                'Hydroxypropyl methylcellulose, NaCl',
                '2-3 tetes pada mata atau hidung, 3-4x sehari sesuai kebutuhan.',
                'Penglihatan kabur sementara (jika digunakan di mata).',
                'Alergi komponen.'],
            // 54. INSTO COOL 7.5 ML
            ['INSTO COOL 7.5 ML', 'BT', 47300, 'Obat-Obatan',
                'Tetes mata untuk mengatasi mata merah dan iritasi dengan sensasi dingin.',
                'Meredakan mata merah, iritasi mata ringan, dan rasa tidak nyaman pada mata akibat debu, asap, atau kelelahan.',
                ['Pilek', 'Mata Merah', 'Iritasi Mata'],
                'Tetrahydrozoline HCl, Borneol',
                '1-2 tetes per mata, 3-4x sehari.',
                'Penglihatan kabur sementara. Efek rebound jika digunakan > 3 hari.',
                'Glaukoma sudut sempit, pengguna lensa kontak.'],
            // 55. STERIMAR ISOTON 100ML
            ['STERIMAR ISOTON 100ML', 'BT', 3300, 'Obat Batuk & Pilek',
                'Semprotan hidung saline untuk membersihkan dan melembabkan rongga hidung.',
                'Membersihkan dan melembabkan rongga hidung, meringankan hidung tersumbat akibat pilek, sinusitis ringan, or rhinitis alergi.',
                ['Pilek', 'Hidung Tersumbat'],
                'Larutan NaCl isotonis 0.9% + mineral laut',
                'Semprotkan 1-2 kali per lubang hidung, 3-6x sehari.',
                'Bersin ringan.',
                'Tidak ada.'],
            // 56. CETIRIZINE 10 MG (DUS 30 TAB)
            ['CETIRIZINE 10 MG (DUS 30 TAB)', 'TAB', 305, 'Obat-Obatan',
                'Antihistamin generasi 2 untuk alergi, urtikaria, dan rhinitis alergi. Efek kantuk minimal.',
                'Meredakan gejala alergi seperti bersin, hidung berair (rhinitis alergi), gatal-gatal, urtikaria (biduran), dan konjungtivitis alergi.',
                ['Alergi', 'Pilek Alergi', 'Gatal'],
                'Cetirizine HCl 10mg',
                'Dewasa & anak >12 th: 1 tablet, 1x sehari (malam). Anak 6-12 th: ½ tablet, 1x sehari.',
                'Kantuk ringan, mulut kering, sakit kepala.',
                'Gangguan ginjal berat, anak <2 th.'],
            // 57. TELFAST 120MG OTC TAB@10
            ['TELFAST 120MG OTC TAB@10', 'TAB', 37900, 'Obat-Obatan',
                'Antihistamin generasi 3, non-sedatif untuk rhinitis alergi musiman.',
                'Meredakan gejala rhinitis alergi musiman seperti bersin, hidung berair, mata berair and gatal, serta urtikaria idiopatik kronis.',
                ['Alergi', 'Rhinitis Alergi', 'Biduran'],
                'Fexofenadine HCl 120mg',
                'Dewasa & anak >12 th: 1 tablet, 1x sehari.',
                'Sakit kepala, mual, pusing. Sangat jarang kantuk.',
                'Gangguan ginjal berat.'],
            // 58. INCIDAL OD 10MG CAP@50
            ['INCIDAL OD 10MG CAP@50', 'BT', 26200, 'Obat-Obatan',
                'Kapsul antihistamin once-daily untuk alergi dan gatal.',
                'Meredakan gejala alergi seperti rhinitis alergi, gatal-gatal, dan urtikaria (biduran).',
                ['Alergi', 'Gatal', 'Urtikaria'],
                'Cetirizine HCl 10mg',
                '1 kapsul, 1x sehari (malam hari).',
                'Kantuk ringan, mulut kering.',
                'Anak <6 th, gangguan ginjal berat.'],
            // 59. SANOLERGIC 120MG KPL@100
            ['SANOLERGIC 120MG KPL@100', 'TAB', 23400, 'Obat-Obatan',
                'Antihistamin non-sedatif untuk rhinitis alergi.',
                'Meredakan gejala rhinitis alergi musiman (bersin, hidung berair, hidung gatal, mata berair) dan urtikaria idiopatik kronis.',
                ['Alergi', 'Rhinitis Alergi'],
                'Fexofenadine HCl 120mg',
                'Dosis dan Aturan Pakai Sanolergic Dosis dan aturan pakai Sanolergic akan ditentukan oleh dokter. Secara umum, berikut ini adalah dosis Sanolergic sesuai kondisi yang diobati:  Kondisi: Rhinitis alergi  Dewasa dan anak usia ≥12 tahun: 120 mg, 1 kali sehari. Dosis alternatif 60 mg 2 kali sehari atau 180 mg 1 kali sehari. Kondisi: Biduran jangka panjang (kronis)  Dewasa: 180 mg 1 kali sehari. Anak usia ≥12 tahun: 60 mg 2 kali sehari or 180 mg 1 kali sehari.',
                'Sakit kepala, mual.',
                'Gangguan ginjal berat.'],
            // 60. XEPADERGIN 1MG TAB@100
            ['XEPADERGIN 1MG TAB@100', 'TAB', 38900, 'Obat-Obatan',
                'Antihistamin dengan efek stabilisasi sel mast untuk alergi kronis.',
                'Pencegahan dan pengobatan alergi kronis, urtikaria, konjungtivitis alergi, dan eksim alergi. Sebagai terapi tambahan pada asma bronkial.',
                ['Alergi', 'Gatal', 'Urtikaria'],
                'Ketotifen Fumarate 1mg',
                'Dewasa: 1 tablet, 2x sehari (pagi & malam) sesudah makan.',
                'Kantuk, mulut kering, pusing, peningkatan nafsu makan.',
                'Ketotifen Fumarate 1mg',
                'Anak <3 th, hamil trimester 1.'],
            // 61. ZADITEN 1MG DROP 10ML
            ['ZADITEN 1MG DROP 10ML', 'BT', 20500, 'Obat-Obatan',
                'Tetes antihistamin untuk anak dengan alergi and kecenderungan asma.',
                'Pencegahan dan pengobatan reaksi alergi, konjungtivitis alergi, dan sebagai terapi tambahan pada asma bronkial alergi pada anak.',
                ['Alergi', 'Asma Alergi'],
                'Ketotifen Fumarate 1mg/ml',
                'Anak >6 bulan: 0.05mg/kgBB, 2x sehari (pagi & malam).',
                'Kantuk, mulut kering.',
                'Anak <6 bulan.'],
            // 62. MEBO OINT 40GR
            ['MEBO OINT 40GR', 'TUB', 144300, 'Obat-Obatan',
                'Salep herbal untuk penyembuhan luka bakar dan lecet ringan.',
                'Membantu penyembuhan luka bakar derajat I dan II, luka lecet, dan luka kulit superfisial.',
                ['Luka Bakar', 'Luka Lecet'],
                'β-Sitosterol, Baicalin, Berberine dalam basis minyak wijen',
                'Oleskan tipis pada luka bersih, 2-3x sehari. Tidak perlu ditutup.',
                'Jarang: iritasi ringan.',
                'Alergi komponen herbal.'],
            // 63. ISODINE 10% SOL 1LT
            ['ISODINE 10% SOL 1LT', 'BT', 12400, 'Perawatan Tubuh',
                'Larutan antiseptik untuk membersihkan dan mencegah infeksi luka.',
                'Antiseptik untuk membersihkan dan mencegah infeksi pada luka terbuka, luka operasi, dan kulit sebelum tindakan medis.',
                ['Luka', 'Infeksi Kulit'],
                'Povidone Iodine 10%',
                'Oleskan atau kompres pada luka bersih 1-2x sehari.',
                'Iritasi kulit, perubahan warna kulit (kecoklatan sementara).',
                'Alergi iodine, gangguan tiroid, bayi baru lahir.'],
            // 64. DETTOL ANTISEPTIC LIQ 45 ML
            ['DETTOL ANTISEPTIC LIQ 45 ML', 'BT', 10200, 'Perawatan Tubuh',
                'Cairan antiseptik untuk membersihkan luka ringan dan kebersihan kulit.',
                'Antiseptik untuk membersihkan luka ringan, goresan, dan kulit untuk mencegah infeksi. Dapat digunakan sebagai antiseptik mandi.',
                ['Luka', 'Kebersihan Kulit'],
                'Chloroxylenol 4.8%',
                'Encerkan 1:20 dengan air bersih, oleskan pada luka. Atau campurkan dalam air mandi.',
                'Iritasi kulit pada penggunaan tidak diencerkan.',
                'Jangan digunakan tidak diencerkan langsung ke kulit.'],
            // 65. HANSAPLAST SOFT COMPRESS STERIL DUS@10
            ['HANSAPLAST SOFT COMPRESS STERIL DUS@10', 'PC', 141300, 'Alat Kesehatan',
                'Kompres steril lembut untuk menutup dan melindungi luka.',
                'Menutup dan melindungi luka lecet, goresan, dan luka kecil agar terlindung dari kontaminasi dan infeksi.',
                ['Luka', 'Luka Lecet'],
                '-',
                'Tempelkan pada luka bersih dan kering. Ganti setiap hari atau jika basah.',
                'Iritasi kulit jika alergi adhesif.',
                'Alergi plester/adhesif.'],
            // 66. HANSAPLAST SECOND SKIN PROTECTION XL@3
            ['HANSAPLAST SECOND SKIN PROTECTION XL@3', 'PC', 16900, 'Alat Kesehatan',
                'Plester hidrokoloid transparan untuk luka lecet dan melepuh. Menciptakan lingkungan lembab optimal.',
                'Melindungi dan mempercepat penyembuhan luka lecet dan luka melepuh (blister) dengan menciptakan lingkungan lembab yang optimal.',
                ['Luka Lecet', 'Luka Melepuh'],
                '-',
                'Tempel pada luka bersih, biarkan hingga 7 hari atau sampai penuh.',
                'Iritasi ringan saat melepas.',
                'Alergi plester, luka infeksi/dalam.'],
            // 67. NEO RHEUMACYL NEURO STR10.S@12
            ['NEO RHEUMACYL NEURO STR10.S@12', 'PC', 23800, 'Obat-Obatan',
                'Kombinasi NSAID dan vitamin B untuk pegal linu, nyeri sendi, dan rematik.',
                'Meringankan nyeri sendi, pegal linu, nyeri otot, rematik, serta membantu memenuhi kebutuhan vitamin B untuk kesehatan saraf.',
                ['Pegal', 'Nyeri Sendi', 'Rematik'],
                'Ibuprofen, Vitamin B1, B6, B12',
                'Dewasa: 1 strip (3 tablet berbeda), sesuai anjuran. Sesudah makan.',
                'Nyeri lambung, mual, pusing.',
                'Tukak lambung, gangguan ginjal/hati, anak <12 th.'],
            // 68. ANTANGIN JRG CAIR 15ML SACH@12
            ['ANTANGIN JRG CAIR 15ML SACH@12', 'DUS', 29200, 'Obat Tradisional / Herbal',
                'Jamu cair herbal untuk pegal, masuk angin, dan perut kembung.',
                'Meringankan gejala masuk angin seperti pegal-pegal, perut kembung, mual, dan badan meriang.',
                ['Pegal', 'Masuk Angin'],
                'Ekstrak Jahe, Menthol, Madu, Vitamin C',
                '1 sachet (15ml), 2-3x sehari.',
                'Rasa hangat di lambung. Jarang: mual.',
                'Maag akut, hamil.'],
            // 69. SIDO M TOLAK ANGIN CAIR SUGFREE DUSSC @5
            ['SIDO M TOLAK ANGIN CAIR SUGFREE DUSSC @5', 'DUS', 24500, 'Obat Tradisional / Herbal',
                'Jamu cair bebas gula untuk masuk angin, pegal, dan perut kembung. Aman penderita diabetes.',
                'Meringankan gejala masuk angin seperti perut kembung, mual, pegal-pegal, dan badan meriang. Aman untuk penderita diabetes (bebas gula).',
                ['Pegal', 'Masuk Angin', 'Perut Kembung'],
                'Ekstrak Jahe, Adas, Kayu Manis, Cengkeh, Madu (sugar free)',
                '1 sachet, 2-3x sehari sesudah makan.',
                'Rasa hangat di perut.',
                'Maag akut.'],
        ];

        // 1. Prepare Categories
        $dbCategories = DB::table('categories')->get()->keyBy('nama_kategori')->toArray();
        $iconMap = [
            'Obat Batuk & Pilek' => 'fa-head-side-cough',
            'Analgesik & Antipiretik' => 'fa-thermometer-half',
            'Suplemen & Vitamin' => 'fa-apple-alt',
            'Obat-Obatan' => 'fa-pills',
            'Alat Kesehatan' => 'fa-stethoscope',
            'Kecantikan & Skincare' => 'fa-spa',
            'Ibu & Anak' => 'fa-baby',
            'Perawatan Tubuh' => 'fa-bath',
            'Obat Tradisional / Herbal' => 'fa-leaf',
            'Vitamin & Suplement' => 'fa-capsules',
        ];

        // 2. Prepare Images
        $imageMap = [
            'Obat Batuk & Pilek' => 'https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=400',
            'Analgesik & Antipiretik' => 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=400',
            'Suplemen & Vitamin' => 'https://images.unsplash.com/photo-1577401239170-897942555fb3?q=80&w=400',
            'Obat-Obatan' => 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=400',
            'Alat Kesehatan' => 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?q=80&w=400',
            'Kecantikan & Skincare' => 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400',
            'Ibu & Anak' => 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=400',
            'Perawatan Tubuh' => 'https://images.unsplash.com/photo-1608248593842-8d76d4949397?q=80&w=400',
            'Obat Tradisional / Herbal' => 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=400',
            'Vitamin & Suplement' => 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=400',
        ];

        // 3. Prepare Symptoms
        $dbSymptoms = DB::table('symptoms')->get()->keyBy('nama_gejala')->toArray();

        // Tahan Foreign Key check untuk Truncate
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        DB::table('product_symptoms')->truncate();
        DB::table('products')->truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        $productData = [];
        $pivotData = [];
        $productIdCounter = 1;

        foreach ($rawData as $row) {
            $catName = $row[3];
            // Tambahkan Kategori jika belum ada
            if (!isset($dbCategories[$catName])) {
                $newCatId = DB::table('categories')->insertGetId([
                    'nama_kategori' => $catName,
                    'slug' => Str::slug($catName),
                    'deskripsi' => "Kategori untuk produk $catName",
                    'ikon' => $iconMap[$catName] ?? 'fa-box',
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
                $dbCategories[$catName] = (object)['id' => $newCatId];
            }

            $catId = $dbCategories[$catName]->id;

            $hasFullData = count($row) >= 11;
            
            // Siapkan Gejala (Symptoms)
            $symptomNames = $hasFullData ? $row[6] : $row[5];
            foreach ($symptomNames as $sym) {
                if (!isset($dbSymptoms[$sym])) {
                    $newSymId = DB::table('symptoms')->insertGetId([
                        'nama_gejala' => $sym,
                        'slug' => Str::slug($sym),
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                    $dbSymptoms[$sym] = (object)['id' => $newSymId];
                }
                
                $pivotData[] = [
                    'product_id' => $productIdCounter,
                    'symptom_id' => $dbSymptoms[$sym]->id,
                    'bobot_relevansi' => 0.90,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            $isPrescriptionRequired = in_array($row[0], [
                'WEGOVY 1.7MG PEN@1',
                'HEPA-MERZ GRANUL@10',
                'MOLACORT 0.75MG TAB@200 MOL',
                'PROTHYRA 5MG TAB@30',
                'CIMANTIN 10MG TAB@28',
                'PRITASMA TAB@100 INHEALTH',
                'BRICASMA SYR 100ML',
                'REGIT DROP 10ML',
                'NORVOM 10MG TAB@100',
                'NORVOM SYR 60ML',
                'ASAM MEFENAMAT 500MG TAB GHX',
                'GORALGIN TAB @ 100 (GDN)',
                'VECTRINE SYR 60ML',
                'INCIDAL OD 10MG CAP@50',
                'SANOLERGIC 120MG KPL@100',
                'XEPADERGIN 1MG TAB@100',
                'ZADITEN 1MG DROP 10ML',
                'COMTUSI CAP@30',
            ]);

            if ($hasFullData) {
                $deskripsi = $row[4];
                $indikasi = $row[5];
                $komposisi = $row[7];
                $aturan_pakai = $row[8];
                $efek_samping = $row[9];
                $kontraindikasi = $row[10];
            } else {
                $deskripsi = $row[4];
                $indikasi = !empty($row[5]) ? implode(', ', $row[5]) : $row[4];
                $aturan_pakai = 'Sesuai petunjuk di kemasan atau arahan medis.';
                $efek_samping = 'Baca informasi pada kemasan.';
                $komposisi = null;
                $kontraindikasi = null;
            }

            $productData[] = [
                'id' => $productIdCounter, // Explicit ID for pivot
                'category_id' => $catId,
                'nama_obat' => $row[0],
                'slug' => Str::slug($row[0]),
                'deskripsi' => $deskripsi,
                'jenis_obat' => $isPrescriptionRequired ? 'keras' : 'bebas',
                'is_prescription_required' => $isPrescriptionRequired,
                'indikasi' => $indikasi,
                'aturan_pakai' => $aturan_pakai,
                'efek_samping' => $efek_samping,
                'komposisi' => $komposisi,
                'kontraindikasi' => $kontraindikasi,
                'harga' => $row[2],
                'unit' => $row[1],
                'stok' => rand(20, 100),
                'stok_minimum' => 5,
                'gambar' => $imageMap[$catName] ?? $imageMap['Obat-Obatan'],
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ];
            
            $productIdCounter++;
        }
        
        DB::table('products')->insert($productData);
        DB::table('product_symptoms')->insert($pivotData);
    }
}
