import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './components/theme-provider'
import './index.css'

import { LayoutApp } from './components/layout/LayoutApp'
import { Dashboard } from './pages/Dashboard'
import { EuclidSandbox } from './pages/EuclidSandbox'
import { NotFound } from './pages/NotFound'

/**
 * Simple router configuration focused on the dashboard as the main application.
 * Clean structure without auth complexity or marketing pages.
 */
const router = createBrowserRouter([
  // Main app layout with dashboard as the primary route
  {
    element: <LayoutApp />,
    children: [
      { path: '/', element: <Dashboard /> }, // Dashboard as home page
      { path: '/dashboard', element: <Dashboard /> },
    ],
  },
  // Standalone EuclidSandbox without main layout
  { path: '/euclid-sandbox', element: <EuclidSandbox /> },
  // Catch-all not found page
  { path: '*', element: <NotFound /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider defaultTheme="system" storageKey="boilerplate-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>,
)
