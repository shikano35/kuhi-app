export function HaikuListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4 p-4 border rounded-lg">
        <div className="h-4 bg-muted rounded w-24" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
        </div>
      </div>

      <div className="h-4 bg-muted rounded w-32" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div className="border rounded-lg overflow-hidden" key={index}>
            <div className="h-48 bg-muted" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
