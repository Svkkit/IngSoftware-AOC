"use client"

import { create } from "zustand"

export interface OrderItem {
  id: number
  name: string
  price: number
  category: string
  quantity: number
  notes: string
}

export interface Order {
  id: string
  tableNumber: number
  items: OrderItem[]
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered"
  createdAt: Date
  total: number
}

interface OrderStore {
  orders: Order[]
  addItemToOrder: (tableNumber: number, item: OrderItem) => void
  removeItemFromOrder: (tableNumber: number, itemId: number) => void
  getOrderItems: (tableNumber: number) => OrderItem[]
  confirmOrder: (tableNumber: number) => void
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  addOrder: (order: Order) => void
  updateOrder: (orderId: string, updates: Partial<Order>) => void
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],

  addItemToOrder: (tableNumber, newItem) => {
    set((state) => {
      const existingOrderIndex = state.orders.findIndex(
        (order) => order.tableNumber === tableNumber && order.status === "pending",
      )

      if (existingOrderIndex >= 0) {
        // Update existing order
        const updatedOrders = [...state.orders]
        const order = updatedOrders[existingOrderIndex]
        const existingItemIndex = order.items.findIndex((item) => item.id === newItem.id)

        if (existingItemIndex >= 0) {
          // Update existing item
          order.items[existingItemIndex] = {
            ...order.items[existingItemIndex],
            quantity: order.items[existingItemIndex].quantity + newItem.quantity,
            notes: newItem.notes,
          }
        } else {
          // Add new item
          order.items.push(newItem)
        }

        order.total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        return { orders: updatedOrders }
      } else {
        // Create new order
        const newOrder: Order = {
          id: `order-${Date.now()}-${tableNumber}`,
          tableNumber,
          items: [newItem],
          status: "pending",
          createdAt: new Date(),
          total: newItem.price * newItem.quantity,
        }
        return { orders: [...state.orders, newOrder] }
      }
    })
  },

  removeItemFromOrder: (tableNumber, itemId) => {
    set((state) => {
      const updatedOrders = state.orders
        .map((order) => {
          if (order.tableNumber === tableNumber && order.status === "pending") {
            const updatedItems = order.items.filter((item) => item.id !== itemId)
            return {
              ...order,
              items: updatedItems,
              total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
            }
          }
          return order
        })
        .filter((order) => order.items.length > 0) // Remove empty orders

      return { orders: updatedOrders }
    })
  },

  getOrderItems: (tableNumber) => {
    const order = get().orders.find((order) => order.tableNumber === tableNumber && order.status === "pending")
    return order ? order.items : []
  },

  confirmOrder: (tableNumber) => {
    set((state) => {
      const updatedOrders = state.orders.map((order) => {
        if (order.tableNumber === tableNumber && order.status === "pending") {
          return { ...order, status: "confirmed" as const }
        }
        return order
      })
      return { orders: updatedOrders }
    })
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => {
      const updatedOrders = state.orders.map((order) => {
        if (order.id === orderId) {
          return { ...order, status }
        }
        return order
      })
      return { orders: updatedOrders }
    })
  },

  addOrder: (order) => {
    set((state) => ({
      orders: [...state.orders, order],
    }))
  },

  updateOrder: (orderId, updates) => {
    set((state) => {
      const updatedOrders = state.orders.map((order) => {
        if (order.id === orderId) {
          return { ...order, ...updates }
        }
        return order
      })
      return { orders: updatedOrders }
    })
  },
}))
