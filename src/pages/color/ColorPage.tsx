import { Button, Flex, Form, Input, InputNumber, Modal, Popconfirm, Switch, Table, Typography } from 'antd'
import { AnyObject } from 'antd/es/_util/type'
import { Plus } from 'lucide-react'
import React, { useEffect } from 'react'
import { Color } from '~/typing'
import colorApi from './api/color.api'
import AddNewColor from './components/AddNewColor'
import { useColorPage } from './hooks/useColorPage'
import { useTable } from './hooks/useTable'

export interface IColor {
  key: React.Key
  colorID: number
  nameColor: string
  hexColor: string
  createdAt: string
  updatedAt: string
  orderNumber: number
}

type EditableTableProps = Parameters<typeof Table>[0]
type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  title: any
  inputType: 'number' | 'text'
  record: IColor
  index: number
  children: React.ReactNode
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  record,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`
            }
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const ColorPage: React.FC = () => {
  const [form] = Form.useForm()
  const table = useTable()
  const colorPage = useColorPage()

  const isEditing = (record: IColor) => record.key === table.editingKey
  const isDelete = (record: IColor) => record.key === table.deleteKey

  const handleSave = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as DataType

      const newData = [...table.dataSource]
      const index = newData.findIndex((item) => key === item.key)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row
        })
        table.setDataSource(newData)
        table.setEditingKey('')
      } else {
        newData.push(row)
        table.setDataSource(newData)
        table.setEditingKey('')
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

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
      editable: true
    },
    {
      title: 'Hex color',
      dataIndex: 'hexColor',
      width: '20%',
      editable: true
    },
    {
      title: 'Created date',
      dataIndex: 'updatedAt',
      width: '15%',
      editable: true
    },
    {
      title: 'Updated date',
      dataIndex: 'createdAt',
      width: '15%',
      editable: true
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: AnyObject) => {
        const editable = isEditing(record as IColor)
        const deletable = isDelete(record as IColor)
        return editable ? (
          <Flex gap={30}>
            <Typography.Link onClick={() => handleSave(record.key)}>Save</Typography.Link>
            <Popconfirm title={`Sure to cancel?`} onConfirm={table.handleCancel}>
              <a>Cancel</a>
            </Popconfirm>
          </Flex>
        ) : (
          <Flex gap={30}>
            <Button
              type='dashed'
              disabled={table.editingKey !== ''}
              onClick={() => {
                table.handleEdit(record as IColor)
                form.setFieldsValue({ name: '', age: '', address: '', ...record })
              }}
            >
              Edit
            </Button>

            <Popconfirm
              title={`Sure to delete?`}
              onCancel={() => table.setDeleteKey('')}
              onConfirm={() => table.handleDelete(record.key)}
            >
              {/* <Typography.Link disabled={editingKey !== ''} onClick={() => setDeleteKey(record.key)}>
                Delete
              </Typography.Link> */}
              <Button danger disabled={table.editingKey !== ''} onClick={() => table.setDeleteKey(record.key)}>
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
      onCell: (record: DataType) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  }) as ColumnTypes

  const handleAddNew = () => {
    colorApi
      .createNewColor(colorPage.nameColor, colorPage.hexColor)
      .then((meta) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        table.setLoading(true)
        const data = meta?.data as Color
        const item: IColor = { ...data, key: data.colorID }
        table.setDataSource([...table.dataSource, item])
        colorPage.setOpenModal(false)
      })
      .finally(() => {
        table.setLoading(false)
      })
  }

  useEffect(() => {
    colorApi.getAllColors().then((meta) => {
      const data = meta?.data as Color[]
      if (data.length !== 0) {
        table.setDataSource(
          data.map((item) => {
            return { ...item, key: item.colorID }
          })
        )
      }
    })
  }, [])

  return (
    <>
      <Flex justify='space-between'>
        <Flex>
          Loading
          <Switch checked={table.isLoading} onChange={table.handleLoadingChange} />
        </Flex>
        <Button
          onClick={() => colorPage.setOpenModal(true)}
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
          loading={table.isLoading}
          bordered
          dataSource={table.dataSource}
          columns={mergedColumns}
          rowClassName='editable-row'
          pagination={{
            onChange: table.handleCancel
          }}
        />
      </Form>
      <Modal
        title='Basic Modal'
        open={colorPage.openModal}
        onOk={handleAddNew}
        onCancel={() => colorPage.setOpenModal(false)}
      >
        <AddNewColor />
      </Modal>
    </>
  )
}

export default ColorPage
