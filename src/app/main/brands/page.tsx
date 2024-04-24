"use client";

import Button from "@/components/Button";
import { auth, firestore } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { EditIcon, FolderPen, PlusSquare, Presentation, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import toast from "react-hot-toast";
''
export default function Brands() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [brands, loading, error] = useCollection(query(collection(firestore, "brands"), where("email", "==", user!.email)));

  return (
    <div className="w-full p-6 pb-20">
      <div className="sticky flex w-full justify-between">
        <div>
          <div className="text-2xl flex mb-2 rounded-xl font-bold items-center">
            <FolderPen />
            <h2 className="ms-2">Brands</h2>
          </div>
          <h1 className="text-3xl mb-8 mt-4">All Brands</h1>
        </div>
        <div className="top-10 right-10">
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
      </div>
      {brands ?
        <div className="flex justify-center gap-8 w-full h-full flex-wrap">
          {brands.docs.map((brand, index) => (
            <div
              className="shadow-lg rounded-lg flex-col max-w-96
                p-6 hover:bg-gray-100 transition ease-in-out duration-300 h-full"
              key={index}
            >
              <div className="border-gray-500 border-2 flex justify-center items-center mb-8 border-opacity-30">
                {!brand.data().brandLogo ?
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
                    src={`https://firebasestorage.googleapis.com/v0/b/rapid-marketing-ai.appspot.com/o/brand-logo%2F${brand.data().brandLogo.split("/")[1]}?alt=media&`}
                  />
                }
              </div>
              <div className="flex gap-4 items-center">
                <p className="text-xl font-bold my-2">{brand.data().brandName}</p>
                <span className="bg-purple-500 text-white rounded-full capitalize font-medium py-1 px-2">
                  {brand.data().brandType}
                </span>
              </div>
              {brand.data().brandDescription}
              <div className="flex gap-3 justify-end mt-8">
                <Button onClickAction={() => router.push(`/main/brands/edit?id=${brand.id}`)} text={<EditIcon />} />
                <Button
                  onClickAction={() => {
                    try {
                      deleteDoc(doc(firestore, "brands", brand.id))
                    } catch (error) {
                      console.error(error)
                      toast.error('Delete campaign failed!')
                    }
                  }}
                  text={<Trash2 />}
                />
              </div>
            </div>
          ))}
        </div>
        :
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          No brands found. Create one!
        </div>
      }
    </div>
  )
}