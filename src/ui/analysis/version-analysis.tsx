import { generateDifferenceAnalysis } from "@/actions/generation";
import { Analysis, Campaign } from "@/lib/definitions";
import { firestore } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Button from "@/components/Button";
import { RefreshCcw } from "lucide-react";
import { revalidatePath } from "next/cache";
import RegenerateAnalysisBtn from "./regenerate-analysis";

export default async function VersionAnalysis(
  {
    campaign,
    prevCampaign
  }: {
    campaign: Campaign;
    prevCampaign: Campaign;
  }
) {
  const generateVersionAnalysis = async () => {
    try {
      const analysisId = await generateDifferenceAnalysis(
        campaign,
        prevCampaign
      );
      campaign.analysisId = analysisId!
    } catch (err) {
      return (
        <>
          <div className="ml-10 border border-gray-400 rounded-md p-6">
            <div className="flex flex-col">
              <h3 className="font-bold">Analysis failed!</h3>
              <p>Refresh or click the regenerate button below!</p>
            </div>
          </div>
          <div className="justify-self-end place-self-end">
            <RegenerateAnalysisBtn
              campaign={campaign}
              prevCampaign={prevCampaign}
            />
          </div>
        </>
      )
    }
  }

  if (!campaign.analysisId && campaign.version != 0) {
    return await generateVersionAnalysis()
  }

  const analysis = await getDoc(doc(firestore, "analysis", campaign.analysisId));
  const data = analysis?.data() as Analysis;

  return (
    data &&
    <>
      <div className="ml-10 border border-gray-400 rounded-md p-6">
        <div className="flex flex-col">
          <h3 className="font-bold">Difference analysis</h3>
          {data.difference}
          <h3 className="font-bold mt-4">Suggestions</h3>
          {data.suggestions}
        </div>
      </div>
      <div className="justify-self-end place-self-end">
        <RegenerateAnalysisBtn
          campaign={campaign}
          prevCampaign={prevCampaign}
        />
      </div>
    </>
  )
}