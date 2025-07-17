"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Search,
  Download,
  Upload,
  ShoppingCart,
  Truck,
  History,
} from "lucide-react"

interface Product {
  id: string
  name: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  unit: string
  costPerUnit: number
  supplier: string
  lastUpdated: string
  status: "En Stock" | "Stock Bajo" | "Agotado"
}

interface StockMovement {
  id: string
  productId: string
  productName: string
  type: "Entrada" | "Salida" | "Ajuste"
  quantity: number
  reason: string
  user: string
  date: string
  cost?: number
}

interface Supplier {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  products: string[]
  status: "Activo" | "Inactivo"
}

export function InventoryView() {
  const [activeTab, setActiveTab] = useState("products")
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isAddMovementOpen, setIsAddMovementOpen] = useState(false)
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Tomate",
      category: "Verduras",
      currentStock: 25,
      minStock: 10,
      maxStock: 100,
      unit: "kg",
      costPerUnit: 2250,
      supplier: "Verduras Frescas SA",
      lastUpdated: "2024-01-20",
      status: "En Stock",
    },
    {
      id: "2",
      name: "Queso Mozzarella",
      category: "Lácteos",
      currentStock: 5,
      minStock: 8,
      maxStock: 50,
      unit: "kg",
      costPerUnit: 10800,
      supplier: "Lácteos del Valle",
      lastUpdated: "2024-01-19",
      status: "Stock Bajo",
    },
    {
      id: "3",
      name: "Harina",
      category: "Granos",
      currentStock: 0,
      minStock: 20,
      maxStock: 200,
      unit: "kg",
      costPerUnit: 1620,
      supplier: "Molinos Unidos",
      lastUpdated: "2024-01-18",
      status: "Agotado",
    },
    {
      id: "4",
      name: "Aceite de Oliva",
      category: "Aceites",
      currentStock: 15,
      minStock: 5,
      maxStock: 30,
      unit: "litros",
      costPerUnit: 7650,
      supplier: "Aceites Premium",
      lastUpdated: "2024-01-20",
      status: "En Stock",
    },
    {
      id: "5",
      name: "Pollo",
      category: "Carnes",
      currentStock: 12,
      minStock: 15,
      maxStock: 80,
      unit: "kg",
      costPerUnit: 5850,
      supplier: "Carnes del Campo",
      lastUpdated: "2024-01-19",
      status: "Stock Bajo",
    },
  ])

  const [stockMovements, setStockMovements] = useState<StockMovement[]>([
    {
      id: "1",
      productId: "1",
      productName: "Tomate",
      type: "Entrada",
      quantity: 50,
      reason: "Compra semanal",
      user: "Juan Pérez",
      date: "2024-01-20 10:30",
      cost: 112500,
    },
    {
      id: "2",
      productId: "2",
      productName: "Queso Mozzarella",
      type: "Salida",
      quantity: 3,
      reason: "Uso en cocina - Pizza Margherita",
      user: "Carlos López",
      date: "2024-01-20 14:15",
    },
    {
      id: "3",
      productId: "4",
      productName: "Aceite de Oliva",
      type: "Ajuste",
      quantity: -2,
      reason: "Corrección de inventario",
      user: "María García",
      date: "2024-01-19 16:45",
    },
  ])

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: "1",
      name: "Verduras Frescas SA",
      contact: "Roberto Silva",
      email: "roberto@verdurasfrescas.com",
      phone: "+1234567890",
      products: ["Tomate", "Lechuga", "Cebolla"],
      status: "Activo",
    },
    {
      id: "2",
      name: "Lácteos del Valle",
      contact: "Ana Martínez",
      email: "ana@lacteosdelval.com",
      phone: "+1234567891",
      products: ["Queso Mozzarella", "Leche", "Crema"],
      status: "Activo",
    },
    {
      id: "3",
      name: "Molinos Unidos",
      contact: "Pedro González",
      email: "pedro@molinosunidos.com",
      phone: "+1234567892",
      products: ["Harina", "Avena", "Trigo"],
      status: "Inactivo",
    },
  ])

  const categories = ["Verduras", "Lácteos", "Granos", "Aceites", "Carnes", "Especias", "Bebidas"]

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "En Stock":
        return "bg-green-100 text-green-800"
      case "Stock Bajo":
        return "bg-restaurant-accent/20 text-restaurant-orange border-restaurant-accent/30"
      case "Agotado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case "Entrada":
        return "bg-green-100 text-green-800"
      case "Salida":
        return "bg-red-100 text-red-800"
      case "Ajuste":
        return "bg-restaurant-secondary/20 text-restaurant-orange"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const lowStockProducts = products.filter((p) => p.currentStock <= p.minStock)
  const outOfStockProducts = products.filter((p) => p.currentStock === 0)
  const totalValue = products.reduce((sum, p) => sum + p.currentStock * p.costPerUnit, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Inventario</h2>
          <p className="text-muted-foreground">Control completo de stock, productos y proveedores</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Productos registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-restaurant-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-restaurant-orange">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">Requieren reposición</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agotados</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">Sin stock disponible</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-info-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">CLP ${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Valor del inventario</p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de stock */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-restaurant-orange" />
              Alertas de Inventario
            </CardTitle>
            <CardDescription>Productos que requieren atención inmediata</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {outOfStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <span className="font-medium text-red-800">{product.name}</span>
                    <span className="text-sm text-red-600 ml-2">- AGOTADO</span>
                  </div>
                  <Button size="sm" variant="outline">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Reabastecer
                  </Button>
                </div>
              ))}
              {lowStockProducts
                .filter((p) => p.currentStock > 0)
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-restaurant-accent/20 rounded-lg"
                  >
                    <div>
                      <span className="font-medium text-restaurant-orange">{product.name}</span>
                      <span className="text-sm text-restaurant-orange ml-2">
                        - Stock: {product.currentStock} {product.unit} (Mín: {product.minStock})
                      </span>
                    </div>
                    <Button size="sm" variant="outline">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Reabastecer
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="movements">Movimientos</TabsTrigger>
          <TabsTrigger value="suppliers">Proveedores</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          {/* Filtros y búsqueda */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Label htmlFor="search">Buscar producto</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Nombre o categoría..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="min-w-[150px]">
                  <Label htmlFor="category">Categoría</Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Producto
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                        <DialogDescription>Registra un nuevo producto en el inventario</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="productName">Nombre del Producto</Label>
                            <Input id="productName" placeholder="Ej: Tomate" />
                          </div>
                          <div>
                            <Label htmlFor="productCategory">Categoría</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="currentStock">Stock Actual</Label>
                            <Input id="currentStock" type="number" placeholder="0" />
                          </div>
                          <div>
                            <Label htmlFor="minStock">Stock Mínimo</Label>
                            <Input id="minStock" type="number" placeholder="0" />
                          </div>
                          <div>
                            <Label htmlFor="maxStock">Stock Máximo</Label>
                            <Input id="maxStock" type="number" placeholder="0" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="unit">Unidad</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="kg">Kilogramos</SelectItem>
                                <SelectItem value="litros">Litros</SelectItem>
                                <SelectItem value="unidades">Unidades</SelectItem>
                                <SelectItem value="cajas">Cajas</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="costPerUnit">Costo por Unidad (CLP)</Label>
                            <Input id="costPerUnit" type="number" step="1" placeholder="0" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="supplier">Proveedor</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar proveedor" />
                            </SelectTrigger>
                            <SelectContent>
                              {suppliers
                                .filter((s) => s.status === "Activo")
                                .map((supplier) => (
                                  <SelectItem key={supplier.id} value={supplier.name}>
                                    {supplier.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => setIsAddProductOpen(false)}>Agregar Producto</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de productos */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Productos</CardTitle>
              <CardDescription>
                {filteredProducts.length} de {products.length} productos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Stock Actual</TableHead>
                    <TableHead>Stock Mín/Máx</TableHead>
                    <TableHead>Costo/Unidad</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.supplier}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {product.currentStock} {product.unit}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Mín: {product.minStock}</div>
                          <div>Máx: {product.maxStock}</div>
                        </div>
                      </TableCell>
                      <TableCell>CLP ${product.costPerUnit.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="font-medium">CLP ${(product.currentStock * product.costPerUnit).toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(product.status)}>{product.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <History className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Movimientos de Stock</h3>
              <p className="text-sm text-muted-foreground">Historial de entradas, salidas y ajustes</p>
            </div>
            <Dialog open={isAddMovementOpen} onOpenChange={setIsAddMovementOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar Movimiento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Registrar Movimiento de Stock</DialogTitle>
                  <DialogDescription>Registra una entrada, salida o ajuste de inventario</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="movementProduct">Producto</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} ({product.currentStock} {product.unit})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="movementType">Tipo de Movimiento</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Entrada">Entrada</SelectItem>
                          <SelectItem value="Salida">Salida</SelectItem>
                          <SelectItem value="Ajuste">Ajuste</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quantity">Cantidad</Label>
                      <Input id="quantity" type="number" placeholder="0" />
                    </div>
                    <div>
                      <Label htmlFor="cost">Costo Total CLP (opcional)</Label>
                      <Input id="cost" type="number" step="1" placeholder="0" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reason">Motivo</Label>
                    <Textarea id="reason" placeholder="Describe el motivo del movimiento..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsAddMovementOpen(false)}>Registrar Movimiento</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Costo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(movement.date).toLocaleDateString("es-ES")}
                          <br />
                          <span className="text-muted-foreground">{movement.date.split(" ")[1]}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{movement.productName}</TableCell>
                      <TableCell>
                        <Badge className={getMovementTypeColor(movement.type)}>{movement.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={movement.type === "Salida" ? "text-red-600" : "text-green-600"}>
                          {movement.type === "Salida" ? "-" : "+"}
                          {movement.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{movement.reason}</TableCell>
                      <TableCell>{movement.user}</TableCell>
                      <TableCell>{movement.cost ? `CLP $${movement.cost.toLocaleString()}` : "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Proveedores</h3>
              <p className="text-sm text-muted-foreground">Gestión de proveedores y contactos</p>
            </div>
            <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Proveedor
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
                  <DialogDescription>Registra un nuevo proveedor en el sistema</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="supplierName">Nombre de la Empresa</Label>
                    <Input id="supplierName" placeholder="Ej: Verduras Frescas SA" />
                  </div>
                  <div>
                    <Label htmlFor="contactName">Nombre del Contacto</Label>
                    <Input id="contactName" placeholder="Ej: Roberto Silva" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="supplierEmail">Email</Label>
                      <Input id="supplierEmail" type="email" placeholder="contacto@empresa.com" />
                    </div>
                    <div>
                      <Label htmlFor="supplierPhone">Teléfono</Label>
                      <Input id="supplierPhone" placeholder="+1234567890" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="supplierProducts">Productos que Suministra</Label>
                    <Textarea id="supplierProducts" placeholder="Lista los productos separados por comas..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsAddSupplierOpen(false)}>Agregar Proveedor</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {suppliers.map((supplier) => (
              <Card key={supplier.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    <Badge variant={supplier.status === "Activo" ? "default" : "secondary"}>{supplier.status}</Badge>
                  </div>
                  <CardDescription>{supplier.contact}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="font-medium">Email:</span>
                      <span className="ml-2 text-muted-foreground">{supplier.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="font-medium">Teléfono:</span>
                      <span className="ml-2 text-muted-foreground">{supplier.phone}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Productos:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {supplier.products.slice(0, 3).map((product, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {product}
                          </Badge>
                        ))}
                        {supplier.products.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{supplier.products.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Truck className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Productos por Categoría</CardTitle>
                <CardDescription>Distribución del inventario</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map((category) => {
                    const categoryProducts = products.filter((p) => p.category === category)
                    const categoryValue = categoryProducts.reduce((sum, p) => sum + p.currentStock * p.costPerUnit, 0)
                    const percentage = totalValue > 0 ? (categoryValue / totalValue) * 100 : 0

                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-restaurant-primary rounded-full"></div>
                          <span className="text-sm font-medium">{category}</span>
                          <span className="text-sm text-muted-foreground">({categoryProducts.length})</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">CLP ${categoryValue.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Movimientos Recientes</CardTitle>
                <CardDescription>Últimas 5 transacciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stockMovements.slice(0, 5).map((movement) => (
                    <div key={movement.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-2">
                        <Badge className={getMovementTypeColor(movement.type)}>
                          {movement.type}
                        </Badge>
                        <span className="text-sm font-medium">{movement.productName}</span>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-sm font-bold ${movement.type === "Salida" ? "text-red-600" : "text-green-600"}`}
                        >
                          {movement.type === "Salida" ? "-" : "+"}
                          {movement.quantity}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(movement.date).toLocaleDateString("es-ES")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Análisis de Rotación</CardTitle>
              <CardDescription>Productos con mayor y menor rotación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-3">Mayor Rotación</h4>
                  <div className="space-y-2">
                    {products.slice(0, 3).map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{index + 1}</Badge>
                          <span className="text-sm font-medium">{product.name}</span>
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          {Math.floor(Math.random() * 50 + 20)} movimientos
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Menor Rotación</h4>
                  <div className="space-y-2">
                    {products.slice(-3).map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{index + 1}</Badge>
                          <span className="text-sm font-medium">{product.name}</span>
                        </div>
                        <div className="text-sm text-red-600 font-medium">
                          {Math.floor(Math.random() * 10 + 1)} movimientos
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
