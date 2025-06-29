"use client"

import type React from "react"

import { createContext, useContext, useReducer, type ReactNode } from "react"

export interface Product {
  id: string
  name: string
  price: number
  category: string
  description?: string
  available: boolean
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
  orderedAt: Date
}

export interface Table {
  id: string
  number: number
  status: "available" | "occupied" | "waiting_cleaning"
  orders: OrderItem[]
  total: number
  discount: number
  discountReason?: string
  splitBill?: boolean
  splitCount?: number
}

export interface Transaction {
  id: string
  tableId: string
  tableNumber: number
  items: OrderItem[]
  subtotal: number
  discount: number
  total: number
  paymentMethod: "cash" | "card" | "check"
  timestamp: Date
  cashierName: string
}

export interface CashierSession {
  id: string
  startTime: Date
  endTime?: Date
  initialCash: number
  finalCash?: number
  totalSales: number
  cashSales: number
  cardSales: number
  checkSales: number
  differences?: number
  differencesReason?: string
}

export interface POSState {
  products: Product[]
  tables: Table[]
  transactions: Transaction[]
  cashierSessions: CashierSession[]
  currentSession?: CashierSession
  cashierOpen: boolean
  currentShift: string
}

type POSAction =
  | { type: "UPDATE_PRODUCT_PRICE"; productId: string; newPrice: number }
  | { type: "ADD_ORDER_TO_TABLE"; tableId: string; orderItem: OrderItem }
  | { type: "REMOVE_ORDER_FROM_TABLE"; tableId: string; productId: string }
  | { type: "APPLY_DISCOUNT"; tableId: string; discount: number; reason?: string }
  | { type: "SPLIT_BILL"; tableId: string; splitCount: number }
  | { type: "PROCESS_PAYMENT"; tableId: string; paymentMethod: "cash" | "card" | "check" }
  | { type: "OPEN_CASHIER"; initialCash: number }
  | { type: "CLOSE_CASHIER"; finalCash: number; differences?: number; differencesReason?: string }
  | { type: "SET_TABLE_STATUS"; tableId: string; status: Table["status"] }

const initialSession: CashierSession = {
  id: `session-initial`,
  startTime: new Date(),
  initialCash: 100,
  totalSales: 0,
  cashSales: 0,
  cardSales: 0,
  checkSales: 0,
}

const initialState: POSState = {
  products: [
    { id: "1", name: "Hamburguesa Clásica", price: 12207, category: "Principales", available: true },
    { id: "2", name: "Pizza Margherita", price: 14568, category: "Principales", available: true },
    { id: "3", name: "Ensalada César", price: 9388, category: "Ensaladas", available: true },
    { id: "4", name: "Coca Cola", price: 2350, category: "Bebidas", available: true },
    { id: "5", name: "Cerveza Artesanal", price: 4690, category: "Bebidas", available: true },
    { id: "6", name: "Tiramisú", price: 6568, category: "Postres", available: true },
  ],
  tables: Array.from({ length: 12 }, (_, i) => ({
    id: `table-${i + 1}`,
    number: i + 1,
    status: "available" as const,
    orders: [],
    total: 0,
    discount: 0,
  })),
  transactions: [],
  cashierSessions: [initialSession],
  currentSession: initialSession,
  cashierOpen: true,
  currentShift: "Mañana",
}

function posReducer(state: POSState, action: POSAction): POSState {
  switch (action.type) {
    case "UPDATE_PRODUCT_PRICE":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.productId ? { ...product, price: action.newPrice } : product,
        ),
      }

    case "ADD_ORDER_TO_TABLE":
      return {
        ...state,
        tables: state.tables.map((table) =>
          table.id === action.tableId
            ? {
                ...table,
                status: "occupied" as const,
                orders: [...table.orders, action.orderItem],
                total:
                  table.orders.reduce((sum, item) => sum + item.total, 0) + action.orderItem.total - table.discount,
              }
            : table,
        ),
      }

    case "REMOVE_ORDER_FROM_TABLE":
      return {
        ...state,
        tables: state.tables.map((table) =>
          table.id === action.tableId
            ? {
                ...table,
                orders: table.orders.filter((order) => order.productId !== action.productId),
                total:
                  table.orders
                    .filter((order) => order.productId !== action.productId)
                    .reduce((sum, item) => sum + item.total, 0) - table.discount,
              }
            : table,
        ),
      }

    case "APPLY_DISCOUNT":
      return {
        ...state,
        tables: state.tables.map((table) =>
          table.id === action.tableId
            ? {
                ...table,
                discount: action.discount,
                discountReason: action.reason,
                total: table.orders.reduce((sum, item) => sum + item.total, 0) - action.discount,
              }
            : table,
        ),
      }

    case "SPLIT_BILL":
      return {
        ...state,
        tables: state.tables.map((table) =>
          table.id === action.tableId
            ? {
                ...table,
                splitBill: true,
                splitCount: action.splitCount,
              }
            : table,
        ),
      }

    case "PROCESS_PAYMENT":
      const table = state.tables.find((t) => t.id === action.tableId)
      if (!table) return state

      const transaction: Transaction = {
        id: `txn-${Date.now()}`,
        tableId: action.tableId,
        tableNumber: table.number,
        items: table.orders,
        subtotal: table.orders.reduce((sum, item) => sum + item.total, 0),
        discount: table.discount,
        total: table.total,
        paymentMethod: action.paymentMethod,
        timestamp: new Date(),
        cashierName: "Cajero Principal",
      }

      return {
        ...state,
        transactions: [...state.transactions, transaction],
        tables: state.tables.map((t) =>
          t.id === action.tableId
            ? {
                ...t,
                status: "waiting_cleaning" as const,
                orders: [],
                total: 0,
                discount: 0,
                discountReason: undefined,
                splitBill: false,
                splitCount: undefined,
              }
            : t,
        ),
      }

    case "SET_TABLE_STATUS":
      return {
        ...state,
        tables: state.tables.map((table) =>
          table.id === action.tableId ? { ...table, status: action.status } : table,
        ),
      }

    case "OPEN_CASHIER":
      const newSession: CashierSession = {
        id: `session-${Date.now()}`,
        startTime: new Date(),
        initialCash: action.initialCash,
        totalSales: 0,
        cashSales: 0,
        cardSales: 0,
        checkSales: 0,
      }
      return {
        ...state,
        cashierOpen: true,
        currentSession: newSession,
        cashierSessions: [...state.cashierSessions, newSession],
      }

    case "CLOSE_CASHIER":
      if (!state.currentSession) return state

      const updatedSession = {
        ...state.currentSession,
        endTime: new Date(),
        finalCash: action.finalCash,
        differences: action.differences,
        differencesReason: action.differencesReason,
        totalSales: state.transactions.reduce((sum, t) => sum + t.total, 0),
        cashSales: state.transactions.filter((t) => t.paymentMethod === "cash").reduce((sum, t) => sum + t.total, 0),
        cardSales: state.transactions.filter((t) => t.paymentMethod === "card").reduce((sum, t) => sum + t.total, 0),
        checkSales: state.transactions.filter((t) => t.paymentMethod === "check").reduce((sum, t) => sum + t.total, 0),
      }

      return {
        ...state,
        cashierOpen: false,
        currentSession: undefined,
        cashierSessions: state.cashierSessions.map((session) =>
          session.id === state.currentSession?.id ? updatedSession : session,
        ),
      }

    default:
      return state
  }
}

const POSContext = createContext<{
  state: POSState
  dispatch: React.Dispatch<POSAction>
} | null>(null)

export function POSProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(posReducer, initialState)

  return <POSContext.Provider value={{ state, dispatch }}>{children}</POSContext.Provider>
}

export function usePOS() {
  const context = useContext(POSContext)
  if (!context) {
    throw new Error("usePOS must be used within a POSProvider")
  }
  return context
}
