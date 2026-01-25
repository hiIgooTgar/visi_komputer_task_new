# 🚀 SmartCount AI: Real-time Object Detection & Counting

**SmartCount AI** adalah aplikasi cerdas berbasis *Computer Vision* yang dirancang untuk mendeteksi, mengklasifikasikan, dan menghitung objek secara otomatis dalam waktu nyata. Dengan memanfaatkan kekuatan algoritma **YOLOv8 (You Only Look Once)**, aplikasi ini mampu mengenali 80 jenis objek berbeda dengan tingkat akurasi tinggi.

Aplikasi ini sangat berguna untuk keperluan monitoring inventaris, analisis kepadatan pengunjung, hingga alat bantu identifikasi objek sehari-hari.

---

## 🌟 Apa itu SmartCount?

SmartCount adalah solusi pemindaian visual yang menjembatani teknologi AI dengan kebutuhan praktis. Berbeda dengan metode pemindaian manual, SmartCount bekerja secara otomatis menggunakan kamera atau file gambar.

**Mengapa menggunakan Dataset COCO?**
Aplikasi ini menggunakan dataset **COCO (Common Objects in Context)**, sebuah standar global dalam riset AI. Hal ini memungkinkan SmartCount untuk langsung mengenali benda-benda populer seperti:
* **Orang & Kendaraan**: Person, Car, Motorcycle, Bicycle, Bus, Truck.
* **Elektronik**: Laptop, Smartphone, Remote, Keyboard, Mouse.
* **Peralatan Rumah Tangga**: Bottle, Chair, Dining table, Cup, Spoon, Knife.
* **Lain-lain**: Backpack, Umbrella, Handbag, Tie, Suitcase.

---

## 🛠️ Fitur Unggulan

* **Dual-Mode Detection**: Dukungan penuh untuk *Live Streaming* kamera dan *Photo Upload*.
* **High-Speed Processing**: Didukung oleh YOLOv8 untuk proses deteksi yang cepat dan efisien.
* **Discovery Log**: Mencatat setiap objek yang ditemukan lengkap dengan stempel waktu (timestamp).
* **Export to Excel**: Fitur pelaporan instan untuk mengunduh riwayat deteksi ke format `.xlsx`.
* **Interactive UI**: Antarmuka modern dengan Dark Mode yang responsif dan intuitif.

---

## 📦 Persyaratan Sistem (Library)

Sebelum menjalankan aplikasi, pastikan komputer Anda sudah terinstal **Python 3.9+** dan **Node.js**.

### Library Backend (Python)
* **Ultralytics**: Mesin utama untuk menjalankan model YOLOv8.
* **FastAPI**: Framework web berperforma tinggi untuk API.
* **Uvicorn**: Server ASGI untuk menjalankan FastAPI.
* **Python-Multipart**: Untuk menangani pengiriman file gambar.

### Library Frontend (React)
* **Lucide-React**: Untuk set ikon yang elegan.
* **XLSX**: Untuk menghasilkan file laporan Excel.
* **Tailwind CSS**: Untuk desain antarmuka.

---

## 🚀 Langkah-Langkah Instalasi & Menjalankan Aplikasi

Ikuti panduan berikut untuk menjalankan SmartCount di perangkat lokal Anda:

### 1. Persiapan Backend
Buka terminal dan masuk ke folder backend:
```bash
cd smart-count/src/backend

# Instalasi library
pip install ultralytics fastapi uvicorn python-multipart
```

Jalankan server backend: folder smart-count/src/backend
```bash
python main.py
```
(Catatan: Saat pertama kali dijalankan, sistem akan otomatis mengunduh model yolov8n.pt dari server Ultralytics).

### 2. Persiapan Frontend
Buka terminal baru dan masuk ke folder utama project (atau folder frontend):
```bash
# Instalasi dependencies
npm install
```

Jalankan aplikasi frontend:
```bash
npm run dev
```
