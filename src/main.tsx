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
import { LayoutStandard } from './components/layout/LayoutStandard'

import { HomePage } from './pages/HomePage'
import { Dashboard } from './pages/Dashboard'
import { Signup } from './pages/Signup'
import { Login } from './pages/Login'
import { NotFound } from './pages/NotFound'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { TermsOfServicePage } from './pages/TermsOfServicePage'
import { FeaturesPage } from './pages/FeaturesPage'
import { PricingPage } from './pages/PricingPage'
import { BlogPage } from './pages/BlogPage'
import { FAQPage } from './pages/FAQPage'
import { AboutPage } from './pages/AboutPage'

const router = createBrowserRouter([
  // Marketing pages with the standard layout
  {
    element: <LayoutStandard />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/privacy-policy', element: <PrivacyPolicyPage /> },
      { path: '/terms-of-service', element: <TermsOfServicePage /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/features', element: <FeaturesPage /> },
      { path: '/pricing', element: <PricingPage /> },
      { path: '/blog', element: <BlogPage /> },
      { path: '/faq', element: <FAQPage /> },
      { path: '/about', element: <AboutPage /> },
    ],
  },
  // Authenticated app pages
  {
    element: <LayoutApp />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      // Add other authenticated routes here
    ],
  },
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
