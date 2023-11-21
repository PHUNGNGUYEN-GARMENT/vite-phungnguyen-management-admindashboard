import { Button, Flex, Modal, Switch } from 'antd'
import { Plus, ThermometerSunIcon } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { handleToggleTheme } from '~/redux/actions'
import AddNewColor from './components/AddNewColor'
import TableColorPage from './components/TableColorPage'
import useColor from './hooks/useColor'
import useTable from './hooks/useTable'

export interface ColorTableDataType {
  key: React.Key
  colorID: number
  nameColor: string
  hexColor: string
  createdAt: string
  updatedAt: string
  orderNumber: number
}

// eslint-disable-next-line react-refresh/only-export-components
const ColorPage: React.FC = () => {
  const { loading, handleLoadingChange, handleAddNewItemData } = useTable()
  const { nameColor, hexColor, openModal, setOpenModal } = useColor()
  const theme = useSelector(state => state.theme)
  const dispatch = useDispatch()
  // const [dataSource, setDataSource] = useState<ColorTableDataType[]>([])

  // const handleAddNewItemData = (nameColor: string, hexColor: string) => {
  //   ColorAPI.createNew(nameColor, hexColor).then((meta) => {
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     const data = meta?.data as Color
  //     const item: ColorTableDataType = { ...data, key: data.colorID }
  //     console.log(item)
  //     setDataSource([...dataSource, item])
  //   })
  // }

  return (
    <>
      <Flex justify='space-between'>
        <Flex>
          Loading
          <Switch checked={loading} onChange={handleLoadingChange} />
        </Flex>

        <Button
          onClick={() => {
            dispatch(handleToggleTheme())
          }}
          className='flex items-center'
          type='primary'
          icon={<ThermometerSunIcon size={20} />}
        >
          Toggle theme
        </Button>

        <Button
          onClick={() => setOpenModal(true)}
          className='flex items-center'
          type='primary'
          icon={<Plus size={20} />}
        >
          New
        </Button>
      </Flex>
      <TableColorPage />
      <Modal
        title='Basic Modal'
        open={openModal}
        onOk={() => {
          handleAddNewItemData(nameColor, hexColor)
          setOpenModal(false)
        }}
        onCancel={() => setOpenModal(false)}
      >
        <AddNewColor />
      </Modal>
    </>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default ColorPage
