"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { CheckCircle2, ClipboardList, Coins, SearchCheck, CalendarCheck, Loader2 } from "lucide-react"
import { tyreService } from "@/lib/services/tyre-service"
import { leadService } from "@/lib/services/lead-service"
import type { Tyre } from "@/lib/tyre-data"
import { OtpModal } from "@/components/otp-modal"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { initializeAuth, initializeSearch } from "@/lib/store"

function mapVehicleType(v: string | null): string {
    if (v === "2W") return "TWO_WHEELER"
    if (v === "3W") return "THREE_WHEELER"
    return "FOUR_WHEELER"
}

function QuoteContent() {
    const searchParams = useSearchParams()
    const tyreId = searchParams.get("tyreId")
    const variant = searchParams.get("variant") || "new"
    const [tyre, setTyre] = useState<Tyre | null>(null)
    const [loading, setLoading] = useState(true)

    // Auth & search state
    const dispatch = useAppDispatch()
    const { isAuthenticated, isLoading: authLoading } = useAppSelector((state) => state.auth)
    const searchState = useAppSelector((state) => state.search)

    // Lead submission state
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [leadSubmitted, setLeadSubmitted] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [showOtpModal, setShowOtpModal] = useState(false)

    // Fallback fields if Redux state is missing
    const [localPincode, setLocalPincode] = useState("")
    const [localCity, setLocalCity] = useState("")
    const [localVehicleType, setLocalVehicleType] = useState<"2W" | "3W" | "4W">("4W")
    const [showFallbackForm, setShowFallbackForm] = useState(false)

    useEffect(() => {
        dispatch(initializeAuth())
        dispatch(initializeSearch())
    }, [dispatch])

    useEffect(() => {
        if (!tyreId) {
            setLoading(false)
            return
        }

        tyreService.getTyreById(tyreId).then((response) => {
            if (response.data) {
                setTyre(response.data)
            }
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }, [tyreId])

    const buildLeadRequest = useCallback((tyre: Tyre) => {
        const pincode = searchState.pincode || localPincode || "000000"
        const city = searchState.city || localCity || "Unknown"
        const vType = searchState.vehicleType || localVehicleType
        const make = searchState.make || ""
        const model = searchState.model || ""
        const vehicleModel = [make, model].filter(Boolean).join(" ") || tyre.model || tyre.pattern || tyre.brand

        return {
            vehicleType: mapVehicleType(vType),
            tyreType: variant === "new" ? "NEW" : "USED",
            tyreBrand: tyre.brand,
            vehicleModel,
            locationArea: city,
            locationPincode: pincode.padEnd(6, "0").slice(0, 6),
            tyreId: tyreId,
        }
    }, [searchState, localPincode, localCity, localVehicleType, variant])

    const submitLead = useCallback(async (tyre: Tyre) => {
        setIsSubmitting(true)
        setSubmitError(null)
        try {
            let response;
            if (searchState.leadId) {
                // UPDATE existing lead
                response = await leadService.selectTyreForLead(searchState.leadId, tyre.id)
            } else {
                // CREATE new lead (fallback)
                const request = buildLeadRequest(tyre)
                response = await leadService.createLead(request)
            }

            if (response.data || response.status === 200) {
                setLeadSubmitted(true)
            } else {
                setSubmitError("Failed to submit lead. Please try again.")
            }
        } catch {
            setSubmitError("Failed to submit lead. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }, [buildLeadRequest, searchState.leadId])

    const handleConfirmLead = () => {
        if (!tyre) return
        const needsFallback = !searchState.pincode && !localPincode
        if (needsFallback) {
            setShowFallbackForm(true)
            return
        }
        if (!isAuthenticated) {
            setShowOtpModal(true)
            return
        }
        submitLead(tyre)
    }

    const handleOtpSuccess = useCallback(() => {
        setShowOtpModal(false)
        if (tyre) {
            submitLead(tyre)
        }
    }, [tyre, submitLead])

    const handleFallbackSubmit = () => {
        if (localPincode.length !== 6) return
        setShowFallbackForm(false)
        if (!isAuthenticated) {
            setShowOtpModal(true)
            return
        }
        if (tyre) submitLead(tyre)
    }

    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FFF1F2]">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-8 w-48 bg-gray-200 rounded"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    if (!tyre) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FFF1F2]">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Tyre not found.</p>
                    <a href="/search" className="text-[#0D9488] font-semibold hover:underline">← Back to Search</a>
                </div>
            </div>
        )
    }

    const isNew = variant === "new"
    const displayPrice = isNew
        ? (tyre.newPrice || tyre.price)
        : (tyre.usedPrice || tyre.price)

    const originalPrice = isNew ? tyre.originalPrice : tyre.newPrice
    const discount = originalPrice && displayPrice
        ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
        : 0

    const accentColor = isNew ? "#0D9488" : "#9333EA"

    return (
        <div className="min-h-screen bg-[#FFF1F2]">
            <main className="max-w-3xl mx-auto px-4 py-8">

                {/* Page Title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-[#1F2937] flex items-center gap-2">
                        <ClipboardList className="w-6 h-6 text-[#8B5CF6]" />
                        REQUEST QUOTE
                    </h1>
                    <p className="text-sm text-gray-600 ml-8">Get Best Prices from Verified Dealers</p>
                </div>

                {/* Lead submitted success banner */}
                {leadSubmitted ? (
                    <div className="bg-[#D1FAE5] border border-[#34D399] rounded-xl p-4 mb-6 flex items-start gap-3 shadow-sm">
                        <CheckCircle2 className="w-6 h-6 text-[#059669] flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[#065F46] font-bold">Lead Submitted Successfully!</p>
                            <p className="text-[#065F46] text-sm mt-0.5">Verified dealers will contact you shortly with the best quotes.</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-[#A7F3D0] border border-[#34D399] rounded-xl p-4 mb-6 flex items-start gap-3 shadow-sm">
                        <CheckCircle2 className="w-6 h-6 text-[#059669] flex-shrink-0 mt-0.5" />
                        <p className="text-[#065F46] font-medium">
                            <span className="font-bold">Interest Submitted!</span> Review details below and confirm to get quotes from verified dealers.
                        </p>
                    </div>
                )}

                {/* Product Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative w-32 h-32 flex-shrink-0">
                        <Image
                            src={tyre.image || tyre.imageUrl || "/placeholder.svg"}
                            alt={`${tyre.brand} ${tyre.model || tyre.pattern}`}
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        {/* Variant badge */}
                        <span
                            className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold text-white mb-2"
                            style={{ backgroundColor: accentColor }}
                        >
                            {isNew ? "🆕 New" : "♻️ Used"}
                        </span>
                        <h2 className="text-xl font-bold text-[#1F2937] mb-2">
                            {tyre.brand} {tyre.model || tyre.pattern} {tyre.size}
                        </h2>
                        <div className="flex items-center justify-center sm:justify-start gap-3">
                            <span className="text-2xl font-bold" style={{ color: accentColor }}>
                                ₹{displayPrice.toLocaleString()}
                            </span>
                            {discount > 0 && (
                                <span className="text-sm font-medium text-[#059669]">
                                    ({discount}% OFF)
                                </span>
                            )}
                        </div>
                        {tyre.rating && (
                            <p className="text-sm text-gray-500 mt-1">
                                ⭐ {tyre.rating} ({tyre.reviewCount} reviews)
                            </p>
                        )}
                    </div>
                </div>

                {/* Steps Section */}
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <div className="text-center mb-8">
                        <h3 className="text-xl font-bold text-[#1F2937] flex items-center justify-center gap-2">
                            <span className="text-yellow-400">✨</span> What Happens Next?
                        </h3>
                    </div>

                    <div className="space-y-6">
                        {[
                            {
                                icon: <SearchCheck className="w-4 h-4 text-gray-500" />,
                                title: "Dealers Review (15-30 mins)",
                                desc: "Verified dealers in your area will review your request",
                            },
                            {
                                icon: <Coins className="w-4 h-4 text-gray-500" />,
                                title: "Receive Quotes",
                                desc: "Get competitive pricing from multiple dealers",
                            },
                            {
                                icon: <CheckCircle2 className="w-4 h-4 text-[#059669]" />,
                                title: "Compare & Choose",
                                desc: "Select the best offer based on price and service",
                            },
                            {
                                icon: <CalendarCheck className="w-4 h-4 text-gray-500" />,
                                title: "Confirm Installation",
                                desc: "Schedule your preferred date and time",
                            },
                            {
                                icon: <CalendarCheck className="w-4 h-4 text-gray-500" />,
                                title: "🚀 Get Installed!",
                                desc: "Professional installation at your doorstep",
                            },
                        ].map((step, i) => (
                            <div key={i} className="flex gap-4">
                                <div
                                    className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold flex-shrink-0 text-sm"
                                    style={{ backgroundColor: accentColor }}
                                >
                                    {i + 1}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1F2937] flex items-center gap-2">
                                        {step.icon} {step.title}
                                    </h4>
                                    <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Fallback pincode form */}
                    {showFallbackForm && !leadSubmitted && (
                        <div className="mt-6 p-4 border border-gray-200 rounded-xl bg-[#F9FAFB]">
                            <p className="text-sm font-semibold text-[#1F2937] mb-3">Enter your pincode to proceed</p>
                            <div className="flex gap-2">
                                <select
                                    value={localVehicleType}
                                    onChange={(e) => setLocalVehicleType(e.target.value as "2W" | "3W" | "4W")}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                                >
                                    <option value="4W">4 Wheeler</option>
                                    <option value="2W">2 Wheeler</option>
                                    <option value="3W">3 Wheeler</option>
                                </select>
                                <input
                                    type="tel"
                                    value={localPincode}
                                    onChange={(e) => setLocalPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                    placeholder="6-digit pincode"
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                                    maxLength={6}
                                />
                                <button
                                    onClick={handleFallbackSubmit}
                                    disabled={localPincode.length !== 6}
                                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                                    style={{ backgroundColor: accentColor }}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Error state */}
                    {submitError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                            {submitError}
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center">
                        <a
                            href="/search"
                            className="inline-block px-6 py-2.5 rounded-xl font-semibold text-sm border transition-all hover:opacity-80"
                            style={{ borderColor: accentColor, color: accentColor }}
                        >
                            ← Browse More Tyres
                        </a>

                        {!leadSubmitted && (
                            <button
                                onClick={handleConfirmLead}
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 disabled:opacity-60"
                                style={{ backgroundColor: accentColor }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        Confirm &amp; Submit Lead
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </main>

            {/* OTP Modal */}
            <OtpModal
                isOpen={showOtpModal}
                onClose={() => setShowOtpModal(false)}
                onSuccess={handleOtpSuccess}
            />
        </div>
    )
}

export default function QuotePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#FFF1F2]">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-8 w-48 bg-gray-200 rounded"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        }>
            <QuoteContent />
        </Suspense>
    )
}
