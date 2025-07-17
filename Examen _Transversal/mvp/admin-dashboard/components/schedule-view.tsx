"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Calendar, Plus, Clock, Users, ChevronLeft, ChevronRight } from "lucide-react"

interface Shift {
  id: string
  employeeName: string
  role: "Gerente" | "Anfitrión" | "Mozo" | "Cajero"
  date: string
  startTime: string
  endTime: string
  status: "Programado" | "Confirmado" | "Ausente"
}

export function ScheduleView() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")

  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: "1",
      employeeName: "Juan Pérez",
      role: "Gerente",
      date: "2024-01-22",
      startTime: "08:00",
      endTime: "16:00",
      status: "Confirmado",
    },
    {
      id: "2",
      employeeName: "María García",
      role: "Anfitrión",
      date: "2024-01-22",
      startTime: "12:00",
      endTime: "20:00",
      status: "Programado",
    },
    {
      id: "3",
      employeeName: "Carlos López",
      role: "Mozo",
      date: "2024-01-22",
      startTime: "12:00",
      endTime: "20:00",
      status: "Confirmado",
    },
    {
      id: "4",
      employeeName: "Ana Martínez",
      role: "Cajero",
      date: "2024-01-22",
      startTime: "16:00",
      endTime: "24:00",
      status: "Programado",
    },
    // Más turnos para otros días...
    {
      id: "5",
      employeeName: "Carlos López",
      role: "Mozo",
      date: "2024-01-23",
      startTime: "08:00",
      endTime: "16:00",
      status: "Confirmado",
    },
    {
      id: "6",
      employeeName: "María García",
      role: "Anfitrión",
      date: "2024-01-23",
      startTime: "16:00",
      endTime: "24:00",
      status: "Programado",
    },
  ])

  const employees = [
    { name: "Juan Pérez", role: "Gerente" },
    { name: "María García", role: "Anfitrión" },
    { name: "Carlos López", role: "Mozo" },
    { name: "Ana Martínez", role: "Cajero" },
    { name: "Luis Rodríguez", role: "Mozo" },
    { name: "Carmen Silva", role: "Cajero" },
  ]

  const getWeekDays = (date: Date) => {
    const week = []
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay() + 1) // Lunes

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push(day)
    }
    return week
  }

  const weekDays = getWeekDays(currentWeek)
  const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

  const getShiftsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return shifts.filter((shift) => shift.date === dateStr)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Gerente":
        return "bg-yellow-100 text-yellow-800"
      case "Anfitrión":
        return "bg-secondary text-secondary-foreground"
      case "Mozo":
        return "bg-accent text-accent-foreground"
      case "Cajero":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Confirmado":
        return "bg-green-100 text-green-800"
      case "Programado":
        return "bg-yellow-100 text-yellow-800"
      case "Ausente":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7))
    setCurrentWeek(newWeek)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Planificación de Turnos</h2>
          <p className="text-muted-foreground">Gestiona la programación semanal y mensual del personal</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Programar Turno
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Programar Nuevo Turno</DialogTitle>
              <DialogDescription>Asigna un turno a un empleado para una fecha específica.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employee" className="text-right">
                  Empleado
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar empleado" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.name} value={emp.name}>
                        {emp.name} - {emp.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Fecha
                </Label>
                <input
                  type="date"
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startTime" className="text-right">
                  Hora Inicio
                </Label>
                <input
                  type="time"
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endTime" className="text-right">
                  Hora Fin
                </Label>
                <input
                  type="time"
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsCreateDialogOpen(false)}>Programar Turno</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas de turnos */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnos Esta Semana</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shifts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnos Confirmados</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shifts.filter((s) => s.status === "Confirmado").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shifts.filter((s) => s.status === "Programado").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Totales</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">168</div>
          </CardContent>
        </Card>
      </div>

      {/* Calendario semanal */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Calendario Semanal</CardTitle>
              <CardDescription>
                Semana del {weekDays[0].toLocaleDateString("es-ES")} al {weekDays[6].toLocaleDateString("es-ES")}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigateWeek("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateWeek("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day, index) => (
              <div key={day.toISOString()} className="space-y-2">
                <div className="text-center">
                  <div className="font-medium">{dayNames[index]}</div>
                  <div className="text-sm text-muted-foreground">{day.getDate()}</div>
                </div>
                <div className="space-y-2 min-h-[200px] border rounded-lg p-2">
                  {getShiftsForDate(day).map((shift) => (
                    <div key={shift.id} className="p-2 bg-restaurant-primary/10 rounded text-xs">
                      <div className="font-medium">{shift.employeeName}</div>
                      <Badge className={getRoleBadgeColor(shift.role)} size="sm">
                        {shift.role}
                      </Badge>
                      <div className="text-muted-foreground">
                        {shift.startTime} - {shift.endTime}
                      </div>
                      <Badge className={getStatusBadgeColor(shift.status)} size="sm">
                        {shift.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vista por empleado */}
      <Card>
        <CardHeader>
          <CardTitle>Turnos por Empleado</CardTitle>
          <CardDescription>Vista detallada de la programación de cada empleado</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Lunes</TableHead>
                <TableHead>Martes</TableHead>
                <TableHead>Miércoles</TableHead>
                <TableHead>Jueves</TableHead>
                <TableHead>Viernes</TableHead>
                <TableHead>Sábado</TableHead>
                <TableHead>Domingo</TableHead>
                <TableHead>Total Horas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => {
                const employeeShifts = shifts.filter((s) => s.employeeName === employee.name)
                const totalHours = employeeShifts.reduce((acc, shift) => {
                  const start = new Date(`2024-01-01 ${shift.startTime}`)
                  const end = new Date(`2024-01-01 ${shift.endTime}`)
                  return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
                }, 0)

                return (
                  <TableRow key={employee.name}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(employee.role)}>{employee.role}</Badge>
                    </TableCell>
                    {weekDays.map((day) => {
                      const dayShift = employeeShifts.find((s) => s.date === day.toISOString().split("T")[0])
                      return (
                        <TableCell key={day.toISOString()}>
                          {dayShift ? (
                            <div className="text-xs">
                              <div>
                                {dayShift.startTime} - {dayShift.endTime}
                              </div>
                              <Badge className={getStatusBadgeColor(dayShift.status)} size="sm">
                                {dayShift.status}
                              </Badge>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      )
                    })}
                    <TableCell>
                      <Badge variant={totalHours > 40 ? "destructive" : "default"}>{totalHours.toFixed(1)}h</Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Resumen mensual */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen Mensual</CardTitle>
          <CardDescription>Estadísticas y métricas del mes actual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium">Cobertura por Rol</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Gerentes</span>
                  <span className="text-sm font-medium">95%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Anfitriones</span>
                  <span className="text-sm font-medium">88%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Mozos</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cajeros</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Horas por Empleado</h4>
              <div className="space-y-2">
                {employees.slice(0, 4).map((emp) => (
                  <div key={emp.name} className="flex justify-between">
                    <span className="text-sm">{emp.name}</span>
                    <span className="text-sm font-medium">{Math.floor(Math.random() * 20 + 30)}h</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Alertas</h4>
              <div className="space-y-2">
                <div className="p-2 bg-restaurant-accent/20 rounded text-sm">
                  <div className="font-medium">Cobertura Baja</div>
                  <div className="text-muted-foreground">Domingo 28/01 - Turno noche</div>
                </div>
                <div className="p-2 bg-red-50 rounded text-sm">
                  <div className="font-medium">Sobrecarga</div>
                  <div className="text-muted-foreground">Carlos López - 45h esta semana</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
