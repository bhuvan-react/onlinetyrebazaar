"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { CheckCircle2, ClipboardList, Coins, SearchCheck, CalendarCheck } from "lucide-react"
import { tyreService } from "@/lib/services/tyre-service"
import type { Tyre } from "@/lib/tyre-data"

function QuoteContent() {
    const searchParams = useSearchParams()
    const tyreId = searchParams.get("tyreId")
    const variant = searchParams.get("variant") || "new"
    const [tyre, setTyre] = useState<Tyre | null>(null)
    const [loading, setLoading] = useState(true)

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

    if (loading) {
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

                {/* Success Banner */}
                <div className="bg-[#A7F3D0] border border-[#34D399] rounded-xl p-4 mb-6 flex items-start gap-3 shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-[#059669] flex-shrink-0 mt-0.5" />
                    <p className="text-[#065F46] font-medium">
                        <span className="font-bold">Interest Submitted!</span> Review details below and confirm to get quotes from verified dealers.
                    </p>
                </div>

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

                    {/* Back to Search */}
                    <div className="mt-8 text-center">
                        <a
                            href="/search"
                            className="inline-block px-6 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90"
                            style={{ backgroundColor: accentColor }}
                        >
                            ← Browse More Tyres
                        </a>
                    </div>
                </div>
            </main>
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
