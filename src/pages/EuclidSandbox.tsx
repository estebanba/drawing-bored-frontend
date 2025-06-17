/**
 * EuclidSandbox - Professional 2D Geometry Board
 * CAD-style interface with full-size canvas and floating controls
 * Built with React and TypeScript for mathematical visualization
 */
import { useState, useEffect, useCallback } from 'react'
import { ModularGeometryCanvas } from '@/components/canvas/ModularGeometryCanvas'
import type { GeometricElement, ToolType } from '@/types/geometry'
import { Point2D, Line2D, Circle2D, GeometryUtils } from '@/lib/geometry'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SidebarProvider, SidebarInset, useSidebar } from '@/components/ui/sidebar'

function EuclidSandboxContent() {
  const { toggleSidebar, open, openMobile } = useSidebar()
  
  // Core state
  const [selectedTool, setSelectedTool] = useState<ToolType>('point')
  const [elements, setElements] = useState<GeometricElement[]>([])
  const [currentConstruction, setCurrentConstruction] = useState<string | null>(null)
  const [showIntersections, setShowIntersections] = useState<boolean>(true)
  
  // Canvas settings state
  const [canvasSettings, setCanvasSettings] = useState({
    showGrid: true,
    showScale: true,
    snapToGrid: true,
    gridSize: 20,
    scale: 1,
    snapDistance: 15,
    tolerance: 10
  })
  
  // Dynamic input state
  const [dynamicInput, setDynamicInput] = useState({
    showDynamicInput: false,
    dynamicDistance: 100,
    dynamicAngle: 0
  })
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Initialize to light mode by default
    return false
  })
  
  // Undo/Redo state
  const [history, setHistory] = useState<GeometricElement[][]>([[]])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [isUndoRedoOperation, setIsUndoRedoOperation] = useState(false)
  
  // Save current state to history when elements change
  const saveToHistory = useCallback((elements: GeometricElement[], currentIndex: number) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1)
      newHistory.push([...elements])
      // Limit history to 50 entries
      if (newHistory.length > 50) {
        return newHistory.slice(-50)
      }
      return newHistory
    })
    setHistoryIndex(prev => prev + 1)
  }, [])

  // Effect to track element changes and save to history
  useEffect(() => {
    // Don't save to history during undo/redo operations
    if (isUndoRedoOperation) {
      setIsUndoRedoOperation(false)
      return
    }
    
    // Only save if elements actually changed
    const currentElements = JSON.stringify(elements)
    const lastHistoryElements = JSON.stringify(history[historyIndex] || [])
    
    if (currentElements !== lastHistoryElements && elements.length >= 0) {
      saveToHistory(elements, historyIndex)
    }
  }, [elements, historyIndex, history, isUndoRedoOperation, saveToHistory])

  // Undo functionality
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setIsUndoRedoOperation(true)
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setElements([...history[newIndex]])
    }
  }, [historyIndex, history])

  // Redo functionality
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setIsUndoRedoOperation(true)
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setElements([...history[newIndex]])
    }
  }, [historyIndex, history])

  /**
   * Toggle dark mode
   */
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // Apply dark mode class to document
    if (!isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Handle canvas settings changes
  const handleCanvasSettingsChange = (newSettings: Partial<typeof canvasSettings>) => {
    setCanvasSettings(prev => ({ ...prev, ...newSettings }))
  }

  // Handle dynamic input changes
  const handleDynamicInputChange = (newSettings: Partial<typeof dynamicInput>) => {
    setDynamicInput(prev => ({ ...prev, ...newSettings }))
  }

  // Initialize dark mode on component mount
  useEffect(() => {
    // Ensure light mode by default - remove dark class and set state
    document.documentElement.classList.remove('dark')
    setIsDarkMode(false)
  }, [])

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
   * Handle clear canvas
   */
  const handleClear = () => {
    setElements([])
  }

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
            if (event.shiftKey) {
              // Ctrl+Shift+Z = Redo
              event.preventDefault()
              handleRedo()
            } else {
              // Ctrl+Z = Undo
              event.preventDefault()
              handleUndo()
            }
            break
          case 'y':
            // Ctrl+Y = Redo (Windows style)
            event.preventDefault()
            handleRedo()
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
  }, [showIntersections, handleUndo, handleRedo])

  return (
    <>
      <AppSidebar 
        selectedTool={selectedTool} 
        onToolSelect={handleToolSelect}
        onConstructionSelect={demonstrateConstruction}
        showIntersections={showIntersections}
        onToggleIntersections={() => setShowIntersections(!showIntersections)}
        currentConstruction={currentConstruction}
        showGeometryTools={true}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        showInfoPanel={false}
        onToggleInfoPanel={() => {}}
        canvasSettings={canvasSettings}
        onCanvasSettingsChange={handleCanvasSettingsChange}
        dynamicInput={dynamicInput}
        onDynamicInputChange={handleDynamicInputChange}
      />
      <SidebarInset className="p-2">
        <ModularGeometryCanvas
          selectedTool={selectedTool}
          elements={elements}
          onElementAdded={handleElementAdded}
          onCanvasClick={handleCanvasClick}
          onToolSelect={setSelectedTool}
          showIntersections={showIntersections}
          onSidebarToggle={toggleSidebar}
          canvasSettings={canvasSettings}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onClear={handleClear}
          sidebarOpen={open}
          sidebarOpenMobile={openMobile}
        />
      </SidebarInset>
    </>
  )
}

/**
 * Main EuclidSandbox component - Professional CAD-style interface with sidebar provider
 */
export function EuclidSandbox() {
  return (
    <SidebarProvider defaultOpen={true}>
      <EuclidSandboxContent />
    </SidebarProvider>
  )
} 