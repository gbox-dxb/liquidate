"use client"

import { Suspense, useState, useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { routes, type RouteConfig } from '@/config/routes'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { cn } from '@/lib/utils'

function renderRoutes(routeConfigs: RouteConfig[]) {
  return routeConfigs.map((route, index) => (
    <Route
      key={route.path + index}
      path={route.path}
      element={
        <Suspense fallback={<LoadingSpinner />}>
          {route.element}
        </Suspense>
      }
    >
      {route.children && renderRoutes(route.children)}
    </Route>
  ))
}

export function AppRouter() {
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const prevPathname = useRef(location.pathname)

  useEffect(() => {
    // Check if pathname actually changed (ignore query params/hashes if you want, 
    // but here we focus on major navigation)
    if (prevPathname.current !== location.pathname) {
      setLoading(true)
      setProgress(0)

      // Start progress bar animation
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev
          return prev + 5
        })
      }, 50)

      const timer = setTimeout(() => {
        setLoading(false)
        setProgress(100)
        clearInterval(interval)
        prevPathname.current = location.pathname
      }, 500) // Slightly longer to ensure visibility

      return () => {
        clearInterval(interval)
        clearTimeout(timer)
      }
    }
  }, [location.pathname])

  return (
    <div className="relative min-h-screen">
      {/* Top Progress Bar */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 h-1 bg-primary z-[10000] transition-all duration-300 ease-out",
          loading ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{ width: `${progress}%` }}
      />

      {/* Center Spinner Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-md transition-all duration-300 animate-in fade-in">
          <div className="flex flex-col items-center gap-4 scale-110">
            <LoadingSpinner size="lg" />
            <p className="text-sm font-medium animate-pulse text-muted-foreground tracking-widest uppercase">
              Loading...
            </p>
          </div>
        </div>
      )}

      <Routes>
        {renderRoutes(routes)}
      </Routes>
    </div>
  )
}
