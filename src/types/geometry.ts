/**
 * Centralized type definitions for the 2D Geometry Board application
 * Contains all interfaces, types, and enums used throughout the application
 */

import { Point2D, Line2D, Circle2D, CogWheel } from '@/lib/geometry'
import type { LucideIcon } from 'lucide-react'

/**
 * Types of geometric elements that can be created
 */
export type GeometricElementType = 'point' | 'line' | 'circle' | 'perpendicular' | 'triangle' | 'rectangle' | 'cogwheel'

/**
 * Supported tool types for the geometry board
 */
export type ToolType = 'select' | 'point' | 'line' | 'circle' | 'rectangle' | 'perpendicular' | 'triangle' | 'polyline' | 'delete' | 'measure' | 'copy' | 'move' | 'angle' | 'rotate' | 'mirror' | 'trim' | 'offset' | 'fillet' | 'array' | 'layers' | 'properties' | 'cogwheel'

/**
 * Rectangle data structure
 */
export interface RectangleData {
  topLeft: Point2D
  bottomRight: Point2D
  width: number
  height: number
}

/**
 * Triangle data structure
 */
export interface TriangleData {
  pointA: Point2D
  pointB: Point2D
  pointC: Point2D
}

/**
 * Geometric element that can be drawn on the canvas
 */
export interface GeometricElement {
  id: string
  type: GeometricElementType
  color: string
  data: Point2D | Line2D | Circle2D | RectangleData | TriangleData | CogWheel
  hidden?: boolean
  selected?: boolean
  metadata?: Record<string, unknown> // For additional properties
}

/**
 * Information about intersection points between geometric elements
 */
export interface IntersectionInfo {
  point: Point2D
  elements: string[] // IDs of elements that intersect at this point
  type: string // Description of intersection type (e.g., "line-line", "line-circle")
}

/**
 * Canvas settings for customizing the drawing environment
 */
export interface CanvasSettings {
  gridSize: number
  scale: number
  showGrid: boolean
  showScale: boolean
  snapDistance: number
  tolerance: number
  snapToGrid: boolean
}

/**
 * Tool configuration for the geometry tools
 */
export interface ToolConfig {
  id: ToolType
  name: string
  icon: LucideIcon // Lucide icon component
  shortcut: string
  description?: string
}

/**
 * State for dynamic input controls
 */
export interface DynamicInputState {
  showDynamicInput: boolean
  dynamicDistance: number
  dynamicAngle?: number
}

/**
 * Measurement state for the measurement tool
 */
export interface MeasurementState {
  points: Point2D[]
  showMeasurement: boolean
  distance?: number
}

/**
 * Selection and clipboard state
 */
export interface SelectionState {
  selectedElements: string[]
  clipboard: GeometricElement[]
  showHidden: boolean
}

/**
 * Drag and drop state
 */
export interface DragState {
  dragStart: Point2D | null
  isDragging: boolean
  draggedElements: string[]
}

/**
 * Hover state for visual feedback
 */
export interface HoverState {
  hoveredPoint: Point2D | null
  hoveredIntersection: IntersectionInfo | null
  hoveredElement: string | null
  hoveredGridPoint: Point2D | null // Grid snap preview point
}

/**
 * Complete canvas state combining all sub-states
 */
export interface CanvasState {
  elements: GeometricElement[]
  selectedPoints: Point2D[]
  intersections: IntersectionInfo[]
  settings: CanvasSettings
  dynamicInput: DynamicInputState
  measurement: MeasurementState
  selection: SelectionState
  drag: DragState
  hover: HoverState
}

/**
 * Props for the main GeometryCanvas component
 */
export interface GeometryCanvasProps {
  width?: number
  height?: number
  elements?: GeometricElement[] // Elements state from parent for undo/redo
  selectedTool: ToolType
  onElementAdded?: (element: GeometricElement) => void
  onCanvasClick?: (point: Point2D) => void
  onToolSelect?: (tool: ToolType) => void
  onClear?: () => void // Callback to clear all elements and update parent state
  showIntersections?: boolean
  onSidebarToggle?: () => void
  canvasSettings?: {
    showGrid: boolean
    showScale: boolean
    snapToGrid: boolean
    gridSize: number
    scale: number
    snapDistance: number
    tolerance: number
  }
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
}

/**
 * Props for tool handler functions
 */
export interface ToolHandlerProps {
  canvasPoint: Point2D
  elements: GeometricElement[]
  selectedPoints: Point2D[]
  settings: CanvasSettings
  dynamicInput: DynamicInputState
  addElement: (type: GeometricElementType, data: Point2D | Line2D | Circle2D | RectangleData | TriangleData | CogWheel, color?: string) => void
  setSelectedPoints: React.Dispatch<React.SetStateAction<Point2D[]>>
}

/**
 * Result from a tool handler
 */
export interface ToolHandlerResult {
  shouldContinue: boolean
  newSelectedPoints?: Point2D[]
  elementsToAdd?: Array<{
    type: GeometricElementType
    data: Point2D | Line2D | Circle2D
    color: string
  }>
}

/**
 * Event handlers for canvas interactions
 */
export interface CanvasEventHandlers {
  onCanvasClick: (event: React.MouseEvent<SVGSVGElement>) => void
  onMouseMove: (event: React.MouseEvent<SVGSVGElement>) => void
  onMouseDown: (event: React.MouseEvent<SVGSVGElement>) => void
  onMouseUp: (event: React.MouseEvent<SVGSVGElement>) => void
  onKeyDown: (event: React.KeyboardEvent<SVGSVGElement>) => void
}

/**
 * Rendering props for different element types
 */
export interface ElementRenderProps {
  element: GeometricElement
  isHovered: boolean
  isSelected: boolean
  isHidden: boolean
  selectedTool: ToolType
}

/**
 * Constants for the application
 */
export const GEOMETRY_CONSTANTS = {
  DEFAULT_SNAP_DISTANCE: 15,
  DEFAULT_TOLERANCE: 10,
  DEFAULT_GRID_SIZE: 20,
  DEFAULT_DYNAMIC_DISTANCE: 100,
  DRAG_THRESHOLD: 5,
  PASTE_OFFSET: 20,
} as const

/**
 * Color palette for geometric elements
 */
export const GEOMETRY_COLORS = {
  POINT: '#ef4444',
  LINE: '#2563eb',
  CIRCLE: '#10b981',
  RECTANGLE: '#8b5cf6',
  PERPENDICULAR: '#f59e0b',
  TRIANGLE: '#8b5cf6',
  INTERSECTION: '#ff6b6b',
  SELECTION: '#fbbf24',
  HOVER_DELETE: '#ef4444',
  GRID: '#94a3b8',
  GRID_SNAP: '#10b981', // Grid snap preview color
  MEASUREMENT: '#ff6b6b',
} as const 