"use client"

import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/lib/firebase";
import toast from "react-hot-toast";
import { Campaign } from "@/lib/definitions";
import { useDocument } from "react-firebase-hooks/firestore";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

export default function Content({
  campaignId,
  campaignData,
}: {
  campaignId: string;
  campaignData: Campaign;
}) {
  const router = useRouter();
  const [uploadingForm, setUploadingForm] = useState(false);

  const [formData, setFormData] = useState({
    projectDescription: "",
    targetAudience: "",
    headline: "",
    punchline: "",
    callToAction: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

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

        await updateDoc(doc(firestore, "campaigns", campaignId!), {
          ...campaignData,
          ...formData
        });
        
        router.push(`/main/campaigns/edit/${campaignId}/images`);
      } catch (error) {
        toast.error("Campaign not saved!")
      } finally {
        setUploadingForm(false)
      }
    }}>
      <h1 className="text-4xl font-bold mb-8">3. More product details</h1>
      <div className="mb-4" id="projectDescription">
        <label
          htmlFor="projectDescription"
          className="block text-gray-800 font-semibold mb-2"
        >
          Project Description
        </label>
        <textarea
          id="projectDescription"
          name="projectDescription"
          value={formData.projectDescription}
          placeholder="RapidMarketing produces marketing materials rapidly with the help of generative AI."
          onChange={handleChange}
          className="w-full border-2 rounded-md p-2 focus:outline-none focus:border-black"
          rows={4}
          required
        ></textarea>
      </div>
      <div className="mb-4" id="targetAudience">
        <label
          htmlFor="targetAudience"
          className="block text-gray-800 font-semibold mb-2"
        >
          Target audience
        </label>
        <input
          type="text"
          id="targetAudience"
          name="targetAudience"
          placeholder="RapidMarketing"
          value={formData.targetAudience}
          onChange={handleChange}
          className="w-full border-2 rounded-md p-2 focus:outline-none focus:border-black"
          required
        />
      </div>
      <div className="mb-4" id="headline">
        <label
          htmlFor="headline"
          className="block text-gray-800 font-semibold mb-2"
        >
          Headline
        </label>
        <input
          type="text"
          id="headline"
          name="headline"
          placeholder="RapidMarketing"
          value={formData.headline}
          onChange={handleChange}
          className="w-full border-2 rounded-md p-2 focus:outline-none focus:border-black"
          required
        />
      </div>
      <div className="flex flex-row justify-between gap-8">
        <div className="mb-4 w-full" id="punchline">
          <label
            htmlFor="punchline"
            className="block text-gray-800 font-semibold mb-2"
          >
            Punchline
          </label>
          <input
            type="text"
            id="punchline"
            name="punchline"
            placeholder="RapidMarketing"
            value={formData.punchline}
            onChange={handleChange}
            className="w-full border-2 rounded-md p-2 focus:outline-none focus:border-black"
            required
          />
        </div>
        <div className="mb-4 w-full" id="callToAction">
          <label
            htmlFor="callToAction"
            className="block text-gray-800 font-semibold mb-2"
          >
            Call to action
          </label>
          <input
            type="text"
            id="callToAction"
            name="callToAction"
            placeholder="RapidMarketing"
            value={formData.callToAction}
            onChange={handleChange}
            className="w-full border-2 rounded-md p-2 focus:outline-none focus:border-black"
            required
          />
        </div>
      </div>
      <Button text={uploadingForm ? <Loader2 className="h-6 w-8 text-white animate-spin" /> : "Save & Continue"} />
    </form>
  );
}
