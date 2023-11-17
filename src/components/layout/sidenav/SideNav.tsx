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

const items: MenuProps['items'] = [
  getItem(SideItem(appRoutes[0].name, appRoutes[0].path), appRoutes[0].key, SideIcon(appRoutes[0].icon)),
  getItem(SideItem(appRoutes[1].name, appRoutes[1].path), appRoutes[1].key, SideIcon(appRoutes[1].icon)),
  getItem(SideItem(appRoutes[2].name, appRoutes[2].path), appRoutes[2].key, SideIcon(appRoutes[2].icon)),
  getItem(SideItem(appRoutes[3].name, appRoutes[3].path), appRoutes[3].key, SideIcon(appRoutes[3].icon)),
  getItem(SideItem(appRoutes[4].name, appRoutes[4].path), appRoutes[4].key, SideIcon(appRoutes[4].icon)),
  getItem(SideItem(appRoutes[5].name, appRoutes[5].path), appRoutes[5].key, SideIcon(appRoutes[5].icon)),
  getItem(SideItem(appRoutes[6].name, appRoutes[6].path), appRoutes[6].key, SideIcon(appRoutes[6].icon)),
  { type: 'divider' },
  getItem(
    appRoutes[7].name,
    appRoutes[7].key,
    null,
    [
      getItem(
        SideItem(appRoutes[7].children![0].name, appRoutes[7].children![0].path),
        appRoutes[7].children![0].key,
        SideIcon(appRoutes[7].children![0].icon)
      ),
      getItem(
        SideItem(appRoutes[7].children![1].name, appRoutes[7].children![1].path),
        appRoutes[7].children![1].key,
        SideIcon(appRoutes[7].children![1].icon)
      ),
      getItem(
        SideItem(appRoutes[7].children![2].name, appRoutes[7].children![2].path),
        appRoutes[7].children![2].key,
        SideIcon(appRoutes[7].children![2].icon)
      ),
      getItem(
        SideItem(appRoutes[7].children![3].name, appRoutes[7].children![3].path),
        appRoutes[7].children![3].key,
        SideIcon(appRoutes[7].children![3].icon)
      ),
      getItem(
        SideItem(appRoutes[7].children![4].name, appRoutes[7].children![4].path),
        appRoutes[7].children![4].key,
        SideIcon(appRoutes[7].children![4].icon)
      )
    ],
    'group'
  )
]

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
