"use client"

import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { Inbox, PlusSquare } from "lucide-react";
import Button from "@/components/Button";
import toast from "react-hot-toast";
import React from "react";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore, storage } from "@/lib/firebase";
import { ref, uploadBytes } from "firebase/storage";
import { Timestamp, addDoc, collection, doc, query, updateDoc, where } from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { Campaign } from "@/lib/definitions";
import Image from "next/image";
import clsx from "clsx";

export default function Brand() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user] = useAuthState(auth);
  const [brands] = useCollection(query(collection(firestore, "brands"), where("email", "==", user!.email)));

  const [uploadingForm, setUploadingForm] = useState(false);
  const [formData, setFormData] = useState({
    brandId: ""
  });

  const docId = searchParams.get('id')
  if (!docId) {
    router.replace('/main/campaigns')
    toast.error('Document ID not found')
  }

  const [snapshot, loading, error] = useDocument(doc(firestore, "campaigns", docId!))
  
  useEffect(() => {
    const data = snapshot?.data()
    if (data) {
      setFormData(data as Campaign)
    }
  }, [snapshot])

  if (error) {
    toast.error("Document retrieval failed")
    router.push('/main')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  return (
    loading ? 
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <Loader2 className="animate-spin" />
    </div>
    :
    <>
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-4xl font-bold ">1. Choose a brand</h1>
      <Button
        onClickAction={async () => {
          const document = await addDoc(collection(firestore, "brands"), { email: user?.email, timestamp: Timestamp.now() });
          router.push(`/main/brands/edit?id=${document.id}`);
        }}
        text={
          <div className="flex gap-2">
            New Brand <PlusSquare />
          </div>
        }
      />
    </div>
    <form onSubmit={async (e: React.FormEvent) => {
      e.preventDefault();
      setUploadingForm(true)
      try {
        await updateDoc(doc(firestore, "campaigns", docId!), formData as Campaign);
        router.push(`/main/campaigns/edit/size?id=${docId}`);
      } catch (error) {
        toast.error("Campaign not saved!")
      } finally {
        setUploadingForm(false)
      }
    }}>
      <div className="flex gap-10 flex-wrap">
        {brands?.docs.map((brand, index) => {
          const data = brand.data();
          return (
            <>
            <div
              className={clsx(`
                shadow-lg rounded-lg flex-col w-96 hover:cursor-pointer
                p-6 transition ease-in-out duration-300 h-full`,
                formData.brandId == brand.id ? "bg-gray-300" : "hover:bg-gray-100"
              )}
              key={index}
              onClick={() => setFormData(
                prevFormData => {
                  return {
                    ...prevFormData,
                    brandId: brand.id
                  }
                })
              }
            >
              <div className="border-gray-500 border-2 flex justify-center items-center mb-8 border-opacity-30">
                {!data.brandLogo ?
                  <Image
                    src={'/image-loading.png'}
                    alt="Placeholder image"
                    width={500}
                    height={500}
                  />
                  :
                  <img
                    alt="Generated image"
                    className="w-full"
                    src={`https://firebasestorage.googleapis.com/v0/b/rapid-marketing-ai.appspot.com/o/brand-logo%2F${data.brandLogo.split("/")[1]}?alt=media&`}
                  />
                }
              </div>
              <div className="flex gap-4 items-center">
                <p className="text-xl font-bold my-2">{data.brandName}</p>
                <span className="bg-purple-500 text-white rounded-full capitalize font-medium py-1 px-2">
                  {brand.data().brandType}
                </span>
              </div>
              {data.brandDescription}
            </div>
            </>
          )
        })}
      </div>
      <div className="mt-10">
        <Button text={uploadingForm ? <Loader2 className="h-6 w-8 text-white animate-spin" /> : "Save & Continue"} />
      </div>
    </form>
    </>
  );
}