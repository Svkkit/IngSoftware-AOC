"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Minus } from "lucide-react"
import { useOrderStore } from "@/lib/order-store"

interface MenuCatalogProps {
  tableNumber: number
  onContinue: () => void
}

const menuCategories = {
  Entradas: [
    { id: 1, name: "Empanadas de Pino", price: 2500, description: "Tradicionales empanadas chilenas" },
    { id: 2, name: "Tabla de Quesos", price: 8900, description: "Selección de quesos nacionales" },
    { id: 3, name: "Ceviche", price: 7500, description: "Pescado fresco en leche de tigre" },
  ],
  "Platos Principales": [
    { id: 4, name: "Lomo a la Plancha", price: 12900, description: "Con papas doradas y ensalada" },
    { id: 5, name: "Salmón Grillado", price: 14500, description: "Con quinoa y verduras" },
    { id: 6, name: "Cazuela de Cordero", price: 11900, description: "Tradicional cazuela chilena" },
    { id: 7, name: "Pasta Alfredo", price: 9900, description: "Con pollo y champiñones" },
  ],
  Postres: [
    { id: 8, name: "Tres Leches", price: 4500, description: "Clásico postre latinoamericano" },
    { id: 9, name: "Brownie con Helado", price: 5200, description: "Brownie tibio con helado de vainilla" },
  ],
  Bebidas: [
    { id: 10, name: "Pisco Sour", price: 4500, description: "Cóctel tradicional chileno" },
    { id: 11, name: "Vino Tinto Copa", price: 3200, description: "Cabernet Sauvignon reserva" },
    { id: 12, name: "Jugo Natural", price: 2800, description: "Naranja, manzana o piña" },
    { id: 13, name: "Agua Mineral", price: 1500, description: "Con o sin gas" },
  ],
}

export default function MenuCatalog({ tableNumber, onContinue }: MenuCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState("Entradas")
  const [itemNotes, setItemNotes] = useState<{ [key: number]: string }>({})
  const { addItemToOrder, removeItemFromOrder, getOrderItems } = useOrderStore()

  const currentItems = getOrderItems(tableNumber)

  const getItemQuantity = (itemId: number) => {
    const item = currentItems.find((i) => i.id === itemId)
    return item ? item.quantity : 0
  }

  const handleAddItem = (item: any) => {
    addItemToOrder(tableNumber, {
      id: item.id,
      name: item.name,
      price: item.price,
      category: selectedCategory,
      quantity: 1,
      notes: itemNotes[item.id] || "",
    })
  }

  const handleRemoveItem = (itemId: number) => {
    removeItemFromOrder(tableNumber, itemId)
  }

  const handleNotesChange = (itemId: number, notes: string) => {
    setItemNotes((prev) => ({ ...prev, [itemId]: notes }))
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Carta Digital</h2>
        <p className="text-gray-600">Mesa {tableNumber} - Selecciona los productos</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(menuCategories).map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="mb-2"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="grid gap-4 mb-6">
        {menuCategories[selectedCategory as keyof typeof menuCategories].map((item) => {
          const quantity = getItemQuantity(item.id)

          return (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                    <div className="text-lg font-bold" style={{ color: 'hsl(var(--money))' }}>${item.price.toLocaleString()}</div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={quantity === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => handleAddItem(item)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {quantity > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <Textarea
                      placeholder="Notas especiales (sin cebolla, término medio, etc.)"
                      value={itemNotes[item.id] || ""}
                      onChange={(e) => handleNotesChange(item.id, e.target.value)}
                      className="text-sm"
                      rows={2}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
