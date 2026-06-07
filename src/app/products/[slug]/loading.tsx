function Bone({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted/60 ${className ?? ""}`}
    />
  );
}

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">

      {/* Breadcrumb skeleton */}
      <div className="mb-8 flex items-center gap-2">
        <Bone className="h-3.5 w-12" />
        <Bone className="h-3.5 w-3" />
        <Bone className="h-3.5 w-20" />
        <Bone className="h-3.5 w-3" />
        <Bone className="h-3.5 w-40" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

        {/* Image skeleton */}
        <Bone className="aspect-[4/3] w-full rounded-2xl" />

        {/* Details skeleton */}
        <div className="flex flex-col gap-5">

          {/* Category */}
          <Bone className="h-4 w-24" />

          {/* Title */}
          <Bone className="h-9 w-3/4" />

          {/* Rating */}
          <Bone className="h-5 w-40" />

          {/* urgency / social proof */}
          <Bone className="h-16 w-full rounded-lg" />

          {/* price */}
          <Bone className="h-10 w-32" />

          {/* stock line */}
          <Bone className="h-4 w-48" />

          {/* description preview */}
          <Bone className="h-20 w-full rounded-lg" />

          {/* actions */}
          <Bone className="h-12 w-full rounded-lg" />

          {/* trust badges */}
          <div className="grid grid-cols-2 gap-3">
            <Bone className="h-12 w-full rounded-xl" />
            <Bone className="h-12 w-full rounded-xl" />
            <Bone className="h-12 w-full rounded-xl" />
            <Bone className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}