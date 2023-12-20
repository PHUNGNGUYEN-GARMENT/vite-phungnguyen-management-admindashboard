/* eslint-disable react-refresh/only-export-components */
import { Breakpoint, Divider, Flex, Form, Typography } from 'antd'
import React, { memo, useEffect, useState } from 'react'
import { InputType } from '~/typing'
import { cn } from '~/utils/helpers'

export type ItemWithKeyAndTitleType = {
  key?: React.Key
  title?: string | React.ReactNode
  desc?: string | React.ReactNode
  editable?: boolean
  inputType?: InputType
  responsive?: Breakpoint[]
}

interface Props<T extends ItemWithKeyAndTitleType> extends React.HTMLAttributes<HTMLElement> {
  item: T
  isEditing?: boolean
}

const ListableExpandedRowItem = <T extends ItemWithKeyAndTitleType>({ ...props }: Props<T>) => {
  const [responsive, setResponsive] = useState<{
    xxl?: Breakpoint
    xl?: Breakpoint
    lg?: Breakpoint
    md?: Breakpoint
    sm?: Breakpoint
    xs?: Breakpoint
  }>()

  useEffect(() => {
    if (props.item.responsive) {
      props.item.responsive.forEach((i) => {
        switch (i) {
          case 'xxl':
            setResponsive({ xxl: i })
            break
          case 'xl':
            setResponsive({ xl: i })
            break
          case 'lg':
            setResponsive({ lg: i })
            break
          case 'md':
            setResponsive({ md: i })
            break
          case 'sm':
            setResponsive({ sm: i })
            break
          default:
            setResponsive({ xs: i })
        }
      })
    }
  }, [props.item.responsive])

  return (
    <Flex
      vertical
      className={cn('w-auto', {
        'sm:hidden': responsive?.sm,
        'md:hidden': responsive?.md,
        'lg:hidden': responsive?.lg,
        'xl:hidden': responsive?.xl
      })}
    >
      <Flex className='w-full' align='center' justify='start' gap={5}>
        {props.item.title && <Typography.Text className='m-0 w-40 font-bold'>{props.item.title}</Typography.Text>}
        {props.isEditing ? (
          <Form.Item></Form.Item>
        ) : props.item.desc ? (
          props.item.desc
        ) : (
          <Typography.Text type='secondary' className='m-0 w-40 font-medium'>
            {props.item.desc}
          </Typography.Text>
        )}
      </Flex>
      <Divider />
    </Flex>
  )
}

export default memo(ListableExpandedRowItem)
