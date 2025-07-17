"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Calculator, DollarSign, CreditCard, FileText, Download, Lock, Unlock, AlertTriangle } from "lucide-react"
import { usePOS } from "@/contexts/pos-context"

export default function CashierClose() {
  const { state, dispatch } = usePOS()
  const [finalCash, setFinalCash] = useState<string>("")
  const [differences, setDifferences] = useState<string>("")
  const [differencesReason, setDifferencesReason] = useState<string>("")
  const [initialCash, setInitialCash] = useState<string>("100")
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false)
  const [isOpenDialogOpen, setIsOpenDialogOpen] = useState(false)

  // Cálculos para el reporte
  const totalSales = state.transactions.reduce((sum, t) => sum + t.total, 0)
  const cashSales = state.transactions.filter((t) => t.paymentMethod === "cash").reduce((sum, t) => sum + t.total, 0)
  const cardSales = state.transactions.filter((t) => t.paymentMethod === "card").reduce((sum, t) => sum + t.total, 0)
  const checkSales = state.transactions.filter((t) => t.paymentMethod === "check").reduce((sum, t) => sum + t.total, 0)

  const expectedCash = (state.currentSession?.initialCash || 0) + cashSales
  const actualCash = Number.parseFloat(finalCash) || 0
  const calculatedDifference = actualCash - expectedCash

  const openCashier = () => {
    dispatch({ type: "OPEN_CASHIER", initialCash: Number.parseFloat(initialCash) })
    setInitialCash("100")
    setIsOpenDialogOpen(false)
  }

  const closeCashier = () => {
    // Verificar que hay una sesión actual antes de cerrar
    if (!state.currentSession) {
      console.error("No hay sesión actual para cerrar")
      return
    }

    const diffAmount = differences ? Number.parseFloat(differences) : calculatedDifference
    
    console.log("Cerrando caja con:", {
      finalCash: actualCash,
      differences: Math.abs(diffAmount) > 0.01 ? diffAmount : undefined,
      differencesReason: differencesReason || undefined,
      currentSession: state.currentSession
    })

    dispatch({
      type: "CLOSE_CASHIER",
      finalCash: actualCash,
      differences: Math.abs(diffAmount) > 0.01 ? diffAmount : undefined,
      differencesReason: differencesReason || undefined,
    })
    
    setFinalCash("")
    setDifferences("")
    setDifferencesReason("")
    setIsCloseDialogOpen(false)
  }

  const generateReport = () => {
    const reportData = {
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      turno: state.currentShift,
      totalVentas: totalSales,
      ventasEfectivo: cashSales,
      ventasTarjeta: cardSales,
      ventasCheque: checkSales,
      transacciones: state.transactions.length,
      efectivoInicial: state.currentSession?.initialCash || 0,
      efectivoFinal: actualCash,
      diferencias: calculatedDifference,
    }

    // Simular descarga de reporte
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `reporte-caja-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Estado de la Caja */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Estado de la Caja
            </span>
            <Badge
              variant={state.cashierOpen ? "default" : "secondary"}
              className={`flex items-center gap-2 ${
                state.cashierOpen ? "bg-color-2 text-gray-800" : "bg-gray-200 text-gray-600"
              }`}
            >
              {state.cashierOpen ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              {state.cashierOpen ? "Caja Abierta" : "Caja Cerrada"}
            </Badge>
          </CardTitle>
          <CardDescription>
            {state.cashierOpen
              ? "La caja está abierta y puede procesar transacciones"
              : "La caja está cerrada. Ábrela para comenzar a procesar transacciones"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {!state.cashierOpen ? (
              <Dialog open={isOpenDialogOpen} onOpenChange={setIsOpenDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Unlock className="h-4 w-4 mr-2" />
                    Abrir Caja
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Abrir Caja</DialogTitle>
                    <DialogDescription>Ingresa el monto inicial en efectivo para abrir la caja</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="initial-cash">Efectivo Inicial ($)</Label>
                      <Input
                        id="initial-cash"
                        type="number"
                        step="0.01"
                        min="0"
                        value={initialCash}
                        onChange={(e) => setInitialCash(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpenDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={openCashier} disabled={!initialCash}>
                      Abrir Caja
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Lock className="h-4 w-4 mr-2" />
                    Cerrar Caja
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Cerrar Caja</DialogTitle>
                    <DialogDescription>
                      Completa el cierre de caja ingresando el efectivo final y cualquier diferencia
                    </DialogDescription>
                    {!state.currentSession && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="font-medium">Error: No hay sesión activa</span>
                        </div>
                        <p className="text-red-600 text-sm mt-1">
                          No se puede cerrar la caja porque no hay una sesión activa. Abre la caja primero.
                        </p>
                      </div>
                    )}
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="final-cash">Efectivo Final ($)</Label>
                        <Input
                          id="final-cash"
                          type="number"
                          step="0.01"
                          min="0"
                          value={finalCash}
                          onChange={(e) => setFinalCash(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Efectivo Esperado</Label>
                        <Input value={`$${expectedCash.toFixed(2)}`} disabled className="bg-muted" />
                      </div>
                    </div>

                    {finalCash && Math.abs(calculatedDifference) > 0.01 && (
                      <div className="p-4 bg-color-3/20 border border-color-4 rounded-lg">
                        <div className="flex items-center gap-2 text-color-5 mb-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="font-medium">Diferencia Detectada</span>
                        </div>
                        <p className="text-color-5">
                          Diferencia: {calculatedDifference > 0 ? "+" : ""}${calculatedDifference.toFixed(2)}
                        </p>
                        <div className="mt-3">
                          <Label htmlFor="differences-reason">Justificación de la Diferencia</Label>
                          <Textarea
                            id="differences-reason"
                            value={differencesReason}
                            onChange={(e) => setDifferencesReason(e.target.value)}
                            placeholder="Explica la razón de la diferencia..."
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCloseDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button
                      onClick={closeCashier}
                      disabled={
                        !finalCash || 
                        (Math.abs(calculatedDifference) > 0.01 && !differencesReason) ||
                        !state.currentSession
                      }
                    >
                      Cerrar Caja
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            <Button variant="outline" onClick={generateReport} disabled={!state.cashierOpen}>
              <Download className="h-4 w-4 mr-2" />
              Generar Reporte
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reporte Consolidado */}
      <Card>
        <CardHeader>
          <CardTitle>Reporte Consolidado - {state.currentShift}</CardTitle>
          <CardDescription>Resumen de ventas y transacciones del turno actual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Resumen de Ventas */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Resumen de Ventas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total de Ventas:</span>
                    <span className="font-bold">${totalSales.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transacciones:</span>
                    <span>{state.transactions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Promedio por Venta:</span>
                    <span>
                      ${state.transactions.length > 0 ? (totalSales / state.transactions.length).toFixed(2) : "0.00"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Desglose por Método de Pago */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Métodos de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-color-2" />
                      <span>Efectivo:</span>
                    </div>
                    <span className="font-medium">${cashSales.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-color-1" />
                      <span>Tarjeta:</span>
                    </div>
                    <span className="font-medium">${cardSales.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-color-4" />
                      <span>Cheque:</span>
                    </div>
                    <span className="font-medium">${checkSales.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Control de Efectivo */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Control de Efectivo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Efectivo Inicial:</span>
                    <span>${state.currentSession?.initialCash?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ventas en Efectivo:</span>
                    <span>${cashSales.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-medium">
                    <span>Efectivo Esperado:</span>
                    <span>${expectedCash.toFixed(2)}</span>
                  </div>
                  {finalCash && (
                    <>
                      <div className="flex justify-between">
                        <span>Efectivo Contado:</span>
                        <span>${actualCash.toFixed(2)}</span>
                      </div>
                      <div
                        className={`flex justify-between ${calculatedDifference !== 0 ? "text-red-600" : "text-green-600"}`}
                      >
                        <span>Diferencia:</span>
                        <span>
                          {calculatedDifference > 0 ? "+" : ""}${calculatedDifference.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Historial de Sesiones */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Sesiones</CardTitle>
          <CardDescription>Registro de todas las sesiones de caja cerradas</CardDescription>
        </CardHeader>
        <CardContent>
          {state.cashierSessions.filter((session) => session.endTime).length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No hay sesiones cerradas registradas</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead>Fin</TableHead>
                  <TableHead>Efectivo Inicial</TableHead>
                  <TableHead>Efectivo Final</TableHead>
                  <TableHead>Total Ventas</TableHead>
                  <TableHead>Diferencias</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.cashierSessions
                  .filter((session) => session.endTime)
                  .map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{session.startTime.toLocaleDateString()}</TableCell>
                      <TableCell>{session.startTime.toLocaleTimeString()}</TableCell>
                      <TableCell>{session.endTime?.toLocaleTimeString()}</TableCell>
                      <TableCell>${session.initialCash.toFixed(2)}</TableCell>
                      <TableCell>${session.finalCash?.toFixed(2) || "0.00"}</TableCell>
                      <TableCell>${session.totalSales.toFixed(2)}</TableCell>
                      <TableCell className={session.differences ? "text-red-600" : "text-green-600"}>
                        {session.differences
                          ? `${session.differences > 0 ? "+" : ""}$${session.differences.toFixed(2)}`
                          : "$0.00"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
