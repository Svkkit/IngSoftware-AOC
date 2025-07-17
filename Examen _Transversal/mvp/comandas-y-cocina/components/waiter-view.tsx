"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import TableSelection from "@/components/table-selection"
import MenuCatalog from "@/components/menu-catalog"
import OrderSummary from "@/components/order-summary"
import { useOrderStore } from "@/lib/order-store"

interface WaiterViewProps {
  onBack: () => void
}

export default function WaiterView({ onBack }: WaiterViewProps) {
  const [currentStep, setCurrentStep] = useState<"tables" | "menu" | "summary">("tables")
  const [selectedTable, setSelectedTable] = useState<number | null>(null)
  const { toast } = useToast()
  const { orders, addOrder, updateOrder } = useOrderStore()

  const handleTableSelect = (tableNumber: number) => {
    setSelectedTable(tableNumber)
    setCurrentStep("menu")
  }

  const handleOrderConfirm = () => {
    toast({
      title: "Comanda Enviada",
      description: `Pedido confirmado para Mesa ${selectedTable}`,
    })
    setCurrentStep("tables")
    setSelectedTable(null)
  }

  const currentOrder = selectedTable
    ? orders.find((o) => o.tableNumber === selectedTable && o.status === "pending")
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col items-center justify-between">
            <div className="flex items-center space-x-4 self-start mb-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                {selectedTable && <p className="text-sm text-gray-600">Mesa {selectedTable}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                className={
                  currentStep === "tables" ? "bg-primary-500 text-white" : "bg-secondary-200 text-secondary-800"
                }
              >
                1. Seleccionar Mesa
              </Badge>
              <Badge
                className={currentStep === "menu" ? "bg-primary-500 text-white" : "bg-secondary-200 text-secondary-800"}
              >
                2. Tomar Pedido
              </Badge>
              <Badge
                className={
                  currentStep === "summary" ? "bg-primary-500 text-white" : "bg-secondary-200 text-secondary-800"
                }
              >
                3. Confirmar
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4">
        {currentStep === "tables" && <TableSelection onTableSelect={handleTableSelect} />}

        {currentStep === "menu" && selectedTable && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MenuCatalog tableNumber={selectedTable} onContinue={() => setCurrentStep("summary")} />
            </div>
            <div>
              <OrderSummary tableNumber={selectedTable} onConfirm={handleOrderConfirm} />
            </div>
          </div>
        )}

        {currentStep === "summary" && selectedTable && (
          <OrderSummary tableNumber={selectedTable} onConfirm={handleOrderConfirm} showFullSummary />
        )}
      </div>
    </div>
  )
}
