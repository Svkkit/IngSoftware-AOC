"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, DollarSign, FileText, Receipt, CheckCircle, Clock } from "lucide-react"
import { usePOS } from "@/contexts/pos-context"

export default function PaymentProcessing() {
  const { state, dispatch } = usePOS()
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "check">("cash")
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)

  const occupiedTables = state.tables.filter((table) => table.status === "occupied" && table.orders.length > 0)
  const selectedTableData = state.tables.find((t) => t.id === selectedTable)

  const processPayment = () => {
    if (!selectedTable) return

    dispatch({
      type: "PROCESS_PAYMENT",
      tableId: selectedTable,
      paymentMethod,
    })

    setSelectedTable(null)
    setIsPaymentDialogOpen(false)
  }

  const openPaymentDialog = (tableId: string) => {
    setSelectedTable(tableId)
    setIsPaymentDialogOpen(true)
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <DollarSign className="h-4 w-4 text-color-2" />
      case "card":
        return <CreditCard className="h-4 w-4 text-color-1" />
      case "check":
        return <FileText className="h-4 w-4 text-color-4" />
      default:
        return <DollarSign className="h-4 w-4 text-color-2" />
    }
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "cash":
        return "Efectivo"
      case "card":
        return "Tarjeta"
      case "check":
        return "Cheque"
      default:
        return method
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Procesamiento de Pagos
          </CardTitle>
          <CardDescription>
            Procesa los pagos de las mesas ocupadas y registra el medio de pago utilizado
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!state.cashierOpen && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Caja Cerrada</span>
              </div>
              <p className="text-red-700 mt-1">La caja está cerrada. No se pueden procesar nuevos pagos.</p>
            </div>
          )}

          {occupiedTables.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay mesas con cuentas pendientes de pago</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {occupiedTables.map((table) => (
                <Card key={table.id} className="border-color-1 bg-color-1/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      Mesa {table.number}
                      <Badge className="bg-color-1 text-white">Pendiente</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm space-y-1">
                        <p>{table.orders.length} producto(s)</p>
                        {table.discount > 0 && <p className="text-color-5">Descuento: -${table.discount.toFixed(2)}</p>}
                        {table.splitBill && <p className="text-color-1">Dividida en {table.splitCount} personas</p>}
                      </div>

                      <div className="border-t pt-2">
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span>${table.total.toFixed(2)}</span>
                        </div>
                        {table.splitBill && (
                          <div className="flex justify-between text-sm text-blue-600">
                            <span>Por persona:</span>
                            <span>${(table.total / (table.splitCount || 1)).toFixed(2)}</span>
                          </div>
                        )}
                      </div>

                      <Button
                        className="w-full"
                        onClick={() => openPaymentDialog(table.id)}
                        disabled={!state.cashierOpen}
                      >
                        <Receipt className="h-4 w-4 mr-2" />
                        Procesar Pago
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historial de Transacciones */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Transacciones</CardTitle>
          <CardDescription>Registro de todos los pagos procesados en la sesión actual</CardDescription>
        </CardHeader>
        <CardContent>
          {state.transactions.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No hay transacciones registradas</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mesa</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead>Descuento</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Método de Pago</TableHead>
                  <TableHead>Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>Mesa {transaction.tableNumber}</TableCell>
                    <TableCell>{transaction.items.length} item(s)</TableCell>
                    <TableCell>${transaction.subtotal.toFixed(2)}</TableCell>
                    <TableCell>{transaction.discount > 0 ? `-$${transaction.discount.toFixed(2)}` : "-"}</TableCell>
                    <TableCell className="font-medium">${transaction.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(transaction.paymentMethod)}
                        {getPaymentMethodText(transaction.paymentMethod)}
                      </div>
                    </TableCell>
                    <TableCell>{transaction.timestamp.toLocaleTimeString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Procesamiento de Pago */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Procesar Pago - Mesa {selectedTableData?.number}</DialogTitle>
            <DialogDescription>Selecciona el método de pago y confirma la transacción</DialogDescription>
          </DialogHeader>

          {selectedTableData && (
            <div className="space-y-4">
              {/* Resumen de la cuenta */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Resumen de la Cuenta</h4>
                <div className="space-y-1 text-sm">
                  {selectedTableData.orders.map((order, index) => (
                    <div key={index} className="flex justify-between">
                      <span>
                        {order.productName} x{order.quantity}
                      </span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${selectedTableData.orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</span>
                    </div>
                    {selectedTableData.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Descuento:</span>
                        <span>-${selectedTableData.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>${selectedTableData.total.toFixed(2)}</span>
                    </div>
                    {selectedTableData.splitBill && (
                      <div className="flex justify-between text-blue-600">
                        <span>Por persona ({selectedTableData.splitCount}):</span>
                        <span>${(selectedTableData.total / (selectedTableData.splitCount || 1)).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Selección de método de pago */}
              <div>
                <Label className="text-base font-medium">Método de Pago</Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value: any) => setPaymentMethod(value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Efectivo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Tarjeta
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="check" id="check" />
                    <Label htmlFor="check" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Cheque
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={processPayment}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmar Pago
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
