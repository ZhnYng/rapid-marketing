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
    <div className="justify-self-end place-self-end bg-gray-300 rounded-md w-32 h-8"/>
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