"use client"

import { Image, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import toast from "react-hot-toast";
import { Campaign } from "@/lib/definitions";

export default function Size() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [uploadingForm, setUploadingForm] = useState(false);

  const [formData, setFormData] = useState({
    size: ""
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

  return (
    loading ? 
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <Loader2 className="animate-spin" />
    </div>
    :
    <>
      <h1 className="text-4xl font-bold mb-8">2. Edit your preferred size</h1>
      <form onSubmit={async (e: React.FormEvent) => {
        e.preventDefault();
        setUploadingForm(true)
        try {
          await updateDoc(doc(firestore, "campaigns", docId!), formData as Campaign);
          router.push(`/main/campaigns/edit/content?id=${docId}`);
        } catch (error) {
          toast.error("Campaign not saved!")
        } finally {
          setUploadingForm(false)
        }
      }}>
        <div className="flex flex-wrap gap-8 pb-4 my-6">
          <CampaignSizeBtn
            aspectRatio={"(1080x1080)"}
            condition={formData.size === "post"}
            onClickAction={() => setFormData(
              prevFormData => {
                return {
                  ...prevFormData,
                  size: 'post'
                }
              })
            }
            text="Post"
            style={{ "width": 150, "height": 150 }}
          />
          <CampaignSizeBtn
            aspectRatio={"(1200x628)"}
            condition={formData.size === "landscape"}
            onClickAction={() => setFormData(
              prevFormData => {
                return {
                  ...prevFormData,
                  size: 'landscape'
                }
              })
            }
            text="Landscape"
            style={{ "width": 170, "height": 100 }}
          />
          <CampaignSizeBtn
            aspectRatio={"(1080x1920)"}
            condition={formData.size === "vertical"}
            onClickAction={() => setFormData(
              prevFormData => {
                return {
                  ...prevFormData,
                  size: 'vertical'
                }
              })
            }
            text="Vertical"
            style={{ "width": 100, "height": 150 }}
          />
        </div>
        <Button onClickAction={null} text={uploadingForm ? <Loader2 className="h-6 w-8 text-white animate-spin" /> : "Save & Continue"} />
      </form>
    </>
  );
}

function CampaignSizeBtn(
  { onClickAction, condition, text, aspectRatio, style }:
    {
      onClickAction: React.MouseEventHandler<HTMLButtonElement> | undefined;
      condition: boolean, text: string, aspectRatio: string, style: React.CSSProperties | undefined
    }
) {
  return (
    <button
      type="button"
      onClick={onClickAction}
      className={`border-2 font-medium rounded-md p-2 self-start transition ease-in-out hover:-translate-y-1 hover:scale-105 duration-300 ${condition
        ? "text-purple-500 border-purple-500"
        : "border-gray-800"
        }`}
    >
      <h3 className="font-bold">{text}</h3>
      <div
        className={`text-white m-2 rounded-md
        flex justify-center items-center ${condition ? "bg-purple-500" : "bg-gray-800"}`}
        style={style}
      >
        {<Image size={50} />}
      </div>
      <p className="text-sm">{aspectRatio}</p>
    </button>
  );
}