import { Button } from "@/components/ui/button"

interface RequestCardProps {
    request: {
        id: string
        tyreName: string
        vehicle: string
        quotesReceived: number
        bestQuote: number
        requestedAt: string
        status: string
    }
}

export function RequestCard({ request }: RequestCardProps) {
    return (
        <div className="bg-white rounded-xl border p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-[#1F2937]">{request.tyreName}</h3>
                    <p className="text-xs text-gray-500">#{request.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.status === "Active" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                    }`}>
                    {request.status}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-6">
                <div>
                    <p className="text-xs text-gray-500 mb-1">Vehicle:</p>
                    <p className="font-semibold text-[#1F2937]">{request.vehicle}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Quotes Received:</p>
                    <p className="font-semibold text-[#1F2937]">{request.quotesReceived} dealers</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Best Quote:</p>
                    <p className="font-bold text-[#0D9488]">₹{request.bestQuote.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Requested:</p>
                    <p className="font-semibold text-[#1F2937]">{request.requestedAt}</p>
                </div>
            </div>

            <div className="flex gap-3">
                <Button className="bg-[#10B981] hover:bg-[#059669] text-white font-medium px-6">
                    View Quotes
                </Button>
                {/* <Button variant="outline" className="text-[#059669] border-[#059669] hover:bg-green-50">
                    Contact Dealer
                </Button> */}
            </div>
        </div>
    )
}
