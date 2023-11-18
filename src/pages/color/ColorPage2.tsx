import { Button, Flex, Form, Input, InputNumber, Popconfirm, Switch, Table, Typography } from 'antd'
import { AnyObject } from 'antd/es/_util/type'
import React, { useState } from 'react'

interface DataType {
  key: string
  name: string
  age: number
  address: string
}
type EditableTableProps = Parameters<typeof Table>[0]
type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

const originData: DataType[] = []
for (let i = 0; i < 10; i++) {
  originData.push({
    key: i.toString(),
    name: `Edward ${i}`,
    age: 32,
    address: `London Park no. ${i}`
  })
}
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

const ColorPage2: React.FC = () => {
  const [form] = Form.useForm()
  const [data, setData] = useState(originData)
  const [editingKey, setEditingKey] = useState('')
  const [deleteKey, setDeleteKey] = useState('')
  const [count, setCount] = useState(10)
  const [loading, setLoading] = useState(false)

  const isEditing = (record: DataType) => record.key === editingKey
  const isDelete = (record: DataType) => record.key === deleteKey

  const handleEdit = (record: Partial<DataType> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record })
    setEditingKey(record.key)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const handleLoadingChange = (enable: boolean) => {
    setLoading(enable)
  }

  const handleSave = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as DataType

      const newData = [...data]
      const index = newData.findIndex((item) => key === item.key)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row
        })
        setData(newData)
        setEditingKey('')
      } else {
        newData.push(row)
        setData(newData)
        setEditingKey('')
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const handleAdd = () => {
    const newData: DataType = {
      key: `${count}`,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`
    }
    setData([...data, newData])
    setCount(count + 1)
  }

  const handleDelete = (key: React.Key) => {
    const newData = data.filter((item) => item.key !== key)
    setData(newData)
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
            <Popconfirm open={editable} title={`Sure to cancel?`} onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </Flex>
        ) : (
          <Flex gap={30}>
            {/* <Typography.Link disabled={editingKey !== ''} onClick={() => handleEdit(record as Item)}>
              Edit
              </Typography.Link> */}
            <Button type='dashed' disabled={editingKey !== ''} onClick={() => handleEdit(record as DataType)}>
              Edit
            </Button>

            <Popconfirm
              open={deletable}
              title={`Sure to delete?`}
              onCancel={() => setDeleteKey('')}
              onConfirm={() => handleDelete(record.key)}
            >
              {/* <Typography.Link disabled={editingKey !== ''} onClick={() => setDeleteKey(record.key)}>
                Delete
              </Typography.Link> */}
              <Button danger disabled={editingKey !== ''} onClick={() => setDeleteKey(record.key)}>
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
          <Switch checked={loading} onChange={handleLoadingChange} />
        </Flex>
        <Button onClick={handleAdd} type='primary' style={{ marginBottom: 16 }}>
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
          loading={loading}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName='editable-row'
          pagination={{
            onChange: cancel
          }}
        />
      </Form>
    </>
  )
}

export default ColorPage2
