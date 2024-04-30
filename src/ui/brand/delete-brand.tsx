"use client"

import Button from "@/components/Button"
import { deleteBrand } from "@/lib/actions"
import { firestore } from "@/lib/firebase"
import { deleteDoc, doc } from "firebase/firestore"
import { Trash2 } from "lucide-react"
import { revalidatePath } from "next/cache"
import toast from "react-hot-toast"

export default function DeleteBrandBtn({
  brandId
}: {
  brandId: string
}) {
  return (
    <Button
      onClickAction={async () => {
        try {
          await deleteBrand(brandId)
        } catch (error) {
          console.error(error)
          toast.error('Delete campaign failed!')
        }
      }}
      text={<Trash2 />}
    />
  )
}