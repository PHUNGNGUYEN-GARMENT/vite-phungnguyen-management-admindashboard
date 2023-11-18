import { ColorPicker, Flex, Input, Typography } from 'antd'
import { useColorPage } from '../hooks/useColorPage'

interface AddNewColorProps extends React.HTMLAttributes<HTMLElement> {}

// eslint-disable-next-line no-empty-pattern
function AddNewColor({}: AddNewColorProps) {
  const { hexColor, nameColor, setHexColor, setNameColor } = useColorPage()

  return (
    <Flex vertical gap={20}>
      <Typography.Title level={2}>Add new color</Typography.Title>
      <Flex vertical gap={10}>
        <Flex align='center' gap={5}>
          <Typography.Text className='w-24 flex-shrink-0'>Color name:</Typography.Text>
          <Input value={nameColor} onChange={(e) => setNameColor(e.target.value)} allowClear placeholder='Blue' />
        </Flex>
        <Flex align='center' gap={5}>
          <Typography.Text className='w-24 flex-shrink-0'>Pick color:</Typography.Text>
          <ColorPicker
            onChange={(_, hex) => {
              setHexColor(hex)
            }}
            size='large'
            showText
            defaultValue={hexColor}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default AddNewColor
