import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const questions = [
    {
      q: "Apakah aplikasi ini butuh internet?",
      a: "Untuk deteksi dasar (Kamera Real-time), aplikasi bekerja secara offline menggunakan TensorFlow.js. Namun untuk fitur AI tingkat lanjut melalui Python Backend, koneksi ke server lokal/cloud diperlukan.",
    },
    {
      q: "Objek apa saja yang bisa dideteksi?",
      a: "SmartCount mendukung deteksi 80+ kategori objek standar COCO seperti manusia, kendaraan, alat tulis, hingga kategori kustom seperti logistik dan peralatan rumah tangga.",
    },
    {
      q: "Format laporan apa yang didukung?",
      a: "Anda dapat mengekspor data hasil hitung ke dalam format Microsoft Excel (.xlsx) dan dokumen PDF (.pdf) lengkap dengan stempel waktu.",
    },
    {
      q: "Bagaimana dengan privasi data?",
      a: "Proses deteksi dilakukan secara lokal di browser Anda atau server privat Anda sendiri. Kami tidak menyimpan rekaman video di server publik manapun.",
    },
    {
      q: "Bisa digunakan di perangkat apa saja?",
      a: "SmartCount berbasis web, sehingga dapat diakses melalui laptop, tablet, maupun smartphone selama memiliki browser modern dan akses kamera.",
    },
    {
      q: "Apakah akurasinya bisa ditingkatkan?",
      a: "Ya, sistem kami mendukung integrasi model YOLO kustom (custom training) untuk mengenali objek spesifik yang hanya ada di industri atau bisnis Anda.",
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-6 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pertanyaan Umum
          </h2>
          <p className="text-slate-400">
            Segala hal yang perlu Anda ketahui tentang SmartCount AI
          </p>
        </div>

        {/* Grid 2 Kolom (Desktop) & 1 Kolom (Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {questions.map((item, i) => (
            <div
              key={i}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleAccordion(i)}
                className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-slate-800/50 transition-colors"
              >
                <span className="text-white font-semibold leading-tight">
                  {item.q}
                </span>
                <ChevronDown
                  className={`text-blue-500 transition-transform duration-300 flex-shrink-0 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  size={20}
                />
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-6 pt-0 text-slate-400 text-sm border-t border-slate-800/50 mt-2">
                  {item.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
