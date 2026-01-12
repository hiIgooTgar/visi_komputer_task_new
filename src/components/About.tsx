export default function About() {
  return (
    // Tambahkan return di sini
    <section id="tentang" className="py-24 px-6 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Sisi Kiri: Teks Deskripsi */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                SmartCount
              </span>{" "}
              : Aplikasi Penghitung Barang Otomatis
            </h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                SmartCount
              </span>{" "}
              adalah aplikasi penghitung barang otomatis berbasis Computer
              Vision yang mendeteksi objek melalui kamera, menghitung secara
              real-time, menampilkan data di website, meningkatkan efisiensi,
              akurasi, dan mengurangi kesalahan manusia operasional modern.
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
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400  p-8 rounded-3xl shadow-xl shadow-blue-500/20 transform hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-white text-4xl font-bold mb-2">99,9%</h3>
              <p className="text-blue-100 text-sm italic font-medium">
                Accuracy
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400  p-8 rounded-3xl shadow-xl shadow-blue-500/20 transform hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-white text-4xl font-bold mb-2">0ms</h3>
              <p className="text-blue-100 text-sm italic font-medium">
                Latency Local
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400  p-8 rounded-3xl shadow-xl shadow-blue-500/20 transform hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-white text-4xl font-bold mb-2">0ms</h3>
              <p className="text-blue-100 text-sm italic font-medium">
                Latency Local
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400  p-8 rounded-3xl shadow-xl shadow-blue-500/20 transform hover:-translate-y-2 transition-transform duration-300">
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
