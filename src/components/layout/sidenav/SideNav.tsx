import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import logo from '~/assets/logo.svg'
import { cn } from '~/utils/helpers'
import { appRoutes } from '~/utils/route'
import SideIcon from './SideIcon'
import SideItem from './SideItem'

export interface SideNavProps extends React.HTMLAttributes<HTMLElement> {
  onSelectedItem?: () => void
}

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type
  } as MenuItem
}

const items: MenuProps['items'] = appRoutes.map((route) => {
  if (route.isGroup) {
    return getItem(
      SideItem(route),
      route.key,
      null,
      route.children!.map((child) => {
        return getItem(SideItem(child), child.key, SideIcon(child.icon))
      }),
      'group'
    )
  } else {
    return getItem(SideItem(route), route.key, SideIcon(route.icon))
  }
})

// eslint-disable-next-line no-empty-pattern
const SideNav = ({ ...props }: SideNavProps) => {
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e)
  }

  return (
    <div {...props} className={cn('bg-white', props.className)}>
      <Link to={'/'} onClick={() => {}} className='relative flex justify-center py-5'>
        <img src={logo} alt='logo' className='h-10 w-10 object-contain lg:h-10 lg:w-10' />
      </Link>
      <Menu onClick={onClick} defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} mode='inline' items={items} />
    </div>
  )
}
export default SideNav
