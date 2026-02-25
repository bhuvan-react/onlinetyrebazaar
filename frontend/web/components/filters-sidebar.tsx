"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Star } from "lucide-react"
import { filterService, type FilterConfig } from "@/lib/services/filter-service"

interface FiltersSidebarProps {
  tyreType: "new" | "used" | "all"
  setTyreType: (type: "new" | "used" | "all") => void
  selectedBrands: string[]
  setSelectedBrands: (brands: string[]) => void
  selectedPriceRange: { min: number; max: number } | null
  setSelectedPriceRange: (range: { min: number; max: number } | null) => void
  minRating: number
  setMinRating: (rating: number) => void
  onClose?: () => void
  isMobile?: boolean
  brandCounts?: Record<string, number>
  availableSizes?: string[]
  selectedTyreSizes?: string[]
  setSelectedTyreSizes?: (sizes: string[]) => void
}

export function FiltersSidebar({
  tyreType,
  setTyreType,
  selectedBrands,
  setSelectedBrands,
  selectedPriceRange,
  setSelectedPriceRange,
  minRating,
  setMinRating,
  onClose,
  isMobile = false,
  brandCounts = {},
  availableSizes = [],
  selectedTyreSizes = [],
  setSelectedTyreSizes,
}: FiltersSidebarProps) {
  const [brands, setBrands] = useState<string[]>([])
  const [priceRanges, setPriceRanges] = useState<FilterConfig[]>([])
  const [ratings, setRatings] = useState<FilterConfig[]>([])

  const [showAllSizes, setShowAllSizes] = useState(false)
  const [showAllBrands, setShowAllBrands] = useState(false)

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [fetchedBrands, fetchedPriceRanges, fetchedRatings] = await Promise.all([
          filterService.getBrands(),
          filterService.getPriceRanges(),
          filterService.getRatings(),
        ])
        setBrands(fetchedBrands)
        setPriceRanges(fetchedPriceRanges)
        setRatings(fetchedRatings)
      } catch (error) {
        console.error("Failed to load filters:", error)
      }
    }
    fetchFilters()
  }, [])

  const isBrandChecked = (brand: string) => {
    return selectedBrands.includes(brand)
  }

  const handleBrandToggle = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
    } else {
      setSelectedBrands([...selectedBrands, brand])
    }
  }

  const handleSizeToggle = (size: string) => {
    if (setSelectedTyreSizes) {
      if (selectedTyreSizes.includes(size)) {
        setSelectedTyreSizes(selectedTyreSizes.filter((s) => s !== size))
      } else {
        setSelectedTyreSizes([...selectedTyreSizes, size])
      }
    }
  }

  const handleClearAll = () => {
    setTyreType("all")
    setSelectedBrands([])
    setSelectedPriceRange(null)
    setMinRating(0)
    if (setSelectedTyreSizes) setSelectedTyreSizes([])
  }

  // Derive display sizes
  const displaySizes = [...availableSizes].sort((a, b) => {
    const aSelected = selectedTyreSizes.includes(a)
    const bSelected = selectedTyreSizes.includes(b)
    if (aSelected && !bSelected) return -1
    if (!aSelected && bSelected) return 1
    return a.localeCompare(b)
  })
  
  const visibleSizes = showAllSizes ? displaySizes : displaySizes.slice(0, 5)

  // Derive display brands
  const displayBrands = [...brands].sort((a, b) => {
    const aChecked = isBrandChecked(a)
    const bChecked = isBrandChecked(b)
    if (aChecked && !bChecked) return -1
    if (!aChecked && bChecked) return 1
    
    // Sort by count descending
    const countA = brandCounts[a] || 0
    const countB = brandCounts[b] || 0
    if (countA > countB) return -1
    if (countA < countB) return 1
    
    // Fallback alphanumeric
    return a.localeCompare(b)
  })

  const visibleBrands = showAllBrands ? displayBrands : displayBrands.slice(0, 5)

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#1F2937]">🔧 Filters</h3>
        {isMobile && onClose && (
          <button onClick={onClose} className="p-2 hover:bg-[#F9FAFB] rounded-lg">
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        )}
      </div>

      <div className="h-px bg-gray-100" />

      {/* Tyre Size */}
      {availableSizes.length > 0 && (
        <>
          <div>
            <h4 className="text-sm font-medium text-[#1F2937] mb-3">Tyre Size</h4>
            <div className="space-y-2">
              {visibleSizes.map((size) => (
                <label key={size} className="flex items-center gap-3 cursor-pointer group">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedTyreSizes.includes(size)
                      ? "bg-[#0D9488] border-[#0D9488]"
                      : "border-[#D1D5DB] group-hover:border-[#0D9488]"
                      }`}
                  >
                    {selectedTyreSizes.includes(size) && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedTyreSizes.includes(size)}
                    onChange={() => handleSizeToggle(size)}
                    className="sr-only"
                  />
                  <span className="text-[#1F2937] text-sm">{size}</span>
                </label>
              ))}
            </div>
            {displaySizes.length > 5 && (
              <button
                onClick={() => setShowAllSizes(!showAllSizes)}
                className="mt-3 text-[#0D9488] text-sm font-medium hover:underline"
              >
                {showAllSizes ? "Show Less" : `+${displaySizes.length - 5} More`}
              </button>
            )}
          </div>
          <div className="h-px bg-gray-100" />
        </>
      )}

      {/* Tyre Condition */}
      {/* <div>
        <h4 className="text-sm font-medium text-[#1F2937] mb-3">Tyre Condition</h4>
        <div className="flex gap-2">
          {(["all", "new", "used"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTyreType(type)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${tyreType === type
                ? type === "used"
                  ? "bg-[#9333EA] text-white"
                  : "bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white"
                : type === "used"
                  ? "bg-[#F9FAFB] text-[#6B7280] hover:bg-[#FAF5FF] hover:text-[#9333EA]"
                  : "bg-[#F9FAFB] text-[#6B7280] hover:bg-[#F0FDFA] hover:text-[#0D9488]"
                }`}
            >
              {type === "all" ? "All" : type === "new" ? "🆕 New" : "♻️ Used"}
            </button>
          ))}
        </div>
      </div> */}

      <div>
        <h4 className="text-sm font-medium text-[#1F2937] mb-3">Brands</h4>
        <div className="space-y-2">
          {visibleBrands.map((brand) => {
            const checked = isBrandChecked(brand)
            return (
              <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${checked
                    ? "bg-[#0D9488] border-[#0D9488]"
                    : "border-[#D1D5DB] group-hover:border-[#0D9488]"
                    }`}
                >
                  {checked && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleBrandToggle(brand)}
                  className="sr-only"
                />
                <span className="text-[#1F2937] text-sm">
                  {brand} <span className="text-gray-400">({brandCounts[brand] || 0})</span>
                </span>
              </label>
            )
          })}
        </div>
        {displayBrands.length > 5 && (
          <button
            onClick={() => setShowAllBrands(!showAllBrands)}
            className="mt-3 text-[#0D9488] text-sm font-medium hover:underline"
          >
            {showAllBrands ? "Show Less" : `+${displayBrands.length - 5} More`}
          </button>
        )}
      </div>

      <div className="h-px bg-gray-100" />

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-medium text-[#1F2937] mb-3">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map((range) => {
            const min = Number(range.minValue)
            const max = range.maxValue ? Number(range.maxValue) : Number.POSITIVE_INFINITY
            return (
              <label key={range.id} className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedPriceRange?.min === min && selectedPriceRange?.max === max
                    ? "border-[#0D9488]"
                    : "border-[#D1D5DB] group-hover:border-[#0D9488]"
                    }`}
                >
                  {selectedPriceRange?.min === min && selectedPriceRange?.max === max && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 bg-[#0D9488] rounded-full"
                    />
                  )}
                </div>
                <input
                  type="radio"
                  name="priceRange"
                  checked={selectedPriceRange?.min === min && selectedPriceRange?.max === max}
                  onChange={() => setSelectedPriceRange({ min, max })}
                  className="sr-only"
                />
                <span className="text-[#1F2937] text-sm">{range.label}</span>
              </label>
            )
          })}
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Rating */}
      <div>
        <h4 className="text-sm font-medium text-[#1F2937] mb-3">Minimum Rating</h4>
        <div className="flex gap-2">
          {ratings.map((ratingOption) => {
            const ratingValue = Number(ratingOption.minValue)
            return (
              <button
                key={ratingOption.id}
                onClick={() => setMinRating(ratingValue)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all ${minRating === ratingValue ? "bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white" : "bg-[#F9FAFB] text-[#6B7280] hover:bg-[#F0FDFA]"
                  }`}
              >
                {ratingValue === 0 ? (
                  ratingOption.label
                ) : (
                  <>
                    {ratingValue}
                    <Star className="w-3 h-3 fill-current" />
                  </>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Clear All */}
      <button
        onClick={handleClearAll}
        className="w-full py-2 text-[#0D9488] font-medium hover:bg-[#F0FDFA] rounded-lg transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  )

  if (isMobile) {
    return content
  }

  return <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6 sticky top-24">{content}</div>
}
