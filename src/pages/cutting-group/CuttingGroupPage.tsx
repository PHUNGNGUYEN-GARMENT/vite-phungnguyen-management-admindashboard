import { Flex } from 'antd'
import useDevice from '~/components/hooks/useDevice'
import SampleSewingList from './components/SampleSewingList'
import SampleSewingTable from './components/CuttingGroupTable'

const SampleSewingPage = () => {
  const { width } = useDevice()
  return (
    <>
      <Flex vertical gap={20}>
        {width >= 768 && <SampleSewingTable />}
        {width <= 768 && <SampleSewingList />}
      </Flex>
    </>
  )
}

export default SampleSewingPage
