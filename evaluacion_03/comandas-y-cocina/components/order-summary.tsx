"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Trash2 } from "lucide-react"
import { useOrderStore } from "@/lib/order-store"

interface OrderSummaryProps {
  tableNumber: number
  onConfirm: () => void
  showFullSummary?: boolean
}

export default function OrderSummary({ tableNumber, onConfirm, showFullSummary = false }: OrderSummaryProps) {
  const { getOrderItems, removeItemFromOrder, confirmOrder } = useOrderStore()

  const items = getOrderItems(tableNumber)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleConfirmOrder = () => {
    confirmOrder(tableNumber)
    onConfirm()
  }

  const kitchenItems = items.filter((item) => item.category !== "Bebidas")
  const barItems = items.filter((item) => item.category === "Bebidas")

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Resumen del Pedido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No hay productos seleccionados</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={showFullSummary ? "max-w-2xl mx-auto" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Resumen del Pedido - Mesa {tableNumber}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Kitchen Items */}
        {kitchenItems.length > 0 && (
          <div>
            <div className="flex items-center mb-3">
              <Badge variant="secondary" className="bg-primary-100 text-primary-800">
                🍳 Cocina
              </Badge>
            </div>
            {kitchenItems.map((item, index) => (
              <div
                key={`kitchen-${index}`}
                className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {item.quantity}x {item.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItemFromOrder(tableNumber, item.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-warning-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  {item.notes && <div className="text-sm text-primary-600 mt-1">📝 {item.notes}</div>}
                </div>
                <span className="font-semibold">${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        {/* Bar Items */}
        {barItems.length > 0 && (
          <div>
            <div className="flex items-center mb-3">
              <Badge variant="secondary" className="bg-secondary-100 text-secondary-800">
                🍹 Bar
              </Badge>
            </div>
            {barItems.map((item, index) => (
              <div
                key={`bar-${index}`}
                className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {item.quantity}x {item.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItemFromOrder(tableNumber, item.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-warning-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  {item.notes && <div className="text-sm text-secondary-600 mt-1">📝 {item.notes}</div>}
                </div>
                <span className="font-semibold">${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        <Separator />

        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total:</span>
          <span className="text-primary-600">${total.toLocaleString()}</span>
        </div>

        <Button onClick={handleConfirmOrder} className="w-full" size="lg">
          Confirmar Pedido
        </Button>
      </CardContent>
    </Card>
  )
}
