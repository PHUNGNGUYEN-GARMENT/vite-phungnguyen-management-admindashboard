import { Flex } from 'antd'
import useDevice from '~/components/hooks/useDevice'
import { Print } from '~/typing'
import PrintList from './components/PrintList'
import PrintTable from './components/PrintTable'

export interface PrintTableDataType extends Print {
  key?: React.Key
}

const PrintPage = () => {
  const { width } = useDevice()

  return (
    <>
      <Flex vertical gap={20}>
        {width >= 768 && <PrintTable className='' />}
        {width <= 768 && <PrintList className='' />}
      </Flex>
    </>
  )
}

export default PrintPage
