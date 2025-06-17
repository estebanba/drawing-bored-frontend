import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import './index.css'

import { EuclidSandbox } from './pages/EuclidSandbox'
import { NotFound } from './pages/NotFound'

/**
 * Simplified router configuration with EuclidSandbox as the single main page.
 * Clean structure focused on the 2D geometry application.
 */
const router = createBrowserRouter([
  // Main geometry application as root
  { path: '/', element: <EuclidSandbox /> },
  // Catch-all not found page
  { path: '*', element: <NotFound /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="drawing-bored-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
