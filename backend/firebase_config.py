import os
import firebase_admin
from firebase_admin import credentials, firestore

_KEY_PATH = os.path.join(os.path.dirname(__file__), "firebase-key.json")

db = None

if os.path.exists(_KEY_PATH):
	cred = credentials.Certificate(_KEY_PATH)

	if not firebase_admin._apps:
		firebase_admin.initialize_app(cred)

	db = firestore.client()
else:
	print(f"[firebase_config] Firebase key not found at {_KEY_PATH}. Continuing without Firestore.")