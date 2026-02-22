"use client"

import { useState, useEffect } from "react"
import { useAppSelector } from "@/lib/hooks"
import { leadService, type Lead } from "@/lib/services/lead-service"
import { ClipboardList, Loader2, MapPin, Car, Tag } from "lucide-react"

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    NEW: { label: "New", color: "bg-blue-100 text-blue-700" },
    VERIFIED: { label: "Verified", color: "bg-teal-100 text-teal-700" },
    OFFER_RECEIVED: { label: "Offer Received", color: "bg-yellow-100 text-yellow-700" },
    DEALER_SELECTED: { label: "Dealer Selected", color: "bg-purple-100 text-purple-700" },
    FOLLOW_UP: { label: "Follow Up", color: "bg-orange-100 text-orange-700" },
    CONVERTED: { label: "Converted", color: "bg-green-100 text-green-700" },
    CLOSED: { label: "Closed", color: "bg-gray-100 text-gray-600" },
    REJECTED: { label: "Rejected", color: "bg-red-100 text-red-600" },
    DUPLICATE: { label: "Duplicate", color: "bg-gray-100 text-gray-600" },
}

export default function MyOrdersPage() {
    const { isAuthenticated } = useAppSelector((state) => state.auth)
    const [leads, setLeads] = useState<Lead[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!isAuthenticated) {
            setIsLoading(false)
            return
        }
        const fetchLeads = async () => {
            try {
                const res = await leadService.getCustomerLeads()
                setLeads(res.data ?? [])
            } catch {
                setError("Failed to load your tyre requests. Please try again.")
            } finally {
                setIsLoading(false)
            }
        }
        fetchLeads()
    }, [isAuthenticated])

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto px-4 py-10 text-center">
                <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Please log in</h2>
                <p className="text-gray-500">Log in to view your tyre requests.</p>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#0D9488]" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-10 text-center">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-2">My Tyre Requests</h1>
            <p className="text-gray-500 mb-8">Track the status of your tyre requirements</p>

            {leads.length === 0 ? (
                <div className="text-center py-20">
                    <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">No requests yet</h2>
                    <p className="text-gray-500">Search for tyres to create your first request.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {leads.map((lead) => {
                        const statusInfo = STATUS_LABELS[lead.status] ?? { label: lead.status, color: "bg-gray-100 text-gray-600" }
                        return (
                            <div key={lead.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Car className="w-5 h-5 text-[#0D9488]" />
                                        <span className="font-semibold text-gray-900">
                                            {lead.vehicleModel || lead.vehicleType}
                                        </span>
                                    </div>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusInfo.color}`}>
                                        {statusInfo.label}
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-gray-400" />
                                        <span>{lead.tyreType} · {lead.tyreBrand}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span>{lead.locationArea}, {lead.locationPincode}</span>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-400 mt-4">
                                    Requested {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric", month: "short", year: "numeric"
                                    })}
                                </p>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
