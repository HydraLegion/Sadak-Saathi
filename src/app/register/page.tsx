"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/authService";
import MainLayout from "@/components/layout/MainLayout";

export default function Register() {

  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState<"citizen"|"officer">("citizen");
  const [error,setError] = useState("");

  const handleRegister = async (e:React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    setError("");

    try {

      await registerUser(email,password,role);

      router.push("/login");

    } catch(err:any) {

      console.error(err);

      if(err.code === "auth/email-already-in-use"){
        setError("Email already exists");
      }else if(err.code === "auth/weak-password"){
        setError("Password must be at least 6 characters");
      }else if(err.code === "auth/configuration-not-found"){
        setError("Firebase authentication is not configured. Enable Email/Password in Firebase Console.");
      }else if(err.code === "auth/invalid-api-key"){
        setError("Invalid Firebase API key. Check NEXT_PUBLIC_FIREBASE_API_KEY in .env.local.");
      }else if(err.code === "auth/network-request-failed"){
        setError("Network request failed. Check internet and Firebase project settings.");
      }else if(err.code === "permission-denied"){
        setError("Firestore permission denied. Update Firestore rules for development.");
      }else{
        setError("Account could not be initialized. Please try again.");
      }

    }

  };

  return (
    <MainLayout tickerMessage="Citizen registration is open for pothole reporting and tracking.">

      <section className="max-w-md mx-auto bg-white border border-gray-200 rounded shadow-sm p-6">

        <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <select
            className="w-full border px-3 py-2 rounded"
            value={role}
            onChange={(e)=>setRole(e.target.value as "citizen"|"officer")}
          >
            <option value="citizen">Citizen</option>
            <option value="officer">Officer</option>
          </select>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded font-bold">
            Register
          </button>

        </form>

      </section>

    </MainLayout>
  );
}