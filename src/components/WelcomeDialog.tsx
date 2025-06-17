import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Info, Palette, MousePointer, Zap } from 'lucide-react'

/**
 * Welcome Dialog Component
 * Shows an introductory message and analytics notice on first visit
 */
export function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if user has seen the welcome dialog before
    const hasSeenWelcome = localStorage.getItem('drawing-bored-welcome-seen')
    
    if (!hasSeenWelcome) {
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    // Mark as seen so it won't show again
    localStorage.setItem('drawing-bored-welcome-seen', 'true')
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Welcome to Drawing Bored!
          </DialogTitle>
          <DialogDescription className="text-left space-y-3">
            <p>
              A professional 2D geometry application for creating precise technical drawings, 
              educational demonstrations, and geometric constructions.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Quick Tips:
              </h4>
              <ul className="text-sm space-y-1 pl-6">
                <li className="flex items-center gap-2">
                  <MousePointer className="h-3 w-3" />
                  Use the sidebar tools to draw points, lines, circles, and more
                </li>
                <li className="flex items-center gap-2">
                  <MousePointer className="h-3 w-3" />
                  Pan with middle-click or Shift+click, zoom with scroll wheel
                </li>
                <li className="flex items-center gap-2">
                  <MousePointer className="h-3 w-3" />
                  Enable grid snapping for precise alignment
                </li>
              </ul>
            </div>

            <div className="bg-muted p-3 rounded-md">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <strong>Privacy Notice:</strong> This site uses cookieless analytics to understand visitor behavior.
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleClose} className="w-full">
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 