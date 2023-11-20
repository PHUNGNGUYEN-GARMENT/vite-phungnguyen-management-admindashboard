import { Button, Flex, Modal, Switch } from 'antd'
import { Plus } from 'lucide-react'
import React from 'react'
import { Color } from '~/typing'
import ColorAPI from '../../services/api/services/ColorAPI'
import AddNewColor from './components/AddNewColor'
import TableColorPage, { ColorTableDataType } from './components/TableColorPage'
import { useColor } from './hooks/useColor'
import { useTable } from './hooks/useTable'

const ColorPage: React.FC = () => {
  const { loading, setLoading, handleLoadingChange, dataSource, setDataSource } = useTable()
  const { nameColor, hexColor, openModal, setOpenModal } = useColor()

  const handleAddNewItemData = () => {
    ColorAPI.createNew(nameColor, hexColor)
      .then((meta) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setLoading(true)
        const data = meta?.data as Color
        const item: ColorTableDataType = { ...data, key: data.colorID }
        setDataSource([...dataSource, item])
      })
      .finally(() => {
        setLoading(false)
        setOpenModal(false)
      })
  }

  return (
    <>
      <Flex justify='space-between'>
        <Flex>
          Loading
          <Switch checked={loading} onChange={handleLoadingChange} />
        </Flex>
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
      <Modal title='Basic Modal' open={openModal} onOk={handleAddNewItemData} onCancel={() => setOpenModal(false)}>
        <AddNewColor />
      </Modal>
    </>
  )
}

export default ColorPage
