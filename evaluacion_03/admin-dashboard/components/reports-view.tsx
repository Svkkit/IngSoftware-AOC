"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Download, FileText, CalendarIcon, TrendingUp, TrendingDown, BarChart3 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export function ReportsView() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  })
  const [reportType, setReportType] = useState("sales")

  const salesData = {
    totalRevenue: 125430.5,
    totalOrders: 1247,
    averageTicket: 100.58,
    growth: 12.5,
  }

  // Chart data for sales trend
  const chartData = {
    labels: Array.from({ length: 14 }, (_, i) => `Día ${i + 1}`),
    datasets: [
      {
        label: 'Ingresos Diarios ($)',
        data: [6500, 7800, 8200, 9500, 8800, 9200, 10500, 9800, 8700, 9300, 8900, 9600, 10200, 8800],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'rgb(59, 130, 246)',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `Ingresos: $${context.parsed.y.toLocaleString()}`
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        border: {
          display: false,
        },
        ticks: {
          callback: function(value: any) {
            return `$${value.toLocaleString()}`
          }
        }
      },
    },
  }

  const topProducts = [
    { name: "Pizza Margherita", quantity: 234, revenue: 29250, growth: 15.2 },
    { name: "Pasta Carbonara", quantity: 189, revenue: 24570, growth: 8.7 },
    { name: "Ensalada César", quantity: 156, revenue: 11700, growth: -2.1 },
    { name: "Hamburguesa Clásica", quantity: 143, revenue: 20020, growth: 22.3 },
    { name: "Salmón Grillado", quantity: 98, revenue: 19600, growth: 5.4 },
  ]

  const leastSoldProducts = [
    { name: "Sopa de Cebolla", quantity: 12, revenue: 480, growth: -45.2 },
    { name: "Carpaccio", quantity: 18, revenue: 900, growth: -23.1 },
    { name: "Risotto de Hongos", quantity: 25, revenue: 1250, growth: -15.8 },
  ]

  const operationalMetrics = {
    avgPreparationTime: 14.2,
    tableRotation: 3.8,
    customerSatisfaction: 4.6,
    waiterEfficiency: 87,
  }

  const exportReport = (format: "csv" | "pdf") => {
    // Simulación de exportación
    const filename = `reporte_${reportType}_${Date.now()}.${format}`
    console.log(`Exportando reporte como ${format}: ${filename}`)

    // En una implementación real, aquí se generaría y descargaría el archivo
    alert(`Reporte exportado como ${format.toUpperCase()}: ${filename}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reportes y Análisis</h2>
          <p className="text-muted-foreground">Análisis detallado de ventas, productos y métricas operativas</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => exportReport("csv")}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button variant="outline" onClick={() => exportReport("pdf")}>
            <FileText className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Filtros de fecha */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Reporte</CardTitle>
          <CardDescription>Selecciona el rango de fechas para el análisis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label>Fecha Inicio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[240px] justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => date && setDateRange({ ...dateRange, from: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Fecha Fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[240px] justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => date && setDateRange({ ...dateRange, to: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button>Aplicar Filtros</Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="operations">Operaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          {/* Métricas de ventas */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${salesData.totalRevenue.toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-info-success" />+{salesData.growth}% vs período
                  anterior
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{salesData.totalOrders.toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-info-success" />
                  +8.2% vs período anterior
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
                <TrendingUp className="h-4 w-4 text-info-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${salesData.averageTicket.toFixed(2)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-info-success" />
                  +3.8% vs período anterior
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Crecimiento</CardTitle>
                <TrendingUp className="h-4 w-4 text-info-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{salesData.growth}%</div>
                <p className="text-xs text-muted-foreground">Comparado con período anterior</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de ventas por día */}
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Ventas Diarias</CardTitle>
              <CardDescription>Evolución de ingresos en el período seleccionado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <Line data={chartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Productos más vendidos */}
            <Card>
              <CardHeader>
                <CardTitle>Productos Más Vendidos</CardTitle>
                <CardDescription>Top 5 productos por cantidad y ingresos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{index + 1}</Badge>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.quantity} unidades vendidas</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${product.revenue.toLocaleString()}</div>
                        <div
                          className={`text-sm flex items-center ${product.growth > 0 ? "text-info-success" : "text-red-600"}`}
                        >
                          {product.growth > 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(product.growth)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Productos menos vendidos */}
            <Card>
              <CardHeader>
                <CardTitle>Productos con Menor Rotación</CardTitle>
                <CardDescription>Productos que requieren atención</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leastSoldProducts.map((product, index) => (
                    <div
                      key={product.name}
                      className="flex items-center justify-between p-3 border rounded-lg bg-red-50"
                    >
                      <div className="flex items-center space-x-3">
                        <Badge variant="destructive">{index + 1}</Badge>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">Solo {product.quantity} unidades vendidas</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${product.revenue.toLocaleString()}</div>
                        <div className="text-sm flex items-center text-red-600">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          {Math.abs(product.growth)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabla detallada de productos */}
          <Card>
            <CardHeader>
              <CardTitle>Análisis Detallado de Productos</CardTitle>
              <CardDescription>Reporte completo de rendimiento por producto</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Ingresos</TableHead>
                    <TableHead>Precio Promedio</TableHead>
                    <TableHead>Crecimiento</TableHead>
                    <TableHead>Margen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...topProducts, ...leastSoldProducts].map((product) => (
                    <TableRow key={product.name}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>${product.revenue.toLocaleString()}</TableCell>
                      <TableCell>${(product.revenue / product.quantity).toFixed(2)}</TableCell>
                      <TableCell>
                        <div
                          className={`flex items-center ${product.growth > 0 ? "text-info-success" : "text-red-600"}`}
                        >
                          {product.growth > 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(product.growth)}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.revenue > 15000 ? "default" : "secondary"}>
                          {product.revenue > 15000 ? "Alto" : "Medio"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          {/* Métricas operativas */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tiempo Preparación</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{operationalMetrics.avgPreparationTime} min</div>
                <Progress value={75} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">Meta: {"<"} 15 min</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rotación Mesas</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{operationalMetrics.tableRotation}</div>
                <Progress value={76} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">Meta: 5 rotaciones/día</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Satisfacción Cliente</CardTitle>
                <TrendingUp className="h-4 w-4 text-info-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{operationalMetrics.customerSatisfaction}/5</div>
                <Progress value={92} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">Basado en 247 reseñas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Eficiencia Mozos</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{operationalMetrics.waiterEfficiency}%</div>
                <Progress value={operationalMetrics.waiterEfficiency} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">Promedio del equipo</p>
              </CardContent>
            </Card>
          </div>

          {/* Análisis de cuellos de botella */}
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Cuellos de Botella</CardTitle>
              <CardDescription>Identificación de áreas de mejora operativa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-restaurant-accent/20">
                  <div>
                    <h4 className="font-medium">Cocina - Tiempo de Preparación</h4>
                    <p className="text-sm text-muted-foreground">Platos principales tardan 2 min más que el promedio</p>
                  </div>
                  <Badge variant="secondary">Atención Requerida</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-restaurant-secondary/20">
                  <div>
                    <h4 className="font-medium">Servicio de Mesa</h4>
                    <p className="text-sm text-muted-foreground">Tiempo de atención dentro de parámetros óptimos</p>
                  </div>
                  <Badge variant="default">Excelente</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50">
                  <div>
                    <h4 className="font-medium">Caja - Procesamiento de Pagos</h4>
                    <p className="text-sm text-muted-foreground">
                      Demoras en horas pico, considerar personal adicional
                    </p>
                  </div>
                  <Badge variant="destructive">Crítico</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
