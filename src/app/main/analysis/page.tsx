import Button from "@/components/Button";
import { Analysis, Campaign, Statistics } from "@/lib/definitions";
import { generatedImageUrl } from "@/utils/images";
import { ArrowLeft, ArrowRight, Check, CircleDollarSign, LineChart } from "lucide-react";
import { collection, query, where, doc as docRef, orderBy, getDocs } from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase";
import Image from "next/image";
import React, { Suspense } from "react";
import { generateDifferenceAnalysis } from "@/actions/generation";
import toast from "react-hot-toast";
import { currentUser } from "@clerk/nextjs/server";
import StatsComparison from "@/ui/analysis/statistics-comparison";
import VersionAnalysis from "@/ui/analysis/version-analysis";
import { VersionAnalysisSkeleton } from "@/ui/skeletons";

export default async function Page() {
  const user = await currentUser();
  const campaigns = await getDocs(query(
    collection(firestore, "campaigns"),
    where("email", "==", user!.primaryEmailAddress?.emailAddress),
    orderBy('version', 'desc')
  ));

  return (
    campaigns &&
    <div className="w-full p-6 pb-20">
      <div>
        <div className="text-2xl flex mb-2 rounded-xl font-bold items-center">
          <LineChart />
          <h2 className="ms-2">Analysis</h2>
        </div>
        <h1 className="text-3xl mb-8 mt-4">Campaign analysis</h1>
      </div>
      <div className="flex justify-center items-center">
        <div className="max-w-7xl px-14">
          {campaigns.docs?.map((campaign, index) => {
            const prevCampaign = campaigns.docs[index + 1]

            if (prevCampaign) {
              const data = { ...campaign.data(), id: campaign.id }
              const prevData = { ...prevCampaign.data(), id: prevCampaign.id }

              return (
                <div className="flex gap-8 items-center border-gray-400 py-20" key={index}>
                  <StatsComparison
                    campaign={data as Campaign}
                    prevCampaign={prevData as Campaign}
                  />
                  <div className="flex flex-col gap-6 justify-center flex-[2]">
                      <Suspense fallback={<VersionAnalysisSkeleton />}>
                        <VersionAnalysis
                          campaign={data as Campaign}
                          prevCampaign={prevData as Campaign}
                        />
                      </Suspense>
                  </div>
                </div>
              )
            }
          })}
        </div>
      </div>
    </div>
  )
}