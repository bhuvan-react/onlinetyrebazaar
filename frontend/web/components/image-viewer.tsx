"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

interface ImageViewerProps {
    isOpen: boolean
    onClose: () => void
    images: string[]
    initialIndex?: number
}

export function ImageViewer({ isOpen, onClose, images, initialIndex = 0 }: ImageViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex)
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen, initialIndex])

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation()
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation()
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Navigation Buttons */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10 hidden md:block"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10 hidden md:block"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    {/* Main Image */}
                    <div className="relative w-full max-w-5xl aspect-video md:aspect-auto md:h-[80vh] flex items-center justify-center">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full h-full"
                        >
                            <Image
                                src={images[currentIndex]}
                                alt={`View ${currentIndex + 1}`}
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>
                    </div>

                    {/* Thumbnails */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full px-4 py-2">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setCurrentIndex(idx)
                                }}
                                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${currentIndex === idx ? "border-[#0D9488] scale-110" : "border-transparent opacity-50 hover:opacity-100"
                                    }`}
                            >
                                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
