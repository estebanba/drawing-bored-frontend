/**
 * Modular Geometry Canvas Component
 * Clean, organized version with infinite grid, pan/zoom, and professional CAD features
 * Uses custom hooks, tool handlers, and rendering components for better maintainability
 */

import React, { useRef, useCallback, useState, useEffect } from 'react'
import { Point2D, Vector2D, Line2D, Circle2D } from '@/lib/geometry'
import type { GeometryCanvasProps, ToolType, IntersectionInfo, MeasurementState, GeometricElement } from '@/types/geometry'
import { GEOMETRY_COLORS } from '@/types/geometry'
import { useCanvasState } from '@/hooks/useCanvasState'
import { useIsMobile } from '@/hooks/use-mobile'
import { ToolHandlerFactory } from '@/tools/toolHandlers'
import { ElementCollectionRenderer } from './ElementRenderer'
import { extractPointsFromElements, findNearestPoint } from '@/utils/elementUtils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ZoomIn, ZoomOut, RotateCcw, PanelLeft, X, Undo, Redo, Palette, Info, ChevronUp, ChevronDown } from 'lucide-react'
import { 
  Minus,
  Radius,
  Triangle,
  Dot,
  MousePointer,
  Move,
  Copy,
  Trash2,
  Ruler
} from 'lucide-react'

/**
 * Helper function to mirror a point across a line
 */
function mirrorPointAcrossLine(point: Point2D, mirrorLine: Line2D): Point2D {
  // Get the closest point on the line to the given point
  const closestPoint = mirrorLine.closestPointTo(point)
  
  // Mirror the point by reflecting it across the closest point
  const offset = closestPoint.subtract(point)
  return closestPoint.add(offset)
}

/**
 * Helper function to check if an element is within the selection rectangle
 * @param element - The geometric element to check
 * @param startX - Left boundary of selection rectangle
 * @param startY - Top boundary of selection rectangle  
 * @param endX - Right boundary of selection rectangle
 * @param endY - Bottom boundary of selection rectangle
 * @param isLeftToRight - true for window selection (must be entirely inside), false for crossing selection (can partially intersect)
 */
function isElementInSelection(
  element: GeometricElement, 
  startX: number, 
  startY: number, 
  endX: number, 
  endY: number, 
  isLeftToRight: boolean
): boolean {
  if (element.type === 'point') {
    const point = element.data as Point2D
    return point.x >= startX && point.x <= endX && point.y >= startY && point.y <= endY
  } else if (element.type === 'line') {
    const line = element.data as Line2D
    const startInside = line.start.x >= startX && line.start.x <= endX && line.start.y >= startY && line.start.y <= endY
    const endInside = line.end.x >= startX && line.end.x <= endX && line.end.y >= startY && line.end.y <= endY
    
    if (isLeftToRight) {
      // Window selection: both endpoints must be inside
      return startInside && endInside
    } else {
      // Crossing selection: at least one endpoint inside or line intersects rectangle
      return startInside || endInside || lineIntersectsRectangle(line, startX, startY, endX, endY)
    }
  } else if (element.type === 'circle') {
    const circle = element.data as Circle2D
    const centerInside = circle.center.x >= startX && circle.center.x <= endX && circle.center.y >= startY && circle.center.y <= endY
    
    if (isLeftToRight) {
      // Window selection: entire circle must be inside
      return circle.center.x - circle.radius >= startX && 
             circle.center.x + circle.radius <= endX &&
             circle.center.y - circle.radius >= startY && 
             circle.center.y + circle.radius <= endY
    } else {
      // Crossing selection: center inside or circle intersects rectangle
      return centerInside || circleIntersectsRectangle(circle, startX, startY, endX, endY)
    }
  }
  
  return false
}

/**
 * Helper function to check if a line intersects a rectangle
 */
function lineIntersectsRectangle(line: Line2D, left: number, top: number, right: number, bottom: number): boolean {
  // Check if line intersects any of the four rectangle edges
  const edges = [
    new Line2D(new Point2D(left, top), new Point2D(right, top)),      // top edge
    new Line2D(new Point2D(right, top), new Point2D(right, bottom)),  // right edge  
    new Line2D(new Point2D(right, bottom), new Point2D(left, bottom)), // bottom edge
    new Line2D(new Point2D(left, bottom), new Point2D(left, top))     // left edge
  ]
  
  return edges.some(edge => {
    // Use a simple line intersection check
    const x1 = line.start.x, y1 = line.start.y
    const x2 = line.end.x, y2 = line.end.y
    const x3 = edge.start.x, y3 = edge.start.y
    const x4 = edge.end.x, y4 = edge.end.y
    
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    if (Math.abs(denom) < 1e-10) return false // Lines are parallel
    
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom
    
    return t >= 0 && t <= 1 && u >= 0 && u <= 1
  })
}

/**
 * Helper function to check if a circle intersects a rectangle
 */
function circleIntersectsRectangle(circle: Circle2D, left: number, top: number, right: number, bottom: number): boolean {
  // Find the closest point on the rectangle to the circle center
  const closestX = Math.max(left, Math.min(circle.center.x, right))
  const closestY = Math.max(top, Math.min(circle.center.y, bottom))
  
  // Calculate distance from circle center to closest point on rectangle
  const distance = Math.sqrt(Math.pow(circle.center.x - closestX, 2) + Math.pow(circle.center.y - closestY, 2))
  
  return distance <= circle.radius
}

/**
 * Canvas viewport state for pan/zoom
 */
interface ViewportState {
  x: number
  y: number
  scale: number
}

/**
 * Renders infinite grid background in world coordinates
 */
function InfiniteGrid({ viewport, width, height, gridSize }: {
  viewport: ViewportState
  width: number
  height: number
  gridSize: number
}) {
  // Calculate world space bounds visible in the current viewport with padding
  const padding = gridSize * 2 // Add padding to extend grid beyond visible area
  const worldLeft = (-viewport.x / viewport.scale) - padding
  const worldTop = (-viewport.y / viewport.scale) - padding
  const worldRight = ((width - viewport.x) / viewport.scale) + padding
  const worldBottom = ((height - viewport.y) / viewport.scale) + padding
  
  // Calculate grid line positions in world coordinates
  const startX = Math.floor(worldLeft / gridSize) * gridSize
  const endX = Math.ceil(worldRight / gridSize) * gridSize
  const startY = Math.floor(worldTop / gridSize) * gridSize
  const endY = Math.ceil(worldBottom / gridSize) * gridSize
  
  const lines = []
  
  // Vertical lines
  for (let x = startX; x <= endX; x += gridSize) {
    lines.push(
      <line
        key={`v-${x}`}
        x1={x}
        y1={startY}
        x2={x}
        y2={endY}
        stroke={GEOMETRY_COLORS.GRID}
        strokeWidth={1 / viewport.scale} // Maintain consistent line width
        opacity={0.6}
      />
    )
  }
  
  // Horizontal lines
  for (let y = startY; y <= endY; y += gridSize) {
    lines.push(
      <line
        key={`h-${y}`}
        x1={startX}
        y1={y}
        x2={endX}
        y2={y}
        stroke={GEOMETRY_COLORS.GRID}
        strokeWidth={1 / viewport.scale} // Maintain consistent line width
        opacity={0.6}
      />
    )
  }

  return <g>{lines}</g>
}

/**
 * Renders intersection points with hover effects
 */
function IntersectionRenderer({ 
  intersections, 
  hoveredIntersection, 
  showIntersections,
  viewport
}: {
  intersections: IntersectionInfo[]
  hoveredIntersection: IntersectionInfo | null
  showIntersections: boolean
  viewport: ViewportState
}) {
  if (!showIntersections) return null

  return (
    <>
      {intersections.map((intersection, index) => {
        const isHovered = hoveredIntersection?.point.equals(intersection.point) || false
        
        return (
          <g key={`intersection-${index}`}>
            <circle
              cx={(intersection.point.x * viewport.scale) + viewport.x}
              cy={(intersection.point.y * viewport.scale) + viewport.y}
              r={isHovered ? 5 : 3}
              fill={GEOMETRY_COLORS.INTERSECTION}
              stroke="white"
              strokeWidth={1.5}
              className="cursor-pointer"
              opacity={0.8}
            />
            
            {isHovered && (
              <>
                <circle
                  cx={(intersection.point.x * viewport.scale) + viewport.x}
                  cy={(intersection.point.y * viewport.scale) + viewport.y}
                  r={12}
                  fill="none"
                  stroke={GEOMETRY_COLORS.INTERSECTION}
                  strokeWidth={2}
                  strokeDasharray="3,3"
                  opacity={0.6}
                />
                <rect
                  x={(intersection.point.x * viewport.scale) + viewport.x + 8}
                  y={(intersection.point.y * viewport.scale) + viewport.y - 12}
                  width={80}
                  height={16}
                  fill="rgba(0, 0, 0, 0.8)"
                  rx={2}
                  className="pointer-events-none"
                />
                <text
                  x={(intersection.point.x * viewport.scale) + viewport.x + 10}
                  y={(intersection.point.y * viewport.scale) + viewport.y - 2}
                  fill="white"
                  fontSize={10}
                  className="pointer-events-none"
                >
                  {intersection.type} intersection
                </text>
              </>
            )}
          </g>
        )
      })}
    </>
  )
}

/**
 * Renders preview elements for tools in progress
 */
function PreviewRenderer({ selectedPoints, selectedTool, moveToolState, copyToolState, windowSelectionState, viewport }: {
  selectedPoints: Point2D[]
  selectedTool: ToolType
  moveToolState?: {
    isActive: boolean
    startPoint: Point2D | null
    elementsToMove: string[]
  }
  copyToolState?: {
    isActive: boolean
    startPoint: Point2D | null
    elementsToCopy: string[]
  }
  windowSelectionState?: {
    isActive: boolean
    startPoint: Point2D | null
    endPoint: Point2D | null
    isLeftToRight: boolean
  }
  viewport: ViewportState
}) {
  const getPreviewColor = (tool: ToolType) => {
    switch (tool) {
      case 'line': return GEOMETRY_COLORS.LINE
      case 'circle': return GEOMETRY_COLORS.CIRCLE
      case 'rectangle': return GEOMETRY_COLORS.RECTANGLE
      case 'perpendicular': return GEOMETRY_COLORS.PERPENDICULAR
      case 'triangle': return GEOMETRY_COLORS.TRIANGLE
      case 'move': return GEOMETRY_COLORS.SELECTION
      case 'copy': return GEOMETRY_COLORS.GRID_SNAP
      default: return GEOMETRY_COLORS.SELECTION
    }
  }

  const previewElements = []
  
  // Preview for selected points
  if (selectedPoints.length > 0) {
    selectedPoints.forEach((point, index) => {
      previewElements.push(
        <circle
          key={`preview-${index}`}
          cx={(point.x * viewport.scale) + viewport.x}
          cy={(point.y * viewport.scale) + viewport.y}
          r={4}
          fill={getPreviewColor(selectedTool)}
          stroke="white"
          strokeWidth={1}
        />
      )
    })
  }
  
  // Preview for move tool start point
  if (moveToolState?.isActive && moveToolState.startPoint) {
    previewElements.push(
      <g key="move-start">
        <circle
          cx={(moveToolState.startPoint.x * viewport.scale) + viewport.x}
          cy={(moveToolState.startPoint.y * viewport.scale) + viewport.y}
          r={6}
          fill="none"
          stroke={GEOMETRY_COLORS.SELECTION}
          strokeWidth={2}
          strokeDasharray="4,4"
        />
        <circle
          cx={(moveToolState.startPoint.x * viewport.scale) + viewport.x}
          cy={(moveToolState.startPoint.y * viewport.scale) + viewport.y}
          r={2}
          fill={GEOMETRY_COLORS.SELECTION}
        />
      </g>
    )
  }

  // Preview for copy tool start point
  if (copyToolState?.isActive && copyToolState.startPoint) {
    previewElements.push(
      <g key="copy-start">
        <circle
          cx={(copyToolState.startPoint.x * viewport.scale) + viewport.x}
          cy={(copyToolState.startPoint.y * viewport.scale) + viewport.y}
          r={6}
          fill="none"
          stroke={GEOMETRY_COLORS.GRID_SNAP}
          strokeWidth={2}
          strokeDasharray="4,4"
        />
        <circle
          cx={(copyToolState.startPoint.x * viewport.scale) + viewport.x}
          cy={(copyToolState.startPoint.y * viewport.scale) + viewport.y}
          r={2}
          fill={GEOMETRY_COLORS.GRID_SNAP}
        />
      </g>
    )
  }

  // Preview for window selection rectangle
  if (windowSelectionState?.isActive && windowSelectionState.startPoint && windowSelectionState.endPoint) {
    const startX = Math.min(windowSelectionState.startPoint.x, windowSelectionState.endPoint.x)
    const endX = Math.max(windowSelectionState.startPoint.x, windowSelectionState.endPoint.x)
    const startY = Math.min(windowSelectionState.startPoint.y, windowSelectionState.endPoint.y)
    const endY = Math.max(windowSelectionState.startPoint.y, windowSelectionState.endPoint.y)
    
    const width = endX - startX
    const height = endY - startY
    
    // Different colors for window vs crossing selection
    const selectionColor = windowSelectionState.isLeftToRight ? GEOMETRY_COLORS.SELECTION : GEOMETRY_COLORS.GRID_SNAP
    const fillOpacity = windowSelectionState.isLeftToRight ? 0.1 : 0.05
    
    previewElements.push(
      <g key="window-selection">
        <rect
          x={(startX * viewport.scale) + viewport.x}
          y={(startY * viewport.scale) + viewport.y}
          width={width * viewport.scale}
          height={height * viewport.scale}
          fill={selectionColor}
          fillOpacity={fillOpacity}
          stroke={selectionColor}
          strokeWidth={1}
          strokeDasharray={windowSelectionState.isLeftToRight ? "5,5" : "2,2"}
        />
      </g>
    )
  }

  return <>{previewElements}</>
}

/**
 * Renders measurement display
 */
function MeasurementRenderer({ measurement, viewport }: { 
  measurement: MeasurementState
  viewport: ViewportState
}) {
  if (!measurement.showMeasurement || measurement.points.length !== 2) return null

  const distance = measurement.points[0].distanceTo(measurement.points[1])
  const midpoint = new Point2D(
    (measurement.points[0].x + measurement.points[1].x) / 2,
    (measurement.points[0].y + measurement.points[1].y) / 2
  )

  return (
    <g>
      <line
        x1={(measurement.points[0].x * viewport.scale) + viewport.x}
        y1={(measurement.points[0].y * viewport.scale) + viewport.y}
        x2={(measurement.points[1].x * viewport.scale) + viewport.x}
        y2={(measurement.points[1].y * viewport.scale) + viewport.y}
        stroke={GEOMETRY_COLORS.MEASUREMENT}
        strokeWidth={2}
        strokeDasharray="5,5"
      />
      <circle cx={(measurement.points[0].x * viewport.scale) + viewport.x} cy={(measurement.points[0].y * viewport.scale) + viewport.y} r={3} fill={GEOMETRY_COLORS.MEASUREMENT} />
      <circle cx={(measurement.points[1].x * viewport.scale) + viewport.x} cy={(measurement.points[1].y * viewport.scale) + viewport.y} r={3} fill={GEOMETRY_COLORS.MEASUREMENT} />
      <rect
        x={(midpoint.x * viewport.scale) + viewport.x - 25}
        y={(midpoint.y * viewport.scale) + viewport.y - 10}
        width={50}
        height={20}
        fill="rgba(0, 0, 0, 0.8)"
        rx={4}
      />
      <text
        x={(midpoint.x * viewport.scale) + viewport.x}
        y={(midpoint.y * viewport.scale) + viewport.y + 4}
        fill="white"
        fontSize={12}
        textAnchor="middle"
      >
        {distance.toFixed(1)}
      </text>
    </g>
  )
}

/**
 * Main Modular Geometry Canvas Component
 */
export function ModularGeometryCanvas({ 
  width: propWidth, 
  height: propHeight, 
  elements: parentElements, // Elements from parent for undo/redo
  selectedTool, 
  onElementAdded,
  onCanvasClick,
  onToolSelect,
  onClear,
  showIntersections = true,
  onSidebarToggle,
  canvasSettings: externalCanvasSettings,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  // New props for sidebar state
  sidebarOpen,
  sidebarOpenMobile
}: GeometryCanvasProps & { sidebarOpen?: boolean, sidebarOpenMobile?: boolean }) {
  const isMobile = useIsMobile()
  const [isStatusExpanded, setIsStatusExpanded] = useState(false)
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false)

  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasState = useCanvasState(showIntersections)
  
  // Sync parent elements with canvas state for undo/redo
  useEffect(() => {
    if (parentElements && parentElements !== canvasState.elements) {
      canvasState.setElements(parentElements)
    }
  }, [parentElements, canvasState])
  
  // Use external canvas settings if provided, otherwise use internal state
  const canvasSettings = externalCanvasSettings || canvasState.settings
  
  // DEBUG: Log settings to console to verify
  useEffect(() => {
    console.log('Canvas Settings Debug:', {
      snapToGrid: canvasSettings.snapToGrid,
      gridSize: canvasSettings.gridSize,
      snapDistance: canvasSettings.snapDistance
    })
  }, [canvasSettings.snapToGrid, canvasSettings.gridSize, canvasSettings.snapDistance])
  
  // Canvas dimensions - either from props or auto-detected
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: propWidth || 1200,
    height: propHeight || 800
  })
  
  // Auto-detect canvas dimensions when not provided as props
  useEffect(() => {
    if (propWidth && propHeight) {
      setCanvasDimensions({ width: propWidth, height: propHeight })
      return
    }
    
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setCanvasDimensions({
          width: rect.width,
          height: rect.height
        })
      }
    }
    
    // Initial size detection
    updateDimensions()
    
    // Set up ResizeObserver to track container size changes
    const resizeObserver = new ResizeObserver(updateDimensions)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    
    return () => {
      resizeObserver.disconnect()
    }
  }, [propWidth, propHeight])
  
  // Effect: When sidebar open/close state changes, force a resize
  useEffect(() => {
    // This effect runs when the sidebar is toggled (desktop or mobile)
    // It forces the canvas to recalculate its dimensions
    if (propWidth && propHeight) return // Don't auto-resize if fixed size
    if (!containerRef.current) return
    
    // Use a timeout to ensure the layout has updated
    const timeoutId = setTimeout(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setCanvasDimensions({ width: rect.width, height: rect.height })
      }
    }, 100)
    
    return () => clearTimeout(timeoutId)
  }, [sidebarOpen, sidebarOpenMobile])
  
  const { width, height } = canvasDimensions
  
  // Viewport state for pan/zoom
  const [viewport, setViewport] = useState<ViewportState>({
    x: 0,
    y: 0,
    scale: 1
  })
  
  // Prevent browser zoom and handle touch zoom - moved here after viewport state
  useEffect(() => {
    const svgElement = svgRef.current
    if (!svgElement) return

    let touchStartDistance = 0
    let touchStartCenter = { x: 0, y: 0 }

    const preventZoom = (e: WheelEvent) => {
      // Always prevent default and implement our own zoom
      e.preventDefault()
      e.stopPropagation()
      
      // Get mouse position relative to SVG for zoom center
      const rect = svgElement.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      const zoomCenter = new Point2D(mouseX, mouseY)
      
      // Determine zoom direction
      // For trackpad pinch (ctrlKey + wheel) or regular wheel
      const zoomDelta = e.deltaY > 0 ? -1 : 1
      const scaleFactor = zoomDelta > 0 ? 1.1 : 0.9
      
      setViewport(currentViewport => {
        const newScale = Math.max(0.1, Math.min(10, currentViewport.scale * scaleFactor))
        
        // Calculate world coordinates of zoom center
        const worldX = (zoomCenter.x - currentViewport.x) / currentViewport.scale
        const worldY = (zoomCenter.y - currentViewport.y) / currentViewport.scale
        
        return {
          scale: newScale,
          x: zoomCenter.x - (worldX * newScale),
          y: zoomCenter.y - (worldY * newScale)
        }
      })
    }

    const preventKeyboardZoom = (e: KeyboardEvent) => {
      // Only prevent browser zoom shortcuts when canvas is focused
      if (document.activeElement === svgElement && (e.ctrlKey || e.metaKey) && (
        e.key === '+' || e.key === '-' || e.key === '0' || 
        e.key === '=' || e.code === 'Equal' || e.code === 'Minus' ||
        e.code === 'Digit0'
      )) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        touchStartDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        )
        touchStartCenter = {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2
        }
        e.preventDefault()
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchStartDistance > 0) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const currentDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        )
        
        const scale = currentDistance / touchStartDistance
        if (Math.abs(scale - 1) > 0.1) { // Threshold to avoid jitter
          const zoomDelta = scale > 1 ? 1 : -1
          
          // Get SVG coordinates for zoom center
          const rect = svgElement.getBoundingClientRect()
          const svgCenterX = touchStartCenter.x - rect.left
          const svgCenterY = touchStartCenter.y - rect.top
          
          // Use current viewport state to perform zoom
          const zoomCenter = new Point2D(svgCenterX, svgCenterY)
          const scaleFactor = zoomDelta > 0 ? 1.1 : 0.9
          
          setViewport(currentViewport => {
            const newScale = Math.max(0.1, Math.min(10, currentViewport.scale * scaleFactor))
            const worldX = (zoomCenter.x - currentViewport.x) / currentViewport.scale
            const worldY = (zoomCenter.y - currentViewport.y) / currentViewport.scale
            
            return {
              scale: newScale,
              x: zoomCenter.x - (worldX * newScale),
              y: zoomCenter.y - (worldY * newScale)
            }
          })
          
          // Update start distance for next comparison
          touchStartDistance = currentDistance
        }
        
        e.preventDefault()
      }
    }

    // Add event listeners only to the SVG element and document for keyboard
    svgElement.addEventListener('wheel', preventZoom, { passive: false })
    svgElement.addEventListener('touchstart', handleTouchStart, { passive: false })
    svgElement.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('keydown', preventKeyboardZoom, { passive: false })

    return () => {
      svgElement.removeEventListener('wheel', preventZoom)
      svgElement.removeEventListener('touchstart', handleTouchStart)
      svgElement.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('keydown', preventKeyboardZoom)
    }
  }, [setViewport]) // Added proper dependency
  
  // Pan state - enhanced to track movement
  const [isPanning, setIsPanning] = useState(false)
  const [lastPanPoint, setLastPanPoint] = useState<Point2D | null>(null)
  const [mouseDownPoint, setMouseDownPoint] = useState<Point2D | null>(null)
  const [hasMouseMoved, setHasMouseMoved] = useState(false)
  
  // Move tool state
  const [moveToolState, setMoveToolState] = useState<{
    isActive: boolean
    startPoint: Point2D | null
    elementsToMove: string[]
  }>({
    isActive: false,
    startPoint: null,
    elementsToMove: []
  })
  
  // Copy tool state (similar to move tool)
  const [copyToolState, setCopyToolState] = useState<{
    isActive: boolean
    startPoint: Point2D | null
    elementsToCopy: string[]
  }>({
    isActive: false,
    startPoint: null,
    elementsToCopy: []
  })
  
  // Window selection state
  const [windowSelectionState, setWindowSelectionState] = useState<{
    isActive: boolean
    startPoint: Point2D | null
    endPoint: Point2D | null
    isLeftToRight: boolean
  }>({
    isActive: false,
    startPoint: null,
    endPoint: null,
    isLeftToRight: true
  })

  /**
   * Convert screen coordinates to world coordinates
   * Account for viewport scaling and panning
   */
  const screenToWorld = useCallback((screenPoint: Point2D): Point2D => {
    // Transform screen coordinates to world coordinates accounting for viewport
    const worldX = (screenPoint.x - viewport.x) / viewport.scale
    const worldY = (screenPoint.y - viewport.y) / viewport.scale
    return new Point2D(worldX, worldY)
  }, [viewport])

  /**
   * Get mouse position relative to SVG and convert to SVG coordinates
   */
  const getMousePosition = useCallback((event: React.MouseEvent<SVGSVGElement>): Point2D => {
    const svg = svgRef.current
    if (!svg) return new Point2D(0, 0)

    // Get mouse position relative to the page
    const pt = svg.createSVGPoint()
    pt.x = event.clientX
    pt.y = event.clientY
    
    // Transform to SVG coordinate system
    const svgPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse())
    return new Point2D(svgPoint.x, svgPoint.y)
  }, [])

  /**
   * Find nearest snap point including intersections and grid
   * Note: Intersections are always available for snapping, even when visually hidden
   */
  const findSnapPoint = useCallback((point: Point2D): Point2D => {
    // The input point is already in world coordinates
    const worldPoint = point
    
    // Grid snapping if enabled (highest priority)
    if (canvasSettings.snapToGrid) {
      const gridSize = canvasSettings.gridSize
      const snappedX = Math.round(worldPoint.x / gridSize) * gridSize
      const snappedY = Math.round(worldPoint.y / gridSize) * gridSize
      const gridSnapPoint = new Point2D(snappedX, snappedY)
      
      // Check if close enough to snap to grid (snap distance in screen space)
      const screenSnapDistance = canvasSettings.snapDistance
      const worldSnapDistance = screenSnapDistance / viewport.scale
      
      if (worldPoint.distanceTo(gridSnapPoint) <= worldSnapDistance) {
        return gridSnapPoint
      }
    }
    
    // Get all available points for snapping (secondary priority)
    const elementPoints = extractPointsFromElements(canvasState.elements)
    // Always include intersections for snapping, regardless of visibility setting
    const intersectionPoints = canvasState.intersections.map(i => i.point)
    const allPoints = [...elementPoints, ...intersectionPoints]
    
    // Find nearest point within snap distance (adjusted for zoom)
    const snapDistance = canvasSettings.snapDistance / viewport.scale
    const nearestPoint = findNearestPoint(worldPoint, allPoints, snapDistance)
    return nearestPoint || worldPoint
  }, [canvasState.elements, canvasState.intersections, canvasSettings, viewport.scale])

  /**
   * Handle zoom
   */
  const handleZoom = useCallback((delta: number, center?: Point2D) => {
    const zoomCenter = center || new Point2D(width / 2, height / 2)
    const scaleFactor = delta > 0 ? 1.1 : 0.9
    const newScale = Math.max(0.1, Math.min(10, viewport.scale * scaleFactor))
    
    // Zoom towards the center point
    const worldCenter = screenToWorld(zoomCenter)
    const newViewport = {
      scale: newScale,
      x: zoomCenter.x - (worldCenter.x * newScale),
      y: zoomCenter.y - (worldCenter.y * newScale)
    }
    
    setViewport(newViewport)
  }, [viewport, width, height, screenToWorld])

  /**
   * Handle canvas click events
   */
  const handleCanvasClick = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    // Don't handle clicks during panning OR if mouse moved significantly (drag operation)
    if (isPanning || hasMouseMoved) {
      setHasMouseMoved(false) // Reset for next interaction
      return
    }
    
    const screenPoint = getMousePosition(event)
    const worldPoint = screenToWorld(screenPoint)
    
    // Handle special tools first
    if (selectedTool === 'select') {
      const elementAtPoint = canvasState.findElementAt(worldPoint)
      if (elementAtPoint) {
        if (event.ctrlKey || event.metaKey) {
          canvasState.toggleElementSelection(elementAtPoint.id)
        } else {
          canvasState.selectElements([elementAtPoint.id])
        }
      } else {
        // Start window selection if no element at click point
        if (!windowSelectionState.isActive) {
          setWindowSelectionState({
            isActive: true,
            startPoint: worldPoint,
            endPoint: null,
            isLeftToRight: true
          })
        } else {
          // Complete window selection
          if (windowSelectionState.startPoint) {
            const startX = Math.min(windowSelectionState.startPoint.x, worldPoint.x)
            const endX = Math.max(windowSelectionState.startPoint.x, worldPoint.x)
            const startY = Math.min(windowSelectionState.startPoint.y, worldPoint.y)
            const endY = Math.max(windowSelectionState.startPoint.y, worldPoint.y)
            
            // Determine if it's left-to-right (window) or right-to-left (crossing)
            const isLeftToRight = worldPoint.x > windowSelectionState.startPoint.x
            
            // Find elements within the selection rectangle
            const selectedElementIds: string[] = []
            canvasState.elements.forEach(element => {
              if (isElementInSelection(element, startX, startY, endX, endY, isLeftToRight)) {
                selectedElementIds.push(element.id)
              }
            })
            
            // Update selection
            if (event.ctrlKey || event.metaKey) {
              // Add to existing selection
              const newSelection = [...new Set([...canvasState.selection.selectedElements, ...selectedElementIds])]
              canvasState.selectElements(newSelection)
            } else {
              // Replace selection
              canvasState.selectElements(selectedElementIds)
            }
            
            // Reset window selection
            setWindowSelectionState({
              isActive: false,
              startPoint: null,
              endPoint: null,
              isLeftToRight: true
            })
          }
        }
      }
      return
    }
    
    if (selectedTool === 'copy') {
      // Two-click copy workflow: start point -> end point
      if (!copyToolState.isActive) {
        // First click - establish which elements to copy and start point
        if (canvasState.selection.selectedElements.length === 0) {
          // No elements selected, select element at click point
          const elementAtPoint = canvasState.findElementAt(worldPoint)
          if (elementAtPoint) {
            canvasState.selectElements([elementAtPoint.id])
            setCopyToolState({
              isActive: true,
              startPoint: worldPoint,
              elementsToCopy: [elementAtPoint.id]
            })
          }
        } else {
          // Elements already selected, use click as start point
          setCopyToolState({
            isActive: true,
            startPoint: worldPoint,
            elementsToCopy: canvasState.selection.selectedElements
          })
        }
      } else {
        // Second click - end point, execute copy
        if (copyToolState.startPoint) {
          const offset = new Vector2D(
            worldPoint.x - copyToolState.startPoint.x,
            worldPoint.y - copyToolState.startPoint.y
          )
          
          // Copy each element with offset
          copyToolState.elementsToCopy.forEach(elementId => {
            const element = canvasState.elements.find(el => el.id === elementId)
            if (element) {
              let newData = element.data
              
              // Apply offset based on element type
              if (element.type === 'point') {
                const point = element.data as Point2D
                newData = point.add(offset)
              } else if (element.type === 'line') {
                const line = element.data as Line2D
                newData = new Line2D(line.start.add(offset), line.end.add(offset))
              } else if (element.type === 'circle') {
                const circle = element.data as Circle2D
                newData = new Circle2D(circle.center.add(offset), circle.radius)
              }
              
              canvasState.addElement(element.type, newData, element.color)
            }
          })
          
          // Reset copy tool state
          setCopyToolState({
            isActive: false,
            startPoint: null,
            elementsToCopy: []
          })
        }
      }
      return
    }
    
    if (selectedTool === 'array') {
      // Array tool - create multiple copies in a pattern
      if (canvasState.selection.selectedElements.length > 0) {
        // For now, create a simple linear array
        const offset = new Vector2D(50, 50)
        const copies = 3
        
        for (let i = 1; i <= copies; i++) {
          const currentOffset = offset.scale(i)
          canvasState.selection.selectedElements.forEach(elementId => {
            const element = canvasState.elements.find(el => el.id === elementId)
            if (element) {
              let newData = element.data
              
              // Apply offset based on element type
              if (element.type === 'point') {
                const point = element.data as Point2D
                newData = point.add(currentOffset)
              } else if (element.type === 'line') {
                const line = element.data as Line2D
                newData = new Line2D(line.start.add(currentOffset), line.end.add(currentOffset))
              } else if (element.type === 'circle') {
                const circle = element.data as Circle2D
                newData = new Circle2D(circle.center.add(currentOffset), circle.radius)
              }
              
              canvasState.addElement(element.type, newData, element.color)
            }
          })
        }
      }
      return
    }
    
    if (selectedTool === 'trim') {
      // Trim tool - delete segment of line between intersections
      const elementAtPoint = canvasState.findElementAt(worldPoint)
      if (elementAtPoint && elementAtPoint.type === 'line') {
        // Find intersections on this line
        const lineData = elementAtPoint.data as Line2D
        const intersectionsOnLine = canvasState.intersections.filter(intersection =>
          intersection.elements.includes(elementAtPoint.id)
        )
        
        if (intersectionsOnLine.length >= 2) {
          // Find the two closest intersections to the click point
          const sortedIntersections = intersectionsOnLine
            .map(intersection => ({
              intersection,
              distance: worldPoint.distanceTo(intersection.point)
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 2)
            .map(item => item.intersection)
          
          if (sortedIntersections.length === 2) {
            // Delete the original line
            canvasState.deleteElement(elementAtPoint.id)
            
            // Create two new line segments
            const newLine1 = new Line2D(lineData.start, sortedIntersections[0].point)
            const newLine2 = new Line2D(sortedIntersections[1].point, lineData.end)
            
            // Only add lines if they have meaningful length
            if (newLine1.length > 1) {
              canvasState.addElement('line', newLine1, elementAtPoint.color)
            }
            if (newLine2.length > 1) {
              canvasState.addElement('line', newLine2, elementAtPoint.color)
            }
          }
        }
      }
      return
    }
    
    if (selectedTool === 'mirror') {
      // Mirror tool workflow using selected elements
      if (canvasState.selection.selectedElements.length > 0) {
        // Use two clicks to define mirror axis, then mirror selected elements
        if (canvasState.selectedPoints.length === 0) {
          // First click - start of mirror axis
          canvasState.setSelectedPoints([worldPoint])
          return
        } else if (canvasState.selectedPoints.length === 1) {
          // Second click - end of mirror axis, perform mirror
          const mirrorAxis = new Line2D(canvasState.selectedPoints[0], worldPoint)
          
          // Mirror each selected element
          canvasState.selection.selectedElements.forEach(elementId => {
            const element = canvasState.elements.find(el => el.id === elementId)
            if (element) {
              let mirroredData = element.data
              
              if (element.type === 'point') {
                const point = element.data as Point2D
                mirroredData = mirrorPointAcrossLine(point, mirrorAxis)
              } else if (element.type === 'line') {
                const line = element.data as Line2D
                const mirroredStart = mirrorPointAcrossLine(line.start, mirrorAxis)
                const mirroredEnd = mirrorPointAcrossLine(line.end, mirrorAxis)
                mirroredData = new Line2D(mirroredStart, mirroredEnd)
              } else if (element.type === 'circle') {
                const circle = element.data as Circle2D
                const mirroredCenter = mirrorPointAcrossLine(circle.center, mirrorAxis)
                mirroredData = new Circle2D(mirroredCenter, circle.radius)
              }
              
              canvasState.addElement(element.type, mirroredData, element.color)
            }
          })
          
          // Add mirror axis line for reference
          canvasState.addElement('line', mirrorAxis, GEOMETRY_COLORS.PERPENDICULAR)
          canvasState.setSelectedPoints([])
        }
      } else {
        // No elements selected - prompt user to select elements first
        const elementAtPoint = canvasState.findElementAt(worldPoint)
        if (elementAtPoint) {
          canvasState.selectElements([elementAtPoint.id])
        }
      }
      return
    }
    
    if (selectedTool === 'move') {
      // Two-click move workflow: start point -> end point
      if (!moveToolState.isActive) {
        // First click - establish which elements to move and start point
        if (canvasState.selection.selectedElements.length === 0) {
          // No elements selected, select element at click point
          const elementAtPoint = canvasState.findElementAt(worldPoint)
          if (elementAtPoint) {
            canvasState.selectElements([elementAtPoint.id])
            setMoveToolState({
              isActive: true,
              startPoint: worldPoint,
              elementsToMove: [elementAtPoint.id]
            })
          }
        } else {
          // Elements already selected, use click as start point
          setMoveToolState({
            isActive: true,
            startPoint: worldPoint,
            elementsToMove: canvasState.selection.selectedElements
          })
        }
      } else {
        // Second click - end point, execute move
        if (moveToolState.startPoint) {
          const offset = new Vector2D(
            worldPoint.x - moveToolState.startPoint.x,
            worldPoint.y - moveToolState.startPoint.y
          )
          canvasState.moveSelectedElements(offset)
          
          // Reset move tool state
          setMoveToolState({
            isActive: false,
            startPoint: null,
            elementsToMove: []
          })
        }
      }
      return
    }
    
    if (selectedTool === 'delete') {
      const elementToDelete = canvasState.findElementAt(worldPoint)
      if (elementToDelete) {
        canvasState.deleteElement(elementToDelete.id)
      }
      return
    }

    if (selectedTool === 'measure') {
      canvasState.addMeasurementPoint(worldPoint)
      return
    }
    
    // Snap to nearby points (in world coordinates)
    const snappedPoint = findSnapPoint(worldPoint)
    onCanvasClick?.(snappedPoint)

    // Handle geometry creation tools using the modular tool handlers
    const toolHandler = ToolHandlerFactory.getHandler(selectedTool)
    if (toolHandler) {
      const result = toolHandler.handle({
        canvasPoint: snappedPoint,
        elements: canvasState.elements,
        selectedPoints: canvasState.selectedPoints,
        settings: canvasSettings,
        dynamicInput: canvasState.dynamicInput,
        addElement: (type, data, color) => {
          const element = canvasState.addElement(type, data, color)
          onElementAdded?.(element)
        },
        setSelectedPoints: canvasState.setSelectedPoints
      })

      // Update selected points based on tool handler result
      if (result.newSelectedPoints !== undefined) {
        canvasState.setSelectedPoints(result.newSelectedPoints)
      }
    }
  }, [isPanning, hasMouseMoved, getMousePosition, selectedTool, canvasState, findSnapPoint, onCanvasClick, onElementAdded, moveToolState, copyToolState, windowSelectionState, canvasSettings])

  /**
   * Handle mouse move for hover effects and panning
   */
  const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    const screenPoint = getMousePosition(event)
    
    // Check if mouse moved significantly from down point
    if (mouseDownPoint && !isPanning) {
      const distance = Math.sqrt(
        Math.pow(screenPoint.x - mouseDownPoint.x, 2) + 
        Math.pow(screenPoint.y - mouseDownPoint.y, 2)
      )
      if (distance > 5) { // 5 pixel threshold
        setHasMouseMoved(true)
      }
    }
    
    // Handle panning
    if (isPanning && lastPanPoint) {
      const deltaX = screenPoint.x - lastPanPoint.x
      const deltaY = screenPoint.y - lastPanPoint.y
      
      setViewport(prev => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }))
      
      setLastPanPoint(screenPoint)
      return
    }
    
    const worldPoint = screenToWorld(screenPoint)
    
    // Handle window selection tracking
    if (selectedTool === 'select' && windowSelectionState.isActive && windowSelectionState.startPoint) {
      setWindowSelectionState(prev => ({
        ...prev,
        endPoint: worldPoint,
        isLeftToRight: worldPoint.x > prev.startPoint!.x
      }))
    }
    
    // Find what's being hovered
    const elementAtPoint = canvasState.findElementAt(worldPoint)
    const elementPoints = extractPointsFromElements(canvasState.elements)
    const snapDistance = canvasSettings.snapDistance / viewport.scale
    const nearestPoint = findNearestPoint(worldPoint, elementPoints, snapDistance)
    const nearestIntersection = canvasState.intersections.find(i => 
      worldPoint.distanceTo(i.point) <= snapDistance
    )
    
    // Check for grid snap point if grid snapping is enabled
    let hoveredGridPoint: Point2D | null = null
    if (canvasSettings.snapToGrid) {
      const gridSize = canvasSettings.gridSize
      const snappedX = Math.round(worldPoint.x / gridSize) * gridSize
      const snappedY = Math.round(worldPoint.y / gridSize) * gridSize
      const gridSnapPoint = new Point2D(snappedX, snappedY)
      
      // Check if close enough to show grid snap preview
      const screenSnapDistance = canvasSettings.snapDistance
      const worldSnapDistance = screenSnapDistance / viewport.scale
      const distance = worldPoint.distanceTo(gridSnapPoint)
      
      if (distance <= worldSnapDistance) {
        hoveredGridPoint = gridSnapPoint
      }
    }
    
    canvasState.updateHover({
      hoveredPoint: nearestPoint,
      hoveredIntersection: nearestIntersection || null,
      hoveredElement: elementAtPoint?.id || null,
      hoveredGridPoint
    })
  }, [getMousePosition, mouseDownPoint, isPanning, lastPanPoint, screenToWorld, canvasState, viewport.scale, selectedTool, windowSelectionState, canvasSettings])

  /**
   * Handle mouse down for drag operations and panning
   */
  const handleMouseDown = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    const screenPoint = getMousePosition(event)
    
    // Record mouse down point for movement tracking
    setMouseDownPoint(screenPoint)
    setHasMouseMoved(false)
    
    // Middle mouse button or space+click for panning
    if (event.button === 1 || (event.button === 0 && event.shiftKey)) {
      setIsPanning(true)
      setLastPanPoint(screenPoint)
      return
    }
    
    if (selectedTool === 'select' && canvasState.selection.selectedElements.length > 0) {
      const worldPoint = screenToWorld(screenPoint)
      canvasState.startDrag(worldPoint, canvasState.selection.selectedElements)
    }
  }, [getMousePosition, selectedTool, canvasState, screenToWorld])

  /**
   * Handle mouse up for drag operations and panning
   */
  const handleMouseUp = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    // Reset mouse tracking
    setMouseDownPoint(null)
    
    // End panning
    if (isPanning) {
      setIsPanning(false)
      setLastPanPoint(null)
      return
    }
    
    if (canvasState.drag.isDragging) {
      const screenPoint = getMousePosition(event)
      const worldPoint = screenToWorld(screenPoint)
      canvasState.endDrag(worldPoint, (_elementIds, offset) => {
        canvasState.moveSelectedElements(offset)
      })
    }
  }, [isPanning, canvasState, getMousePosition, screenToWorld])

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = useCallback((event: React.KeyboardEvent<SVGSVGElement>) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (canvasState.selection.selectedElements.length > 0) {
        canvasState.deleteSelectedElements()
      }
    } else if (event.ctrlKey || event.metaKey) {
      if (event.key === 'c' || event.key === 'C') {
        event.preventDefault()
        canvasState.copySelected()
      } else if (event.key === 'v' || event.key === 'V') {
        event.preventDefault()
        canvasState.pasteElements(canvasState.addElement)
      } else if (event.key === 'z' || event.key === 'Z') {
        event.preventDefault()
        if (event.shiftKey) {
          // Ctrl+Shift+Z = Redo
          onRedo?.()
        } else {
          // Ctrl+Z = Undo
          onUndo?.()
        }
      } else if (event.key === 'y' || event.key === 'Y') {
        event.preventDefault()
        // Ctrl+Y = Redo (Windows style)
        onRedo?.()
      } else if (event.key === 'h' || event.key === 'H') {
        if (canvasState.selection.selectedElements.length > 0) {
          canvasState.hideSelected(canvasState.updateElement)
        }
      } else if (event.key === 'Escape') {
        // Cancel any active tool states
        if (windowSelectionState.isActive) {
          setWindowSelectionState({
            isActive: false,
            startPoint: null,
            endPoint: null,
            isLeftToRight: true
          })
        } else if (moveToolState.isActive) {
          setMoveToolState({
            isActive: false,
            startPoint: null,
            elementsToMove: []
          })
        } else if (copyToolState.isActive) {
          setCopyToolState({
            isActive: false,
            startPoint: null,
            elementsToCopy: []
          })
        } else {
          canvasState.clearSelection()
        }
      }
    }
  }, [canvasState, windowSelectionState, moveToolState, copyToolState, onUndo, onRedo])

  // Mobile drawing tools data
  const mobileDrawingTools = [
    { id: 'point', name: 'Point', icon: Dot },
    { id: 'line', name: 'Line', icon: Minus },
    { id: 'circle', name: 'Circle', icon: Radius },
    { id: 'triangle', name: 'Triangle', icon: Triangle },
    { id: 'select', name: 'Select', icon: MousePointer },
    { id: 'move', name: 'Move', icon: Move },
    { id: 'copy', name: 'Copy', icon: Copy },
    { id: 'delete', name: 'Delete', icon: Trash2 },
    { id: 'measure', name: 'Measure', icon: Ruler },
  ]

  /**
   * Reset viewport to default
   */
  const resetViewport = useCallback(() => {
    setViewport({ 
      x: 0, 
      y: 0, 
      scale: 1 
    })
  }, [])

  return (
    <div
      className="w-full h-full rounded-xl border border-sidebar-border shadow-sm bg-background overflow-hidden"
      ref={containerRef}
      style={{ 
        minHeight: '100%', 
        maxHeight: 'calc(100vh - 1rem)', // Account for SidebarInset p-2 padding (0.5rem top + 0.5rem bottom)
        height: 'calc(100vh - 1rem)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="cursor-crosshair flex-1"
        tabIndex={0}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
        onKeyDown={handleKeyDown}
        style={{ outline: 'none', display: 'block', minHeight: 0 }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill={GEOMETRY_COLORS.LINE}
            />
          </marker>
        </defs>
        <g transform={`translate(${viewport.x}, ${viewport.y}) scale(${viewport.scale})`}>
          {canvasSettings.showGrid && (
            <InfiniteGrid
              viewport={viewport}
              width={width}
              height={height}
              gridSize={canvasSettings.gridSize}
            />
          )}
          <ElementCollectionRenderer
            elements={canvasState.elements}
            hoveredElement={canvasState.hover.hoveredElement}
            selectedElements={canvasState.selection.selectedElements}
            showHidden={canvasState.selection.showHidden}
            selectedTool={selectedTool}
          />
          {showIntersections && (
            <IntersectionRenderer
              intersections={canvasState.intersections}
              hoveredIntersection={canvasState.hover.hoveredIntersection}
              showIntersections={showIntersections}
              viewport={viewport}
            />
          )}
          <PreviewRenderer
            selectedPoints={canvasState.selectedPoints}
            selectedTool={selectedTool}
            moveToolState={moveToolState}
            copyToolState={copyToolState}
            windowSelectionState={windowSelectionState}
            viewport={viewport}
          />
          <MeasurementRenderer
            measurement={canvasState.measurement}
            viewport={viewport}
          />
        </g>
        
        {/* Grid snap preview - render in screen coordinates outside the transform */}
        {canvasState.hover.hoveredGridPoint && canvasSettings.snapToGrid && (
          <g>
            <circle
              cx={(canvasState.hover.hoveredGridPoint.x * viewport.scale) + viewport.x}
              cy={(canvasState.hover.hoveredGridPoint.y * viewport.scale) + viewport.y}
              r={6}
              fill={GEOMETRY_COLORS.GRID_SNAP}
              stroke="#ffffff"
              strokeWidth={2}
              opacity={1}
            />
            <circle
              cx={(canvasState.hover.hoveredGridPoint.x * viewport.scale) + viewport.x}
              cy={(canvasState.hover.hoveredGridPoint.y * viewport.scale) + viewport.y}
              r={12}
              fill="none"
              stroke={GEOMETRY_COLORS.GRID_SNAP}
              strokeWidth={1}
              strokeDasharray="4,4"
              opacity={0.5}
            />
          </g>
        )}
      </svg>
      
      {/* Control buttons - moved to left side next to sidebar */}
      <div className="absolute top-4 left-4 flex flex-col space-y-2 z-10">
        <Button
          onClick={() => {
            // Use the proper sidebar toggle function
            onSidebarToggle?.()
          }}
          variant="outline"
          size="sm"
          className="shadow-lg bg-background/95 backdrop-blur-sm w-8 h-8 p-0"
          title="Toggle Sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => onUndo?.()}
          disabled={!canUndo}
          variant="outline"
          size="sm"
          className="shadow-lg bg-background/95 backdrop-blur-sm w-8 h-8 p-0"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => onRedo?.()}
          disabled={!canRedo}
          variant="outline"
          size="sm"
          className="shadow-lg bg-background/95 backdrop-blur-sm w-8 h-8 p-0"
          title="Redo (Ctrl+Y / Ctrl+Shift+Z)"
        >
          <Redo className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => handleZoom(1, new Point2D(width / 2, height / 2))}
          variant="outline"
          size="sm"
          className="shadow-lg bg-background/95 backdrop-blur-sm w-8 h-8 p-0"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => handleZoom(-1, new Point2D(width / 2, height / 2))}
          variant="outline"
          size="sm"
          className="shadow-lg bg-background/95 backdrop-blur-sm w-8 h-8 p-0"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          onClick={resetViewport}
          variant="outline"
          size="sm"
          className="shadow-lg bg-background/95 backdrop-blur-sm w-8 h-8 p-0"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Canvas controls - moved to right side */}
      <div className="absolute top-4 right-4 flex space-x-2">
        {canvasState.selection.selectedElements.length > 0 && (
          <>
            <Button
              onClick={canvasState.deleteSelectedElements}
              variant="outline"
              size="sm"
              className="shadow-lg bg-background/95 backdrop-blur-sm text-red-600 hover:text-red-700"
            >
              Delete ({canvasState.selection.selectedElements.length})
            </Button>
            <Button
              onClick={() => canvasState.hideSelected(canvasState.updateElement)}
              variant="outline"
              size="sm"
              className="shadow-lg bg-background/95 backdrop-blur-sm"
            >
              Hide
            </Button>
          </>
        )}
        {canvasState.elements.some(el => el.hidden) && (
          <Button
            onClick={canvasState.toggleShowHidden}
            variant="outline"
            size="sm"
            className="shadow-lg bg-background/95 backdrop-blur-sm"
          >
            {canvasState.selection.showHidden ? 'Hide Hidden' : 'Show Hidden'}
          </Button>
        )}
        <Button
          onClick={() => {
            // Use parent callback if available, otherwise fallback to internal state
            if (onClear) {
              onClear()
            } else {
              canvasState.clearElements()
            }
          }}
          variant="outline"
          size="sm"
          className="shadow-lg bg-background/95 backdrop-blur-sm text-red-600 hover:text-red-700"
        >
          Clear
        </Button>
      </div>

      {/* Mobile Floating Drawing Tools */}
      {isMobile && (
        <div className="absolute bottom-4 right-4 z-20">
          {/* Floating Action Button */}
          <Button
            onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
            className="w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
            size="lg"
          >
            <Palette className="h-6 w-6" />
          </Button>
          
          {/* Tools Menu */}
          {isToolsMenuOpen && (
            <Card className="absolute bottom-16 right-0 mb-2 shadow-lg bg-background/95 backdrop-blur-sm">
              <CardContent className="p-2">
                <div className="grid grid-cols-3 gap-2 w-48">
                  {mobileDrawingTools.map((tool) => {
                    const IconComponent = tool.icon
                    return (
                      <Button
                        key={tool.id}
                        onClick={() => {
                          // Call parent's tool selection handler
                          if (onToolSelect) {
                            onToolSelect(tool.id as ToolType)
                          }
                          setIsToolsMenuOpen(false)
                        }}
                        variant={selectedTool === tool.id ? "default" : "outline"}
                        size="sm"
                        className="flex flex-col items-center justify-center h-12 w-12 p-1"
                        title={tool.name}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="text-xs mt-1 leading-none">{tool.name}</span>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Measurement Panel */}
      {canvasState.measurement.showMeasurement && (
        <Card className="absolute bottom-20 right-4 shadow-lg bg-background/95 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <div className="font-medium">Distance: {canvasState.measurement.distance?.toFixed(2)} units</div>
                <div className="text-xs text-muted-foreground">
                  From ({canvasState.measurement.points[0]?.x.toFixed(1)}, {canvasState.measurement.points[0]?.y.toFixed(1)}) 
                  to ({canvasState.measurement.points[1]?.x.toFixed(1)}, {canvasState.measurement.points[1]?.y.toFixed(1)})
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={canvasState.clearMeasurement}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Status information - Expandable on mobile */}
      <div className={`absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/90 backdrop-blur-sm rounded-lg shadow-lg border ${
        isMobile ? 'left-4 right-4' : ''
      }`}>
        {isMobile ? (
          <>
            {/* Mobile collapsed status bar */}
            <div 
              className="flex items-center justify-between px-3 py-2 cursor-pointer"
              onClick={() => setIsStatusExpanded(!isStatusExpanded)}
            >
              <div className="flex items-center space-x-2">
                <Info className="h-3 w-3" />
                <span className="font-medium">Tool: {selectedTool}</span>
                <span>({canvasState.elements.length})</span>
              </div>
              {isStatusExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
            </div>
            
            {/* Expanded status details */}
            {isStatusExpanded && (
              <div className="px-3 pb-2 space-y-1 border-t border-border/50 pt-2">
                <div>Elements: {canvasState.elements.length} | Intersections: {canvasState.intersections.length}</div>
                <div>Tool: <span className="capitalize font-medium">{selectedTool}</span>
                  {canvasState.selectedPoints.length > 0 && ` | Selected Points: ${canvasState.selectedPoints.length}`}
                  {canvasState.selection.selectedElements.length > 0 && ` | Selected: ${canvasState.selection.selectedElements.length}`}
                </div>
                <div>Zoom: {(viewport.scale * 100).toFixed(0)}% | Pan: ({viewport.x.toFixed(0)}, {viewport.y.toFixed(0)})
                  {canvasSettings.snapToGrid && <span className="text-green-600 font-medium"> | Grid Snap ON</span>}
                  {canvasSettings.showScale && <span className="text-blue-600 font-medium"> | Scale: {(100 / viewport.scale).toFixed(0)} units</span>}
                </div>
                {/* Debug info for grid snap */}
                <div className="text-xs opacity-75 text-yellow-600">
                  Debug: snapToGrid={canvasSettings.snapToGrid ? 'true' : 'false'} | 
                  gridSize={canvasSettings.gridSize} | 
                  snapDistance={canvasSettings.snapDistance} | 
                  hoveredGridPoint={canvasState.hover.hoveredGridPoint ? 'YES' : 'NO'}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Desktop full status panel */
          <div className="px-3 py-2">
            <div className="space-y-1">
              <div>Elements: {canvasState.elements.length} | Intersections: {canvasState.intersections.length}</div>
              <div>Tool: <span className="capitalize font-medium">{selectedTool}</span>
                {canvasState.selectedPoints.length > 0 && ` | Selected Points: ${canvasState.selectedPoints.length}`}
                {canvasState.selection.selectedElements.length > 0 && ` | Selected: ${canvasState.selection.selectedElements.length}`}
              </div>
              <div>Zoom: {(viewport.scale * 100).toFixed(0)}% | Pan: ({viewport.x.toFixed(0)}, {viewport.y.toFixed(0)})
                {canvasSettings.snapToGrid && <span className="text-green-600 font-medium"> | Grid Snap ON</span>}
                {canvasSettings.showScale && <span className="text-blue-600 font-medium"> | Scale: {(100 / viewport.scale).toFixed(0)} units</span>}
              </div>
              {/* Debug info for grid snap */}
              <div className="text-xs opacity-75 text-yellow-600">
                Debug: snapToGrid={canvasSettings.snapToGrid ? 'true' : 'false'} | 
                gridSize={canvasSettings.gridSize} | 
                snapDistance={canvasSettings.snapDistance} | 
                hoveredGridPoint={canvasState.hover.hoveredGridPoint ? 'YES' : 'NO'}
              </div>
              {selectedTool === 'select' && (
                <div className="text-xs opacity-75">
                  Ctrl+Click: Multi-select | Del: Delete | H: Hide | Ctrl+C/V: Copy/Paste
                </div>
              )}
              {selectedTool === 'move' && (
                <div className="text-xs opacity-75">
                  {moveToolState.isActive 
                    ? `Click end point to move ${moveToolState.elementsToMove.length} element(s)` 
                    : 'Click element or start point to begin move'}
                </div>
              )}
              {selectedTool === 'copy' && (
                <div className="text-xs opacity-75">
                  {copyToolState.isActive 
                    ? `Click end point to copy ${copyToolState.elementsToCopy.length} element(s)` 
                    : 'Click element or start point to begin copy'}
                </div>
              )}
              {selectedTool === 'array' && (
                <div className="text-xs opacity-75">
                  Select elements first, then click Array to create multiple copies
                </div>
              )}
              {selectedTool === 'trim' && (
                <div className="text-xs opacity-75">
                  Click on line segment between intersections to trim
                </div>
              )}
              {selectedTool === 'mirror' && (
                <div className="text-xs opacity-75">
                  {canvasState.selection.selectedElements.length > 0
                    ? (canvasState.selectedPoints.length === 0 
                      ? 'Click first point of mirror axis'
                      : 'Click second point of mirror axis to mirror elements')
                    : 'Select elements first, then define mirror axis'}
                </div>
              )}
              {selectedTool === 'fillet' && (
                <div className="text-xs opacity-75">
                  Click two points to create a fillet with current radius
                </div>
              )}
              {selectedTool === 'cogwheel' && (
                <div className="text-xs opacity-75">
                  {canvasState.selectedPoints.length === 0 
                    ? 'Click center point for cog wheel'
                    : 'Click to set outer radius and create cog wheel'}
                </div>
              )}
              {selectedTool === 'select' && (
                <div className="text-xs opacity-75">
                  {windowSelectionState.isActive 
                    ? `Drag to complete ${windowSelectionState.isLeftToRight ? 'window' : 'crossing'} selection` 
                    : 'Click element or drag rectangle to select | Ctrl+Click: Multi-select | Del: Delete | H: Hide | Ctrl+C/V: Copy/Paste'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Intersection info tooltip */}
      {canvasState.hover.hoveredIntersection && (
        <div className="absolute bottom-16 left-4 text-xs bg-black/80 text-white px-2 py-1 rounded shadow-lg">
          {canvasState.hover.hoveredIntersection.type} intersection at ({canvasState.hover.hoveredIntersection.point.x.toFixed(1)}, {canvasState.hover.hoveredIntersection.point.y.toFixed(1)})
        </div>
      )}
    </div>
  )
}