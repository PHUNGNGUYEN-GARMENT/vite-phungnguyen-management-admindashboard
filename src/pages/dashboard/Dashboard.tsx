import { useEffect } from 'react'

// eslint-disable-next-line no-empty-pattern
function Dashboard() {
  console.log('Dashboard loading..')
  useEffect(() => {
    console.log('Page loaded..')
  }, [])
  return <div className='min-h-[1500px]'>Dashboard</div>
}

export default Dashboard
