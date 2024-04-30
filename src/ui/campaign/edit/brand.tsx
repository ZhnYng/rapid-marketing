"use client"

import Button from "@/components/Button";
import { Brand, Campaign } from "@/lib/definitions";
import { firestore } from "@/lib/firebase";
import CreateBrandBtn from "@/ui/brand/create-brand";
import clsx from "clsx";
import { DocumentData, QueryDocumentSnapshot, QuerySnapshot, Timestamp, addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function BrandSection({
  campaignId,
  campaignData,
  brands
}: {
  campaignId: string;
  campaignData: Campaign;
  brands: Brand[];
}) {
  const router = useRouter();
  const [uploadingForm, setUploadingForm] = useState(false);
  const [formData, setFormData] = useState({
    brandId: ""
  });

  useEffect(() => {
    setFormData(campaignData)
  }, [])

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold ">1. Choose a brand</h1>
        <CreateBrandBtn />
      </div>
      <form onSubmit={async (e: React.FormEvent) => {
        e.preventDefault();
        setUploadingForm(true)

        try {
          if (!formData.brandId) {
            toast.error("Choose or create a brand!")
            throw Error("Empty fields")
          }

          await updateDoc(doc(firestore, "campaigns", campaignId), formData);
          router.push(`/main/campaigns/edit/${campaignId}/size`);
        } catch (error) {
          toast.error("Campaign not saved!")
        } finally {
          setUploadingForm(false)
        }
      }}>
        <div className="flex gap-10 flex-wrap">
          {brands.length > 0 ?
            brands?.map((data, index) => {
              return (
                <div
                  className={clsx(`
                  shadow-lg rounded-lg flex-col w-96 hover:cursor-pointer
                  p-6 transition ease-in-out duration-300 h-full`,
                    formData.brandId == data.id ? "border-2 border-purple-500" : "hover:bg-gray-100"
                  )}
                  key={index}
                  onClick={() => setFormData(
                    prevFormData => {
                      return {
                        ...prevFormData,
                        brandId: data.id
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
                      {data.brandType}
                    </span>
                  </div>
                  {data.brandDescription}
                </div>
              )
            })
            :
            <div
              className={clsx(`
                shadow-lg rounded-lg flex-col w-96 hover:cursor-pointer
                p-6 transition ease-in-out duration-300 h-full`,
              )}
            >
              <div className="border-gray-500 border-2 flex 
                justify-center items-center mb-8 border-opacity-30"
              >
                <Image
                  src={'/image-loading.png'}
                  alt="Placeholder image"
                  width={500}
                  height={500}
                />
              </div>
              <div className="flex gap-4 items-center">
                <p className="text-xl font-bold my-2">No brands found!</p>
                <span className="bg-purple-500 text-white rounded-full capitalize font-medium py-1 px-2">
                  Brand
                </span>
              </div>
              Click the button on the top right to create a new brand.
            </div>
          }
        </div>
        <div className="mt-10">
          <Button text={uploadingForm ? <Loader2 className="h-6 w-8 text-white animate-spin" /> : "Save & Continue"} />
        </div>
      </form>
    </>
  )
}