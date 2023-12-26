import { Flex } from 'antd'
import useDevice from '~/components/hooks/useDevice'
import { Color } from '~/typing'
import ColorList from './components/ColorList'
import ColorTable from './components/ColorTable'
// import ColorTable from './components/ColorTable'

export interface ColorTableDataType extends Color {
  key?: React.Key
}

const ColorPage = () => {
  const { width } = useDevice()

  return (
    <>
      <Flex vertical gap={20}>
        {width >= 768 && <ColorTable className='' />}
        {width <= 768 && <ColorList className='' />}
      </Flex>
    </>
  )
}

export default ColorPage
