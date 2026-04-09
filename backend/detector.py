import cv2
import numpy as np
from ultralytics import YOLO
import time

# ── Load model once at startup ────────────────────────────────────────────────
model = YOLO("models/best.pt")

# ── Tunable constants ─────────────────────────────────────────────────────────
CONF_THRESHOLD     = 0.45   # min confidence to count a detection
IOU_THRESHOLD      = 0.30   # IoU overlap to consider same pothole
MAX_TRACK_AGE_SEC  = 3.0    # seconds before a track is considered stale
                             # (was 40 — meaning potholes lived for 40 s, causing overcounting)
PROCESS_EVERY_N    = 2       # only run YOLO on every Nth frame (reduces duplicate counts)

# ── Module-level state ────────────────────────────────────────────────────────
tracked_potholes = []   # list of TrackedPothole
pothole_counter  = 0    # unique potholes seen so far
frame_index      = 0    # global frame counter for skipping


class TrackedPothole:
    def __init__(self, bbox, confidence):
        self.bbox       = bbox          # [x1,y1,x2,y2]
        self.center     = _center(bbox)
        self.confidence = confidence
        self.last_seen  = time.time()


# ── Reset — MUST be called on every new video upload ─────────────────────────
def reset_detector():
    global tracked_potholes, pothole_counter, frame_index
    tracked_potholes = []
    pothole_counter  = 0
    frame_index      = 0
    print("[detector] ✅ Reset complete — counter=0, tracks cleared")


# ── Geometry helpers ──────────────────────────────────────────────────────────
def _center(bbox):
    x1, y1, x2, y2 = bbox
    return (int((x1 + x2) / 2), int((y1 + y2) / 2))


def _iou(a, b):
    """Intersection-over-Union for two [x1,y1,x2,y2] boxes."""
    ax1, ay1, ax2, ay2 = a
    bx1, by1, bx2, by2 = b

    ix1 = max(ax1, bx1)
    iy1 = max(ay1, by1)
    ix2 = min(ax2, bx2)
    iy2 = min(ay2, by2)

    inter_w = max(0.0, ix2 - ix1)
    inter_h = max(0.0, iy2 - iy1)
    inter   = inter_w * inter_h

    area_a = max(1e-6, (ax2 - ax1) * (ay2 - ay1))
    area_b = max(1e-6, (bx2 - bx1) * (by2 - by1))
    union  = area_a + area_b - inter

    return inter / union if union > 0 else 0.0


# ── Track management ──────────────────────────────────────────────────────────
def _cleanup_stale_tracks():
    global tracked_potholes
    now = time.time()
    tracked_potholes = [
        t for t in tracked_potholes
        if now - t.last_seen < MAX_TRACK_AGE_SEC
    ]


def _match_existing(bbox):
    """Return the existing track that best overlaps this bbox, or None."""
    best_track = None
    best_iou   = IOU_THRESHOLD  # must beat this threshold

    for track in tracked_potholes:
        iou = _iou(bbox, track.bbox)
        if iou > best_iou:
            best_iou   = iou
            best_track = track

    return best_track


# ── Main detection function ───────────────────────────────────────────────────
def detect_potholes_in_frame(frame):
    global pothole_counter, frame_index

    frame_index += 1

    # Skip frames to avoid counting the same pothole on every frame
    if frame_index % PROCESS_EVERY_N != 0:
        # Return empty — annotate_frame will still draw the counter
        return []

    _cleanup_stale_tracks()

    results    = model(frame, conf=CONF_THRESHOLD, verbose=False)
    detections = []

    for r in results:
        if r.boxes is None:
            continue

        boxes = r.boxes.xyxy.cpu().numpy()
        confs = r.boxes.conf.cpu().numpy()

        for i in range(len(boxes)):
            if confs[i] < CONF_THRESHOLD:
                continue

            x1, y1, x2, y2 = boxes[i]
            bbox = [float(x1), float(y1), float(x2), float(y2)]

            existing = _match_existing(bbox)

            if existing:
                # Update the track — do NOT increment counter
                existing.bbox       = bbox
                existing.center     = _center(bbox)
                existing.confidence = float(confs[i])
                existing.last_seen  = time.time()
                detections.append({
                    "bbox": bbox, "confidence": float(confs[i]), "new": False
                })
            else:
                # Genuinely new pothole
                tracked_potholes.append(TrackedPothole(bbox, float(confs[i])))
                pothole_counter += 1
                detections.append({
                    "bbox": bbox, "confidence": float(confs[i]), "new": True
                })

    return detections


# ── Annotation ────────────────────────────────────────────────────────────────
def annotate_frame(frame, potholes):
    img = frame.copy()

    for p in potholes:
        x1, y1, x2, y2 = [int(v) for v in p["bbox"]]
        conf  = p["confidence"]

        # Green = newly discovered  |  Red = already tracked
        color = (0, 200, 0) if p["new"] else (0, 0, 220)

        cv2.rectangle(img, (x1, y1), (x2, y2), color, 2)

        label = f"{'NEW ' if p['new'] else ''}Pothole {conf:.2f}"
        label_y = max(y1 - 10, 15)
        cv2.putText(
            img, label,
            (x1, label_y),
            cv2.FONT_HERSHEY_SIMPLEX, 0.55, color, 2
        )

    # Counter overlay — always drawn so it stays visible on skipped frames too
    cv2.putText(
        img,
        f"Unique Potholes: {pothole_counter}",
        (20, 45),
        cv2.FONT_HERSHEY_SIMPLEX, 1.1, (0, 230, 230), 3,
        cv2.LINE_AA
    )

    return img


def get_total_potholes():
    return pothole_counter