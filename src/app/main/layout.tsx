"use client";

import { auth } from "@/lib/firebase";
import clsx from "clsx";
import { signOut } from "firebase/auth";
import { FolderPen, LayoutDashboard, LineChartIcon, Loader2, LogOut, Megaphone, Presentation, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthState } from 'react-firebase-hooks/auth';
import toast from "react-hot-toast";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname()
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    toast.error("Login failed try again later.")
    router.push('/')
  }

  if (!user) {
    toast.error("Login first!")
    router.push('/login')
  }

  if (user) {
    return (
      <div className="flex min-h-screen">
        {/* Sidebar navigation */}
        <div className="flex-[1] p-4 flex-col">
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
              { "bg-purple-100 text-purple-700": pathname.includes('dashboard') })}
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
              <User />
              <p>Account</p>
            </div>
            <div className={`flex gap-4 hover:bg-gray-100 
                  hover:text-purple-700 hover:cursor-pointer p-3 
                  rounded-xl text-lg items-center`}
              onClick={() => {
                signOut(auth)
                router.push('/')
              }}
            >
              <LogOut />
              <p>Logout</p>
            </div>
          </div>
        </div>
        {/* Main content - Campaigns */}
        <div className="flex-[7] w-full h-full bg-gray-200 min-h-screen relative">
          {children}
        </div>
      </div>
    );
  }
}