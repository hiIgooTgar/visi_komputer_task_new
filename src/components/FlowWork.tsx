import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { Camera, Cpu, Layers, ShieldCheck } from "lucide-react";

// Import Swiper styles
import "swiper/swiper-bundle.css";

const steps = [
  {
    icon: <Camera size={32} />,
    title: "Input Objek",
    desc: "Pada tahap Input Objek, sistem mengambil gambar atau video barang secara real-time menggunakan kamera yang terhubung ke website. Setiap frame yang diambil diproses dengan OpenCV untuk meningkatkan kualitas citra, termasuk konversi ke grayscale, penghapusan noise, dan penekanan area yang relevan agar objek barang dapat dikenali dengan lebih akurat. Proses ini memastikan bahwa setiap citra siap untuk dianalisis oleh sistem deteksi barang.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: <Layers size={32} />,
    title: "Pengambilan Citra",
    desc: "Setelah citra dipersiapkan, model YOLOv8 berbasis PyTorch digunakan untuk mendeteksi barang secara otomatis dalam setiap frame. Sistem memberikan bounding box dan label nama barang beserta tingkat kepercayaan (confidence) untuk setiap objek yang terdeteksi, sehingga pengguna dapat melihat hasil deteksi secara langsung pada layar. Proses ini memungkinkan identifikasi jenis barang secara cepat dan akurat, serta meminimalkan kesalahan manusia dalam pencatatan.",
    color: "from-purple-500 to-blue-500",
  },
  {
    icon: <Cpu size={32} />,
    title: "Penghitungan Barang",
    desc: "Pada tahap Penghitungan Barang, setiap objek yang terdeteksi dihitung secara otomatis dan jumlahnya diperbarui ke database atau file CSV. Dengan mekanisme ini, stok barang selalu diperbarui secara real-time tanpa perlu input manual, sehingga pengguna dapat memantau jumlah barang dengan mudah dan memastikan data inventaris tetap akurat. Sistem juga mempersiapkan data ini untuk laporan atau analisis lebih lanjut.",
    color: "from-cyan-400 to-emerald-400",
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Laporan Data Hasil",
    desc: "Tahap terakhir adalah Output Laporan Data Hasil, di mana website menampilkan ringkasan stok barang, termasuk total jumlah barang, barang yang menipis, dan barang yang habis. Pengguna dapat mengekspor data ini ke format Excel, CSV, atau PDF untuk laporan harian atau audit. Selain itu, sistem menampilkan notifikasi jika stok barang menipis atau habis, sehingga pengguna dapat mengambil tindakan cepat untuk menjaga ketersediaan inventaris.",
    color: "from-orange-400 to-red-500",
  },
];

export default function FlowWork() {
  return (
    <section id="alur" className="py-24 bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Alur Kerja{" "}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              SmartCount
            </span>
          </h2>
          <p className="text-slate-400">
            Solusi cerdas untuk menghitung barang secara otomatis dan real-time
          </p>
        </div>

        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{ delay: 4000 }}
          breakpoints={{
            640: { slidesPerView: 1 },
            1024: { slidesPerView: 2 },
            1280: { slidesPerView: 2 },
          }}
          className="workflow-swiper !pb-16"
        >
          {steps.map((step, index) => (
            <SwiperSlide key={index}>
              <div className="h-full bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] relative group hover:border-blue-500/50 transition-all duration-500">
                {/* Number Badge */}
                <div className="absolute top-6 right-8 text-6xl font-black text-white/5 group-hover:text-blue-500/10 transition-colors">
                  0{index + 1}
                </div>

                {/* Icon Container */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform`}
                >
                  {step.icon}
                </div>

                <h3 className="text-xl font-bold text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">
                  {step.desc}
                </p>

                {/* Decorative Line */}
                <div
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${step.color} w-0 group-hover:w-full transition-all duration-500`}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .workflow-swiper .swiper-pagination-bullet {
          background: #334155;
          opacity: 1;
        }
        .workflow-swiper .swiper-pagination-bullet-active {
          background: #3b82f6;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
}
