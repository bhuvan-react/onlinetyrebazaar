"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { User, LayoutDashboard, MapPin, LogOut, Settings, Car } from "lucide-react"

const sidebarItems = [
    {
        title: "Profile",
        href: "/profile",
        icon: User,
    },
    {
        title: "My Vehicles",
        href: "/my-vehicles",
        icon: Car,
    },
    {
        title: "My Orders",
        href: "/my-orders",
        icon: LayoutDashboard,
    },
    {
        title: "Addresses",
        href: "/addresses",
        icon: MapPin,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
]

export function DashboardSidebar() {
    const pathname = usePathname()

    return (
        <nav className="flex flex-col space-y-1">
            {sidebarItems.map((item) => (
                <Link key={item.href} href={item.href}>
                    <span
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                            pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                    </span>
                </Link>
            ))}
            <div className="pt-4 mt-4 border-t">
                <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4" />
                    Log Out
                </Button>
            </div>
        </nav>
    )
}
