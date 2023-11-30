import { useEffect, useState } from 'react'

const useDevice = () => {
  const [width, setWidth] = useState(window.innerWidth)
  const [breakpoint, setBreakpoint] = useState<
    'sm' | 'md' | 'lg' | 'xl' | '2xl'
  >('2xl')
  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth)
    // subscribe to window resize event "onComponentDidMount"
    window.addEventListener('resize', handleResizeWindow)
    return () => {
      // unsubscribe "onComponentDestroy"
      window.removeEventListener('resize', handleResizeWindow)
    }
  }, [])

  useEffect(() => {
    if (width > 0) {
      if (width >= 640) {
        setBreakpoint('sm')
      } else if (width >= 768) {
        setBreakpoint('md')
      } else if (width >= 1024) {
        setBreakpoint('lg')
      } else if (width >= 1280) {
        setBreakpoint('xl')
      } else {
        setBreakpoint('2xl')
      }
    }
  }, [width])

  return { width, breakpoint }
}

export default useDevice
