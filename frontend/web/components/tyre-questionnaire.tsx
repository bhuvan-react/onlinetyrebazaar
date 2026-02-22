"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { AlertCircle, Clock, CheckCircle2, DollarSign, Wrench, Shield, Activity, Zap } from "lucide-react"

export interface QuestionnaireData {
    urgency: string
    issues: string[]
    usage: string
    budget: number
    preferences: string[]
}

interface TyreQuestionnaireProps {
    onComplete: (data: QuestionnaireData) => void
    onBack: () => void
}

const steps = [
    { id: "urgency", title: "When do you need tyres?" },
    { id: "issues", title: "Any issues with current tyres?" },
    { id: "usage", title: "How do you use your vehicle?" },
    { id: "budget", title: "What is your budget per tyre?" },
    { id: "preferences", title: "Any specific preferences?" },
]

export function TyreQuestionnaire({ onComplete, onBack }: TyreQuestionnaireProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [data, setData] = useState<QuestionnaireData>({
        urgency: "",
        issues: [],
        usage: "",
        budget: 50, // 0 to 100 scale
        preferences: [],
    })

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            onComplete(data)
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        } else {
            onBack()
        }
    }

    const isStepValid = () => {
        switch (currentStep) {
            case 0: // Urgency
                return !!data.urgency
            case 1: // Issues
                return data.issues.length > 0
            case 2: // Usage
                return !!data.usage
            case 3: // Budget
                return true // Always valid as it has default
            case 4: // Preferences
                return true // Optional
            default:
                return false
        }
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { id: "immediate", label: "Immediately", sub: "Damaged / Worn out", icon: AlertCircle },
                            { id: "week", label: "Within 1 Week", sub: "Planning ahead", icon: Clock },
                            { id: "checking", label: "Just Checking", sub: "Comparing prices", icon: DollarSign },
                            { id: "expert", label: "Need Suggestion", sub: "Not sure", icon: Wrench },
                        ].map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setData({ ...data, urgency: option.id })}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${data.urgency === option.id
                                        ? "border-[#0D9488] bg-[#F0FDFA]"
                                        : "border-gray-200 hover:border-[#0D9488]/50"
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`p-2 rounded-lg ${data.urgency === option.id ? "bg-[#0D9488] text-white" : "bg-gray-100 text-gray-500"
                                            }`}
                                    >
                                        <option.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{option.label}</div>
                                        <div className="text-sm text-gray-500">{option.sub}</div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )

            case 1:
                return (
                    <div className="space-y-3">
                        {[
                            { id: "low_tread", label: "Low tread / smooth tyre", icon: Activity },
                            { id: "punctures", label: "Frequent punctures", icon: Zap },
                            { id: "skidding", label: "Skidding or poor grip", icon: AlertCircle },
                            { id: "cracks", label: "Sidewall cracks / bulge", icon: Shield },
                            { id: "noise", label: "Tyre noise / vibration", icon: Activity },
                        ].map((issue) => (
                            <div
                                key={issue.id}
                                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${data.issues.includes(issue.id)
                                        ? "border-[#0D9488] bg-[#F0FDFA]"
                                        : "border-gray-200 hover:border-[#0D9488]/50"
                                    }`}
                                onClick={() => {
                                    const newIssues = data.issues.includes(issue.id)
                                        ? data.issues.filter((i) => i !== issue.id)
                                        : [...data.issues, issue.id]
                                    setData({ ...data, issues: newIssues })
                                }}
                            >
                                <Checkbox
                                    checked={data.issues.includes(issue.id)}
                                    onCheckedChange={(checked) => {
                                        const newIssues = checked
                                            ? [...data.issues, issue.id]
                                            : data.issues.filter((i) => i !== issue.id)
                                        setData({ ...data, issues: newIssues })
                                    }}
                                    className="mr-4"
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900">{issue.label}</div>
                                </div>
                                <issue.icon
                                    className={`w-5 h-5 ${data.issues.includes(issue.id) ? "text-[#0D9488]" : "text-gray-400"}`}
                                />
                            </div>
                        ))}
                    </div>
                )

            case 2:
                return (
                    <RadioGroup
                        value={data.usage}
                        onValueChange={(val) => setData({ ...data, usage: val })}
                        className="grid grid-cols-1 gap-3"
                    >
                        {[
                            { id: "city", label: "Daily City Use", sub: "Stop & go traffic" },
                            { id: "highway", label: "Long Highway Rides", sub: "High speed stability" },
                            { id: "bad_roads", label: "Rural / Bad Roads", sub: "Durability focus" },
                            { id: "commercial", label: "Commercial Use", sub: "Load carrying" },
                        ].map((usage) => (
                            <div key={usage.id}>
                                <RadioGroupItem value={usage.id} id={usage.id} className="peer sr-only" />
                                <Label
                                    htmlFor={usage.id}
                                    className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${data.usage === usage.id
                                            ? "border-[#0D9488] bg-[#F0FDFA]"
                                            : "border-gray-200 hover:border-[#0D9488]/50"
                                        }`}
                                >
                                    <span className="font-semibold text-gray-900">{usage.label}</span>
                                    <span className="text-sm text-gray-500">{usage.sub}</span>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                )

            case 3:
                return (
                    <div className="space-y-8 py-4">
                        <div className="text-center space-y-2">
                            <div className="text-3xl font-bold text-[#0D9488]">
                                {data.budget < 33 ? "Budget Friendly" : data.budget < 66 ? "Balanced" : "Premium"}
                            </div>
                            <p className="text-gray-500">
                                {data.budget < 33
                                    ? "Focus on lowest price"
                                    : data.budget < 66
                                        ? "Best mix of price & life"
                                        : "Top performance & comfort"}
                            </p>
                        </div>
                        <Slider
                            value={[data.budget]}
                            onValueChange={(val) => setData({ ...data, budget: val[0] })}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-400 font-medium px-1">
                            <span>Lowest Price</span>
                            <span>Balanced</span>
                            <span>Premium</span>
                        </div>
                    </div>
                )

            case 4:
                return (
                    <div className="space-y-3">
                        {[
                            "Warranty required",
                            "Genuine brand only",
                            "Installation support needed",
                            "Exchange / buy-back option",
                            "Used tyre is OK",
                        ].map((pref) => (
                            <div
                                key={pref}
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Checkbox
                                    id={pref}
                                    checked={data.preferences.includes(pref)}
                                    onCheckedChange={(checked) => {
                                        const newPrefs = checked
                                            ? [...data.preferences, pref]
                                            : data.preferences.filter((p) => p !== pref)
                                        setData({ ...data, preferences: newPrefs })
                                    }}
                                />
                                <Label htmlFor={pref} className="text-base font-medium text-gray-700 cursor-pointer">
                                    {pref}
                                </Label>
                            </div>
                        ))}
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                    <span>
                        Step {currentStep + 1} of {steps.length}
                    </span>
                    <span className="text-[#0D9488]">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-[#0D9488]"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{steps[currentStep].title}</h2>
                <p className="text-gray-500">Help us find the perfect match for you.</p>
            </div>

            <div className="min-h-[300px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderStepContent()}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
                <Button variant="outline" onClick={handleBack} className="flex-1 h-12 text-base">
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="flex-1 h-12 text-base bg-[#0D9488] hover:bg-[#0F766E] text-white"
                >
                    {currentStep === steps.length - 1 ? "Find My Tyres" : "Next"}
                </Button>
            </div>
        </div>
    )
}
