"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useOrderStore } from "@/lib/order-store"

interface KitchenViewProps {
  onBack: () => void
}

export default function KitchenView({ onBack }: KitchenViewProps) {
  const { orders, updateOrderStatus } = useOrderStore()
  const { toast } = useToast()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const kitchenOrders = orders.filter((order) => order.status === "confirmed" || order.status === "preparing")

  const handleStartPreparation = (orderId: string) => {
    updateOrderStatus(orderId, "preparing")
    toast({
      title: "Preparación Iniciada",
      description: "El pedido está ahora en preparación",
    })
  }

  const handleMarkReady = (orderId: string, tableNumber: number) => {
    updateOrderStatus(orderId, "ready")
    toast({
      title: "Pedido Listo",
      description: `Mesa ${tableNumber} - Pedido listo para retirar`,
      duration: 5000,
    })
  }

  const getElapsedTime = (createdAt: Date) => {
    const elapsed = Math.floor((currentTime.getTime() - createdAt.getTime()) / 1000 / 60)
    return elapsed
  }

  const getTimeColor = (minutes: number) => {
    if (minutes < 10) return "text-primary-600"
    if (minutes < 20) return "text-secondary-600"
    return "text-warning-600"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kitchen Display System</h1>
                <p className="text-sm text-gray-600">{kitchenOrders.length} pedidos en cola</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold">{currentTime.toLocaleTimeString()}</div>
              <div className="text-sm text-gray-600">{currentTime.toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Kitchen Tickets */}
      <div className="max-w-7xl mx-auto p-4">
        {kitchenOrders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No hay pedidos pendientes</h3>
              <p className="text-gray-600">Todos los pedidos están listos o entregados</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kitchenOrders
              .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
              .map((order) => {
                const elapsedMinutes = getElapsedTime(order.createdAt)
                const isUrgent = elapsedMinutes >= 15

                return (
                  <Card
                    key={order.id}
                    className={`${
                      order.status === "preparing"
                        ? "border-primary-500 bg-primary-50"
                        : isUrgent
                          ? "border-warning-500 bg-warning-50"
                          : "border-gray-200"
                    } ${isUrgent ? "animate-pulse" : ""}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Mesa {order.tableNumber}</CardTitle>
                        <div className="flex items-center space-x-2">
                          {isUrgent && <AlertCircle className="w-4 h-4 text-red-500" />}
                          <Badge className="bg-primary-500 text-white">
                            {order.status === "preparing" ? "En Preparación" : "Nuevo"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="w-4 h-4" />
                        <span className={getTimeColor(elapsedMinutes)}>{elapsedMinutes} min</span>
                        <span className="text-gray-500">({order.createdAt.toLocaleTimeString()})</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Kitchen Items Only */}
                      {order.items
                        .filter((item) => item.category !== "Bebidas")
                        .map((item, index) => (
                          <div key={index} className="border-l-2 border-gray-300 pl-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-medium">
                                  {item.quantity}x {item.name}
                                </span>
                                {item.notes && <div className="text-sm text-orange-600 mt-1">📝 {item.notes}</div>}
                              </div>
                            </div>
                          </div>
                        ))}

                      {/* Action Buttons */}
                      <div className="pt-3 space-y-2">
                        {order.status === "confirmed" && (
                          <Button onClick={() => handleStartPreparation(order.id)} className="w-full" variant="outline">
                            Iniciar Preparación
                          </Button>
                        )}
                        {order.status === "preparing" && (
                          <Button onClick={() => handleMarkReady(order.id, order.tableNumber)} className="w-full">
                            Marcar como Listo
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}
