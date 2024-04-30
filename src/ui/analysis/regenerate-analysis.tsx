"use client"

import { generateDifferenceAnalysis } from "@/actions/generation";
import Button from "@/components/Button";
import { Campaign, Statistics } from "@/lib/definitions";
import { Loader, Loader2, RefreshCcw } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RegenerateAnalysisBtn({
  campaign, prevCampaign, currStatsData, prevStatsData
}: { 
  campaign: Campaign, prevCampaign: Campaign, 
  currStatsData: Statistics, prevStatsData: Statistics 
}) {
  const [generating, setGenerating] = useState(false)

  return (
    <Button
      onClickAction={() => {
        try {
          setGenerating(true)
          generateDifferenceAnalysis(
            campaign,
            prevCampaign,
            currStatsData,
            prevStatsData
          );
        } catch (err) {
          toast.error("Generation failed.")
        } finally {
          setGenerating(false)
        }
      }}
      text={
        <div className="flex gap-2">
          <RefreshCcw />
          Regenerate
        </div>
      }
    />
  )
}