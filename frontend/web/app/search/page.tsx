"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/hooks"
import { leadService, Lead } from "@/lib/services/lead-service"
import { Loader2, Package, MapPin, Calendar, Truck, Shield, CheckCircle, Clock } from "lucide-react"
import Image from "next/image"

export default function LeadTrackingDashboard() {
    const router = useRouter()
    const { isAuthenticated, user } = useAppSelector((state) => state.auth)
    const [leads, setLeads] = useState<Lead[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
    const [offers, setOffers] = useState<any[]>([])
    const [isOffersLoading, setIsOffersLoading] = useState(false)

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/")
            return
        }

        const fetchLeads = async () => {
            try {
                const response = await leadService.getCustomerLeads()
                setLeads(response.data.leads || [])
                // If there's at least one lead, auto-select the first one
                if (response.data.leads && response.data.leads.length > 0) {
                    setSelectedLeadId(response.data.leads[0].id)
                }
            } catch (error) {
                console.error("Failed to fetch leads", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchLeads()
    }, [isAuthenticated, router])

    useEffect(() => {
        if (selectedLeadId) {
            const fetchOffers = async () => {
                setIsOffersLoading(true)
                try {
                    const response = await leadService.getLeadOffers(selectedLeadId)
                    setOffers(response.data.offers || [])
                } catch (error) {
                    console.error("Failed to fetch offers", error)
                } finally {
                    setIsOffersLoading(false)
                }
            }
            fetchOffers()
        }
    }, [selectedLeadId])

    const handleSelectOffer = async (leadId: string, dealerId: string) => {
        if (confirm("Are you sure you want to select this offer? This will close your requirement.")) {
            try {
                await leadService.selectOffer(leadId, dealerId)
                alert("Offer accepted! The dealer will contact you soon.")
                // Refresh leads
                const response = await leadService.getCustomerLeads()
                setLeads(response.data.leads || [])
            } catch (error) {
                console.error("Error selecting offer", error)
                alert("Failed to accept offer. Please try again.")
            }
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#0D9488]" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Tyre Requirements</h1>
                        <p className="text-gray-500 mt-2">Track your active requirements and compare offers from dealers.</p>
                    </div>
                    <button
                        onClick={() => router.push("/")}
                        className="px-4 py-2 bg-white text-[#0D9488] border border-[#0D9488] rounded-lg hover:bg-teal-50 transition-colors font-medium"
                    >
                        New Requirement
                    </button>
                </div>

                {leads.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-[#0D9488]" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No Active Requirements</h2>
                        <p className="text-gray-500 mb-6">You haven't submitted any tyre requirements yet.</p>
                        <button
                            onClick={() => router.push("/")}
                            className="px-6 py-3 bg-[#0D9488] text-white rounded-xl hover:bg-[#0F766E] transition-colors font-medium"
                        >
                            Find Tyres Now
                        </button>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column: List of Requirements */}
                        <div className="lg:col-span-1 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">Your Leads</h2>
                            {leads.map((lead) => (
                                <div
                                    key={lead.id}
                                    onClick={() => setSelectedLeadId(lead.id)}
                                    className={`p-5 rounded-2xl cursor-pointer transition-all border-2 ${selectedLeadId === lead.id
                                            ? "bg-white border-[#0D9488] shadow-md relative overflow-hidden"
                                            : "bg-white border-transparent shadow-sm hover:border-gray-200"
                                        }`}
                                >
                                    {/* Decorative accent for selected */}
                                    {selectedLeadId === lead.id && (
                                        <div className="absolute top-0 left-0 w-1 h-full bg-[#0D9488]" />
                                    )}

                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${lead.status === "NEW" ? "bg-blue-100 text-blue-700" :
                                                lead.status === "DEALER_SELECTED" ? "bg-green-100 text-green-700" :
                                                    "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {lead.status}
                                        </span>
                                        <span className="text-xs text-gray-400">{new Date(lead.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    <h3 className="font-bold text-gray-900 line-clamp-1">{lead.vehicleModel}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-1">{lead.vehicleYear}</p>
                                </div>
                            ))}
                        </div>

                        {/* Right Column: Offers for Selected Requirement */}
                        <div className="lg:col-span-2">
                            {selectedLeadId ? (
                                <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 min-h-[500px]">
                                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Offers Received</h2>
                                            <p className="text-sm text-gray-500 mt-1">Compare prices to find the best deal.</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                                            <Clock className="w-4 h-4" />
                                            Live Updates
                                        </div>
                                    </div>

                                    {isOffersLoading ? (
                                        <div className="flex items-center justify-center py-20">
                                            <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
                                        </div>
                                    ) : offers.length === 0 ? (
                                        <div className="text-center py-16">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Package className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-1">Waiting for offers...</h3>
                                            <p className="text-sm text-gray-500">Dealers are preparing the best quotes for your requirement.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {offers.map((offer) => (
                                                <div key={offer.id} className="border border-gray-100 rounded-xl p-5 hover:border-[#0D9488] transition-colors group">
                                                    <div className="flex flex-col md:flex-row gap-5">
                                                        {/* Left: Dealer info (Anonymous if not accepted yet, unless returned by backend) */}
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center text-[#0D9488] font-bold shadow-sm">
                                                                    {offer.dealerName?.charAt(0) || "D"}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-gray-900">{offer.dealerName || "Verified Dealer"}</h4>
                                                                    <div className="flex items-center text-xs text-gray-500 gap-1 mt-0.5">
                                                                        <MapPin className="w-3 h-3" />
                                                                        {offer.distance ? `${offer.distance} km away` : "Nearby"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 mt-4">
                                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                                                                    <CheckCircle className="w-3.5 h-3.5" /> Ready Stock
                                                                </span>
                                                                {offer.condition === "NEW" && (
                                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                                                        <Shield className="w-3.5 h-3.5" /> Brand New
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Right: Price & Action */}
                                                        <div className="flex flex-col items-start md:items-end justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                                            <div className="mb-4 md:mb-0 text-left md:text-right w-full">
                                                                <div className="text-sm text-gray-500 mb-1">Offered Price</div>
                                                                <div className="text-2xl font-bold text-gray-900">₹{offer.price.toLocaleString('en-IN')}</div>
                                                                <div className="text-xs text-gray-400 mt-1">inclusive of taxes</div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleSelectOffer(selectedLeadId, offer.dealerId)}
                                                                className="w-full md:w-auto px-6 py-2.5 bg-[#1F2937] text-white rounded-lg hover:bg-black transition-colors font-medium text-sm"
                                                            >
                                                                Accept & View Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-transparent border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center p-12 h-full text-gray-400 text-sm">
                                    Select a requirement to view offers
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
