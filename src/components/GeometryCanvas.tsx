/**
 * Interactive Geometry Canvas Component
 * Provides a visual interface for creating and manipulating geometric shapes
 * Uses SVG for precise geometric rendering and user interaction
 */
import React, { useState, useRef, useCallback, useMemo } from 'react'
import { Point2D, Line2D, Circle2D, GeometryUtils, Vector2D } from '@/lib/geometry'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Settings, X } from 'lucide-react'

// Types for geometric elements that can be drawn on the canvas
export type GeometricElement = {
  id: string
  type: 'point' | 'line' | 'circle' | 'perpendicular' | 'triangle' | 'rectangle'
  color: string
  data: Point2D | Line2D | Circle2D // Specific data for each type
  hidden?: boolean // For hide/show functionality
  selected?: boolean // For selection state
}

// Type for intersection information
export type IntersectionInfo = {
  point: Point2D
  elements: string[]
  type: string
}

// Canvas settings interface
interface CanvasSettings {
  gridSize: number
  scale: number
  showGrid: boolean
  showScale: boolean
}

// Props for the GeometryCanvas component
interface GeometryCanvasProps {
  width: number
  height: number
  selectedTool: string
  onElementAdded?: (element: GeometricElement) => void
  onCanvasClick?: (point: Point2D) => void
  showIntersections?: boolean // New prop to toggle intersection display
}

/**
 * Interactive geometry canvas using SVG for precise rendering
 * Supports creating points, lines, circles, and other geometric constructions
 * Includes smart intersection detection and snapping
 */
export function GeometryCanvas({ 
  width, 
  height, 
  selectedTool, 
  onElementAdded,
  onCanvasClick,
  showIntersections = true
}: GeometryCanvasProps) {
  // State for managing geometric elements on the canvas
  const [elements, setElements] = useState<GeometricElement[]>([])
  const [selectedPoints, setSelectedPoints] = useState<Point2D[]>([])
  const [hoveredPoint, setHoveredPoint] = useState<Point2D | null>(null)
  const [hoveredIntersection, setHoveredIntersection] = useState<IntersectionInfo | null>(null)
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)
  const [nextId, setNextId] = useState(1)
  
  // Selection and clipboard state
  const [selectedElements, setSelectedElements] = useState<string[]>([])
  const [clipboard, setClipboard] = useState<GeometricElement[]>([])
  const [showHidden, setShowHidden] = useState(false)
  const [dragStart, setDragStart] = useState<Point2D | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  // Canvas settings state
  const [canvasSettings, setCanvasSettings] = useState<CanvasSettings>({
    gridSize: 20,
    scale: 1,
    showGrid: true,
    showScale: true
  })
  
  // Dynamic input state
  const [showDynamicInput, setShowDynamicInput] = useState(false)
  const [dynamicDistance, setDynamicDistance] = useState<number>(100)
  const [showSettings, setShowSettings] = useState(false)
  
  // Measurement state
  const [measurementPoints, setMeasurementPoints] = useState<Point2D[]>([])
  const [showMeasurement, setShowMeasurement] = useState(false)

  // SVG reference for coordinate transformations
  const svgRef = useRef<SVGSVGElement>(null)

  /**
   * Calculate all intersection points between current elements
   * Memoized for performance as this can be expensive with many elements
   */
  const intersections = useMemo((): IntersectionInfo[] => {
    if (!showIntersections || elements.length < 2) return []
    
    return GeometryUtils.findAllIntersections(elements)
  }, [elements, showIntersections])

  /**
   * Find the nearest existing point to a given point (for snapping)
   * Now includes intersection points in the search
   * @param point Point to find nearest neighbor to
   * @param snapDistance Maximum distance for snapping
   * @returns Nearest point or null if none within snap distance
   */
  const findNearestPoint = useCallback((point: Point2D, snapDistance: number = 15): Point2D | null => {
    let nearestPoint: Point2D | null = null
    let nearestDistance = snapDistance

    // Check existing points
    elements.forEach(element => {
      if (element.type === 'point') {
        const elementPoint = element.data as Point2D
        const distance = point.distanceTo(elementPoint)
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestPoint = elementPoint
        }
      } else if (element.type === 'line') {
        const line = element.data as Line2D
        // Check both endpoints of the line
        const startDistance = point.distanceTo(line.start)
        const endDistance = point.distanceTo(line.end)
        
        if (startDistance < nearestDistance) {
          nearestDistance = startDistance
          nearestPoint = line.start
        }
        if (endDistance < nearestDistance) {
          nearestDistance = endDistance
          nearestPoint = line.end
        }
      } else if (element.type === 'circle') {
        const circle = element.data as Circle2D
        // Check center point
        const centerDistance = point.distanceTo(circle.center)
        if (centerDistance < nearestDistance) {
          nearestDistance = centerDistance
          nearestPoint = circle.center
        }
      }
    })

    // Check intersection points
    intersections.forEach(intersection => {
      const distance = point.distanceTo(intersection.point)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestPoint = intersection.point
      }
    })

    return nearestPoint
  }, [elements, intersections])

  /**
   * Find the nearest intersection to a given point
   * @param point Point to find nearest intersection to
   * @param snapDistance Maximum distance for snapping
   * @returns Nearest intersection info or null
   */
  const findNearestIntersection = useCallback((point: Point2D, snapDistance: number = 15): IntersectionInfo | null => {
    let nearestIntersection: IntersectionInfo | null = null
    let nearestDistance = snapDistance

    intersections.forEach(intersection => {
      const distance = point.distanceTo(intersection.point)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIntersection = intersection
      }
    })

    return nearestIntersection
  }, [intersections])

  /**
   * Find element at point for deletion
   */
  const findElementAtPoint = useCallback((point: Point2D, tolerance: number = 10): GeometricElement | null => {
    for (const element of elements) {
      if (element.type === 'point') {
        const elementPoint = element.data as Point2D
        if (point.distanceTo(elementPoint) <= tolerance) {
          return element
        }
      } else if (element.type === 'line') {
        const line = element.data as Line2D
        if (line.distanceToPoint(point) <= tolerance) {
          return element
        }
      } else if (element.type === 'circle') {
        const circle = element.data as Circle2D
        const distanceToCenter = point.distanceTo(circle.center)
        const distanceToCircumference = Math.abs(distanceToCenter - circle.radius)
        if (distanceToCircumference <= tolerance || distanceToCenter <= tolerance) {
          return element
        }
      }
    }
    return null
  }, [elements])

  /**
   * Add a new geometric element to the canvas
   * @param type Type of element to add
   * @param data Element-specific data
   * @param color Color for the element
   */
  const addElement = useCallback((
    type: GeometricElement['type'], 
    data: Point2D | Line2D | Circle2D, 
    color: string = '#2563eb'
  ) => {
    // Generate unique ID using timestamp and random number to prevent duplicates
    const uniqueId = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const element: GeometricElement = {
      id: uniqueId,
      type,
      color,
      data
    }
    
    setElements(prev => [...prev, element])
    setNextId(prev => prev + 1)
    onElementAdded?.(element)
  }, [nextId, onElementAdded])

  /**
   * Delete an element
   */
  const deleteElement = useCallback((elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId))
  }, [])

  /**
   * Toggle element selection
   */
  const toggleElementSelection = useCallback((elementId: string) => {
    setSelectedElements(prev => 
      prev.includes(elementId) 
        ? prev.filter(id => id !== elementId)
        : [...prev, elementId]
    )
  }, [])

  /**
   * Clear all selections
   */
  const clearSelection = useCallback(() => {
    setSelectedElements([])
  }, [])

  /**
   * Delete selected elements
   */
  const deleteSelected = useCallback(() => {
    setElements(prev => prev.filter(el => !selectedElements.includes(el.id)))
    setSelectedElements([])
  }, [selectedElements])

  /**
   * Copy selected elements to clipboard
   */
  const copySelected = useCallback(() => {
    const elementsToCopy = elements.filter(el => selectedElements.includes(el.id))
    setClipboard(elementsToCopy)
  }, [elements, selectedElements])

  /**
   * Paste elements from clipboard
   */
  const pasteElements = useCallback(() => {
    const offset = new Vector2D(20, 20) // Offset for pasted elements
    
    clipboard.forEach(element => {
      let newData = element.data
      
      // Apply offset to pasted elements
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
      
      addElement(element.type, newData, element.color)
    })
  }, [clipboard, addElement])

  /**
   * Hide selected elements
   */
  const hideSelected = useCallback(() => {
    setElements(prev => prev.map(el => 
      selectedElements.includes(el.id) ? { ...el, hidden: true } : el
    ))
    setSelectedElements([])
  }, [selectedElements])

  /**
   * Move selected elements
   */
  const moveSelected = useCallback((offset: Vector2D) => {
    setElements(prev => prev.map(el => {
      if (!selectedElements.includes(el.id)) return el
      
      let newData = el.data
      if (el.type === 'point') {
        const point = el.data as Point2D
        newData = point.add(offset)
      } else if (el.type === 'line') {
        const line = el.data as Line2D
        newData = new Line2D(line.start.add(offset), line.end.add(offset))
      } else if (el.type === 'circle') {
        const circle = el.data as Circle2D
        newData = new Circle2D(circle.center.add(offset), circle.radius)
      }
      
      return { ...el, data: newData }
    }))
  }, [selectedElements])

  /**
   * Convert screen coordinates to SVG coordinates
   * @param event Mouse event with screen coordinates
   * @returns Point in SVG coordinate system
   */
  const screenToSVG = useCallback((event: React.MouseEvent<SVGSVGElement>): Point2D => {
    const svg = svgRef.current
    if (!svg) return new Point2D(0, 0)

    // Create an SVGPoint for coordinate transformation
    const pt = svg.createSVGPoint()
    pt.x = event.clientX
    pt.y = event.clientY

    // Transform screen coordinates to SVG coordinates
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse())
    
    return new Point2D(svgP.x, svgP.y)
  }, [])

  /**
   * Handle canvas click events based on selected tool
   * @param event Mouse click event
   */
  const handleCanvasClick = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    // Use proper SVG coordinate transformation
    const canvasPoint = screenToSVG(event)
    
    // Handle select tool
    if (selectedTool === 'select') {
      const elementAtPoint = findElementAtPoint(canvasPoint)
      if (elementAtPoint) {
        if (event.ctrlKey || event.metaKey) {
          // Multi-select with Ctrl/Cmd
          toggleElementSelection(elementAtPoint.id)
        } else {
          // Single select
          setSelectedElements([elementAtPoint.id])
        }
      } else {
        // Click on empty space - clear selection
        clearSelection()
      }
      return
    }
    
    // Handle delete tool
    if (selectedTool === 'delete') {
      const elementToDelete = findElementAtPoint(canvasPoint)
      if (elementToDelete) {
        deleteElement(elementToDelete.id)
      }
      return
    }

    // Handle measurement tool
    if (selectedTool === 'measure') {
      setMeasurementPoints(prev => {
        const newPoints = [...prev, canvasPoint]
        if (newPoints.length === 2) {
          setShowMeasurement(true)
          return newPoints
        }
        return newPoints
      })
      return
    }
    
    // Snap to nearby points if available (including intersections)
    const snappedPoint = findNearestPoint(canvasPoint) || canvasPoint
    
    onCanvasClick?.(snappedPoint)

    switch (selectedTool) {
      case 'point': {
        addElement('point', snappedPoint, '#ef4444')
        break
      }

      case 'line': {
        setSelectedPoints(prev => {
          const newPoints = [...prev, snappedPoint]
          
          if (newPoints.length === 1 && showDynamicInput) {
            // One point with dynamic input - create line with specified distance
            const direction = new Vector2D(1, 0) // Default direction (horizontal)
            const endPoint = newPoints[0].add(direction.scale(dynamicDistance))
            const line = new Line2D(newPoints[0], endPoint)
            addElement('line', line, '#2563eb')
            
            // Add the endpoints as points if they don't exist
            if (!elements.some(e => e.type === 'point' && (e.data as Point2D).equals(newPoints[0]))) {
              addElement('point', newPoints[0], '#6b7280')
            }
            if (!elements.some(e => e.type === 'point' && (e.data as Point2D).equals(endPoint))) {
              addElement('point', endPoint, '#6b7280')
            }
            
            return [] // Reset selection
          } else if (newPoints.length === 2) {
            // Two points selected - create line
            const line = new Line2D(newPoints[0], newPoints[1])
            addElement('line', line, '#2563eb')
            
            // Add the endpoints as points if they don't exist
            if (!elements.some(e => e.type === 'point' && (e.data as Point2D).equals(newPoints[0]))) {
              addElement('point', newPoints[0], '#6b7280')
            }
            if (!elements.some(e => e.type === 'point' && (e.data as Point2D).equals(newPoints[1]))) {
              addElement('point', newPoints[1], '#6b7280')
            }
            
            return [] // Reset selection
          }
          
          // For single point without dynamic input, just wait for second point
          return newPoints
        })
        break
      }

      case 'circle': {
        setSelectedPoints(prev => {
          const newPoints = [...prev, snappedPoint]
          
          if (newPoints.length === 1) {
            // First point is center, show preview or use dynamic input
            if (showDynamicInput) {
              const circle = new Circle2D(newPoints[0], dynamicDistance)
              addElement('circle', circle, '#10b981')
              
              // Add center point
              if (!elements.some(e => e.type === 'point' && (e.data as Point2D).equals(newPoints[0]))) {
                addElement('point', newPoints[0], '#6b7280')
              }
              
              return [] // Reset selection
            }
            return newPoints
          } else if (newPoints.length === 2) {
            // Second point defines radius
            const center = newPoints[0]
            const radiusPoint = newPoints[1]
            const radius = center.distanceTo(radiusPoint)
            
            const circle = new Circle2D(center, radius)
            addElement('circle', circle, '#10b981')
            
            // Add center point
            if (!elements.some(e => e.type === 'point' && (e.data as Point2D).equals(center))) {
              addElement('point', center, '#6b7280')
            }
            
            return [] // Reset selection
          }
          
          return newPoints
        })
        break
      }

      case 'rectangle': {
        setSelectedPoints(prev => {
          const newPoints = [...prev, snappedPoint]
          
          if (newPoints.length === 2) {
            // Create rectangle from two diagonal points
            const p1 = newPoints[0]
            const p2 = newPoints[1]
            
            // Calculate the other two corners
            const p3 = new Point2D(p2.x, p1.y) // Top-right or bottom-right
            const p4 = new Point2D(p1.x, p2.y) // Bottom-left or top-left
            
            // Create four lines for the rectangle
            const line1 = new Line2D(p1, p3)
            const line2 = new Line2D(p3, p2)
            const line3 = new Line2D(p2, p4)
            const line4 = new Line2D(p4, p1)
            
            addElement('line', line1, '#8b5cf6')
            addElement('line', line2, '#8b5cf6')
            addElement('line', line3, '#8b5cf6')
            addElement('line', line4, '#8b5cf6')
            
            // Add corner points
            const cornerPoints = [p1, p2, p3, p4]
            cornerPoints.forEach(point => {
              if (!elements.some(e => e.type === 'point' && (e.data as Point2D).equals(point))) {
                addElement('point', point, '#6b7280')
              }
            })
            
            return [] // Reset selection
          }
          
          return newPoints
        })
        break
      }

      case 'perpendicular': {
        // Create perpendicular bisector from a line segment
        setSelectedPoints(prev => {
          const newPoints = [...prev, snappedPoint]
          
          if (newPoints.length === 2) {
            // Create perpendicular bisector from the two points
            const baseLine = new Line2D(newPoints[0], newPoints[1])
            const perpBisector = GeometryUtils.perpendicularBisector(baseLine, 150)
            
            // Add base line
            addElement('line', baseLine, '#2563eb')
            // Add perpendicular bisector
            addElement('line', perpBisector, '#f59e0b')
            
            // Add points
            if (!elements.some(e => e.type === 'point' && (e.data as Point2D).equals(newPoints[0]))) {
              addElement('point', newPoints[0], '#6b7280')
            }
            if (!elements.some(e => e.type === 'point' && (e.data as Point2D).equals(newPoints[1]))) {
              addElement('point', newPoints[1], '#6b7280')
            }
            
            return [] // Reset selection
          }
          
          return newPoints
        })
        break
      }

      case 'triangle': {
        setSelectedPoints(prev => {
          const newPoints = [...prev, snappedPoint]
          
          if (newPoints.length === 3) {
            // Create triangle with three lines
            const line1 = new Line2D(newPoints[0], newPoints[1])
            const line2 = new Line2D(newPoints[1], newPoints[2])
            const line3 = new Line2D(newPoints[2], newPoints[0])
            
            addElement('line', line1, '#8b5cf6')
            addElement('line', line2, '#8b5cf6')
            addElement('line', line3, '#8b5cf6')
            
            // Add vertices as points
            newPoints.forEach(point => {
              if (!elements.some(e => e.type === 'point' && (e.data as Point2D).equals(point))) {
                addElement('point', point, '#6b7280')
              }
            })
            
            return [] // Reset selection
          }
          
          return newPoints
        })
        break
      }
    }
  }, [selectedTool, screenToSVG, findNearestPoint, addElement, elements, onCanvasClick, findElementAtPoint, deleteElement, showDynamicInput, dynamicDistance])

  /**
   * Handle mouse move for hover effects
   * @param event Mouse move event
   */
  const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    // Use proper SVG coordinate transformation
    const canvasPoint = screenToSVG(event)
    
    const nearestPoint = findNearestPoint(canvasPoint)
    const nearestIntersection = findNearestIntersection(canvasPoint)
    const elementAtPoint = findElementAtPoint(canvasPoint)
    
    setHoveredPoint(nearestPoint)
    setHoveredIntersection(nearestIntersection)
    setHoveredElement(elementAtPoint?.id || null)
  }, [screenToSVG, findNearestPoint, findNearestIntersection, findElementAtPoint])

  /**
   * Handle mouse down for dragging
   */
  const handleMouseDown = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (selectedTool === 'select' && selectedElements.length > 0) {
      const canvasPoint = screenToSVG(event)
      setDragStart(canvasPoint)
      setIsDragging(true)
    }
  }, [selectedTool, selectedElements, screenToSVG])

  /**
   * Handle mouse up for dragging
   */
  const handleMouseUp = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging && dragStart) {
      const canvasPoint = screenToSVG(event)
      const offset = new Vector2D(
        canvasPoint.x - dragStart.x,
        canvasPoint.y - dragStart.y
      )
      
      if (offset.magnitude > 5) { // Only move if dragged more than 5 pixels
        moveSelected(offset)
      }
      
      setDragStart(null)
      setIsDragging(false)
    }
  }, [isDragging, dragStart, screenToSVG, moveSelected])

  /**
   * Clear all elements from the canvas
   */
  const clearCanvas = useCallback(() => {
    setElements([])
    setSelectedPoints([])
    setSelectedElements([])
    setClipboard([])
    setHoveredPoint(null)
    setHoveredIntersection(null)
    setMeasurementPoints([])
    setShowMeasurement(false)
    setDragStart(null)
    setIsDragging(false)
  }, [])

  // Render functions for different geometric elements
  const renderPoint = (element: GeometricElement) => {
    const point = element.data as Point2D
    const isHovered = hoveredPoint?.equals(point) || hoveredElement === element.id
    const isSelected = selectedPoints.some(p => p.equals(point)) || selectedElements.includes(element.id)
    const isHidden = element.hidden && !showHidden
    
    if (isHidden) return null
    
    return (
      <circle
        key={element.id}
        cx={point.x}
        cy={point.y}
        r={isHovered || isSelected ? 6 : 4}
        fill={element.color}
        stroke={isSelected ? '#fbbf24' : isHovered && selectedTool === 'delete' ? '#ef4444' : 'white'}
        strokeWidth={isSelected ? 2 : 1}
        className="cursor-pointer"
        opacity={element.hidden ? 0.3 : 1}
      />
    )
  }

  const renderLine = (element: GeometricElement) => {
    const line = element.data as Line2D
    const isHovered = hoveredElement === element.id
    const isSelected = selectedElements.includes(element.id)
    const isHidden = element.hidden && !showHidden
    
    if (isHidden) return null
    
    return (
      <line
        key={element.id}
        x1={line.start.x}
        y1={line.start.y}
        x2={line.end.x}
        y2={line.end.y}
        stroke={isSelected ? '#fbbf24' : isHovered && selectedTool === 'delete' ? '#ef4444' : element.color}
        strokeWidth={isSelected ? 3 : isHovered ? 3 : 2}
        className="pointer-events-none"
        opacity={element.hidden ? 0.3 : 1}
      />
    )
  }

  const renderCircle = (element: GeometricElement) => {
    const circle = element.data as Circle2D
    const isHovered = hoveredElement === element.id
    const isSelected = selectedElements.includes(element.id)
    const isHidden = element.hidden && !showHidden
    
    if (isHidden) return null
    
    return (
      <circle
        key={element.id}
        cx={circle.center.x}
        cy={circle.center.y}
        r={circle.radius}
        fill="none"
        stroke={isSelected ? '#fbbf24' : isHovered && selectedTool === 'delete' ? '#ef4444' : element.color}
        strokeWidth={isSelected ? 3 : isHovered ? 3 : 2}
        className="pointer-events-none"
        opacity={element.hidden ? 0.3 : 1}
      />
    )
  }

  /**
   * Render intersection points as special markers
   */
  const renderIntersections = () => {
    if (!showIntersections) return null

    return intersections.map((intersection, index) => {
      const isHovered = hoveredIntersection?.point.equals(intersection.point) || false
      
      return (
        <g key={`intersection-${index}`}>
          {/* Intersection point marker */}
          <circle
            cx={intersection.point.x}
            cy={intersection.point.y}
            r={isHovered ? 5 : 3}
            fill="#ff6b6b"
            stroke="white"
            strokeWidth={1.5}
            className="cursor-pointer"
            opacity={0.8}
          />
          
          {/* Enhanced hover indicator */}
          {isHovered && (
            <>
              <circle
                cx={intersection.point.x}
                cy={intersection.point.y}
                r={12}
                fill="none"
                stroke="#ff6b6b"
                strokeWidth={2}
                strokeDasharray="3,3"
                opacity={0.6}
              />
              {/* Tooltip-like indicator */}
              <rect
                x={intersection.point.x + 8}
                y={intersection.point.y - 12}
                width={80}
                height={16}
                fill="rgba(0, 0, 0, 0.8)"
                rx={2}
                className="pointer-events-none"
              />
              <text
                x={intersection.point.x + 10}
                y={intersection.point.y - 2}
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
    })
  }

  // Render preview elements for tools in progress
  const renderPreview = () => {
    if (selectedPoints.length === 0) return null

    switch (selectedTool) {
      case 'line':
        if (selectedPoints.length === 1) {
          return (
            <circle
              cx={selectedPoints[0].x}
              cy={selectedPoints[0].y}
              r={4}
              fill="#fbbf24"
              stroke="white"
              strokeWidth={1}
            />
          )
        }
        break

      case 'circle':
        if (selectedPoints.length === 1) {
          return (
            <circle
              cx={selectedPoints[0].x}
              cy={selectedPoints[0].y}
              r={4}
              fill="#10b981"
              stroke="white"
              strokeWidth={1}
            />
          )
        }
        break

      case 'rectangle':
        if (selectedPoints.length === 1) {
          return (
            <circle
              cx={selectedPoints[0].x}
              cy={selectedPoints[0].y}
              r={4}
              fill="#8b5cf6"
              stroke="white"
              strokeWidth={1}
            />
          )
        }
        break

      case 'perpendicular':
        if (selectedPoints.length === 1) {
          return (
            <circle
              cx={selectedPoints[0].x}
              cy={selectedPoints[0].y}
              r={4}
              fill="#f59e0b"
              stroke="white"
              strokeWidth={1}
            />
          )
        }
        break

      case 'triangle':
        return selectedPoints.map((point, index) => (
          <circle
            key={`preview-${index}`}
            cx={point.x}
            cy={point.y}
            r={4}
            fill="#8b5cf6"
            stroke="white"
            strokeWidth={1}
          />
        ))
    }

    return null
  }

  // Render measurement
  const renderMeasurement = () => {
    if (!showMeasurement || measurementPoints.length !== 2) return null

    const distance = measurementPoints[0].distanceTo(measurementPoints[1])
    const midpoint = new Point2D(
      (measurementPoints[0].x + measurementPoints[1].x) / 2,
      (measurementPoints[0].y + measurementPoints[1].y) / 2
    )

    return (
      <g>
        <line
          x1={measurementPoints[0].x}
          y1={measurementPoints[0].y}
          x2={measurementPoints[1].x}
          y2={measurementPoints[1].y}
          stroke="#ff6b6b"
          strokeWidth={2}
          strokeDasharray="5,5"
        />
        <circle cx={measurementPoints[0].x} cy={measurementPoints[0].y} r={3} fill="#ff6b6b" />
        <circle cx={measurementPoints[1].x} cy={measurementPoints[1].y} r={3} fill="#ff6b6b" />
        <rect
          x={midpoint.x - 25}
          y={midpoint.y - 10}
          width={50}
          height={20}
          fill="rgba(0, 0, 0, 0.8)"
          rx={4}
        />
        <text
          x={midpoint.x}
          y={midpoint.y + 4}
          fill="white"
          fontSize={12}
          textAnchor="middle"
        >
          {distance.toFixed(1)}
        </text>
      </g>
    )
  }

  return (
    <div className="relative w-full h-full p-3"> {/* Reduced padding to match sidebar */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="border border-border rounded-lg bg-background cursor-crosshair w-full h-full"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        preserveAspectRatio="xMidYMid meet" // Fixed aspect ratio
        style={{ aspectRatio: `${width}/${height}` }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Delete' || e.key === 'Backspace') {
            if (selectedElements.length > 0) {
              deleteSelected()
            }
          } else if (e.ctrlKey || e.metaKey) {
            if (e.key === 'c' || e.key === 'C') {
              e.preventDefault()
              copySelected()
            } else if (e.key === 'v' || e.key === 'V') {
              e.preventDefault()
              pasteElements()
            }
          } else if (e.key === 'h' || e.key === 'H') {
            if (selectedElements.length > 0) {
              hideSelected()
            }
          } else if (e.key === 'Escape') {
            clearSelection()
          }
        }}
      >
        {/* Grid background for better visual reference */}
        <defs>
          <pattern id="grid" width={canvasSettings.gridSize} height={canvasSettings.gridSize} patternUnits="userSpaceOnUse">
            <path d={`M ${canvasSettings.gridSize} 0 L 0 0 0 ${canvasSettings.gridSize}`} fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
          </pattern>
        </defs>
        {canvasSettings.showGrid && <rect width="100%" height="100%" fill="url(#grid)" />}
        
        {/* Scale indicators */}
        {canvasSettings.showScale && (
          <g>
            <line x1={20} y1={height - 40} x2={120} y2={height - 40} stroke="#666" strokeWidth={2} />
            <line x1={20} y1={height - 45} x2={20} y2={height - 35} stroke="#666" strokeWidth={2} />
            <line x1={120} y1={height - 45} x2={120} y2={height - 35} stroke="#666" strokeWidth={2} />
            <text x={70} y={height - 20} fill="#666" fontSize={12} textAnchor="middle">100 units</text>
          </g>
        )}
        
        {/* Render all geometric elements */}
        {elements.map(element => {
          switch (element.type) {
            case 'point':
              return renderPoint(element)
            case 'line':
              return renderLine(element)
            case 'circle':
              return renderCircle(element)
            default:
              return null
          }
        })}
        
        {/* Render intersection points */}
        {renderIntersections()}
        
        {/* Render preview elements */}
        {renderPreview()}
        
        {/* Render measurement */}
        {renderMeasurement()}
        
        {/* Render hover point highlight */}
        {hoveredPoint && !hoveredIntersection && (
          <circle
            cx={hoveredPoint.x}
            cy={hoveredPoint.y}
            r={8}
            fill="none"
            stroke="#fbbf24"
            strokeWidth={2}
            className="pointer-events-none"
          />
        )}
      </svg>
      
      {/* Canvas controls - moved to top right with proper spacing */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <Button
          onClick={() => setShowSettings(!showSettings)}
          variant="outline"
          size="sm"
          className="shadow-lg bg-background/95 backdrop-blur-sm"
        >
          <Settings className="h-4 w-4" />
        </Button>
        {selectedElements.length > 0 && (
          <>
            <Button
              onClick={deleteSelected}
              variant="outline"
              size="sm"
              className="shadow-lg bg-background/95 backdrop-blur-sm text-red-600 hover:text-red-700"
            >
              Delete ({selectedElements.length})
            </Button>
            <Button
              onClick={hideSelected}
              variant="outline"
              size="sm"
              className="shadow-lg bg-background/95 backdrop-blur-sm"
            >
              Hide
            </Button>
          </>
        )}
        {elements.some(el => el.hidden) && (
          <Button
            onClick={() => setShowHidden(!showHidden)}
            variant="outline"
            size="sm"
            className="shadow-lg bg-background/95 backdrop-blur-sm"
          >
            {showHidden ? 'Hide Hidden' : 'Show Hidden'}
          </Button>
        )}
        <Button
          onClick={clearCanvas}
          variant="outline"
          size="sm"
          className="shadow-lg bg-background/95 backdrop-blur-sm text-red-600 hover:text-red-700"
        >
          Clear
        </Button>
      </div>

      {/* Dynamic Input Panel */}
      {(selectedTool === 'line' || selectedTool === 'circle') && (
        <Card className="absolute top-4 left-4 shadow-lg bg-background/95 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="dynamic-input"
                checked={showDynamicInput}
                onChange={(e) => setShowDynamicInput(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="dynamic-input" className="text-sm">Use distance input</Label>
            </div>
            {showDynamicInput && (
              <div className="mt-2 flex items-center space-x-2">
                <Label htmlFor="distance" className="text-xs">Distance:</Label>
                <Input
                  id="distance"
                  type="number"
                  value={dynamicDistance}
                  onChange={(e) => setDynamicDistance(Number(e.target.value))}
                  className="w-20 h-6 text-xs"
                  min="1"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <Card className="absolute top-16 right-4 w-64 shadow-lg bg-background/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Canvas Settings</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)} className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show-grid"
                  checked={canvasSettings.showGrid}
                  onChange={(e) => setCanvasSettings(prev => ({ ...prev, showGrid: e.target.checked }))}
                />
                <Label htmlFor="show-grid" className="text-sm">Show Grid</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show-scale"
                  checked={canvasSettings.showScale}
                  onChange={(e) => setCanvasSettings(prev => ({ ...prev, showScale: e.target.checked }))}
                />
                <Label htmlFor="show-scale" className="text-sm">Show Scale</Label>
              </div>
              
              <div>
                <Label htmlFor="grid-size" className="text-sm">Grid Size:</Label>
                <Input
                  id="grid-size"
                  type="number"
                  value={canvasSettings.gridSize}
                  onChange={(e) => setCanvasSettings(prev => ({ ...prev, gridSize: Number(e.target.value) }))}
                  className="mt-1 h-8"
                  min="10"
                  max="50"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Measurement Panel */}
      {showMeasurement && (
        <Card className="absolute bottom-20 right-4 shadow-lg bg-background/95 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <div className="font-medium">Distance: {measurementPoints[0]?.distanceTo(measurementPoints[1])?.toFixed(2)} units</div>
                <div className="text-xs text-muted-foreground">
                  From ({measurementPoints[0]?.x.toFixed(1)}, {measurementPoints[0]?.y.toFixed(1)}) 
                  to ({measurementPoints[1]?.x.toFixed(1)}, {measurementPoints[1]?.y.toFixed(1)})
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setShowMeasurement(false)
                  setMeasurementPoints([])
                }}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Status information - moved to avoid overlap */}
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border">
        <div className="space-y-1">
          <div>Elements: {elements.length} | Intersections: {intersections.length}</div>
          <div>Tool: <span className="capitalize font-medium">{selectedTool}</span>
            {selectedPoints.length > 0 && ` | Selected Points: ${selectedPoints.length}`}
            {selectedElements.length > 0 && ` | Selected: ${selectedElements.length}`}
          </div>
          {selectedTool === 'select' && (
            <div className="text-xs opacity-75">
              Ctrl+Click: Multi-select | Del: Delete | H: Hide | Ctrl+C/V: Copy/Paste
            </div>
          )}
        </div>
      </div>

      {/* Intersection info tooltip - repositioned */}
      {hoveredIntersection && (
        <div className="absolute bottom-16 left-4 text-xs bg-black/80 text-white px-2 py-1 rounded shadow-lg">
          {hoveredIntersection.type} intersection at ({hoveredIntersection.point.x.toFixed(1)}, {hoveredIntersection.point.y.toFixed(1)})
        </div>
      )}
    </div>
  )
} 