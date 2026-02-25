"use client"

import { useState, useEffect } from "react"
import { VehicleCard } from "@/components/vehicle-card"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { AddVehicleModal } from "@/components/add-vehicle-modal"
import { vehicleService, type Vehicle } from "@/lib/services/vehicle-service"

export default function MyVehiclesPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingVehicle, setEditingVehicle] = useState<any>(null)
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)

    // Fetch existing vehicles on mount
    useEffect(() => {
        vehicleService.getVehicles().then((res) => {
            if (res.data) setVehicles(res.data)
        }).catch(() => {
            // endpoint may not exist yet; leave list empty
        }).finally(() => setLoading(false))
    }, [])

    const handleAddVehicle = async (newVehicle: any) => {
        setSaving(true)
        setSaveError(null)
        try {
            const res = await vehicleService.addVehicle(newVehicle)
            // Prefer the server-returned vehicle (has real id); fall back to local payload
            const saved = res.data || { ...newVehicle, id: `VEH-${Date.now()}` }

            // If the new vehicle is set as primary, demote others
            if (saved.isPrimary) {
                setVehicles(prev =>
                    prev.map(v => ({ ...v, isPrimary: false })).concat(saved)
                )
            } else {
                setVehicles(prev => [...prev, saved])
            }
            setIsModalOpen(false)
        } catch (err: any) {
            setSaveError(err?.message || "Failed to add vehicle. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    const handleEditVehicle = (vehicle: any) => {
        setEditingVehicle(vehicle)
        setIsModalOpen(true)
    }

    const handleUpdateVehicle = async (updatedVehicle: any) => {
        setSaving(true)
        setSaveError(null)
        try {
            // Try to update via API — if not implemented fall back to local update
            let saved = updatedVehicle
            try {
                const res = await vehicleService.addVehicle(updatedVehicle) // PUT not yet implemented; reuse add
                if (res.data) saved = res.data
            } catch {
                // Silently fall back to local state update
            }

            setVehicles(prev => {
                const updated = prev.map(v => v.id === saved.id ? saved : v)
                // Demote others if isPrimary changed to true
                if (saved.isPrimary) return updated.map(v => v.id === saved.id ? v : { ...v, isPrimary: false })
                return updated
            })
            setIsModalOpen(false)
            setEditingVehicle(null)
        } catch {
            setSaveError("Failed to update vehicle. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteVehicle = async (id: string) => {
        try {
            await vehicleService.deleteVehicle(id)
        } catch {
            // Silently ignore delete failures — remove from UI anyway
        }
        setVehicles(prev => prev.filter(v => v.id !== id))
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingVehicle(null)
        setSaveError(null)
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <main className="w-full">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-3xl font-bold flex items-center gap-2">🚗 MY VEHICLES</h1>
                    <Button
                        onClick={() => { setEditingVehicle(null); setIsModalOpen(true) }}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Vehicle
                    </Button>
                </div>
                <p className="text-muted-foreground mb-8">Manage your vehicle information for faster tyre searches</p>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-[#0D9488]" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map((vehicle) => (
                            <VehicleCard
                                key={vehicle.id}
                                vehicle={vehicle}
                                onDelete={handleDeleteVehicle}
                                onEdit={handleEditVehicle}
                            />
                        ))}

                        {/* Add New Vehicle Card */}
                        <button
                            onClick={() => { setEditingVehicle(null); setIsModalOpen(true) }}
                            className="bg-red-50 rounded-xl border-2 border-dashed border-red-300 p-6 flex flex-col items-center justify-center min-h-[400px] hover:bg-red-100 transition-colors group"
                        >
                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Plus className="w-8 h-8 text-[#0D9488]" />
                            </div>
                            <h3 className="text-lg font-bold text-[#1F2937] mb-2">Add New Vehicle</h3>
                            <p className="text-sm text-gray-500">Click to add another vehicle</p>
                        </button>
                    </div>
                )}
            </main>

            <AddVehicleModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAdd={handleAddVehicle}
                onEdit={handleUpdateVehicle}
                initialData={editingVehicle}
            />
        </div>
    )
}
