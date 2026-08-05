export function MonumentDetailSkeleton() {
  return (
    <div className="min-h-screen bg-muted/50">
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="h-64 lg:h-96 bg-muted rounded-lg mb-4" />
              <div className="space-y-4">
                <div className="h-32 bg-muted rounded-lg" />
                <div className="h-24 bg-muted rounded-lg" />
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="h-8 bg-muted rounded w-3/4 mb-4" />
              <div className="h-6 bg-muted rounded w-1/4 mb-6" />
              <div className="space-y-4">
                <div className="h-32 bg-muted rounded-lg" />
                <div className="h-48 bg-muted rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
