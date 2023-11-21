import { Button, Flex, Form, Popconfirm, Table, Typography } from 'antd'
import { AnyObject } from 'antd/es/_util/type'
import React, { memo, useCallback, useEffect } from 'react'
import { ColorTableDataType } from '../ColorPage'
import useTable from '../hooks/useTable'
import EditableCell, { EditableTableProps } from './EditableCell'

interface TableColorPageProps {
  // dataSource: ColorTableDataType[]
  // setDataSource: React.Dispatch<React.SetStateAction<ColorTableDataType[]>>
}

// eslint-disable-next-line react-refresh/only-export-components, no-empty-pattern
const TableColorPage: React.FC<TableColorPageProps> = ({}) => {
  const {
    form,
    loading,
    dataSource,
    setDataSource,
    editingKey,
    setEditingKey,
    isEditing,
    handleCancelConfirmDelete,
    handleEdit,
    handleDelete,
    handleCancelEditing,
    handleDeleteRow
  } = useTable()

  useEffect(() => {
    console.log('Load table...')
  }, [])

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

  const handleSaveEditing = useCallback(async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as ColorTableDataType

      const newData = [...dataSource]
      const index = newData.findIndex((item) => key === item.key)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row
        })
        setEditingKey('')
        setDataSource(newData)
      } else {
        newData.push(row)
        setEditingKey('')
        setDataSource(newData)
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }, [])

  // useEffect(() => {
  //   ColorAPI.getAllColors().then((meta) => {
  //     const data = meta?.data as Color[]
  //     if (data.length > 0) {
  //       setDataSource(
  //         data.map((item) => {
  //           return { ...item, key: item.colorID }
  //         }) as ColorTableDataType[]
  //       )
  //     }
  //   })
  // }, [])

  return (
    <>
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
    </>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default memo(TableColorPage)
