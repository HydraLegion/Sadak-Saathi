<<<<<<< HEAD
# Sadak-Saathi
=======
# Sadak Saathi

A full-stack road-safety companion that detects potholes from uploaded videos and visualizes results in a modern web dashboard.

- **Frontend:** Next.js (App Router) + React + TypeScript + Tailwind CSS
- **Maps & charts:** Leaflet / React-Leaflet, Recharts
- **Backend:** Flask + OpenCV + Ultralytics YOLO (pothole detection)
- **Data/Auth (project-configured):** Firebase / Firebase Admin

---

---

## Features

- Upload a road video for analysis
- Backend runs pothole detection and serves an **annotated video stream**
- View processing stats (frames processed / detections)
- Web UI includes user/admin dashboard routes

---

## Project Structure

```text
.
├─ src/                  # Next.js app (frontend)
│  ├─ app/               # Routes (App Router)
│  ├─ components/        # Reusable UI components
│  ├─ hooks/             # React hooks
│  ├─ lib/               # Utilities/helpers
│  └─ styles/            # Global styles
└─ backend/              # Flask app (video processing + detection)
```

Key frontend routes (from `src/app/`):
- `/` (home)
- `/login`
- `/register`
- `/dashboard`
- `/user-dashboard`
- `/admin-dashboard`

---

## Prerequisites

### Frontend
- Node.js 18+ recommended (works with modern Next.js)
- npm (or yarn/pnpm/bun)

### Backend
- Python 3.9+ recommended
- System dependencies for OpenCV may be required depending on OS
- The repo already includes a YOLO model file in `backend/yolov8n.pt`

---

## Setup (Frontend)

```bash
npm install
npm run dev
```

Open: http://localhost:3000

### Frontend Scripts

```bash
npm run dev     # start dev server
npm run build   # production build
npm run start   # run production server
npm run lint    # eslint
```

---

## Setup (Backend)

```bash
cd backend
python -m venv .venv
# activate:
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate

pip install -r requirements.txt
python app.py
```

Backend will run on: http://localhost:5000

### Backend Dependencies (from `backend/requirements.txt`)
- flask, flask-cors
- opencv-python
- ultralytics
- firebase-admin
- gunicorn

---

## Backend API

Base URL: `http://localhost:5000`

### `GET /`
Health check.

**Response:** `Backend running`

### `POST /upload`
Upload a video file (multipart form-data).

- **Field name:** `video`

Example:

```bash
curl -X POST http://localhost:5000/upload \
  -F "video=@/path/to/input.mp4"
```

**Response (example):**
```json
{
  "processedVideoURL": "http://localhost:5000/video_feed"
}
```

### `GET /video_feed`
MJPEG stream of frames with potholes annotated.

Open in browser:
- http://localhost:5000/video_feed

### `GET /detection_count`
Returns processing stats.

**Response (example):**
```json
{
  "frames": 120,
  "detections": 34
}
```

---

## Environment / Configuration Notes

This project uses Firebase (client SDK + admin SDK). You may need to add your own Firebase configuration / service credentials depending on how you deploy and run the backend.

If you plan to deploy:
- Keep secrets out of git (use environment variables)
- Review `firestore.rules` and `firestore.indexes.json` before production use

---

## Deployment

### Frontend
- Easiest: deploy the Next.js app on Vercel.

### Backend
- Can be hosted on any platform that supports Python + OpenCV.
- `gunicorn` is included for production serving.

---

## Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch
3. Open a PR with a clear description and screenshots where relevant

---

## License

No license file is currently included.  
If you want others to reuse/modify this project, add a `LICENSE` (e.g., MIT, Apache-2.0, GPL-3.0).
>>>>>>> 9988140 (Go)
