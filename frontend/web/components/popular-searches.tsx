"use client"

import Link from "next/link"

const popularSearches = [
    { label: "Maruti Swift", query: { make: "Maruti", model: "Swift" } },
    { label: "Honda City", query: { make: "Honda", model: "City" } },
    { label: "Hyundai i20", query: { make: "Hyundai", model: "i20" } },
    { label: "Tata Nexon", query: { make: "Tata", model: "Nexon" } },
    { label: "MRF Tyres", query: { brand: "MRF" } },
    { label: "CEAT Tyres", query: { brand: "CEAT" } },
    { label: "Apollo Tyres", query: { brand: "Apollo" } },
    { label: "Michelin", query: { brand: "Michelin" } },
]

export function PopularSearches() {
    return (
        <section className="py-12 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1F2937] mb-8 flex items-center justify-center gap-2">
                    <span className="text-3xl">🔥</span> POPULAR SEARCHES
                </h2>
                <div className="flex flex-wrap justify-center gap-4">
                    {popularSearches.map((item) => (
                        <Link
                            key={item.label}
                            href={{ pathname: "/search", query: item.query }}
                            className="px-6 py-3 bg-white border border-gray-200 rounded-full text-[#1F2937] font-medium hover:border-[#0D9488] hover:text-[#0D9488] hover:shadow-sm transition-all duration-200"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
