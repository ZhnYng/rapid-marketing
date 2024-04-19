"use client"

import { auth, firestore } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Page() {
  return (
    <div className="flex-col flex w-full h-full justify-center items-center gap-2">
      Redirecting you to /main/campaigns/edit/brand
      <Loader2 className="animate-spin" size={40}/>
    </div>
  )
}