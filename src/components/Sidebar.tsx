"use client"

import { SignOutButton, UserButton } from "@clerk/nextjs";
import clsx from "clsx";
import { FolderPen, LayoutDashboard, LineChartIcon, LogOut, LucideKeyRound, Megaphone, Presentation, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Sidebar() { 
  const router = useRouter();
  const pathname = usePathname()

  return (
    <div className="flex-[1] p-4 flex-col sticky top-0 max-h-screen">
      <div
        className="text-xl font-bold flex p-3 rounded-xl mb-4 
                  hover:cursor-pointer transition ease-in-out 
                  hover:-translate-y-1 hover:scale-105 duration-300"
        onClick={() => router.push('/')}
      >
        <Megaphone />
        <h2 className="ms-2">RapidMarketing</h2>
      </div>
      <div className="space-y-2 text-sm flex flex-col">
        <div className={clsx(`flex gap-4 hover:bg-gray-100 
        hover:text-purple-700 hover:cursor-pointer p-3 
        rounded-xl text-lg items-center`,
          { "bg-purple-100 text-purple-700": pathname.match(/\/main$/) })}
          onClick={() => router.push("/main")}
        >
          <LayoutDashboard />
          <p>Dashboard</p>
        </div>
        <div className={clsx(`flex gap-4 hover:bg-gray-100 
        hover:text-purple-700 hover:cursor-pointer p-3 
        rounded-xl text-lg items-center`,
          { "bg-purple-100 text-purple-700": pathname.includes('analysis') })}
          onClick={() => router.push("/main/analysis")}
        >
          <LineChartIcon />
          <p>Analysis</p>
        </div>
        <div className={clsx(`flex gap-4 hover:bg-gray-100 
        hover:text-purple-700 hover:cursor-pointer p-3 
        rounded-xl text-lg items-center`,
          { "bg-purple-100 text-purple-700": pathname.includes('brands') })}
          onClick={() => router.push("/main/brands")}
        >
          <FolderPen />
          <p>Brands</p>
        </div>
        <div className={clsx(`flex gap-4 hover:bg-gray-100 
        hover:text-purple-700 hover:cursor-pointer p-3 
        rounded-xl text-lg items-center`,
          { "bg-purple-100 text-purple-700": pathname.includes('campaigns') })}
          onClick={() => router.push("/main/campaigns")}
        >
          <Presentation />
          <p>Campagins</p>
        </div>
        <div className={clsx(`flex gap-4 hover:bg-gray-100 
        hover:text-purple-700 hover:cursor-pointer p-3 
        rounded-xl text-lg items-center`,
          { "bg-purple-100 text-purple-700": pathname.includes('account') })}
          onClick={() => router.push("/main/account")}
        >
          <LucideKeyRound /> 
          API Keys
        </div>
        <div className={`flex gap-4 hover:bg-gray-100 
            hover:text-purple-700 hover:cursor-pointer p-3 
            rounded-xl text-lg items-center`}
        >
          <LogOut/>
          <SignOutButton />
        </div>
      </div>
    </div >
  )
}