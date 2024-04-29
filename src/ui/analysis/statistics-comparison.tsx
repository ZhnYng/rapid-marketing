import { Campaign, Statistics } from "@/lib/definitions";
import { firestore } from "@/lib/firebase";
import { generatedImageUrl } from "@/utils/images";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ArrowRight, CircleDollarSign, MousePointerClick, Percent, ScanEye } from "lucide-react";
import Image from "next/image";

export default function StatsComparison(
  { campaign, prevCampaign }:
  { 
    campaign: Campaign, 
    prevCampaign: Campaign 
  }
) {
  return (
    <div className="flex items-center gap-8 flex-[1]">
      <CampaignStats campaign={prevCampaign} />
      <ArrowRight size={30} className="min-w-8" key={campaign.id} />
      <CampaignStats campaign={campaign} />
    </div>
  )
}

async function CampaignStats({
  campaign,
}: {
  campaign: Campaign,
}) {
  const statistics = await getDocs(query(
    collection(firestore, "statistics"),
    where("campaignId", "==", campaign.id)
  ))

  const statisticsData = statistics.docs[0].data() as Statistics;

  return (
    <div className="min-w-60 flex-[1]">
      <h3>Version {campaign.version}</h3>
      {campaign.generatedImage ?
        <img
          alt="Generated image"
          className="w-full"
          src={generatedImageUrl(campaign.generatedImage.split("/")[1])}
        />
        :
        <Image
          src={'/image-loading.png'}
          alt="Placeholder image"
          width={500}
          height={500}
        />
      }
      <div className="flex flex-col gap-3 p-4 mt-4 rounded-md bg-white">
        <p className="flex gap-2">
          <MousePointerClick /> Clicks
          <span className="font-bold ml-auto">{statisticsData.clicks}</span>
        </p>
        <p className="flex gap-2">
          <ScanEye /> Impressions
          <span className="font-bold ml-auto">{statisticsData.impressions}</span>
        </p>
        <p className="flex gap-2">
          <Percent /> Conversion rate
          <span className="font-bold ml-auto">{statisticsData.conversionRate}%</span>
        </p>
        <p className="flex gap-2">
          <CircleDollarSign /> Costs
          <span className="font-bold ml-auto">${statisticsData.totalCost}</span>
        </p>
      </div>
    </div>
  )
}