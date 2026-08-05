export function MapSkeleton() {
  return (
    <div className="fixed inset-0 w-full h-screen bg-muted">
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-3" />
          <p className="text-primary">地図データを読み込み中...</p>
        </div>
      </div>

      <div className="fixed top-4 left-4 w-80 bg-background rounded-lg shadow-lg">
        <div className="p-3 border-b">
          <div className="h-4 bg-muted rounded w-16" />
        </div>
        <div className="p-4 space-y-4">
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}
