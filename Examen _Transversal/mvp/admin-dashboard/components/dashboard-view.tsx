"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Users, ShoppingCart, Clock, TrendingUp, TrendingDown } from "lucide-react"

export function DashboardView() {
  const todayMetrics = {
    totalSales: 15420.5,
    customersServed: 127,
    averageTicket: 121.42,
    preparationTime: 12.5,
    tableRotation: 3.2,
    salesGrowth: 8.5,
  }

  const topProducts = [
    { name: "Pizza Margherita", quantity: 23, revenue: 2875 },
    { name: "Pasta Carbonara", quantity: 18, revenue: 2340 },
    { name: "Ensalada César", quantity: 15, revenue: 1125 },
    { name: "Hamburguesa Clásica", quantity: 12, revenue: 1680 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Principal</h2>
        <p className="text-muted-foreground">
          Resumen de métricas del día -{" "}
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todayMetrics.totalSales.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-info-success" />+{todayMetrics.salesGrowth}% vs ayer
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Atendidos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayMetrics.customersServed}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-info-success" />
              +12% vs ayer
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todayMetrics.averageTicket.toFixed(2)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              -2.1% vs ayer
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Preparación</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayMetrics.preparationTime} min</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-info-success" />
              -1.2 min vs ayer
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas operativas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rotación de Mesas</CardTitle>
            <CardDescription>Promedio de rotaciones por mesa hoy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{todayMetrics.tableRotation}</div>
            <Progress value={65} className="mb-2 bg-gray-300 [&>div]:bg-orange-500" />
            <p className="text-sm text-muted-foreground">65% de la capacidad óptima (5 rotaciones)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
            <CardDescription>Top 4 productos del día</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{index + 1}</Badge>
                    <span className="text-sm font-medium">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">${product.revenue}</div>
                    <div className="text-xs text-muted-foreground">{product.quantity} unidades</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas y notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas Operativas</CardTitle>
          <CardDescription>Notificaciones importantes del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 p-2 bg-restaurant-accent/20 rounded-lg">
              <Badge variant="secondary" style={{ backgroundColor: "black", color: "white" }}>Inventario</Badge>
              <span className="text-sm">Stock bajo en ingredientes para Pizza Margherita</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-restaurant-secondary/20 rounded-lg">
              <Badge variant="secondary" style={{ backgroundColor: "black", color: "white" }}>Ventas</Badge>
              <span className="text-sm">Meta diaria de ventas alcanzada (105%)</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-restaurant-primary/20 rounded-lg">
              <Badge variant="secondary" style={{ backgroundColor: "black", color: "white" }}>Personal</Badge>
              <span className="text-sm">Turno nocturno completo - 4 empleados activos</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
