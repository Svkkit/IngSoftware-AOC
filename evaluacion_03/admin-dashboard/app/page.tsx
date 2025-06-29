"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { DashboardView } from "@/components/dashboard-view"
import { UsersView } from "@/components/users-view"
import { ReportsView } from "@/components/reports-view"
import { ScheduleView } from "@/components/schedule-view"
import { InventoryView } from "@/components/inventory-view"


export default function Page() {
  const [activeView, setActiveView] = useState("dashboard")
  const [currentUser] = useState({
    name: "Admin Usuario",
    role: "Gerente",
    email: "admin@restaurante.com",
  })

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView />
      case "users":
        return <UsersView />
      case "reports":
        return <ReportsView />
      case "schedule":
        return <ScheduleView />
      case "inventory":
        return <InventoryView />
      default:
        return <DashboardView />
    }
  }

  const getViewTitle = () => {
    switch (activeView) {
      case "dashboard":
        return "Dashboard Principal"
      case "users":
        return "Gestión de Usuarios"
      case "reports":
        return "Reportes y Análisis"
      case "schedule":
        return "Planificación de Turnos"
      default:
        return "Dashboard"
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar activeView={activeView} setActiveView={setActiveView} currentUser={currentUser} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Administración</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{getViewTitle()}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{renderView()}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
