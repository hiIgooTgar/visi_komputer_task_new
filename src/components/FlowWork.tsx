import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import {
  Camera,
  Cpu,
  Database,
  FileSpreadsheet,
  Layers,
  ShieldCheck,
} from "lucide-react";

// Import Swiper styles
import "swiper/swiper-bundle.css";

const steps = [
  {
    icon: <Camera size={32} />,
    title: "Input Sumber",
    desc: "Hubungkan kamera langsung (Webcam/IP Cam) atau unggah file foto dan video ke dalam dashboard.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: <Layers size={32} />,
    title: "Preprocessing",
    desc: "Sistem melakukan normalisasi frame dan penyesuaian kontras untuk akurasi deteksi maksimal.",
    color: "from-purple-500 to-blue-500",
  },
  {
    icon: <Cpu size={32} />,
    title: "AI Analysis",
    desc: "YOLOv8 & TensorFlow.js memproses setiap frame untuk mengidentifikasi kategori dan koordinat objek.",
    color: "from-cyan-400 to-emerald-400",
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Validasi Logika",
    desc: "Objek divalidasi berdasarkan confidence threshold agar tidak terjadi perhitungan ganda.",
    color: "from-orange-400 to-red-500",
  },
  {
    icon: <Database size={32} />,
    title: "Penyimpanan Log",
    desc: "Setiap deteksi dicatat ke dalam memori lokal beserta stempel waktu dan ID unik.",
    color: "from-pink-500 to-purple-500",
  },
  {
    icon: <FileSpreadsheet size={32} />,
    title: "Ekspor Laporan",
    desc: "Data diolah menjadi laporan siap saji dalam format Excel atau PDF untuk kebutuhan audit.",
    color: "from-emerald-400 to-teal-500",
  },
];

export default function FlowWork() {
  return (
    <section id="workflow" className="py-24 bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Alur Kerja <span className="text-blue-500">SmartCount</span>
          </h2>
          <p className="text-slate-400">
            Bagaimana teknologi AI kami memproses data Anda dari awal hingga
            akhir.
          </p>
        </div>

        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{ delay: 4000 }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
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
                <p className="text-slate-400 text-sm leading-relaxed">
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
