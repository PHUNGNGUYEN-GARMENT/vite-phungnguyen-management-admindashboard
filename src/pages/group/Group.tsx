import { Button, Flex, Form, Modal, Popconfirm, Table, Typography } from 'antd'
import { AnyObject } from 'antd/es/_util/type'
import { Plus } from 'lucide-react'
import React from 'react'
import DayJS from '~/utils/date-formatter'
import { firstLetterUppercase } from '~/utils/text'
import AddNewGroup from './components/AddNewGroup'
import EditableCell, { EditableTableProps } from './components/EditableCell'
import useGroup from './hooks/useGroup'
import useGroupTable from './hooks/useGroupTable'

export interface GroupTableDataType {
  key: React.Key
  groupID: number
  name: string
  createdAt: string
  updatedAt: string
  orderNumber: number
}

// eslint-disable-next-line react-refresh/only-export-components
const GroupPage = () => {
  const { name, setName, openModal, setOpenModal } = useGroup()
  const {
    form,
    loading,
    dataSource,
    editingKey,
    handleSaveEditing,
    isEditing,
    handleCancelConfirmDelete,
    handleAddNewItemData,
    handleEdit,
    handleDelete,
    handleCancelEditing,
    handleDeleteRow
  } = useGroupTable()

  type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

  const columns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: 'ID',
      dataIndex: 'groupID',
      width: '5%',
      editable: true
    },
    {
      title: 'Name group',
      dataIndex: 'name',
      width: '20%',
      editable: true,
      filters: dataSource.map((item) => {
        return { value: item.name, text: item.name }
      }),
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.nameColor.includes(value)
    },
    {
      title: 'Created date',
      dataIndex: 'updatedAt',
      width: '15%',
      editable: true,
      render(value) {
        return (
          <Typography.Text className='text-sm'>
            {firstLetterUppercase(DayJS(value).toNow())}
          </Typography.Text>
        )
      }
    },
    {
      title: 'Updated date',
      dataIndex: 'createdAt',
      width: '15%',
      editable: true,
      render(value) {
        return (
          <Typography.Text className='text-sm'>
            {firstLetterUppercase(DayJS(value).toNow())}
          </Typography.Text>
        )
      }
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: AnyObject) => {
        const editable = isEditing(record as GroupTableDataType)
        // const deletable = isDelete(record as GroupTableDataType)
        return editable ? (
          <Flex gap={30}>
            <Typography.Link onClick={() => handleSaveEditing(record.key)}>
              Save
            </Typography.Link>
            <Popconfirm
              title={`Sure to cancel?`}
              onConfirm={handleCancelEditing}
            >
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
                form.setFieldsValue({
                  name: '',
                  createdAt: '',
                  updatedAt: '',
                  ...record
                })
                handleEdit(record as GroupTableDataType)
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
      onCell: (record: GroupTableDataType) => ({
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
      <Flex vertical gap={30}>
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
            pagination={{
              onChange: () => {
                handleCancelEditing()
                handleCancelConfirmDelete()
              }
            }}
          />
        </Form>
      </Flex>
      <Modal
        title='Basic Modal'
        open={openModal}
        onOk={() => {
          handleAddNewItemData(name)
          setOpenModal(false)
        }}
        onCancel={() => setOpenModal(false)}
      >
        <AddNewGroup name={name} setName={setName} />
      </Modal>
    </>
  )
}

export default GroupPage
