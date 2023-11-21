import { Button, Flex, Form, Modal, Popconfirm, Table, Typography } from 'antd'
import { AnyObject } from 'antd/es/_util/type'
import { Plus } from 'lucide-react'
import React, { useEffect } from 'react'
import { dateDistance } from '~/utils/date-formatter'
import { cn } from '~/utils/helpers'
import { firstLetterUppercase } from '~/utils/text'
import AddNewColor from './components/AddNewColor'
import EditableCell, { EditableTableProps } from './components/EditableCell'
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
const ColorPage = () => {
  const { nameColor, hexColor, setNameColor, setHexColor, openModal, setOpenModal } = useColor()
  const {
    form,
    loading,
    dataSource,
    editingKey,
    handleSaveEditing,
    isEditing,
    handleCancelConfirmDelete,
    handleToggleLoading,
    handleLoadingChange,
    handleAddNewItemData,
    handleEdit,
    handleDelete,
    handleCancelEditing,
    handleDeleteRow
  } = useTable()

  useEffect(() => {
    console.log(loading)
  }, [loading])

  type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

  const columns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'ID',
      dataIndex: 'colorID',
      width: '5%',
      editable: true
    },
    {
      title: 'Name color',
      dataIndex: 'nameColor',
      width: '20%',
      editable: true,
      filters: dataSource.map((item) => {
        return { value: item.nameColor, text: item.nameColor }
      }),
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.nameColor.includes(value)
    },
    {
      title: 'Hex color',
      dataIndex: 'hexColor',
      width: '20%',
      editable: true,
      render: (hex) => (
        <div
          style={{
            backgroundColor: `${hex}`
          }}
          className={cn('flex-items flex w-16 justify-center rounded-sm font-semibold text-white', {
            'text-foreground': hex === '#ffffff',
            'text-background': hex === '#000000'
          })}
        >
          <span>{hex}</span>
        </div>
      )
    },
    {
      title: 'Created date',
      dataIndex: 'updatedAt',
      width: '15%',
      editable: true,
      render(value) {
        return <Typography.Text className='text-sm'>{firstLetterUppercase(dateDistance(value))}</Typography.Text>
      }
    },
    {
      title: 'Updated date',
      dataIndex: 'createdAt',
      width: '15%',
      editable: true,
      render(value) {
        return <Typography.Text className='text-sm'>{firstLetterUppercase(dateDistance(value))}</Typography.Text>
      }
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: AnyObject) => {
        const editable = isEditing(record as ColorTableDataType)
        // const deletable = isDelete(record as ColorTableDataType)
        return editable ? (
          <Flex gap={30}>
            <Typography.Link onClick={() => handleSaveEditing(record.key)}>Save</Typography.Link>
            <Popconfirm title={`Sure to cancel?`} onConfirm={handleCancelEditing}>
              <a>Cancel</a>
            </Popconfirm>
          </Flex>
        ) : (
          <Flex gap={30}>
            {/* <Typography.Link disabled={editingKey !== ''} onClick={() => handleEdit(record as Item)}>
              Edit
              </Typography.Link> */}
            <Button
              type='dashed'
              disabled={editingKey !== ''}
              onClick={() => {
                form.setFieldsValue({ nameColor: '', hexColor: '', createdAt: '', updatedAt: '', ...record })
                handleEdit(record as ColorTableDataType)
              }}
            >
              Edit
            </Button>

            <Popconfirm
              title={`Sure to delete?`}
              onCancel={handleCancelConfirmDelete}
              onConfirm={() => handleDeleteRow(record.key)}
            >
              <Button danger onClick={() => handleDelete(record.key)}>
                Delete
              </Button>
            </Popconfirm>
          </Flex>
        )
      }
    }
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: ColorTableDataType) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  }) as ColumnTypes

  return (
    <>
      <Flex justify='flex-end'>
        <Button
          onClick={() => setOpenModal(true)}
          className='flex items-center'
          type='primary'
          icon={<Plus size={20} />}
        >
          New
        </Button>
      </Flex>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell
            }
          }}
          loading={loading}
          bordered
          dataSource={dataSource}
          columns={mergedColumns}
          rowClassName='editable-row'
          // onChange={(pagination, filter, sorter, extra) => {
          //   extra.currentDataSource = dataSource
          // }}
          pagination={{
            onChange: () => {
              handleCancelEditing()
              handleCancelConfirmDelete()
            }
          }}
        />
      </Form>
      <Modal
        title='Basic Modal'
        open={openModal}
        onOk={() => {
          handleAddNewItemData(nameColor, hexColor)
          setOpenModal(false)
        }}
        onCancel={() => setOpenModal(false)}
      >
        <AddNewColor nameColor={nameColor} setNameColor={setNameColor} hexColor={hexColor} setHexColor={setHexColor} />
      </Modal>
    </>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default ColorPage
