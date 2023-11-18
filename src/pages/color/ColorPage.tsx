import { Button, Flex, Form, Input, InputNumber, Popconfirm, Switch, Table, Typography } from 'antd'
import { AnyObject } from 'antd/es/_util/type'
import React from 'react'
import { useTable } from './hooks/useTable'

interface DataType {
  key: string
  name: string
  age: number
  address: string
}
type EditableTableProps = Parameters<typeof Table>[0]
type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  title: any
  inputType: 'number' | 'text'
  record: DataType
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

  const isEditing = (record: DataType) => record.key === table.editingKey
  const isDelete = (record: DataType) => record.key === table.deleteKey

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
      title: 'name',
      dataIndex: 'name',
      width: '25%',
      editable: true
    },
    {
      title: 'age',
      dataIndex: 'age',
      width: '15%',
      editable: true
    },
    {
      title: 'address',
      dataIndex: 'address',
      width: '40%',
      editable: true
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: AnyObject) => {
        const editable = isEditing(record as DataType)
        const deletable = isDelete(record as DataType)
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
                table.handleEdit(record as DataType)
                form.setFieldsValue({ name: '', age: '', address: '', ...record })
              }}
            >
              Edit
            </Button>

            <Popconfirm
              open={deletable}
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

  return (
    <>
      <Flex justify='space-between'>
        <Flex>
          Loading
          <Switch checked={table.isLoading} onChange={table.handleLoadingChange} />
        </Flex>
        <Button
          onClick={() => {
            table.handleAdd({
              key: `${0}`,
              name: `Edward King ${0}`,
              age: 32,
              address: `London, Park Lane no. ${0}`
            })
          }}
          type='primary'
          style={{ marginBottom: 16 }}
        >
          Add a row
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
    </>
  )
}

export default ColorPage
