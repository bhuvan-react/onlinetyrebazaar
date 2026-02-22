"use client"

import Link from "next/link"

const categories = [
    {
        id: "car-tyres",
        title: "Car Tyres",
        link: "/search?vehicleType=4W&categoryId=car-tyres",
    },
    {
        id: "bike-scooter-tyres",
        title: "Bike / Scooter Tyres",
        link: "/search?vehicleType=2W&categoryId=bike-scooter-tyres",
    },
    {
        id: "auto-tyres",
        title: "Auto Tyres",
        link: "/search?vehicleType=3W&categoryId=auto-tyres",
    },
    {
        id: "alloy-wheels",
        title: "Alloy Wheels",
        link: "/search?category=alloy-wheels&categoryId=alloy-wheels",
    },
]

export function ShopByCategory() {
    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-3">
                        Shop By Categories
                    </h2>
                    <p className="text-lg text-[#6B7280]">Get your Carts ready!</p>
                </div>

                {/* Categories Grid - Chips Layout */}
                <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={category.link}
                            className="px-8 py-4 bg-white border border-gray-200 rounded-full text-lg font-semibold text-[#1F2937] hover:border-[#0D9488] hover:text-[#0D9488] hover:shadow-md transition-all duration-200"
                        >
                            {category.title}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
