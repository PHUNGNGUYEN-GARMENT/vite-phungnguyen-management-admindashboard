import { Flex, Input, Typography } from 'antd'
import React, { memo } from 'react'

interface Props extends React.HTMLAttributes<HTMLElement> {
  name: string
  setName: (name: string) => void
}

// eslint-disable-next-line no-empty-pattern, react-refresh/only-export-components
const AddNewGroup: React.FC<Props> = ({ ...props }) => {
  return (
    <Flex vertical gap={20}>
      <Typography.Title level={2}>Add new group</Typography.Title>
      <Flex align='center' gap={5}>
        <Typography.Text className='w-24 flex-shrink-0'>Group name:</Typography.Text>
        <Input value={props.name} onChange={(e) => props.setName(e.target.value)} allowClear placeholder='Name..' />
      </Flex>
    </Flex>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default memo(AddNewGroup)
