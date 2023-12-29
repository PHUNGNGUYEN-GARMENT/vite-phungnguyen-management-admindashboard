import { Button, Flex, Layout } from 'antd'
import { Menu } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { cn } from '~/utils/helpers'

const { Header: AntHeader } = Layout

interface Props extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean
  onMenuClick: (event: React.MouseEvent<HTMLElement, globalThis.MouseEvent>) => void
}

// eslint-disable-next-line no-empty-pattern
const Header: React.FC<Props> = ({ onMenuClick, ...props }) => {
  const [isHidden, setIsHidden] = useState(false)
  const [offsetY, setOffsetY] = useState<number>(0)

  // Saving last scroll position
  const lastScrollTop = useRef(0)

  const handleScroll = () => {
    const scrollYOffset = window.scrollY
    setOffsetY(scrollYOffset)
    // Visible/Unvisitable state navbar
    setIsHidden(scrollYOffset > lastScrollTop.current)
    lastScrollTop.current = scrollYOffset
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <AntHeader>
      <Flex
        {...props}
        className={cn('fixed left-0 right-0 top-0 z-[999] min-h-[56px] bg-white px-5 transition-all duration-300', {
          'shadow-sm': offsetY > 1,
          '-translate-y-full': isHidden && offsetY > 50,
          'top-0': !isHidden
        })}
      >
        <div className='flex flex-row items-center justify-start gap-5'>
          <Button className='' onClick={onMenuClick}>
            <Menu size={20} />
          </Button>
          {/* <SearchInput /> */}
        </div>
      </Flex>
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
    </AntHeader>
  )
}

export default Header
