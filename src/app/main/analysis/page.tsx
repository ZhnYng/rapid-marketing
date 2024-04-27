"use client";

import Button from "@/components/Button";
import { Analysis, Campaign, Statistics } from "@/lib/definitions";
import { generatedImageUrl } from "@/utils/images";
import { ArrowLeft, ArrowRight, Check, CircleDollarSign, LineChart, Loader2, LucideEye, MousePointerClick, Percent, ScanEye } from "lucide-react";
import { collection, query, where, doc as docRef, orderBy, doc, addDoc, updateDoc, QuerySnapshot, DocumentSnapshot, DocumentData } from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/lib/firebase";
import Image from "next/image";
import React from "react";
import { generateDifferenceAnalysis } from "@/actions/generation";
import toast from "react-hot-toast";

export default function Page() {
  const [user] = useAuthState(auth);
  const [campaigns, loading, error] = useCollection(query(collection(firestore, "campaigns"), where("email", "==", user!.email), orderBy('version', 'desc')));

  if (loading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) console.error(error)

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
        <div className="max-w-7xl px-14">
          {campaigns.docs?.map((campaign, index) => {
            const data = campaign.data() as Campaign;
            const prevCampaign = campaigns.docs[index + 1]

            return (
              prevCampaign &&
              <div className="flex gap-8 items-center border-gray-400 py-20" key={index}>
                <div className="min-w-60 flex-[1]">
                  <h3>Version {data.version - 1}</h3>
                  <CampaignStats
                    campaignId={prevCampaign.id}
                    key={prevCampaign.id}
                    generatedImage={prevCampaign.data().generatedImage}
                  />
                </div>
                <ArrowRight size={30} className="min-w-8" key={campaign.id} />
                <div className="min-w-60 flex-[1]">
                  <h3>Version {data.version}</h3>
                  <CampaignStats
                    campaignId={campaign.id}
                    key={campaign.id}
                    generatedImage={data.generatedImage}
                  />
                </div>
                <div className="flex flex-col gap-6 justify-center flex-[2]">
                  <div className="ml-10 border border-gray-400 rounded-md p-6">
                    <VersionAnalysis
                      campaign={campaign}
                      prevCampaign={prevCampaign}
                    />
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

function CampaignStats({ campaignId, generatedImage }: { campaignId: string; generatedImage: string; }) {
  const [statistics, loading, error] = useCollection(query(collection(firestore, "statistics"), where("campaignId", "==", campaignId)));
  const data = statistics?.docs[0]?.data() as Statistics;

  return (
    data &&
    <>
      {!generatedImage ?
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
          src={generatedImageUrl(generatedImage.split("/")[1])}
        />
      }
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
    </>
  )
}

function VersionAnalysis(
  {
    campaign,
    prevCampaign
  }:{ 
    campaign: DocumentSnapshot; 
    prevCampaign: DocumentSnapshot; 
  }
) {
  const [generatingAnalysis, setGeneratingAnalysis] = React.useState(false);
  const campaignData = campaign.data() as Campaign;
  const prevCampaignData = prevCampaign.data() as Campaign;

  const generateAnalysis = async () => {
    const differenceAnalysis = await generateDifferenceAnalysis(
      JSON.stringify(campaignData),
      JSON.stringify(prevCampaignData)
    );
    
    if (differenceAnalysis) {
      const analysisDoc = await addDoc(collection(firestore, "analysis"), {
        campaignId1: campaign.id,
        campaignId2: prevCampaign.id,
        difference: differenceAnalysis.difference,
        suggestions: differenceAnalysis.suggestions
      })
      console.log("works here")
      await updateDoc(
        doc(firestore, "campaigns", campaign.id), 
        { analysisId: analysisDoc.id }
      )
      console.log("not here")
    } else {
      toast.error("AI did not return an analysis.")
    }
  }

  if (!campaignData.analysisId && campaignData.version != 0) {
    try {
      setGeneratingAnalysis(true);
      generateAnalysis();
      setGeneratingAnalysis(false);
    } catch (err) {
      console.error(err)
    } finally {
      setGeneratingAnalysis(false);
    }
  }

  const [analysis, loading, error] = useDocument(doc(firestore, "analysis", campaignData.analysisId || ""));
  const data = analysis?.data() as Analysis;

  if (loading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (generatingAnalysis) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) console.error(error);

  return (
    data &&
    <>
      <h3 className="font-bold">Difference analysis</h3>
      {data.difference}
      <h3 className="font-bold mt-4">Suggestions</h3>
      {data.suggestions}
    </>
  )
}