export const dynamic = 'force-dynamic'

import Button from "@/components/Button";
import { auth, firestore } from "@/lib/firebase";
import CreateBrandBtn from "@/ui/brand/create-brand";
import DeleteBrandBtn from "@/ui/brand/delete-brand";
import { currentUser } from "@clerk/nextjs/server";
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { EditIcon, FolderPen, PlusSquare, Presentation, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Brands() {
  const user = await currentUser();
  const brands = await getDocs(query(collection(firestore, "brands"), where("email", "==", user!.primaryEmailAddress?.emailAddress)));

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
          <CreateBrandBtn />
        </div>
      </div>
      {!brands.empty ?
        <div className="flex justify-center gap-8 w-full h-full flex-wrap">
          {brands.docs.map((brand, index) => (
            <div
              className="shadow-lg rounded-lg flex-col max-w-96
                p-6 hover:bg-gray-100 transition ease-in-out duration-300 h-full"
              key={index}
            >
              <div className="border-gray-500 border-2 flex justify-center items-center mb-8 border-opacity-30">
                {!brand.data().brandLogo ?
                  <Image
                    src={'/image-loading.png'}
                    alt="Placeholder image"
                    width={500}
                    height={500}
                  />
                  :
                  <img
                    alt="Generated image"
                    className="w-full"
                    src={`https://firebasestorage.googleapis.com/v0/b/rapid-marketing-ai.appspot.com/o/brand-logo%2F${brand.data().brandLogo.split("/")[1]}?alt=media&`}
                  />
                }
              </div>
              <div className="flex gap-4 items-center">
                <p className="text-xl font-bold my-2">{brand.data().brandName}</p>
                <span className="bg-purple-500 text-white rounded-full capitalize font-medium py-1 px-2">
                  {brand.data().brandType}
                </span>
              </div>
              {brand.data().brandDescription}
              <div className="flex gap-3 justify-end mt-8">
                <Link href={`/main/brands/edit/${brand.id}`}>
                  <Button text={<EditIcon />} />
                </Link>
                <DeleteBrandBtn brandId={brand.id} />
              </div>
            </div>
          ))}
        </div>
        :
        <div className="flex justify-center gap-8 w-full h-full items-center">
          <div
            className="
              shadow-lg rounded-lg flex-col w-96
              p-6 transition ease-in-out duration-300 h-full"
          >
            <div className="border-gray-500 border-2 flex 
                  justify-center items-center mb-8 border-opacity-30"
            >
              <Image
                src={'/image-loading.png'}
                alt="Placeholder image"
                width={500}
                height={500}
              />
            </div>
            <div className="flex gap-4 items-center">
              <p className="text-xl font-bold my-2">No brands found!</p>
              <span className="bg-purple-500 text-white rounded-full capitalize font-medium py-1 px-2">
                Brand
              </span>
            </div>
            Click the button on the top right to create a new brand.
            <div className="flex gap-3 justify-end mt-8">
              <Button text={<EditIcon />} />
              <Button text={<Trash2 />} />
            </div>
          </div>
        </div>
      }
    </div>
  )
}