import { auth, db } from "./firebaseClient";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";

export async function registerUser(email: string, password: string, role: "citizen" | "officer") {

  console.log("[register] before auth creation", { email, role });

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  console.log("[register] after auth creation", { uid: userCredential.user.uid, email: userCredential.user.email });

  const uid = userCredential.user.uid;

  console.log("User created:", uid);

  console.log("[register] before firestore write", { collection: "users", uid });

  await setDoc(doc(db, "users", uid), {
    email,
    role,
    createdAt: new Date()
  });

  console.log("[register] after firestore write", { collection: "users", uid });

  return role;
}

export async function loginUser(email: string, password: string) {

  console.log("[login] before auth sign-in", { email });

  const userCredential = await signInWithEmailAndPassword(auth, email, password);

  console.log("[login] after auth sign-in", { uid: userCredential.user.uid });

  const uid = userCredential.user.uid;

  console.log("[login] before firestore read", { collection: "users", uid });

  const userDoc = await getDoc(doc(db, "users", uid));

  console.log("[login] after firestore read", { exists: userDoc.exists(), uid });

  if (!userDoc.exists()) {
    throw new Error("User role missing");
  }

  return userDoc.data().role;
}