/**
 * EuclidSandbox - Professional 2D Geometry Board
 * CAD-style interface with full-size canvas and floating controls
 * Built with React and TypeScript for mathematical visualization
 */
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Info, Play, X, HelpCircle, Sun, Moon } from 'lucide-react'
import { ModularGeometryCanvas } from '@/components/canvas/ModularGeometryCanvas'
import type { GeometricElement, ToolType } from '@/types/geometry'
import { Point2D, Line2D, Circle2D, GeometryUtils } from '@/lib/geometry'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'

/**
 * Floating overlay component for construction steps
 */
interface ConstructionOverlayProps {
  construction: {
    id: string
    name: string
    steps: string[]
  } | null
  onClose: () => void
}

function ConstructionOverlay({ construction, onClose }: ConstructionOverlayProps) {
  if (!construction) return null

  return (
    <Card className="absolute top-4 right-4 w-80 shadow-lg border-2 bg-background/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <Play className="h-4 w-4" />
            <span>{construction.name}</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {construction.steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-2 text-sm">
              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              <p className="text-muted-foreground">{step}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Floating info panel component
 */
interface InfoPanelProps {
  elements: GeometricElement[]
  selectedTool: string
  isVisible: boolean
  onToggle: () => void
}

function InfoPanel({ elements, selectedTool, isVisible, onToggle }: InfoPanelProps) {
  if (!isVisible) {
    return (
      <Button
        onClick={onToggle}
        variant="outline"
        size="sm"
        className="absolute top-20 left-4 shadow-lg bg-background/95 backdrop-blur-sm"
      >
        <Info className="h-4 w-4 mr-2" />
        Show Info
      </Button>
    )
  }

  return (
    <Card className="absolute top-20 left-4 w-72 shadow-lg border-2 bg-background/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <Info className="h-4 w-4" />
            <span>Canvas Info</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-muted/50 rounded p-2">
            <div className="font-medium">Elements</div>
            <div className="text-muted-foreground">{elements.length}</div>
          </div>
          <div className="bg-muted/50 rounded p-2">
            <div className="font-medium">Tool</div>
            <div className="text-muted-foreground capitalize">{selectedTool}</div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Click to place points and create geometry</p>
          <p>• Red dots show intersection points</p>
          <p>• Use keyboard shortcuts in sidebar</p>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Help overlay component for keyboard shortcuts and tool explanations
 */
function HelpOverlay({ isVisible, onToggle }: { isVisible: boolean; onToggle: () => void }) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onToggle}>
      <Card className="max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>2D Geometry Board - Keyboard Shortcuts</CardTitle>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Drawing Tools</h4>
              <div className="space-y-1">
                <div><kbd className="bg-muted px-2 py-1 rounded">P</kbd> Point</div>
                <div><kbd className="bg-muted px-2 py-1 rounded">L</kbd> Line</div>
                <div><kbd className="bg-muted px-2 py-1 rounded">C</kbd> Circle</div>
                <div><kbd className="bg-muted px-2 py-1 rounded">R</kbd> Rectangle</div>
                <div><kbd className="bg-muted px-2 py-1 rounded">T</kbd> Triangle</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Operations</h4>
              <div className="space-y-1">
                <div><kbd className="bg-muted px-2 py-1 rounded">Del</kbd> Delete</div>
                <div><kbd className="bg-muted px-2 py-1 rounded">M</kbd> Measure</div>
                <div><kbd className="bg-muted px-2 py-1 rounded">F3</kbd> Intersections</div>
                <div><kbd className="bg-muted px-2 py-1 rounded">Esc</kbd> Clear selection</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Main EuclidSandbox component - Professional CAD-style interface
 */
export function EuclidSandbox() {
  // Core state
  const [selectedTool, setSelectedTool] = useState<ToolType>('point')
  const [elements, setElements] = useState<GeometricElement[]>([])
  const [currentConstruction, setCurrentConstruction] = useState<string | null>(null)
  const [showIntersections, setShowIntersections] = useState<boolean>(true)
  
  // UI state for floating overlays
  const [showInfoPanel, setShowInfoPanel] = useState<boolean>(false)
  const [showHelpOverlay, setShowHelpOverlay] = useState<boolean>(false)
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Initialize based on system preference or existing class
    return document.documentElement.classList.contains('dark') || 
           window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  // Initialize dark mode on component mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Classical geometric constructions
  const constructions = [
    {
      id: 'equilateral-triangle',
      name: 'Equilateral Triangle',
      steps: [
        'Draw a line segment AB',
        'Center compass at A, draw arc with radius AB',
        'Center compass at B, draw arc with same radius',
        'Connect both points to intersection C'
      ]
    },
    {
      id: 'perpendicular-bisector',
      name: 'Perpendicular Bisector',
      steps: [
        'Draw line segment AB',
        'Center compass at A, draw arc above and below line',
        'With same radius, center at B, draw intersecting arcs',
        'Connect the two intersection points'
      ]
    },
    {
      id: 'angle-bisector',
      name: 'Angle Bisector',
      steps: [
        'From angle vertex, draw arc intersecting both rays',
        'From each intersection, draw arcs with same radius',
        'Connect vertex to arc intersection point'
      ]
    },
    {
      id: 'intersection-demo',
      name: 'Intersection Demo',
      steps: [
        'Two lines are drawn intersecting',
        'Two circles are created intersecting each other',
        'Lines and circles intersect at multiple points',
        'All intersections are automatically detected'
      ]
    }
  ]

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return // Don't trigger shortcuts when typing in inputs
      }

      // Handle Ctrl combinations first
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'c':
            setSelectedTool('copy')
            break
          case 'z':
            // Undo - could be implemented later
            break
          case 'y':
            // Redo - could be implemented later
            break
          case 'a':
            // Select All - could be implemented later
            break
        }
        return
      }

      // Function keys
      if (event.key === 'F3') {
        setShowIntersections(!showIntersections)
        return
      }

      // Regular tool shortcuts (CAD-style)
      switch (event.key.toLowerCase()) {
        // Draw tools
        case 'l':
          setSelectedTool('line')
          break
        case 'c':
          setSelectedTool('circle')
          break
        case 'p':
          setSelectedTool('point')
          break
        case 't':
          setSelectedTool('triangle')
          break
        case 'b':
          setSelectedTool('perpendicular')
          break
        // Modify tools
        case 's':
          setSelectedTool('select')
          break
        case 'm':
          setSelectedTool('move')
          break
        case 'e':
          setSelectedTool('delete')
          break
        // Properties tools
        case 'r':
          if (event.shiftKey) {
            setSelectedTool('rectangle') // REC shortcut
          } else {
            setSelectedTool('rotate') // RO shortcut
          }
          break
        case 'd':
          if (event.shiftKey) {
            setSelectedTool('measure') // DI shortcut
          }
          break
        case 'a':
          if (event.shiftKey) {
            setSelectedTool('angle') // AN shortcut
          }
          break
        case 'o':
          setSelectedTool('offset')
          break
        case 'f':
          setSelectedTool('fillet')
          break
        case 'g':
          if (event.shiftKey) {
            setSelectedTool('cogwheel') // COG shortcut
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showIntersections])

  // Tool selection handler - now handles all tool groups
  const handleToolSelect = (toolId: string) => {
    // Handle all tool types including edit and measurement tools
    setSelectedTool(toolId as ToolType)
  }

  /**
   * Handle element addition from the canvas
   */
  const handleElementAdded = (element: GeometricElement) => {
    setElements(prev => [...prev, element])
  }

  /**
   * Handle canvas click events
   */
  const handleCanvasClick = (point: Point2D) => {
    console.log(`Clicked at: ${point.toString()}`)
  }

  /**
   * Demonstrate a construction by creating example elements
   */
  const demonstrateConstruction = (constructionId: string) => {
    setCurrentConstruction(constructionId)
    setElements([]) // Clear current elements
    
    switch (constructionId) {
      case 'equilateral-triangle': {
        const pointA = new Point2D(200, 300)
        const pointB = new Point2D(400, 300)
        const distance = pointA.distanceTo(pointB)
        const height = (distance * Math.sqrt(3)) / 2
        const pointC = new Point2D(300, 300 - height)
        
        const elements: GeometricElement[] = [
          {
            id: 'demo-base',
            type: 'line',
            color: '#2563eb',
            data: new Line2D(pointA, pointB)
          },
          {
            id: 'demo-circle-a',
            type: 'circle',
            color: '#10b981',
            data: new Circle2D(pointA, distance)
          },
          {
            id: 'demo-circle-b',
            type: 'circle',
            color: '#10b981',
            data: new Circle2D(pointB, distance)
          },
          {
            id: 'demo-side1',
            type: 'line',
            color: '#8b5cf6',
            data: new Line2D(pointA, pointC)
          },
          {
            id: 'demo-side2',
            type: 'line',
            color: '#8b5cf6',
            data: new Line2D(pointB, pointC)
          }
        ]
        
        setElements(elements)
        break
      }
      
      case 'perpendicular-bisector': {
        const pointA = new Point2D(200, 300)
        const pointB = new Point2D(500, 300)
        const baseLine = new Line2D(pointA, pointB)
        const bisector = GeometryUtils.perpendicularBisector(baseLine, 200)
        
        setElements([
          {
            id: 'demo-base',
            type: 'line',
            color: '#2563eb',
            data: baseLine
          },
          {
            id: 'demo-bisector',
            type: 'line',
            color: '#f59e0b',
            data: bisector
          }
        ])
        break
      }

      case 'intersection-demo': {
        const line1 = new Line2D(new Point2D(150, 200), new Point2D(550, 400))
        const line2 = new Line2D(new Point2D(150, 400), new Point2D(550, 200))
        const circle1 = new Circle2D(new Point2D(250, 250), 80)
        const circle2 = new Circle2D(new Point2D(450, 350), 70)
        
        setElements([
          {
            id: 'demo-line-1',
            type: 'line',
            color: '#2563eb',
            data: line1
          },
          {
            id: 'demo-line-2',
            type: 'line',
            color: '#ef4444',
            data: line2
          },
          {
            id: 'demo-circle-1',
            type: 'circle',
            color: '#10b981',
            data: circle1
          },
          {
            id: 'demo-circle-2',
            type: 'circle',
            color: '#f59e0b',
            data: circle2
          }
        ])
        break
      }
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar 
          selectedTool={selectedTool} 
          onToolSelect={handleToolSelect}
          onConstructionSelect={demonstrateConstruction}
          showIntersections={showIntersections}
          onToggleIntersections={() => setShowIntersections(!showIntersections)}
          currentConstruction={currentConstruction}
          showGeometryTools={true}
        />
        <SidebarInset className="flex-1 relative">
          {/* App Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4 flex-1">
              <SidebarTrigger className="-ml-1" />
              <div className="h-4 w-px bg-sidebar-border" />
              <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
                <span>Dashboard</span>
                <span>/</span>
                <span className="font-medium text-foreground">2D Geometry Board</span>
              </nav>
            </div>
            
            {/* Header controls */}
            <div className="flex items-center gap-2 px-4">
              <Button
                onClick={() => setShowHelpOverlay(!showHelpOverlay)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
              <Button
                onClick={toggleDarkMode}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </header>
          
          {/* Canvas Container */}
          <div className="flex-1 relative" style={{ height: 'calc(100vh - 4rem)' }}>
            <main className="flex-1 h-full">
              <ModularGeometryCanvas
                width={1200}
                height={800}
                selectedTool={selectedTool}
                onElementAdded={handleElementAdded}
                onCanvasClick={handleCanvasClick}
                showIntersections={showIntersections}
              />
            </main>
          </div>

          {/* Floating overlays */}
          <ConstructionOverlay 
            construction={currentConstruction ? constructions.find(c => c.id === currentConstruction) || null : null}
            onClose={() => setCurrentConstruction(null)}
          />
          
          <InfoPanel 
            elements={elements}
            selectedTool={selectedTool}
            isVisible={showInfoPanel}
            onToggle={() => setShowInfoPanel(!showInfoPanel)}
          />
          
          {/* Info Panel - Floating */}
          {showInfoPanel && (
            <Card className="absolute top-20 right-4 w-80 shadow-lg bg-background/95 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Element Information</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowInfoPanel(false)} className="h-6 w-6 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>Elements: <span className="font-medium">{elements.length}</span></div>
                    <div>Tool: <span className="font-medium capitalize">{selectedTool}</span></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help Overlay */}
          {showHelpOverlay && (
            <HelpOverlay isVisible={showHelpOverlay} onToggle={() => setShowHelpOverlay(false)} />
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
} 