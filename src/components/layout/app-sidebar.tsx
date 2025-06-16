// All sidebar UI components are now imported using a relative path to resolve linter errors.
import * as React from "react"
import { Logotype } from "@/components/ui/logotype"
import { 
  LayoutDashboard, 
  Settings,
  Compass,
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
  Info
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarTrigger,
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

/**
 * Minimal sidebar structure with just essential navigation.
 * Clean and simple structure that can be extended as needed.
 */
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      items: [
        { title: "Overview", url: "/dashboard" },
      ],
    },
    {
      title: "2D Board",
      url: "/euclid-sandbox",
      icon: Compass,
      items: [
        { title: "Geometry Canvas", url: "/euclid-sandbox" },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        { title: "General", url: "/settings/general" },
      ],
    },
  ],
}

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
  ...props 
}: AppSidebarProps) {
  const [constructionsOpen, setConstructionsOpen] = React.useState(false)
  const [settingsOpen, setSettingsOpen] = React.useState(false)

  return (
    <TooltipProvider>
      <Sidebar variant="floating" {...props}>
        {/* Clean sidebar header with logo and app name */}
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <a href="/dashboard">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <Logotype />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-semibold">Drawing Bored</span>
                      <span className="text-xs text-sidebar-muted-foreground">Dashboard</span>
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarTrigger className="ml-auto" />
          </div>
        </SidebarHeader>
        
        {/* Navigation and Tools */}
        <SidebarContent>
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarMenu className="gap-2">
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="font-medium">
                      <item.icon className="size-4" />
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                      {item.items.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={item.url} className="text-sidebar-muted-foreground hover:text-sidebar-foreground">
                              {item.title}
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarSeparator />

          {/* CAD Toolbars - Only show when on 2D Board */}
          {showGeometryTools && (
            <>
              {/* Draw Toolbar */}
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-medium text-sidebar-muted-foreground">
                  Draw
                </SidebarGroupLabel>
                <SidebarMenu className="gap-1">
                  <div className="grid grid-cols-4 gap-2 p-2">
                    {drawTools.map((tool) => (
                      <Tooltip key={tool.id}>
                        <TooltipTrigger asChild>
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              onClick={() => onToolSelect?.(tool.id)}
                              className={`h-10 w-10 p-0 flex items-center justify-center ${selectedTool === tool.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                              size="sm"
                            >
                              <tool.icon className="size-4" />
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

              <SidebarSeparator />

              {/* Modify Toolbar */}
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-medium text-sidebar-muted-foreground">
                  Modify
                </SidebarGroupLabel>
                <SidebarMenu className="gap-1">
                  <div className="grid grid-cols-4 gap-2 p-2">
                    {modifyTools.map((tool) => (
                      <Tooltip key={tool.id}>
                        <TooltipTrigger asChild>
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              onClick={() => onToolSelect?.(tool.id)}
                              className={`h-10 w-10 p-0 flex items-center justify-center ${selectedTool === tool.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                              size="sm"
                            >
                              <tool.icon className="size-4" />
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

              <SidebarSeparator />

              {/* Properties Toolbar */}
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-medium text-sidebar-muted-foreground">
                  Properties
                </SidebarGroupLabel>
                <SidebarMenu className="gap-1">
                  <div className="grid grid-cols-2 gap-2 p-2">
                    {propertyTools.map((tool) => (
                      <Tooltip key={tool.id}>
                        <TooltipTrigger asChild>
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              onClick={() => onToolSelect?.(tool.id)}
                              className={`h-10 w-10 p-0 flex items-center justify-center ${selectedTool === tool.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                              size="sm"
                            >
                              <tool.icon className="size-4" />
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

              <SidebarSeparator />

              {/* View Controls */}
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-medium text-sidebar-muted-foreground">
                  View
                </SidebarGroupLabel>
                <SidebarMenu className="gap-1">
                  <div className="grid grid-cols-2 gap-2 p-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            onClick={onToggleIntersections}
                            className="h-10 w-10 p-0 flex items-center justify-center"
                            size="sm"
                          >
                            {showIntersections ? (
                              <Eye className="size-4" />
                            ) : (
                              <EyeOff className="size-4" />
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{showIntersections ? 'Hide' : 'Show'} Intersections (F3)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </SidebarMenu>
              </SidebarGroup>

              <SidebarSeparator />

              {/* Classical Constructions - Collapsible */}
              <Collapsible open={constructionsOpen} onOpenChange={setConstructionsOpen}>
                <SidebarGroup>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="flex w-full items-center justify-between text-xs font-medium text-sidebar-muted-foreground hover:text-sidebar-foreground">
                      Constructions
                      {constructionsOpen ? (
                        <ChevronDown className="size-3" />
                      ) : (
                        <ChevronRight className="size-3" />
                      )}
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarMenu className="gap-1 mt-2">
                      {constructions.map((construction) => (
                        <SidebarMenuItem key={construction.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                onClick={() => onConstructionSelect?.(construction.id)}
                                className={`h-8 justify-start ${currentConstruction === construction.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                                size="sm"
                              >
                                <construction.icon className="size-4" />
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

              <SidebarSeparator />

              {/* Settings - Collapsible */}
              <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
                <SidebarGroup>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="flex w-full items-center justify-between text-xs font-medium text-sidebar-muted-foreground hover:text-sidebar-foreground">
                      Settings
                      {settingsOpen ? (
                        <ChevronDown className="size-3" />
                      ) : (
                        <ChevronRight className="size-3" />
                      )}
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarMenu className="gap-1 mt-2">
                      {/* Dark Mode Toggle */}
                      <SidebarMenuItem>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton
                              onClick={onToggleDarkMode}
                              className="h-8 justify-start"
                              size="sm"
                            >
                              {isDarkMode ? (
                                <Sun className="size-4" />
                              ) : (
                                <Moon className="size-4" />
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
                              className={`h-8 justify-start ${showHelpOverlay ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                              size="sm"
                            >
                              <HelpCircle className="size-4" />
                              <span className="text-xs">Help & Shortcuts</span>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>Show help overlay</p>
                          </TooltipContent>
                        </Tooltip>
                      </SidebarMenuItem>

                      {/* Info Panel Toggle */}
                      <SidebarMenuItem>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton
                              onClick={onToggleInfoPanel}
                              className={`h-8 justify-start ${showInfoPanel ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                              size="sm"
                            >
                              <Info className="size-4" />
                              <span className="text-xs">Canvas Info</span>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>Toggle info panel</p>
                          </TooltipContent>
                        </Tooltip>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            </>
          )}
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  )
}
