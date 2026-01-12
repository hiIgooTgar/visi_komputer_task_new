export default function Hero({ onStart }: { onStart: () => void }) {
  // Tambahkan return di sini
  return (
    <section
      id="beranda"
      className="w-full h-dvh flex justify-center items-center overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full text-blue-400 text-sm font-medium mb-6 animate-bounce">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Smart Count : Solusi Cepat Penghitung Barang
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
          Selamat Datang di{" "}
          <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            SmartCount
          </span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Platform cerdas yang membantu proses perhitungan barang secara
          otomatis melalui teknologi Computer Vision, sehingga lebih cepat,
          akurat, dan efisien, tanpa perlu proses manual yang rumit dan memakan
          waktu.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={onStart}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-blue-500/20"
          >
            Mulai Deteksi Sekarang
          </button>
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full -z-10"></div>
    </section>
  ); // Tutup return
}
