import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const questions = [
    {
      q: "Apa itu SmartCount?",
      a: "SmartCount adalah aplikasi penghitung barang otomatis yang menggunakan kamera dan teknologi AI untuk mendeteksi dan menghitung barang secara real-time.",
    },
    {
      q: "Bagaimana cara kerja SmartCount?",
      a: "SmartCount bekerja dengan mengambil gambar atau video melalui kamera, lalu model YOLOv8 mendeteksi dan menghitung barang secara otomatis.",
    },
    {
      q: "Apakah SmartCount bisa menghitung semua jenis barang?",
      a: "SmartCount dapat menghitung barang yang sudah dikenali oleh model. Barang baru perlu pelatihan ulang.",
    },
    {
      q: "Apakah SmartCount aman digunakan oleh banyak pengguna?",
      a: "Ya, SmartCount mendukung manajemen hak akses pengguna.",
    },
    {
      q: "Apakah SmartCount membutuhkan koneksi internet?",
      a: "Tidak selalu. SmartCount dapat berjalan secara lokal.",
    },
    {
      q: "Bisakah saya menyimpan data jumlah barang?",
      a: "Ya, SmartCount menyediakan fitur unduh laporan PDF.",
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-24 px-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pertanyaan Umum
          </h2>
          <p className="text-slate-400">
            Informasi seputar{" "}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent font-semibold">
              SmartCount AI
            </span>
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.map((item, i) => (
            <div
              key={i}
              className={`
                rounded-2xl border backdrop-blur-xl transition-all duration-300
                ${
                  openIndex === i
                    ? "border-cyan-500/40 bg-slate-900/90 shadow-[0_0_30px_rgba(34,211,238,0.18)]"
                    : "border-slate-800 bg-slate-900/50"
                }
              `}
            >
              <button
                onClick={() => toggleAccordion(i)}
                className="
                  w-full p-6 text-left flex justify-between items-center
                  bg-transparent
                  hover:bg-slate-800/40
                  transition-colors
                "
              >
                <span className="text-white font-semibold">{item.q}</span>

                <ChevronDown
                  size={20}
                  className={`transition-transform duration-300 ${
                    openIndex === i
                      ? "rotate-180 text-cyan-400"
                      : "text-blue-500"
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-6 pt-5 text-sm text-slate-300 text-justify border-t border-slate-800">
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
