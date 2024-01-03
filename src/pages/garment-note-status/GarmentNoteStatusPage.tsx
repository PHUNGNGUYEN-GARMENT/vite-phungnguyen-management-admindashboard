import { Flex } from 'antd'
import useDevice from '~/components/hooks/useDevice'
import AccessoryNoteList from './components/AccessoryNoteList'
import GarmentNoteStatusTable from './components/GarmentNoteStatusTable'

const GarmentNoteStatusPage = () => {
  const { width } = useDevice()

  return (
    <>
      <Flex vertical gap={20}>
        {width >= 768 && <GarmentNoteStatusTable className='' />}
        {width <= 768 && <AccessoryNoteList className='' />}
      </Flex>
    </>
  )
}

export default GarmentNoteStatusPage
