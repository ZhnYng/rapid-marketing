"use client"

import { Calendar, ChevronRightIcon, CircleDollarSign, LayoutDashboard, MousePointerClickIcon, Percent, PercentCircle, PlusSquare, View } from "lucide-react";
import React from "react";
import Button from "@/components/Button";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "@/lib/firebase";
import { DocumentData, QuerySnapshot, collection, getDocs, query, where } from "firebase/firestore";
import { Campaign } from "@/lib/definitions";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection, useCollectionData } from "react-firebase-hooks/firestore";
import { useRouter } from "next/navigation";
import generatedImageUrl from "@/lib/images";

export default function Dashboard() {
  const router = useRouter();
  // const [campaigns, setCampaigns] = React.useState<QuerySnapshot<DocumentData, DocumentData>>();
  const [ user ] = useAuthState(auth); 

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Impressions & clicks',
      },
    },
  };

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Views',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor: 'rgb(168 85 247)',
      },
      {
        label: 'Clicks',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor: 'rgb(216 180 254)',
      },
    ],
  };

  const [campaigns, loading, error] = useCollection(query(collection(firestore, "campaigns"), where("email", "==", user!.email)));

  return (
    <div className="w-full">
      <div className="text-2xl flex bg-white mb-2 rounded-xl font-bold items-center">
        <LayoutDashboard />
        <h2 className="ms-2">Dashboard</h2>
      </div>
      <h1 className="text-3xl mb-8 mt-4">Statistics</h1>
      <div className="flex gap-4 w-full">
        <div className="bg-gray-100 rounded-lg flex-[1]">
          <label className="flex gap-2 p-4"><View/>Total views</label>
          <div className="m-4 p-4 bg-white text-center rounded-lg">
            <h3>6032</h3>
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg flex-[1]">
          <label className="flex gap-2 p-4"><MousePointerClickIcon/>Total clicks</label>
          <div className="m-4 p-4 bg-white text-center rounded-lg">
            <h3>1432</h3>
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg flex-[1]">
          <label className="flex gap-2 p-4"><PercentCircle/>Conversion rate</label>
          <div className="m-4 p-4 bg-white text-center rounded-lg">
            <h3>3%</h3>
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg flex-[1]">
          <label className="flex gap-2 p-4"><CircleDollarSign/>Advertising cost</label>
          <div className="m-4 p-4 bg-white text-center rounded-lg">
            <h3>$3000</h3>
          </div>
        </div>
      </div>
      <div className="flex gap-8">
        <div className="my-6 flex-[1]">
          <h2 className="text-2xl my-4">Traction over time</h2>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="bg-white rounded-lg p-6">
              <Bar options={options} data={data} />
            </div>
            <p className="flex gap-2 justify-end mt-4"><Calendar/>Last 12 months</p>
          </div>
        </div>
        <div className="my-6 flex-[1]">
          <h2 className="text-2xl my-4">Campaigns</h2>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="bg-white rounded-lg p-6 h-96 overflow-y-scroll">
              <table className="w-full text-center ">
                <thead className="">
                  <tr>
                    <td>Generated Image</td>
                    <td>Brand Name</td>
                    <td>Size</td>
                    <td>More</td>
                  </tr>
                </thead>
                <tbody>
                  {campaigns?.docs.map(campaign => {
                    const data = campaign.data() as Campaign
                    return (
                      <tr key={campaign.id} className="border-b">
                        <td className="flex justify-center items-center my-6">
                          <img
                            className="w-44"
                            src={generatedImageUrl(data.generatedImage.split("/")[1])}
                          />
                        </td>
                        <td className="text-lg">{data.brandName}</td>
                        <td className="capitalize">{data.size}</td>
                        <td>
                          <Button
                            onClickAction={null}
                            text={"Details"}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className="flex gap-2 justify-end mt-4 hover:cursor-pointer" onClick={() => router.push('/main/campaigns')}>To Campaings<ChevronRightIcon/></p>
          </div>
        </div>
      </div>
    </div>
  )
}