"use client"

import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import sellTyresReducer from "./sellTyresSlice"

// Types
interface User {
  id: string
  name: string
  mobile: string
  pincode?: string
  city?: string
  state?: string
  country?: string
  district?: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
}

interface SearchState {
  vehicleType: "2W" | "3W" | "4W" | null
  tyrePosition: string[]
  make: string | null
  model: string | null
  variant: string | null
  pincode: string | null
  city: string | null
  state: string | null
  tyreSize: string | null
}

// Initial states
const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
}

const initialSearchState: SearchState = {
  vehicleType: null,
  tyrePosition: [],
  make: null,
  model: null,
  variant: null,
  pincode: null,
  city: null,
  state: null,
  tyreSize: null,
}

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true
      state.user = action.payload
      state.isLoading = false
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.isLoading = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    initializeAuth: (state) => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("tyreplus_user")
        if (stored) {
          try {
            const user = JSON.parse(stored)
            state.isAuthenticated = true
            state.user = user
          } catch {
            state.isAuthenticated = false
            state.user = null
          }
        }
      }
      state.isLoading = false
    },
  },
})

// Search Slice
const searchSlice = createSlice({
  name: "search",
  initialState: initialSearchState,
  reducers: {
    setVehicleType: (state, action: PayloadAction<"2W" | "3W" | "4W" | null>) => {
      state.vehicleType = action.payload
      state.tyrePosition = []
      state.make = null
      state.model = null
      state.variant = null
    },
    setTyrePosition: (state, action: PayloadAction<string[]>) => {
      state.tyrePosition = action.payload
    },
    setMake: (state, action: PayloadAction<string | null>) => {
      state.make = action.payload
      state.model = null
      state.variant = null
    },
    setModel: (state, action: PayloadAction<string | null>) => {
      state.model = action.payload
      state.variant = null
    },
    setVariant: (state, action: PayloadAction<string | null>) => {
      state.variant = action.payload
    },
    setPincode: (state, action: PayloadAction<string | null>) => {
      state.pincode = action.payload
      if (!action.payload) {
        state.city = null
        state.state = null
      }
    },
    setCity: (state, action: PayloadAction<string | null>) => {
      state.city = action.payload
    },
    setState: (state, action: PayloadAction<string | null>) => {
      state.state = action.payload
    },
    setTyreSize: (state, action: PayloadAction<string | null>) => {
      state.tyreSize = action.payload
    },
    resetSearch: (state) => {
      state.vehicleType = null
      state.tyrePosition = []
      state.make = null
      state.model = null
      state.variant = null
      state.pincode = null
      state.city = null
      state.state = null
      state.tyreSize = null
    },
  },
})

export const { setUser, logout, setLoading, initializeAuth } = authSlice.actions
export const { setVehicleType, setTyrePosition, setMake, setModel, setVariant, setPincode, setCity, setState, setTyreSize, resetSearch } = searchSlice.actions

// Store
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
      search: searchSlice.reducer,
      sellTyres: sellTyresReducer,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
