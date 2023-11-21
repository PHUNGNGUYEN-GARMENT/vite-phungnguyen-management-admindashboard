interface DashboardProps extends React.HTMLAttributes<HTMLElement> {}

// eslint-disable-next-line no-empty-pattern
function Dashboard({}: DashboardProps) {
  console.log('Dashboard loading..')
  return <div className='min-h-[1500px]'>Dashboard</div>
}

export default Dashboard
