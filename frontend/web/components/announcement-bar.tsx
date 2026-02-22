"use client"

import { useState } from "react"
import { X, Truck, Shield, Wrench } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar flex-1">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Truck className="w-4 h-4" />
                <span className="text-sm font-medium">🎉 FLASH SALE: Get 25% OFF on Premium Tyres | Limited Time! </span>
                <a href="#" className="announcement-link text-decoration-underline">Shop Now →</a>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="ml-4 p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
