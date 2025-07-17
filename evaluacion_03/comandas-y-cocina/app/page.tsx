"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChefHat, Users } from "lucide-react"
import WaiterView from "@/components/waiter-view"
import KitchenView from "@/components/kitchen-view"

export default function RestaurantPOS() {
  const [currentView, setCurrentView] = useState<"home" | "waiter" | "kitchen">("home")

  if (currentView === "waiter") {
    return <WaiterView onBack={() => setCurrentView("home")} />
  }

  if (currentView === "kitchen") {
    return <KitchenView onBack={() => setCurrentView("home")} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-warning-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">LUNARi</h1>
          <p className="text-gray-600">Gestión integral de pedidos y cocina</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView("waiter")}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <CardTitle className="text-xl">Vista Mozo</CardTitle>
              <CardDescription>Toma de pedidos digital, gestión de mesas y comandas</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="ms-2">Selección de mesas</li>
                <li className="ms-2">Carta digital por categorías</li>
                <li className="ms-2">Notas y modificadores</li>
                <li className="ms-2">Gestión de comandas</li>
              </ul>
              <Button className="w-full mt-4">Acceder como Mozo</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView("kitchen")}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                <ChefHat className="w-8 h-8 text-secondary-600" />
              </div>
              <CardTitle className="text-xl">Vista Cocina</CardTitle>
              <CardDescription>KDS - Sistema de visualización de comandas</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="ms-2">Tickets digitales</li>
                <li className="ms-2">Cronómetro de pedidos</li>
                <li className="ms-2">Estados de preparación</li>
                <li className="ms-2">Notificaciones automáticas</li>
              </ul>
              <Button className="w-full mt-4">Acceder a Cocina</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
