import { Flex } from 'antd'
import useDevice from '~/hooks/useDevice'
import ColorList from './components/ColorList'
import ColorTable from './components/ColorTable'

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
