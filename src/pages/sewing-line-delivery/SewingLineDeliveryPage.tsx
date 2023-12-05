import { Flex } from 'antd'
import useDevice from '~/hooks/useDevice'
import GroupList from './components/SewingLineDeliveryList'
import GroupTable from './components/SewingLineDeliveryTable'

const SewingLineDeliveryPage = () => {
  const { width } = useDevice()

  return (
    <>
      <Flex vertical gap={20}>
        {width >= 768 && <GroupTable className='' />}
        {width <= 768 && <GroupList className='' />}
      </Flex>
    </>
  )
}

export default SewingLineDeliveryPage
