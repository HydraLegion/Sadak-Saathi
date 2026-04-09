from flask import Flask, Response, request, jsonify
from flask_cors import CORS
import cv2
import os
import time
import logging

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

log = logging.getLogger('werkzeug')
class MutePollingFilter(logging.Filter):
    def filter(self, record):
        return '/detection_count' not in record.getMessage()
log.addFilter(MutePollingFilter())

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
VIDEO_PATH = os.path.join(UPLOAD_FOLDER, "input.mp4")

try:
    from detector import detect_potholes_in_frame, annotate_frame
    ML_READY = True
except ImportError as e:
    print(f"\n[WARNING] Could not load detector.py. Stream will play without AI boxes. Error: {e}\n")
    ML_READY = False

state = {
    "frames": 0,
    "detections_count": 0
}

@app.route("/")
def home():
    return "Backend running"

@app.route("/upload", methods=["POST", "OPTIONS"])
def upload_video():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    if "video" not in request.files:
        return jsonify({"error": "No video"}), 400

    file = request.files["video"]
    file.save(VIDEO_PATH)
    
    state["frames"] = 0
    state["detections_count"] = 0
    
    print(f"\n>>> Video successfully saved to: {VIDEO_PATH}")
    print(">>> Ready for processing...\n")

    return jsonify({
        "processedVideoURL": "http://localhost:5000/video_feed",
        "status": "success"
    })

def generate_frames():
    print(">>> Initializing OpenCV Stream...")
    cap = cv2.VideoCapture(VIDEO_PATH)
    
    if not cap.isOpened():
        print(f"[ERROR] OpenCV could not open the video file at {VIDEO_PATH}")
        return

    try:
        while cap.isOpened():
            success, frame = cap.read()
            if not success:
                print(">>> End of video stream reached.")
                break

            state["frames"] += 1
            annotated = frame 

            if ML_READY:
                try:
                    potholes = detect_potholes_in_frame(frame)
                    state["detections_count"] += len(potholes)
                    annotated = annotate_frame(frame, potholes)
                except Exception as ml_err:
                    print(f"[ML ERROR] detector.py crashed on frame {state['frames']}: {ml_err}")
            
            ret, buffer = cv2.imencode(".jpg", annotated)
            if not ret:
                print(f"[ERROR] Failed to encode frame {state['frames']}")
                continue
                
            frame_bytes = buffer.tobytes()

            time.sleep(0.03) 

            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n" +
                frame_bytes +
                b"\r\n"
            )
    except Exception as e:
        print(f"\n[FATAL ERROR] Stream crashed: {e}\n")
    finally:
        cap.release()
        print(">>> Stream closed and resources released.\n")

@app.route("/video_feed")
def video_feed():
    return Response(
        generate_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame"
    )

@app.route("/detection_count")
def detection_count():
    return jsonify({
        "frames": state["frames"],
        "detections": state["detections_count"]
    })

if __name__ == "__main__":
    print("\n" + "="*50)
    print("SADAK-SAATHI FLASK BACKEND STARTED")
    print("="*50 + "\n")
    app.run(port=5000, debug=False, threaded=True)
