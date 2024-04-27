import { Calendar, Check, ChevronRightIcon, CircleDollarSign, LayoutDashboard, MousePointerClickIcon, Percent, PercentCircle, PlusSquare, View } from "lucide-react";
import React from "react";
import Button from "@/components/Button";

import { Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "@/lib/firebase";
import { DocumentData, QuerySnapshot, collection, getDocs, query, where } from "firebase/firestore";
import { Campaign } from "@/lib/definitions";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection, useCollectionData } from "react-firebase-hooks/firestore";
import { redirect, useRouter } from "next/navigation";
import { generatedImageUrl } from "@/utils/images";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import Chart from "@/components/Chart";

export default async function Dashboard() {
  const user = await currentUser();
  const campaigns = await getDocs(query(
    collection(firestore, "campaigns"), 
    where("email", "==", user!.primaryEmailAddress?.emailAddress)
  ));

  return (
    <div className="w-full p-6">
      <div className="text-2xl flex mb-2 rounded-xl font-bold items-center">
        <LayoutDashboard />
        <h2 className="ms-2">Dashboard</h2>
      </div>
      <h1 className="text-3xl mb-8 mt-4">Statistics</h1>
      <div className="flex gap-4 w-full">
        <div className="bg-gray-100 rounded-lg flex-[1]">
          <label className="flex gap-2 p-4"><View/>Total views</label>
          <div className="m-4 p-4 bg-white text-center rounded-lg">
            <h3>6032</h3>
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg flex-[1]">
          <label className="flex gap-2 p-4"><MousePointerClickIcon/>Total clicks</label>
          <div className="m-4 p-4 bg-white text-center rounded-lg">
            <h3>1432</h3>
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg flex-[1]">
          <label className="flex gap-2 p-4"><PercentCircle/>Conversion rate</label>
          <div className="m-4 p-4 bg-white text-center rounded-lg">
            <h3>3%</h3>
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg flex-[1]">
          <label className="flex gap-2 p-4"><CircleDollarSign/>Advertising cost</label>
          <div className="m-4 p-4 bg-white text-center rounded-lg">
            <h3>$3000</h3>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <Chart />
        <div className="my-6 flex-[1]">
          <h2 className="text-2xl my-4">Campaigns</h2>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="bg-white rounded-lg p-6 h-96 overflow-y-scroll">
              <table className="w-full text-center">
                <thead className="">
                  <tr>
                    <td>Generated Image</td>
                    <td>Brand Name</td>
                    <td>Size</td>
                    <td>Select</td>
                  </tr>
                </thead>
                <tbody>
                  {campaigns?.docs.map(campaign => {
                    const data = campaign.data() as Campaign
                    return (
                      <tr key={campaign.id} className="border-b">
                        <td className="flex justify-center items-center my-6">
                          {data.generatedImage ? 
                            <img
                              className="w-44"
                              alt="Generated image"
                              src={generatedImageUrl(data.generatedImage.split("/")[1])}
                            />
                            :
                            <Image
                              src={'/image-loading.png'}
                              alt="Placeholder image"
                              width={175}
                              height={175}
                              className="border"
                            />
                          }
                        </td>
                        <td className="text-lg">{data.headline}</td>
                        <td className="capitalize">{data.size}</td>
                        <td>
                          {/* <Button
                            onClickAction={() => {
                              // router.push('/main/campaigns')
                            }}
                            text={<Check/>}
                          /> */}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <Link 
              href="/main/campaigns" 
              className="flex gap-2 justify-end mt-4 hover:cursor-pointer" 
            >
              To Campaings<ChevronRightIcon/>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}