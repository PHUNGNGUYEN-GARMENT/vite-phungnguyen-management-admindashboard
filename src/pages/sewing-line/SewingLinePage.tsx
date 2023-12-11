import { Flex } from 'antd'
import useDevice from '~/components/hooks/useDevice'
import SewingLineList from './components/SewingLineList'
import SewingLineTable from './components/SewingLineTable'

const SewingLinePage = () => {
  const { width } = useDevice()

  return (
    <>
      <Flex vertical gap={20}>
        {width >= 768 && <SewingLineTable className='' />}
        {width <= 768 && <SewingLineList className='' />}
      </Flex>
    </>
  )
}

export default SewingLinePage
