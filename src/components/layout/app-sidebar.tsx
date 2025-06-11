// All sidebar UI components are now imported using a relative path to resolve linter errors.
import * as React from "react"
import { Logotype } from "@/components/ui/logotype"
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  CreditCard,
  FileText,
  BarChart3
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar"

// Application navigation data for the sidebar
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      items: [
        { title: "Overview", url: "/dashboard" },
        { title: "Analytics", url: "/dashboard/analytics" },
      ],
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
      items: [
        { title: "All Users", url: "/users" },
        { title: "Roles", url: "/users/roles" },
        { title: "Permissions", url: "/users/permissions" },
      ],
    },
    {
      title: "Billing",
      url: "/billing",
      icon: CreditCard,
      items: [
        { title: "Subscriptions", url: "/billing/subscriptions" },
        { title: "Invoices", url: "/billing/invoices" },
        { title: "Payment Methods", url: "/billing/payment-methods" },
      ],
    },
    {
      title: "Content",
      url: "/content",
      icon: FileText,
      items: [
        { title: "Posts", url: "/content/posts" },
        { title: "Pages", url: "/content/pages" },
        { title: "Media", url: "/content/media" },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: BarChart3,
      items: [
        { title: "Usage", url: "/reports/usage" },
        { title: "Performance", url: "/reports/performance" },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        { title: "General", url: "/settings/general" },
        { title: "Security", url: "/settings/security" },
        { title: "Integrations", url: "/settings/integrations" },
      ],
    },
  ],
}

/**
 * Minimalistic floating sidebar that matches the overall design aesthetic.
 * Clean navigation structure with proper app branding and intuitive organization.
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" {...props}>
      {/* Clean sidebar header with logo and app name */}
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Logotype />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Boilerplate</span>
                  <span className="text-xs text-sidebar-muted-foreground">Dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      {/* Main navigation groups */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    <item.icon className="size-4" />
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={item.url} className="text-sidebar-muted-foreground hover:text-sidebar-foreground">
                            {item.title}
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
