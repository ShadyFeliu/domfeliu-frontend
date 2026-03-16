import { Skeleton } from '@/components/ui/Skeleton';

export const MusicSkeleton = () => {
  return (
    <div className="w-full max-w-3xl glass rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex flex-col gap-2 w-full sm:w-1/2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
      <div className="flex flex-col gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex justify-between items-center bg-black/40 border border-transparent p-4 rounded-xl">
            <div className="flex items-center gap-4 flex-1">
              <Skeleton className="h-4 w-4 rounded" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const EventSkeleton = () => {
  return (
    <div className="flex flex-col gap-12">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="w-full glass rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border border-white/5">
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center flex-1 w-full">
            <div className="flex items-center gap-6">
              <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl" />
              <Skeleton className="hidden sm:block w-24 h-24 rounded-2xl" />
            </div>
            <div className="flex flex-col gap-3 flex-1 w-full">
              <Skeleton className="h-8 w-3/4" />
              <div className="flex gap-4">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
          <Skeleton className="w-full md:w-40 h-10 rounded-xl" />
        </div>
      ))}
    </div>
  );
};
