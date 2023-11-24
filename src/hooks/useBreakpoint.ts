import { useEffect, useState } from 'react'

type DeviceType = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<DeviceType>('md')

  useEffect(() => {
    if (window.matchMedia('only screen and (max-width: 640px)').matches) {
      setBreakpoint('sm')
    } else if (
      window.matchMedia('only screen and (max-width: 768px)').matches
    ) {
      setBreakpoint('md')
    } else if (
      window.matchMedia('only screen and (max-width: 1024px)').matches
    ) {
      setBreakpoint('lg')
    } else if (
      window.matchMedia('only screen and (max-width: 1280px)').matches
    ) {
      setBreakpoint('xl')
    } else {
      setBreakpoint('2xl')
    }
  }, [window.innerWidth])

  return { breakpoint, setBreakpoint }
}

export default useBreakpoint
