"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Package, DollarSign, AlertTriangle } from "lucide-react"
import { usePOS } from "@/contexts/pos-context"

export default function CatalogManagement() {
  const { state, dispatch } = usePOS()
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [newPrice, setNewPrice] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handlePriceUpdate = (productId: string, price: number) => {
    dispatch({ type: "UPDATE_PRODUCT_PRICE", productId, newPrice: price })
    setEditingProduct(null)
    setNewPrice("")
    setIsDialogOpen(false)
  }

  const openEditDialog = (productId: string, currentPrice: number) => {
    setEditingProduct(productId)
    setNewPrice(currentPrice.toString())
    setIsDialogOpen(true)
  }

  const activeTables = state.tables.filter((table) => table.status === "occupied")
  const hasActiveOrders = activeTables.length > 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Gestión de Catálogo y Precios
          </CardTitle>
          <CardDescription>
            Administra los productos y actualiza precios. Los cambios se aplican automáticamente en nuevas cuentas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasActiveOrders && (
            <div className="mb-4 p-4 bg-color-3/20 border border-color-4 rounded-lg">
              <div className="flex items-center gap-2 text-color-5">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Atención:</span>
              </div>
              <p className="text-color-5 mt-1">
                Hay {activeTables.length} mesa(s) con pedidos activos. Los cambios de precio solo afectarán nuevas
                cuentas.
              </p>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio Actual</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-color-2" />
                      <span className="text-color-5 font-semibold">{product.price}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.available ? "default" : "secondary"} style={product.available ? { backgroundColor: "#d4edda", color: "#155724" } : { backgroundColor: "#f8d7da", color: "#721c24" }}>
                      {product.available ? "Disponible" : "No disponible"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog open={isDialogOpen && editingProduct === product.id} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(product.id, product.price)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar Precio
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Precio - {product.name}</DialogTitle>
                          <DialogDescription>
                            Actualiza el precio del producto. Los cambios se aplicarán automáticamente en nuevas
                            cuentas.
                            {hasActiveOrders && " Los pedidos activos mantendrán el precio original."}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="current-price">Precio Actual</Label>
                            <Input
                              id="current-price"
                              value={`$${product.price}`}
                              disabled
                              className="bg-muted"
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-price">Nuevo Precio</Label>
                            <Input
                              id="new-price"
                              type="number"
                              step="0.01"
                              min="0"
                              value={newPrice}
                              onChange={(e) => setNewPrice(e.target.value)}
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button
                            onClick={() => handlePriceUpdate(product.id, Number.parseFloat(newPrice))}
                            disabled={!newPrice || Number.parseFloat(newPrice) <= 0}
                          >
                            Actualizar Precio
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {hasActiveOrders && (
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Activos</CardTitle>
            <CardDescription>Estas mesas mantienen los precios originales de sus pedidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeTables.map((table) => (
                <Card key={table.id} className="border-color-2 bg-color-2/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-color-5">Mesa {table.number}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {table.orders.map((order, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {order.productName} x{order.quantity}
                          </span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 font-medium">Total: ${table.total.toFixed(2)}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
