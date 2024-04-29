"use client"

import { Campaign } from "@/lib/definitions"
import { firestore } from "@/lib/firebase"
import { DocumentData, QuerySnapshot, collection, doc, query, where } from "firebase/firestore"
import { CircleDollarSign, MousePointerClickIcon, PercentCircle, View } from "lucide-react"
import React from "react"
import { useCollection, useDocument } from "react-firebase-hooks/firestore"
import toast from "react-hot-toast"
import { CardSkeleton } from "../skeletons"

export default function Statistics(
  { campaigns }:
    { campaigns: Campaign[] }
) {
  const [campaignId, setCampaignId] = React.useState(campaigns[0].id);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCampaignId(e.target.value);
  }

  const [statistics, loading, error] = useCollection(query(
    collection(firestore, "statistics"),
    where("campaignId", "==", campaignId)
  ))

  if (loading) {
    return (
      <div className="flex gap-4 mt-8">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )
  }

  if (error) {
    console.log(error)
    toast.error("Statistic retrieval failed!")
  }

  return (
    statistics &&
    <>
      <div className="flex gap-4 w-full">
        <div className="bg-gray-100 rounded-lg flex-[1]">
          <label className="flex gap-2 p-4"><View />Total views</label>
          <div className="m-4 p-4 bg-white text-center rounded-lg">
            <h3>{statistics.docs[0].data()?.impressions}</h3>
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg flex-[1]">
          <label className="flex gap-2 p-4"><MousePointerClickIcon />Total clicks</label>
          <div className="m-4 p-4 bg-white text-center rounded-lg">
            <h3>{statistics.docs[0].data()?.clicks}</h3>
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg flex-[1]">
          <label className="flex gap-2 p-4"><PercentCircle />Conversion rate</label>
          <div className="m-4 p-4 bg-white text-center rounded-lg">
            <h3>{statistics.docs[0].data()?.conversionRate}%</h3>
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg flex-[1]">
          <label className="flex gap-2 p-4"><CircleDollarSign />Advertising cost</label>
          <div className="m-4 p-4 bg-white text-center rounded-lg">
            <h3>${statistics.docs[0].data()?.totalCost}</h3>
          </div>
        </div>
      </div>
      <select name="cars" id="cars" className="absolute top-5 right-5 rounded-md p-1" onChange={handleChange} value={campaignId}>
        {campaigns.map(campaign => {
          return <option value={campaign.id}>Version {campaign.version}</option>
        })}
      </select>
    </>
  )
}