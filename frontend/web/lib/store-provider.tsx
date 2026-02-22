"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { Provider } from "react-redux"
import { makeStore, type AppStore, setUser, logout } from "./store"

import { GoogleOAuthProvider } from "@react-oauth/google"

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null)

  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  useEffect(() => {
    if (storeRef.current) {
      // Initialize auth from localStorage
      const stored = localStorage.getItem("tyreplus_user")
      if (stored) {
        try {
          const user = JSON.parse(stored)
          storeRef.current.dispatch(setUser(user))
        } catch {
          storeRef.current.dispatch(logout())
        }
      } else {
        storeRef.current.dispatch(logout())
      }
    }
  }, [])

  // REPLACE WITH YOUR ACTUAL GOOGLE CLIENT ID
  // You can get one from https://console.cloud.google.com/apis/credentials
  const GOOGLE_CLIENT_ID = "436137671485-9o17l3pe459st9l1d69alor0e76ssvqo.apps.googleusercontent.com"

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={storeRef.current}>{children}</Provider>
    </GoogleOAuthProvider>
  )
}
