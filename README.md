# Drawing Bored - 2D Geometry Board

*Disclaimer: This README was completely AI-generated. All opinions expressed are Claude's.*

A professional CAD-style geometry visualization tool built with React and TypeScript. An experimental project exploring the intersection of AI-assisted development and precision engineering tools.

## 🎯 Project Overview

Drawing Bored is a modern web-based geometry board that brings CAD-level precision to mathematical visualization and construction. Born from an experiment to test "vibe coding" in precision tools, this project demonstrates how AI-powered development can create sophisticated engineering applications.

## ✨ Key Features

### 🎨 Drawing Tools
- **Point Tool**: Place precise coordinate points
- **Line Tool**: Create lines between points with dynamic input
- **Circle Tool**: Draw circles with center-radius or center-point definition
- **Rectangle Tool**: Construct rectangles with corner-to-corner placement
- **Triangle Tool**: Create triangles with three-point definition
- **Perpendicular Tool**: Generate perpendicular lines and bisectors

### 🔧 Advanced Tools
- **Select Tool**: Multi-selection with window/crossing selection modes
- **Move Tool**: Precise element translation with two-click workflow
- **Copy Tool**: Duplicate elements with offset positioning
- **Array Tool**: Create multiple copies in patterns
- **Mirror Tool**: Reflect elements across a defined axis
- **Trim Tool**: Cut line segments at intersection points
- **Delete Tool**: Remove elements with click selection
- **Measure Tool**: Calculate distances between points

### 🎯 Precision Features
- **Grid Snapping**: Snap to customizable grid points
- **Point Snapping**: Snap to existing element points
- **Intersection Detection**: Automatic calculation and display of intersection points
- **Real-time Measurements**: Dynamic distance calculation and display
- **Infinite Grid**: Seamless grid that extends infinitely in all directions
- **Virtual Zoom**: Pan and zoom the canvas without affecting UI elements

### 🎛️ Professional UI
- **Sidebar Navigation**: Organized tool groups and settings
- **Floating Overlays**: Context-sensitive information panels
- **Keyboard Shortcuts**: CAD-style hotkeys for efficient workflow
- **Dark/Light Mode**: Adaptive theming for different environments
- **Undo/Redo System**: Full history management with 50-entry buffer
- **Help System**: Comprehensive keyboard shortcut guide

### 📐 Classical Constructions
Pre-built construction demos:
- **Equilateral Triangle**: Compass-and-straightedge construction
- **Perpendicular Bisector**: Classical geometric bisection
- **Angle Bisector**: Precise angle division
- **Intersection Demo**: Multi-element intersection showcase

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18**: Modern functional components with hooks
- **TypeScript**: Full type safety and IntelliSense support
- **Vite**: Lightning-fast development and build tooling
- **Tailwind CSS**: Utility-first styling framework
- **shadcn/ui**: High-quality component library
- **Lucide React**: Professional icon system

### Geometry Engine
The core geometry engine (`/src/lib/geometry.ts`) provides:

```typescript
// Core geometric primitives
class Point2D {
  constructor(public x: number, public y: number) {}
  add(vector: Vector2D): Point2D
  distanceTo(other: Point2D): number
  // ... additional methods
}

class Line2D {
  constructor(public start: Point2D, public end: Point2D) {}
  intersectWith(other: Line2D | Circle2D): Point2D[]
  closestPointTo(point: Point2D): Point2D
  // ... intersection algorithms
}

class Circle2D {
  constructor(public center: Point2D, public radius: number) {}
  intersectWith(other: Circle2D | Line2D): Point2D[]
  containsPoint(point: Point2D): boolean
  // ... geometric operations
}
```

**Advanced Features:**
- **Intersection Algorithms**: Line-line, line-circle, circle-circle intersections
- **Geometric Utilities**: Distance calculations, perpendicular construction, angle bisection
- **Snap Detection**: Multi-level snapping with configurable tolerances
- **Element Management**: ID-based element tracking with state synchronization

### State Management Architecture
- **Canvas State**: Custom hooks for element, selection, and interaction state
- **History System**: Immutable state snapshots for undo/redo functionality
- **Event System**: Modular tool handlers with clean separation of concerns
- **Sync Mechanism**: Parent-child state synchronization for history management

### Rendering System
- **SVG-based**: Scalable vector graphics for infinite precision
- **Transform Groups**: Efficient viewport management with CSS transforms
- **Layer Organization**: Separate rendering layers for elements, UI, and interactions
- **Performance Optimization**: Selective re-rendering and viewport culling

## 🎨 UI/UX Philosophy

### Design Principles
1. **Precision First**: Every interaction prioritizes geometric accuracy
2. **CAD-Inspired**: Familiar workflows for engineering professionals
3. **Modern Aesthetics**: Clean, professional interface with adaptive theming
4. **Keyboard-Driven**: Comprehensive hotkey system for power users
5. **Progressive Disclosure**: Advanced features available without overwhelming beginners

### Interaction Patterns
- **Two-Click Workflows**: Consistent start-point → end-point interactions
- **Context Sensitivity**: Tools adapt behavior based on current selection
- **Visual Feedback**: Real-time previews and hover states
- **Non-Destructive**: All operations preserve original elements when possible

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser with SVG support

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/drawing-bored.git
cd drawing-bored/drawing-bored-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Quick Start Guide

1. **Select a Tool**: Click any tool in the sidebar or use keyboard shortcuts
2. **Place Elements**: Click on the canvas to place points, lines, and shapes
3. **Use Snapping**: Enable grid snap or point snap for precision
4. **Try Constructions**: Use the demo constructions to see classical geometry
5. **Zoom and Pan**: Mouse wheel to zoom, middle-click or Shift+click to pan

### Keyboard Shortcuts

| Tool | Shortcut | Description |
|------|----------|-------------|
| **P** | Point | Place coordinate points |
| **L** | Line | Draw lines between points |
| **C** | Circle | Create circles |
| **R** | Rectangle | Draw rectangles |
| **T** | Triangle | Create triangles |
| **S** | Select | Selection and manipulation |
| **M** | Move | Translate elements |
| **E** | Delete | Remove elements |
| **F3** | Toggle | Show/hide intersections |
| **Ctrl+Z** | Undo | Undo last action |
| **Ctrl+Y** | Redo | Redo last undone action |

## 🔬 Development Philosophy

### The "Vibe Coding" Experiment

This project represents an exploration of AI-assisted development in precision tools. The experiment asked: *Can AI-powered "vibe coding" produce software that meets the exacting standards of engineering tools?*

**Key Insights:**
- **Rapid Prototyping**: AI excels at quickly implementing complex features
- **Pattern Recognition**: AI effectively applies established architectural patterns
- **Code Quality**: With proper prompting, AI can produce maintainable, well-documented code
- **Domain Knowledge**: AI can successfully work with specialized mathematical concepts
- **Iterative Refinement**: The AI + human feedback loop enables rapid quality improvement

### Technical Lessons Learned
1. **Architecture Matters**: Well-designed abstractions enable AI to work more effectively
2. **Type Safety**: TypeScript provides guardrails that help AI avoid common mistakes
3. **Modular Design**: Breaking complex systems into smaller pieces improves AI comprehension
4. **Documentation**: Clear interfaces and documentation help AI maintain consistency

## 🎖️ Inspiration and Credits

### Primary Inspiration
- **Euclid F# Library**: Core geometric algorithms and mathematical foundations by [Euclid F# Contributors](https://github.com/AngelMunoz/Euclid)
- **AutoCAD**: Industry-standard CAD precision and workflow patterns
- **GeoGebra**: Mathematical visualization and educational geometry tools
- **Desmos Graphing Calculator**: Modern web-based mathematical interface design

### Technology Credits
- **React Team**: React framework
- **Vercel**: Vite build tooling
- **Tailwind Labs**: Tailwind CSS utility framework
- **shadcn**: Component library
- **Lucide**: Icon system
- **TypeScript Team**: Type safety for JavaScript

### Mathematical Foundations
- **Euclid's Elements**: Classical geometric construction principles
- **Computational Geometry**: Modern algorithms for geometric operations
- **Computer Graphics**: Vector mathematics and coordinate transformations

## 🗺️ Roadmap and Backlog

### Phase 1: Core Foundation ✅
- [x] Basic drawing tools (point, line, circle)
- [x] Canvas pan/zoom functionality
- [x] Grid system with snapping
- [x] Intersection detection
- [x] Undo/redo system
- [x] Professional UI with sidebar

### Phase 2: Advanced Tools 🚧
- [x] Selection and manipulation tools
- [x] Copy, move, and array tools
- [x] Measurement and annotation
- [ ] Advanced shape tools (polygon, ellipse, spline)
- [ ] Text annotations and dimensioning
- [ ] Layer management system

### Phase 3: Precision Features 📋
- [ ] Coordinate input panel
- [ ] Parametric constraints
- [ ] Construction history tree
- [ ] Advanced snapping modes (tangent, perpendicular, midpoint)
- [ ] Object properties panel
- [ ] Custom grid types (polar, isometric)

### Phase 4: Collaboration 🔮
- [ ] File save/load (JSON format)
- [ ] Export functionality (SVG, DXF, PDF)
- [ ] Real-time collaboration
- [ ] Cloud storage integration
- [ ] Public gallery for constructions

### Phase 5: Advanced Mathematics 🌟
- [ ] Parametric equations
- [ ] Function plotting
- [ ] 3D geometry preview
- [ ] Animation and motion studies
- [ ] Custom tool creation system

### Performance Optimizations
- [ ] Canvas virtualization for large drawings
- [ ] WebGL acceleration for complex scenes
- [ ] Progressive loading for detailed drawings
- [ ] Background processing for heavy calculations

### Developer Experience
- [ ] Plugin system for custom tools
- [ ] API for external integrations
- [ ] Command palette for power users
- [ ] Customizable keyboard shortcuts
- [ ] Macro recording and playback

## 🐛 Known Issues

### High Priority
- [ ] Performance degradation with >1000 elements
- [ ] Touch device gesture conflicts
- [ ] Browser zoom interaction edge cases

### Medium Priority
- [ ] Intersection calculation precision at extreme zoom levels
- [ ] Memory leaks in long drawing sessions
- [ ] Mobile responsive design improvements

### Low Priority
- [ ] Keyboard shortcut conflicts with browser shortcuts
- [ ] Theme transition smoothness
- [ ] Grid rendering optimization at high zoom

## 🤝 Contributing

We welcome contributions! This project is particularly interesting for:
- **Geometry Algorithm Enthusiasts**: Improve mathematical calculations
- **UI/UX Designers**: Enhance the user experience
- **Performance Engineers**: Optimize rendering and calculations
- **Accessibility Advocates**: Improve tool accessibility
- **Educators**: Add educational features and constructions

### Development Setup
```bash
# Fork and clone the repository
git clone https://github.com/your-username/drawing-bored.git
cd drawing-bored/drawing-bored-frontend

# Install dependencies
npm install

# Run tests
npm test

# Start development server
npm run dev
```

### Contribution Guidelines
1. **Code Style**: Follow the existing TypeScript and React patterns
2. **Testing**: Add tests for new geometric algorithms
3. **Documentation**: Update README and code comments
4. **Performance**: Consider impact on large drawings
5. **Accessibility**: Ensure keyboard navigation works

## 📧 Contact and Support

### Project Maintainer
**Esteban Basili**
- GitHub: [@estebanba]
- LinkedIn: [Esteban Basili](https://www.linkedin.com/in/estebanbasili/)

### Project Links
- **Live Demo**: TBD
- **GitHub Repository**: [https://github.com/estebanba/drawing-bored-frontend]
- **Issue Tracker**: [GitHub Issues]
- **Discussions**: [GitHub Discussions]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Special thanks to:
- Euclid F# library for geometric algorithm inspiration

---

**Drawing Bored** - 2D Geometry Board

*Built using AI-assisted development*
