"use client"

import Button from "@/components/Button";
import { firestore } from "@/lib/firebase";
import { useUser } from "@clerk/nextjs";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { PlusSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateBrandBtn() {
  const router = useRouter();
  const { user } = useUser();

  return (
    <Button
      onClickAction={async () => {
        const document = await addDoc(collection(firestore, "brands"), {
          email: user?.primaryEmailAddress?.emailAddress,
          timestamp: Timestamp.now()
        });
        router.push(`/main/brands/edit?id=${document.id}`);
      }}
      text={
        <div className="flex gap-2">
          New Brand <PlusSquare />
        </div>
      }
    />
  )
}