"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { OtpModal } from "@/components/otp-modal"
import { useAppSelector } from "@/lib/hooks"

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/search")
    }
  }, [isAuthenticated, router])

  const handleSuccess = () => {
    router.replace("/search")
  }

  const handleClose = () => {
    setIsOpen(false)
    router.replace("/")
  }

  return (
    <OtpModal
      isOpen={isOpen}
      onClose={handleClose}
      onSuccess={handleSuccess}
    />
  )
}
