"use client";

import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useAuth(){

  const router = useRouter();

  useEffect(()=>{

    const unsub = onAuthStateChanged(auth,(user)=>{

      if(!user){
        router.push("/login");
      }

    });

    return ()=>unsub();

  },[]);

}