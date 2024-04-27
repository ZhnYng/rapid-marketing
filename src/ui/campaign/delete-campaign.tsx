"use client"

import Button from "@/components/Button"
import { firestore } from "@/lib/firebase"
import { deleteDoc, doc } from "firebase/firestore"
import { Trash2 } from "lucide-react"
import toast from "react-hot-toast"

export default function DeleteCampaignBtn({ campaignId }: { campaignId: string }) {
  return (
    <Button
      onClickAction={() => {
        try {
          deleteDoc(doc(firestore, "campaigns", campaignId))
        } catch (error) {
          toast.error('Delete campaign failed!')
        }
      }}
      text={<Trash2 />}
    />
  )
}