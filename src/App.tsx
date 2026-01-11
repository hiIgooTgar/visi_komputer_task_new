import { useState, useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import {
  Camera,
  FileDown,
  Play,
  Square,
  Upload,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import About from "./components/About";
import Faq from "./components/Faq";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import FlowWork from "./components/FlowWork";

interface LogEntry {
  id: string;
  waktu: string;
  namaObjek: string;
  jumlah: number;
  keterangan: string;
}

export default function App() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [model, setModel] = useState<cocossd.ObjectDetection | null>(null);
  const [loading, setLoading] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();

  // 1. Load Model AI
  useEffect(() => {
    const loadAI = async () => {
      await tf.ready();
      const loadedModel = await cocossd.load();
      setModel(loadedModel);
      setLoading(false);
    };
    loadAI();
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // 2. Kirim ke Python Backend (Snapshot/Upload)
  const sendToBackend = async (imageBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", imageBlob, "capture.jpg");

    try {
      const response = await fetch("http://localhost:8000/detect", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.status === "success" && result.data.length > 0) {
        setLogs((prev) => [...result.data, ...prev].slice(0, 50));
      }
    } catch (error) {
      console.error("Backend offline.");
    }
  };

  // 3. Deteksi Kamera Real-time
  const detectFrame = async () => {
    if (model && videoRef.current && videoRef.current.readyState === 4) {
      const predictions = await model.detect(videoRef.current);
      drawBoundingBoxes(predictions);

      // Filter untuk menghindari log spam (Hanya log jika tingkat kepercayaan > 66%)
      const highConf = predictions.filter((p) => p.score > 0.66);
      if (highConf.length > 0) {
        const newEntries = highConf.map((p) => ({
          id: Math.random().toString(36).substr(2, 5).toUpperCase(),
          waktu: new Date().toLocaleTimeString("id-ID"),
          namaObjek: p.class,
          jumlah: 1,
          keterangan: "Realtime Local AI",
        }));
        setLogs((prev) => [...newEntries, ...prev].slice(0, 20));
      }
    }
    if (isStreaming) {
      requestRef.current = requestAnimationFrame(detectFrame);
    }
  };

  useEffect(() => {
    if (isStreaming) {
      detectFrame();
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
  }, [isStreaming]);

  const toggleCamera = async () => {
    if (isStreaming) {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
      setIsStreaming(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
        }
      } catch (err) {
        alert("Kamera tidak diizinkan atau tidak ditemukan.");
      }
    }
  };

  const drawBoundingBoxes = (predictions: cocossd.DetectedObject[]) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 640, 480);
    predictions.forEach((p) => {
      const [x, y, w, h] = p.bbox;
      ctx.strokeStyle = "#00ffcc";
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = "#00ffcc";
      ctx.globalAlpha = 0.8;
      ctx.fillRect(x, y - 25, w, 25);
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = "#000";
      ctx.font = "bold 14px Inter, sans-serif";
      ctx.fillText(
        `${p.class.toUpperCase()} ${(p.score * 100).toFixed(0)}%`,
        x + 5,
        y - 7
      );
    });
  };

  const takeSnapshot = () => {
    if (canvasRef.current && videoRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0, 640, 480);
      canvasRef.current.toBlob((blob) => {
        if (blob) sendToBackend(blob);
      }, "image/jpeg");
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(logs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DetectionLog");
    XLSX.writeFile(wb, "SmartCount_Report.xlsx");
  };

  const scrolltoApp = () => {
    document
      .getElementById("smart-count-app")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200 w-full overflow-x-hidden">
      <Navbar />
      <Hero onStart={scrolltoApp} />
      <About />
      <FlowWork />

      {/* --- SECTION DASHBOARD UTAMA --- */}
      <section
        id="smart-count-app"
        className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            AI Monitoring Dashboard
          </h2>
          <p className="text-slate-500">
            Gunakan kamera atau upload file untuk mulai menghitung
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative bg-black rounded-[2rem] overflow-hidden shadow-2xl border-4 border-slate-900 aspect-video group">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                width={640}
                height={480}
              />

              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md z-20">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="font-mono tracking-widest text-blue-400">
                    LOADING AI MODELS...
                  </p>
                </div>
              )}

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-y-[-10px]">
                <button
                  onClick={toggleCamera}
                  className={`px-8 py-4 rounded-2xl flex items-center gap-3 font-black transition-all ${
                    isStreaming
                      ? "bg-red-500 hover:bg-red-600 shadow-red-500/20"
                      : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                  } shadow-xl text-white`}
                >
                  {isStreaming ? (
                    <Square fill="white" />
                  ) : (
                    <Play fill="white" />
                  )}{" "}
                  {isStreaming ? "STOP ENGINE" : "LAUNCH CAMERA"}
                </button>
                <button
                  onClick={takeSnapshot}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl hover:bg-white/20 text-white transition-all"
                >
                  <Camera size={28} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center justify-center gap-3 bg-slate-900/50 border border-slate-800 p-6 rounded-3xl hover:bg-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group">
                <Upload
                  size={24}
                  className="text-blue-500 group-hover:scale-110 transition-transform"
                />
                <span className="font-bold">Analyze Photo</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] && sendToBackend(e.target.files[0])
                  }
                />
              </label>
              <button className="flex items-center justify-center gap-3 bg-slate-900/50 border border-slate-800 p-6 rounded-3xl hover:bg-slate-800 hover:border-blue-500/50 transition-all group">
                <ImageIcon
                  size={24}
                  className="text-cyan-500 group-hover:scale-110 transition-transform"
                />
                <span className="font-bold">Analyze Video</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] flex flex-col shadow-2xl overflow-hidden h-[600px]">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
              <h3 className="font-bold flex items-center gap-2 text-blue-400 uppercase tracking-tighter">
                <FileText size={20} /> Object Discovery
              </h3>
              <button
                onClick={exportExcel}
                className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-colors"
              >
                <FileDown size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-5 space-y-4 custom-scrollbar">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 opacity-50">
                  <div className="w-12 h-12 border-2 border-dashed border-slate-700 rounded-full animate-pulse"></div>
                  <p className="italic text-sm">Waiting for AI detections...</p>
                </div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={log.id + index}
                    className="bg-slate-800/40 border border-white/5 p-4 rounded-2xl animate-in slide-in-from-right-4 duration-300"
                  >
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-2">
                      <span>{log.waktu}</span>
                      <span className="text-blue-500">ID: {log.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-black text-white text-lg">
                          {log.namaObjek}
                        </h4>
                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest italic">
                          {log.keterangan}
                        </p>
                      </div>
                      <div className="bg-blue-600/20 text-blue-400 w-10 h-10 flex items-center justify-center rounded-xl font-black border border-blue-500/30">
                        {log.jumlah}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <Faq />
      <Footer />
    </div>
  );
}
