/**
 * Custom hook for managing canvas state
 * Centralizes state management and provides clean interfaces for canvas operations
 */

import { useState, useCallback, useMemo } from 'react'
import { Point2D, Line2D, Circle2D, Vector2D, GeometryUtils, CogWheel } from '@/lib/geometry'
import type { 
  GeometricElement, 
  GeometricElementType,
  IntersectionInfo, 
  CanvasSettings, 
  DynamicInputState, 
  MeasurementState, 
  SelectionState, 
  DragState, 
  HoverState,
  RectangleData,
  TriangleData
} from '@/types/geometry'
import { GEOMETRY_CONSTANTS, GEOMETRY_COLORS } from '@/types/geometry'
import { 
  generateElementId, 
  findElementAtPoint, 
  cloneElement, 
  getSelectedElements 
} from '@/utils/elementUtils'

/**
 * Hook for managing geometric elements
 */
export function useGeometricElements() {
  const [elements, setElements] = useState<GeometricElement[]>([])
  const [selectedPoints, setSelectedPoints] = useState<Point2D[]>([])

  /**
   * Add a new geometric element
   */
  const addElement = useCallback((
    type: GeometricElementType, 
    data: Point2D | Line2D | Circle2D | RectangleData | TriangleData | CogWheel, 
    color?: string
  ): GeometricElement => {
    const element: GeometricElement = {
      id: generateElementId(),
      type,
      data,
      color: color || GEOMETRY_COLORS[type.toUpperCase() as keyof typeof GEOMETRY_COLORS] || '#000000'
    }
    
    setElements(prev => [...prev, element])
    return element
  }, [])

  const deleteElement = useCallback((elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId))
  }, [])

  const updateElement = useCallback((elementId: string, updates: Partial<GeometricElement>) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    ))
  }, [])

  const clearElements = useCallback(() => {
    setElements([])
    setSelectedPoints([])
  }, [])

  return {
    elements,
    selectedPoints,
    setSelectedPoints,
    addElement,
    deleteElement,
    updateElement,
    clearElements
  }
}

/**
 * Hook for managing canvas settings
 */
export function useCanvasSettings() {
  const [settings, setSettings] = useState<CanvasSettings>({
    gridSize: GEOMETRY_CONSTANTS.DEFAULT_GRID_SIZE,
    scale: 1,
    showGrid: true,
    showScale: true,
    snapDistance: GEOMETRY_CONSTANTS.DEFAULT_SNAP_DISTANCE,
    tolerance: GEOMETRY_CONSTANTS.DEFAULT_TOLERANCE,
    snapToGrid: false
  })

  const updateSettings = useCallback((updates: Partial<CanvasSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }, [])

  return { settings, updateSettings }
}

/**
 * Hook for managing dynamic input state
 */
export function useDynamicInput() {
  const [dynamicInput, setDynamicInput] = useState<DynamicInputState>({
    showDynamicInput: false,
    dynamicDistance: GEOMETRY_CONSTANTS.DEFAULT_DYNAMIC_DISTANCE,
    dynamicAngle: 0
  })

  const updateDynamicInput = useCallback((updates: Partial<DynamicInputState>) => {
    setDynamicInput(prev => ({ ...prev, ...updates }))
  }, [])

  return { dynamicInput, updateDynamicInput }
}

/**
 * Hook for managing measurement state
 */
export function useMeasurement() {
  const [measurement, setMeasurement] = useState<MeasurementState>({
    points: [],
    showMeasurement: false,
    distance: undefined
  })

  const addMeasurementPoint = useCallback((point: Point2D) => {
    setMeasurement(prev => {
      const newPoints = [...prev.points, point]
      if (newPoints.length === 2) {
        const distance = newPoints[0].distanceTo(newPoints[1])
        return {
          points: newPoints,
          showMeasurement: true,
          distance
        }
      }
      return { ...prev, points: newPoints }
    })
  }, [])

  const clearMeasurement = useCallback(() => {
    setMeasurement({
      points: [],
      showMeasurement: false,
      distance: undefined
    })
  }, [])

  return { measurement, addMeasurementPoint, clearMeasurement }
}

/**
 * Hook for managing selection and clipboard operations
 */
export function useSelection(elements: GeometricElement[]) {
  const [selection, setSelection] = useState<SelectionState>({
    selectedElements: [],
    clipboard: [],
    showHidden: false
  })

  const toggleElementSelection = useCallback((elementId: string) => {
    setSelection(prev => ({
      ...prev,
      selectedElements: prev.selectedElements.includes(elementId)
        ? prev.selectedElements.filter(id => id !== elementId)
        : [...prev.selectedElements, elementId]
    }))
  }, [])

  const clearSelection = useCallback(() => {
    setSelection(prev => ({ ...prev, selectedElements: [] }))
  }, [])

  const selectElements = useCallback((elementIds: string[]) => {
    setSelection(prev => ({ ...prev, selectedElements: elementIds }))
  }, [])

  const copySelected = useCallback(() => {
    const selectedElements = getSelectedElements(elements, selection.selectedElements)
    setSelection(prev => ({ ...prev, clipboard: selectedElements }))
  }, [elements, selection.selectedElements])

  const pasteElements = useCallback((addElement: (type: GeometricElement['type'], data: Point2D | Line2D | Circle2D | RectangleData | TriangleData | CogWheel, color: string) => void) => {
    const offset = new Vector2D(GEOMETRY_CONSTANTS.PASTE_OFFSET, GEOMETRY_CONSTANTS.PASTE_OFFSET)
    
    selection.clipboard.forEach(element => {
      const clonedElement = cloneElement(element, offset)
      addElement(clonedElement.type, clonedElement.data, clonedElement.color)
    })
  }, [selection.clipboard])

  const hideSelected = useCallback((updateElement: (id: string, updates: Partial<GeometricElement>) => void) => {
    selection.selectedElements.forEach(elementId => {
      updateElement(elementId, { hidden: true })
    })
    clearSelection()
  }, [selection.selectedElements, clearSelection])

  const toggleShowHidden = useCallback(() => {
    setSelection(prev => ({ ...prev, showHidden: !prev.showHidden }))
  }, [])

  return {
    selection,
    toggleElementSelection,
    clearSelection,
    selectElements,
    copySelected,
    pasteElements,
    hideSelected,
    toggleShowHidden
  }
}

/**
 * Hook for managing drag operations
 */
export function useDrag() {
  const [drag, setDrag] = useState<DragState>({
    dragStart: null,
    isDragging: false,
    draggedElements: []
  })

  const startDrag = useCallback((point: Point2D, elementIds: string[]) => {
    setDrag({
      dragStart: point,
      isDragging: true,
      draggedElements: elementIds
    })
  }, [])

  const endDrag = useCallback((
    endPoint: Point2D, 
    moveElements: (elementIds: string[], offset: Vector2D) => void
  ) => {
    if (drag.dragStart && drag.isDragging) {
      const offset = new Vector2D(
        endPoint.x - drag.dragStart.x,
        endPoint.y - drag.dragStart.y
      )
      
      if (offset.magnitude > GEOMETRY_CONSTANTS.DRAG_THRESHOLD) {
        moveElements(drag.draggedElements, offset)
      }
    }
    
    setDrag({
      dragStart: null,
      isDragging: false,
      draggedElements: []
    })
  }, [drag])

  const cancelDrag = useCallback(() => {
    setDrag({
      dragStart: null,
      isDragging: false,
      draggedElements: []
    })
  }, [])

  return { drag, startDrag, endDrag, cancelDrag }
}

/**
 * Hook for managing hover state
 */
export function useHover() {
  const [hover, setHover] = useState<HoverState>({
    hoveredPoint: null,
    hoveredIntersection: null,
    hoveredElement: null,
    hoveredGridPoint: null
  })

  const updateHover = useCallback((updates: Partial<HoverState>) => {
    setHover(prev => ({ ...prev, ...updates }))
  }, [])

  const clearHover = useCallback(() => {
    setHover({
      hoveredPoint: null,
      hoveredIntersection: null,
      hoveredElement: null,
      hoveredGridPoint: null
    })
  }, [])

  return { hover, updateHover, clearHover }
}

/**
 * Hook for managing intersections
 */
export function useIntersections(elements: GeometricElement[], showIntersections: boolean) {
  const intersections = useMemo((): IntersectionInfo[] => {
    if (!showIntersections || elements.length < 2) return []
    
    // Filter elements to only include basic geometric shapes that can intersect
    const basicElements = elements.filter(el => 
      el.type === 'point' || el.type === 'line' || el.type === 'circle' || el.type === 'perpendicular'
    ).map(el => ({
      id: el.id,
      type: el.type,
      data: el.data as Point2D | Line2D | Circle2D
    }))
    
    return GeometryUtils.findAllIntersections(basicElements)
  }, [elements, showIntersections])

  return { intersections }
}

/**
 * Main canvas state hook that combines all sub-hooks
 */
export function useCanvasState(showIntersections: boolean = true) {
  const geometricElements = useGeometricElements()
  const canvasSettings = useCanvasSettings()
  const dynamicInput = useDynamicInput()
  const measurement = useMeasurement()
  const selection = useSelection(geometricElements.elements)
  const drag = useDrag()
  const hover = useHover()
  const { intersections } = useIntersections(geometricElements.elements, showIntersections)

  // Helper functions that work across multiple state domains
  const findElementAt = useCallback((point: Point2D) => {
    return findElementAtPoint(point, geometricElements.elements, canvasSettings.settings.tolerance)
  }, [geometricElements.elements, canvasSettings.settings.tolerance])

  const moveSelectedElements = useCallback((offset: Vector2D) => {
    selection.selection.selectedElements.forEach(elementId => {
      const element = geometricElements.elements.find(el => el.id === elementId)
      if (!element) return

      let newData = element.data
      if (element.type === 'point') {
        newData = (element.data as Point2D).add(offset)
      } else if (element.type === 'line' || element.type === 'perpendicular') {
        const line = element.data as Line2D
        newData = new Line2D(line.start.add(offset), line.end.add(offset))
      } else if (element.type === 'circle') {
        const circle = element.data as Circle2D
        newData = new Circle2D(circle.center.add(offset), circle.radius)
      } else if (element.type === 'rectangle') {
        const rect = element.data as RectangleData
        newData = {
          topLeft: rect.topLeft.add(offset),
          bottomRight: rect.bottomRight.add(offset),
          width: rect.width,
          height: rect.height
        }
      } else if (element.type === 'triangle') {
        const triangle = element.data as TriangleData
        newData = {
          pointA: triangle.pointA.add(offset),
          pointB: triangle.pointB.add(offset),
          pointC: triangle.pointC.add(offset)
        }
      }

      geometricElements.updateElement(elementId, { data: newData })
    })
  }, [selection.selection.selectedElements, geometricElements])

  const deleteSelectedElements = useCallback(() => {
    selection.selection.selectedElements.forEach(elementId => {
      geometricElements.deleteElement(elementId)
    })
    selection.clearSelection()
  }, [selection, geometricElements])

  return {
    // State
    elements: geometricElements.elements,
    selectedPoints: geometricElements.selectedPoints,
    intersections,
    settings: canvasSettings.settings,
    dynamicInput: dynamicInput.dynamicInput,
    measurement: measurement.measurement,
    selection: selection.selection,
    drag: drag.drag,
    hover: hover.hover,

    // Actions
    addElement: geometricElements.addElement,
    deleteElement: geometricElements.deleteElement,
    updateElement: geometricElements.updateElement,
    clearElements: geometricElements.clearElements,
    setSelectedPoints: geometricElements.setSelectedPoints,
    
    updateSettings: canvasSettings.updateSettings,
    updateDynamicInput: dynamicInput.updateDynamicInput,
    
    addMeasurementPoint: measurement.addMeasurementPoint,
    clearMeasurement: measurement.clearMeasurement,
    
    toggleElementSelection: selection.toggleElementSelection,
    clearSelection: selection.clearSelection,
    selectElements: selection.selectElements,
    copySelected: selection.copySelected,
    pasteElements: selection.pasteElements,
    hideSelected: selection.hideSelected,
    toggleShowHidden: selection.toggleShowHidden,
    
    startDrag: drag.startDrag,
    endDrag: drag.endDrag,
    cancelDrag: drag.cancelDrag,
    
    updateHover: hover.updateHover,
    clearHover: hover.clearHover,

    // Helper functions
    findElementAt,
    moveSelectedElements,
    deleteSelectedElements
  }
} 