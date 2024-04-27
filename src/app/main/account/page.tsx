import { Account } from "@/lib/definitions"
import { auth, firestore, storage } from "@/lib/firebase"
import UpdateForm from "@/ui/account/update-form"
import { currentUser } from "@clerk/nextjs/server"
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore"

export default async function AccountPage() {
  const user = await currentUser();

  const account = await getDocs(query(
    collection(firestore, "accounts"), 
    where("email", "==", user?.primaryEmailAddress?.emailAddress)
  ));

  if(!account.docs[0]) {
    await addDoc(collection(firestore, "accounts"), {
      email: user?.primaryEmailAddress?.emailAddress,
      openaiAPIKey: ''
    } as Account)
  }

  return (
    account.docs[0] &&
    <div className="h-screen w-full flex items-center justify-center">
      <UpdateForm 
        accountId={account.docs[0].id}
        account={account.docs[0].data() as Account}
      />
    </div>
  )
}