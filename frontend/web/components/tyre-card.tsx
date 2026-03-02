"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Star, Truck, ShoppingCart, ChevronLeft, ChevronRight, Maximize2, Loader2 } from "lucide-react"
import type { Tyre } from "@/lib/tyre-data"
import useEmblaCarousel from "embla-carousel-react"
import { ImageViewer } from "./image-viewer"
import { OtpModal } from "./otp-modal"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setLeadId } from "@/lib/store"
import { leadService } from "@/lib/services/lead-service"

interface TyreCardProps {
  tyre: Tyre
  isSelected: boolean
  onSelect: () => void
}

function mapVehicleType(v: string | null): string {
  if (v === "2W") return "TWO_WHEELER"
  if (v === "3W") return "THREE_WHEELER"
  return "FOUR_WHEELER"
}

export function TyreCard({ tyre, isSelected, onSelect }: TyreCardProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const searchState = useAppSelector((state) => state.search)

  // Default variant based on tyre.type from DB — "used" tyres start on Used tab
  const [selectedVariant, setSelectedVariant] = useState<"new" | "used">(
    tyre.type === "used" ? "used" : "new"
  )
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  // Lead creation state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [pendingVariant, setPendingVariant] = useState<"new" | "used">("new")
  const [localPincode, setLocalPincode] = useState("")
  const [showPincodeForm, setShowPincodeForm] = useState(false)

  // Mock 4 images for the carousel
  const images = [
    tyre.image || "/placeholder.svg",
    tyre.image || "/placeholder.svg",
    tyre.image || "/placeholder.svg",
    tyre.image || "/placeholder.svg",
  ]

  const discount = selectedVariant === "new" && tyre.originalPrice && tyre.newPrice
    ? Math.round(((tyre.originalPrice - tyre.newPrice) / tyre.originalPrice) * 100)
    : selectedVariant === "used" && tyre.newPrice && tyre.usedPrice
      ? Math.round(((tyre.newPrice - tyre.usedPrice) / tyre.newPrice) * 100)
      : 0

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    onSelect()
    return () => { emblaApi.off("select", onSelect) }
  }, [emblaApi])

  const scrollTo = (index: number) => emblaApi && emblaApi.scrollTo(index)
  const handleVariantSelect = (variant: "new" | "used") => {
    if (variant === "used" && !tyre.usedPrice) return
    setSelectedVariant(variant)
    if (!isSelected) onSelect()
  }
  const handleCardSelect = () => { if (!isSelected) onSelect() }
  const scrollPrev = (e: React.MouseEvent) => { e.stopPropagation(); emblaApi?.scrollPrev() }
  const scrollNext = (e: React.MouseEvent) => { e.stopPropagation(); emblaApi?.scrollNext() }
  const openViewer = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsViewerOpen(true)
    setCurrentImageIndex(selectedIndex)
  }

  // ── Core: build and submit the lead immediately ──
  const createLeadAndNavigate = useCallback(async (variant: "new" | "used") => {
    setIsSubmitting(true)
    const pincode = searchState.pincode || localPincode || "000000"
    const city = searchState.city || "Unknown"
    const vType = searchState.vehicleType || "4W"
    const make = searchState.make || ""
    const model = searchState.model || ""
    const vehicleModel = [make, model].filter(Boolean).join(" ") || tyre.pattern || tyre.brand

    const payload = {
      vehicleType: mapVehicleType(vType),
      tyreType: variant === "new" ? "NEW" : "USED",
      tyreBrand: tyre.brand,
      vehicleModel,
      locationArea: city,
      locationPincode: pincode.padEnd(6, "0").slice(0, 6),
      tyreId: tyre.id,
      tyreSize: tyre.size || undefined,
    }

    try {
      if (searchState.leadId) {
        // Update existing lead instead of creating a new one
        await leadService.selectTyreForLead(searchState.leadId, tyre.id, variant === "new" ? "NEW" : "USED")
      } else {
        const response = await leadService.createLead(payload)
        if (response.data?.id) {
          dispatch(setLeadId(response.data.id))
        }
      }
      router.push(`/quote?tyreId=${tyre.id}&variant=${variant}`)
    } catch (error) {
      console.error("Lead submission error:", error)
      // If something went wrong, still navigate — the quote page shows confirmation
      router.push(`/quote?tyreId=${tyre.id}&variant=${variant}`)
    } finally {
      setIsSubmitting(false)
    }
  }, [dispatch, router, searchState, localPincode, tyre])

  // ── "Get this Lead" click handler ──
  const handleGetThisLead = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isSelected) onSelect()

    // Require pincode if not already set
    if (!searchState.pincode) {
      setPendingVariant(selectedVariant)
      setShowPincodeForm(true)
      return
    }

    // Require authentication
    if (!isAuthenticated) {
      setPendingVariant(selectedVariant)
      setShowOtpModal(true)
      return
    }

    createLeadAndNavigate(selectedVariant)
  }

  const handleOtpSuccess = useCallback(() => {
    setShowOtpModal(false)
    createLeadAndNavigate(pendingVariant)
  }, [pendingVariant, createLeadAndNavigate])

  const handlePincodeSubmit = () => {
    if (localPincode.length !== 6) return
    setShowPincodeForm(false)
    if (!isAuthenticated) {
      setShowOtpModal(true)
      return
    }
    createLeadAndNavigate(pendingVariant)
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden transition-all flex flex-col sm:flex-row ${
        selectedVariant === "new"
          ? "ring-2 ring-[#0D9488]"
          : "ring-2 ring-[#9333EA]"
      }`}
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
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500 text-white">
              -{discount}%
            </span>
          )}
        </div>

        {/* Maximize button */}
        <button
          onClick={openViewer}
          className="absolute top-3 right-3 p-1 bg-white rounded-full shadow-sm hover:shadow-md transition-all z-10 opacity-70 hover:opacity-100"
        >
          <Maximize2 className="w-3 h-3 text-gray-500" />
        </button>

        {/* Embla Carousel */}
        <div ref={emblaRef} className="overflow-hidden rounded-xl">
          <div className="flex">
            {images.map((img, i) => (
              <div key={i} className="relative w-full shrink-0 aspect-square">
                <Image
                  src={img}
                  alt={`${tyre.brand} ${tyre.pattern}`}
                  fill
                  className="object-contain p-2"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Carousel controls */}
        {images.length > 1 && (
          <>
            <button onClick={scrollPrev} className="absolute left-1 top-1/2 -translate-y-1/2 p-1 bg-white rounded-full shadow-sm hover:shadow-md z-10 opacity-70 hover:opacity-100">
              <ChevronLeft className="w-3 h-3 text-gray-500" />
            </button>
            <button onClick={scrollNext} className="absolute right-1 top-1/2 -translate-y-1/2 p-1 bg-white rounded-full shadow-sm hover:shadow-md z-10 opacity-70 hover:opacity-100">
              <ChevronRight className="w-3 h-3 text-gray-500" />
            </button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === selectedIndex ? (selectedVariant === "new" ? "bg-[#0D9488]" : "bg-[#9333EA]") : "bg-gray-300"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content Section - Right Side */}
      <div className="flex-1 p-4 flex flex-col justify-between" onClick={handleCardSelect}>
        {/* Brand and Pattern */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-bold text-[#1F2937] leading-tight">
              {tyre.brand} <span className="text-[#0D9488]">{tyre.pattern}</span>
            </h3>
          </div>
          <p className="text-xs text-gray-400 font-medium mb-2">{tyre.size}</p>

          {/* Ratings */}
          {tyre.rating && (
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${star <= Math.round(tyre.rating!) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                />
              ))}
              {tyre.reviewCount && <span className="text-xs text-gray-400 ml-1">({tyre.reviewCount})</span>}
            </div>
          )}

          {/* Features */}
          {tyre.features && tyre.features.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {tyre.features.slice(0, 3).map((f, i) => (
                <span key={i} className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-[10px] text-gray-500 rounded-full">
                  {f}
                </span>
              ))}
            </div>
          )}

          {/* Warranty */}
          {tyre.warrantyYears && tyre.warrantyYears > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
              <Truck className="w-3 h-3 text-[#0D9488]" />
              <span>{tyre.warrantyYears} year warranty</span>
            </div>
          )}
        </div>

        {/* Pricing & Variant Selector */}
        <div>
          {/* Price display */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className={`text-xl font-bold ${selectedVariant === "new" ? "text-[#0D9488]" : "text-[#9333EA]"}`}>
                ₹{selectedVariant === "new"
                  ? (tyre.newPrice || tyre.price || 0).toLocaleString()
                  : (tyre.usedPrice || 0).toLocaleString()}
              </span>
              {selectedVariant === "new" && tyre.originalPrice && tyre.originalPrice > (tyre.newPrice || 0) && (
                <span className="text-sm text-gray-400 line-through">₹{tyre.originalPrice.toLocaleString()}</span>
              )}
            </div>
          </div>

          {/* Variant Buttons */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={(e) => { e.stopPropagation(); handleVariantSelect("new") }}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                selectedVariant === "new"
                  ? "bg-[#0D9488] text-white border-[#0D9488] shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#0D9488]"
              }`}
            >
              New<br />{tyre.newPrice ? `₹${tyre.newPrice.toLocaleString()}` : `₹${(tyre.price || 0).toLocaleString()}`}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleVariantSelect("used") }}
              disabled={!tyre.usedPrice}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                !tyre.usedPrice
                  ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
                  : selectedVariant === "used"
                    ? "bg-[#9333EA] text-white border-[#9333EA] shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#9333EA]"
              }`}
            >
              Used<br />{tyre.usedPrice ? `₹${tyre.usedPrice.toLocaleString()}` : "N/A"}
            </button>
          </div>

          {/* Pincode fallback form */}
          {showPincodeForm && (
            <div className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-2">Enter your pincode to continue</p>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={localPincode}
                  onChange={(e) => setLocalPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="6-digit pincode"
                  maxLength={6}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                />
                <button
                  onClick={handlePincodeSubmit}
                  disabled={localPincode.length !== 6}
                  className="px-3 py-1.5 bg-[#0D9488] text-white text-sm font-medium rounded-lg disabled:opacity-50"
                >
                  Go
                </button>
              </div>
            </div>
          )}

          {/* Get this Lead Button */}
          <button
            onClick={handleGetThisLead}
            disabled={isSubmitting}
            className={`w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-70 ${
              selectedVariant === "new"
                ? "bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white hover:opacity-90 shadow-md shadow-teal-500/20"
                : "bg-[#9333EA] text-white hover:opacity-90 shadow-md shadow-purple-500/20"
            }`}
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
            ) : (
              <><ShoppingCart className="w-4 h-4" /> Get this Lead</>
            )}
          </button>
        </div>
      </div>

      {/* OTP Modal */}
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onSuccess={handleOtpSuccess}
      />

      <ImageViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        images={images}
        initialIndex={currentImageIndex}
      />
    </div>
  )
}
