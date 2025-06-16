/**
 * Custom hook for managing geometric constructions and demonstrations
 * Provides reusable logic for creating classical Euclidean constructions
 */
import { useState, useCallback } from 'react'
import { Point2D, Line2D, Circle2D, GeometryUtils } from '@/lib/geometry'
import type { GeometricElement } from '@/components/GeometryCanvas'

export interface Construction {
  id: string
  name: string
  description: string
  steps: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

/**
 * Hook for managing geometric constructions
 * Provides methods to create and demonstrate classical constructions
 */
export function useGeometryConstructions() {
  const [activeConstruction, setActiveConstruction] = useState<string | null>(null)

  // Available constructions with educational information
  const constructions: Construction[] = [
    {
      id: 'equilateral-triangle',
      name: 'Equilateral Triangle',
      description: 'Construct an equilateral triangle using compass and straightedge',
      difficulty: 'beginner',
      steps: [
        'Draw a line segment AB of any length',
        'Place compass point at A, set width to length AB',
        'Draw an arc above the line segment',
        'Keep same compass width, place point at B',
        'Draw an arc intersecting the first arc at point C',
        'Connect A to C and B to C to complete the triangle'
      ]
    },
    {
      id: 'perpendicular-bisector',
      name: 'Perpendicular Bisector',
      description: 'Find the perpendicular bisector of a line segment',
      difficulty: 'beginner',
      steps: [
        'Draw line segment AB',
        'Place compass at A, draw arc above and below the line',
        'Keep same radius, place compass at B',
        'Draw arcs intersecting the previous arcs',
        'Connect the two intersection points with a straight line'
      ]
    },
    {
      id: 'angle-bisector',
      name: 'Angle Bisector',
      description: 'Bisect an angle using compass and straightedge',
      difficulty: 'intermediate',
      steps: [
        'Place compass at angle vertex O',
        'Draw arc intersecting both rays at points A and B',
        'Place compass at A, draw arc inside the angle',
        'Keep same radius, place compass at B',
        'Draw arc intersecting previous arc at point C',
        'Draw line from O through C to bisect the angle'
      ]
    },
    {
      id: 'circle-through-3-points',
      name: 'Circle Through 3 Points',
      description: 'Construct a circle passing through three given points',
      difficulty: 'intermediate',
      steps: [
        'Given three points A, B, and C',
        'Draw line segments AB and BC',
        'Construct perpendicular bisector of AB',
        'Construct perpendicular bisector of BC',
        'Mark intersection O of the two perpendicular bisectors',
        'Use O as center, draw circle with radius OA'
      ]
    },
    {
      id: 'regular-hexagon',
      name: 'Regular Hexagon',
      description: 'Construct a regular hexagon inscribed in a circle',
      difficulty: 'advanced',
      steps: [
        'Draw circle with center O and any radius',
        'Mark point A anywhere on the circle',
        'Keep compass at same radius as circle',
        'Place compass at A, mark intersection B on circle',
        'Continue around circle marking points C, D, E, F',
        'Connect consecutive points to form hexagon'
      ]
    },
    {
      id: 'golden-rectangle',
      name: 'Golden Rectangle',
      description: 'Construct a rectangle with golden ratio proportions',
      difficulty: 'advanced',
      steps: [
        'Draw square ABCD with side length 1',
        'Find midpoint E of side AB',
        'Draw arc from E through C to extend beyond AB',
        'Mark point F where arc intersects AB extended',
        'Complete rectangle AFGD using F as corner',
        'The ratio AF:AB equals the golden ratio φ'
      ]
    }
  ]

  /**
   * Create geometric elements for a specific construction demonstration
   * @param constructionId ID of the construction to demonstrate
   * @param canvasWidth Width of the canvas for positioning
   * @param canvasHeight Height of the canvas for positioning
   * @returns Array of geometric elements representing the construction
   */
  const createConstructionElements = useCallback((
    constructionId: string,
    canvasWidth: number = 700,
    canvasHeight: number = 500
  ): GeometricElement[] => {
    const centerX = canvasWidth / 2
    const centerY = canvasHeight / 2
    const scale = Math.min(canvasWidth, canvasHeight) * 0.3

    switch (constructionId) {
      case 'equilateral-triangle': {
        const pointA = new Point2D(centerX - scale/2, centerY + scale/4)
        const pointB = new Point2D(centerX + scale/2, centerY + scale/4)
        const distance = pointA.distanceTo(pointB)
        
        // Calculate third point for equilateral triangle
        const height = (distance * Math.sqrt(3)) / 2
        const pointC = new Point2D(centerX, centerY + scale/4 - height)
        
        return [
          {
            id: 'base-line',
            type: 'line',
            color: '#2563eb',
            data: new Line2D(pointA, pointB)
          },
          {
            id: 'construction-circle-a',
            type: 'circle',
            color: '#10b981',
            data: new Circle2D(pointA, distance)
          },
          {
            id: 'construction-circle-b',
            type: 'circle',
            color: '#10b981',
            data: new Circle2D(pointB, distance)
          },
          {
            id: 'side-ac',
            type: 'line',
            color: '#8b5cf6',
            data: new Line2D(pointA, pointC)
          },
          {
            id: 'side-bc',
            type: 'line',
            color: '#8b5cf6',
            data: new Line2D(pointB, pointC)
          },
          {
            id: 'vertex-a',
            type: 'point',
            color: '#ef4444',
            data: pointA
          },
          {
            id: 'vertex-b',
            type: 'point',
            color: '#ef4444',
            data: pointB
          },
          {
            id: 'vertex-c',
            type: 'point',
            color: '#ef4444',
            data: pointC
          }
        ]
      }
      
      case 'perpendicular-bisector': {
        const pointA = new Point2D(centerX - scale/2, centerY)
        const pointB = new Point2D(centerX + scale/2, centerY)
        const baseLine = new Line2D(pointA, pointB)
        const bisector = GeometryUtils.perpendicularBisector(baseLine, scale)
        
        return [
          {
            id: 'base-line',
            type: 'line',
            color: '#2563eb',
            data: baseLine
          },
          {
            id: 'perpendicular-bisector',
            type: 'line',
            color: '#f59e0b',
            data: bisector
          },
          {
            id: 'point-a',
            type: 'point',
            color: '#ef4444',
            data: pointA
          },
          {
            id: 'point-b',
            type: 'point',
            color: '#ef4444',
            data: pointB
          }
        ]
      }

      case 'circle-through-3-points': {
        const pointA = new Point2D(centerX - scale/3, centerY + scale/4)
        const pointB = new Point2D(centerX + scale/3, centerY + scale/4)
        const pointC = new Point2D(centerX, centerY - scale/3)
        
        const circle = GeometryUtils.circleThrough3Points(pointA, pointB, pointC)
        
        if (!circle) return []

        return [
          {
            id: 'circumcircle',
            type: 'circle',
            color: '#10b981',
            data: circle
          },
          {
            id: 'point-a',
            type: 'point',
            color: '#ef4444',
            data: pointA
          },
          {
            id: 'point-b',
            type: 'point',
            color: '#ef4444',
            data: pointB
          },
          {
            id: 'point-c',
            type: 'point',
            color: '#ef4444',
            data: pointC
          },
          {
            id: 'center',
            type: 'point',
            color: '#f59e0b',
            data: circle.center
          }
        ]
      }

      case 'regular-hexagon': {
        const center = new Point2D(centerX, centerY)
        const radius = scale / 2
        const hexagonPoints: Point2D[] = []
        const elements: GeometricElement[] = []

        // Create hexagon vertices
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3 // 60 degrees in radians
          const point = new Point2D(
            center.x + radius * Math.cos(angle),
            center.y + radius * Math.sin(angle)
          )
          hexagonPoints.push(point)
        }

        // Add circumcircle
        elements.push({
          id: 'circumcircle',
          type: 'circle',
          color: '#10b981',
          data: new Circle2D(center, radius)
        })

        // Add hexagon sides
        for (let i = 0; i < 6; i++) {
          const nextIndex = (i + 1) % 6
          elements.push({
            id: `side-${i}`,
            type: 'line',
            color: '#8b5cf6',
            data: new Line2D(hexagonPoints[i], hexagonPoints[nextIndex])
          })
        }

        // Add vertices
        hexagonPoints.forEach((point, index) => {
          elements.push({
            id: `vertex-${index}`,
            type: 'point',
            color: '#ef4444',
            data: point
          })
        })

        // Add center point
        elements.push({
          id: 'center',
          type: 'point',
          color: '#f59e0b',
          data: center
        })

        return elements
      }

      default:
        return []
    }
  }, [])

  /**
   * Start a construction demonstration
   * @param constructionId ID of construction to demonstrate
   * @returns Array of geometric elements for the construction
   */
  const startConstruction = useCallback((
    constructionId: string,
    canvasWidth?: number,
    canvasHeight?: number
  ) => {
    setActiveConstruction(constructionId)
    return createConstructionElements(constructionId, canvasWidth, canvasHeight)
  }, [createConstructionElements])

  /**
   * Clear the active construction
   */
  const clearConstruction = useCallback(() => {
    setActiveConstruction(null)
  }, [])

  /**
   * Get construction by ID
   * @param constructionId ID of construction to find
   * @returns Construction object or undefined
   */
  const getConstruction = useCallback((constructionId: string) => {
    return constructions.find(c => c.id === constructionId)
  }, [constructions])

  return {
    constructions,
    activeConstruction,
    startConstruction,
    clearConstruction,
    getConstruction,
    createConstructionElements
  }
} 