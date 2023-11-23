import { Button, Flex, Form, Popconfirm, Table, Typography } from 'antd'
import { AnyObject } from 'antd/es/_util/type'
import { Plus } from 'lucide-react'
import { Print } from '~/typing'
import { dateDistance } from '~/utils/date-formatter'
import { firstLetterUppercase } from '~/utils/text'
import AddNewProduct from './components/AddNewProduct'
import EditableCell, { EditableTableProps } from './components/EditableCell'
import useProduct from './hooks/useProduct'
import useProductTable from './hooks/useProductTable'

export interface ProductTableDataType {
  key: React.Key
  productID: number
  productCode: string
  quantityPO: number
  dateInputNPL: string
  dateOutputFCR: string
  prints: Print[]
  createdAt: string
  updatedAt: string
}

const ProductPage: React.FC = () => {
  const { openModal, setOpenModal } = useProduct()
  const {
    form,
    loading,
    dataSource,
    editingKey,
    handleSaveEditing,
    isEditing,
    handleCancelConfirmDelete,
    handleEdit,
    handleDelete,
    handleCancelEditing,
    handleDeleteRow
  } = useProductTable()

  type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

  const columns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'ID',
      dataIndex: 'productID',
      width: '5%',
      editable: true
    },
    {
      title: 'Code',
      dataIndex: 'productCode',
      width: '10%',
      editable: true
    },
    {
      title: 'Quantity PO',
      dataIndex: 'quantityPO',
      width: '10%',
      editable: true
    },
    {
      title: 'Input NPL',
      dataIndex: 'dateInputNPL',
      width: '15%',
      editable: true
    },
    {
      title: 'Output FCR',
      dataIndex: 'dateOutputFCR',
      width: '15%',
      editable: true
    },
    {
      title: 'Place Print in',
      dataIndex: 'prints',
      width: '15%',
      editable: true
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
      title: 'Operation',
      dataIndex: 'operation',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: AnyObject) => {
        const editable = isEditing(record as ProductTableDataType)
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
            <Button
              type='dashed'
              disabled={editingKey !== ''}
              onClick={() => {
                form.setFieldsValue({
                  productCode: '',
                  quantityPO: '',
                  dateInputNPL: '',
                  dateOutputFCR: '',
                  prints: '',
                  createdAt: '',
                  updatedAt: '',
                  ...record
                })
                handleEdit(record as ProductTableDataType)
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
      onCell: (record: ProductTableDataType) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  }) as ColumnTypes

  console.log('Load ProductPage...')

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
      {openModal && <AddNewProduct openModal={openModal} setOpenModal={setOpenModal} />}
    </>
  )
}

export default ProductPage
