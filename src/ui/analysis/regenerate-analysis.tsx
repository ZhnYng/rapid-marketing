"use client"

import { generateDifferenceAnalysis } from "@/actions/generation";
import Button from "@/components/Button";
import { Campaign } from "@/lib/definitions";
import { Loader2, RefreshCcw } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RegenerateAnalysisBtn({
  campaign, prevCampaign
}: { campaign: Campaign, prevCampaign: Campaign }) {
  const [generating, setGenerating] = useState(false)

  return (
    generating ?
      <Button
        text={
          <div className="animate-spin">
            <Loader2 />
          </div>
        }
      />
      :
      <Button
        onClickAction={() => {
          try {
            setGenerating(true)
            generateDifferenceAnalysis(campaign, prevCampaign)
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