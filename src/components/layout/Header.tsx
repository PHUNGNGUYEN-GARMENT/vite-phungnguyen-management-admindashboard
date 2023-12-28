import { Avatar, Badge, Button, Space } from 'antd'
import { BellRing, ChevronDown, Menu } from 'lucide-react'
import React from 'react'
import { cn } from '~/utils/helpers'

interface Props extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean
  onMenuClick: (event: React.MouseEvent<HTMLElement, globalThis.MouseEvent>) => void
}

// eslint-disable-next-line no-empty-pattern
const Header: React.FC<Props> = ({ onMenuClick, ...props }) => {
  const url = 'https://www.elle.vn/wp-content/uploads/2014/07/08/Justin-Bieber-0.jpg'
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  return (
    <>
      <div
        {...props}
        className={cn('flex h-[56px] flex-row items-center justify-between gap-5 bg-card px-5', props.className)}
      >
        <div className='flex flex-row items-center justify-start gap-5'>
          <Button className='flex flex-shrink-0 lg:hidden' onClick={onMenuClick}>
            <Menu size={20} />
          </Button>
          {/* <SearchInput /> */}
        </div>
        <div className='relative flex h-full w-fit flex-row items-center justify-center gap-5'>
          <Button type='default' className='flex items-center justify-center' shape='circle'>
            <Badge size='small' count={3}>
              <BellRing size={16} />
            </Badge>
          </Button>
          <Space className=''>
            <Button onClick={() => {}} className='m-0 h-fit w-fit p-0' shape='circle' type='default'>
              <span role='img'>
                <Avatar size='large' src={<img src={url} alt='avatar' />} />
              </span>
            </Button>
            <Button className='hidden md:flex' onClick={() => {}}>
              <Space size='small'>
                <span>
                  <p>Justin Bieber</p>
                </span>
                <span>
                  <ChevronDown />
                </span>
              </Space>
            </Button>
          </Space>
        </div>
      </div>
      {/* <Modal
        open={openUserInfo}
        onOk={() => setOpenUserInfo(false)}
        onCancel={() => setOpenUserInfo(false)}
        cancelButtonProps={{ hidden: true }}
        okButtonProps={{ hidden: true }}
      >
        <UserDialog
          avatar={url}
          fullName={'Nguyễn Hữu Hậu'}
          email={'huuhau.hh47@gmail.com'}
          phone={'012345678'}
          position={'IT'}
          gender={false}
        />
      </Modal> */}
    </>
  )
}

export default Header
