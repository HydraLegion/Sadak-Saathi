"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/authService";
import MainLayout from "@/components/layout/MainLayout";

export default function Login(){

  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");

  const handleLogin = async (e:any)=>{

    e.preventDefault();

    try{

      const role = await loginUser(email,password);

      if(role === "citizen"){
        router.push("/user-dashboard");
      }else{
        router.push("/admin-dashboard");
      }

    }catch{
      setError("Invalid email or password");
    }

  }

  return(
    <MainLayout tickerMessage="Login to access Sadak Saathi dashboard">

      <section className="max-w-md mx-auto bg-white border rounded p-6">

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2"
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border px-3 py-2"
            onChange={(e)=>setPassword(e.target.value)}
          />

          {error && <p className="text-red-600">{error}</p>}

          <button className="w-full bg-blue-700 text-white py-2 rounded">
            Login
          </button>

        </form>

      </section>

    </MainLayout>
  )
}