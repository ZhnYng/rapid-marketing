"use server"

import { deleteDoc, doc } from "firebase/firestore"
import { firestore } from "./firebase"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function deleteBrand(brandId: string) {
  deleteDoc(doc(firestore, "brands", brandId))
  revalidatePath('/main/brands')
  redirect('/main/brands')
}

export async function deleteCampaign(campaignId: string) {
  deleteDoc(doc(firestore, "campaigns", campaignId))
  revalidatePath('/main/campaigns')
  redirect('/main/campaigns')
}