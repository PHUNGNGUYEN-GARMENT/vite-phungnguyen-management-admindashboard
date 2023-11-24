import { Flex, Input, Typography } from 'antd'
import React, { memo } from 'react'

interface Props extends React.HTMLAttributes<HTMLElement> {
  sewingLineDelivery: string
  setSewingLineDelivery: (sewingLineDelivery: string) => void
}

// eslint-disable-next-line no-empty-pattern, react-refresh/only-export-components
const AddNewSewingLineDelivery: React.FC<Props> = ({ ...props }) => {
  return (
    <Flex vertical gap={20}>
      <Typography.Title level={2}>
        Add new sewing line delivery
      </Typography.Title>
      <Flex align='center' gap={5}>
        <Typography.Text className='w-24 flex-shrink-0'>
          Chuyền may:
        </Typography.Text>
        <Input
          value={props.sewingLineDelivery}
          onChange={(e) => props.setSewingLineDelivery(e.target.value)}
          allowClear
          placeholder='Tên chuyền may..'
        />
      </Flex>
    </Flex>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default memo(AddNewSewingLineDelivery)
