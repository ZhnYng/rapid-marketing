"use client"

import React from "react";
import { PlusSquare, Presentation } from "lucide-react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";
import { Campaign } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import generatedImageUrl from "@/lib/images";

export default function Campaigns() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [generatingImage, setGeneratingImage] = React.useState(false);
  const [campaigns, loading, error] = useCollection(query(collection(firestore, "campaigns"), where("email", "==", user!.email)));

  React.useEffect(() => {
    campaigns?.docs.map(campaign => {
      const data = campaign.data() as Campaign
      if (!data.generatedImage) {
        // Check generation status
      }
    })

    // onAuthStateChanged(auth, async (user) => {
    //   if (user) {
    //     const campaigns = await getCampaigns(user.email!);
    //     for (const campaign of campaigns.docs) {
    //       const data = campaign.data() as Campaign
    //       if (!data.generatedImage) {
    //         setGeneratingImage(true);
    //         createPrompt(data)
    //           .then(prompt => {
    //             createImage(prompt)
    //               .then(async (path) => {
    //                 updateCampaign(campaign.id, {
    //                   ...data,
    //                   generatedImage: path
    //                 })
    //                 setGeneratingImage(false);
    //               })
    //               .catch((err) => console.error(err));
    //           })
    //           .catch(err => console.error(err))
    //       }
    //     }
    //     setCampaigns(campaigns)
    //   } else {
    //     toast.error('You must login first!')
    //     navigate('/login')
    //   }
    // });
  }, [campaigns])

  return (
    <div className="w-full">
      <div className="text-2xl flex bg-white mb-2 rounded-xl font-bold items-center">
        <Presentation />
        <h2 className="ms-2">Campaigns</h2>
      </div>
      <h1 className="text-3xl mb-8 mt-4">All Campaigns</h1>
      <div className="absolute top-10 right-10">
        <Button
          onClickAction={() => router.push('/main/campaigns/create')}
          text={
            <div className="flex gap-2">
              New Campaign <PlusSquare />
            </div>
          }
        />
      </div>
      {campaigns ?
        <div className="flex gap-10 justify-center w-full h-full">
          {campaigns.docs.map((doc, index) => {
            const data = doc.data() as Campaign;
            return (
              <div key={index} className="shadow-lg rounded-lg flex-col w-1/3
                p-6 hover:bg-gray-50 transition ease-in-out duration-300 h-full"
              >
                <div className="border-gray-500 border-2 flex justify-center items-center mb-8 border-opacity-30">
                  {generatingImage || !data.generatedImage ?
                    <Image
                      src={'/image-loading.png'}
                      alt="Placeholder image"
                      width={500}
                      height={500}
                      className="animate-pulse"
                    />
                    :
                    <img
                      className="w-full"
                      src={generatedImageUrl(data.generatedImage.split("/")[1])}
                    />
                  }
                </div>
                <div>
                  <div className="flex gap-4 items-center">
                    <p className="text-xl font-bold my-2">{data.headline}</p>
                    <span className="bg-purple-500 text-white rounded-full capitalize font-medium py-1 px-2">
                      {data.size}
                    </span>
                  </div>
                  <p className="my-4">{data.projectDescription}</p>
                  <p><label className="font-bold mr-2">Punchline:</label>{data.punchline}</p>
                  <p><label className="font-bold mr-2">Call To Action:</label>{data.callToAction}</p>
                  <p><label className="font-bold mr-2">Target Audience:</label>{data.targetAudience}</p>
                  <div className="flex gap-3 justify-end mt-8">
                    <Button onClickAction={() => router.push(`/main/campaign/edit/${doc.id}`)} text="Edit" />
                    <Button onClickAction={null} text="Publish" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        :
        <div className="flex gap-10 justify-center items-center">
          <div className="shadow-lg rounded-lg flex-col w-1/3 p-6">
            <div className="border-gray-500 border-2 flex justify-center items-center mb-8 border-opacity-30">
              <Image
                src={'/image-loading.png'}
                alt="Placeholder image"
                width={500}
                height={500}
                className="animate-pulse"
              />
            </div>
            <div>
              <div className="flex gap-4 items-center">
                <p className="text-xl font-bold my-2">No Campaigns Found.</p>
                <span className="bg-purple-500 text-white rounded-full capitalize font-medium py-1 px-2">
                  Create
                </span>
              </div>
              <p className="my-4">Creating a campaign through the button at the top right streamlines the process, offering a user-friendly interface with all necessary tools readily accessible. This efficient approach ensures that your campaign is launched swiftly, maximizing your reach and impact without unnecessary delays. With just a click, you unlock the potential to engage your audience effectively and achieve your campaign goals with ease.</p>
              <p><label className="font-bold mr-2">Punchline:</label>Produce marketing materials in seconds.</p>
              <p><label className="font-bold mr-2">Call To Action:</label>Create a campaign today!</p>
              <p><label className="font-bold mr-2">Target Audience:</label>You</p>
              <div className="flex gap-3 justify-end mt-8">
                <Button onClickAction={null} text="Edit" />
                <Button onClickAction={null} text="Publish" />
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}