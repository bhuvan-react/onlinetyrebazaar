"use client"

import { useState, useEffect, useCallback } from "react"
import { X, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { vehicleService } from "@/lib/services/vehicle-service"

// India vehicle registration number regex
// Covers: DL 01 CA 1234, MH02AB1234, MH 02 AB 1234, etc.
const REGISTRATION_REGEX = /^[A-Z]{2}[-\s]?[0-9]{1,2}[-\s]?[A-Z]{1,3}[-\s]?[0-9]{1,4}$/

interface AddVehicleModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (vehicle: any) => void
    onEdit?: (vehicle: any) => void
    initialData?: any
}

const VEHICLE_TYPES = [
    { id: "2W", label: "2-Wheeler", icon: "🏍️" },
    { id: "3W", label: "3-Wheeler", icon: "🛺" },
    { id: "4W", label: "4-Wheeler", icon: "🚗" },
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 25 }, (_, i) => (CURRENT_YEAR - i).toString())

export function AddVehicleModal({ isOpen, onClose, onAdd, onEdit, initialData }: AddVehicleModalProps) {
    const [vehicleType, setVehicleType] = useState("4W")
    const [make, setMake]               = useState("")
    const [model, setModel]             = useState("")
    const [variant, setVariant]         = useState("")
    const [year, setYear]               = useState("")
    const [registration, setRegistration] = useState("")
    const [regError, setRegError]       = useState("")
    const [tyreSize, setTyreSize]       = useState("")
    const [isPrimary, setIsPrimary]     = useState(false)

    // API data lists
    const [makes, setMakes]       = useState<string[]>([])
    const [models, setModels]     = useState<string[]>([])
    const [variants, setVariants] = useState<string[]>([])
    const [tyreSizes, setTyreSizes] = useState<string[]>([])

    // Loading states
    const [loadingMakes, setLoadingMakes]     = useState(false)
    const [loadingModels, setLoadingModels]   = useState(false)
    const [loadingVariants, setLoadingVariants] = useState(false)
    const [loadingSizes, setLoadingSizes]     = useState(false)
    const [submitting, setSubmitting]         = useState(false)
    const [error, setError]                   = useState<string | null>(null)

    // Reset form on open/close
    const resetForm = useCallback(() => {
        setVehicleType("4W")
        setMake(""); setModel(""); setVariant(""); setYear("")
        setRegistration(""); setRegError(""); setTyreSize("")
        setIsPrimary(false)
        setMakes([]); setModels([]); setVariants([]); setTyreSizes([])
        setError(null)
    }, [])

    useEffect(() => {
        if (isOpen && initialData) {
            setVehicleType(initialData.vehicleType || "4W")
            setMake(initialData.make || "")
            setModel(initialData.model || "")
            setVariant(initialData.variant || "")
            setYear(initialData.year || "")
            setRegistration(initialData.registrationNumber || "")
            setTyreSize(initialData.tyreSize || "")
            setIsPrimary(initialData.isPrimary || false)
        } else if (isOpen) {
            resetForm()
        }
    }, [isOpen, initialData, resetForm])

    // Fetch Makes when vehicleType changes
    useEffect(() => {
        if (!isOpen) return
        setLoadingMakes(true)
        setMakes([]); setModels([]); setVariants([]); setTyreSizes([])
        setModel(""); setVariant(""); setTyreSize("")
        vehicleService.getMakes(vehicleType)
            .then(res => setMakes(res.data?.makes || []))
            .catch(() => setMakes([]))
            .finally(() => setLoadingMakes(false))
    }, [vehicleType, isOpen])

    // Fetch Models when Make changes
    useEffect(() => {
        if (!isOpen || !make) { setModels([]); setModel(""); return }
        setLoadingModels(true)
        setModels([]); setVariants([]); setTyreSizes([])
        setModel(""); setVariant(""); setTyreSize("")
        vehicleService.getModels(vehicleType, make)
            .then(res => setModels(res.data?.models || []))
            .catch(() => setModels([]))
            .finally(() => setLoadingModels(false))
    }, [make, vehicleType, isOpen])

    // Fetch Variants when Model changes
    useEffect(() => {
        if (!isOpen || !make || !model) { setVariants([]); setVariant(""); return }
        setLoadingVariants(true)
        setVariants([]); setTyreSizes([])
        setVariant(""); setTyreSize("")
        vehicleService.getVariants(vehicleType, make, model)
            .then(res => setVariants(res.data?.variants || []))
            .catch(() => setVariants([]))
            .finally(() => setLoadingVariants(false))
    }, [model, make, vehicleType, isOpen])

    // Fetch Tyre Sizes when Variant changes
    useEffect(() => {
        if (!isOpen || !make || !model || !variant) { setTyreSizes([]); setTyreSize(""); return }
        setLoadingSizes(true)
        setTyreSizes([]); setTyreSize("")
        vehicleService.getTyreSizes(make, model, variant)
            .then(res => setTyreSizes(res.data?.sizes || []))
            .catch(() => setTyreSizes([]))
            .finally(() => setLoadingSizes(false))
    }, [variant, make, model, isOpen])

    const validateRegistration = (value: string) => {
        if (!value) { setRegError(""); return true }
        const clean = value.replace(/\s+/g, " ").trim()
        if (!REGISTRATION_REGEX.test(clean)) {
            setRegError("Invalid format. Use: MH 02 AB 1234")
            return false
        }
        setRegError("")
        return true
    }

    const handleRegistrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toUpperCase()
        setRegistration(val)
        validateRegistration(val)
    }

    const isFormValid = make && model && variant && year && tyreSize && !regError

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateRegistration(registration)) return
        if (!isFormValid) return

        setSubmitting(true)
        setError(null)
        try {
            const payload = {
                vehicleName: `${year} ${make} ${model} ${variant}`.trim(),
                make,
                model,
                variant,
                vehicleType,
                year,
                registrationNumber: registration || undefined,
                tyreSize,
                isPrimary,
            }

            if (initialData && onEdit) {
                onEdit({ id: initialData.id, ...payload })
            } else {
                onAdd(payload)
            }
            resetForm()
        } catch {
            setError("Failed to save vehicle. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    const selectClass = "w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488] bg-white disabled:bg-gray-50 disabled:text-gray-400"

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[92vh] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-[#1F2937] flex items-center gap-2">
                                🚗 {initialData ? "EDIT VEHICLE" : "ADD NEW VEHICLE"}
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Vehicle Type */}
                            <div>
                                <label className="block text-sm font-medium text-[#1F2937] mb-3">Vehicle Type</label>
                                <div className="flex gap-4">
                                    {VEHICLE_TYPES.map((type) => (
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
                                                onChange={(e) => setVehicleType(e.target.value)}
                                                className="sr-only"
                                            />
                                            <span className="text-2xl mb-1">{type.icon}</span>
                                            <span className="text-sm font-medium">{type.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Make */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2937] mb-2">Vehicle Make *</label>
                                    <div className="relative">
                                        <select
                                            required
                                            value={make}
                                            onChange={(e) => setMake(e.target.value)}
                                            disabled={loadingMakes}
                                            className={selectClass}
                                        >
                                            <option value="">{loadingMakes ? "Loading..." : "Select Make"}</option>
                                            {makes.map((m) => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                        {loadingMakes && <Loader2 className="absolute right-3 top-3.5 w-4 h-4 animate-spin text-[#0D9488]" />}
                                    </div>
                                </div>

                                {/* Model */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2937] mb-2">Model *</label>
                                    <div className="relative">
                                        <select
                                            required
                                            value={model}
                                            onChange={(e) => setModel(e.target.value)}
                                            disabled={!make || loadingModels}
                                            className={selectClass}
                                        >
                                            <option value="">{loadingModels ? "Loading..." : !make ? "Select a make first" : "Select Model"}</option>
                                            {models.map((m) => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                        {loadingModels && <Loader2 className="absolute right-3 top-3.5 w-4 h-4 animate-spin text-[#0D9488]" />}
                                    </div>
                                </div>

                                {/* Variant */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2937] mb-2">Variant *</label>
                                    <div className="relative">
                                        <select
                                            required
                                            value={variant}
                                            onChange={(e) => setVariant(e.target.value)}
                                            disabled={!model || loadingVariants}
                                            className={selectClass}
                                        >
                                            <option value="">{loadingVariants ? "Loading..." : !model ? "Select a model first" : "Select Variant"}</option>
                                            {variants.map((v) => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                        {loadingVariants && <Loader2 className="absolute right-3 top-3.5 w-4 h-4 animate-spin text-[#0D9488]" />}
                                    </div>
                                </div>

                                {/* Year — manual entry via select */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2937] mb-2">Year *</label>
                                    <select
                                        required
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className={selectClass}
                                    >
                                        <option value="">Select Year</option>
                                        {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>

                                {/* Registration Number — manual text entry with regex */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2937] mb-2">
                                        Registration Number
                                        <span className="ml-1 text-gray-400 font-normal text-xs">(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={registration}
                                        onChange={handleRegistrationChange}
                                        onBlur={() => validateRegistration(registration)}
                                        placeholder="MH 02 AB 1234"
                                        maxLength={13}
                                        className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                                            regError
                                                ? "border-red-400 focus:ring-red-300 bg-red-50"
                                                : "border-gray-200 focus:ring-[#0D9488]"
                                        }`}
                                    />
                                    {regError && (
                                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            {regError}
                                        </p>
                                    )}
                                    {registration && !regError && (
                                        <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Valid registration number
                                        </p>
                                    )}
                                </div>

                                {/* Tyre Size */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1F2937] mb-2">Tyre Size *</label>
                                    <div className="relative">
                                        <select
                                            required
                                            value={tyreSize}
                                            onChange={(e) => setTyreSize(e.target.value)}
                                            disabled={!variant || loadingSizes}
                                            className={selectClass}
                                        >
                                            <option value="">{loadingSizes ? "Loading..." : !variant ? "Select a variant first" : "Select Size"}</option>
                                            {tyreSizes.map((s) => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        {loadingSizes && <Loader2 className="absolute right-3 top-3.5 w-4 h-4 animate-spin text-[#0D9488]" />}
                                    </div>
                                </div>
                            </div>

                            {/* Set as primary vehicle */}
                            <label className="flex items-center gap-3 cursor-pointer select-none group">
                                <div
                                    onClick={() => setIsPrimary(!isPrimary)}
                                    className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors flex-shrink-0 ${
                                        isPrimary ? "bg-[#0D9488] border-[#0D9488]" : "border-gray-300 group-hover:border-[#0D9488]"
                                    }`}
                                >
                                    {isPrimary && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={isPrimary}
                                    onChange={(e) => setIsPrimary(e.target.checked)}
                                    className="hidden"
                                />
                                <span className="text-[#1F2937] text-sm">Set as primary vehicle</span>
                            </label>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 border border-[#0D9488] text-[#0D9488] font-semibold rounded-xl hover:bg-[#F0FDFA] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || !isFormValid}
                                    className="flex-1 py-3 bg-[#0D9488] text-white font-semibold rounded-xl hover:bg-[#0F766E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                    ) : (
                                        initialData ? "Save Changes" : "Add Vehicle"
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
