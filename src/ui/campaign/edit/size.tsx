"use client"

import { Image, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { useDocument } from "react-firebase-hooks/firestore";
import { DocumentData, QueryDocumentSnapshot, doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import toast from "react-hot-toast";
import { Campaign } from "@/lib/definitions";

export default function Size({
  campaignId,
  campaignData,
}: {
  campaignId: string;
  campaignData: Campaign;
}) {
  const router = useRouter();
  const [uploadingForm, setUploadingForm] = useState(false);

  const [formData, setFormData] = useState({
    size: ""
  });

  useEffect(() => {
    setFormData(campaignData)
  }, [campaignData])

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">2. Choose your preferred size</h1>
      <form onSubmit={async (e: React.FormEvent) => {
        e.preventDefault();
        setUploadingForm(true)
        
        try {
          if (!formData.size) {
            toast.error("Choose a size!")
            throw Error("Empty fields")
          }

          await updateDoc(doc(firestore, "campaigns", campaignId), formData);

          router.push(`/main/campaigns/edit/${campaignId}/content`);
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
        <Button text={uploadingForm ? <Loader2 className="h-6 w-8 text-white animate-spin" /> : "Save & Continue"} />
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