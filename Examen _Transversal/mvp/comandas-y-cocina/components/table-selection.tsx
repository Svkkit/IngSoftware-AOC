"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Clock } from "lucide-react"
import { useOrderStore } from "@/lib/order-store"

interface TableSelectionProps {
  onTableSelect: (tableNumber: number) => void
}

export default function TableSelection({ onTableSelect }: TableSelectionProps) {
  const { orders } = useOrderStore()

  const tables = Array.from({ length: 12 }, (_, i) => i + 1)

  const getTableStatus = (tableNumber: number) => {
    const tableOrders = orders.filter((o) => o.tableNumber === tableNumber)
    const activeOrder = tableOrders.find((o) => o.status !== "delivered")

    if (!activeOrder) return "available"
    if (activeOrder.status === "pending") return "ordering"
    return "occupied"
  }

  const getTableBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge variant="default" className="text-white" style={{ backgroundColor: 'hsl(var(--money))' }}>
            Disponible
          </Badge>
        )
      case "ordering":
        return (
          <Badge variant="secondary" className="bg-secondary-100 text-secondary-800">
            Ordenando
          </Badge>
        )
      case "occupied":
        return (
          <Badge variant="secondary" className="bg-warning-100 text-warning-800">
            Ocupada
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Seleccionar Mesa</h2>
        <p className="text-gray-600">Elige una mesa para tomar el pedido</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((tableNumber) => {
          const status = getTableStatus(tableNumber)

          return (
            <Card
              key={tableNumber}
              className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary-500 ${
                status === "available" ? "" : ""
              }`}
              onClick={() => onTableSelect(tableNumber)}
            >
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
                <CardTitle className="text-lg">Mesa {tableNumber}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {getTableBadge(status)}
                {status === "occupied" && (
                  <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    En servicio
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
