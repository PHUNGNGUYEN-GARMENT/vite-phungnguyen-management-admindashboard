import { Flex } from 'antd'
import useDevice from '~/components/hooks/useDevice'
import SewingLineDeliveryList from './components/SewingLineDeliveryList'
import SewingLineDeliveryTable from './components/SewingLineDeliveryTable'

const SewingLineDeliveryPage = () => {
  const { width } = useDevice()

  return (
    <>
      <Flex vertical gap={20}>
        {width >= 768 && <SewingLineDeliveryTable className='' />}
        {width <= 768 && <SewingLineDeliveryList className='' />}
      </Flex>
    </>
  )
}

export default SewingLineDeliveryPage
