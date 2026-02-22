import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { apiClient } from "./api-client"

export interface SellTyresFormData {
    vehicleType: "2W" | "3W" | "4W" | ""
    tyrePosition: string[] // Multi-select for 2W (Front, Rear)
    tyreMake: string
    tyreAge: string
    kmDriven: string
    expectedPrice: string
    pickupDate: string
    pickupTimeSlot: string
    mobile: string
}

export type SellTyresValidation = Partial<Record<keyof SellTyresFormData, string>>

interface SellTyresState {
    formData: SellTyresFormData
    validation: SellTyresValidation
    status: "idle" | "loading" | "succeeded" | "failed"
    error: string | null
    otpSent: boolean
    otpVerified: boolean
}

const initialState: SellTyresState = {
    formData: {
        vehicleType: "",
        tyrePosition: [],
        tyreMake: "",
        tyreAge: "",
        kmDriven: "",
        expectedPrice: "",
        pickupDate: "",
        pickupTimeSlot: "",
        mobile: "",
    },
    validation: {},
    status: "idle",
    error: null,
    otpSent: false,
    otpVerified: false,
}

// Mock API call - simulates submission with 2-second delay
// Real API call
export const submitSellTyresForm = createAsyncThunk(
    "sellTyres/submitForm",
    async (formData: SellTyresFormData, { getState }) => {
        // Validation check for OTP
        // @ts-ignore
        const { sellTyres } = getState()
        if (!sellTyres.otpVerified) {
            throw new Error("Phone number not verified")
        }

        try {
            const response = await apiClient.post("/sell-tyres/submit", formData)
            return {
                success: true,
                message: "Your tyre selling request has been submitted successfully!",
                data: response,
            }
        } catch (error: any) {
            throw new Error(error.message || "Failed to submit form")
        }
    }
)

const sellTyresSlice = createSlice({
    name: "sellTyres",
    initialState,
    reducers: {
        updateFormField: (state, action: PayloadAction<{ field: keyof SellTyresFormData; value: any }>) => {
            // @ts-ignore
            state.formData[action.payload.field] = action.payload.value
            // Clear validation error for this field when user types
            delete state.validation[action.payload.field]
        },
        setValidationError: (state, action: PayloadAction<{ field: keyof SellTyresFormData; error: string }>) => {
            state.validation[action.payload.field] = action.payload.error
        },
        clearValidationError: (state, action: PayloadAction<keyof SellTyresFormData>) => {
            delete state.validation[action.payload]
        },
        validateForm: (state) => {
            const errors: SellTyresValidation = {}
            const { vehicleType, tyrePosition, tyreMake, tyreAge, kmDriven, pickupDate, pickupTimeSlot, mobile } = state.formData

            if (!vehicleType) {
                errors.vehicleType = "Please select a vehicle type"
            }
            if (vehicleType === "2W" && (!tyrePosition || tyrePosition.length === 0)) {
                errors.tyrePosition = "Please select at least one tyre position"
            }
            if (!tyreMake) {
                errors.tyreMake = "Please select a tyre make"
            }
            if (!tyreAge) {
                errors.tyreAge = "Please select tyre age"
            }
            if (!kmDriven) {
                errors.kmDriven = "Please enter kilometers driven"
            } else if (Number(kmDriven) <= 0) {
                errors.kmDriven = "Kilometers must be greater than 0"
            }
            if (!pickupDate) {
                errors.pickupDate = "Please select a pickup date"
            }
            if (!pickupTimeSlot) {
                errors.pickupTimeSlot = "Please select a time slot"
            }
            if (!mobile) {
                errors.mobile = "Please enter mobile number"
            } else if (!/^\d{10}$/.test(mobile)) {
                errors.mobile = "Please enter a valid 10-digit mobile number"
            }

            state.validation = errors
        },
        resetForm: (state) => {
            state.formData = initialState.formData
            state.validation = {}
            state.status = "idle"
            state.error = null
            state.otpSent = false
            state.otpVerified = false
        },
        requestOtp: (state) => {
            state.otpSent = true
        },
        verifyOtp: (state) => {
            state.otpVerified = true
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitSellTyresForm.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(submitSellTyresForm.fulfilled, (state) => {
                state.status = "succeeded"
                state.error = null
            })
            .addCase(submitSellTyresForm.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.error.message || "Failed to submit form"
            })
    },
})

export const {
    updateFormField,
    setValidationError,
    clearValidationError,
    validateForm,
    resetForm,
    requestOtp,
    verifyOtp,
} = sellTyresSlice.actions

export default sellTyresSlice.reducer
