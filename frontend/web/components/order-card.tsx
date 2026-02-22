import { Order } from "@/types/order"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Package, Truck, CheckCircle, XCircle, ChevronRight } from "lucide-react"
import Image from "next/image"

interface OrderCardProps {
    order: Order
}

export function OrderCard({ order }: OrderCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered":
                return "bg-green-500 hover:bg-green-600"
            case "shipped":
                return "bg-blue-500 hover:bg-blue-600"
            case "processing":
                return "bg-yellow-500 hover:bg-yellow-600"
            case "cancelled":
                return "bg-red-500 hover:bg-red-600"
            default:
                return "bg-gray-500 hover:bg-gray-600"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "delivered":
                return <CheckCircle className="h-4 w-4 mr-1" />
            case "shipped":
                return <Truck className="h-4 w-4 mr-1" />
            case "processing":
                return <Package className="h-4 w-4 mr-1" />
            case "cancelled":
                return <XCircle className="h-4 w-4 mr-1" />
            default:
                return null
        }
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-muted/40 p-4 flex flex-row items-center justify-between">
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Order #{order.id}</span>
                    <span className="text-xs text-muted-foreground">Placed on {order.date}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-bold">₹{(order.totalAmount || order.total || 0).toLocaleString()}</span>
                    <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-4">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                                <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.tyreName || "Tyre"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-1 flex-col justify-center">
                                <h4 className="font-medium">{item.tyreName}</h4>
                                {item.variant && <p className="text-sm text-muted-foreground">{item.variant}</p>}
                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <div className="flex flex-col justify-center items-end">
                                <span className="font-medium">₹{(item.unitPrice || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <Separator />
            <CardFooter className="p-4 bg-muted/20 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                    {order.shippingAddress ? (
                        <>
                            <span className="font-medium text-foreground">Ship to:</span> {order.shippingAddress.name}
                        </>
                    ) : (
                        <span className="italic">No shipping address provided</span>
                    )}
                </div>
                {/* <Button variant="outline" size="sm" className="gap-1">
                    View Details <ChevronRight className="h-4 w-4" />
                </Button> */}
            </CardFooter>
        </Card>
    )
}
