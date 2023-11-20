import { Button, Flex, Modal, Switch } from 'antd'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import ColorAPI from '~/services/api/services/ColorAPI'
import { Color } from '~/typing'
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

const ColorPage: React.FC = () => {
  const { loading, handleLoadingChange } = useTable()
  const { nameColor, hexColor, openModal, setOpenModal } = useColor()
  const [dataSource, setDataSource] = useState<ColorTableDataType[]>([])

  console.log('loading page color...')

  const handleAddNewItemData = (nameColor: string, hexColor: string) => {
    ColorAPI.createNew(nameColor, hexColor).then((meta) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = meta?.data as Color
      const item: ColorTableDataType = { ...data, key: data.colorID }
      console.log(item)
      setDataSource([...dataSource, item])
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
      <TableColorPage dataSource={dataSource} setDataSource={setDataSource} />
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

export default ColorPage
