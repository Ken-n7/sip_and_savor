'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

export function SearchTabs({
  currentCategory,
  query
}: {
  currentCategory: string
  query: string
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Memoize tabs to prevent unnecessary re-renders
  const tabs = useMemo(() => [
    { id: 'all', label: 'All' },
    { id: 'meal', label: 'Meals' },
    { id: 'drink', label: 'Cocktails' },
  ], [])

  // Optimize href generation
  const tabHrefs = useMemo(() => {
    return tabs.map(tab => {
      const params = new URLSearchParams(searchParams)
      params.set('q', query)
      if (tab.id !== 'all') {
        params.set('category', tab.id)
      } else {
        params.delete('category')
      }
      return `${pathname}?${params.toString()}`
    })
  }, [tabs, query, searchParams, pathname])

  return (
    <div className="flex justify-center mb-8">
      <nav aria-label="Search categories">
        <div className="flex relative border-b border-gray-200">
          {tabs.map((tab, index) => (
            <Link
              key={tab.id}
              href={tabHrefs[index]}
              className={`relative px-6 py-2 text-sm font-medium sm:px-10 ${
                currentCategory === tab.id
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              prefetch={true}
              aria-current={currentCategory === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}