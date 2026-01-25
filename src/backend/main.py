from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np
from datetime import datetime
import uvicorn
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model YOLOv8 Nano
model = YOLO('yolov8n.pt')

CATEGORY_MAP = {
    'person': 'Manusia',
    'laptop': 'Alat Elektronik', 'phone': 'Alat Elektronik', 'mouse': 'Alat Elektronik', 
    'computer': 'Alat Elektronik', 'book': 'Alat Belajar', 'backpack': 'Perlengkapan', 
    'bottle': 'Konsumsi', 'cup': 'Konsumsi', 'chair': 'Fasilitas', 'table': 'Meja'
}

@app.post("/detect")
async def detect_api(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="File bukan gambar")

        results = model.predict(img, conf=0.3)
        detections = []
        boxes_coords = []
        
        for r in results:
            for box in r.boxes:
                b = box.xyxy[0].tolist() 
                label = model.names[int(box.cls[0])]
                
                detections.append({
                    "id": f"IMG-{uuid.uuid4().hex[:4].upper()}",
                    "waktu": datetime.now().strftime("%H:%M:%S"),
                    "namaObjek": label.upper(),
                    "jumlah": 1,
                    "keterangan": CATEGORY_MAP.get(label, "Benda Umum")
                })
                
                boxes_coords.append({
                    "box": b,
                    "label": label.upper()
                })

        return {"status": "success", "data": detections, "boxes": boxes_coords}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)