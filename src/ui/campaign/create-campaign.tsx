"use client"

import Button from "@/components/Button";
import { Campaign } from "@/lib/definitions";
import { firestore } from "@/lib/firebase";
import { useUser } from "@clerk/nextjs";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { PlusSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateCampaignBtn({ campaignVersion }: { campaignVersion: number }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  return (
    isLoaded &&
    <Button
      onClickAction={async () => {
        console.log({
          version: campaignVersion,
          email: user?.emailAddresses,
          timestamp: Timestamp.now()
        })
        const doc = await addDoc(collection(firestore, "campaigns"), {
          version: campaignVersion,
          email: user?.emailAddresses[0].emailAddress,
          timestamp: Timestamp.now()
        });
        await addDoc(collection(firestore, "statistics"), {
          campaignId: doc.id,
          clicks: 0,
          impressions: 0,
          conversionRate: 0,
          totalCost: 0,
          timestamp: Timestamp.now()
        })
        router.replace(`/main/campaigns/edit?id=${doc.id}`);
      }}
      text={
        <div className="flex gap-2">
          New Campaign <PlusSquare />
        </div>
      }
    />
  )
}