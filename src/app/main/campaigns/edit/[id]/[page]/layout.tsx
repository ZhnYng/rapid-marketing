import EditCampaignSidebar from "@/ui/campaign/edit/sidebar";

export default function Layout({
  params,
  children
}: Readonly<{
  params: {id: string}
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen p-8">
      <EditCampaignSidebar campaignId={params.id} />
      {/* Main content - form */}
      <div className="p-8 flex-[5] relative flex justify-center">
        <div className="max-w-4xl w-full">
          {children}
        </div>
      </div>
    </div>
  )
}

