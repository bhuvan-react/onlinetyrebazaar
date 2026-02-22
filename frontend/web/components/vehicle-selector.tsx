"use client"

import { useRouter } from "next/navigation"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setVehicleType, setTyrePosition, setMake, setModel, setVariant, setPincode, setCity, setState, setUser, setTyreSize } from "@/lib/store"
import { type VehicleType } from "@/lib/vehicle-data"
import { fetchLocationDetails } from "@/lib/geocode"
import { ChevronDown, Check, ShoppingBag, Tag, MapPin, Loader2, Phone, ArrowRight } from "lucide-react"
import Image from "next/image"
import { TyreQuestionnaire, type QuestionnaireData } from "./tyre-questionnaire"
import { OtpModal } from "@/components/otp-modal"
import { vehicleTyreSizes, getAllUniqueSizes } from "@/lib/tyre-data"
import { authService } from "@/lib/services/auth-service"
import { vehicleService } from "@/lib/services/vehicle-service"
import { leadService } from "@/lib/services/lead-service"

interface VehicleSelectorProps {
  onSearch: (mode?: "buy" | "sell") => void
}

type Step = "vehicle-select" | "questionnaire"
type Mode = "buy" | "sell"

export function VehicleSelector({ onSearch }: VehicleSelectorProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const search = useAppSelector((state) => state.search)
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>("buy")
  const [step, setStep] = useState<Step>("vehicle-select")
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [name, setName] = useState("")
  const [mobileNumber, setMobileNumber] = useState("")
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState("")

  // Sell Flow State
  const [sellStep, setSellStep] = useState<"phone" | "otp">("phone")
  const [sellMobile, setSellMobile] = useState("")
  const [sellOtp, setSellOtp] = useState(["", "", "", ""])
  const [sellTimer, setSellTimer] = useState(0)
  const [isSellLoading, setIsSellLoading] = useState(false)
  const sellOtpRefs = useState<(HTMLInputElement | null)[]>([])[0] // minimalistic ref approach or use useRef properly if needed

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (sellStep === "otp" && sellTimer > 0) {
      interval = setInterval(() => setSellTimer((t) => t - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [sellStep, sellTimer])

  // Pre-fill mobile number and name if authenticated
  useEffect(() => {
    if (user?.mobile) {
      setMobileNumber(user.mobile)
    }
    if (user?.name) {
      setName(user.name)
    }
  }, [user])

  const vehicleTypes: { type: VehicleType; label: string; icon: React.ReactNode }[] = [
    { type: "2W", label: "2 Wheeler", icon: <Image src="/pulsar-icon.png" alt="2 Wheeler" width={32} height={32} className="w-8 h-8 object-contain" /> },
    { type: "3W", label: "3 Wheeler", icon: <Image src="/auto-icon.png" alt="3 Wheeler" width={32} height={32} className="w-8 h-8 object-contain" /> },
    { type: "4W", label: "4 Wheeler", icon: <Image src="/mustang-icon.png" alt="4 Wheeler" width={32} height={32} className="w-8 h-8 object-contain" /> },
  ]

  const tyrePositions = ["Front", "Rear", "Both"]
  const [makes, setMakes] = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])
  const [variants, setVariants] = useState<string[]>([])
  const [availableTyreSizes, setAvailableTyreSizes] = useState<string[]>([])

  // Fetch Makes
  useEffect(() => {
    if (search.vehicleType) {
      const fetchMakes = async () => {
        try {
          const response = await vehicleService.getMakes(search.vehicleType!)
          // Handle API inconsistency: Makes are objects {makeName: string}, but Models are strings.
          const makeData = response.data.makes || []
          setMakes(makeData.map((m: any) => (typeof m === "object" ? m.makeName : m)))
        } catch (error) {
          console.error("Failed to fetch makes", error)
          setMakes([])
        }
      }
      fetchMakes()
    } else {
      setMakes([])
    }
  }, [search.vehicleType])

  // Fetch Models
  useEffect(() => {
    if (search.vehicleType && search.make) {
      const fetchModels = async () => {
        try {
          const response = await vehicleService.getModels(search.vehicleType!, search.make!)
          setModels(response.data.models || [])
        } catch (error) {
          console.error("Failed to fetch models", error)
          setModels([])
        }
      }
      fetchModels()
    } else {
      setModels([])
    }
  }, [search.vehicleType, search.make])

  // Fetch Variants
  useEffect(() => {
    if (search.vehicleType && search.make && search.model) {
      const fetchVariants = async () => {
        try {
          const response = await vehicleService.getVariants(search.vehicleType!, search.make!, search.model!)
          setVariants(response.data.variants || [])
        } catch (error) {
          console.error("Failed to fetch variants", error)
          setVariants([])
        }
      }
      fetchVariants()
    } else {
      setVariants([])
    }
  }, [search.vehicleType, search.make, search.model])

  // Fetch Tyre Sizes
  useEffect(() => {
    if (search.make && search.model && search.variant) {
      const fetchSizes = async () => {
        try {
          const response = await vehicleService.getTyreSizes(search.make!, search.model!, search.variant!)
          if (response.data.sizes && response.data.sizes.length > 0) {
            setAvailableTyreSizes(response.data.sizes)
          } else {
            // Fallback to all unique sizes if API returns empty, or just empty if strict
            setAvailableTyreSizes(getAllUniqueSizes())
          }
        } catch (error) {
          console.error("Failed to fetch tyre sizes", error)
          setAvailableTyreSizes(getAllUniqueSizes())
        }
      }
      fetchSizes()
    } else {
      setAvailableTyreSizes([])
    }
  }, [search.make, search.model, search.variant])

  const isSearchEnabled =
    search.vehicleType &&
    (search.vehicleType !== "2W" || (search.tyrePosition && search.tyrePosition.length > 0)) &&
    search.make &&
    search.model &&
    search.variant &&
    search.tyreSize &&
    search.tyreSize &&
    search.pincode?.length === 6 &&
    name.trim().length >= 2 &&
    mobileNumber.length === 10

  const handleVehicleTypeSelect = (type: VehicleType) => {
    dispatch(setVehicleType(type))
  }

  const handleTyrePositionSelect = (pos: string) => {
    let updated: string[] = []
    if (pos === "Both") {
      updated = ["Front", "Rear"]
    } else {
      updated = [pos]
    }
    dispatch(setTyrePosition(updated))
    setActiveDropdown(null)
  }

  const handleMakeSelect = (make: string) => {
    dispatch(setMake(make))
    setActiveDropdown(null)
  }

  const handleModelSelect = (model: string) => {
    dispatch(setModel(model))
    setActiveDropdown(null)
  }

  const handleVariantSelect = (variant: string) => {
    dispatch(setVariant(variant))
    setActiveDropdown(null)
  }

  const handleTyreSizeSelect = (size: string) => {
    dispatch(setTyreSize(size))
    setActiveDropdown(null)
  }

  const handlePincodeChange = async (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 6)
    dispatch(setPincode(numericValue))
    setLocationError("")

    if (numericValue.length === 6) {
      setIsLocating(true)
      const details = await fetchLocationDetails(numericValue)
      setIsLocating(false)

      if (details) {
        dispatch(setCity(details.district))
        dispatch(setState(details.state))
      } else {
        setLocationError("Invalid Pincode")
        dispatch(setCity(null))
        dispatch(setState(null))
      }
    } else {
      dispatch(setCity(null))
      dispatch(setState(null))
    }
  }

  const [isAuthLoading, setIsAuthLoading] = useState(false)

  const handleSearchClick = async () => {
    if (mode === "buy") {
      // If user is authenticated AND the entered mobile number matches their profile
      if (isAuthenticated && user?.mobile === mobileNumber) {
        setStep("questionnaire")
      } else {
        // Trigger Send OTP API
        setIsAuthLoading(true)
        try {
          const response = await authService.sendCustomerOtp(mobileNumber)
          if (response.data) {
            setShowOtpModal(true)
          } else {
            console.error("Failed to send OTP:", response.error || "Unknown error")
            // Optional: Show error toast
          }
        } catch (error) {
          console.error("Error sending OTP:", error)
        } finally {
          setIsAuthLoading(false)
        }
      }
    } else {
      // For sell mode, maybe just redirect or show a message
      onSearch("sell")
    }
  }

  const handleOtpSuccess = () => {
    setShowOtpModal(false)
    setStep("questionnaire")
  }

  const handleQuestionnaireComplete = async (data: QuestionnaireData) => {
    if (!isAuthenticated || !user) {
      alert("Please login first")
      return
    }

    try {
      const payload = {
        vehicleType: search.vehicleType,
        tyreType: "NEW", // Enforce NEW for buy flow
        tyreBrand: data.preferences.includes("Genuine brand only") ? "OEM/Premium" : "Any",
        vehicleModel: `${search.make} ${search.model} ${search.variant}`,
        locationArea: search.city || search.state || "Unknown",
        locationPincode: search.pincode,
        // The following are additional fields that aren't strict validation constraints on the DTO but are useful to send
        tyreSize: search.tyreSize,
        tyrePosition: search.tyrePosition?.join(", ") || "Both",
        urgency: data.urgency,
        quantity: 1,
      }

      const response = await leadService.createLead(payload)
      if (response.data) {
        onSearch("buy")
      } else {
        alert("Failed to create tyre requirement. Please try again.")
      }
    } catch (error) {
      console.error("Error creating lead:", error)
      alert("Error creating tyre requirement.")
    }
  }

  // Sell Flow Handlers
  const handleSellPhoneSubmit = async () => {
    if (sellMobile.length !== 10) return
    setIsSellLoading(true)
    try {
      await authService.sendCustomerOtp(sellMobile)

      setIsSellLoading(false)
      setSellStep("otp")
      setSellTimer(30)
      // Focus first OTP input
      setTimeout(() => {
        const firstInput = document.getElementById("sell-otp-0")
        if (firstInput) firstInput.focus()
      }, 100)
    } catch (error) {
      console.error("Failed to send OTP", error)
      setIsSellLoading(false)
    }
  }

  const handleSellOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...sellOtp]
    newOtp[index] = value.slice(-1)
    setSellOtp(newOtp)

    if (value && index < 3) {
      const nextInput = document.getElementById(`sell-otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  // Auto-submit effect
  useEffect(() => {
    if (sellStep === "otp" && sellOtp.every(d => d !== "")) {
      handleSellOtpSubmit()
    }
  }, [sellOtp, sellStep])


  const handleSellOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !sellOtp[index] && index > 0) {
      const prevInput = document.getElementById(`sell-otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleSellOtpSubmit = async () => {
    const otpValue = sellOtp.join("")
    if (otpValue.length !== 4) return

    // Prevent double submission if already loading
    if (isSellLoading) return

    setIsSellLoading(true)

    try {
      const response = await authService.verifyCustomerOtp(sellMobile, otpValue)

      if (response.data.token) {
        // Save user to store
        let user;
        if (response.data.user) {
          user = { ...response.data.user, mobile: sellMobile, role: response.data.user.role || "customer" };
        } else {
          user = {
            id: `user_${Date.now()}`,
            name: "Guest Seller",
            mobile: sellMobile,
            role: "customer"
          }
        }

        localStorage.setItem("tyreplus_user", JSON.stringify(user))
        dispatch(setUser(user as any)) // Cast to any to handle type mismatch since User might have stricter fields

        setIsSellLoading(false)
        router.push("/sell-tyres")
      } else {
        console.error("OTP Verification failed")
        setIsSellLoading(false)
      }
    } catch (error) {
      console.error("Failed to verify OTP", error)
      setIsSellLoading(false)
    }
  }

  const handleSellResendOtp = async () => {
    if (sellTimer > 0) return
    setIsSellLoading(true)
    try {
      await authService.sendCustomerOtp(sellMobile)
      setIsSellLoading(false)
      setSellTimer(30)
      setSellOtp(["", "", "", ""])
      const firstInput = document.getElementById("sell-otp-0")
      if (firstInput) firstInput.focus()
    } catch (error) {
      console.error("Failed to resend OTP", error)
      setIsSellLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6 md:p-8 overflow-hidden relative">
      {/* Buy/Sell Toggle */}
      {step === "vehicle-select" && (
        <div className="flex bg-gray-100 p-1 rounded-xl mb-8 w-full max-w-md mx-auto">
          <button
            onClick={() => setMode("buy")}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg text-base font-semibold transition-all ${mode === "buy" ? "bg-white text-[#0D9488] shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <ShoppingBag className="w-5 h-5" />
            Buy Tyres
          </button>
          <button
            onClick={() => setMode("sell")}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg text-base font-semibold transition-all ${mode === "sell" ? "bg-white text-[#0D9488] shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <Tag className="w-5 h-5" />
            Sell Tyres
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === "vehicle-select" && (
          <motion.div
            key="vehicle-select"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-xl md:text-2xl font-bold text-[#1F2937] mb-6 text-center">
              {mode === "buy" ? "🔍 Find the Perfect Tyres" : "💰 Sell Your Old Tyres"}
            </h2>

            {mode === "sell" ? (
              <div className="max-w-md mx-auto">
                <AnimatePresence mode="wait">
                  {sellStep === "phone" ? (
                    <motion.div
                      key="sell-phone"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="text-center mb-6">
                        <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Tag className="w-8 h-8 text-[#0D9488]" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to sell your tyres?</h3>
                        <p className="text-gray-500">Enter your mobile number to get started</p>
                      </div>

                      <div className="relative mb-4">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">+91</span>
                        <input
                          type="tel"
                          value={sellMobile}
                          onChange={(e) => setSellMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="Enter 10-digit number"
                          className="w-full pl-12 pr-4 py-4 border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all text-lg"
                        />
                      </div>

                      <button
                        onClick={handleSellPhoneSubmit}
                        disabled={sellMobile.length !== 10 || isSellLoading}
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${sellMobile.length === 10 && !isSellLoading
                          ? "bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white hover:opacity-90 shadow-lg shadow-teal-500/30"
                          : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                          }`}
                      >
                        {isSellLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            Get OTP <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sell-otp"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <div className="text-center mb-6">
                        <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Phone className="w-8 h-8 text-[#0D9488]" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Mobile Number</h3>
                        <p className="text-gray-500">
                          Enter OTP sent to <span className="font-medium text-gray-900">+91 {sellMobile}</span>
                        </p>
                        <button
                          onClick={() => setSellStep("phone")}
                          className="text-sm text-[#0D9488] hover:underline mt-1"
                        >
                          Change Number
                        </button>
                      </div>

                      <div className="flex justify-center gap-2 mb-6">
                        {sellOtp.map((digit, index) => (
                          <input
                            key={index}
                            id={`sell-otp-${index}`}
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            value={digit}
                            onChange={(e) => handleSellOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleSellOtpKeyDown(index, e)}
                            className="w-12 h-12 text-center text-xl font-semibold border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all"
                          />
                        ))}
                      </div>

                      <div className="text-center mb-6">
                        <button
                          onClick={handleSellResendOtp}
                          disabled={sellTimer > 0 || isSellLoading}
                          className={`text-sm font-medium ${sellTimer > 0 ? "text-gray-400" : "text-[#0D9488] hover:underline"}`}
                        >
                          {sellTimer > 0 ? `Resend OTP in ${sellTimer}s` : "Resend OTP"}
                        </button>
                      </div>

                      {/* We can hide this verification button if we want auto-submit only, but good to have as backup */}
                      {/* <button
                        onClick={handleSellOtpSubmit}
                        disabled={sellOtp.some(d => d === "") || isSellLoading}
                         className={`w-full py-4 rounded-xl font-bold transition-all ${!sellOtp.some(d => d === "") && !isSellLoading
                            ? "bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white hover:opacity-90 shadow-lg shadow-teal-500/30"
                            : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                          }`}
                      >
                         {isSellLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Verify & Continue"}
                      </button> */}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                {/* Vehicle Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#6B7280] mb-3">Select Vehicle Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {vehicleTypes.map(({ type, label, icon }) => (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleVehicleTypeSelect(type)}
                        className={`relative p-4 rounded-xl border-2 transition-all ${search.vehicleType === type
                          ? "border-[#0D9488] bg-[#F0FDFA]"
                          : "border-[#E5E7EB] bg-white hover:border-[#0D9488]/50"
                          }`}
                      >
                        {search.vehicleType === type && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="relative top-2 right-2 w-5 h-5 bg-[#0D9488] rounded-full flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                        <div className="flex flex-col items-center gap-2">
                          <div className={search.vehicleType === type ? "text-[#0D9488]" : "text-[#6B7280]"}>
                            {icon}
                          </div>
                          <span
                            className={`text-sm font-medium ${search.vehicleType === type ? "text-[#0D9488]" : "text-[#1F2937]"
                              }`}
                          >
                            {label}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Cascading Dropdowns */}
                <AnimatePresence mode="wait">
                  {search.vehicleType && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {/* Tyre Position Dropdown (Only for 2W) */}
                      {search.vehicleType === "2W" && (
                        <div className="relative">
                          <label className="block text-sm font-medium text-[#6B7280] mb-2">Select Tyre Position</label>
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === "tyrePosition" ? null : "tyrePosition")}
                            className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl flex items-center justify-between bg-white hover:border-[#0D9488] transition-colors"
                          >
                            <span className={search.tyrePosition?.length ? "text-[#1F2937]" : "text-[#9CA3AF]"}>
                              {search.tyrePosition?.length === 2 ? "Both" : search.tyrePosition?.join(", ") || "Select tyre position"}
                            </span>
                            <ChevronDown
                              className={`w-5 h-5 text-[#6B7280] transition-transform ${activeDropdown === "tyrePosition" ? "rotate-180" : ""
                                }`}
                            />
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
                                      ? search.tyrePosition?.length === 2
                                      : search.tyrePosition?.includes(pos)

                                  return (
                                    <button
                                      key={pos}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleTyrePositionSelect(pos)
                                      }}
                                      className={`w-full px-4 py-3 text-left hover:bg-[#F9FAFB] transition-colors flex items-center gap-3 ${isChecked ? "bg-[#F0FDFA] text-[#0D9488]" : "text-[#1F2937]"
                                        }`}
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
                        </div>
                      )}
                      {(
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                          <label className="block text-sm font-medium text-[#6B7280] mb-2">Full Name 👤</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all"
                          />
                        </motion.div>
                      )}

                      {/* Make Dropdown */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-[#6B7280] mb-2">Select Make</label>
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === "make" ? null : "make")}
                          className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl flex items-center justify-between bg-white hover:border-[#0D9488] transition-colors"
                        >
                          <span className={search.make ? "text-[#1F2937]" : "text-[#9CA3AF]"}>
                            {search.make || "Choose a make"}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-[#6B7280] transition-transform ${activeDropdown === "make" ? "rotate-180" : ""
                              }`}
                          />
                        </button>
                        <AnimatePresence>
                          {activeDropdown === "make" && (
                            <motion.div
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              className="absolute z-20 w-full mt-2 bg-white border border-[#E5E7EB] rounded-xl shadow-lg max-h-60 overflow-y-auto"
                            >
                              {makes.map((make) => (
                                <button
                                  key={make}
                                  onClick={() => handleMakeSelect(make)}
                                  className={`w-full px-4 py-3 text-left hover:bg-[#F9FAFB] transition-colors ${search.make === make ? "bg-[#F0FDFA] text-[#0D9488]" : "text-[#1F2937]"
                                    }`}
                                >
                                  {make}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Model Dropdown */}
                      {search.make && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative">
                          <label className="block text-sm font-medium text-[#6B7280] mb-2">Select Model</label>
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === "model" ? null : "model")}
                            className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl flex items-center justify-between bg-white hover:border-[#0D9488] transition-colors"
                          >
                            <span className={search.model ? "text-[#1F2937]" : "text-[#9CA3AF]"}>
                              {search.model || "Choose a model"}
                            </span>
                            <ChevronDown
                              className={`w-5 h-5 text-[#6B7280] transition-transform ${activeDropdown === "model" ? "rotate-180" : ""
                                }`}
                            />
                          </button>
                          <AnimatePresence>
                            {activeDropdown === "model" && (
                              <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="absolute z-20 w-full mt-2 bg-white border border-[#E5E7EB] rounded-xl shadow-lg max-h-60 overflow-y-auto"
                              >
                                {models.map((model) => (
                                  <button
                                    key={model}
                                    onClick={() => handleModelSelect(model)}
                                    className={`w-full px-4 py-3 text-left hover:bg-[#F9FAFB] transition-colors ${search.model === model ? "bg-[#F0FDFA] text-[#0D9488]" : "text-[#1F2937]"
                                      }`}
                                  >
                                    {model}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )}

                      {/* Variant Dropdown */}
                      {search.model && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative">
                          <label className="block text-sm font-medium text-[#6B7280] mb-2">Select Variant</label>
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === "variant" ? null : "variant")}
                            className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl flex items-center justify-between bg-white hover:border-[#0D9488] transition-colors"
                          >
                            <span className={search.variant ? "text-[#1F2937]" : "text-[#9CA3AF]"}>
                              {search.variant || "Choose a variant"}
                            </span>
                            <ChevronDown
                              className={`w-5 h-5 text-[#6B7280] transition-transform ${activeDropdown === "variant" ? "rotate-180" : ""
                                }`}
                            />
                          </button>
                          <AnimatePresence>
                            {activeDropdown === "variant" && (
                              <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="absolute z-20 w-full mt-2 bg-white border border-[#E5E7EB] rounded-xl shadow-lg max-h-60 overflow-y-auto"
                              >
                                {variants.map((variant) => (
                                  <button
                                    key={variant}
                                    onClick={() => handleVariantSelect(variant)}
                                    className={`w-full px-4 py-3 text-left hover:bg-[#F9FAFB] transition-colors ${search.variant === variant ? "bg-[#F0FDFA] text-[#0D9488]" : "text-[#1F2937]"
                                      }`}
                                  >
                                    {variant}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )}

                      {/* Tyre Size Dropdown */}
                      {search.variant && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative">
                          <label className="block text-sm font-medium text-[#6B7280] mb-2">Select Tyre Size</label>
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === "tyreSize" ? null : "tyreSize")}
                            className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl flex items-center justify-between bg-white hover:border-[#0D9488] transition-colors"
                          >
                            <span className={search.tyreSize ? "text-[#1F2937]" : "text-[#9CA3AF]"}>
                              {search.tyreSize || "Choose a size"}
                            </span>
                            <ChevronDown
                              className={`w-5 h-5 text-[#6B7280] transition-transform ${activeDropdown === "tyreSize" ? "rotate-180" : ""
                                }`}
                            />
                          </button>
                          <AnimatePresence>
                            {activeDropdown === "tyreSize" && (
                              <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="absolute z-20 w-full mt-2 bg-white border border-[#E5E7EB] rounded-xl shadow-lg max-h-60 overflow-y-auto"
                              >
                                {availableTyreSizes.map((size) => (
                                  <button
                                    key={size}
                                    onClick={() => handleTyreSizeSelect(size)}
                                    className={`w-full px-4 py-3 text-left hover:bg-[#F9FAFB] transition-colors ${search.tyreSize === size ? "bg-[#F0FDFA] text-[#0D9488]" : "text-[#1F2937]"
                                      }`}
                                  >
                                    {size}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )}

                      {/* Pincode Input */}
                      {search.tyreSize && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                          <label className="block text-sm font-medium text-[#6B7280] mb-2">Enter Pincode 📍</label>
                          <input
                            type="text"
                            value={search.pincode || ""}
                            onChange={(e) => handlePincodeChange(e.target.value)}
                            placeholder="Enter 6-digit pincode"
                            className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all"
                          />
                          {search.pincode && search.pincode.length === 6 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mt-2"
                            >
                              {isLocating ? (
                                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Detecting location...
                                </div>
                              ) : search.city && search.state ? (
                                <div className="flex items-center gap-2 text-sm text-[#10B981]">
                                  <MapPin className="w-4 h-4" />
                                  {search.city}, {search.state}
                                </div>
                              ) : locationError ? (
                                <div className="text-sm text-red-500">{locationError}</div>
                              ) : null}
                            </motion.div>
                          )}
                        </motion.div>
                      )}

                      {/* Name Input */}

                      {/* Mobile Number Input */}
                      {search.tyreSize && name.trim().length >= 2 && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                          <label className="block text-sm font-medium text-[#6B7280] mb-2">Mobile Number 📱</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">+91</span>
                            <input
                              type="tel"
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                              placeholder="Enter 10-digit number"
                              className="w-full pl-12 pr-4 py-3 border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all"
                            />
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Search Button */}
                <motion.button
                  whileHover={isSearchEnabled && !isAuthLoading ? { scale: 1.02 } : {}}
                  whileTap={isSearchEnabled && !isAuthLoading ? { scale: 0.98 } : {}}
                  onClick={handleSearchClick}
                  disabled={!isSearchEnabled || isAuthLoading}
                  className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${isSearchEnabled && !isAuthLoading
                    ? "bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white hover:opacity-90 shadow-lg shadow-teal-500/30"
                    : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                    }`}
                >
                  {isAuthLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : mode === "buy" ? (
                    "Next ➡️"
                  ) : (
                    "Sell Now"
                  )}
                </motion.button>
              </>
            )}
          </motion.div>
        )}

        {step === "questionnaire" && (
          <motion.div
            key="questionnaire"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <TyreQuestionnaire
              onComplete={handleQuestionnaireComplete}
              onBack={() => setStep("vehicle-select")}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onSuccess={handleOtpSuccess}
        initialPhone={mobileNumber}
        name={name}
      />
    </div >
  )
}
