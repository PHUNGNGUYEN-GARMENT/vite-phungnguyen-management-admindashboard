import { Button, Flex, Modal, Switch } from 'antd'
import { Plus } from 'lucide-react'
import React from 'react'
import AddNewColor from './components/AddNewColor'
import TableColorPage from './components/TableColorPage'
import { useColors } from './hooks/useColors'
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

const ColorPage: React.FC = () => {
  const { loading, handleLoadingChange, handleAddNewItemData } = useTable()
  const { nameColor, hexColor, openModal, setOpenModal } = useColors()

  console.log('loading page color...')

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
      <Modal
        title='Basic Modal'
        open={openModal}
        onOk={() => handleAddNewItemData(nameColor, hexColor)}
        onCancel={() => setOpenModal(false)}
      >
        <AddNewColor />
      </Modal>
    </>
  )
}

export default ColorPage
