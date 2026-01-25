import { useState, useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import {
  FileDown,
  Play,
  Square,
  Upload,
  RefreshCcw,
  Activity,
} from "lucide-react";
import * as XLSX from "xlsx";

// Import Komponen Pendukung
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import About from "./components/About";
import Faq from "./components/Faq";
import FlowWork from "./components/FlowWork";

interface LogEntry {
  id: string;
  waktu: string;
  namaObjek: string;
  jumlah: number;
  keterangan: string;
}

interface TrackedObject {
  id: string;
  label: string;
  bbox: [number, number, number, number];
  lastSeen: number;
}

export default function App() {
  // --- State Management ---
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [model, setModel] = useState<cocossd.ObjectDetection | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalHistory, setTotalHistory] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // --- Refs ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const activeObjects = useRef<TrackedObject[]>([]);

  // 1. Inisialisasi Model TensorFlow (untuk Kamera Realtime)
  useEffect(() => {
    tf.ready().then(() => {
      cocossd.load().then((m) => {
        setModel(m);
        setLoading(false);
      });
    });
  }, []);

  // 2. Fungsi Hitung Overlap (IOU) agar objek yang sama tidak dihitung ulang
  const calculateIOU = (boxA: number[], boxB: number[]) => {
    const xA = Math.max(boxA[0], boxB[0]);
    const yA = Math.max(boxA[1], boxB[1]);
    const xB = Math.min(boxA[0] + boxA[2], boxB[0] + boxB[2]);
    const yB = Math.min(boxA[1] + boxA[3], boxB[1] + boxB[3]);
    const interArea = Math.max(0, xB - xA) * Math.max(0, yB - yA);
    const areaA = boxA[2] * boxA[3];
    const areaB = boxB[2] * boxB[3];
    return interArea / (areaA + areaB - interArea);
  };

  // 3. Fungsi Utama Menggambar Deteksi
  const drawDetections = (
    preds: any[],
    isPhoto = false,
    imgElement?: HTMLImageElement,
  ) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const canvas = canvasRef.current!;
    // Sesuaikan ukuran canvas dengan sumber visual (Video atau Foto)
    const displayWidth = isPhoto
      ? imgElement!.clientWidth
      : videoRef.current!.clientWidth;
    const displayHeight = isPhoto
      ? imgElement!.clientHeight
      : videoRef.current!.clientHeight;

    canvas.width = displayWidth;
    canvas.height = displayHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    preds.forEach((p) => {
      ctx.strokeStyle = "#00FFCC";
      ctx.lineWidth = 3;
      ctx.fillStyle = "rgba(0, 255, 204, 0.2)";

      if (isPhoto && p.points) {
        // Logika Menggambar Poligon (Dari Backend YOLO Segmentation)
        const scaleX = displayWidth / imgElement!.naturalWidth;
        const scaleY = displayHeight / imgElement!.naturalHeight;

        ctx.beginPath();
        ctx.moveTo(p.points[0][0] * scaleX, p.points[0][1] * scaleY);
        p.points.forEach((pt: any) =>
          ctx.lineTo(pt[0] * scaleX, pt[1] * scaleY),
        );
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        ctx.fillStyle = "#00FFCC";
        ctx.font = "bold 14px Inter";
        ctx.fillText(p.label, p.box[0] * scaleX, p.box[1] * scaleY - 5);
      } else {
        // Logika Menggambar Kotak (Kamera Realtime)
        const [x, y, w, h] = p.bbox;
        ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = "#00FFCC";
        ctx.font = "bold 14px Inter";
        ctx.fillText(p.class.toUpperCase(), x, y > 15 ? y - 7 : 15);
      }
    });
  };

  // 4. Deteksi Realtime Kamera
  const detectFrame = async () => {
    if (model && isStreaming && videoRef.current?.readyState === 4) {
      const predictions = await model.detect(videoRef.current);
      drawDetections(predictions);

      const now = Date.now();
      const currentFrameObjects: TrackedObject[] = [];

      predictions.forEach((pred) => {
        // Cari kecocokan objek lama (IOU > 0.4)
        const matchIndex = activeObjects.current.findIndex(
          (obj) =>
            obj.label === pred.class && calculateIOU(obj.bbox, pred.bbox) > 0.4,
        );

        if (matchIndex > -1) {
          // Jika objek masih orang yang sama, hanya update data
          const matched = activeObjects.current[matchIndex];
          matched.bbox = pred.bbox as [number, number, number, number];
          matched.lastSeen = now;
          currentFrameObjects.push(matched);
          activeObjects.current.splice(matchIndex, 1);
        } else {
          // Jika objek baru masuk ke frame
          const newId = `CAM-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
          const newEntry = {
            id: newId,
            waktu: new Date().toLocaleTimeString(),
            namaObjek: pred.class.toUpperCase(),
            jumlah: 1,
            keterangan: "Live Camera",
          };
          setLogs((prev) => [newEntry, ...prev].slice(0, 30));
          setTotalHistory((t) => t + 1);
          currentFrameObjects.push({
            id: newId,
            label: pred.class,
            bbox: pred.bbox as [number, number, number, number],
            lastSeen: now,
          });
        }
      });
      activeObjects.current = currentFrameObjects;
    }
    if (isStreaming) requestRef.current = requestAnimationFrame(detectFrame);
  };

  useEffect(() => {
    if (isStreaming) requestRef.current = requestAnimationFrame(detectFrame);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isStreaming]);

  // 5. Handler Toggle Kamera
  const toggleCamera = async () => {
    if (isStreaming) {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach((t) => t.stop());
      setIsStreaming(false);
      activeObjects.current = [];
    } else {
      setPreviewUrl(null); // Tutup pratinjau foto jika kamera mulai
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    }
  };

  // 6. Handler Upload Foto ke Backend
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isStreaming) toggleCamera(); // Matikan kamera jika upload foto

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/detect", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (result.status === "success") {
        setLogs((prev) => [...result.data, ...prev].slice(0, 50));
        setTotalHistory((h) => h + result.data.length);

        // Render arsir bentuk pada foto
        const img = new Image();
        img.src = url;
        img.onload = () => {
          drawDetections(
            result.shapes,
            true,
            document.getElementById("photo-view") as HTMLImageElement,
          );
        };
      }
    } catch (err) {
      alert("Gagal terhubung ke Backend (main.py).");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
      <Navbar />

      {/* Struktur Komponen Sesuai Sebelumnya */}
      <Hero
        onStart={() =>
          document
            .getElementById("tracker-section")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      />
      <About />
      <FlowWork />

      <main
        id="tracker-section"
        className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 pt-20"
      >
        {/* Kolom Visual (Kamera/Foto) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video bg-black rounded-[2.5rem] overflow-hidden border-4 border-slate-900 shadow-2xl group">
            {previewUrl ? (
              <img
                id="photo-view"
                src={previewUrl}
                className="w-full h-full object-contain"
                alt="Preview"
              />
            ) : (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
            )}

            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
            />

            {loading && (
              <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center z-20">
                <Activity
                  className="animate-spin text-blue-500 mb-4"
                  size={40}
                />
                <p className="font-mono text-blue-400 tracking-tighter">
                  AI ENGINE INITIALIZING...
                </p>
              </div>
            )}

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 opacity-0 group-hover:opacity-100 transition-all z-20">
              <button
                onClick={toggleCamera}
                className={`px-8 py-3 rounded-2xl font-bold flex items-center gap-2 ${isStreaming ? "bg-red-500 shadow-lg shadow-red-500/20" : "bg-blue-600 shadow-lg shadow-blue-500/20"}`}
              >
                {isStreaming ? <Square size={18} /> : <Play size={18} />}
                {isStreaming ? "STOP LIVE" : "START LIVE"}
              </button>
              <button
                onClick={() => {
                  setLogs([]);
                  setTotalHistory(0);
                  setPreviewUrl(null);
                  activeObjects.current = [];
                  const ctx = canvasRef.current?.getContext("2d");
                  ctx?.clearRect(0, 0, 5000, 5000);
                }}
                className="p-3 bg-slate-800 rounded-2xl hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <RefreshCcw size={20} />
              </button>
            </div>
          </div>

          {/* Statistik Bawah */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center">
              <span className="text-4xl font-black text-blue-500">
                {totalHistory}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                Global History
              </span>
            </div>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center">
              <span className="text-4xl font-black text-emerald-500">
                {activeObjects.current.length}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                Current Active
              </span>
            </div>
            <label className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 transition-all">
              <Upload className="text-blue-500 mb-1" size={24} />
              <span className="text-[10px] font-bold uppercase">
                Upload Photo
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>
        </div>

        {/* Discovery Log Sidebar */}
        <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 flex flex-col h-[600px] overflow-hidden shadow-2xl">
          <div className="p-7 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
            <h3 className="text-blue-400 font-black text-xs uppercase tracking-widest">
              Discovery Analytics
            </h3>
            <button
              onClick={() => {
                const ws = XLSX.utils.json_to_sheet(logs);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "DetectionLog");
                XLSX.writeFile(wb, "Object_Analytics.xlsx");
              }}
              className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"
            >
              <FileDown size={20} />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-5 space-y-4">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20 italic text-sm">
                No detections logged.
              </div>
            ) : (
              logs.map((log, i) => (
                <div
                  key={i}
                  className="bg-slate-800/40 p-4 rounded-2xl border border-white/5 animate-in slide-in-from-right-4 duration-300"
                >
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-mono">
                    <span>{log.waktu}</span>
                    <span className="text-blue-500 font-bold">{log.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm uppercase">
                      {log.namaObjek}
                    </h4>
                    <span className="text-lg font-black text-blue-500">
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
