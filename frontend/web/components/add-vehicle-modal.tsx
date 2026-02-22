"use client"

import { useState, useEffect } from "react"
import { X, Car } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AddVehicleModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (vehicle: any) => void
    onEdit?: (vehicle: any) => void
    initialData?: any
}

export function AddVehicleModal({ isOpen, onClose, onAdd, onEdit, initialData }: AddVehicleModalProps) {
    const [vehicleType, setVehicleType] = useState<"2w" | "3w" | "4w">("4w")
    const [make, setMake] = useState("")
    const [model, setModel] = useState("")
    const [variant, setVariant] = useState("")
    const [year, setYear] = useState("")
    const [registration, setRegistration] = useState("")
    const [tyreSize, setTyreSize] = useState("")
    const [isPrimary, setIsPrimary] = useState(false)

    // Load initial data when modal opens
    useEffect(() => {
        if (isOpen && initialData) {
            setVehicleType(initialData.type || "4w")

            // Parse name to get make, model, variant if possible, or just set defaults if structure varies
            // Assuming name format "Make Model Variant"
            setMake(initialData.make || "")
            setModel(initialData.model || "")
            setVariant(initialData.variant || "")
            setVehicleType("4w") // Default to 4w as type isn't in backend DTO

            setYear(new Date().getFullYear().toString()) // Default year as not in DTO
            setRegistration(initialData.registrationNumber || "")
            setTyreSize(initialData.tyreSize || "")
            setIsPrimary(initialData.isPrimary || false)
        } else if (isOpen) {
            resetForm()
        }
    }, [isOpen, initialData])

    // Mock data based on vehicle type
    const vehicleData = {
        "2w": {
            makes: ["Hero", "Honda", "TVS", "Bajaj", "Royal Enfield", "Yamaha"],
            models: ["Splendor", "Activa", "Jupiter", "Pulsar", "Classic 350", "R15"],
            tyres: ["90/90-12", "90/100-10", "2.75-17", "100/90-17", "140/70-17"]
        },
        "3w": {
            makes: ["Bajaj", "Piaggio", "Mahindra", "TVS"],
            models: ["RE Compact", "Ape", "Alfa", "King"],
            tyres: ["4.00-8", "4.50-10", "5.00-10"]
        },
        "4w": {
            makes: ["Maruti Suzuki", "Hyundai", "Honda", "Tata", "Mahindra", "Toyota"],
            models: ["Swift", "City", "Nexon", "XUV700", "Creta", "Innova"],
            tyres: ["165/80 R14", "185/65 R15", "195/55 R16", "205/60 R16", "215/60 R17"]
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newVehicle = {
            id: initialData ? initialData.id : `VEH-${Date.now()}`,
            vehicleName: `${year} ${make} ${model} ${variant}`, // Store year in name as it's not in DB
            make,
            model,
            variant,
            registrationNumber: registration,
            tyreSize,
            isPrimary,
            // type: vehicleType, // Not in DTO but useful for UI locally if persisted in name or ignored
        }

        if (initialData && onEdit) {
            onEdit(newVehicle)
        } else {
            onAdd(newVehicle)
        }
        resetForm()
    }

    const resetForm = () => {
        setVehicleType("4w")
        setMake("")
        setModel("")
        setVariant("")
        setYear("")
        setRegistration("")
        setTyreSize("")
        setIsPrimary(false)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-[#1F2937] flex items-center gap-2">
                                🚗 {initialData ? "EDIT VEHICLE" : "ADD NEW VEHICLE"}
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Vehicle Type Selection */}
                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-3">Vehicle Type</label>
                                <div className="flex gap-4">
                                    {[
                                        { id: "2w", label: "2-Wheeler", icon: "🏍️" },
                                        { id: "3w", label: "3-Wheeler", icon: "🛺" },
                                        { id: "4w", label: "4-Wheeler", icon: "🚗" }
                                    ].map((type) => (
                                        <label
                                            key={type.id}
                                            className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${vehicleType === type.id
                                                ? "border-[#0D9488] bg-[#F0FDFA] text-[#0D9488]"
                                                : "border-gray-200 hover:border-gray-300 text-gray-500"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="vehicleType"
                                                value={type.id}
                                                checked={vehicleType === type.id}
                                                onChange={(e) => {
                                                    setVehicleType(e.target.value as any)
                                                    setMake("")
                                                    setModel("")
                                                    setTyreSize("")
                                                }}
                                                className="sr-only"
                                            />
                                            <span className="text-2xl mb-1">{type.icon}</span>
                                            <span className="text-sm font-medium">{type.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Make */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2937] mb-2">Vehicle Make *</label>
                                    <select
                                        required
                                        value={make}
                                        onChange={(e) => setMake(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                                    >
                                        <option value="">Select Make</option>
                                        {vehicleData[vehicleType].makes.map((m) => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Model */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2937] mb-2">Model *</label>
                                    <select
                                        required
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                                    >
                                        <option value="">Select Model</option>
                                        {vehicleData[vehicleType].models.map((m) => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Variant */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2937] mb-2">Variant *</label>
                                    <select
                                        required
                                        value={variant}
                                        onChange={(e) => setVariant(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                                    >
                                        <option value="">Select Variant</option>
                                        <option value="Standard">Standard</option>
                                        <option value="Deluxe">Deluxe</option>
                                        <option value="Sports">Sports</option>
                                        <option value="VXi">VXi</option>
                                        <option value="ZXi">ZXi</option>
                                    </select>
                                </div>

                                {/* Year */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2937] mb-2">Year *</label>
                                    <select
                                        required
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                                    >
                                        <option value="">Select Year</option>
                                        {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                                            <option key={y} value={y}>
                                                {y}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Registration Number */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2937] mb-2">Registration Number</label>
                                    <input
                                        type="text"
                                        value={registration}
                                        onChange={(e) => setRegistration(e.target.value.toUpperCase())}
                                        placeholder="MH 02 AB 1234"
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                                    />
                                </div>

                                {/* Tyre Size */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2937] mb-2">Tyre Size *</label>
                                    <select
                                        required
                                        value={tyreSize}
                                        onChange={(e) => setTyreSize(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                                    >
                                        <option value="">Select Size</option>
                                        {vehicleData[vehicleType].tyres.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Primary Checkbox */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${isPrimary ? "bg-[#0D9488] border-[#0D9488]" : "border-gray-300"}`}>
                                    {isPrimary && <Car className="w-3 h-3 text-white" />}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={isPrimary}
                                    onChange={(e) => setIsPrimary(e.target.checked)}
                                    className="hidden"
                                />
                                <span className="text-[#1F2937]">Set as primary vehicle</span>
                            </label>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 border border-[#0D9488] text-[#0D9488] font-semibold rounded-xl hover:bg-[#F0FDFA] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-[#0D9488] text-white font-semibold rounded-xl hover:bg-[#0F766E] transition-colors"
                                >
                                    Add Vehicle
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
