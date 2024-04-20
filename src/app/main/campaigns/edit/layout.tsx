"use client"

import React, { ReactElement, useEffect } from "react";
import { Hammer, Image, Proportions, Text } from "lucide-react";
import { Building2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/lib/firebase";
import Link from "next/link";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import toast from "react-hot-toast";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [ user ] = useAuthState(auth);
  const router = useRouter();

  React.useEffect(() => {
    if(!searchParams.get('id')) {
      router.replace('/main/campaigns')
      toast.error('Document ID not found')
    } else {
      router.replace(`/main/campaigns/edit/brand?id=${searchParams.get('id')}`);
    }
  }, [])

  return (
    <div className="flex min-h-screen p-8">
      {/* Sidebar navigation */}
      <div className="items-center border-r-2 border-opacity-30 flex-[1]">
        <div className="text-xl font-bold flex pb-4 rounded-xl">
          <Hammer />
          <h2 className="ms-2">Generate a campaign</h2>
        </div>
        <ul className="space-y-2 text-sm flex flex-col justify-between h-1/2 max-h-60">
          <Link href={`/main/campaigns/edit/brand?id=${searchParams.get('id')}`}>
            <SideBarBtn
              destination="brand"
              id="1."
              pathname={pathname}
              icon={<Building2 />}
            />
          </Link>
          <Link href={`/main/campaigns/edit/size?id=${searchParams.get('id')}`}>
            <SideBarBtn
              destination="size"
              id="2."
              pathname={pathname}
              icon={<Proportions />}
            />
          </Link>
          <Link href={`/main/campaigns/edit/content?id=${searchParams.get('id')}`}>
            <SideBarBtn
              destination="content"
              id="3."
              pathname={pathname}
              icon={<Text />}
            />
          </Link>
          <Link href={`/main/campaigns/edit/images?id=${searchParams.get('id')}`}>
            <SideBarBtn
              destination="images"
              id="4."
              pathname={pathname}
              icon={<Image />}
            />
          </Link>
        </ul>
      </div>
      {/* Main content - form */}
      <div className="p-8 flex-[5] relative flex justify-center">
        <div className="max-w-4xl w-full">
          {children}
        </div>
      </div>
    </div>
  );
}

function SideBarBtn({
  pathname,
  id,
  icon,
  destination,
}: {
  pathname: string,
  id: string,
  icon: ReactElement,
  destination: string,
}) {
  return (
    <button
      className={`flex text-lg text-gray-600 font-medium items-center 
      p-2 px-6 transition ease-in-out hover:-translate-y-1 
      hover:scale-110 duration-300 ${
        pathname.includes(destination)
          ? "border-l-2 border-purple-500 text-purple-500"
          : "border-l-2 border-gray-600"
      }`}
    >
      {id}
      <div
        className={`mx-2 ${
          pathname.includes(destination)
            ? "text-purple-500"
            : "text-gray-600"
        }`}
      >
        {icon}
      </div>
      <p className="capitalize">
        {destination}
      </p>
    </button>
  );
}
