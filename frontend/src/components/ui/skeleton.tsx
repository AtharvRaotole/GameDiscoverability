"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-[#1A2235]",
        className
      )}
    />
  );
}

export function GameCardSkeleton() {
  return (
    <div className="w-full max-w-[320px] overflow-hidden rounded-2xl border border-white/5 bg-[#12182B]/50">
      {/* Image */}
      <Skeleton className="aspect-[16/9] w-full" />
      
      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />
        
        {/* Tags */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        
        {/* Description */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        
        {/* Metadata */}
        <div className="flex gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

export function JourneyCardSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/5 bg-[#12182B]/50">
      <div className="p-6 space-y-4">
        {/* Header */}
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        
        {/* Game Preview */}
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-16 rounded-md" />
          ))}
        </div>
        
        {/* Arc */}
        <Skeleton className="h-1 w-full rounded-full" />
        
        {/* Metadata */}
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  );
}
