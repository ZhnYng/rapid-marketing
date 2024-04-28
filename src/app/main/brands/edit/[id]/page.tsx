import React from "react";
import { auth, firestore, storage } from "@/lib/firebase";
import { doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { Brand, Campaign } from "@/lib/definitions";
import EditBrand from "@/ui/brand/edit-brand";

export default async function Page({
  params
}: {
  params: {
    id: string
  }
}) {
  const brand = await getDoc(doc(firestore, "brands", params.id));
  return <EditBrand brandData={brand.data() as Brand} brandId={params.id} />
}