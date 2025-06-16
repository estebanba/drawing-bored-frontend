/**
 * Element Renderer Component
 * Handles rendering of all geometric elements on the SVG canvas
 * Separated from main canvas component for better organization
 */

import { Point2D, Line2D, Circle2D, CogWheel } from '@/lib/geometry'
import type { GeometricElement, ElementRenderProps, ToolType, RectangleData, TriangleData } from '@/types/geometry'
import { GEOMETRY_COLORS } from '@/types/geometry'

/**
 * Renders a point element
 */
export function PointRenderer({ element, isHovered, isSelected, isHidden, selectedTool }: ElementRenderProps) {
  if (isHidden) return null
  
  const point = element.data as Point2D
  
  return (
    <circle
      key={element.id}
      cx={point.x}
      cy={point.y}
      r={isHovered || isSelected ? 6 : 4}
      fill={element.color}
      stroke={
        isSelected 
          ? GEOMETRY_COLORS.SELECTION 
          : isHovered && selectedTool === 'delete' 
            ? GEOMETRY_COLORS.HOVER_DELETE 
            : 'white'
      }
      strokeWidth={isSelected ? 2 : 1}
      className="cursor-pointer"
      opacity={element.hidden ? 0.3 : 1}
    />
  )
}

/**
 * Renders a line element
 */
export function LineRenderer({ element, isHovered, isSelected, isHidden, selectedTool }: ElementRenderProps) {
  if (isHidden) return null
  
  const line = element.data as Line2D
  
  return (
    <line
      key={element.id}
      x1={line.start.x}
      y1={line.start.y}
      x2={line.end.x}
      y2={line.end.y}
      stroke={
        isSelected 
          ? GEOMETRY_COLORS.SELECTION 
          : isHovered && selectedTool === 'delete' 
            ? GEOMETRY_COLORS.HOVER_DELETE 
            : element.color
      }
      strokeWidth={isSelected ? 3 : isHovered ? 3 : 2}
      className="pointer-events-none"
      opacity={element.hidden ? 0.3 : 1}
    />
  )
}

/**
 * Renders a circle element
 */
export function CircleRenderer({ element, isHovered, isSelected, isHidden, selectedTool }: ElementRenderProps) {
  if (isHidden) return null
  
  const circle = element.data as Circle2D
  
  return (
    <circle
      key={element.id}
      cx={circle.center.x}
      cy={circle.center.y}
      r={circle.radius}
      fill="none"
      stroke={
        isSelected 
          ? GEOMETRY_COLORS.SELECTION 
          : isHovered && selectedTool === 'delete' 
            ? GEOMETRY_COLORS.HOVER_DELETE 
            : element.color
      }
      strokeWidth={isSelected ? 3 : isHovered ? 3 : 2}
      className="pointer-events-none"
      opacity={element.hidden ? 0.3 : 1}
    />
  )
}

/**
 * Rectangle renderer - renders a rectangle as a single entity
 */
export function RectangleRenderer({ element, isHovered, isSelected, isHidden, selectedTool }: ElementRenderProps) {
  const rect = element.data as RectangleData
  const opacity = isHidden ? 0.3 : 1
  const strokeWidth = isSelected ? 3 : isHovered ? 2.5 : 2
  const stroke = isSelected ? GEOMETRY_COLORS.SELECTION : 
                 selectedTool === 'delete' && isHovered ? GEOMETRY_COLORS.HOVER_DELETE : 
                 element.color

  // Calculate rectangle coordinates
  const x = Math.min(rect.topLeft.x, rect.bottomRight.x)
  const y = Math.min(rect.topLeft.y, rect.bottomRight.y)
  const width = Math.abs(rect.bottomRight.x - rect.topLeft.x)
  const height = Math.abs(rect.bottomRight.y - rect.topLeft.y)

  return (
    <g opacity={opacity}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        className="cursor-pointer"
      />
      {/* Corner snap points (visual indicators when hovered) */}
      {isHovered && (
        <>
          <circle cx={rect.topLeft.x} cy={rect.topLeft.y} r={3} fill={stroke} opacity={0.7} />
          <circle cx={rect.bottomRight.x} cy={rect.topLeft.y} r={3} fill={stroke} opacity={0.7} />
          <circle cx={rect.bottomRight.x} cy={rect.bottomRight.y} r={3} fill={stroke} opacity={0.7} />
          <circle cx={rect.topLeft.x} cy={rect.bottomRight.y} r={3} fill={stroke} opacity={0.7} />
        </>
      )}
    </g>
  )
}

/**
 * Triangle renderer - renders a triangle as a single entity
 */
export function TriangleRenderer({ element, isHovered, isSelected, isHidden, selectedTool }: ElementRenderProps) {
  const triangle = element.data as TriangleData
  const opacity = isHidden ? 0.3 : 1
  const strokeWidth = isSelected ? 3 : isHovered ? 2.5 : 2
  const stroke = isSelected ? GEOMETRY_COLORS.SELECTION : 
                 selectedTool === 'delete' && isHovered ? GEOMETRY_COLORS.HOVER_DELETE : 
                 element.color

  const pathData = `M ${triangle.pointA.x} ${triangle.pointA.y} L ${triangle.pointB.x} ${triangle.pointB.y} L ${triangle.pointC.x} ${triangle.pointC.y} Z`

  return (
    <g opacity={opacity}>
      <path
        d={pathData}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        className="cursor-pointer"
      />
      {/* Vertex snap points (visual indicators when hovered) */}
      {isHovered && (
        <>
          <circle cx={triangle.pointA.x} cy={triangle.pointA.y} r={3} fill={stroke} opacity={0.7} />
          <circle cx={triangle.pointB.x} cy={triangle.pointB.y} r={3} fill={stroke} opacity={0.7} />
          <circle cx={triangle.pointC.x} cy={triangle.pointC.y} r={3} fill={stroke} opacity={0.7} />
        </>
      )}
    </g>
  )
}

/**
 * Cog Wheel renderer - renders a mechanical gear with teeth and center hole
 */
export function CogWheelRenderer({ element, isHovered, isSelected, isHidden, selectedTool }: ElementRenderProps) {
  if (isHidden) return null
  
  const cogWheel = element.data as CogWheel
  const opacity = isHidden ? 0.3 : 1
  const strokeWidth = isSelected ? 3 : isHovered ? 2.5 : 2
  const stroke = isSelected ? GEOMETRY_COLORS.SELECTION : 
                 selectedTool === 'delete' && isHovered ? GEOMETRY_COLORS.HOVER_DELETE : 
                 element.color

  // Generate the cog wheel path
  const pathData = cogWheel.toSVGPath()
  const centerHole = cogWheel.getCenterHole()

  return (
    <g opacity={opacity}>
      {/* Main cog wheel outline */}
      <path
        d={pathData}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        className="cursor-pointer"
      />
      
      {/* Center hole */}
      <circle
        cx={centerHole.center.x}
        cy={centerHole.center.y}
        r={centerHole.radius}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        className="cursor-pointer"
      />
      
      {/* Center point indicator when hovered */}
      {isHovered && (
        <circle 
          cx={cogWheel.center.x} 
          cy={cogWheel.center.y} 
          r={3} 
          fill={stroke} 
          opacity={0.7} 
        />
      )}
      
      {/* Educational annotations when selected */}
      {isSelected && (
        <g>
          {/* Outer radius indicator */}
          <line
            x1={cogWheel.center.x}
            y1={cogWheel.center.y}
            x2={cogWheel.center.x + cogWheel.outerRadius}
            y2={cogWheel.center.y}
            stroke={stroke}
            strokeWidth={1}
            strokeDasharray="3,3"
            opacity={0.5}
          />
          <text
            x={cogWheel.center.x + cogWheel.outerRadius + 5}
            y={cogWheel.center.y + 4}
            fill={stroke}
            fontSize="12"
            className="pointer-events-none"
          >
            R={cogWheel.outerRadius.toFixed(0)}
          </text>
        </g>
      )}
    </g>
  )
}

/**
 * Main element renderer that delegates to specific renderers
 */
interface ElementRendererProps {
  element: GeometricElement
  isHovered: boolean
  isSelected: boolean
  showHidden: boolean
  selectedTool: ToolType
}

export function ElementRenderer({ 
  element, 
  isHovered, 
  isSelected, 
  showHidden, 
  selectedTool 
}: ElementRendererProps) {
  const isHidden = (element.hidden ?? false) && !showHidden
  
  const renderProps: ElementRenderProps = {
    element,
    isHovered,
    isSelected,
    isHidden,
    selectedTool
  }
  
  switch (element.type) {
    case 'point':
      return <PointRenderer {...renderProps} />
    case 'line':
    case 'perpendicular':
      return <LineRenderer {...renderProps} />
    case 'circle':
      return <CircleRenderer {...renderProps} />
    case 'rectangle':
      return <RectangleRenderer {...renderProps} />
    case 'triangle':
      return <TriangleRenderer {...renderProps} />
    case 'cogwheel':
      return <CogWheelRenderer {...renderProps} />
    default:
      return null
  }
}

/**
 * Renders all elements in a collection
 */
interface ElementCollectionRendererProps {
  elements: GeometricElement[]
  selectedElements: string[]
  hoveredElement: string | null
  showHidden: boolean
  selectedTool: ToolType
}

export function ElementCollectionRenderer({
  elements,
  selectedElements,
  hoveredElement,
  showHidden,
  selectedTool
}: ElementCollectionRendererProps) {
  return (
    <>
      {elements.map(element => (
        <ElementRenderer
          key={element.id}
          element={element}
          isHovered={hoveredElement === element.id}
          isSelected={selectedElements.includes(element.id)}
          showHidden={showHidden}
          selectedTool={selectedTool}
        />
      ))}
    </>
  )
} 