/**
 * Utility functions for geometric elements
 * Provides helpers for element creation, manipulation, and validation
 */

import { Point2D, Line2D, Circle2D, Vector2D, CogWheel } from '@/lib/geometry'
import type { GeometricElement, GeometricElementType, RectangleData, TriangleData } from '@/types/geometry'
import { GEOMETRY_CONSTANTS } from '@/types/geometry'

/**
 * Generate a unique ID for geometric elements
 * Uses timestamp and random string to ensure uniqueness
 */
export function generateElementId(): string {
  return `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Check if a point already exists in the elements array
 * Uses tolerance-based comparison to handle floating point precision
 */
export function pointExists(
  point: Point2D, 
  elements: GeometricElement[], 
  tolerance: number = GEOMETRY_CONSTANTS.DEFAULT_TOLERANCE
): boolean {
  return elements.some(element => {
    if (element.type !== 'point') return false
    const elementPoint = element.data as Point2D
    return elementPoint.equals(point, tolerance)
  })
}

/**
 * Find an existing point that matches the given point within tolerance
 * Returns the existing point if found, null otherwise
 */
export function findExistingPoint(
  point: Point2D, 
  elements: GeometricElement[], 
  tolerance: number = GEOMETRY_CONSTANTS.DEFAULT_TOLERANCE
): Point2D | null {
  const existingElement = elements.find(element => {
    if (element.type !== 'point') return false
    const elementPoint = element.data as Point2D
    return elementPoint.equals(point, tolerance)
  })
  
  return existingElement ? (existingElement.data as Point2D) : null
}

/**
 * Create a new geometric element
 */
export function createElement(
  type: GeometricElementType,
  data: Point2D | Line2D | Circle2D | RectangleData | TriangleData | CogWheel,
  color: string,
  metadata?: Record<string, unknown>
): GeometricElement {
  return {
    id: generateElementId(),
    type,
    data,
    color,
    metadata
  }
}

/**
 * Add a point element only if it doesn't already exist
 * Returns the existing point if found, or creates a new one
 */
export function addPointIfNotExists(
  point: Point2D,
  elements: GeometricElement[],
  color: string,
  tolerance: number = GEOMETRY_CONSTANTS.DEFAULT_TOLERANCE
): { element: GeometricElement; isNew: boolean } {
  const existingPoint = findExistingPoint(point, elements, tolerance)
  
  if (existingPoint) {
    // Find the existing element
    const existingElement = elements.find(el => 
      el.type === 'point' && (el.data as Point2D).equals(existingPoint, tolerance)
    )!
    return { element: existingElement, isNew: false }
  }
  
  // Create new point element
  const newElement = createElement('point', point, color)
  return { element: newElement, isNew: true }
}

/**
 * Get all points from geometric elements including composite elements
 * Useful for finding snap points
 */
export function extractPointsFromElements(elements: GeometricElement[]): Point2D[] {
  const points: Point2D[] = []
  
  elements.forEach(element => {
    switch (element.type) {
      case 'point': {
        points.push(element.data as Point2D)
        break
      }
      case 'line': {
        const line = element.data as Line2D
        points.push(line.start, line.end)
        break
      }
      case 'circle': {
        const circle = element.data as Circle2D
        points.push(circle.center)
        break
      }
      case 'rectangle': {
        const rect = element.data as RectangleData
        // Add all four corners as snap points
        points.push(
          rect.topLeft,
          new Point2D(rect.bottomRight.x, rect.topLeft.y),
          rect.bottomRight,
          new Point2D(rect.topLeft.x, rect.bottomRight.y)
        )
        break
      }
      case 'triangle': {
        const triangle = element.data as TriangleData
        points.push(triangle.pointA, triangle.pointB, triangle.pointC)
        break
      }
    }
  })
  
  return points
}

/**
 * Find the nearest point to a given point from a list of points
 */
export function findNearestPoint(
  targetPoint: Point2D,
  points: Point2D[],
  maxDistance: number = GEOMETRY_CONSTANTS.DEFAULT_SNAP_DISTANCE
): Point2D | null {
  let nearestPoint: Point2D | null = null
  let nearestDistance = maxDistance
  
  points.forEach(point => {
    const distance = targetPoint.distanceTo(point)
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestPoint = point
    }
  })
  
  return nearestPoint
}

/**
 * Find element at a specific point within tolerance
 */
export function findElementAtPoint(
  point: Point2D,
  elements: GeometricElement[],
  tolerance: number = GEOMETRY_CONSTANTS.DEFAULT_TOLERANCE
): GeometricElement | null {
  for (const element of elements) {
    if (element.hidden) continue
    
    switch (element.type) {
      case 'point': {
        const elementPoint = element.data as Point2D
        if (point.distanceTo(elementPoint) <= tolerance) {
          return element
        }
        break
      }
      case 'line': {
        const line = element.data as Line2D
        if (line.distanceToPoint(point) <= tolerance) {
          return element
        }
        break
      }
      case 'circle': {
        const circle = element.data as Circle2D
        const distanceToCenter = point.distanceTo(circle.center)
        const distanceToCircumference = Math.abs(distanceToCenter - circle.radius)
        if (distanceToCircumference <= tolerance || distanceToCenter <= tolerance) {
          return element
        }
        break
      }
      case 'rectangle': {
        const rect = element.data as RectangleData
        const x = Math.min(rect.topLeft.x, rect.bottomRight.x)
        const y = Math.min(rect.topLeft.y, rect.bottomRight.y)
        const width = Math.abs(rect.bottomRight.x - rect.topLeft.x)
        const height = Math.abs(rect.bottomRight.y - rect.topLeft.y)
        
        // Check if point is on any of the four edges
        const onLeftEdge = Math.abs(point.x - x) <= tolerance && point.y >= y - tolerance && point.y <= y + height + tolerance
        const onRightEdge = Math.abs(point.x - (x + width)) <= tolerance && point.y >= y - tolerance && point.y <= y + height + tolerance
        const onTopEdge = Math.abs(point.y - y) <= tolerance && point.x >= x - tolerance && point.x <= x + width + tolerance
        const onBottomEdge = Math.abs(point.y - (y + height)) <= tolerance && point.x >= x - tolerance && point.x <= x + width + tolerance
        
        if (onLeftEdge || onRightEdge || onTopEdge || onBottomEdge) {
          return element
        }
        break
      }
      case 'triangle': {
        const triangle = element.data as TriangleData
        // Check if point is on any of the three edges
        const lineAB = new Line2D(triangle.pointA, triangle.pointB)
        const lineBC = new Line2D(triangle.pointB, triangle.pointC)
        const lineCA = new Line2D(triangle.pointC, triangle.pointA)
        
        if (lineAB.distanceToPoint(point) <= tolerance || 
            lineBC.distanceToPoint(point) <= tolerance || 
            lineCA.distanceToPoint(point) <= tolerance) {
          return element
        }
        break
      }
      case 'cogwheel': {
        const cogWheel = element.data as CogWheel
        const distanceToCenter = point.distanceTo(cogWheel.center)
        
        // Check if point is within the cog wheel's outer boundary
        if (distanceToCenter <= cogWheel.outerRadius + tolerance && 
            distanceToCenter >= cogWheel.innerRadius * 0.3 - tolerance) {
          return element
        }
        break
      }
    }
  }
  
  return null
}

/**
 * Apply offset to geometric data for copy/paste operations
 */
export function applyOffsetToGeometricData(
  data: Point2D | Line2D | Circle2D | RectangleData | TriangleData | CogWheel,
  type: GeometricElementType,
  offset: Vector2D
): Point2D | Line2D | Circle2D | RectangleData | TriangleData | CogWheel {
  switch (type) {
    case 'point': {
      return (data as Point2D).add(offset)
    }
    case 'line': {
      const line = data as Line2D
      return new Line2D(line.start.add(offset), line.end.add(offset))
    }
    case 'circle': {
      const circle = data as Circle2D
      return new Circle2D(circle.center.add(offset), circle.radius)
    }
    case 'rectangle': {
      const rect = data as RectangleData
      return {
        topLeft: rect.topLeft.add(offset),
        bottomRight: rect.bottomRight.add(offset),
        width: rect.width,
        height: rect.height
      }
    }
    case 'triangle': {
      const triangle = data as TriangleData
      return {
        pointA: triangle.pointA.add(offset),
        pointB: triangle.pointB.add(offset),
        pointC: triangle.pointC.add(offset)
      }
    }
    case 'cogwheel': {
      const cogWheel = data as CogWheel
      return new CogWheel(
        cogWheel.center.add(offset),
        cogWheel.outerRadius,
        cogWheel.innerRadius,
        cogWheel.teethCount
      )
    }
    default:
      return data
  }
}

/**
 * Clone a geometric element with a new ID and optional offset
 */
export function cloneElement(
  element: GeometricElement,
  offset?: Vector2D
): GeometricElement {
  const newData = offset 
    ? applyOffsetToGeometricData(element.data, element.type, offset)
    : element.data
    
  return {
    ...element,
    id: generateElementId(),
    data: newData
  }
}

/**
 * Filter elements by type
 */
export function filterElementsByType<T extends GeometricElementType>(
  elements: GeometricElement[],
  type: T
): GeometricElement[] {
  return elements.filter(element => element.type === type)
}

/**
 * Get visible elements (not hidden)
 */
export function getVisibleElements(elements: GeometricElement[]): GeometricElement[] {
  return elements.filter(element => !element.hidden)
}

/**
 * Get selected elements
 */
export function getSelectedElements(
  elements: GeometricElement[],
  selectedIds: string[]
): GeometricElement[] {
  return elements.filter(element => selectedIds.includes(element.id))
}

/**
 * Validate geometric data before creating elements
 */
export function validateGeometricData(
  type: GeometricElementType,
  data: Point2D | Line2D | Circle2D | RectangleData | TriangleData | CogWheel
): boolean {
  try {
    switch (type) {
      case 'point': {
        const point = data as Point2D
        return Number.isFinite(point.x) && Number.isFinite(point.y)
      }
      case 'line': {
        const line = data as Line2D
        return !line.start.equals(line.end) && line.length > 0
      }
      case 'circle': {
        const circle = data as Circle2D
        return circle.radius > 0 && Number.isFinite(circle.radius)
      }
      case 'rectangle': {
        const rect = data as RectangleData
        return rect.width > 0 && rect.height > 0
      }
      case 'triangle': {
        const triangle = data as TriangleData
        // Check that the three points don't form a degenerate triangle
        const area = Math.abs(
          (triangle.pointB.x - triangle.pointA.x) * (triangle.pointC.y - triangle.pointA.y) -
          (triangle.pointC.x - triangle.pointA.x) * (triangle.pointB.y - triangle.pointA.y)
        ) / 2
        return area > 0.001 // Minimum area threshold
      }
      case 'cogwheel': {
        const cogWheel = data as CogWheel
        return cogWheel.outerRadius > 0 && 
               cogWheel.innerRadius > 0 && 
               cogWheel.innerRadius < cogWheel.outerRadius &&
               cogWheel.teethCount >= 3 &&
               Number.isFinite(cogWheel.outerRadius) &&
               Number.isFinite(cogWheel.innerRadius)
      }
      default:
        return true
    }
  } catch {
    return false
  }
} 