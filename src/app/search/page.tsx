'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SearchBar } from '../components/common/SearchBar'
import SearchResults from '../components/common/SearchResults'
import {SearchTabs}  from '../components/common/SearchTabs'
// import { SearchParams } from '../lib/types'

type currentCategory = 'drink' | 'meal' | 'all'

export interface SearchParams {
  params:{
    q?: string,
    category: currentCategory
  }
}

export default function Page() {
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || 'all'
  const query = searchParams.get('q') || ''

  return (
    <div className="container mx-auto px-4 py-8 pt-31">
      <div className="max-w-3xl mx-auto mb-4">
        <SearchBar 
          initialValue={query}
          className="w-full"
        />
      </div>

      <SearchTabs currentCategory={currentCategory} query={query} />

      <Suspense fallback={<SearchSkeleton />}>
        <SearchResults searchParams={{ q: query, category: currentCategory as currentCategory}} />
      </Suspense>
    </div>
  )
}



function SearchSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, j) => (
              <div key={j} className="border rounded-lg p-4">
                <div className="h-40 bg-gray-100 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}