import { Skeleton } from "@/components/ui/skeleton"

export function TyreCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden h-full flex flex-col sm:flex-row">
            {/* Image Section Skeleton */}
            <div className="relative bg-[#F9FAFB] p-4 w-full sm:w-48 md:w-56 shrink-0 flex flex-col justify-center aspect-square sm:aspect-auto">
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="w-full aspect-square flex items-center justify-center">
                    <Skeleton className="w-3/4 h-3/4 rounded-lg" />
                </div>
            </div>

            {/* Content Section Skeleton */}
            <div className="p-4 flex-1 flex flex-col">
                {/* Brand & Model */}
                <div className="mb-2 space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                    <Skeleton className="h-4 w-24" />
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="h-5 w-16 rounded-md" />
                    <Skeleton className="h-5 w-20 rounded-md" />
                    <Skeleton className="h-5 w-14 rounded-md" />
                </div>

                <div className="mt-auto">
                    {/* Price Chips */}
                    <div className="flex items-center gap-2 mb-3">
                        <Skeleton className="h-8 w-24 rounded-full" />
                        <Skeleton className="h-8 w-24 rounded-full" />
                    </div>

                    {/* Button */}
                    <Skeleton className="w-full h-10 rounded-lg" />
                </div>
            </div>
        </div>
    )
}
