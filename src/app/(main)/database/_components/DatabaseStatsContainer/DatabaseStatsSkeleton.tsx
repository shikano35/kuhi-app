export function DatabaseStatsSkeleton() {
  return (
    <div aria-hidden className="space-y-20">
      <div className="rounded-3xl bg-muted/50 px-6 py-14 sm:px-12">
        <div className="h-8 w-80 max-w-full bg-muted rounded mx-auto animate-pulse" />
        <div className="h-4 w-96 max-w-full bg-muted rounded mx-auto mt-6 animate-pulse" />
        <div className="flex justify-center gap-3 mt-10 mb-14">
          <div className="h-10 w-48 bg-muted rounded-full animate-pulse" />
          <div className="h-10 w-56 bg-muted rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-3 gap-3 sm:gap-5 max-w-2xl mx-auto">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              className="h-28 rounded-2xl bg-background/80 animate-pulse"
              key={index}
            />
          ))}
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            className="rounded-2xl border border-border/70 p-7 space-y-5"
            key={index}
          >
            <div className="h-5 w-24 bg-muted rounded animate-pulse" />
            <div className="h-3 w-full bg-muted rounded animate-pulse" />
            {Array.from({ length: 5 }).map((_, row) => (
              <div className="space-y-2" key={row}>
                <div className="h-3 bg-muted rounded animate-pulse" />
                <div className="h-1.5 bg-muted rounded-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
