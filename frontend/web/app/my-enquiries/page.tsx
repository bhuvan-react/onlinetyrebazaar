"use client"

import { useEffect, useState } from "react"
import { useAppSelector } from "@/lib/hooks"
import { leadService, type Lead, type DealerPurchaser } from "@/lib/services/lead-service"
import { useRouter } from "next/navigation"
import { Package, Clock, ShieldCheck, MapPin, Search, X, Phone, Mail, Users } from "lucide-react"

export default function MyEnquiriesPage() {
    const router = useRouter()
    const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth)
    const [leads, setLeads] = useState<Lead[]>([])
    const [fetching, setFetching] = useState(true)

    // Dealer purchasers modal state
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
    const [purchasers, setPurchasers] = useState<DealerPurchaser[]>([])
    const [loadingPurchasers, setLoadingPurchasers] = useState(false)

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/")
            return
        }

        if (isAuthenticated) {
            fetchLeads()
        }
    }, [isAuthenticated, isLoading, router])

    const fetchLeads = async () => {
        try {
            const response = await leadService.getCustomerLeads()
            if (response.data) {
                // Ensure array
                const leadsArray = Array.isArray(response.data) ? response.data : []
                setLeads(leadsArray)
            }
        } catch (error) {
            console.error("Failed to fetch leads", error)
        } finally {
            setFetching(false)
        }
    }

    const handleViewDealerOffers = async (leadId: string) => {
        setSelectedLeadId(leadId)
        setPurchasers([])
        setLoadingPurchasers(true)
        try {
            const response = await leadService.getLeadPurchasers(leadId)
            if (response.data) {
                setPurchasers(Array.isArray(response.data) ? response.data : [])
            }
        } catch (error) {
            console.error("Failed to fetch dealer purchasers", error)
            setPurchasers([])
        } finally {
            setLoadingPurchasers(false)
        }
    }

    const handleCloseModal = () => {
        setSelectedLeadId(null)
        setPurchasers([])
    }

    if (isLoading || fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse w-12 h-12 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin"></div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50 pt-20 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">My Enquiries</h1>
                    <p className="text-gray-500 mt-1">Track your tyre replacement requests and dealer offers.</p>
                </div>

                {leads.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-[#0D9488]" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No active enquiries</h3>
                        <p className="text-gray-500 mb-6">You haven't requested any tyres yet.</p>
                        <button
                            onClick={() => router.push("/search")}
                            className="bg-[#0D9488] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-teal-700 transition-colors"
                        >
                            Find Tyres Now
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {leads.map((lead) => (
                            <div key={lead.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                                <div className="p-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                                    lead.status === 'NEW' ? 'bg-blue-100 text-blue-700' :
                                                    lead.status === 'OFFER_RECEIVED' ? 'bg-amber-100 text-amber-700' :
                                                    lead.status === 'CONVERTED' ? 'bg-emerald-100 text-emerald-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {lead.status.replace("_", " ")}
                                                </span>
                                                <span className="text-xs text-gray-400 font-medium">
                                                    ID: {lead.id.substring(0, 8)}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-900">
                                                {lead.vehicleModel || "Vehicle Enquiry"}
                                            </h3>

                                            <div className="mt-2 flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600 border-t border-gray-50 pt-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Package className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium">{lead.tyreBrand}</span>
                                                    {lead.tyreSize && <span>({lead.tyreSize})</span>}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <ShieldCheck className="w-4 h-4 text-gray-400" />
                                                    <span>{lead.tyreType === "NEW" ? "New Tyres" : "Refurbished"}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                    <span>{lead.locationArea} - {lead.locationPincode}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-start sm:items-end gap-2">
                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(lead.createdAt).toLocaleDateString()}
                                            </div>

                                            <button
                                                className="w-full sm:w-auto mt-2 px-5 py-2 border border-[#0D9488] text-[#0D9488] font-medium rounded-xl hover:bg-teal-50 transition-colors text-sm"
                                                onClick={() => handleViewDealerOffers(lead.id)}
                                            >
                                                View Dealer Offers
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Dealer Purchasers Modal */}
            {selectedLeadId && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={handleCloseModal}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Interested Dealers</h2>
                                <p className="text-xs text-gray-500 mt-0.5">Dealers who have unlocked your lead</p>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="overflow-y-auto flex-1 p-5">
                            {loadingPurchasers ? (
                                <div className="flex items-center justify-center py-14">
                                    <div className="w-9 h-9 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
                                </div>
                            ) : purchasers.length === 0 ? (
                                <div className="text-center py-14">
                                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Users className="w-7 h-7 text-gray-400" />
                                    </div>
                                    <p className="text-gray-700 font-semibold">No dealers yet</p>
                                    <p className="text-sm text-gray-400 mt-1">No dealers have purchased this lead yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {purchasers.map((dealer) => (
                                        <div
                                            key={dealer.dealerId}
                                            className="border border-gray-100 rounded-xl p-4 hover:border-teal-200 hover:bg-teal-50/30 transition-colors"
                                        >
                                            <p className="font-semibold text-gray-900 text-base mb-3">
                                                {dealer.businessName}
                                            </p>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    <span>{dealer.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    <span>{dealer.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    <span>{dealer.city} — {dealer.zipCode}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-5 py-3 border-t border-gray-100 flex-shrink-0">
                            <p className="text-xs text-gray-400 text-center">
                                {purchasers.length > 0
                                    ? `${purchasers.length} dealer${purchasers.length > 1 ? "s" : ""} interested in your lead`
                                    : "Share your lead to attract more dealers"}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
