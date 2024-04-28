import React from "react";
import { redirect, usePathname, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen p-8">
      <Link href="/main/brands">
        <ChevronLeft/>
      </Link>
      {/* Main content - form */}
      <div className="p-8 flex-[5] relative flex justify-center">
        <div className="max-w-4xl w-full">
          {children}
        </div>
      </div>
    </div>
  );
}