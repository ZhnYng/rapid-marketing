"use client"

import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { Inbox } from "lucide-react";
import Button from "@/components/Button";
import toast from "react-hot-toast";
import React from "react";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore, storage } from "@/lib/firebase";
import { ref, uploadBytes } from "firebase/storage";
import { doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { Brand, Campaign } from "@/lib/definitions";

export default function EditBrand({
  brandId,
  brandData
}: {
  brandId: string
  brandData: Brand
}) {
  const router = useRouter();

  const [uploadingForm, setUploadingForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    brandName: "",
    brandType: "",
    brandDescription: "",
    brandLogo: "",
  });

  useEffect(() => {
    setFormData(brandData)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
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
            setFormData({ ...formData, brandLogo: path })
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
      const uploadFilePath = ref(storage, 'brand-logo/' + Date.now().toString() + '-' + file.name)
      const snapshot = await uploadBytes(uploadFilePath, file);
      return { 
        path: snapshot.metadata.fullPath, 
        name: snapshot.metadata.name, 
        timeCreated: snapshot.metadata.timeCreated 
      };
    },
  });

  return (
    <form onSubmit={async (e: React.FormEvent) => {
      e.preventDefault();
      setUploadingForm(true);

      const isFormDataEmpty = Object.values(formData).some(value => value === "");

      try {
        if(isFormDataEmpty) {
          toast.error("Fill in all fields!")
          throw Error("Empty fields")
        }

        await updateDoc(doc(firestore, "brands", brandId), formData);

        router.push(`/main/brands`);
      } catch (error) {
        toast.error("Campaign not saved!")
      } finally {
        setUploadingForm(false)
      }
    }}>
      <h1 className="text-4xl font-bold mb-8">1. Describe your brand</h1>
      <div className="mb-4" id="brandName">
        <label
          htmlFor="brandName"
          className="block text-gray-800 font-semibold mb-2"
        >
          Brand Name
        </label>
        <input
          type="text"
          id="brandName"
          name="brandName"
          placeholder="RapidMarketing"
          value={formData.brandName}
          onChange={handleChange}
          className="w-full border-2 rounded-md p-2 focus:outline-none focus:border-black"
          required
        />
      </div>
      <div className="mb-4" id="brandName">
        <label
          htmlFor="brandType"
          className="block text-gray-800 font-semibold mb-2"
        >
          Industry
        </label>
        <select
          id="brandType"
          name="brandType"
          value={formData.brandType}
          onChange={handleChange}
          className="w-full border-2 rounded-md p-2 focus:outline-none focus:border-black"
          required
        >
          <option value="">Select Brand Type</option>
          <option value="realEstate">Real Estate</option>
          <option value="technology">Technology</option>
          <option value="retail">Retail</option>
          <option value="automotive">Automotive</option>
          <option value="fashion">Fashion</option>
          <option value="healthcare">Healthcare</option>
          <option value="foodAndBeverage">Food & Beverage</option>
          <option value="finance">Finance</option>
          <option value="entertainment">Entertainment</option>
          <option value="education">Education</option>
          <option value="hospitality">Hospitality</option>
          <option value="sports">Sports</option>
        </select>
      </div>
      <div className="mb-4" id="brandDescription">
        <label
          htmlFor="brandDescription"
          className="block text-gray-800 font-semibold mb-2"
        >
          Brand Description
        </label>
        <textarea
          id="brandDescription"
          name="brandDescription"
          value={formData.brandDescription}
          placeholder="RapidMarketing produces marketing materials rapidly with the help of generative AI."
          onChange={handleChange}
          className="w-full border-2 rounded-md p-2 focus:outline-none focus:border-black"
          rows={4}
          required
        ></textarea>
      </div>
      <div className="relative mb-4">
        <label htmlFor="brandLogo" className="text-gray-800 font-semibold">
          Brand Logo
        </label>
        <div className="flex gap-4">
          <div
            {...getRootProps({
              className: "border-dashed border-2 border-gray-400 flex-[1] mt-4 rounded-xl cursor-pointer bg-gray-50 p-8 flex justify-center items-center flex-col",
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
                <p className="mt-2 text-sm text-slate-400">Drop Logo Here</p>
              </>
            )}
          </div>
          {
            formData.brandLogo &&
            <div className="flex-[1]">
              <img
                src={`https://firebasestorage.googleapis.com/v0/b/rapid-marketing-ai.appspot.com/o/brand-logo%2F${formData.brandLogo.split("/")[1]
                  }?alt=media&`}
              />
            </div>
          }
        </div>
      </div>
      <Button text={uploadingForm ? <Loader2 className="h-6 w-8 text-white animate-spin" /> : "Submit"} />
    </form>
  );
}