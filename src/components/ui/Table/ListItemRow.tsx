/* eslint-disable react-refresh/only-export-components */
import { Flex, Form, Typography } from 'antd'
import React, { memo } from 'react'

interface Props extends React.HTMLAttributes<HTMLElement> {
  label: string
  render: React.ReactNode
  renderEditing?: React.ReactNode
  isEditing?: boolean
  name?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValue?: any
}

const ListItemRow: React.FC<Props> = ({ label, render, renderEditing, isEditing, name, initialValue, ...props }) => {
  return (
    <Flex {...props} align='center' justify='start' gap={5}>
      <Typography.Text type='secondary' className='w-40 font-medium'>
        {label}
      </Typography.Text>
      {isEditing ? (
        <Form.Item name={name} initialValue={initialValue} className='m-0 w-full'>
          {renderEditing}
        </Form.Item>
      ) : (
        <Flex className='w-full' align='center' justify='start'>
          {render}
        </Flex>
      )}
    </Flex>
  )
}

export default memo(ListItemRow)
