/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { Flex, Typography } from 'antd'
import React, { memo } from 'react'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { cn } from '~/utils/helpers'
import EditableStateCell, { EditableStateCellProps } from './EditableStateCell'

interface Props extends EditableStateCellProps {
  label: string | React.ReactNode
  children?: React.ReactNode
}

const ListItemRow = ({ ...props }: Props) => {
  return (
    <Flex className={cn('w-full', props.className)} align='center' justify='start' gap={5}>
      {typeof props.label !== 'string' ? (
        props.label
      ) : (
        <Typography.Text className='w-full font-semibold'>{props.label}</Typography.Text>
      )}
      <EditableStateCell {...props} title={props.title ? (typeof props.label === 'string' ? props.label : '') : ''}>
        {props.children ? (
          props.children
        ) : (
          <Typography.Text type='secondary' className='w-full font-medium'>
            {props.inputType !== 'datepicker' ? props.value : DayJS(props.value).format(DatePattern.display)}
          </Typography.Text>
        )}
      </EditableStateCell>
    </Flex>
  )
}

export default memo(ListItemRow)
