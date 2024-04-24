"use client";

import Button from "@/components/Button";
import { Campaign, Statistics } from "@/lib/definitions";
import { generatedImageUrl } from "@/utils/images";
import { ArrowRight, Check, CircleDollarSign, LineChart, Loader2, LucideEye, MousePointerClick, Percent, ScanEye } from "lucide-react";
import { collection, deleteDoc, getDocs, query, where, doc as docRef, addDoc, Timestamp, doc, orderBy, QuerySnapshot, DocumentData } from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/lib/firebase";
import Image from "next/image";
import React from "react";
import { generateDifferenceAnalysis } from "@/actions/generation";

export default function Page() {
  const [user] = useAuthState(auth);
  const [campaigns, loading, error] = useCollection(query(collection(firestore, "campaigns"), where("email", "==", user!.email), orderBy('timestamp')));

  if (loading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if(error) console.error(error)

  return (
    campaigns &&
    <div className="w-full p-6 pb-20">
      <div className="border-b border-gray-300 ">
        <div className="text-2xl flex mb-2 rounded-xl font-bold items-center">
          <LineChart />
          <h2 className="ms-2">Analysis</h2>
        </div>
        <h1 className="text-3xl mb-8 mt-4">Campaign analysis</h1>
      </div>
      <div className="flex justify-center items-center">
        <div className="max-w-7xl">
          {campaigns.docs?.map(async(campaign, index) => {
            const data = campaign.data() as Campaign;

            return (
              campaigns.docs[index + 1] &&
              <div className="flex gap-8 items-center border-gray-400 py-20" key={index}>
                <div className="min-w-60 flex-[1]">
                  <h3>Version {index}</h3>
                  {!data.generatedImage ?
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
                      src={generatedImageUrl(data.generatedImage.split("/")[1])}
                    />
                  }
                  <CampaignStats campaignId={campaign.id} key={campaign.id} />
                </div>
                <ArrowRight size={30} className="min-w-8" key={campaign.id} />
                <div className="min-w-60 flex-[1]">
                  <h3>Version {index + 1}</h3>
                  {!campaigns.docs[index + 1].data().generatedImage ?
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
                      src={generatedImageUrl(campaigns.docs[index + 1].data().generatedImage.split("/")[1])}
                    />
                  }
                  <CampaignStats campaignId={campaigns.docs[index + 1].id} key={campaigns.docs[index + 1].id} />
                </div>
                <div className="flex flex-col gap-6 justify-center">
                  <div className="ml-10 border border-gray-400 rounded-md p-6">
                    {/* {await generateDifferenceAnalysis(data, campaigns.docs[index + 1].data() as Campaign)} */}
                    {/* {getDocs(query(
                      collection(firestore, "comparisons"), 
                      where("campaignId1", "==", campaign.id), 
                      where("campaignId2", "==", campaigns.docs[index + 1].id)
                    )).then(comparison => (
                      <>
                      <h3 className="font-bold">Difference analysis</h3>
                      <p>
                        {comparison.docs[0].data().difference}
                      </p>
                      <h3 className="font-bold mt-4">Suggestions</h3>
                      <p>
                        {comparison.docs[0].data().suggestions}
                      </p>
                      </>
                    ))} */}
                    <h3 className="font-bold">Difference analysis</h3>
                    Our solution? Leveraging generative AI to efficiently produce and track advertising materials. By utilizing state-of-the-art technologies like Gemini Pro and Gemini Pro Vision for accurate insights, we streamline the process.
                    <h3 className="font-bold mt-4">Suggestions</h3>
                    Good morning, judges. Our project, Rapid Marketing, addresses a common challenge faced by startups: limited capital for advertising experimentation. Traditional methods like illustrations and A/B testing are costly and prone to inaccuracies.
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function CampaignStats({ campaignId }: { campaignId: string }) {
  const [statistics, loading, error] = useCollection(query(collection(firestore, "statistics"), where("campaignId", "==", campaignId)));
  const data = statistics?.docs[0]?.data() as Statistics;

  return (
    data &&
    <div className="flex flex-col gap-3 p-4 mt-4 rounded-md bg-white">
      <p className="flex gap-2">
        <MousePointerClick /> Clicks
        <span className="font-bold ml-auto">{data.clicks}</span>
      </p>
      <p className="flex gap-2">
        <ScanEye /> Impressions
        <span className="font-bold ml-auto">{data.impressions}</span>
      </p>
      <p className="flex gap-2">
        <Percent /> Conversion rate
        <span className="font-bold ml-auto">{data.conversionRate}%</span>
      </p>
      <p className="flex gap-2">
        <CircleDollarSign /> Costs
        <span className="font-bold ml-auto">${data.totalCost}</span>
      </p>
    </div>
  )
}