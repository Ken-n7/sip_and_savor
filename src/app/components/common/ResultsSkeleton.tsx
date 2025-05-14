// ResultsSkeleton.tsx
export default function ResultsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-1/4 bg-gray-200 rounded"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  )
}