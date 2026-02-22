"use client"

import { motion, AnimatePresence } from "framer-motion"
import { FiltersSidebar } from "./filters-sidebar"

interface MobileFiltersSheetProps {
  isOpen: boolean
  onClose: () => void
  tyreType: "new" | "used" | "all"
  setTyreType: (type: "new" | "used" | "all") => void
  selectedBrands: string[]
  setSelectedBrands: (brands: string[]) => void
  selectedPriceRange: { min: number; max: number } | null
  setSelectedPriceRange: (range: { min: number; max: number } | null) => void
  minRating: number
  setMinRating: (rating: number) => void
  resultCount: number
  brandCounts?: Record<string, number>
  availableSizes?: string[]
  selectedTyreSizes?: string[]
  setSelectedTyreSizes?: (sizes: string[]) => void
}

export function MobileFiltersSheet({
  isOpen,
  onClose,
  tyreType,
  setTyreType,
  selectedBrands,
  setSelectedBrands,
  selectedPriceRange,
  setSelectedPriceRange,
  minRating,
  setMinRating,
  resultCount,
  brandCounts = {},
  availableSizes = [],
  selectedTyreSizes = [],
  setSelectedTyreSizes,
}: MobileFiltersSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 lg:hidden max-h-[85vh] overflow-y-auto"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-[#E5E7EB] rounded-full" />
            </div>

            {/* Content */}
            <div className="p-6">
              <FiltersSidebar
                tyreType={tyreType}
                setTyreType={setTyreType}
                selectedBrands={selectedBrands}
                setSelectedBrands={setSelectedBrands}
                selectedPriceRange={selectedPriceRange}
                setSelectedPriceRange={setSelectedPriceRange}
                minRating={minRating}
                setMinRating={setMinRating}
                onClose={onClose}
                isMobile={true}
                brandCounts={brandCounts}
                availableSizes={availableSizes}
                selectedTyreSizes={selectedTyreSizes}
                setSelectedTyreSizes={setSelectedTyreSizes}
              />

              {/* Apply Button */}
              <button
                onClick={onClose}
                className="w-full mt-6 py-4 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Show {resultCount} Results
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
