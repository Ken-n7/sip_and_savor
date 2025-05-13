// app/meals/[id]/loading.tsx
export default function Loading() {
  return (
    <div className="w-1/2 mx-auto py-8 space-y-8">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-100 rounded w-3/4 max-w-md"></div>
        <div className="h-4 bg-gray-100 rounded w-1/2 max-w-xs"></div>
      </div>
      
      {/* Image and ingredients skeleton */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100 rounded-lg"></div>
        <div className="space-y-4">
          <div className="h-6 bg-gray-100 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex gap-2">
                <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Instructions skeleton */}
      <div className="space-y-2">
        <div className="h-6 bg-gray-100 rounded w-1/4"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-100 rounded w-full"></div>
        ))}
      </div>
    </div>
  );
}