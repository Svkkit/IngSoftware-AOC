"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, CreditCard, DollarSign, Package, Users, Clock, TrendingUp } from "lucide-react"
import CatalogManagement from "@/components/catalog-management"
import TableManagement from "@/components/table-management"
import PaymentProcessing from "@/components/payment-processing"
import CashierClose from "@/components/cashier-close"
import { POSProvider, usePOS } from "@/contexts/pos-context"

function Dashboard() {
  const { state } = usePOS()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const activeTables = state.tables.filter((table) => table.status !== "available").length
  const totalSales = state.transactions.reduce((sum, t) => sum + t.total, 0)
  const pendingOrders = state.tables.filter((table) => table.status === "occupied").length

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-gradient-to-r from-secondary to-primary text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">LUNARi - POS</h1>
              <p className="text-foreground">
                {currentTime.toLocaleDateString()} - {currentTime.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={state.cashierOpen ? "default" : "outline"} className="bg-white text-primary border-white">
                {state.cashierOpen ? "Caja Abierta" : "Caja Cerrada"}
              </Badge>
              <Badge variant="outline" className="bg-white text-primary border-white/30">
                Turno: {state.currentShift}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-color-2 bg-gradient-to-br from-white to-color-3/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Mesas Activas</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{activeTables}</div>
              <p className="text-xs text-muted-foreground">de {state.tables.length} mesas totales</p>
            </CardContent>
          </Card>

          <Card className="border-color-2 bg-gradient-to-br from-white to-color-1/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Ventas del Día</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${totalSales.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{state.transactions.length} transacciones</p>
            </CardContent>
          </Card>

          <Card className="border-color-2 bg-gradient-to-br from-white to-color-4/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Pedidos Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">esperando pago</p>
            </CardContent>
          </Card>

          <Card className="border-color-2 bg-gradient-to-br from-white to-color-5/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Estado Sistema</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Activo</div>
              <p className="text-xs text-muted-foreground">Funcionando correctamente</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tables" className="space-y-6" >
          <TabsList className="grid w-full grid-cols-4 bg-primary" >
            <TabsTrigger value="tables" className="flex items-center gap-2 text-white">
              <Users className="h-4 w-4 text-white" />
              Mesas y Cuentas
            </TabsTrigger>
            <TabsTrigger value="catalog" className="flex items-center gap-2 text-white">
              <Package className="h-4 w-4" />
              Catálogo
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2 text-white">
              <CreditCard className="h-4 w-4 text-white" />
              Pagos
            </TabsTrigger>
            <TabsTrigger value="cashier" className="flex items-center gap-2 text-white">
              <Calculator className="h-4 w-4 text-white" />
              Cierre de Caja
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tables">
            <TableManagement />
          </TabsContent>

          <TabsContent value="catalog">
            <CatalogManagement />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentProcessing />
          </TabsContent>

          <TabsContent value="cashier">
            <CashierClose />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <POSProvider>
      <Dashboard />
    </POSProvider>
  )
}
