import React from 'react'
import { Link } from 'react-router-dom'

export interface SideItemProps extends React.HTMLAttributes<HTMLElement> {
  name: string
  path: string
}

const SideItem = (name: string, path: string) => {
  return (
    <div className=''>
      <Link to={path}>
        <span>{name}</span>
      </Link>
    </div>
  )
}

export default SideItem
