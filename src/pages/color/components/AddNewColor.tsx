import { ColorPicker, Flex, Input, Typography } from 'antd'
import React, { memo } from 'react'

interface Props extends React.HTMLAttributes<HTMLElement> {
  nameColor: string
  hexColor: string
  setHexColor: (hexColor: string) => void
  setNameColor: (nameColor: string) => void
}

// eslint-disable-next-line no-empty-pattern, react-refresh/only-export-components
const AddNewColor: React.FC<Props> = ({ ...props }) => {
  return (
    <Flex vertical gap={20}>
      <Typography.Title level={2}>Add new color</Typography.Title>
      <Flex vertical gap={10}>
        <Flex align='center' gap={5}>
          <Typography.Text className='w-24 flex-shrink-0'>
            Color name:
          </Typography.Text>
          <Input
            value={props.nameColor}
            onChange={(e) => props.setNameColor(e.target.value)}
            allowClear
            placeholder='Blue'
          />
        </Flex>
        <Flex align='center' gap={5}>
          <Typography.Text className='w-24 flex-shrink-0'>
            Pick color:
          </Typography.Text>
          <ColorPicker
            onChange={(_, hex) => {
              props.setHexColor(hex)
            }}
            size='large'
            showText
            defaultValue={props.hexColor}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default memo(AddNewColor)
