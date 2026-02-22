"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { logout } from "@/lib/store"
import { Menu, X, ChevronDown, User, LogOut, Settings, ShoppingBag, Car } from "lucide-react"

export function Header() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("tyreplus_user")
    dispatch(logout())
    setUserMenuOpen(false)
    router.push("/")
  }

  return (
    <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
              <img src="/otb-logo.png" alt="OTB" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold text-[#1F2937]">Online Tyre Bazaar</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-[#6B7280] hover:text-[#0D9488] transition-colors font-medium">
              Home
            </Link>
            <Link href="#" className="text-[#6B7280] hover:text-[#0D9488] transition-colors font-medium">
              About
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="w-24 h-10 bg-[#F9FAFB] rounded-lg animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#F9FAFB] transition-colors"
                >
                  <div className="w-8 h-8 bg-[#FEE2E2] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-[#0D9488]" />
                  </div>
                  <span className="text-[#1F2937] font-medium">{user.name.split(" ")[0]}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6B7280] transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E5E7EB] overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                        <p className="text-sm font-medium text-[#1F2937]">{user.name}</p>
                        <p className="text-xs text-[#6B7280]">+91 {user.mobile}</p>
                      </div>
                      <div className="py-2">
                        <Link href="/my-vehicles" className="w-full px-4 py-2 text-left text-sm text-[#1F2937] hover:bg-[#F9FAFB] flex items-center gap-3">
                          <Car className="w-4 h-4 text-[#6B7280]" />
                          My Vehicles
                        </Link>
                        <Link href="/my-orders" className="w-full px-4 py-2 text-left text-sm text-[#1F2937] hover:bg-[#F9FAFB] flex items-center gap-3">
                          <ShoppingBag className="w-4 h-4 text-[#6B7280]" />
                          My Orders
                        </Link>
                        <button className="w-full px-4 py-2 text-left text-sm text-[#1F2937] hover:bg-[#F9FAFB] flex items-center gap-3">
                          <Settings className="w-4 h-4 text-[#6B7280]" />
                          Settings
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-sm text-[#0D9488] hover:bg-[#F0FDFA] flex items-center gap-3"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-[#0D9488] font-medium hover:bg-[#F0FDFA] rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#1F2937]" /> : <Menu className="w-6 h-6 text-[#1F2937]" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#E5E7EB] bg-white"
          >
            <nav className="px-4 py-4 space-y-2">
              <Link href="/" className="block px-4 py-2 text-[#1F2937] hover:bg-[#F9FAFB] rounded-lg">
                Home
              </Link>
              <Link href="#" className="block px-4 py-2 text-[#1F2937] hover:bg-[#F9FAFB] rounded-lg">
                About
              </Link>
              <div className="pt-4 border-t border-[#E5E7EB] space-y-2">
                {isAuthenticated && user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-[#6B7280]">
                      Signed in as <span className="font-medium text-[#1F2937]">{user.name}</span>
                    </div>
                    <Link href="/my-vehicles" className="block px-4 py-2 text-[#1F2937] hover:bg-[#F9FAFB] rounded-lg">
                      My Vehicles
                    </Link>
                    <Link href="/my-orders" className="block px-4 py-2 text-[#1F2937] hover:bg-[#F9FAFB] rounded-lg">
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-[#0D9488] hover:bg-[#F0FDFA] rounded-lg"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block px-4 py-2 text-[#0D9488] hover:bg-[#F0FDFA] rounded-lg">
                      Login
                    </Link>
                    <Link href="/register" className="block px-4 py-2 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white rounded-lg text-center">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
