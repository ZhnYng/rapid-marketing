"use client"

import Button from "@/components/Button";
import { Account } from "@/lib/definitions";
import { firestore } from "@/lib/firebase";
import { useUser } from "@clerk/nextjs";
import { doc, updateDoc } from "firebase/firestore";
import { Key, LucideKeyRound, User } from "lucide-react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";

export default function Form({ accountId, account }: { accountId:string, account: Account }) {
  return (
    <form
      className="w-full max-w-md bg-white p-8 rounded-lg"
      action={async (formData) => {
        try {
          await updateDoc(doc(firestore, "accounts", accountId), {
            ...account,
            openaiAPIKey: formData.get('openaiAPIKey'),
          })
          toast.success("Account updated!")
        } catch (error) {
          toast.error("Failed to update accounts!")
        }
      }}
    >
      <h1 className="text-xl flex gap-1 mb-5"><LucideKeyRound /> API Keys</h1>
      <div className="mb-4" id="openaiAPIKey">
        <label
          htmlFor="openaiAPIKey"
          className="block text-gray-800 font-semibold mb-2"
        >
          OpenAI API Key
        </label>
        <input
          type="text"
          id="openaiAPIKey"
          name="openaiAPIKey"
          defaultValue={account.openaiAPIKey}
          placeholder="Enter API key here"
          className="w-full border-2 rounded-md p-2 focus:outline-none focus:border-black"
        />
      </div>
      <div className="flex justify-end">
        <Button text="Save" />
      </div>
    </form>
  )
}