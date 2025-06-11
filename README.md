# ⚡ Vite TypeScript Frontend

A modern, responsive frontend application built with React, TypeScript, and Vite. Features dark/light theme support, authentication, and beautiful UI components powered by shadcn/ui.

## ✨ Features

### 🎨 **Modern UI/UX**
- ⚡ **Vite**: Lightning-fast development with HMR
- ⚛️ **React 18**: Latest React with concurrent features
- 📘 **TypeScript**: Full type safety and IntelliSense
- 🎨 **TailwindCSS**: Utility-first CSS framework
- 🧩 **shadcn/ui**: Beautiful, accessible component library

### 🌗 **Theme System**
- 🌞 **Light/Dark Mode**: System preference detection
- 🎨 **Theme Toggle**: Manual theme switching
- 💾 **Persistent**: Theme preference saved locally
- 🎯 **Consistent**: Theme applied across all components

### 🔐 **Authentication & State**
- 🔑 **JWT Authentication**: Secure token-based auth
- 🗃️ **Zustand**: Lightweight state management
- 🔄 **Auto-refresh**: Seamless token refresh
- 👤 **User Management**: Profile and account features

### 📱 **Responsive Design**
- 📱 **Mobile-first**: Optimized for all devices
- 🎯 **Accessibility**: WCAG compliant components
- 🔄 **Progressive**: Modern web app features
- 📊 **SEO Ready**: Meta tags and structured data

### 🚀 **Performance**
- ⚡ **Fast Loading**: Code splitting and lazy loading
- 🗜️ **Optimized Build**: Minified and compressed
- 📱 **PWA Ready**: Service worker support
- 📊 **Analytics**: Ready for tracking integration

### 🐳 **DevOps Ready**
- 🐳 **Docker**: Production-optimized containers
- 🌐 **Nginx**: High-performance web server
- ☁️ **Coolify**: One-click deployment
- 📊 **Health Checks**: Application monitoring

## 📁 Project Structure

```
vite-ts-front/
├── 🐳 Dockerfile                # Production container
├── ⚙️ nginx.conf                # Web server configuration
├── 📄 package.json              # Dependencies and scripts
├── 📄 vite.config.ts            # Vite configuration
├── 📄 tailwind.config.js        # TailwindCSS setup
├── 📄 components.json           # shadcn/ui configuration
├── 📄 env.example               # Environment template
├── 📄 .dockerignore             # Docker build optimization
├── 📁 public/                   # Static assets
│   ├── favicon.ico              # App favicon
│   ├── robots.txt               # SEO robots file
│   └── sitemap.xml              # SEO sitemap
├── 📁 src/                      # Source code
│   ├── 📄 main.tsx              # Application entry point
│   ├── 📄 App.tsx               # Root component
│   ├── 📁 components/           # Reusable components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── layout/              # Layout components
│   │   ├── forms/               # Form components
│   │   ├── sections/            # Page sections
│   │   └── theme/               # Theme components
│   ├── 📁 pages/                # Page components
│   │   ├── HomePage.tsx         # Landing page
│   │   ├── LoginPage.tsx        # Authentication
│   │   ├── DashboardPage.tsx    # User dashboard
│   │   ├── FeaturesPage.tsx     # Features showcase
│   │   ├── PricingPage.tsx      # Pricing plans
│   │   └── BlogPage.tsx         # Blog/Content
│   ├── 📁 layouts/              # Layout wrappers
│   │   ├── LayoutApp.tsx        # Authenticated layout
│   │   └── LayoutStandard.tsx   # Public layout
│   ├── 📁 stores/               # State management
│   │   ├── authStore.ts         # Authentication state
│   │   ├── themeStore.ts        # Theme preferences
│   │   └── userStore.ts         # User data
│   ├── 📁 services/             # API integration
│   │   ├── api.ts               # API client setup
│   │   ├── auth.service.ts      # Auth endpoints
│   │   └── user.service.ts      # User endpoints
│   ├── 📁 hooks/                # Custom React hooks
│   │   ├── useAuth.ts           # Authentication hook
│   │   ├── useTheme.ts          # Theme management
│   │   └── useApi.ts            # API calls
│   ├── 📁 utils/                # Utility functions
│   │   ├── cn.ts                # Class name utility
│   │   ├── validation.ts        # Form validation
│   │   └── storage.ts           # Local storage
│   ├── 📁 types/                # TypeScript definitions
│   │   ├── auth.types.ts        # Auth types
│   │   ├── user.types.ts        # User types
│   │   └── api.types.ts         # API types
│   └── 📁 styles/               # CSS files
│       ├── globals.css          # Global styles
│       └── components.css       # Component styles
└── 📁 dist/                     # Built files (generated)
```

## 🚀 Quick Start

### Prerequisites

- 📦 **Node.js** 20+
- 🐳 **Docker** (optional, for containerized development)

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/vite-ts-front
cd vite-ts-front
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit with your backend API URL
nano .env
```

**Environment Variables:**
```env
# Backend API URL
VITE_API_URL=http://localhost:3000

# App Configuration
VITE_APP_NAME=Boilerplate
VITE_APP_DESCRIPTION=A modern web application

# Third-party Services (optional)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### 3. Development

```bash
# Start development server
npm run dev

# Open in browser
open http://localhost:5173
```

### 4. Build for Production

```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

## 🔧 Development Commands

```bash
# Development
npm run dev           # Start dev server with HMR
npm run build         # Build for production
npm run preview       # Preview production build

# Code Quality
npm run lint          # ESLint code checking
npm run lint:fix      # Auto-fix ESLint issues
npm run type-check    # TypeScript checking
npm run format        # Prettier formatting

# Testing
npm test              # Run test suite
npm run test:ui       # Run tests with UI
npm run test:coverage # Generate coverage report

# Dependencies
npm run update        # Update dependencies
npm audit             # Security audit

# Docker
npm run docker:build  # Build Docker image
npm run docker:run    # Run container
```

## 🎨 Component Library

Built with **shadcn/ui** for beautiful, accessible components:

### Available Components

```tsx
// UI Components
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert } from "@/components/ui/alert"

// Layout Components
import { HeaderStandard } from "@/components/layout/HeaderStandard"
import { Footer } from "@/components/layout/Footer"
import { Sidebar } from "@/components/layout/Sidebar"

// Theme Components
import { ThemeProvider } from "@/components/theme/ThemeProvider"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
```

### Adding New Components

```bash
# Add shadcn/ui components
npx shadcn-ui@latest add [component-name]

# Example: Add a new dialog component
npx shadcn-ui@latest add dialog
```

## 🌗 Theme System

### Theme Provider

The app uses a comprehensive theme system:

```tsx
// Wrap your app with ThemeProvider
import { ThemeProvider } from "@/components/theme/ThemeProvider"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      {/* Your app content */}
    </ThemeProvider>
  )
}
```

### Theme Toggle

```tsx
import { ThemeToggle } from "@/components/theme/ThemeToggle"

// Add theme toggle to your header
<ThemeToggle />
```

### Custom Themes

Modify `tailwind.config.js` to customize colors:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Add your custom colors
      }
    }
  }
}
```

## 🔐 Authentication

### Auth Store

Using Zustand for authentication state:

```tsx
import { useAuthStore } from "@/stores/authStore"

function LoginForm() {
  const { login, isLoading, user } = useAuthStore()
  
  const handleLogin = async (email: string, password: string) => {
    await login(email, password)
  }
}
```

### Protected Routes

```tsx
import { useAuth } from "@/hooks/useAuth"
import { Navigate } from "react-router-dom"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <Navigate to="/login" />
  
  return <>{children}</>
}
```

## 📱 Responsive Design

### Breakpoints

TailwindCSS breakpoints used throughout:

```css
/* Mobile first approach */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X Extra large devices */
```

### Responsive Components

```tsx
// Example responsive component
<div className="
  grid grid-cols-1 gap-4
  md:grid-cols-2 
  lg:grid-cols-3
  xl:gap-6
">
  {/* Grid items */}
</div>
```

## 🔌 API Integration

### API Service

Centralized API client:

```tsx
// src/services/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})

// Request interceptor for auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### Service Functions

```tsx
// src/services/auth.service.ts
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },
  
  register: async (userData: RegisterData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  }
}
```

## 🧪 Testing

### Test Setup

Using Vitest for fast unit testing:

```tsx
// src/__tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## 🐳 Docker Deployment

### Local Development

```bash
# Build and run with Docker
docker build -t vite-frontend:latest .
docker run -p 80:80 vite-frontend:latest
```

### Production Build

The Dockerfile includes:
- ✅ Multi-stage build for optimization
- ✅ Nginx for high-performance serving
- ✅ Security headers
- ✅ Gzip compression
- ✅ Proper caching headers

## ☁️ Coolify Deployment

### Prerequisites

- **VPS Server** with Coolify installed
- **GitHub repository** with your frontend code
- **Domain name** (optional)
- **Backend API** URL

### Step-by-Step Deployment

1. **Repository Setup**
   - Ensure code is pushed to GitHub
   - Dockerfile is in repository root ✅
   - nginx.conf is configured ✅

2. **Create Application in Coolify**
   - Go to Coolify dashboard
   - Click "New" → "Application"
   - Choose "Public Repository"
   - Repository URL: `https://github.com/yourusername/vite-ts-front`
   - Build Pack: `Dockerfile`

3. **Environment Variables**
   ```env
   VITE_API_URL=https://api.yourapp.com
   VITE_APP_NAME=Your App Name
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
   ```

4. **Domain Configuration**
   - Add custom domain: `yourapp.com`
   - SSL certificates auto-provisioned

5. **Deploy**
   - Click "Deploy" in Coolify
   - Monitor build logs
   - Test deployment: `https://yourapp.com`

### Verification

Test your deployment:

```bash
# Check if site loads
curl -I https://yourapp.com

# Check health endpoint (if configured)
curl https://yourapp.com/health

# Test API connectivity
curl https://yourapp.com/api/test
```

## 📊 Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

### Optimization Techniques

1. **Code Splitting**
   ```tsx
   // Lazy load pages
   const Dashboard = lazy(() => import('./pages/DashboardPage'))
   ```

2. **Image Optimization**
   ```tsx
   // Use modern image formats
   <img src="image.webp" alt="Description" loading="lazy" />
   ```

3. **Asset Preloading**
   ```html
   <!-- In index.html -->
   <link rel="preload" href="/fonts/font.woff2" as="font" crossorigin>
   ```

## 📱 PWA Features

### Service Worker

Add PWA capabilities:

```bash
# Install PWA plugin
npm install vite-plugin-pwa -D
```

```tsx
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
})
```

## 🔍 SEO Optimization

### React Helmet

Dynamic meta tags:

```tsx
import { Helmet } from 'react-helmet-async'

function HomePage() {
  return (
    <>
      <Helmet>
        <title>Home | Your App</title>
        <meta name="description" content="Welcome to our amazing app" />
        <meta property="og:title" content="Your App" />
        <meta property="og:description" content="App description" />
      </Helmet>
      {/* Page content */}
    </>
  )
}
```

### Static Files

- ✅ `robots.txt` configured
- ✅ `sitemap.xml` included
- ✅ Structured data ready
- ✅ Open Graph meta tags

## 🚨 Troubleshooting

### Common Issues

**1. Build Failures**
```bash
# Check for TypeScript errors
npm run type-check

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**2. API Connection Issues**
```bash
# Verify API URL
echo $VITE_API_URL

# Test API connectivity
curl $VITE_API_URL/health
```

**3. Styling Issues**
```bash
# Rebuild TailwindCSS
npm run build:css

# Check for conflicting styles
npm run lint:css
```

**4. Performance Issues**
```bash
# Analyze bundle
npm run build
npm run analyze

# Check for memory leaks
npm run test:memory
```

## 🤝 Contributing

### Development Workflow

1. **Fork repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** with proper TypeScript types
4. **Add tests** for new functionality
5. **Run quality checks**: `npm run lint && npm test`
6. **Commit changes**: `git commit -m 'Add amazing feature'`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Open Pull Request**

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Consistent formatting
- **Components**: Follow shadcn/ui patterns
- **Testing**: Component and integration tests

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- 📖 **Documentation**: Check component stories and examples
- 🐛 **Bug Reports**: Create an issue with reproduction steps
- 💡 **Feature Requests**: Open an issue with detailed description
- 💬 **Questions**: Start a discussion in the repository

---

**Built with ⚡ for modern web experiences**

*Happy coding! 🚀*
