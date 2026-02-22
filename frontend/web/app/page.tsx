"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { VehicleSelector } from "@/components/vehicle-selector"
import { OtpModal } from "@/components/otp-modal"
import { PopularSearches } from "@/components/popular-searches"
import { ShopByCategory } from "@/components/shop-by-category"
import { useAppSelector } from "@/lib/hooks"
import { Shield, Truck, Wrench, Star, CheckCircle } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [mode, setMode] = useState<"buy" | "sell">("buy")

  const handleSearch = (currentMode?: "buy" | "sell") => {
    const searchMode = currentMode || mode
    if (searchMode === "sell") {
      router.push("/sell-tyres")
    } else if (isAuthenticated) {
      router.push("/search")
    } else {
      setShowOtpModal(true)
    }
  }

  const handleOtpSuccess = () => {
    router.push("/search")
  }

  const features = [
    { icon: <Truck className="w-6 h-6" />, title: "Free Installation", desc: "At your doorstep" },
    { icon: <Shield className="w-6 h-6" />, title: "Quality Assured", desc: "Verified tyres only" },
    { icon: <Wrench className="w-6 h-6" />, title: "Expert Service", desc: "Trained professionals" },
    { icon: <Star className="w-6 h-6" />, title: "Best Prices", desc: "Guaranteed savings" },
  ]

  const stats = [
    { value: "50K+", label: "Happy Customers" },
    { value: "100+", label: "Cities Covered" },
    { value: "500+", label: "Partner Workshops" },
    { value: "4.8★", label: "Customer Rating" },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#F0FDFA] via-white to-[#CCFBF1] py-12 md:py-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#0D9488] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#14B8A6] rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              {/* Mobile + Desktop: Badge and Heading */}
              <div className="text-center lg:text-left mb-6 lg:mb-0">
                <span className="inline-block px-4 py-2 bg-[#F0FDFA] text-[#0D9488] rounded-full text-base lg:text-lg font-semibold mb-4 lg:mb-6">
                  🚗 India's #1 Tyre Marketplace
                </span>
                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#1F2937] leading-tight mb-6">
                  Buy Car & Bike Tyres <span className="text-[#0D9488]">Online in India</span>
                </h1>
              </div>

              {/* Desktop Only: Description, Pills, and Stats */}
              <div className="hidden lg:block">
                <p className="text-md text-[#6B7280] mb-8 max-w-lg">
                  Welcome to Online Tyre Bazaar, your one-stop destination to buy tyres online at the best prices in India. We offer a wide range of car tyres, bike tyres, SUV tyres, and commercial vehicle tyres from top brands, delivered safely to your doorstep or fitted at a nearby partner store.
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm">
                    <CheckCircle className="w-4 h-4 text-[#10B981]" />
                    New & Used Tyres
                  </span>
                  <span className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm">
                    <CheckCircle className="w-4 h-4 text-[#10B981]" />
                    Free Installation
                  </span>
                  <span className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm">
                    <CheckCircle className="w-4 h-4 text-[#10B981]" />
                    Pan India Delivery
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="text-center md:text-left"
                    >
                      <div className="text-2xl md:text-3xl font-bold text-[#0D9488]">{stat.value}</div>
                      <div className="text-sm text-[#6B7280]">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Content - Vehicle Selector */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <VehicleSelector onSearch={handleSearch} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Searches */}
      <PopularSearches />

      {/* Shop By Category */}
      <ShopByCategory />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-4">Why Choose Online Tyre Bazaar?</h2>
            {/* <p className="text-[#6B7280] max-w-2xl mx-auto">
              We're committed to providing the best tyre shopping experience with quality products and exceptional
              service.
            </p> */}
            <ul>
              <li>Best Tyre Prices Online</li>
              <li>Genuine & Brand-New Tyres</li>
              <li>Easy Tyre Comparison by size, brand & price</li>
              <li>Doorstep Delivery & Nearby Installation</li>
              <li>Secure Online Payment Options</li>
              <li>Expert Tyre Buying Guidance</li>
            </ul>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 bg-[#F9FAFB] rounded-2xl hover:bg-[#F0FDFA] transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-14 h-14 bg-[#E0F2F2] rounded-xl flex items-center justify-center text-[#0D9488] mb-4 group-hover:bg-[#0D9488] group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#1F2937] mb-2">{feature.title}</h3>
                <p className="text-[#6B7280]">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#1F2937]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Perfect Tyres?</h2>
            <p className="text-[#9CA3AF] mb-8 max-w-2xl mx-auto">
              Join thousands of happy customers who trust Online Tyre Bazaar for their tyre needs.
            </p>
            <button
              onClick={() => document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-8 py-4 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              🔍 Search Tyres Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* OTP Modal */}
      <OtpModal isOpen={showOtpModal} onClose={() => setShowOtpModal(false)} onSuccess={handleOtpSuccess} />
    </>
  )
}
