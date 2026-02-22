"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Phone, ArrowRight, Check } from "lucide-react"
import { useAppDispatch } from "@/lib/hooks"
import { setUser } from "@/lib/store"
import { authService } from "@/lib/services/auth-service"

interface OtpModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialPhone?: string
  name?: string
}

export function OtpModal({ isOpen, onClose, onSuccess, initialPhone, name }: OtpModalProps) {
  const dispatch = useAppDispatch()
  const [step, setStep] = useState<"phone" | "otp" | "success">(initialPhone ? "otp" : "phone")
  const [phone, setPhone] = useState(initialPhone || "")
  const [otp, setOtp] = useState(["", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(30)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [step, timer])

  const handlePhoneSubmit = async () => {
    if (phone.length !== 10) return
    setIsLoading(true)
    try {
      await authService.sendCustomerOtp(phone)
      setStep("otp")
      setTimer(30)
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    } catch (error) {
      console.error("Failed to send OTP", error)
      alert("Failed to send OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpSubmit = async () => {
    const otpValue = otp.join("")
    if (otpValue.length !== 4) return
    setIsLoading(true)

    try {
      const response = await authService.verifyCustomerOtp(phone, otpValue)

      // Check if token exists (LoginResponse)
      if (response.data.token) {
        // Create user from response or fallback
        // Backend UserInfo doesn't have mobile, but frontend store needs it
        const user = {
          ...response.data.user,
          mobile: phone,
          // ensure fallback for mandatory fields if missing from backend (though backend shouldn't miss them)
          name: response.data.user.name || name || "Guest User",
          role: response.data.user.role || "customer"
        }

        localStorage.setItem("tyreplus_user", JSON.stringify(user))
        localStorage.setItem("tyreplus_token", response.data.token)

        dispatch(setUser(user))

        setIsLoading(false)
        setStep("success")

        setTimeout(() => {
          onSuccess()
          onClose()
        }, 1500)
      } else {
        console.error("OTP Verification failed:", response.data)
        setIsLoading(false)
        alert("Invalid OTP, please try again.")
      }
    } catch (error) {
      console.error("Failed to verify OTP", error)
      setIsLoading(false)
      alert("Failed to verify OTP. Please try again.")
    }
  }

  const handleResendOtp = async () => {
    if (timer > 0) return
    setIsLoading(true)
    try {
      await authService.sendCustomerOtp(phone)
      setTimer(30)
      setOtp(["", "", "", ""])
      otpRefs.current[0]?.focus()
    } catch (error) {
      console.error("Failed to resend OTP", error)
      alert("Failed to resend OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      if (initialPhone) {
        setStep("otp")
        setPhone(initialPhone)
        setTimer(30)
        // Focus logic might need a slight delay as elements render
        setTimeout(() => otpRefs.current[0]?.focus(), 100)
      } else {
        setStep("phone")
        setPhone("")
      }
      setOtp(["", "", "", ""])
    }
  }, [isOpen, initialPhone])

  const resetModal = () => {
    // Reset handled by useEffect on open
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => {
            onClose()
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-[#F0FDFA] px-6 py-8 text-center">
              <button
                onClick={() => {
                  onClose()
                }}
                className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
              <div className="w-16 h-16 bg-gradient-to-br from-[#14B8A6] to-[#0D9488] rounded-full flex items-center justify-center mx-auto mb-4">
                {step === "success" ? (
                  <Check className="w-8 h-8 text-white" />
                ) : (
                  <Phone className="w-8 h-8 text-white" />
                )}
              </div>
              <h3 className="text-xl font-bold text-[#1F2937]">
                {step === "phone" && "Verify Your Number"}
                {step === "otp" && "Enter OTP"}
                {step === "success" && "Verified! 🎉"}
              </h3>
              <p className="text-[#6B7280] mt-2">
                {step === "phone" && "We'll send you a one-time password"}
                {step === "otp" && `OTP sent to +91 ${phone}`}
                {step === "success" && "You're all set to search tyres"}
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {step === "phone" && (
                  <motion.div
                    key="phone"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">+91</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="Enter mobile number"
                        className="w-full pl-14 pr-4 py-3 border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
                        autoFocus
                      />
                    </div>
                    <button
                      onClick={handlePhoneSubmit}
                      disabled={phone.length !== 10 || isLoading}
                      className={`w-full mt-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${phone.length === 10 && !isLoading
                        ? "bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white hover:opacity-90"
                        : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                        }`}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Send OTP
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </motion.div>
                )}

                {step === "otp" && (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="flex justify-center gap-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            otpRefs.current[index] = el
                          }}
                          type="text"
                          inputMode="numeric"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-12 h-12 text-center text-xl font-semibold border border-[#D1D5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
                        />
                      ))}
                    </div>
                    <button
                      onClick={handleOtpSubmit}
                      disabled={otp.join("").length !== 4 || isLoading}
                      className={`w-full mt-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${otp.join("").length === 4 && !isLoading
                        ? "bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white hover:opacity-90"
                        : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                        }`}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Verify OTP
                          <Check className="w-5 h-5" />
                        </>
                      )}
                    </button>
                    <div className="mt-4 text-center">
                      <button
                        onClick={handleResendOtp}
                        disabled={timer > 0 || isLoading}
                        className={`text-sm ${timer > 0 ? "text-[#9CA3AF]" : "text-[#0D9488] hover:underline"}`}
                      >
                        {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <p className="mt-4 text-[#6B7280]">Redirecting to search...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
