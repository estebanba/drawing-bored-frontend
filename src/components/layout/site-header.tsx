import { SidebarIcon } from "lucide-react"
// import { SearchForm } from "@/components/layout/search-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { useAuthStore } from "@/store/auth"
import { Link, useNavigate } from "react-router-dom"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const { token, logout } = useAuthStore()
  const navigate = useNavigate()

  // Handle logout and redirect
  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        {/* Sidebar toggle button */}
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        {/* App title styled with theme color */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight mr-4"
          style={{ color: "var(--sidebar-foreground)" }}
        >
          MyApp
        </Link>
        {/* Breadcrumbs (optional, can be removed if not needed) */}
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">
                Building Your Application
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* SearchForm is commented out for now */}
        {/* <SearchForm className="w-full sm:ml-auto sm:w-auto" /> */}
        {/* Auth buttons */}
        <div className="flex gap-2 ml-auto">
          {!token && (
            <>
              <Button asChild variant="outline">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
          {token && (
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
