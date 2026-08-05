export function TodaysHaikuSkeleton() {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-linear-to-br from-primary via-primary/90 to-accent-purple" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="flex justify-center mb-8">
          <div className="h-8 w-28 bg-primary-foreground/20 rounded-full animate-pulse" />
        </div>

        <div className="space-y-3 mb-8">
          <div className="h-10 w-3/4 mx-auto bg-primary-foreground/20 rounded animate-pulse" />
        </div>

        <div className="flex justify-center mb-6">
          <div className="h-6 w-32 bg-primary-foreground/20 rounded animate-pulse" />
        </div>

        <div className="flex justify-center mb-10">
          <div className="h-5 w-40 bg-primary-foreground/20 rounded animate-pulse" />
        </div>

        <div className="flex justify-center">
          <div className="h-12 w-40 bg-primary-foreground/20 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
