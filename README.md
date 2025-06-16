# Drawing Bored

A 2D geometry and CAD drawing application built with:
- **React 19** + **TypeScript** + **Vite** 
- **Custom Geometry Engine** inspired by Euclid F# library
- **Professional CAD Interface** with tools and features
- **Educational Focus** for learning geometry concepts

## Features

✅ **Geometry Tools**: Point, Line, Circle, Rectangle, Triangle, Cog Wheel, and more  
✅ **Professional CAD Interface**: Tool palettes, status bar, and snap functionality  
✅ **Educational Focus**: Clear code comments and geometry concepts  
✅ **Interactive Canvas**: Pan, zoom, grid snapping, and intersection detection  
✅ **Modern UI**: Built with shadcn/ui and professional CAD-style interface  
✅ **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── LayoutApp.tsx          # Main app layout with sidebar
│   │   └── app-sidebar.tsx        # Clean sidebar navigation
│   ├── ui/                        # shadcn/ui components
│   ├── theme-provider.tsx         # Theme context provider
│   ├── theme-toggle.tsx           # Dark/light mode toggle
│   └── search-form.tsx            # Search component
├── hooks/
│   └── use-mobile.ts              # Mobile detection hook
├── pages/
│   ├── Dashboard.tsx              # Main dashboard page
│   └── NotFound.tsx               # 404 page
├── lib/
│   └── utils.ts                   # Utility functions
└── main.tsx                       # App entry point
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Customization

### Adding New Pages
1. Create a new component in `src/pages/`
2. Add the route to `src/main.tsx`
3. Update sidebar navigation in `src/components/layout/app-sidebar.tsx`

### Adding Authentication
The project is auth-agnostic. You can integrate:
- **Supabase Auth**
- **Firebase Auth** 
- **Auth0**
- **NextAuth.js**
- **Custom backend**

### Adding API Integration
Clean slate for your API solution:
- **tRPC** for type-safe APIs
- **React Query** for data fetching
- **SWR** for data synchronization
- **GraphQL** with Apollo Client
- **REST APIs** with fetch/axios

## Theme

The app supports light/dark themes using:
- **CSS variables** for consistent theming
- **Tailwind CSS** for utility classes
- **shadcn/ui** for consistent component styling

## License

MIT License - feel free to use this for your projects!
