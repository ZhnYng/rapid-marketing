import Sidebar from "@/components/Sidebar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  
  if (!userId) redirect('/sign-in');

  if (userId) {
    return (
      <div className="md:flex min-h-screen">
        <Sidebar/>
        <div className="flex-[7] w-full h-full bg-gray-200 min-h-screen relative">
          {children}
        </div>
      </div>
    );
  }
}