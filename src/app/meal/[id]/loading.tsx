export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="h-8 bg-muted rounded w-40 animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-12 bg-muted rounded w-3/4 animate-pulse" />
          <div className="flex gap-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded-full w-28 animate-pulse" />
            ))}
          </div>
          <div className="aspect-square bg-muted rounded-2xl animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded w-32 animate-pulse" />
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
