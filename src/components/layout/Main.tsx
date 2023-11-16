import { Drawer, Layout } from 'antd'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
import SideNav from './sidenav/SideNav'

const { Sider, Header: AntHeader, Content } = Layout

const Main: React.FC = () => {
  const [breakpoint, setBreakpoint] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout className='w-full bg-background'>
      <Drawer
        title={false}
        placement='left'
        closable={true}
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
        width={250}
        className='m-0 p-0'
      >
        <Layout>
          <Sider trigger={null}>
            <SideNav onSelectedItem={() => setOpenDrawer(false)} />
          </Sider>
        </Layout>
      </Drawer>
      <Sider
        breakpoint='lg'
        onBreakpoint={(state) => {
          setBreakpoint(state)
          setCollapsed(state)
        }}
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={250}
      >
        <SideNav />
      </Sider>
      <Layout className=''>
        <AntHeader className='h-fit p-0'>
          <Header
            collapsed={collapsed}
            onMenuClick={() => {
              if (breakpoint) {
                setOpenDrawer(true)
              } else {
                setCollapsed(!collapsed)
              }
            }}
          />
        </AntHeader>
        <Content className=''>
          <Outlet />
        </Content>
        <Footer className=''>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  )
}

export default Main
