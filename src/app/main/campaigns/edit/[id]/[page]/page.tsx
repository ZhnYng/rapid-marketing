import Button from "@/components/Button";
import { Campaign } from "@/lib/definitions";
import { firestore } from "@/lib/firebase";
import Brand from "@/ui/campaign/edit/brand";
import Content from "@/ui/campaign/edit/content";
import Images from "@/ui/campaign/edit/images";
import Size from "@/ui/campaign/edit/size";
import { currentUser } from "@clerk/nextjs/server";
import clsx from "clsx";
import { DocumentData, QuerySnapshot, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

export default async function Page({ params }: { params: { id: string, page: string } }) {
  const user = await currentUser();

  const brands = await getDocs(query(
    collection(firestore, "brands"),
    where("email", "==", user?.primaryEmailAddress?.emailAddress)
  ));

  const campaign = await getDoc(doc(firestore, "campaigns", params.id))

  switch (params.page) {
    case "brand":
      return (
        <Brand 
          campaignId={params.id} 
          campaignData={campaign.data() as Campaign}
          brands={brands.docs}
        />
      )
    case "size":
      return( 
        <Size 
          campaignId={params.id}
          campaignData={campaign.data() as Campaign}
        />
      )
    case "content":
      return( 
        <Content 
          campaignId={params.id}
          campaignData={campaign.data() as Campaign}
        />
      )
    case "images":
      return( 
        <Images 
          campaignId={params.id}
          campaignData={campaign.data() as Campaign}
        />
      )
    default:
      return (
        <div>
          Page not found
        </div>
      )
  }
}

