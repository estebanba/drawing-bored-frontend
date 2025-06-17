// All sidebar UI components are now imported using a relative path to resolve linter errors.
import * as React from "react"
import { Logotype } from "@/components/ui/logotype"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Minus,
  RectangleHorizontal,
  Triangle,
  Eye,
  EyeOff,
  Crosshair,
  Trash2,
  MousePointer,
  Copy,
  Move,
  Ruler,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Dot,
  Radius,
  SquareSlash,
  Palette,
  Layers,
  RotateCw,
  FlipHorizontal,
  Scissors,
  MoveHorizontal,
  CornerDownRight,
  Grid3X3,
  Spline,
  Cog,
  Moon,
  Sun,
  HelpCircle,
  Info,
  Grid3x3,
  Ruler as RulerIcon,
  Github,
  Linkedin,
  Target
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarFooter,
} from "../ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"

// Draw tools - Basic geometric shapes
export const drawTools = [
  { id: 'line', name: 'Line', icon: Minus, shortcut: 'L' },
  { id: 'circle', name: 'Circle', icon: Radius, shortcut: 'C' },
  { id: 'rectangle', name: 'Rectangle', icon: RectangleHorizontal, shortcut: 'REC' },
  { id: 'triangle', name: 'Triangle', icon: Triangle, shortcut: 'T' },
  { id: 'point', name: 'Point', icon: Dot, shortcut: 'P' },
  { id: 'perpendicular', name: 'Perpendicular', icon: SquareSlash, shortcut: 'B' },
  { id: 'polyline', name: 'Polyline', icon: Spline, shortcut: 'PL' },
  { id: 'cogwheel', name: 'Cog Wheel', icon: Cog, shortcut: 'COG' },
]

// Modify tools - Editing and manipulation
export const modifyTools = [
  { id: 'select', name: 'Select', icon: MousePointer, shortcut: 'S' },
  { id: 'move', name: 'Move', icon: Move, shortcut: 'M' },
  { id: 'copy', name: 'Copy', icon: Copy, shortcut: 'CO' },
  { id: 'rotate', name: 'Rotate', icon: RotateCw, shortcut: 'RO' },
  { id: 'mirror', name: 'Mirror', icon: FlipHorizontal, shortcut: 'MI' },
  { id: 'delete', name: 'Erase', icon: Trash2, shortcut: 'E' },
  { id: 'trim', name: 'Trim', icon: Scissors, shortcut: 'TR' },
  { id: 'offset', name: 'Offset', icon: MoveHorizontal, shortcut: 'O' },
  { id: 'fillet', name: 'Fillet', icon: CornerDownRight, shortcut: 'F' },
  { id: 'array', name: 'Array', icon: Grid3X3, shortcut: 'AR' },
]

// Properties tools
export const propertyTools = [
  { id: 'layers', name: 'Layers', icon: Layers, shortcut: 'LA' },
  { id: 'properties', name: 'Properties', icon: Palette, shortcut: 'PR' },
  { id: 'measure', name: 'Measure Distance', icon: Ruler, shortcut: 'DI' },
  { id: 'angle', name: 'Measure Angle', icon: RotateCcw, shortcut: 'AN' },
]

// Classical constructions
export const constructions = [
  { id: 'equilateral-triangle', name: 'Equilateral Triangle', icon: Triangle },
  { id: 'perpendicular-bisector', name: 'Perpendicular Bisector', icon: SquareSlash },
  { id: 'angle-bisector', name: 'Angle Bisector', icon: RotateCcw },
  { id: 'intersection-demo', name: 'Intersection Demo', icon: Crosshair },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  selectedTool?: string
  onToolSelect?: (toolId: string) => void
  onConstructionSelect?: (constructionId: string) => void
  showIntersections?: boolean
  onToggleIntersections?: () => void
  currentConstruction?: string | null
  showGeometryTools?: boolean
  isDarkMode?: boolean
  onToggleDarkMode?: () => void
  showHelpOverlay?: boolean
  onToggleHelpOverlay?: () => void
  showInfoPanel?: boolean
  onToggleInfoPanel?: () => void
  // Canvas settings
  canvasSettings?: {
    showGrid: boolean
    showScale: boolean
    snapToGrid: boolean
    gridSize: number
    scale: number
    snapDistance: number
    tolerance: number
  }
  onCanvasSettingsChange?: (settings: Partial<{
    showGrid: boolean
    showScale: boolean
    snapToGrid: boolean
    gridSize: number
    scale: number
    snapDistance: number
    tolerance: number
  }>) => void
  // Dynamic input settings
  dynamicInput?: {
    showDynamicInput: boolean
    dynamicDistance: number
    dynamicAngle?: number
  }
  onDynamicInputChange?: (settings: Partial<{
    showDynamicInput: boolean
    dynamicDistance: number
    dynamicAngle?: number
  }>) => void
}

/**
 * Professional CAD-style sidebar with organized toolbars
 * Following industry standard CAD interface patterns
 */
export function AppSidebar({ 
  selectedTool,
  onToolSelect,
  onConstructionSelect,
  showIntersections,
  onToggleIntersections,
  currentConstruction,
  showGeometryTools,
  isDarkMode,
  onToggleDarkMode,
  showHelpOverlay,
  onToggleHelpOverlay,
  showInfoPanel,
  onToggleInfoPanel,
  canvasSettings,
  onCanvasSettingsChange,
  dynamicInput,
  onDynamicInputChange,
  ...props 
}: AppSidebarProps) {
  const [constructionsOpen, setConstructionsOpen] = React.useState(false)
  const [settingsOpen, setSettingsOpen] = React.useState(false)

  return (
    <TooltipProvider>
      <Sidebar variant="floating" {...props}>
        {/* Clean sidebar header with logo and app name */}
        <SidebarHeader className="border-b border-sidebar-border p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="sm" asChild>
                <a href="/">
                  <div className="flex aspect-square size-6 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Logotype />
                  </div>
                  <div className="flex flex-col gap-0 leading-none">
                    <span className="text-sm font-semibold">Drawing Bored</span>
                    <span className="text-xs text-sidebar-muted-foreground">Menu</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        
        {/* Navigation and Tools */}
        <SidebarContent>
          {/* CAD Toolbars - Only show when on 2D Board */}
          {showGeometryTools && (
            <>
              {/* Draw Toolbar */}
              <SidebarGroup className="py-1">
                <SidebarGroupLabel className="text-xs font-medium text-sidebar-muted-foreground px-2 py-0.5">
                  Draw
                </SidebarGroupLabel>
                <SidebarMenu className="gap-0.5">
                  <div className="grid grid-cols-4 gap-0.5 p-0.5">
                    {drawTools.map((tool) => (
                      <Tooltip key={tool.id}>
                        <TooltipTrigger asChild>
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              onClick={() => onToolSelect?.(tool.id)}
                              className={`h-7 w-7 p-0 flex items-center justify-center ${selectedTool === tool.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                              size="sm"
                            >
                              <tool.icon className="size-3" />
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{tool.name} ({tool.shortcut})</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </SidebarMenu>
              </SidebarGroup>

              <SidebarSeparator className="my-0.5" />

              {/* Modify Toolbar */}
              <SidebarGroup className="py-1">
                <SidebarGroupLabel className="text-xs font-medium text-sidebar-muted-foreground px-2 py-0.5">
                  Modify
                </SidebarGroupLabel>
                <SidebarMenu className="gap-0.5">
                  <div className="grid grid-cols-4 gap-0.5 p-0.5">
                    {modifyTools.map((tool) => (
                      <Tooltip key={tool.id}>
                        <TooltipTrigger asChild>
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              onClick={() => onToolSelect?.(tool.id)}
                              className={`h-7 w-7 p-0 flex items-center justify-center ${selectedTool === tool.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                              size="sm"
                            >
                              <tool.icon className="size-3" />
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{tool.name} ({tool.shortcut})</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </SidebarMenu>
              </SidebarGroup>

              <SidebarSeparator className="my-0.5" />

              {/* Properties Toolbar */}
              <SidebarGroup className="py-1">
                <SidebarGroupLabel className="text-xs font-medium text-sidebar-muted-foreground px-2 py-0.5">
                  Properties
                </SidebarGroupLabel>
                <SidebarMenu className="gap-0.5">
                  <div className="grid grid-cols-2 gap-0.5 p-0.5">
                    {propertyTools.map((tool) => (
                      <Tooltip key={tool.id}>
                        <TooltipTrigger asChild>
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              onClick={() => onToolSelect?.(tool.id)}
                              className={`h-7 w-7 p-0 flex items-center justify-center ${selectedTool === tool.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                              size="sm"
                            >
                              <tool.icon className="size-3" />
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{tool.name} ({tool.shortcut})</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </SidebarMenu>
              </SidebarGroup>

              <SidebarSeparator className="my-0.5" />

              {/* View Controls */}
              <SidebarGroup className="py-1">
                <SidebarGroupLabel className="text-xs font-medium text-sidebar-muted-foreground px-2 py-0.5">
                  View
                </SidebarGroupLabel>
                <SidebarMenu className="gap-0.5">
                  <div className="grid grid-cols-2 gap-0.5 p-0.5">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            onClick={onToggleIntersections}
                            className="h-7 w-7 p-0 flex items-center justify-center"
                            size="sm"
                          >
                            {showIntersections ? (
                              <Eye className="size-3" />
                            ) : (
                              <EyeOff className="size-3" />
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{showIntersections ? 'Hide' : 'Show'} Intersections (F3)</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    {/* Info Panel Toggle */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            onClick={onToggleInfoPanel}
                            className={`h-7 w-7 p-0 flex items-center justify-center ${showInfoPanel ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                            size="sm"
                          >
                            <Info className="size-3" />
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Toggle canvas info panel</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </SidebarMenu>
              </SidebarGroup>

              <SidebarSeparator className="my-0.5" />

              {/* Classical Constructions - Collapsible */}
              <Collapsible open={constructionsOpen} onOpenChange={setConstructionsOpen}>
                <SidebarGroup className="py-1">
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="flex w-full items-center justify-between text-xs font-medium text-sidebar-muted-foreground hover:text-sidebar-foreground px-2 py-0.5">
                      Constructions
                      {constructionsOpen ? (
                        <ChevronDown className="size-3" />
                      ) : (
                        <ChevronRight className="size-3" />
                      )}
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarMenu className="gap-0.5 mt-0.5">
                      {constructions.map((construction) => (
                        <SidebarMenuItem key={construction.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                onClick={() => onConstructionSelect?.(construction.id)}
                                className={`h-6 justify-start ${currentConstruction === construction.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                                size="sm"
                              >
                                <construction.icon className="size-3" />
                                <span className="text-xs truncate">{construction.name}</span>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <p>{construction.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>

              <SidebarSeparator className="my-0.5" />

              {/* Settings - Collapsible */}
              <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
                <SidebarGroup className="py-1">
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="flex w-full items-center justify-between text-xs font-medium text-sidebar-muted-foreground hover:text-sidebar-foreground px-2 py-0.5">
                      Settings
                      {settingsOpen ? (
                        <ChevronDown className="size-3" />
                      ) : (
                        <ChevronRight className="size-3" />
                      )}
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarMenu className="gap-0.5 mt-0.5">
                      {/* Dark Mode Toggle */}
                      <SidebarMenuItem>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton
                              onClick={onToggleDarkMode}
                              className="h-6 justify-start"
                              size="sm"
                            >
                              {isDarkMode ? (
                                <Sun className="size-3" />
                              ) : (
                                <Moon className="size-3" />
                              )}
                              <span className="text-xs">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>Toggle {isDarkMode ? 'light' : 'dark'} mode</p>
                          </TooltipContent>
                        </Tooltip>
                      </SidebarMenuItem>

                      {/* Help Overlay Toggle */}
                      <SidebarMenuItem>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton
                              onClick={onToggleHelpOverlay}
                              className={`h-6 justify-start ${showHelpOverlay ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                              size="sm"
                            >
                              <HelpCircle className="size-3" />
                              <span className="text-xs">Help & Shortcuts</span>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>Show help overlay</p>
                          </TooltipContent>
                        </Tooltip>
                      </SidebarMenuItem>

                      {/* Canvas Settings */}
                      {canvasSettings && onCanvasSettingsChange && (
                        <>
                          {/* Show Grid Toggle */}
                          <SidebarMenuItem>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuButton
                                  onClick={() => onCanvasSettingsChange({ showGrid: !canvasSettings.showGrid })}
                                  className={`h-6 justify-start ${canvasSettings.showGrid ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                                  size="sm"
                                >
                                  <Grid3x3 className="size-3" />
                                  <span className="text-xs">Show Grid</span>
                                </SidebarMenuButton>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <p>Toggle grid visibility</p>
                              </TooltipContent>
                            </Tooltip>
                          </SidebarMenuItem>

                          {/* Show Scale Toggle */}
                          <SidebarMenuItem>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuButton
                                  onClick={() => onCanvasSettingsChange({ showScale: !canvasSettings.showScale })}
                                  className={`h-6 justify-start ${canvasSettings.showScale ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                                  size="sm"
                                >
                                  <RulerIcon className="size-3" />
                                  <span className="text-xs">Show Scale</span>
                                </SidebarMenuButton>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <p>Toggle scale indicator</p>
                              </TooltipContent>
                            </Tooltip>
                          </SidebarMenuItem>

                          {/* Snap to Grid Toggle */}
                          <SidebarMenuItem>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuButton
                                  onClick={() => onCanvasSettingsChange({ snapToGrid: !canvasSettings.snapToGrid })}
                                  className={`h-6 justify-start ${canvasSettings.snapToGrid ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                                  size="sm"
                                >
                                  <Crosshair className="size-3" />
                                  <span className="text-xs">Snap to Grid</span>
                                </SidebarMenuButton>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <p>Toggle grid snapping</p>
                              </TooltipContent>
                            </Tooltip>
                          </SidebarMenuItem>
                        </>
                      )}

                      {/* Dynamic Input Controls */}
                      {dynamicInput && onDynamicInputChange && (selectedTool === 'line' || selectedTool === 'circle') && (
                        <>
                          {/* Dynamic Input Toggle */}
                          <SidebarMenuItem>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuButton
                                  onClick={() => onDynamicInputChange({ showDynamicInput: !dynamicInput.showDynamicInput })}
                                  className={`h-6 justify-start ${dynamicInput.showDynamicInput ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                                  size="sm"
                                >
                                  <Target className="size-3" />
                                  <span className="text-xs">Distance Input</span>
                                </SidebarMenuButton>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <p>Enable precise distance input for {selectedTool}s</p>
                              </TooltipContent>
                            </Tooltip>
                          </SidebarMenuItem>

                          {/* Distance Input Field */}
                          {dynamicInput.showDynamicInput && (
                            <SidebarMenuItem>
                              <div className="px-2 py-1">
                                <Label htmlFor="sidebar-distance" className="text-xs text-sidebar-muted-foreground">
                                  Distance:
                                </Label>
                                <Input
                                  id="sidebar-distance"
                                  type="number"
                                  value={dynamicInput.dynamicDistance}
                                  onChange={(e) => onDynamicInputChange({ dynamicDistance: Number(e.target.value) })}
                                  className="h-6 text-xs mt-1"
                                  min="1"
                                  max="10000"
                                  step="1"
                                />
                              </div>
                            </SidebarMenuItem>
                          )}
                        </>
                      )}
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            </>
          )}
        </SidebarContent>
        
        {/* Footer with personal links */}
        <SidebarFooter className="border-t border-sidebar-border p-2">
          <div className="flex items-center justify-around text-xs text-sidebar-muted-foreground">
            <div>
              Vibe-coded by{' '}
              <a 
                href="https://www.estebanbasili.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sidebar-foreground hover:text-sidebar-accent-foreground font-medium transition-colors"
              >
                Esteban
              </a>
            </div>
            <div className="flex space-x-2">
              <a 
                href="https://github.com/estebanba" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sidebar-muted-foreground hover:text-sidebar-foreground transition-colors"
                title="GitHub"
              >
                <Github className="size-3.5" />
              </a>
              <a 
                href="https://linkedin.com/in/estebanbasili" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sidebar-muted-foreground hover:text-sidebar-foreground transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="size-3.5" />
              </a>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  )
}
