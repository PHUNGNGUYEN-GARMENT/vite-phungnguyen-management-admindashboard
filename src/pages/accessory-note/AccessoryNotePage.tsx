import { Flex } from 'antd'
import useDevice from '~/components/hooks/useDevice'
import AccessoryNoteList from './components/AccessoryNoteList'
import AccessoryNoteTable from './components/AccessoryNoteTable'

const AccessoryNotePage = () => {
  const { width } = useDevice()

  return (
    <>
      <Flex vertical gap={20}>
        {width >= 768 && <AccessoryNoteTable className='' />}
        {width <= 768 && <AccessoryNoteList className='' />}
      </Flex>
    </>
  )
}

export default AccessoryNotePage
