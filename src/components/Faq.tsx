import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const questions = [
    {
      q: "Apa itu SmartCount ?",
      a: "SmartCount adalah aplikasi penghitung barang otomatis yang menggunakan kamera dan teknologi AI untuk mendeteksi dan menghitung barang secara real-time. Sistem ini memudahkan pengelolaan stok gudang tanpa perlu pencatatan manual.",
    },
    {
      q: "Bagaimana cara kerja SmartCount ?",
      a: "SmartCount bekerja dengan mengambil gambar atau video barang melalui kamera, kemudian menggunakan model YOLOv8 untuk mendeteksi barang. Setelah terdeteksi, sistem menghitung jumlah setiap barang dan menampilkan hasilnya langsung di dashboard pada bagian data hasil.",
    },
    {
      q: "Apakah SmartCount bisa menghitung semua jenis barang ?",
      a: "SmartCount dapat menghitung barang yang sudah dikenali oleh model deteksi (YOLOv8). Untuk barang baru atau berbeda, model harus dilatih atau diperbarui agar bisa mendeteksi dengan akurat.",
    },
    {
      q: "BaApakah SmartCount aman digunakan oleh banyak pengguna ?",
      a: "Ya, SmartCount mendukung manajemen hak akses pengguna. Admin dapat mengatur siapa saja yang bisa melihat, menambahkan, atau mengubah data barang.",
    },
    {
      q: "Apakah SmartCount membutuhkan koneksi internet ?",
      a: "SmartCount dapat berjalan secara lokal menggunakan kamera yang terhubung ke komputer atau server. Namun, jika ingin menyimpan data ke server cloud atau mengakses laporan dari jarak jauh, dibutuhkan koneksi internet.",
    },
    {
      q: "Bisakah saya menyimpan data jumlah barang?",
      a: "Ya, SmartCount menyediakan fitur download data jumlah barang ke PDF, sehingga laporan jumlah barang bisa digunakan untuk audit atau dokumentasi.",
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
            Segala hal yang perlu Anda ketahui tentang{" "}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              SmartCount
            </span>{" "}
            AI
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
                <div className="p-6 pt-0 text-slate-400 text-sm border-t text-justify border-slate-800/50 mt-2">
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
