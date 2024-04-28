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

export default async function Page({ params }: { params: { id: string, page: string } }) {
  const user = await currentUser();

  const campaign = await getDoc(doc(firestore, "campaigns", params.id))
  const brands = await getDocs(query(
    collection(firestore, "brands"),
    where("email", "==", user?.primaryEmailAddress?.emailAddress)
  ));

  const brandsFiltered = brands.docs.map(brand => {
    const data = brand.data();
    return {
      id: brand.id,
      brandDescription: data.brandDescription,
      brandName: data.brandName,
      brandType: data.brandType,
      brandLogo: data.brandLogo,
    } 
  })

  switch (params.page) {
    case "brand":
      return (
        <Brand 
          campaignId={params.id} 
          campaignData={campaign.data() as Campaign}
          brands={JSON.parse(JSON.stringify(brandsFiltered))}
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

