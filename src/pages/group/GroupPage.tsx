import { Flex } from 'antd'
import useDevice from '~/hooks/useDevice'
import GroupList from './components/GroupList'
import GroupTable from './components/GroupTable'

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
