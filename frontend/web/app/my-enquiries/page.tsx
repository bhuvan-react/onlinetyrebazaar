"use client"

import { useEffect, useState } from "react"
import { useAppSelector } from "@/lib/hooks"
import { leadService, type Lead } from "@/lib/services/lead-service"
import { useRouter } from "next/navigation"
import { Package, Clock, ShieldCheck, MapPin, Search } from "lucide-react"

export default function MyEnquiriesPage() {
    const router = useRouter()
    const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth)
    const [leads, setLeads] = useState<Lead[]>([])
    const [fetching, setFetching] = useState(true)

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
                                                onClick={() => alert("Offer viewing coming in next milestone!")}
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
        </main>
    )
}
