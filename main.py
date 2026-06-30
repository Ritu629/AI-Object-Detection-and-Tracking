import cv2
import json
import shutil
import os
from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse, JSONResponse
from pipeline.processor import VisionPipeline

app = FastAPI(title="VisionTrack AI Core")

# Setup CORS parameters
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
RESULTS_DIR = "results"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

# Instantiates pipeline orchestrator
pipeline = VisionPipeline()

history_db = [
    {"id": "1", "filename": "Traffic_Expressway.mp4", "date": "2026-06-25", "objects_found": 48, "fps": 31},
    {"id": "2", "filename": "Pedestrian_Walkway.mov", "date": "2026-06-27", "objects_found": 12, "fps": 29}
]

@app.post("/api/upload")
async def upload_video(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"status": "Success", "filepath": file_path, "filename": file.filename}

@app.get("/api/history")
async def get_history():
    return JSONResponse(content=history_db)

@app.delete("/api/history/{item_id}")
async def delete_history_item(item_id: str):
    global history_db
    history_db = [item for item in history_db if item["id"] != item_id]
    return {"status": "Deleted", "id": item_id}

@app.get("/api/detect-stream")
async def detect_stream(
    filepath: str = "webcam",
    conf_threshold: float = 0.5,
    allowed_classes: str = '["person", "car", "dog", "bicycle"]',
    show_boxes: bool = True,
    show_labels: bool = True,
    show_conf: bool = True,
    show_ids: bool = True,
    draw_trails: bool = True
):
    """
    Generates a continuous Motion JPEG streaming content response pipeline.
    If filepath is "webcam", it opens the live local camera interface (device 0).
    """
    try:
        classes = json.loads(allowed_classes)
    except Exception:
        classes = ["person", "car", "dog", "bicycle"]

    config = {
        "conf_threshold": conf_threshold,
        "allowed_classes": classes,
        "show_boxes": show_boxes,
        "show_labels": show_labels,
        "show_conf": show_conf,
        "show_ids": show_ids,
        "draw_trails": draw_trails,
        "box_color": (0, 255, 100)
    }

    def frame_generator():
        # If the frontend passes "webcam", open the local camera hardware (device 0)
        if filepath == "webcam":
            cap = cv2.VideoCapture(0)
        else:
            cap = cv2.VideoCapture(filepath)
            
        while cap.isOpened():
            success, frame = cap.read()
            if not success:
                break
                
            # Execute inference tracking routines
            annotated_frame, logs, stats = pipeline.process_frame(frame, config)
            
            # Encode processing output to bytes array format
            _, jpeg_buffer = cv2.imencode('.jpg', annotated_frame)
            frame_bytes = jpeg_buffer.tobytes()
            
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
                   
        cap.release()

    return StreamingResponse(frame_generator(), media_type="multipart/x-mixed-replace; boundary=frame")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)