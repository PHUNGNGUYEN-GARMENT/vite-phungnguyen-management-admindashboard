import { Flex } from 'antd'
import useDevice from '~/hooks/useDevice'
import ImportationList from './components/ImportationList'
import ImportationTable from './components/ImportationTable'

function ImportationPage() {
  const { width } = useDevice()

  return (
    <>
      <Flex vertical gap={20}>
        {width >= 768 && <ImportationTable className='' />}
        {width <= 768 && <ImportationList className='' />}
      </Flex>
    </>
  )
}

export default ImportationPage
