"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, Home } from "lucide-react"
import { useAppDispatch } from "@/lib/hooks"
import { resetForm } from "@/lib/sellTyresSlice"
import { useEffect } from "react"

export default function ThankYouPage() {
    const router = useRouter()
    const dispatch = useAppDispatch()

    useEffect(() => {
        // Reset form when thank you page loads
        dispatch(resetForm())
    }, [dispatch])

    const handleBackToHome = () => {
        router.push("/")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F0FDFA] via-white to-[#CCFBF1] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-8 md:p-12 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mx-auto w-20 h-20 bg-gradient-to-br from-[#14B8A6] to-[#0D9488] rounded-full flex items-center justify-center mb-6"
                    >
                        <CheckCircle className="w-12 h-12 text-white" />
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl md:text-3xl font-bold text-[#1F2937] mb-4"
                    >
                        Thank You! 🎉
                    </motion.h1>

                    {/* Message */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-[#6B7280] mb-8 leading-relaxed"
                    >
                        Thank you for submitting your tyre details. Our team will contact you shortly with the best offer for your tyres.
                    </motion.p>

                    {/* Back to Home Button */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleBackToHome}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-teal-500/30"
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </motion.button>

                    {/* Additional Info */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-6 p-4 bg-[#F0FDFA] rounded-xl"
                    >
                        <p className="text-sm text-[#0D9488]">
                            📞 Expect a call within 24 hours
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}
