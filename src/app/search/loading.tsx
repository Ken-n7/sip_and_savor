// app/search/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-4">
      {/* Search bar skeleton */}
      <div className="h-12 bg-gray-100 rounded w-full max-w-3xl mx-auto"></div>
      
      {/* Tabs skeleton */}
      <div className="flex justify-center gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded w-24"></div>
        ))}
      </div>
      
      {/* Results skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-100 rounded"></div>
        ))}
      </div>
    </div>
  )
}