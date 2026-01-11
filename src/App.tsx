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
  RefreshCcw,
} from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import About from "./components/About";
import Faq from "./components/Faq";
import FlowWork from "./components/FlowWork";
import * as XLSX from "xlsx";

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);

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
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // 2. Menggambar Kotak Deteksi
  const drawBoxes = (boxes: any[]) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 640, 480);
    ctx.strokeStyle = "#00ffcc";
    ctx.lineWidth = 4;
    ctx.font = "bold 14px Inter";

    boxes.forEach((item) => {
      // Handle format berbeda antara TensorFlow (bbox) dan Backend (box)
      const [x, y, wOrX2, hOrY2] = item.box || item.bbox;
      const width = item.box ? wOrX2 - x : wOrX2;
      const height = item.box ? hOrY2 - y : hOrY2;

      ctx.strokeRect(x, y, width, height);
      ctx.fillStyle = "#00ffcc";
      ctx.fillRect(x, y - 22, width, 22);
      ctx.fillStyle = "black";
      ctx.fillText(item.label || item.class.toUpperCase(), x + 5, y - 6);
    });
  };

  // 3. Loop Deteksi Real-time
  const detectFrame = async () => {
    if (model && videoRef.current && videoRef.current.readyState === 4) {
      const predictions = await model.detect(videoRef.current);
      drawBoxes(predictions);

      const highConf = predictions.filter((p) => p.score > 0.66);
      if (highConf.length > 0) {
        const newEntries = highConf.map((p) => ({
          id: Math.random().toString(36).substr(2, 5).toUpperCase(),
          waktu: new Date().toLocaleTimeString(),
          namaObjek: p.class.toUpperCase(),
          jumlah: 1,
          keterangan: "Realtime Local AI",
        }));
        setLogs((prev) => [...newEntries, ...prev].slice(0, 25));
      }
    }
    if (isStreaming) {
      requestRef.current = requestAnimationFrame(detectFrame);
    }
  };

  useEffect(() => {
    if (isStreaming) {
      requestRef.current = requestAnimationFrame(detectFrame);
    } else {
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    }
  }, [isStreaming]);

  // 4. Handlers
  const toggleCamera = async () => {
    setPreviewUrl(null);
    if (isStreaming) {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach((t) => t.stop());
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
        alert("Kamera tidak ditemukan.");
      }
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "img" | "vid"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsStreaming(false);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    if (type === "img") {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("http://localhost:8000/detect", {
          method: "POST",
          body: formData,
        });
        const result = await res.json();
        if (result.status === "success") {
          setLogs((prev) => [...result.data, ...prev]);
          drawBoxes(result.boxes);
        }
      } catch (e) {
        console.error("Backend Error");
      }
    } else {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = url;
        setIsStreaming(true);
      }
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(logs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Detections");
    XLSX.writeFile(wb, "SmartCount_Report.xlsx");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden">
      <Navbar />
      <Hero
        onStart={() =>
          document.getElementById("app")?.scrollIntoView({ behavior: "smooth" })
        }
      />
      <About />
      <FlowWork />

      <main
        id="app"
        className="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10"
      >
        <div className="lg:col-span-2 space-y-6">
          <div className="relative bg-black rounded-[2.5rem] overflow-hidden border-4 border-slate-900 aspect-video shadow-2xl group">
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${
                previewUrl && !isStreaming ? "hidden" : "block"
              }`}
              autoPlay
              muted
              playsInline
            />
            {previewUrl && !isStreaming && (
              <img
                src={previewUrl}
                className="w-full h-full object-contain"
                alt="Preview"
              />
            )}
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
              width={640}
              height={480}
            />

            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 z-20">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="font-mono text-blue-400">SYNCING AI...</p>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-8 flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <button
                onClick={toggleCamera}
                className={`px-6 py-3 rounded-2xl flex items-center gap-2 font-bold ${
                  isStreaming ? "bg-red-500" : "bg-blue-600"
                } text-white`}
              >
                {isStreaming ? <Square size={18} /> : <Play size={18} />}{" "}
                {isStreaming ? "STOP" : "LIVE CAM"}
              </button>
              <button
                onClick={() => {
                  setPreviewUrl(null);
                  setIsStreaming(false);
                }}
                className="p-3 bg-slate-800 rounded-2xl"
              >
                <RefreshCcw size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <label className="flex items-center justify-center gap-3 bg-slate-900 p-6 rounded-3xl border border-slate-800 cursor-pointer hover:border-blue-500 transition-all">
              <Upload className="text-blue-500" />{" "}
              <span className="font-bold uppercase text-sm">Upload Photo</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "img")}
              />
            </label>
            <label className="flex items-center justify-center gap-3 bg-slate-900 p-6 rounded-3xl border border-slate-800 cursor-pointer hover:border-cyan-500 transition-all">
              <ImageIcon className="text-cyan-500" />{" "}
              <span className="font-bold uppercase text-sm">Upload Video</span>
              <input
                type="file"
                className="hidden"
                accept="video/*"
                onChange={(e) => handleFileUpload(e, "vid")}
              />
            </label>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 flex flex-col h-[600px] shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
            <h3 className="text-blue-400 font-black tracking-widest text-sm uppercase">
              Discovery Log
            </h3>
            <button
              onClick={exportExcel}
              className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"
            >
              <FileDown size={20} />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {logs.length === 0 ? (
              <p className="text-center text-slate-600 mt-20 italic">
                Scanning for objects...
              </p>
            ) : (
              logs.map((log, i) => (
                <div
                  key={i}
                  className="bg-slate-800/40 p-4 rounded-2xl border border-white/5 animate-in slide-in-from-right-4"
                >
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-mono">
                    <span>{log.waktu}</span>
                    <span className="text-blue-500">{log.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white uppercase leading-tight">
                        {log.namaObjek}
                      </h4>
                      <p className="text-[10px] text-slate-400 italic">
                        {log.keterangan}
                      </p>
                    </div>
                    <span className="text-xl font-black text-blue-500">
                      x{log.jumlah}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Faq />
      <Footer />
    </div>
  );
}
