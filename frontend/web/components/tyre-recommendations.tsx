"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Star, Info, ArrowRight } from "lucide-react"
import type { QuestionnaireData } from "./tyre-questionnaire"

interface TyreRecommendationsProps {
    data: QuestionnaireData
    onViewAll: () => void
}

interface RecommendedTyre {
    brand: string
    model: string
    priceRange: string
    features: string[]
    matchReason: string
    tag: "Best Match" | "Value Pick" | "Premium Choice"
}

export function TyreRecommendations({ data, onViewAll }: TyreRecommendationsProps) {
    const [loading, setLoading] = useState(true)
    const [recommendations, setRecommendations] = useState<RecommendedTyre[]>([])

    useEffect(() => {
        // Simulate API/Calculation delay
        const timer = setTimeout(() => {
            const recs = getRecommendations(data)
            setRecommendations(recs)
            setLoading(false)
        }, 1500)

        return () => clearTimeout(timer)
    }, [data])

    const getRecommendations = (data: QuestionnaireData): RecommendedTyre[] => {
        const recs: RecommendedTyre[] = []
        const { issues, usage, budget, preferences } = data

        // Logic 1: Skidding + City + Balanced + Genuine -> CEAT
        if (
            issues.includes("skidding") &&
            usage === "city" &&
            budget >= 33 &&
            budget < 66 &&
            preferences.includes("Genuine brand only")
        ) {
            recs.push({
                brand: "CEAT",
                model: "SecuraDrive",
                priceRange: "₹4,500 - ₹6,500",
                features: ["Excellent Wet Grip", "City Comfort", "Fuel Efficient"],
                matchReason: "Perfect for city driving with enhanced grip for safety.",
                tag: "Best Match",
            })
        }

        // Logic 2: Low tread/Punctures + Rural -> MRF/Apollo
        if ((issues.includes("low_tread") || issues.includes("punctures")) && usage === "bad_roads") {
            recs.push({
                brand: "MRF",
                model: "ZVTS",
                priceRange: "₹3,800 - ₹5,500",
                features: ["Strong Sidewalls", "High Durability", "Pothole Resistant"],
                matchReason: "Built tough to handle bad roads and prevent punctures.",
                tag: "Best Match",
            })
            recs.push({
                brand: "Apollo",
                model: "Amazer 4G",
                priceRange: "₹3,500 - ₹5,000",
                features: ["Long Life", "Cut Resistant", "Value for Money"],
                matchReason: "Great durability for rough terrain.",
                tag: "Value Pick",
            })
        }

        // Logic 3: Highway + Premium -> Bridgestone
        if (usage === "highway" && budget >= 66) {
            recs.push({
                brand: "Bridgestone",
                model: "Turanza",
                priceRange: "₹6,000 - ₹9,000",
                features: ["Low Noise", "Highway Stability", "Superior Comfort"],
                matchReason: "Top-tier stability and comfort for long highway rides.",
                tag: "Premium Choice",
            })
        }

        // Logic 4: Noise -> Michelin/Yokohama (Premium) or CEAT (Budget)
        if (issues.includes("noise")) {
            if (budget >= 66) {
                recs.push({
                    brand: "Michelin",
                    model: "Primacy 4ST",
                    priceRange: "₹7,500 - ₹11,000",
                    features: ["Silent Tread", "Plush Ride", "Long Lasting"],
                    matchReason: "The quietest tyre in the market for a silent cabin.",
                    tag: "Premium Choice",
                })
            } else {
                recs.push({
                    brand: "CEAT",
                    model: "Milaze X3",
                    priceRange: "₹3,200 - ₹4,800",
                    features: ["Low Noise Pattern", "High Mileage", "Affordable"],
                    matchReason: "Good noise reduction at a budget-friendly price.",
                    tag: "Value Pick",
                })
            }
        }

        // Fallbacks if not enough recommendations
        if (recs.length < 2) {
            if (!recs.some((r) => r.brand === "MRF")) {
                recs.push({
                    brand: "MRF",
                    model: "ZLX",
                    priceRange: "₹4,000 - ₹6,000",
                    features: ["Trusted Brand", "All-Rounder", "Good Grip"],
                    matchReason: "India's most trusted tyre for all conditions.",
                    tag: recs.length === 0 ? "Best Match" : "Value Pick",
                })
            }
            if (!recs.some((r) => r.brand === "Apollo")) {
                recs.push({
                    brand: "Apollo",
                    model: "Alnac 4G",
                    priceRange: "₹4,200 - ₹6,200",
                    features: ["Precision Steering", "Wet Grip", "Modern Pattern"],
                    matchReason: "Great balance of performance and price.",
                    tag: "Value Pick",
                })
            }
        }

        return recs.slice(0, 3)
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-12 h-12 border-4 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 font-medium animate-pulse">Analyzing your needs...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">We Found Your Perfect Match!</h2>
                <p className="text-gray-500">Based on your driving style and preferences.</p>
            </div>

            <div className="grid gap-4">
                {recommendations.map((tyre, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#0D9488] hover:shadow-md transition-all relative overflow-hidden group"
                    >
                        {tyre.tag === "Best Match" && (
                            <div className="absolute top-0 right-0 bg-[#0D9488] text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                                BEST MATCH
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    {tyre.brand} <span className="text-gray-500 font-normal">{tyre.model}</span>
                                </h3>
                                <p className="text-[#0D9488] font-semibold mt-1">{tyre.priceRange}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <div className="flex gap-2 items-start text-sm text-gray-600">
                                <Info className="w-4 h-4 text-[#0D9488] mt-0.5 shrink-0" />
                                <p>{tyre.matchReason}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {tyre.features.map((feature) => (
                                <span
                                    key={feature}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700"
                                >
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {data.preferences.includes("Used tyre is OK") && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3 items-start">
                    <Info className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                    <div>
                        <h4 className="font-semibold text-yellow-800">Interested in Used Tyres?</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                            We also have verified used tyres available at our local partner dealers. You can filter for "Used" on the search page.
                        </p>
                    </div>
                </div>
            )}

            <Button
                onClick={onViewAll}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#14B8A6] to-[#0D9488] hover:opacity-90 text-white shadow-lg shadow-teal-500/30 rounded-xl flex items-center justify-center gap-2 group"
            >
                View All Available Tyres
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
        </div>
    )
}
