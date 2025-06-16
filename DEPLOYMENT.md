# ⚡ Frontend Deployment Guide

Complete deployment guide for the Vite TypeScript Frontend using Coolify, Docker, and various hosting platforms.

## 🎯 Deployment Options

### 1. **Coolify** (Recommended)
- ✅ Self-hosted with full control
- ✅ Automatic SSL certificates
- ✅ GitHub integration
- ✅ Built-in monitoring

### 2. **Static Hosting**
- Vercel, Netlify, Cloudflare Pages
- Perfect for frontend-only deployment
- Global CDN distribution

### 3. **Traditional VPS**
- Docker + Nginx deployment
- Full server control
- Custom configuration

### 4. **Cloud Platforms**
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps

## ☁️ Coolify Deployment (Recommended)

### Prerequisites

- **VPS Server** with Coolify installed
- **GitHub repository** with your frontend code
- **Domain name** (optional, but recommended)
- **Backend API** deployed and accessible

### Step 1: Prepare Your Repository

Ensure your repository has these files in the root:

```
vite-ts-front/
├── Dockerfile              ✅ Production-ready
├── nginx.conf              ✅ Web server config
├── .dockerignore           ✅ Optimized build
├── env.example             ✅ Environment template
├── package.json            ✅ Dependencies defined
└── src/                    ✅ Source code
```

### Step 2: Environment Variables Setup

Create these environment variables in Coolify:

#### **Required Variables**
```env
VITE_API_URL=https://api.drawing-bored.com
VITE_APP_NAME=Drawing Bored
```

#### **Optional Variables** (for enhanced functionality)
```env
# Stripe Integration (if needed in future)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key

# Analytics
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX

# App Configuration
VITE_APP_DESCRIPTION=A 2D geometry and CAD drawing application for educational purposes
VITE_APP_URL=https://drawing-bored.com
VITE_CONTACT_EMAIL=support@drawing-bored.com

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CHAT_SUPPORT=true
VITE_MAINTENANCE_MODE=false

# Third-party Services
VITE_SENTRY_DSN=https://your-sentry-dsn
VITE_CRISP_WEBSITE_ID=your-crisp-id
```

### Step 3: Create Application in Coolify

1. **Access Coolify Dashboard**
   ```
   https://your-coolify-domain.com
   ```

2. **Create New Application**
   - Click "New" → "Application"
   - Choose "Public Repository"

3. **Repository Configuration**
   - Repository URL: `https://github.com/yourusername/drawing-bored-frontend`
   - Branch: `main`
   - Build Pack: `Dockerfile`
   - Dockerfile Location: `Dockerfile` (leave default)

4. **Application Settings**
   - Name: `drawing-bored-frontend`
   - Description: `Drawing Bored - 2D Geometry & CAD Tool`

### Step 4: Configure Environment Variables

In Coolify application settings:

1. **Go to Environment Variables**
2. **Add each variable** from Step 2
3. **Save configuration**

### Step 5: Domain Configuration

1. **Add Custom Domain**
   - Go to "Domains" in your application
   - Add domain: `drawing-bored.com`
   - Add www subdomain: `www.drawing-bored.com`
   - Coolify automatically provisions SSL

2. **DNS Configuration**
   Update your domain DNS:
   ```
   A Record: drawing-bored.com → YOUR_VPS_IP
   CNAME Record: www.drawing-bored.com → drawing-bored.com
   ```

### Step 6: Deploy

1. **Click Deploy** in Coolify dashboard
2. **Monitor build logs** for any issues
3. **Wait for deployment** to complete
4. **Test deployment**:
   ```bash
   curl -I https://yourapp.com
   ```

### Step 7: Verify Deployment

Test all aspects of your deployment:

```bash
# Check if site loads
curl -I https://yourapp.com

# Check specific routes (SPA routing)
curl -I https://yourapp.com/dashboard
curl -I https://yourapp.com/pricing

# Test assets loading
curl -I https://yourapp.com/favicon.ico

# Check security headers
curl -I https://yourapp.com | grep -E "(X-|Strict|Content-Security)"
```

### Step 8: Performance Verification

```bash
# Test compression
curl -H "Accept-Encoding: gzip" -I https://yourapp.com

# Check caching headers
curl -I https://yourapp.com/assets/main.js

# Test from different locations
# Use tools like GTmetrix, PageSpeed Insights
```

## 🐳 Docker Deployment (VPS)

For manual Docker deployment on a VPS:

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Create app directory
sudo mkdir -p /opt/frontend
cd /opt/frontend
```

### Step 2: Clone and Configure

```bash
# Clone your repository
git clone https://github.com/yourusername/vite-ts-front .

# Create environment file
cp env.example .env
nano .env  # Edit with your values
```

### Step 3: Build and Run

```bash
# Build the image
docker build -t frontend-app:latest .

# Run container
docker run -d \
  --name frontend-app \
  --restart unless-stopped \
  -p 80:80 \
  -p 443:443 \
  --env-file .env \
  frontend-app:latest

# Check logs
docker logs -f frontend-app
```

### Step 4: SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot -y

# Stop container temporarily
docker stop frontend-app

# Get certificate
sudo certbot certonly --standalone -d yourapp.com -d www.yourapp.com

# Update nginx configuration to use SSL
# (Modify nginx.conf and rebuild container)
```

## 🌐 Static Hosting Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

Create `vercel.json`:
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Netlify Deployment

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

### Cloudflare Pages

```bash
# Connect repository to Cloudflare Pages
# Build command: npm run build
# Build output directory: dist
# Root directory: /

# Add environment variables in Cloudflare dashboard
```

## 🔧 CI/CD Pipeline

### GitHub Actions for Coolify

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Type check
      run: npm run type-check
    
    - name: Lint
      run: npm run lint
    
    - name: Test
      run: npm test
    
    - name: Build
      run: npm run build
      env:
        VITE_API_URL: ${{ secrets.VITE_API_URL }}
        VITE_APP_NAME: ${{ secrets.VITE_APP_NAME }}
  
  deploy:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - name: Deploy to Coolify
      uses: fjogeleit/http-request-action@v1
      with:
        url: ${{ secrets.COOLIFY_WEBHOOK_URL }}
        method: 'POST'
        customHeaders: '{"Authorization": "Bearer ${{ secrets.COOLIFY_TOKEN }}"}'
```

### Automated Testing

```yaml
# Extended testing workflow
- name: E2E Tests
  run: npm run test:e2e
  env:
    VITE_API_URL: http://localhost:3000

- name: Accessibility Tests
  run: npm run test:a11y

- name: Performance Tests
  run: npm run test:lighthouse
```

## 📊 Monitoring & Analytics

### Performance Monitoring

1. **Core Web Vitals**
   ```tsx
   // Add to main.tsx
   import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'
   
   getCLS(console.log)
   getFID(console.log)
   getFCP(console.log)
   getLCP(console.log)
   getTTFB(console.log)
   ```

2. **Error Tracking with Sentry**
   ```bash
   npm install @sentry/react @sentry/tracing
   ```

   ```tsx
   // src/main.tsx
   import * as Sentry from '@sentry/react'
   
   if (import.meta.env.VITE_SENTRY_DSN) {
     Sentry.init({
       dsn: import.meta.env.VITE_SENTRY_DSN,
       environment: import.meta.env.MODE,
     })
   }
   ```

3. **Google Analytics**
   ```tsx
   // src/utils/analytics.ts
   export const gtag = (...args: any[]) => {
     if (typeof window !== 'undefined' && (window as any).gtag) {
       (window as any).gtag(...args)
     }
   }
   
   export const trackEvent = (action: string, category: string, label?: string) => {
     gtag('event', action, {
       event_category: category,
       event_label: label,
     })
   }
   ```

### Uptime Monitoring

Set up external monitoring:

```bash
# Add health check endpoint monitoring
# Tools: UptimeRobot, Pingdom, etc.
# Monitor: https://yourapp.com/health
```

## 🔒 Security Best Practices

### Security Headers

The nginx.conf includes:

```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### Environment Security

```bash
# Never commit sensitive data
echo "*.env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore

# Use different keys for development/production
VITE_API_URL=https://api-staging.yourapp.com  # staging
VITE_API_URL=https://api.yourapp.com          # production
```

### Content Security Policy

```html
<!-- In index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' *.googletagmanager.com;
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: *.gravatar.com;
               connect-src 'self' *.yourapi.com;">
```

## 🚨 Troubleshooting

### Common Issues

**1. Build Failures**
```bash
# Check environment variables
npm run build
# Error: VITE_API_URL is not defined

# Solution: Set environment variables
echo "VITE_API_URL=https://api.yourapp.com" >> .env
```

**2. Routing Issues (404 on refresh)**
```bash
# Check nginx.conf has SPA fallback
location / {
    try_files $uri $uri/ /index.html;
}
```

**3. API Connection Issues**
```bash
# Test API connectivity
curl -I $VITE_API_URL/health

# Check CORS headers
curl -H "Origin: https://yourapp.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     $VITE_API_URL/api/test
```

**4. Performance Issues**
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# Check for large dependencies
npm ls --depth=0 | sort -k2 -hr
```

**5. SSL Certificate Issues**
```bash
# Check certificate status
openssl s_client -connect yourapp.com:443 -servername yourapp.com

# Test SSL configuration
curl -I https://yourapp.com
```

### Debug Mode

Enable detailed logging:

```bash
# Development debugging
npm run dev -- --debug

# Production debugging
docker logs -f frontend-app
```

### Performance Debugging

```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --upload.target=temporary-public-storage

# Bundle analysis
npm run build
npx vite-bundle-analyzer dist

# Network analysis
# Use browser dev tools Network tab
```

## 📈 Optimization

### Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
```

### Asset Optimization

```bash
# Optimize images
npm install -D vite-plugin-imagemin

# Compress assets
npm install -D vite-plugin-compression
```

### Caching Strategy

```nginx
# In nginx.conf - different cache times
location ~* \.(js|css)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(png|jpg|jpeg|gif|webp|svg)$ {
    expires 6M;
    add_header Cache-Control "public";
}

location = /index.html {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

## 🎛️ Environment Management

### Multiple Environments

```bash
# Development
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=MyApp (Dev)

# Staging
VITE_API_URL=https://api-staging.yourapp.com
VITE_APP_NAME=MyApp (Staging)

# Production
VITE_API_URL=https://api.yourapp.com
VITE_APP_NAME=MyApp
```

### Feature Flags

```tsx
// src/utils/features.ts
export const isFeatureEnabled = (feature: string): boolean => {
  return import.meta.env[`VITE_FEATURE_${feature.toUpperCase()}`] === 'true'
}

// Usage
if (isFeatureEnabled('NEW_DASHBOARD')) {
  // Show new dashboard
}
```

## 🆘 Support & Maintenance

### Regular Maintenance

```bash
# Weekly tasks
npm audit                    # Security audit
npm outdated                 # Check for updates
npm update                   # Update dependencies

# Monthly tasks
npm run test:coverage        # Check test coverage
npm run build                # Verify builds work
npm run lighthouse           # Performance audit
```

### Backup Strategy

```bash
# Code is in Git repository ✅
# Environment variables documented ✅
# Build artifacts can be regenerated ✅

# Backup checklist:
# - Git repository (GitHub/GitLab)
# - Environment variables documentation
# - Domain/DNS configuration
# - SSL certificates (auto-renewed)
# - Analytics/monitoring setup
```

### Emergency Procedures

**1. Site Down**
```bash
# Check container status
docker ps
docker logs frontend-app

# Quick restart
docker restart frontend-app
```

**2. Performance Issues**
```bash
# Check server resources
htop
df -h

# Restart with fresh build
docker-compose down
docker-compose up --build
```

**3. SSL Issues**
```bash
# Check certificate expiry
openssl s_client -connect yourapp.com:443 | openssl x509 -noout -dates

# Force certificate renewal (if using Certbot)
sudo certbot renew --force-renewal
```

---

**Your frontend is now production-ready and deployed! ⚡**

Visit your app at `https://yourapp.com` and enjoy the modern web experience you've built! 