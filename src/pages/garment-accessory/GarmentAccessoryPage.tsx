import { Flex } from 'antd'
import useDevice from '~/components/hooks/useDevice'
import AccessoryNoteList from './components/AccessoryNoteList'
import GarmentAccessoryTable from './components/GarmentAccessoryTable'

const GarmentAccessoryPage = () => {
  const { width } = useDevice()

  return (
    <>
      <Flex vertical gap={20}>
        {width >= 768 && <GarmentAccessoryTable className='' />}
        {width <= 768 && <AccessoryNoteList className='' />}
      </Flex>
    </>
  )
}

export default GarmentAccessoryPage
