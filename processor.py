import cv2
import numpy as np
import datetime
from ultralytics import YOLO
from deep_sort_realtime.deepsort_tracker import DeepSort

class VisionPipeline:
    def __init__(self, model_name="yolov8n.pt"):
        """
        Initializes the vision pipeline with YOLOv8 object detector
        and DeepSORT real-time multi-object tracker.
        """
        # Load the Ultralytics YOLOv8 model weights
        self.model = YOLO(model_name)
        
        # Initialize DeepSORT Tracker
        self.tracker = DeepSort(
            max_age=30,
            n_init=3,
            nms_max_overlap=1.0,
            max_cosine_distance=0.2
        )
        
        # Store tracking center points to draw movement trails: {track_id: [(cx, cy), ...]}
        self.motion_trails = {}
        
        # Global cache to share real-time tracking metrics with telemetry API endpoints
        self.latest_telemetry = {
            "active_tracks": 0,
            "cumulative_count": 0,
            "logs": [],
            "class_counts": {},
            "fps": 0.0,
            "latency": 0
        }
        self.seen_track_ids = set()
        
    def process_frame(self, frame: np.ndarray, config: dict) -> tuple[np.ndarray, list, dict]:
        """
        Processes a single frame from video or camera feed:
        1. Runs YOLOv8 object detection.
        2. Filters bounding boxes by user-configured classes and confidence threshold.
        3. Feeds predictions to DeepSORT tracker.
        4. Draws bounding boxes, tracking trails, and overlay statistics on the frame.
        5. Caches real-time tracking metrics for dynamic telemetry API lookups.
        """
        if frame is None:
            return frame, [], {}

        # Run inference using the YOLO model
        timer = cv2.getTickCount()
        results = self.model(frame, verbose=False)[0]
        detections = []
        
        # 1. Parse raw YOLO detections and convert to DeepSORT format: [([left, top, w, h], confidence, class_name)]
        for box in results.boxes:
            conf = float(box.conf[0])
            # Filter detections below user configuration confidence threshold
            if conf < config.get("conf_threshold", 0.5):
                continue
                
            cls_id = int(box.cls[0])
            class_name = self.model.names[cls_id]
            
            # Filter class names based on user interface checkbox options
            if class_name not in config.get("allowed_classes", []):
                continue
                
            # Convert coordinate dimensions
            xyxy = box.xyxy[0].cpu().numpy()
            x1, y1, x2, y2 = int(xyxy[0]), int(xyxy[1]), int(xyxy[2]), int(xyxy[3])
            bbox_w, bbox_h = x2 - x1, y2 - y1
            
            detections.append(([x1, y1, bbox_w, bbox_h], conf, class_name))
            
        # 2. Update Multi-Object Tracker with processed frame bounding boxes
        tracks = self.tracker.update_tracks(detections, frame=frame)
        active_logs = []
        class_counts = {}
        
        for track in tracks:
            # Skip non-confirmed tracker targets (reduces false tracking flickering)
            if not track.is_confirmed():
                continue
                
            track_id = track.track_id
            class_label = track.get_det_class()
            
            # Convert internal coordinates back to left-top-right-bottom boundary boxes
            ltrb = track.to_ltrb() 
            x1, y1, x2, y2 = map(int, ltrb)
            
            # Increment class stats counter values for dynamic telemetry UI update
            class_counts[class_label] = class_counts.get(class_label, 0) + 1
            self.seen_track_ids.add(track_id)
            
            # Format time-stamp string
            current_time = datetime.datetime.now().strftime("%H:%M:%S")
            
            # Log tracked target variables for the Event Registry Table
            active_logs.append({
                "time": current_time,
                "id": str(track_id),
                "class": class_label,
                "conf": f"{int((track.confirmed_det_score or 0.85) * 100)}%",
                "status": "Active"
            })
            
            # 3. Draw Bounding Boxes and Labels on Frame
            if config.get("show_boxes", True):
                # Setup drawing properties
                color = config.get("box_color", (100, 255, 0)) # Emerald green default (BGR format)
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                
                # Format label tags with IDs and Confidence
                label_text = f"{class_label}"
                if config.get("show_ids", True):
                    label_text = f"ID:{track_id} " + label_text
                if config.get("show_conf", True) and track.confirmed_det_score:
                    label_text += f" {int(track.confirmed_det_score * 100)}%"
                    
                if config.get("show_labels", True):
                    # Write labels above bounding boxes
                    cv2.putText(frame, label_text, (x1, max(y1 - 8, 15)),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
                    
            # 4. Handle Motion Trails / Center Trails Logic
            if config.get("draw_trails", True):
                cx, cy = int((x1 + x2) / 2), int((y1 + y2) / 2)
                if track_id not in self.motion_trails:
                    self.motion_trails[track_id] = []
                self.motion_trails[track_id].append((cx, cy))
                
                # Keep trails optimized to prevent RAM latency buildup (max 15 points)
                if len(self.motion_trails[track_id]) > 15:
                    self.motion_trails[track_id].pop(0)
                    
                # Draw history line strips connecting centroids
                for i in range(1, len(self.motion_trails[track_id])):
                    cv2.line(frame, self.motion_trails[track_id][i-1], 
                             self.motion_trails[track_id][i], (0, 165, 255), 2) # Cyan/orange dynamic trail lines
        
        # Calculate latency in ms
        latency = int((cv2.getTickCount() - timer) / cv2.getTickFrequency() * 1000)
        
        # 5. Save latest telemetry values to pipeline cache state
        self.latest_telemetry = {
            "active_tracks": len(active_logs),
            "cumulative_count": len(self.seen_track_ids),
            "logs": active_logs,
            "class_counts": class_counts,
            "latency": latency
        }
                    
        return frame, active_logs, class_counts