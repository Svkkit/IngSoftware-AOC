"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Plus,
  Clock,
  Users,
  Phone,
  Calendar,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Tipos de datos
type TableStatus =
  | "disponible"
  | "ocupada"
  | "reservada"
  | "esperando"
  | "limpieza";
type WaitlistStatus = "esperando" | "notificado" | "sentado";

interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  x: number;
  y: number;
  reservationId?: string;
}

interface Reservation {
  id: string;
  name: string;
  phone: string;
  people: number;
  date: string;
  time: string;
  tableId?: string;
  status: "pendiente" | "asignada" | "completada";
}

interface WaitlistClient {
  id: string;
  name: string;
  people: number;
  arrivalTime: string;
  status: WaitlistStatus;
  tableId?: string;
}

// Datos iniciales
const initialTables: Table[] = [
  { id: "1", number: 1, capacity: 2, status: "disponible", x: 10, y: 50 },
  { id: "2", number: 2, capacity: 4, status: "ocupada", x: 160, y: 50 },
  { id: "3", number: 3, capacity: 6, status: "disponible", x: 310, y: 50 },
  { id: "4", number: 4, capacity: 2, status: "reservada", x: 500, y: 50 },
  { id: "5", number: 5, capacity: 4, status: "disponible", x: 10, y: 220 },
  { id: "6", number: 6, capacity: 4, status: "limpieza", x: 160, y: 220 },
  { id: "7", number: 7, capacity: 4, status: "disponible", x: 310, y: 220 },
  { id: "8", number: 8, capacity: 6, status: "esperando", x: 460, y: 220 },
];

const getStatusColor = (status: TableStatus) => {
  switch (status) {
    case "disponible":
      return "#70e000"; // color-5 - naranja oscuro para disponible
    case "ocupada":
      return "#da2c38"; // color-1 - naranja principal para ocupada
    case "reservada":
      return "#1e6091"; // color-2 - naranja claro para reservada
    case "esperando":
      return "#f5a524"; // color-4 - amarillo/naranja para esperando
    case "limpieza":
      return "#d3f3e2"; // color-3 - amarillo claro para limpieza
    default:
      return "#6b7280";
  }
};

const getStatusText = (status: TableStatus) => {
  switch (status) {
    case "disponible":
      return "Disponible";
    case "ocupada":
      return "Ocupada";
    case "reservada":
      return "Reservada";
    case "esperando":
      return "Esperando";
    case "limpieza":
      return "Limpieza";
    default:
      return "Desconocido";
  }
};

export default function RestaurantManagement() {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistClient[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewReservation, setShowNewReservation] = useState(false);
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [showAssignTable, setShowAssignTable] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  // Formularios
  const [newReservation, setNewReservation] = useState({
    name: "",
    phone: "",
    people: "",
    date: "",
    time: "",
  });

  const [newWaitlistClient, setNewWaitlistClient] = useState({
    name: "",
    people: "",
  });

  const today = format(new Date(), "yyyy-MM-dd");
  const todayReservations = reservations.filter((r) => r.date === today);
  const filteredReservations = todayReservations.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm)
  );

  const availableTables = tables.filter((t) => t.status === "disponible");
  const activeWaitlist = waitlist.filter((w) => w.status === "esperando");

  const handleCreateReservation = () => {
    if (
      !newReservation.name ||
      !newReservation.phone ||
      !newReservation.people ||
      !newReservation.date ||
      !newReservation.time
    ) {
      return;
    }

    const reservation: Reservation = {
      id: Date.now().toString(),
      name: newReservation.name,
      phone: newReservation.phone,
      people: Number.parseInt(newReservation.people),
      date: newReservation.date,
      time: newReservation.time,
      status: "pendiente",
    };

    setReservations([...reservations, reservation]);
    setNewReservation({
      name: "asdf",
      phone: "asdf",
      people: "asdf",
      date: "aasdf",
      time: "asdf",
    });
    setShowNewReservation(false);
  };

  const handleAddToWaitlist = () => {
    if (!newWaitlistClient.name || !newWaitlistClient.people) {
      return;
    }

    const client: WaitlistClient = {
      id: Date.now().toString(),
      name: newWaitlistClient.name,
      people: Number.parseInt(newWaitlistClient.people),
      arrivalTime: format(new Date(), "HH:mm"),
      status: "esperando",
    };

    setWaitlist([...waitlist, client]);
    setNewWaitlistClient({ name: "", people: "" });
    setShowWaitlistForm(false);
  };

  const handleAssignTable = (reservationId: string, tableId: string) => {
    setReservations(
      reservations.map((r) =>
        r.id === reservationId ? { ...r, tableId, status: "asignada" } : r
      )
    );
    setTables(
      tables.map((t) =>
        t.id === tableId ? { ...t, status: "reservada", reservationId } : t
      )
    );
    setShowAssignTable(false);
    setSelectedReservation(null);
  };

  const handleAssignWaitlistToTable = (clientId: string, tableId: string) => {
    setWaitlist(
      waitlist.map((w) =>
        w.id === clientId ? { ...w, tableId, status: "notificado" } : w
      )
    );
    setTables(
      tables.map((t) => (t.id === tableId ? { ...t, status: "ocupada" } : t))
    );
  };

  const handleUpdateWaitlistStatus = (
    clientId: string,
    status: WaitlistStatus
  ) => {
    if (status === "sentado") {
      setWaitlist(waitlist.filter((w) => w.id !== clientId));
    } else {
      setWaitlist(
        waitlist.map((w) => (w.id === clientId ? { ...w, status } : w))
      );
    }
  };

  const handleTableStatusChange = (tableId: string, status: TableStatus) => {
    setTables(
      tables.map((t) =>
        t.id === tableId
          ? {
              ...t,
              status,
              reservationId:
                status === "disponible" ? undefined : t.reservationId,
            }
          : t
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-orange-900 mb-2">
            Salón y Recepción
          </h1>
          <p className="text-orange-700">
            LUNARi - Sistema de gestión de mesas, reservas y lista de espera
          </p>
        </header>

        <Tabs defaultValue="plano" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="plano">Plano del Restaurante</TabsTrigger>
            <TabsTrigger value="reservas">Reservas del Día</TabsTrigger>
            <TabsTrigger value="espera">Lista de Espera</TabsTrigger>
            <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="plano" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Plano del Restaurante</CardTitle>
                    <CardDescription>
                      Haz clic en una mesa para ver detalles y cambiar estado
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="relative bg-gray-100 rounded-lg p-4"
                      style={{ height: "400px" }}
                    >
                      <svg width="100%" height="100%" viewBox="0 0 600 350">
                        {tables.map((table) => {
                          // render conditionally by table capacity
                          if (table.capacity === 2) {
                            return (
                              <g
                                key={table.id}
                                stroke={getStatusColor(table.status)}
                                strokeWidth="4"
                                fill="none"
                              >
                                <rect
                                  x={table.x}
                                  y={table.y}
                                  width="60"
                                  height="60"
                                  fill={getStatusColor(table.status)}
                                  // stroke="#374151"
                                  // strokeWidth="2"
                                  className="cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => setSelectedTable(table)}
                                />

                                {/* right */}
                                <path
                                  d={`M ${table.x + 70} ${table.y + 10} C ${
                                    table.x + 85
                                  } ${table.y + 10}, ${table.x + 85} ${
                                    table.y + 50
                                  }, ${table.x + 70} ${table.y + 50} Z`}
                                />
 
                                {/* left */}
                                <path
                                  d={`M ${table.x - 10} ${table.y + 50} C ${
                                    table.x - 25
                                  } ${table.y + 50}, ${table.x - 25} ${
                                    table.y + 10
                                  }, ${table.x - 10} ${table.y + 10} Z`}
                                />
                                <text
                                  stroke="white"
                                  strokeWidth={1}
                                  fill="white"
                                  x={table.x + 30}
                                  y={table.y + 35}
                                  textAnchor="middle"
                                  fontSize="18"
                                  fontWeight="bold"
                                  className="pointer-events-none"
                                >
                                  {table.number}
                                </text>
                              </g>
                            );
                          } else if (table.capacity === 4) {
                            return (
                              <g
                                key={table.id}
                                stroke={getStatusColor(table.status)}
                                strokeWidth="4"
                                fill="none"
                              >
                                <rect
                                  x={table.x}
                                  y={table.y}
                                  width="60"
                                  height="60"
                                  fill={getStatusColor(table.status)}
                                  // stroke="#374151"
                                  // strokeWidth="2"
                                  className="cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => setSelectedTable(table)}
                                />
                                {/* top */}
                                <path
                                  d={`M ${table.x + 10} ${table.y - 10} C ${
                                    table.x + 10
                                  } ${table.y - 25}, ${table.x + 50} ${
                                    table.y - 25
                                  }, ${table.x + 50} ${table.y - 10} Z`}
                                />
                                {/* right */}
                                <path
                                  d={`M ${table.x + 70} ${table.y + 10} C ${
                                    table.x + 85
                                  } ${table.y + 10}, ${table.x + 85} ${
                                    table.y + 50
                                  }, ${table.x + 70} ${table.y + 50} Z`}
                                />
                                {/* bottom */}
                                <path
                                  d={`M ${table.x + 50} ${table.y + 70} C ${
                                    table.x + 50
                                  } ${table.y + 85}, ${table.x + 10} ${
                                    table.y + 85
                                  }, ${table.x + 10} ${table.y + 70} Z`}
                                />
                                {/* left */}
                                <path
                                  d={`M ${table.x - 10} ${table.y + 50} C ${
                                    table.x - 25
                                  } ${table.y + 50}, ${table.x - 25} ${
                                    table.y + 10
                                  }, ${table.x - 10} ${table.y + 10} Z`}
                                />
                                <text
                                  stroke="white"
                                  strokeWidth={1}
                                  fill="white"
                                  x={table.x + 30}
                                  y={table.y + 35}
                                  textAnchor="middle"
                                  fontSize="18"
                                  fontWeight="bold"
                                  className="pointer-events-none"
                                >
                                  {table.number}
                                </text>
                              </g>
                            );
                          } else {
                            return (
                              <g
                                key={table.id}
                                stroke={getStatusColor(table.status)}
                                strokeWidth="4"
                                fill="none"
                              >
                                <rect
                                  x={table.x}
                                  y={table.y}
                                  width="120"
                                  height="60"
                                  fill={getStatusColor(table.status)}
                                  // stroke="#374151"
                                  // strokeWidth="2"
                                  className="cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => setSelectedTable(table)}
                                />
                                {/* top */}
                                <path
                                  d={`M ${table.x + 10} ${table.y - 10} C ${
                                    table.x + 10
                                  } ${table.y - 25}, ${table.x + 50} ${
                                    table.y - 25
                                  }, ${table.x + 50} ${table.y - 10} Z`}
                                />
                                {/* top 2 */}
                                <path
                                  d={`M ${table.x + 70} ${table.y - 10} C ${
                                    table.x + 70
                                  } ${table.y - 25}, ${table.x + 110} ${
                                    table.y - 25
                                  }, ${table.x + 110} ${table.y - 10} Z`}
                                />
                                {/* right */}
                                <path
                                  d={`M ${table.x + 130} ${table.y + 10} C ${
                                    table.x + 145
                                  } ${table.y + 10}, ${table.x + 145} ${
                                    table.y + 50
                                  }, ${table.x + 130} ${table.y + 50} Z`}
                                />
                                {/* bottom */}
                                <path
                                  d={`M ${table.x + 50} ${table.y + 70} C ${
                                    table.x + 50
                                  } ${table.y + 85}, ${table.x + 10} ${
                                    table.y + 85
                                  }, ${table.x + 10} ${table.y + 70} Z`}
                                />
                                {/* bottom 2*/}
                                <path
                                  d={`M ${table.x + 110} ${table.y + 70} C ${
                                    table.x + 110
                                  } ${table.y + 85}, ${table.x + 70} ${
                                    table.y + 85
                                  }, ${table.x + 70} ${table.y + 70} Z`}
                                />
                                {/* left */}
                                <path
                                  d={`M ${table.x - 10} ${table.y + 50} C ${
                                    table.x - 25
                                  } ${table.y + 50}, ${table.x - 25} ${
                                    table.y + 10
                                  }, ${table.x - 10} ${table.y + 10} Z`}
                                />
                                <text
                                  stroke="white"
                                  strokeWidth={1}
                                  fill="white"
                                  x={table.x + 60}
                                  y={table.y + 35}
                                  textAnchor="middle"
                                  fontSize="18"
                                  fontWeight="bold"
                                  className="pointer-events-none"
                                >
                                  {table.number}
                                </text>
                              </g>
                            );
                          }
                        })}
                      </svg>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4">
                      {[
                        "disponible",
                        "ocupada",
                        "reservada",
                        "esperando",
                        "limpieza",
                      ].map((status) => (
                        <div key={status} className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{
                              backgroundColor: getStatusColor(
                                status as TableStatus
                              ),
                            }}
                          />
                          <span className="text-sm">
                            {getStatusText(status as TableStatus)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {selectedTable && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Mesa {selectedTable.number}</CardTitle>
                      <CardDescription>ID: {selectedTable.id}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Capacidad</Label>
                        <p className="text-lg font-semibold">
                          {selectedTable.capacity} personas
                        </p>
                      </div>
                      <div>
                        <Label>Estado Actual</Label>
                        <Badge
                          className="ms-3"
                          style={{
                            backgroundColor: getStatusColor(
                              selectedTable.status
                            ),
                          }}
                        >
                          {getStatusText(selectedTable.status)}
                        </Badge>
                      </div>
                      <div>
                        <Label>Cambiar Estado</Label>
                        <Select
                          value={selectedTable.status}
                          onValueChange={(value) =>
                            handleTableStatusChange(
                              selectedTable.id,
                              value as TableStatus
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="disponible">
                              Disponible
                            </SelectItem>
                            <SelectItem value="ocupada">Ocupada</SelectItem>
                            <SelectItem value="reservada">Reservada</SelectItem>
                            <SelectItem value="esperando">Esperando</SelectItem>
                            <SelectItem value="limpieza">Limpieza</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Resumen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Mesas disponibles:</span>
                      <span className="font-semibold">
                        {tables.filter((t) => t.status === "disponible").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mesas ocupadas:</span>
                      <span className="font-semibold">
                        {tables.filter((t) => t.status === "ocupada").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reservas hoy:</span>
                      <span className="font-semibold">
                        {todayReservations.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>En lista de espera:</span>
                      <span className="font-semibold">
                        {activeWaitlist.length}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reservas" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por nombre o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Dialog
                open={showNewReservation}
                onOpenChange={setShowNewReservation}
              >
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Reserva
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nueva Reserva</DialogTitle>
                    <DialogDescription>
                      Registra una nueva reserva para el restaurante
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        value={newReservation.name}
                        onChange={(e) =>
                          setNewReservation({
                            ...newReservation,
                            name: e.target.value,
                          })
                        }
                        placeholder="Nombre del cliente"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={newReservation.phone}
                        onChange={(e) =>
                          setNewReservation({
                            ...newReservation,
                            phone: e.target.value,
                          })
                        }
                        placeholder="Número de teléfono"
                      />
                    </div>
                    <div>
                      <Label htmlFor="people">Cantidad de Personas</Label>
                      <Input
                        id="people"
                        type="number"
                        value={newReservation.people}
                        onChange={(e) =>
                          setNewReservation({
                            ...newReservation,
                            people: e.target.value,
                          })
                        }
                        placeholder="Número de personas"
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Fecha</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newReservation.date}
                        onChange={(e) =>
                          setNewReservation({
                            ...newReservation,
                            date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Hora</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newReservation.time}
                        onChange={(e) =>
                          setNewReservation({
                            ...newReservation,
                            time: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowNewReservation(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateReservation}>
                      Crear Reserva
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  Reservas del Día -{" "}
                  {format(new Date(), "dd 'de' MMMM, yyyy", { locale: es })}
                </CardTitle>
                <CardDescription>
                  {filteredReservations.length} reserva(s) encontrada(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {filteredReservations.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No hay reservas para hoy</p>
                      </div>
                    ) : (
                      filteredReservations
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((reservation) => (
                          <Card key={reservation.id} className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <h4 className="font-semibold">
                                  {reservation.name}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-4 w-4" />
                                    {reservation.phone}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    {reservation.people} personas
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {reservation.time}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={
                                    reservation.status === "asignada"
                                      ? "bg-orange-500 text-white"
                                      : reservation.status === "completada"
                                      ? "bg-yellow-200 text-orange-800"
                                      : "outline"
                                  }
                                >
                                  {reservation.status === "pendiente" &&
                                    "Pendiente"}
                                  {reservation.status === "asignada" &&
                                    `Mesa ${
                                      tables.find(
                                        (t) => t.id === reservation.tableId
                                      )?.number
                                    }`}
                                  {reservation.status === "completada" &&
                                    "Completada"}
                                </Badge>
                                {reservation.status === "pendiente" &&
                                  availableTables.length > 0 && (
                                    <Button
                                      size="sm"
                                      className="bg-orange-500 hover:bg-orange-600 text-white"
                                      onClick={() => {
                                        setSelectedReservation(reservation);
                                        setShowAssignTable(true);
                                      }}
                                    >
                                      Asignar Mesa
                                    </Button>
                                  )}
                              </div>
                            </div>
                          </Card>
                        ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Dialog open={showAssignTable} onOpenChange={setShowAssignTable}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Asignar Mesa</DialogTitle>
                  <DialogDescription>
                    Selecciona una mesa disponible para{" "}
                    {selectedReservation?.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {availableTables.length === 0 ? (
                    <div className="text-center py-4">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                      <p className="text-gray-600">No hay mesas disponibles</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {availableTables
                        .filter(
                          (table) =>
                            table.capacity >= (selectedReservation?.people || 0)
                        )
                        .map((table) => (
                          <Button
                            key={table.id}
                            variant="outline"
                            className="p-4 h-auto bg-transparent bg-orange-500 hover:bg-orange-600 text-white"
                            onClick={() =>
                              selectedReservation &&
                              handleAssignTable(
                                selectedReservation.id,
                                table.id
                              )
                            }
                          >
                            <div className="text-center">
                              <div className="font-semibold">
                                Mesa {table.number}
                              </div>
                              <div className="text-sm text-gray-600">
                                {table.capacity} personas
                              </div>
                            </div>
                          </Button>
                        ))}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowAssignTable(false)}
                  >
                    Cancelar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="espera" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Lista de Espera</h2>
                {/* <p className="text-gray-600">Gestiona clientes sin reserva</p> */}
              </div>
              <Dialog
                open={showWaitlistForm}
                onOpenChange={setShowWaitlistForm}
              >
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar a Lista de Espera</DialogTitle>
                    <DialogDescription>
                      Registra un cliente que llegó sin reserva
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="waitlist-name">Nombre</Label>
                      <Input
                        id="waitlist-name"
                        value={newWaitlistClient.name}
                        onChange={(e) =>
                          setNewWaitlistClient({
                            ...newWaitlistClient,
                            name: e.target.value,
                          })
                        }
                        placeholder="Nombre del cliente"
                      />
                    </div>
                    <div>
                      <Label htmlFor="waitlist-people">
                        Cantidad de Personas
                      </Label>
                      <Input
                        id="waitlist-people"
                        type="number"
                        value={newWaitlistClient.people}
                        onChange={(e) =>
                          setNewWaitlistClient({
                            ...newWaitlistClient,
                            people: e.target.value,
                          })
                        }
                        placeholder="Número de personas"
                        min="1"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowWaitlistForm(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleAddToWaitlist}>
                      Agregar a Lista
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Clientes en Espera</CardTitle>
                  <CardDescription>
                    Ordenados por hora de llegada
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {activeWaitlist.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No hay clientes en lista de espera</p>
                        </div>
                      ) : (
                        activeWaitlist
                          .sort((a, b) =>
                            a.arrivalTime.localeCompare(b.arrivalTime)
                          )
                          .map((client, index) => (
                            <Card key={client.id} className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">
                                      #{index + 1}
                                    </Badge>
                                    <h4 className="font-semibold">
                                      {client.name}
                                    </h4>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                    <div className="flex items-center gap-1">
                                      <Users className="h-4 w-4" />
                                      {client.people} personas
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      {client.arrivalTime}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  {availableTables.some(
                                    (t) => t.capacity >= client.people
                                  ) && (
                                    <Select
                                      onValueChange={(tableId) =>
                                        handleAssignWaitlistToTable(
                                          client.id,
                                          tableId
                                        )
                                      }
                                    >
                                      <SelectTrigger className="w-32">
                                        <SelectValue placeholder="Asignar" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {availableTables
                                          .filter(
                                            (t) => t.capacity >= client.people
                                          )
                                          .map((table) => (
                                            <SelectItem
                                              key={table.id}
                                              value={table.id}
                                            >
                                              Mesa {table.number}
                                            </SelectItem>
                                          ))}
                                      </SelectContent>
                                    </Select>
                                  )}
                                </div>
                              </div>
                            </Card>
                          ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Clientes Notificados</CardTitle>
                  <CardDescription>Esperando confirmación</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {waitlist.filter((w) => w.status === "notificado")
                        .length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No hay clientes notificados</p>
                        </div>
                      ) : (
                        waitlist
                          .filter((w) => w.status === "notificado")
                          .map((client) => (
                            <Card key={client.id} className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-semibold">
                                    {client.name}
                                  </h4>
                                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                    <div className="flex items-center gap-1">
                                      <Users className="h-4 w-4" />
                                      {client.people} personas
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      Mesa{" "}
                                      {
                                        tables.find(
                                          (t) => t.id === client.tableId
                                        )?.number
                                      }
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleUpdateWaitlistStatus(
                                        client.id,
                                        "esperando"
                                      )
                                    }
                                  >
                                    Volver a Espera
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-orange-500 hover:bg-orange-600 text-white"
                                    onClick={() =>
                                      handleUpdateWaitlistStatus(
                                        client.id,
                                        "sentado"
                                      )
                                    }
                                  >
                                    Sentado
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="estadisticas" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Mesas Totales
                  </CardTitle>
                  <MapPin className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tables.length}</div>
                  <p className="text-xs text-orange-500">
                    Capacidad total:{" "}
                    {tables.reduce((sum, t) => sum + t.capacity, 0)} personas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Ocupación Actual
                  </CardTitle>
                  <Users className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(
                      (tables.filter(
                        (t) =>
                          t.status === "ocupada" || t.status === "reservada"
                      ).length /
                        tables.length) *
                        100
                    )}
                    %
                  </div>
                  <p className="text-xs text-orange-500">
                    {
                      tables.filter(
                        (t) =>
                          t.status === "ocupada" || t.status === "reservada"
                      ).length
                    }{" "}
                    de {tables.length} mesas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Reservas Hoy
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {todayReservations.length}
                  </div>
                  <p className="text-xs text-orange-500">
                    {
                      todayReservations.filter((r) => r.status === "asignada")
                        .length
                    }{" "}
                    asignadas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Lista de Espera
                  </CardTitle>
                  <Clock className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {activeWaitlist.length}
                  </div>
                  <p className="text-xs text-orange-500">
                    {waitlist.filter((w) => w.status === "notificado").length}{" "}
                    notificados
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Additional content can be added here */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
