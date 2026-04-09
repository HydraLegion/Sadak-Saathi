import { db } from "@/lib/firebaseClient";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  const snapshot = await getDocs(collection(db, "potholes"));

  const potholes = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json(potholes);
}

export async function POST(req: Request) {
  const body = await req.json();

  const docRef = await addDoc(collection(db, "potholes"), {
    latitude: body.latitude,
    longitude: body.longitude,
    severity: body.severity,
    timestamp: new Date(),
  });

  return NextResponse.json({ id: docRef.id });
}