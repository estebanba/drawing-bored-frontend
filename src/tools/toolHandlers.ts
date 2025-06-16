/**
 * Tool Handlers - Modular tool implementation for the geometry canvas
 * Each tool has its own handler class that implements the ToolHandler interface
 * This provides a clean separation of concerns and makes tools easily extensible
 */

import { Point2D, Line2D, Circle2D, Vector2D, GeometryUtils, CogWheel } from '@/lib/geometry'
import type { ToolHandlerProps, ToolHandlerResult, RectangleData, TriangleData } from '@/types/geometry'
import { GEOMETRY_COLORS } from '@/types/geometry'
import { 
  addPointIfNotExists
} from '@/utils/elementUtils'

/**
 * Base interface for tool handlers
 */
interface ToolHandler {
  handle(props: ToolHandlerProps): ToolHandlerResult
}

/**
 * Point tool handler - creates individual points
 */
export class PointToolHandler implements ToolHandler {
  handle({ canvasPoint, elements, addElement }: ToolHandlerProps): ToolHandlerResult {
    // Use utility function to prevent duplicates
    const { element, isNew } = addPointIfNotExists(
      canvasPoint, 
      elements, 
      GEOMETRY_COLORS.POINT
    )
    
    if (isNew) {
      addElement('point', element.data, element.color)
    }
    
    return { shouldContinue: false }
  }
}

/**
 * Line tool handler - creates lines between two points
 */
export class LineToolHandler implements ToolHandler {
  handle({ 
    canvasPoint, 
    elements, 
    selectedPoints, 
    dynamicInput, 
    addElement
  }: ToolHandlerProps): ToolHandlerResult {
    const newPoints = [...selectedPoints, canvasPoint]
    
    if (newPoints.length === 1 && dynamicInput.showDynamicInput) {
      // Single point with dynamic input - create horizontal line
      const direction = new Vector2D(1, 0)
      const endPoint = newPoints[0].add(direction.scale(dynamicInput.dynamicDistance))
      const line = new Line2D(newPoints[0], endPoint)
      
      // Add line
      addElement('line', line, GEOMETRY_COLORS.LINE)
      
      // Add endpoints if they don't exist
      const startResult = addPointIfNotExists(newPoints[0], elements, GEOMETRY_COLORS.POINT)
      const endResult = addPointIfNotExists(endPoint, elements, GEOMETRY_COLORS.POINT)
      
      if (startResult.isNew) {
        addElement('point', startResult.element.data, startResult.element.color)
      }
      if (endResult.isNew) {
        addElement('point', endResult.element.data, endResult.element.color)
      }
      
      return { shouldContinue: false, newSelectedPoints: [] }
    } else if (newPoints.length === 2) {
      // Two points - create line
      const line = new Line2D(newPoints[0], newPoints[1])
      addElement('line', line, GEOMETRY_COLORS.LINE)
      
      // Add endpoints if they don't exist
      const startResult = addPointIfNotExists(newPoints[0], elements, GEOMETRY_COLORS.POINT)
      const endResult = addPointIfNotExists(newPoints[1], elements, GEOMETRY_COLORS.POINT)
      
      if (startResult.isNew) {
        addElement('point', startResult.element.data, startResult.element.color)
      }
      if (endResult.isNew) {
        addElement('point', endResult.element.data, endResult.element.color)
      }
      
      return { shouldContinue: false, newSelectedPoints: [] }
    }
    
    // Continue collecting points
    return { shouldContinue: true, newSelectedPoints: newPoints }
  }
}

/**
 * Circle tool handler - creates circles with center and radius
 */
export class CircleToolHandler implements ToolHandler {
  handle({ 
    canvasPoint, 
    elements, 
    selectedPoints, 
    dynamicInput, 
    addElement
  }: ToolHandlerProps): ToolHandlerResult {
    const newPoints = [...selectedPoints, canvasPoint]
    
    if (newPoints.length === 1 && dynamicInput.showDynamicInput) {
      // Single point with dynamic input - create circle with specified radius
      const circle = new Circle2D(newPoints[0], dynamicInput.dynamicDistance)
      addElement('circle', circle, GEOMETRY_COLORS.CIRCLE)
      
      // Add center point if it doesn't exist
      const centerResult = addPointIfNotExists(newPoints[0], elements, GEOMETRY_COLORS.POINT)
      if (centerResult.isNew) {
        addElement('point', centerResult.element.data, centerResult.element.color)
      }
      
      return { shouldContinue: false, newSelectedPoints: [] }
    } else if (newPoints.length === 2) {
      // Two points - center and radius point
      const center = newPoints[0]
      const radiusPoint = newPoints[1]
      const radius = center.distanceTo(radiusPoint)
      
      const circle = new Circle2D(center, radius)
      addElement('circle', circle, GEOMETRY_COLORS.CIRCLE)
      
      // Add center point if it doesn't exist
      const centerResult = addPointIfNotExists(center, elements, GEOMETRY_COLORS.POINT)
      if (centerResult.isNew) {
        addElement('point', centerResult.element.data, centerResult.element.color)
      }
      
      return { shouldContinue: false, newSelectedPoints: [] }
    }
    
    // Continue collecting points
    return { shouldContinue: true, newSelectedPoints: newPoints }
  }
}

/**
 * Rectangle tool handler - creates a single rectangle entity
 */
export class RectangleToolHandler implements ToolHandler {
  handle(props: ToolHandlerProps): ToolHandlerResult {
    const { canvasPoint, selectedPoints, addElement } = props

    if (selectedPoints.length === 0) {
      // First point - start rectangle
      return {
        shouldContinue: true,
        newSelectedPoints: [canvasPoint]
      }
    } else if (selectedPoints.length === 1) {
      // Second point - complete rectangle
      const topLeft = selectedPoints[0]
      const bottomRight = canvasPoint
      
      const rectangleData: RectangleData = {
        topLeft,
        bottomRight,
        width: Math.abs(bottomRight.x - topLeft.x),
        height: Math.abs(bottomRight.y - topLeft.y)
      }

      addElement('rectangle', rectangleData, GEOMETRY_COLORS.RECTANGLE)
      
      return {
        shouldContinue: false,
        newSelectedPoints: []
      }
    }

    return { shouldContinue: false }
  }
}

/**
 * Perpendicular tool handler - creates perpendicular bisectors
 */
export class PerpendicularToolHandler implements ToolHandler {
  handle({ canvasPoint, elements, selectedPoints, addElement }: ToolHandlerProps): ToolHandlerResult {
    const newPoints = [...selectedPoints, canvasPoint]
    
    if (newPoints.length === 2) {
      // Create perpendicular bisector from the two points
      const baseLine = new Line2D(newPoints[0], newPoints[1])
      const perpBisector = GeometryUtils.perpendicularBisector(baseLine, 150)
      
      // Add base line and perpendicular bisector
      addElement('line', baseLine, GEOMETRY_COLORS.LINE)
      addElement('line', perpBisector, GEOMETRY_COLORS.PERPENDICULAR)
      
      // Add points if they don't exist
      const point1Result = addPointIfNotExists(newPoints[0], elements, GEOMETRY_COLORS.POINT)
      const point2Result = addPointIfNotExists(newPoints[1], elements, GEOMETRY_COLORS.POINT)
      
      if (point1Result.isNew) {
        addElement('point', point1Result.element.data, point1Result.element.color)
      }
      if (point2Result.isNew) {
        addElement('point', point2Result.element.data, point2Result.element.color)
      }
      
      return { shouldContinue: false, newSelectedPoints: [] }
    }
    
    // Continue collecting points
    return { shouldContinue: true, newSelectedPoints: newPoints }
  }
}

/**
 * Triangle tool handler - creates a single triangle entity
 */
export class TriangleToolHandler implements ToolHandler {
  handle(props: ToolHandlerProps): ToolHandlerResult {
    const { canvasPoint, selectedPoints, addElement } = props

    if (selectedPoints.length === 0) {
      // First point
      return {
        shouldContinue: true,
        newSelectedPoints: [canvasPoint]
      }
    } else if (selectedPoints.length === 1) {
      // Second point
      return {
        shouldContinue: true,
        newSelectedPoints: [...selectedPoints, canvasPoint]
      }
    } else if (selectedPoints.length === 2) {
      // Third point - complete triangle
      const triangleData: TriangleData = {
        pointA: selectedPoints[0],
        pointB: selectedPoints[1],
        pointC: canvasPoint
      }

      addElement('triangle', triangleData, GEOMETRY_COLORS.TRIANGLE)
      
      return {
        shouldContinue: false,
        newSelectedPoints: []
      }
    }

    return { shouldContinue: false }
  }
}

/**
 * Copy tool handler - duplicates selected elements
 */
export class CopyToolHandler implements ToolHandler {
  handle(): ToolHandlerResult {
    // For copy tool, the canvas will handle the actual copying
    // This is just a placeholder that indicates copy tool is active
    return { shouldContinue: false }
  }
}

/**
 * Array tool handler - creates arrays of selected elements
 */
export class ArrayToolHandler implements ToolHandler {
  handle(): ToolHandlerResult {
    // Array tool implementation would need more complex state management
    // For now, return basic structure
    return { shouldContinue: false, newSelectedPoints: [] }
  }
}

/**
 * Trim tool handler - trims line segments between intersections
 */
export class TrimToolHandler implements ToolHandler {
  handle(): ToolHandlerResult {
    // Find line at click point to trim
    // Implementation would need intersection calculation and line segmentation
    return { shouldContinue: false }
  }
}

/**
 * Extend tool handler - extends lines to meet other elements
 */
export class ExtendToolHandler implements ToolHandler {
  handle(): ToolHandlerResult {
    // Find line to extend and target element
    // Implementation would need line extension calculation
    return { shouldContinue: false }
  }
}

/**
 * Fillet tool handler - creates rounded corners with specified radius
 */
export class FilletToolHandler implements ToolHandler {
  handle({ canvasPoint, selectedPoints, dynamicInput, addElement }: ToolHandlerProps): ToolHandlerResult {
    // Fillet implementation would need arc creation between two lines
    const newPoints = [...selectedPoints, canvasPoint]
    
    if (newPoints.length === 2) {
      // Two points selected - potential fillet location
      const radius = dynamicInput.dynamicDistance || 10
      
      // Basic fillet logic would go here
      // For now, just create a small circle at the intersection
      const center = new Point2D(
        (newPoints[0].x + newPoints[1].x) / 2,
        (newPoints[0].y + newPoints[1].y) / 2
      )
      const filletCircle = new Circle2D(center, radius)
      addElement('circle', filletCircle, GEOMETRY_COLORS.CIRCLE)
      
      return { shouldContinue: false, newSelectedPoints: [] }
    }
    
    return { shouldContinue: true, newSelectedPoints: newPoints }
  }
}

/**
 * Mirror tool handler - mirrors elements across a line
 */
export class MirrorToolHandler implements ToolHandler {
  handle({ canvasPoint, selectedPoints, addElement }: ToolHandlerProps): ToolHandlerResult {
    const newPoints = [...selectedPoints, canvasPoint]
    
    if (newPoints.length === 2) {
      // Two points define the mirror axis
      const mirrorLine = new Line2D(newPoints[0], newPoints[1])
      
      // Add the mirror axis line for reference
      addElement('line', mirrorLine, GEOMETRY_COLORS.PERPENDICULAR)
      
      // Actual mirroring would happen in the canvas click handler
      return { shouldContinue: false, newSelectedPoints: [] }
    }
    
    return { shouldContinue: true, newSelectedPoints: newPoints }
  }
}

/**
 * Cog Wheel tool handler - creates mechanical gear shapes
 * Two-click workflow: first click sets center, second click sets outer radius
 */
export class CogWheelToolHandler implements ToolHandler {
  handle({ canvasPoint, selectedPoints, addElement }: ToolHandlerProps): ToolHandlerResult {
    const newPoints = [...selectedPoints, canvasPoint]
    
    if (newPoints.length === 1) {
      // First click - center point selected, wait for radius click
      return { shouldContinue: true, newSelectedPoints: newPoints }
    } else if (newPoints.length === 2) {
      // Second click - calculate radius and create cog wheel
      const center = newPoints[0]
      const radiusPoint = newPoints[1]
      const outerRadius = center.distanceTo(radiusPoint)
      
      // Create cog wheel with default parameters
      const cogWheel = new CogWheel(
        center,
        outerRadius,
        outerRadius * 0.6, // Inner radius (60% of outer)
        12 // Number of teeth
      )
      
      // Add the cog wheel element
      addElement('cogwheel', cogWheel, GEOMETRY_COLORS.CIRCLE)
      
      // Add center point for reference
      const centerPointResult = addPointIfNotExists(center, [], GEOMETRY_COLORS.POINT)
      if (centerPointResult.isNew) {
        addElement('point', centerPointResult.element.data, centerPointResult.element.color)
      }
      
      return { shouldContinue: false, newSelectedPoints: [] }
    }
    
    // Start with center point
    return { shouldContinue: true, newSelectedPoints: newPoints }
  }
}

/**
 * Tool handler factory - creates appropriate handler for each tool
 */
export class ToolHandlerFactory {
  private static handlers = new Map<string, ToolHandler>([
    ['point', new PointToolHandler()],
    ['line', new LineToolHandler()],
    ['circle', new CircleToolHandler()],
    ['rectangle', new RectangleToolHandler()],
    ['perpendicular', new PerpendicularToolHandler()],
    ['triangle', new TriangleToolHandler()],
    ['copy', new CopyToolHandler()],
    ['array', new ArrayToolHandler()],
    ['trim', new TrimToolHandler()],
    ['extend', new ExtendToolHandler()],
    ['fillet', new FilletToolHandler()],
    ['mirror', new MirrorToolHandler()],
    ['cogwheel', new CogWheelToolHandler()],
  ])
  
  static getHandler(toolType: string): ToolHandler | null {
    return this.handlers.get(toolType) || null
  }
  
  static handleTool(toolType: string, props: ToolHandlerProps): ToolHandlerResult {
    const handler = this.getHandler(toolType)
    if (!handler) {
      return { shouldContinue: false }
    }
    
    return handler.handle(props)
  }
} 