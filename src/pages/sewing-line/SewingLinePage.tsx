import { Flex } from 'antd'
import useDevice from '~/components/hooks/useDevice'
import { ItemStatusType } from '~/typing'
import SewingLineList from './components/SewingLineList'
import SewingLineTable from './components/SewingLineTable'

export type SewingLineTableDataType = {
  key?: React.Key
  id?: number
  name?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
}

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
