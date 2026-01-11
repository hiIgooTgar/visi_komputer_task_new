from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np
from datetime import datetime
import uvicorn

app = FastAPI()

# Koneksi ke Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model YOLOv8 (Otomatis download jika belum ada)
model = YOLO('yolov8n.pt')

CATEGORY_MAP = {
    'person': 'Manusia',
    'backpack': 'Alat Belajar', 'book': 'Alat Belajar', 'laptop': 'Alat Belajar',
    'bottle': 'Konsumsi', 'cup': 'Konsumsi', 'cell phone': 'Elektronik'
}

@app.post("/detect")
async def detect_api(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="File bukan gambar valid")

        results = model.predict(img, conf=0.25)
        detections = []
        boxes_coords = []
        
        for r in results:
            for box in r.boxes:
                # Ambil koordinat [x1, y1, x2, y2]
                b = box.xyxy[0].tolist() 
                label = model.names[int(box.cls[0])]
                conf = float(box.conf[0])
                
                detections.append({
                    "id": f"ID-{np.random.randint(100, 999)}",
                    "waktu": datetime.now().strftime("%H:%M:%S"),
                    "namaObjek": label.upper(),
                    "jumlah": 1,
                    "keterangan": CATEGORY_MAP.get(label, "Lainnya")
                })
                
                boxes_coords.append({
                    "box": b,
                    "label": f"{label} {conf:.2f}"
                })

        return {"status": "success", "data": detections, "boxes": boxes_coords}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)