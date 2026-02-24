"use client"

import { Suspense, useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setVehicleType, setMake, setModel, initializeAuth, initializeSearch } from "@/lib/store"
import { FiltersSidebar } from "@/components/filters-sidebar"
import { TyreCard } from "@/components/tyre-card"
import { TyreCardSkeleton } from "@/components/tyre-card-skeleton"
import { MobileFiltersSheet } from "@/components/mobile-filters-sheet"
import { tyreService } from "@/lib/services/tyre-service"
import { type Tyre, vehicleTyreSizes, getAllUniqueSizes } from "@/lib/tyre-data"
import { ChevronRight, SlidersHorizontal, Grid, List } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function SearchContent() {
  const search = useAppSelector((state) => state.search)
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()

  // Filter states
  const [tyreType, setTyreType] = useState<"new" | "used" | "all">("all")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number } | null>(null)
  const [minRating, setMinRating] = useState(0)
  const [selectedTyreSizes, setSelectedTyreSizes] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"popular" | "price-low" | "price-high" | "rating">("popular")
  const [selectedTyre, setSelectedTyre] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(12)
  const [tyres, setTyres] = useState<Tyre[]>([])

  // Determine available tyre sizes based on vehicle selection
  const availableSizes = useMemo(() => {
    if (search.make && search.model && search.variant && vehicleTyreSizes[search.make]?.[search.model]?.[search.variant]) {
      return vehicleTyreSizes[search.make][search.model][search.variant]
    }
    // If no specific vehicle selected (or data missing), show all unique sizes from our tyre data
    return getAllUniqueSizes()
  }, [search.make, search.model, search.variant])

  // Initialize auth and search
  useEffect(() => {
    dispatch(initializeAuth())
    dispatch(initializeSearch())
  }, [dispatch])

  // Fetch tyres
  useEffect(() => {
    const fetchTyres = async () => {
      setIsLoading(true)
      try {
        const filters = {
          size: search.tyreSize || undefined,
          brand: selectedBrands.length > 0 ? selectedBrands[0] : undefined,
          categoryId: searchParams.get("categoryId") || undefined,
        }
        const response = await tyreService.getAllTyres(filters)
        setTyres(response.data)
      } catch (error) {
        console.error("Failed to fetch tyres:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTyres()
  }, [search.make, search.model, search.variant, search.tyreSize, search.vehicleType, selectedBrands])

  // Handle query params
  useEffect(() => {
    const make = searchParams.get("make")
    const model = searchParams.get("model")
    const brand = searchParams.get("brand")

    if (make) {
      dispatch(setVehicleType("4W")) // Default to 4W for now, or infer from somewhere
      dispatch(setMake(make))
      if (model) {
        dispatch(setModel(model))
      }
    }

    if (brand) {
      setSelectedBrands([brand])
    }
  }, [searchParams, dispatch])

  // Sync store tyreSize to local filter
  useEffect(() => {
    if (search.tyreSize) {
      setSelectedTyreSizes([search.tyreSize])
    }
  }, [search.tyreSize])

  // Simulate loading on mount and filter change
  useEffect(() => {
    setIsLoading(true)
    setVisibleCount(12) // Reset visible count on filter change
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [tyreType, selectedBrands, selectedTyreSizes, selectedPriceRange, minRating, sortBy, search.make, search.model])

  // Filter and sort tyres
  const filteredTyres = useMemo(() => {
    let result = [...tyres]

    // Filter by type
    if (tyreType !== "all") {
      result = result.filter((t) => t.type === tyreType)
    }

    // Filter by brands
    if (selectedBrands.length > 0) {
      result = result.filter((t) => selectedBrands.includes(t.brand))
    }

    // Filter by tyre size
    if (selectedTyreSizes.length > 0) {
      result = result.filter((t) => selectedTyreSizes.includes(t.size))
    }

    // Filter by price range
    if (selectedPriceRange) {
      result = result.filter((t) => t.price >= selectedPriceRange.min && t.price <= selectedPriceRange.max)
    }

    // Filter by rating
    if (minRating > 0) {
      result = result.filter((t) => t.rating >= minRating)
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount)
    }

    return result
  }, [tyreType, selectedBrands, selectedTyreSizes, selectedPriceRange, minRating, sortBy, tyres])

  // Calculate brand counts based on current filters (except brand filter)
  const brandCounts = useMemo(() => {
    let result = [...tyres]

    // Filter by type
    if (tyreType !== "all") {
      result = result.filter((t) => t.type === tyreType)
    }

    // Filter by price range
    if (selectedPriceRange) {
      result = result.filter((t) => t.price >= selectedPriceRange.min && t.price <= selectedPriceRange.max)
    }

    // Filter by rating
    if (minRating > 0) {
      result = result.filter((t) => t.rating >= minRating)
    }

    // Filter by tyre size
    if (selectedTyreSizes.length > 0) {
      result = result.filter((t) => selectedTyreSizes.includes(t.size))
    }

    // Count brands
    const counts: Record<string, number> = {}
    result.forEach((t) => {
      counts[t.brand] = (counts[t.brand] || 0) + 1
    })
    return counts
  }, [tyreType, selectedPriceRange, minRating, selectedTyreSizes, tyres])

  const vehicleString = search.vehicleType
    ? `${search.make || ""} ${search.model || ""} ${search.variant || ""}`.trim()
    : "All Vehicles"

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-[#6B7280] hover:text-[#0D9488] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            <span className="text-[#1F2937] font-medium">Search Results</span>
            {search.vehicleType && (
              <>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
                <span className="text-[#0D9488] font-medium">{vehicleString}</span>
              </>
            )}
            {search.pincode && (
              <>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
                <span className="text-[#6B7280]">📍 {search.pincode}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1F2937]">
              {search.vehicleType ? `Tyres for ${vehicleString}` : "🛞 Browse All Tyres"}
            </h1>
            <p className="text-[#6B7280] mt-1">
              {filteredTyres.length} tyres found{search.pincode ? ` • Delivery to ${search.pincode}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#0D9488] transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5 text-[#6B7280]" />
              <span className="text-[#1F2937] font-medium">Filters</span>
            </button>

            {/* View Mode Toggle */}
            {/* <div className="hidden sm:flex items-center bg-white border border-[#E5E7EB] rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white" : "text-[#6B7280] hover:bg-[#F9FAFB]"
                  }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white" : "text-[#6B7280] hover:bg-[#F9FAFB]"
                  }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div> */}

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[180px] bg-white border-[#E5E7EB] rounded-xl text-[#1F2937]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FiltersSidebar
              tyreType={tyreType}
              setTyreType={setTyreType}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              selectedPriceRange={selectedPriceRange}
              setSelectedPriceRange={setSelectedPriceRange}
              minRating={minRating}
              setMinRating={setMinRating}
              brandCounts={brandCounts}
              availableSizes={availableSizes}
              selectedTyreSizes={selectedTyreSizes}
              setSelectedTyreSizes={setSelectedTyreSizes}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div
                className={
                  viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"
                }
              >
                {[...Array(6)].map((_, i) => (
                  <TyreCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredTyres.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "flex flex-col gap-4"
                  }
                >
                  {filteredTyres.slice(0, visibleCount).map((tyre) => (
                    <TyreCard
                      key={tyre.id}
                      tyre={tyre}
                      isSelected={selectedTyre === tyre.id}
                      onSelect={() => setSelectedTyre(selectedTyre === tyre.id ? null : tyre.id)}
                    />
                  ))}
                </div>
                {visibleCount < filteredTyres.length && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 12)}
                      className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent hover:border-[#0D9488] hover:text-[#0D9488] transition-colors shadow-sm"
                    >
                      Load More Tyres
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-xl font-semibold text-[#1F2937] mb-2">No tyres found</h3>
                <p className="text-[#6B7280] mb-6">Try adjusting your filters to see more results</p>
                <button
                  onClick={() => {
                    setTyreType("all")
                    setSelectedBrands([])
                    setSelectedPriceRange(null)
                    setMinRating(0)
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Bottom Sheet */}
      <MobileFiltersSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        tyreType={tyreType}
        setTyreType={setTyreType}
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
        selectedPriceRange={selectedPriceRange}
        setSelectedPriceRange={setSelectedPriceRange}
        minRating={minRating}
        setMinRating={setMinRating}
        resultCount={filteredTyres.length}
        brandCounts={brandCounts}
        availableSizes={availableSizes}
        selectedTyreSizes={selectedTyreSizes}
        setSelectedTyreSizes={setSelectedTyreSizes}
      />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
