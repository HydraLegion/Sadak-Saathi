import cv2
from detector import detect_potholes
from utils.severity import calculate_severity
from gps_matcher import match_gps


def process_video(video_path, gps_data, db):

    cap = cv2.VideoCapture(video_path)

    frame_count = 0
    detections = []

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        frame_count += 1

        # analyze every 5th frame
        if frame_count % 5 != 0:
            continue

        potholes = detect_potholes(frame)

        for p in potholes:

            gps = match_gps(frame_count, gps_data)

            severity = calculate_severity(p["bbox"])

            data = {
                "latitude": gps["latitude"],
                "longitude": gps["longitude"],
                "severity": severity,
                "confidence": p["confidence"]
            }

            db.collection("potholes").add(data)

            detections.append(data)

    cap.release()

    return detections, frame_count