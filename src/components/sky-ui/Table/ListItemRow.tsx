/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { Flex, Typography } from 'antd'
import React, { memo } from 'react'
import { cn } from '~/utils/helpers'
import EditableCellNew, { EditableCellNewProps } from './EditableCellNew'

interface Props extends EditableCellNewProps {
  label: string | React.ReactNode
  value?: any
  children?: React.ReactNode
}

const ListItemRow = ({ value, children, ...props }: Props) => {
  return (
    <Flex className={cn('w-full', props.className)} align='center' justify='start' gap={5}>
      {typeof props.label !== 'string' ? (
        props.label
      ) : (
        <Typography.Text className='w-full font-semibold'>{props.label}</Typography.Text>
      )}
      <EditableCellNew
        isEditing={props.isEditing}
        dataIndex={props.dataIndex}
        title={props.title ? (typeof props.label === 'string' ? props.label : '') : ''}
        inputType={props.inputType}
        initialField={props.initialField}
        required={props.required}
      >
        {children ? (
          children
        ) : (
          <Typography.Text type='secondary' className='w-full font-medium'>
            {value}
          </Typography.Text>
        )}
      </EditableCellNew>
    </Flex>
  )
}

export default memo(ListItemRow)
