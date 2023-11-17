import { Button, Flex, Modal } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import Table from 'antd/es/table'
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Color } from '~/typing'
import colorApi from './api/color.api'
import AddNewColor from './components/AddNewColor'
import { useColors } from './hooks/useColors'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ColorPageProps extends React.HTMLAttributes<HTMLElement> {}

export interface DataType {
  colorID: number
  nameColor: string
  createdAt: string
  updatedAt: string
  orderNumber: number
}

const columns: ColumnsType<DataType> = [
  {
    title: 'ID',
    dataIndex: 'colorID',
    key: 'colorID'
  },
  {
    title: 'Tên màu',
    dataIndex: 'nameColor',
    key: 'nameColor'
  },
  {
    title: 'Mã màu',
    dataIndex: 'hexColor',
    key: 'hexColor'
  },
  {
    title: 'Created at',
    key: 'createdAt',
    dataIndex: 'createdAt'
  },
  {
    title: 'Updated at',
    key: 'updatedAt',
    dataIndex: 'updatedAt'
  }
]

const ColorPage: React.FC = () => {
  const [openAddNew, setOpenAddNew] = useState<boolean>(false)
  const { nameColor, hexColor, setNameColor, setHexColor } = useColors()
  const [colors, setColors] = useState<Color[]>([])

  useEffect(() => {
    colorApi.getAllColors().then((res) => {
      console.log('>>> ', res)
      setColors(res.data)
    })
  }, [])

  const handleAddNew = () => {
    colorApi.createNewColor(nameColor, hexColor).then(() => {
      colorApi.getAllColors().then((res) => {
        setColors(res.data)
        setNameColor('')
        setHexColor('#ffffff')
      })
    })
  }

  return (
    <>
      <Flex gap={20} vertical className=''>
        <Flex justify='flex-end' gap={8}>
          <Button
            type='primary'
            icon={<Plus size={16} />}
            onClick={() => setOpenAddNew(true)}
            className='flex items-center'
          >
            <span>New</span>
          </Button>
        </Flex>
        <div className=''>
          <Table
            columns={columns}
            dataSource={colors.map((color) => {
              return { ...color, key: color.colorID }
            })}
          />
        </div>
      </Flex>
      <Modal
        centered
        open={openAddNew}
        onOk={handleAddNew}
        onCancel={() => setOpenAddNew(false)}
        closeIcon={false}
        okButtonProps={{ disabled: nameColor.length <= 0 }}
      >
        <AddNewColor />
      </Modal>
    </>
  )
}

export default ColorPage
