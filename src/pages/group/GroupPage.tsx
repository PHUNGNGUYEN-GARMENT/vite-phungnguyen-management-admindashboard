import { Flex } from 'antd'
import useDevice from '~/components/hooks/useDevice'
import { ItemStatusType } from '~/typing'
import GroupList from './components/GroupList'
import GroupTable from './components/GroupTable'

export type GroupTableDataType = {
  key?: React.Key
  id?: number
  name?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
  orderNumber?: number
}

const GroupPage = () => {
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

export default GroupPage
