export default function About() {
  return (
    // Tambahkan return di sini
    <section id="tentang" className="py-24 px-6 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Sisi Kiri: Teks Deskripsi */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">
              Smart Count : Aplikasi Penghitung Barang Otomatis
            </h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              SmartCount adalah sebuah aplikasi penghitung barang otomatis yang
              dirancang untuk membantu proses perhitungan barang menjadi lebih
              mudah, cepat, dan akurat. Dengan memanfaatkan teknologi Computer
              Vision, SmartCount mampu mendeteksi dan menghitung objek secara
              otomatis melalui kamera tanpa perlu campur tangan manual. Aplikasi
              ini sangat cocok digunakan pada berbagai skenario seperti proses
              produksi, pengemasan, gudang, maupun kebutuhan monitoring lainnya
              yang memerlukan perhitungan barang secara real-time. Melalui
              antarmuka website yang sederhana dan mudah digunakan, SmartCount
              memungkinkan pengguna untuk memantau hasil perhitungan secara
              langsung, melihat hasil data, serta mengontrol proses perhitungan
              dengan praktis. Dengan hadirnya SmartCount, diharapkan proses
              perhitungan barang dapat berjalan lebih efisien, meminimalkan
              kesalahan manusia, dan menjadi contoh nyata penerapan Computer
              Vision dalam sistem otomasi cerdas.
            </p>
            <ul className="space-y-4">
              {[
                "Penghitungan Barang Otomatis & Akurat.",
                "Pemantauan Stok Real-Time.",
                "Efisiensi Waktu dan Tenaga.",
                "Laporan Data Otomatis dan Mudah Diakses.",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="h-5 w-5 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Sisi Kanan: Kartu Statistik */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 md:mt-8 shadow-xl">
              <h3 className="text-blue-400 text-4xl font-bold mb-2">99%</h3>
              <p className="text-slate-400 text-sm italic font-medium">
                Akurasi Deteksi
              </p>
            </div>
            <div className="bg-blue-600 p-8 rounded-3xl shadow-xl shadow-blue-500/20 transform hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-white text-4xl font-bold mb-2">0ms</h3>
              <p className="text-blue-100 text-sm italic font-medium">
                Latency Local
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  ); // Tutup return
}
