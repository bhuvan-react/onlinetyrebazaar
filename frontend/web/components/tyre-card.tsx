"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, Truck, ShoppingCart, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import type { Tyre } from "@/lib/tyre-data"
import useEmblaCarousel from "embla-carousel-react"
import { ImageViewer } from "./image-viewer"

interface TyreCardProps {
  tyre: Tyre
  isSelected: boolean
  onSelect: () => void
}

export function TyreCard({ tyre, isSelected, onSelect }: TyreCardProps) {
  // Default to "used" if available, otherwise "new"
  const [selectedVariant, setSelectedVariant] = useState<"new" | "used">(
    tyre.usedPrice ? "used" : "new"
  )
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  // Mock 4 images for the carousel (using the same image for demo purposes)
  // In a real app, these would be different views from the API
  const images = [
    tyre.imageUrl || "/placeholder.svg",
    tyre.imageUrl || "/placeholder.svg",
    tyre.imageUrl || "/placeholder.svg",
    tyre.imageUrl || "/placeholder.svg",
  ]

  const discount = tyre.originalPrice && tyre.price ? Math.round(((tyre.originalPrice - tyre.price) / tyre.originalPrice) * 100) : 0

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    emblaApi.on("select", onSelect)
    onSelect()

    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi])

  const scrollTo = (index: number) => {
    emblaApi && emblaApi.scrollTo(index)
  }

  const handleVariantSelect = (variant: "new" | "used") => {
    if (variant === "used" && !tyre.usedPrice) return
    setSelectedVariant(variant)
    if (!isSelected) {
      onSelect()
    }
  }

  const handleCardSelect = () => {
    if (!isSelected) {
      if (tyre.usedPrice) {
        setSelectedVariant("used")
      }
      onSelect()
    }
  }

  const scrollPrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    emblaApi?.scrollPrev()
  }

  const scrollNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    emblaApi?.scrollNext()
  }

  const openViewer = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsViewerOpen(true)
    setCurrentImageIndex(selectedIndex)
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden transition-all flex flex-col sm:flex-row ${isSelected
        ? selectedVariant === "new"
          ? "ring-2 ring-[#0D9488]"
          : "ring-2 ring-[#9333EA]"
        : ""
        } ${!tyre.inStock ? "opacity-75" : ""}`}
    >
      {/* Image Section - Left Side */}
      <div
        className="relative bg-[#F9FAFB] p-4 w-full sm:w-48 md:w-56 shrink-0 flex flex-col justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${selectedVariant === "new" ? "bg-[#10B981] text-white" : "bg-[#9333EA] text-white"
              }`}
          >
            {selectedVariant === "new" ? "🆕 New" : "♻️ Used"}
          </span>
          {discount > 0 && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white rounded-full text-[10px] font-semibold">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Carousel */}
        <div className="relative group/carousel">
          <div className="overflow-hidden rounded-xl" ref={emblaRef}>
            <div className="flex">
              {images.map((img, index) => (
                <div key={index} className="relative w-full aspect-square flex-[0_0_100%] min-w-0">
                  <Image
                    src={img}
                    alt={`${tyre.brand} ${tyre.pattern} view ${index + 1}`}
                    fill
                    className="object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={openViewer}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Controls */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-1 bg-white/80 hover:bg-white rounded-full shadow-sm opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10"
          >
            <ChevronLeft className="w-3 h-3 text-gray-700" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-1 bg-white/80 hover:bg-white rounded-full shadow-sm opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10"
          >
            <ChevronRight className="w-3 h-3 text-gray-700" />
          </button>

          {/* Maximize Button */}
          <button
            onClick={openViewer}
            className="absolute top-0 right-0 p-1 bg-white/80 hover:bg-white rounded-full shadow-sm opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10"
          >
            <Maximize2 className="w-3 h-3 text-gray-700" />
          </button>

          {/* Dots */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  scrollTo(index)
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${selectedIndex === index
                  ? "bg-[#0D9488] w-3"
                  : "bg-gray-300 hover:bg-gray-400"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {!tyre.inStock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="px-3 py-1 bg-[#1F2937] text-white rounded text-xs font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content Section - Right Side */}
      <div
        className="p-4 flex-1 flex flex-col cursor-pointer"
        onClick={handleCardSelect}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs font-medium text-[#0D9488] uppercase tracking-wide">{tyre.brand}</span>
            <h3 className="text-lg font-bold text-[#1F2937] leading-tight">{tyre.pattern}</h3>
            <p className="text-sm text-[#6B7280] mt-0.5">{tyre.size}</p>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-[#1F2937]">{tyre.rating || 0}</span>
            <span className="text-[10px] text-[#6B7280]">({tyre.reviewCount || 0})</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(tyre.features || []).slice(0, 3).map((feature) => (
            <span key={feature} className="px-2 py-0.5 bg-[#F9FAFB] text-[#6B7280] text-[10px] font-medium rounded-md border border-gray-100">
              {feature}
            </span>
          ))}
        </div>

        <div className="mt-auto">
          {/* Price Chips */}
          <div className="flex items-center gap-2 mb-3">
            {tyre.type !== "used" && tyre.newPrice && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleVariantSelect("new")
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all border ${isSelected && selectedVariant === "new"
                  ? "bg-[#0D9488] text-white border-[#0D9488]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#0D9488]"
                  }`}
              >
                New ₹{(tyre.newPrice || tyre.price).toLocaleString()}
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation()
                handleVariantSelect("used")
              }}
              disabled={!tyre.usedPrice}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all border ${!tyre.usedPrice
                ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
                : isSelected && selectedVariant === "used"
                  ? "bg-[#9333EA] text-white border-[#9333EA]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#9333EA]"
                }`}
            >
              Used {tyre.usedPrice ? `₹${tyre.usedPrice.toLocaleString()}` : "N/A"}
            </button>
          </div>

          {/* Buy Button */}
          <Link
            href={isSelected && tyre.inStock ? `/quote?tyreId=${tyre.id}` : "#"}
            onClick={(e) => e.stopPropagation()}
            className={`w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all text-sm ${isSelected && tyre.inStock
              ? selectedVariant === "new"
                ? "bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white hover:opacity-90 shadow-md shadow-teal-500/20"
                : "bg-[#9333EA] text-white hover:opacity-90 shadow-md shadow-purple-500/20"
              : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed pointer-events-none"
              }`}
            aria-disabled={!isSelected || !tyre.inStock}
          >
            <ShoppingCart className="w-4 h-4" />
            Get this Lead
          </Link>
        </div>
      </div>

      <ImageViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        images={images}
        initialIndex={currentImageIndex}
      />
    </div>
  )
}
