"use client"

import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import Button from "@/components/Button";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSearchParams } from "next/navigation";
import { useDocument } from "react-firebase-hooks/firestore";
import { auth, firestore, storage } from "@/lib/firebase";
import { Campaign } from "@/lib/definitions";
import { ref, uploadBytes } from "firebase/storage";
import { generateImage, generateImagePrompt } from "@/actions/generation";
import { AuthenticationError } from "openai";

export default function Images() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const searchParams = useSearchParams();
  const [uploading, setUploading] = useState(false);
  const [uploadingForm, setUploadingForm] = useState(false);

  const [formData, setFormData] = useState({
    exampleImage: "",
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

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      // larger than 10mb
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large");
        return;
      }

      try {
        setUploading(true);
        mutate(file, {
          onSuccess: ({ path }) => {
            setFormData({ ...formData, exampleImage: path })
            toast.success(`File uploaded!`);
          },
          onError: (err) => {
            console.error(err);
            toast.error("Error uploading file");
          },
        });
      } catch (error) {
        console.error(error);
        toast.error("Error uploading file");
      } finally {
        setUploading(false);
      }
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (file: File) => {
      const uploadFilePath = ref(storage, 'images/' + Date.now().toString() + '-' + file.name)
      const snapshot = await uploadBytes(uploadFilePath, file);
      return { 
        path: snapshot.metadata.fullPath, 
        name: snapshot.metadata.name, 
        timeCreated: snapshot.metadata.timeCreated 
      };
    },
  });

  return (
    loading ? 
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="animate-spin" />
      </div>
    :
      <form onSubmit={async (e: React.FormEvent) => {
        e.preventDefault();
        setUploadingForm(true)
        try {
          await updateDoc(doc(firestore, "campaigns", docId!), formData as Campaign);
          const response = await generateImage(formData as Campaign, docId!, user!.email!);
          if(response?.error) {
            toast.error(response.error)
          } else {
            router.push('/main/campaigns')
          }
        } catch (error) {
          console.error(error)
          toast.error(`Campaign not saved!`)
        } finally {
          setUploadingForm(false)
        }
      }}>
        <div className="relative mb-4">
          {uploadingForm &&
            <div className="bg-black w-full h-full absolute opacity-90 p-12 flex justify-center items-center gap-2 rounded-md">
              <Loader2 className="text-white animate-spin" />
              <h3 className="text-white text-lg font-medium animate-pulse">Generating image...</h3>
            </div>
          }
          <h1 className="text-4xl font-bold mb-8">4. Image examples for us</h1>
          <label htmlFor="brandLogo" className="text-gray-800 font-semibold">
            Example
          </label>
          <div className="flex gap-4">
            <div
              {...getRootProps({
                className:
                  "border-dashed border-2 flex-[1] mt-2 rounded-xl cursor-pointer bg-gray-50 p-8 flex justify-center items-center flex-col",
              })}
            >
              <input {...getInputProps()} />
              {uploading || isPending ? (
                <>
                  {/* loading state */}
                  <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
                  <p className="mt-2 text-sm text-slate-400">
                    Uploading to the cloud
                  </p>
                </>
              ) : (
                <>
                  <Inbox className="w-10 h-10 text-purple-500" />
                  <p className="mt-2 text-sm text-slate-400">Drop Example Here</p>
                </>
              )}
            </div>
            {
              formData.exampleImage &&
              <div className="flex-[1]">
                <img
                  src={`https://firebasestorage.googleapis.com/v0/b/rapid-marketing-ai.appspot.com/o/images%2F${formData.exampleImage.split("/")[1]
                    }?alt=media&`}
                  alt="Example image"
                />
              </div>
            }
          </div>
        </div>
        <Button text={uploadingForm ? <Loader2 className="h-6 w-8 text-white animate-spin" /> : "Submit"} />
      </form>
  );
}
