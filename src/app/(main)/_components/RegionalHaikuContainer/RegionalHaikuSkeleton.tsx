export function RegionalHaikuSkeleton() {
  return (
    <section className="py-32">
      <div className="container mx-auto px-4">
        <div className="h-8 bg-muted rounded w-48 mx-auto mb-8" />

        <div className="flex flex-wrap justify-center mb-8 gap-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <div className="h-8 bg-muted rounded-full w-16" key={index} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
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

        <div className="text-center mt-8">
          <div className="h-12 bg-muted rounded-full w-32 mx-auto" />
        </div>
      </div>
    </section>
  );
}
