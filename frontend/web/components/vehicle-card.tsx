"use client"

import { Button } from "@/components/ui/button"
import { Car } from "lucide-react"
import { useRouter } from "next/navigation"

interface VehicleCardProps {
    vehicle: {
        id: string
        vehicleName: string
        registrationNumber: string
        tyreSize: string
        isPrimary: boolean
        make?: string
        model?: string
        variant?: string
    }
    onDelete?: (id: string) => void
    onEdit?: (vehicle: any) => void
}

export function VehicleCard({ vehicle, onDelete, onEdit }: VehicleCardProps) {
    const router = useRouter()

    const handleSearchTyres = () => {
        // Use make if available, otherwise try to extract from name
        const make = vehicle.make || vehicle.vehicleName.split(" ")[0]
        router.push(`/search?make=${encodeURIComponent(make)}`)
    }

    return (
        <div className={`bg-white rounded-xl border p-6 shadow-sm relative ${vehicle.isPrimary ? "border-red-500 ring-1 ring-red-500" : ""}`}>
            {vehicle.isPrimary && (
                <span className="absolute top-4 right-4 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white text-xs font-bold px-2 py-1 rounded-full">
                    Primary
                </span>
            )}

            <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-4xl">
                    {/* Display icon based on vehicle type - inferred or default */}
                    🚗
                </div>
                <h3 className="text-lg font-bold text-[#1F2937]">{vehicle.vehicleName}</h3>
                <p className="text-sm text-gray-500">{vehicle.make} {vehicle.model}</p>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Registration:</span>
                    <span className="font-semibold text-[#1F2937] uppercase">{vehicle.registrationNumber}</span>
                </div>
                {vehicle.variant && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Variant:</span>
                        <span className="font-semibold text-[#1F2937]">{vehicle.variant}</span>
                    </div>
                )}
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Tyre Size:</span>
                    <span className="font-semibold text-[#1F2937]">{vehicle.tyreSize}</span>
                </div>
            </div>

            <div className="space-y-3">
                <Button
                    variant="outline"
                    className="w-full text-[#059669] border-[#059669] hover:bg-green-50"
                    onClick={() => onEdit && onEdit(vehicle)}
                >
                    Edit
                </Button>
                <Button
                    variant="outline"
                    className="w-full text-[#059669] border-[#059669] hover:bg-green-50"
                    onClick={handleSearchTyres}
                >
                    Search Tyres
                </Button>
                {!vehicle.isPrimary && onDelete && (
                    <Button
                        variant="outline"
                        className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                        onClick={() => onDelete(vehicle.id)}
                    >
                        Delete
                    </Button>
                )}
            </div>
        </div>
    )
}
