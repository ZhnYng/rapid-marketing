"use client"

import Button from "@/components/Button"
import { auth, firestore, storage } from "@/lib/firebase"
import { Timestamp, addDoc, collection, doc, query, updateDoc, where } from "firebase/firestore"
import { Loader2, User } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection } from "react-firebase-hooks/firestore"
import toast from "react-hot-toast"

type Account = {
  email: string;
  openaiAPIKey: string;
}

export default function AccountPage() {
  const [ user ] = useAuthState(auth);
  const [account, loading, error] = useCollection(query(collection(firestore, "accounts"), where("email", "==", user!.email)));

  const [accountData, setAccountData] = useState<Account>({
    email: '',
    openaiAPIKey: ''
  })

  useEffect(() => {
    if(account){
      setAccountData(account.docs[0].data() as Account)
    }
  }, [account])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setAccountData({
      ...accountData,
      [name]: value,
    });
  }

  return (
    loading ? 
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <Loader2 className="animate-spin" />
    </div>
    :
    user && account && 
      <div className="h-screen w-full flex items-center justify-center">
        <form 
          className="w-full max-w-md bg-white p-8 rounded-lg"
          onSubmit={async (e) => {
            e.preventDefault();
            await updateDoc(doc(firestore, "accounts", account.docs[0].id), {...accountData, timestamp: Timestamp.now()});
            toast.success("Details saved!")
          }}
        >
          <h1 className="text-xl flex gap-1 mb-5"><User /> Account</h1>
          <div className="mb-4" id="email">
            <label
              htmlFor="email"
              className="block text-gray-800 font-semibold mb-2"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Email"
              disabled
              value={user?.email || ''}
              className="w-full border-2 rounded-md p-2 focus:outline-none focus:border-black"
            />
          </div>
          <div className="mb-4" id="uid">
            <label
              htmlFor="uid"
              className="block text-gray-800 font-semibold mb-2"
            >
              UserID
            </label>
            <input
              type="text"
              id="uid"
              name="uid"
              placeholder="uid"
              disabled
              value={user?.uid || ''}
              className="w-full border-2 rounded-md p-2 focus:outline-none focus:border-black"
            />
          </div>
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
              placeholder="Enter API key here"
              className="w-full border-2 rounded-md p-2 focus:outline-none focus:border-black"
              value={accountData.openaiAPIKey}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end">
            <Button text="Save"/>
          </div>
        </form>
      </div>
  )
}