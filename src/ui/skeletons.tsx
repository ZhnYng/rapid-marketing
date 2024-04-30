import { FolderPen, Presentation } from "lucide-react";
import Image from "next/image";
import CreateBrandBtn from "./brand/create-brand";

const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-100/60 before:to-transparent';

export function VersionAnalysisSkeleton() {
  return (
    <>
      <div className="ml-10 border border-gray-400 rounded-md p-6">
        <div className={`${shimmer} relative w-full overflow-hidden`}>
          <div className="mb-4 h-8 w-36 rounded-md bg-gray-300" />
          <div className="flex flex-col gap-2">
            <div className={`w-full bg-gray-300 h-2 rounded-md ${shimmer}`} />
            <div className="w-full bg-gray-300 h-2 rounded-md" />
            <div className="w-full bg-gray-300 h-2 rounded-md" />
            <div className="w-full bg-gray-300 h-2 rounded-md" />
          </div>
          <div className="mb-4 h-8 w-36 rounded-md bg-gray-300 mt-8" />
          <div className="flex flex-col gap-2">
            <div className={`w-full bg-gray-300 h-2 rounded-md ${shimmer}`} />
            <div className="w-full bg-gray-300 h-2 rounded-md" />
            <div className="w-full bg-gray-300 h-2 rounded-md" />
            <div className="w-full bg-gray-300 h-2 rounded-md" />
          </div>
        </div>
      </div>
      <div className="justify-self-end place-self-end bg-gray-300 rounded-md w-32 h-8" />
    </>
  )
}

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm flex-[1]`}
    >
      <div className="flex p-4">
        <div className="h-5 w-5 rounded-md bg-gray-200" />
        <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

export function ImageCardSkeleton() {
  return (
    <div className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-4 shadow-sm w-80`}>
      <div className="flex-col">
        <div className="border-gray-500 border-2 flex justify-center items-center mb-8 border-opacity-30">
          <Image
            src={'/image-loading.png'}
            alt="Placeholder image"
            width={500}
            height={500}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className={`w-full bg-gray-300 h-2 rounded-md ${shimmer}`} />
          <div className="w-full bg-gray-300 h-2 rounded-md" />
          <div className="w-full bg-gray-300 h-2 rounded-md" />
          <div className="w-full bg-gray-300 h-2 rounded-md" />
          <div className="w-full bg-gray-300 h-2 rounded-md" />
          <div className="w-full bg-gray-300 h-2 rounded-md" />
        </div>
        <div className="flex gap-3 justify-end mt-8">
          <div className="w-14 h-8 bg-gray-300 rounded-md" />
          <div className="w-14 h-8 bg-gray-300 rounded-md" />
        </div>
      </div>
    </div>
  )
}

export function BrandsSkeleton() {
  return (
    <div className="w-full p-6 pb-20">
      <div className="sticky flex w-full justify-between">
        <div>
          <div className="text-2xl flex mb-2 rounded-xl font-bold items-center">
            <FolderPen />
            <h2 className="ms-2">Brands</h2>
          </div>
          <h1 className="text-3xl mb-8 mt-4">All Brands</h1>
        </div>
        <div className="top-10 right-10">
          <div className="w-36 h-10 bg-gray-300 rounded-md" />
        </div>
      </div>
      <div className="flex justify-center gap-8 w-full h-full items-center">
        <ImageCardSkeleton />
        <ImageCardSkeleton />
        <ImageCardSkeleton />
      </div>
    </div>
  )
}

export function CampaignsSkeleton() {
  return (
    <div className="w-full p-6 pb-20">
      <div className="sticky flex w-full justify-between">
        <div>
          <div className="text-2xl flex mb-2 rounded-xl font-bold items-center">
            <Presentation />
            <h2 className="ms-2">Campaigns</h2>
          </div>
          <h1 className="text-3xl mb-8 mt-4">All Campaigns</h1>
        </div>
        <div className="top-10 right-10">
          <div className="w-36 h-10 bg-gray-300 rounded-md" />
        </div>
      </div>
      <div className="flex justify-center gap-8 w-full h-full items-center">
        <ImageCardSkeleton />
        <ImageCardSkeleton />
        <ImageCardSkeleton />
      </div>
    </div>
  )
}

export function UpdateAPIFormSkeleton() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className={`${shimmer} w-full max-w-md bg-white p-8 rounded-lg relative overflow-hidden`}>
        <div className="w-36 h-10 bg-gray-300 rounded-md mb-5" />
        <div className="w-36 h-6 bg-gray-300 rounded-md mb-2" />
        <div className="border w-full h-8" />
        <div className="flex justify-end">
          <div className="h-10 w-20 bg-gray-300 rounded-md mt-4" />
        </div>
      </div>
    </div>
  )
}