import { Skeleton } from "@/components/ui/skeleton";

export default function OverviewSkeleton() {
  return (
    <div className="flex flex-col h-full w-full gap-6 md:gap-10">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
        <Skeleton className="w-48 h-12" />
        <Skeleton className="w-48 h-12" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="w-full grid grid-rows-4 md:grid-rows-none md:grid-cols-4 gap-4">
          <Skeleton className="w-full h-[110px]" />
          <Skeleton className="w-full h-[110px]" />
          <Skeleton className="w-full h-[110px]" />
          <Skeleton className="w-full h-[110px]" />
        </div>
        <Skeleton className="w-full h-[300px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="w-full h-[300px]" />
          <Skeleton className="w-full h-[300px]" />
        </div>
      </div>
    </div>
  );
}
