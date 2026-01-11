export default function About() {
  return (
    // Tambahkan return di sini
    <section id="about" className="py-24 px-6 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Sisi Kiri: Teks Deskripsi */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">
              Teknologi Edge AI Terkini
            </h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              SmartCount menggunakan kombinasi **TensorFlow.js** untuk
              pemrosesan lokal yang sangat cepat di sisi client, dan **Python
              FastAPI + YOLOv8** untuk analisis mendalam yang membutuhkan
              akurasi tingkat tinggi.
            </p>
            <ul className="space-y-4">
              {[
                "Pemrosesan Video 60 FPS secara lokal.",
                "Dukungan ekspor laporan PDF & Excel otomatis.",
                "Deteksi multi-objek secara bersamaan.",
                "Keamanan data (proses dilakukan di perangkat Anda).",
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
