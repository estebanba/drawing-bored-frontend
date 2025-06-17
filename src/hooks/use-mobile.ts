import { useEffect, useState } from "react"

/**
 * Hook to detect if the current device is mobile
 * Uses window.matchMedia to check if screen width is less than 768px
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 767px)").matches)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
} 