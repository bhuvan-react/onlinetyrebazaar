"use client"

import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { updateFormField, validateForm, submitSellTyresForm, requestOtp, verifyOtp } from "@/lib/sellTyresSlice"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Tag, Calendar as CalendarIcon, Clock, DollarSign, Gauge, Package, Smartphone, Lock, ChevronDown, Check, Car, Bike, Truck } from "lucide-react"
import { useState, useEffect } from "react"
import { format } from "date-fns"

import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function SellTyresPage() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { formData, validation, status, otpSent, otpVerified } = useAppSelector((state) => state.sellTyres)
    const { isAuthenticated, user } = useAppSelector((state) => state.auth)
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [otpInput, setOtpInput] = useState("")
    const [otpError, setOtpError] = useState("")
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

    useEffect(() => {
        if (isAuthenticated && user?.mobile) {
            dispatch(updateFormField({ field: "mobile", value: user.mobile }))
            // Auto verify dispatch if needed, or let them click verify
            // If already verified in state?
            if (!otpVerified) {
                // We don't auto-verify just because they are logged in, maybe we should?
                // For now, let's just prefill.
            }
        }
    }, [isAuthenticated, user, dispatch, otpVerified])

    const vehicleTypes = [
        { id: "2W", label: "2 Wheeler", icon: Bike },
        { id: "3W", label: "3 Wheeler", icon: Truck },
        { id: "4W", label: "4 Wheeler", icon: Car },
    ]
    const tyrePositions = ["Front", "Rear", "Both"]
    const tyreMakes = ["MRF", "CEAT", "Apollo", "Michelin", "Bridgestone"]
    const tyreAges = ["<6 months", "6–12 months", "1–2 years", "2+ years"]
    const timeSlots = ["9–11 AM", "11–1 PM", "2–4 PM", "4–6 PM"]

    const handleFieldChange = (field: keyof typeof formData, value: any) => {
        // @ts-ignore
        dispatch(updateFormField({ field, value }))
    }

    const handleSelectChange = (field: keyof typeof formData, value: string) => {
        handleFieldChange(field, value)
        setActiveDropdown(null)
    }

    const handleTyrePositionSelect = (pos: string) => {
        let updated: string[] = []
        if (pos === "Both") {
            updated = ["Front", "Rear"]
        } else {
            updated = [pos]
        }
        handleFieldChange("tyrePosition", updated)
        setActiveDropdown(null)
    }

    const handleBlur = (field: string) => {
        setTouched({ ...touched, [field]: true })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        dispatch(validateForm())
        setTouched({
            vehicleType: true,
            tyrePosition: true,
            tyreMake: true,
            tyreAge: true,
            kmDriven: true,
            pickupDate: true,
            pickupTimeSlot: true,
            mobile: true,
        })

        const isValid =
            formData.vehicleType &&
            (formData.vehicleType !== "2W" || (formData.tyrePosition && formData.tyrePosition.length > 0)) &&
            formData.tyreMake &&
            formData.tyreAge &&
            formData.kmDriven &&
            Number(formData.kmDriven) > 0 &&
            formData.pickupDate &&
            formData.pickupTimeSlot &&
            formData.mobile && /^\d{10}$/.test(formData.mobile)

        if (isValid) {
            if (!otpVerified) {
                dispatch(requestOtp())
            } else {
                await dispatch(submitSellTyresForm(formData))
                router.push("/thank-you")
            }
        }
    }

    const handleVerifyOtp = async () => {
        if (otpInput === "1234") {
            dispatch(verifyOtp())
            setOtpError("")
            // Auto submit after verification
            await dispatch(submitSellTyresForm(formData))
            router.push("/thank-you")
        } else {
            setOtpError("Invalid OTP. Please enter '1234'")
        }
    }

    const isFormValid = () => {
        return (
            formData.vehicleType &&
            (formData.vehicleType !== "2W" || (formData.tyrePosition && formData.tyrePosition.length > 0)) &&
            formData.tyreMake &&
            formData.tyreAge &&
            formData.kmDriven &&
            Number(formData.kmDriven) > 0 &&
            formData.pickupDate &&
            formData.pickupTimeSlot &&
            formData.mobile && /^\d{10}$/.test(formData.mobile)
        )
    }

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            handleFieldChange("pickupDate", format(date, "yyyy-MM-dd"))
        }
    }

    // Get today's date in YYYY-MM-DD format for min date
    const today = new Date().toISOString().split("T")[0]

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F0FDFA] via-white to-[#CCFBF1] py-8 px-4 relative" onClick={() => setActiveDropdown(null)}>
            <div className={`max-w-3xl mx-auto ${otpSent && !otpVerified ? 'blur-sm pointer-events-none' : ''}`}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2 text-[#0D9488] hover:text-[#14B8A6] transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Home</span>
                    </button>

                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F0FDFA] text-[#0D9488] rounded-full text-sm font-semibold mb-4">
                            <Tag className="w-4 h-4" />
                            Sell Your Tyres
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-2">
                            💰 Sell Your Old Tyres
                        </h1>
                        <p className="text-[#6B7280]">Fill in the details below and we'll get back to you with the best offer</p>
                    </div>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6 md:p-8"
                    onClick={(e) => e.stopPropagation()}
                >
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Vehicle Type */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-[#1F2937] mb-2">
                                <div className="flex items-center gap-2">
                                    <Car className="w-4 h-4 text-[#0D9488]" />
                                    Vehicle Type <span className="text-red-500">*</span>
                                </div>
                            </label>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDropdown(activeDropdown === "vehicleType" ? null : "vehicleType")
                                }}
                                onBlur={() => handleBlur("vehicleType")}
                                className={`w-full px-4 py-3 border rounded-xl flex items-center justify-between bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] transition-all ${touched.vehicleType && validation.vehicleType
                                    ? "border-red-500"
                                    : "border-[#D1D5DB]"
                                    }`}
                            >
                                <span className={formData.vehicleType ? "text-[#1F2937]" : "text-[#9CA3AF]"}>
                                    {formData.vehicleType ? vehicleTypes.find(v => v.id === formData.vehicleType)?.label : "Select vehicle type"}
                                </span>
                                <ChevronDown className={`w-5 h-5 text-[#6B7280] transition-transform ${activeDropdown === "vehicleType" ? "rotate-180" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {activeDropdown === "vehicleType" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className="absolute z-20 w-full mt-2 bg-white border border-[#E5E7EB] rounded-xl shadow-lg overflow-hidden"
                                    >
                                        {vehicleTypes.map((type) => (
                                            <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => handleSelectChange("vehicleType", type.id)}
                                                className={`w-full px-4 py-3 text-left hover:bg-[#F9FAFB] transition-colors flex items-center gap-2 ${formData.vehicleType === type.id ? "bg-[#F0FDFA] text-[#0D9488]" : "text-[#1F2937]"}`}
                                            >
                                                {/* <type.icon className="w-4 h-4" /> */}
                                                {type.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {touched.vehicleType && validation.vehicleType && (
                                <p className="mt-1 text-sm text-red-500">{validation.vehicleType}</p>
                            )}
                        </div>

                        {/* Tyre Position (Only for 2W) */}
                        <AnimatePresence>
                            {formData.vehicleType === "2W" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="relative overflow-visible pb-6"
                                >
                                    <label className="block text-sm font-medium text-[#1F2937] mb-2">
                                        <div className="flex items-center gap-2">
                                            <Package className="w-4 h-4 text-[#0D9488]" />
                                            Tyre Position <span className="text-red-500">*</span>
                                        </div>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveDropdown(activeDropdown === "tyrePosition" ? null : "tyrePosition")
                                        }}
                                        onBlur={() => handleBlur("tyrePosition")}
                                        className={`w-full px-4 py-3 border rounded-xl flex items-center justify-between bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] transition-all ${touched.tyrePosition && validation.tyrePosition
                                            ? "border-red-500"
                                            : "border-[#D1D5DB]"
                                            }`}
                                    >
                                        <span className={formData.tyrePosition?.length ? "text-[#1F2937]" : "text-[#9CA3AF]"}>
                                            {formData.tyrePosition?.length === 2 ? "Both" : formData.tyrePosition?.join(", ") || "Select tyre position"}
                                        </span>
                                        <ChevronDown className={`w-5 h-5 text-[#6B7280] transition-transform ${activeDropdown === "tyrePosition" ? "rotate-180" : ""}`} />
                                    </button>

                                    <AnimatePresence>
                                        {activeDropdown === "tyrePosition" && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                className="absolute z-20 w-full mt-2 bg-white border border-[#E5E7EB] rounded-xl shadow-lg overflow-hidden"
                                            >
                                                {tyrePositions.map((pos) => {
                                                    // Determine if this row should be checked
                                                    const isChecked =
                                                        pos === "Both"
                                                            ? formData.tyrePosition?.length === 2
                                                            : formData.tyrePosition?.includes(pos)

                                                    return (
                                                        <button
                                                            key={pos}
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleTyrePositionSelect(pos)
                                                            }}
                                                            className={`w-full px-4 py-3 text-left hover:bg-[#F9FAFB] transition-colors flex items-center gap-3 ${isChecked ? "bg-[#F0FDFA] text-[#0D9488]" : "text-[#1F2937]"}`}
                                                        >
                                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? "bg-[#0D9488] border-[#0D9488]" : "border-gray-400 bg-white"}`}>
                                                                {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                                                            </div>
                                                            {pos}
                                                        </button>
                                                    )
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {touched.tyrePosition && validation.tyrePosition && (
                                        <p className="mt-1 text-sm text-red-500">{validation.tyrePosition}</p>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>


                        {/* Tyre Make */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-[#1F2937] mb-2">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-[#0D9488]" />
                                    Tyre Make <span className="text-red-500">*</span>
                                </div>
                            </label>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDropdown(activeDropdown === "tyreMake" ? null : "tyreMake")
                                }}
                                onBlur={() => handleBlur("tyreMake")}
                                className={`w-full px-4 py-3 border rounded-xl flex items-center justify-between bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] transition-all ${touched.tyreMake && validation.tyreMake
                                    ? "border-red-500"
                                    : "border-[#D1D5DB]"
                                    }`}
                            >
                                <span className={formData.tyreMake ? "text-[#1F2937]" : "text-[#9CA3AF]"}>
                                    {formData.tyreMake || "Select tyre make"}
                                </span>
                                <ChevronDown className={`w-5 h-5 text-[#6B7280] transition-transform ${activeDropdown === "tyreMake" ? "rotate-180" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {activeDropdown === "tyreMake" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className="absolute z-20 w-full mt-2 bg-white border border-[#E5E7EB] rounded-xl shadow-lg max-h-60 overflow-y-auto"
                                    >
                                        {tyreMakes.map((make) => (
                                            <button
                                                key={make}
                                                type="button"
                                                onClick={() => handleSelectChange("tyreMake", make)}
                                                className={`w-full px-4 py-3 text-left hover:bg-[#F9FAFB] transition-colors ${formData.tyreMake === make ? "bg-[#F0FDFA] text-[#0D9488]" : "text-[#1F2937]"}`}
                                            >
                                                {make}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {touched.tyreMake && validation.tyreMake && (
                                <p className="mt-1 text-sm text-red-500">{validation.tyreMake}</p>
                            )}
                        </div>

                        {/* Tyre Age */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-[#1F2937] mb-2">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-[#0D9488]" />
                                    Tyre Age <span className="text-red-500">*</span>
                                </div>
                            </label>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDropdown(activeDropdown === "tyreAge" ? null : "tyreAge")
                                }}
                                onBlur={() => handleBlur("tyreAge")}
                                className={`w-full px-4 py-3 border rounded-xl flex items-center justify-between bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] transition-all ${touched.tyreAge && validation.tyreAge
                                    ? "border-red-500"
                                    : "border-[#D1D5DB]"
                                    }`}
                            >
                                <span className={formData.tyreAge ? "text-[#1F2937]" : "text-[#9CA3AF]"}>
                                    {formData.tyreAge || "Select tyre age"}
                                </span>
                                <ChevronDown className={`w-5 h-5 text-[#6B7280] transition-transform ${activeDropdown === "tyreAge" ? "rotate-180" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {activeDropdown === "tyreAge" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className="absolute z-20 w-full mt-2 bg-white border border-[#E5E7EB] rounded-xl shadow-lg max-h-60 overflow-y-auto"
                                    >
                                        {tyreAges.map((age) => (
                                            <button
                                                key={age}
                                                type="button"
                                                onClick={() => handleSelectChange("tyreAge", age)}
                                                className={`w-full px-4 py-3 text-left hover:bg-[#F9FAFB] transition-colors ${formData.tyreAge === age ? "bg-[#F0FDFA] text-[#0D9488]" : "text-[#1F2937]"}`}
                                            >
                                                {age}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {touched.tyreAge && validation.tyreAge && (
                                <p className="mt-1 text-sm text-red-500">{validation.tyreAge}</p>
                            )}
                        </div>

                        {/* Kilometers Driven */}
                        <div>
                            <label className="block text-sm font-medium text-[#1F2937] mb-2">
                                <div className="flex items-center gap-2">
                                    <Gauge className="w-4 h-4 text-[#0D9488]" />
                                    Kilometers Driven <span className="text-red-500">*</span>
                                </div>
                            </label>
                            <input
                                type="number"
                                value={formData.kmDriven}
                                onChange={(e) => handleFieldChange("kmDriven", e.target.value)}
                                onBlur={() => handleBlur("kmDriven")}
                                placeholder="e.g., 15000"
                                min="0"
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488] transition-all ${touched.kmDriven && validation.kmDriven
                                    ? "border-red-500"
                                    : "border-[#D1D5DB]"
                                    }`}
                            />
                            {touched.kmDriven && validation.kmDriven && (
                                <p className="mt-1 text-sm text-red-500">{validation.kmDriven}</p>
                            )}
                        </div>

                        {/* Expected Price */}
                        <div>
                            <label className="block text-sm font-medium text-[#1F2937] mb-2">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-[#0D9488]" />
                                    Expected Price (Optional)
                                </div>
                            </label>
                            <input
                                type="number"
                                value={formData.expectedPrice}
                                onChange={(e) => handleFieldChange("expectedPrice", e.target.value)}
                                placeholder="e.g., 5000"
                                min="0"
                                className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488] transition-all"
                            />
                            <p className="mt-1 text-xs text-[#6B7280]">Leave blank if you're unsure</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Pickup Date - Popover Calendar */}
                            <div className="flex flex-col">
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4 text-[#0D9488]" />
                                        Pickup Date <span className="text-red-500">*</span>
                                    </div>
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            className={cn(
                                                "w-full px-4 py-3 text-left border rounded-xl flex items-center justify-between bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] transition-all",
                                                !formData.pickupDate && "text-muted-foreground",
                                                touched.pickupDate && validation.pickupDate ? "border-red-500" : "border-[#D1D5DB]"
                                            )}
                                        >
                                            {formData.pickupDate ? (
                                                format(new Date(formData.pickupDate), "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={formData.pickupDate ? new Date(formData.pickupDate) : undefined}
                                            onSelect={handleDateSelect}
                                            disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {touched.pickupDate && validation.pickupDate && (
                                    <p className="mt-1 text-sm text-red-500">{validation.pickupDate}</p>
                                )}
                            </div>

                            {/* Pickup Time Slot */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-[#1F2937] mb-2">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-[#0D9488]" />
                                        Pickup Time Slot <span className="text-red-500">*</span>
                                    </div>
                                </label>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveDropdown(activeDropdown === "pickupTimeSlot" ? null : "pickupTimeSlot")
                                    }}
                                    onBlur={() => handleBlur("pickupTimeSlot")}
                                    className={`w-full px-4 py-3 border rounded-xl flex items-center justify-between bg-white focus:outline-none focus:ring-2 focus:ring-[#0D9488] transition-all ${touched.pickupTimeSlot && validation.pickupTimeSlot
                                        ? "border-red-500"
                                        : "border-[#D1D5DB]"
                                        }`}
                                >
                                    <span className={formData.pickupTimeSlot ? "text-[#1F2937]" : "text-[#9CA3AF]"}>
                                        {formData.pickupTimeSlot || "Select time slot"}
                                    </span>
                                    <ChevronDown className={`w-5 h-5 text-[#6B7280] transition-transform ${activeDropdown === "pickupTimeSlot" ? "rotate-180" : ""}`} />
                                </button>

                                <AnimatePresence>
                                    {activeDropdown === "pickupTimeSlot" && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            className="absolute z-20 w-full mt-2 bg-white border border-[#E5E7EB] rounded-xl shadow-lg max-h-60 overflow-y-auto"
                                        >
                                            {timeSlots.map((slot) => (
                                                <button
                                                    key={slot}
                                                    type="button"
                                                    onClick={() => handleSelectChange("pickupTimeSlot", slot)}
                                                    className={`w-full px-4 py-3 text-left hover:bg-[#F9FAFB] transition-colors ${formData.pickupTimeSlot === slot ? "bg-[#F0FDFA] text-[#0D9488]" : "text-[#1F2937]"}`}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {touched.pickupTimeSlot && validation.pickupTimeSlot && (
                                    <p className="mt-1 text-sm text-red-500">{validation.pickupTimeSlot}</p>
                                )}
                            </div>
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label className="block text-sm font-medium text-[#1F2937] mb-2">
                                <div className="flex items-center gap-2">
                                    <Smartphone className="w-4 h-4 text-[#0D9488]" />
                                    Mobile Number <span className="text-red-500">*</span>
                                </div>
                            </label>
                            <input
                                type="tel"
                                value={formData.mobile}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                                    handleFieldChange("mobile", val)
                                }}
                                onBlur={() => handleBlur("mobile")}
                                placeholder="Enter 10-digit mobile number"
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488] transition-all ${touched.mobile && validation.mobile
                                    ? "border-red-500"
                                    : "border-[#D1D5DB]"
                                    }`}
                            />
                            {touched.mobile && validation.mobile && (
                                <p className="mt-1 text-sm text-red-500">{validation.mobile}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={!isFormValid() || status === "loading"}
                            whileHover={isFormValid() && status !== "loading" ? { scale: 1.02 } : {}}
                            whileTap={isFormValid() && status !== "loading" ? { scale: 0.98 } : {}}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${isFormValid() && status !== "loading"
                                ? "bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white hover:opacity-90 shadow-lg shadow-teal-500/30"
                                : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                                }`}
                        >
                            {status === "loading" ? "Submitting..." : "Submit Request 🚀"}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Info Card */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 bg-[#F0FDFA] rounded-xl p-4 text-center"
                >
                    <p className="text-sm text-[#0D9488]">
                        💡 Our team will review your tyre details and contact you within 24 hours with the best offer
                    </p>
                </motion.div>
            </div>

            {/* OTP Modal */}
            <AnimatePresence>
                {otpSent && !otpVerified && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full relative z-10"
                        >
                            <div className="text-center mb-6">
                                <div className="mx-auto w-12 h-12 bg-[#F0FDFA] rounded-full flex items-center justify-center mb-4">
                                    <Lock className="w-6 h-6 text-[#0D9488]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1F2937] mb-2">Verify Mobile Number</h3>
                                <p className="text-sm text-[#6B7280]">
                                    Enter the OTP sent to <strong>{formData.mobile}</strong>
                                </p>
                                <p className="text-xs text-[#6B7280] mt-1">(Use <strong>1234</strong> for testing)</p>
                            </div>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={otpInput}
                                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    placeholder="Enter 4-digit OTP"
                                    className="w-full px-4 py-3 text-center text-2xl tracking-widest font-bold border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                                />
                                {otpError && (
                                    <p className="text-sm text-red-500 text-center">{otpError}</p>
                                )}
                                <button
                                    onClick={handleVerifyOtp}
                                    disabled={otpInput.length !== 4}
                                    className={`w-full py-3 rounded-xl font-bold text-white transition-all ${otpInput.length === 4
                                        ? "bg-gradient-to-r from-[#14B8A6] to-[#0D9488] shadow-lg shadow-teal-500/30"
                                        : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                                        }`}
                                >
                                    Verify & Submit
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
