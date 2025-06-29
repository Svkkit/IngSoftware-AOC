"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, UserCheck, UserX } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "Gerente" | "Anfitrión" | "Mozo" | "Cajero"
  active: boolean
  createdAt: string
  lastLogin?: string
}

export function UsersView() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Juan Pérez",
      email: "juan@restaurante.com",
      role: "Gerente",
      active: true,
      createdAt: "2024-01-15",
      lastLogin: "2024-01-20 14:30",
    },
    {
      id: "2",
      name: "María García",
      email: "maria@restaurante.com",
      role: "Anfitrión",
      active: true,
      createdAt: "2024-01-16",
      lastLogin: "2024-01-20 13:45",
    },
    {
      id: "3",
      name: "Carlos López",
      email: "carlos@restaurante.com",
      role: "Mozo",
      active: true,
      createdAt: "2024-01-17",
      lastLogin: "2024-01-20 12:15",
    },
    {
      id: "4",
      name: "Ana Martínez",
      email: "ana@restaurante.com",
      role: "Cajero",
      active: false,
      createdAt: "2024-01-10",
      lastLogin: "2024-01-18 16:20",
    },
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "" as User["role"],
    password: "",
  })
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    role: "" as User["role"],
  })

  const rolePermissions = {
    Gerente: ["Todos los módulos", "Gestión de usuarios", "Reportes completos", "Configuración de precios"],
    Anfitrión: ["Gestión de mesas", "Reservas", "Atención al cliente"],
    Mozo: ["Toma de pedidos", "Gestión de mesas", "Estado de órdenes"],
    Cajero: ["Procesamiento de pagos", "Facturación", "Caja diaria"],
  }

  const handleCreateUser = () => {
    if (newUser.name && newUser.email && newUser.role && newUser.password) {
      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        active: true,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setUsers([...users, user])
      setNewUser({ name: "", email: "", role: "" as User["role"], password: "" })
      setIsCreateDialogOpen(false)
    }
  }

  const handleEditUser = () => {
    if (selectedUser && editUser.name && editUser.email && editUser.role) {
      setUsers(users.map((user) => 
        user.id === selectedUser.id 
          ? { ...user, name: editUser.name, email: editUser.email, role: editUser.role }
          : user
      ))
      setIsEditDialogOpen(false)
      setSelectedUser(null)
      setEditUser({ name: "", email: "", role: "" as User["role"] })
    }
  }

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter((user) => user.id !== selectedUser.id))
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
    }
  }

  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setEditUser({
      name: user.name,
      email: user.email,
      role: user.role,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, active: !user.active } : user)))
  }

  const getRoleBadgeColor = (role: User["role"]) => {
    switch (role) {
      case "Gerente":
        return "bg-restaurant-primary/20 text-restaurant-primary border-restaurant-primary/30"
      case "Anfitrión":
        return "bg-restaurant-secondary/20 text-restaurant-orange border-restaurant-secondary/30"
      case "Mozo":
        return "bg-restaurant-warm/20 text-restaurant-orange border-restaurant-warm/30"
      case "Cajero":
        return "bg-restaurant-accent/20 text-restaurant-orange border-restaurant-accent/30"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h2>
          <p className="text-muted-foreground">Administra usuarios, roles y permisos del sistema</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Crear Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Ingresa los datos del nuevo empleado y asigna su rol correspondiente.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Rol
                </Label>
                <Select onValueChange={(value) => setNewUser({ ...newUser, role: value as User["role"] })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Anfitrión">Anfitrión</SelectItem>
                    <SelectItem value="Mozo">Mozo</SelectItem>
                    <SelectItem value="Cajero">Cajero</SelectItem>
                    <SelectItem value="Gerente">Gerente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateUser}>Crear Usuario</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
              <DialogDescription>
                Modifica los datos del usuario seleccionado.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-name"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Rol
                </Label>
                <Select value={editUser.role} onValueChange={(value) => setEditUser({ ...editUser, role: value as User["role"] })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Anfitrión">Anfitrión</SelectItem>
                    <SelectItem value="Mozo">Mozo</SelectItem>
                    <SelectItem value="Cajero">Cajero</SelectItem>
                    <SelectItem value="Gerente">Gerente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditUser}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete User Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Eliminar Usuario</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar a este usuario? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="py-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-red-900">{selectedUser.name}</p>
                      <p className="text-sm text-red-700">{selectedUser.email}</p>
                      <Badge className={getRoleBadgeColor(selectedUser.role)} variant="outline">
                        {selectedUser.role}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser}>
                Eliminar Usuario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas de usuarios */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.active).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Inactivos</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => !u.active).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles Diferentes</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(users.map((u) => u.role)).size}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>Gestiona los usuarios del sistema y sus permisos</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Último Acceso</TableHead>
                <TableHead>Fecha Creación</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch checked={user.active} onCheckedChange={() => toggleUserStatus(user.id)} />
                      <span className={user.active ? "text-restaurant-primary" : "text-red-600"}>
                        {user.active ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? (
                      <div className="text-sm">
                        {new Date(user.lastLogin).toLocaleDateString("es-ES")}
                        <br />
                        <span className="text-muted-foreground">{user.lastLogin.split(" ")[1]}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Nunca</span>
                    )}
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString("es-ES")}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 bg-transparent hover:bg-red-50"
                        onClick={() => openDeleteDialog(user)}
                      >
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

      {/* Permisos por rol */}
      <Card>
        <CardHeader>
          <CardTitle>Permisos por Rol</CardTitle>
          <CardDescription>Control de acceso según el rol asignado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(rolePermissions).map(([role, permissions]) => (
              <div key={role} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Badge className={getRoleBadgeColor(role as User["role"])}>{role}</Badge>
                </h4>
                <ul className="space-y-1 text-sm">
                  {permissions.map((permission, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      {permission}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
