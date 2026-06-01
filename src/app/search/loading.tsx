export default function Loading() {
  return (
    <div className="container max-w-6xl px-4 py-8 mx-auto space-y-6">
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="h-10 bg-muted rounded-full w-full animate-pulse" />
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 bg-muted rounded-full w-20 animate-pulse" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="aspect-[4/3] bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}
