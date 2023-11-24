import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
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
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    label,
    type
  } as MenuItem
}

const items: MenuProps['items'] = appRoutes.map((route) => {
  if (route.isGroup) {
    return getItem(SideItem(route), route.key, null, 'group')
  } else {
    return getItem(SideItem(route), route.key, SideIcon(route.icon))
  }
})

// eslint-disable-next-line no-empty-pattern
const SideNav = ({ ...props }: SideNavProps) => {
  const { pathname } = useLocation()
  const [selectedKey, setSelectedKey] = useState<string>(appRoutes[0].key)

  useEffect(() => {
    const keyFound = appRoutes.find(
      (route) => route.path === lastPath(pathname)
    )
    if (keyFound) {
      setSelectedKey(keyFound.key)
    }
  }, [pathname])

  const lastPath: (pathname: string) => string = function (pathname) {
    const arrPath = pathname.split('/')
    const path = arrPath[arrPath.length - 1]
    return path
  }

  const onClick: MenuProps['onClick'] = (e) => {
    setSelectedKey(e.key)
  }

  return (
    <div {...props} className={cn('bg-white', props.className)}>
      <Link
        to={'/'}
        onClick={() => {}}
        className='relative flex justify-center py-5'
      >
        <img
          src={logo}
          alt='logo'
          className='h-10 w-10 object-contain lg:h-10 lg:w-10'
        />
      </Link>
      <Menu
        onClick={onClick}
        selectedKeys={[selectedKey]}
        defaultSelectedKeys={[selectedKey]}
        mode='inline'
        items={items}
      />
    </div>
  )
}
export default SideNav
