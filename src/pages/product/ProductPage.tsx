/* eslint-disable react-refresh/only-export-components */
import { Button, Flex, Form, Popconfirm, Table, Tag, Typography } from 'antd'
import { AnyObject } from 'antd/es/_util/type'
import { Plus } from 'lucide-react'
import { memo, useEffect } from 'react'
import PrintablePlaceAPI from '~/api/services/PrintablePlaceAPI'
import ProductAPI from '~/api/services/ProductAPI'
import { PrintablePlace, Product, ResponseDataType } from '~/typing'
import { dateDistance } from '~/utils/date-formatter'
import { firstLetterUppercase } from '~/utils/text'
import AddNewProduct from './components/AddNewProduct'
import EditableCell from './components/EditableCell'
import useProduct from './hooks/useProduct'
import useProductTable from './hooks/useProductTable'

const { Column } = Table

export interface ProductTableDataType {
  key: React.Key
  productID: number
  productCode: string
  quantityPO: number
  dateInputNPL: Date
  dateOutputFCR: Date
  prints: string[]
  createdAt: Date
  updatedAt: Date
}

const ProductPage: React.FC = () => {
  const { products, setProducts, printablePlaces, setPrintablePlaces, openModal, setOpenModal, loading, setLoading } =
    useProduct()
  const {
    form,
    dataSource,
    setDataSource,
    editingKey,
    handleSaveEditing,
    isEditing,
    handleCancelConfirmDelete,
    handleEdit,
    handleDelete,
    handleCancelEditing,
    handleDeleteRow
  } = useProductTable()

  useEffect(() => {
    ProductAPI.getAlls()
      .then((res1) => {
        setLoading(true)
        if (res1?.isSuccess) {
          const data1 = res1 as ResponseDataType
          console.log(data1)
          setProducts(data1.data as Product[])
        }
      })
      .then(() => {
        PrintablePlaceAPI.getAlls().then((res2) => {
          if (res2?.isSuccess) {
            setPrintablePlaces(res2.data as PrintablePlace[])
          }
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    setDataSource(
      products.length > 0 && printablePlaces.length > 0
        ? products.map((item) => {
            const prints = printablePlaces.filter((print) => print.productID === item.productID)
            return {
              ...item,
              key: item.productID,
              prints: prints.map((print) => {
                return print.name
              }),
              productID: item.productID
            } as ProductTableDataType
          })
        : products.map((item) => {
            return {
              ...item,
              key: item.productID,
              prints: [],
              productID: item.productID
            } as ProductTableDataType
          })
    )
  }, [printablePlaces, products])

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
            rowClassName='editable-row'
            pagination={{
              onChange: () => {
                handleCancelEditing()
                handleCancelConfirmDelete()
              }
            }}
          >
            <Column title='ID' dataIndex='productID' key='productID' />
            <Column title='Product Code' dataIndex='productCode' key='productCode' />
            <Column title='Quantity PO' dataIndex='quantityPO' key='quantityPO' />
            <Column title='Date Input NPL' dataIndex='dateInputNPL' key='dateInputNPL' />
            <Column title='Date Output FCR' dataIndex='dateOutputFCR' key='dateOutputFCR' />
            <Column
              title='Nơi in - Thêu'
              dataIndex='prints'
              key='prints'
              render={(prints: string[]) => (
                <>
                  {prints.map((name, index) => (
                    <Tag key={index}>{name}</Tag>
                  ))}
                </>
              )}
            />
            <Column
              title='Created At'
              dataIndex='createdAt'
              key='createdAt'
              render={(val) => {
                return <Typography.Text className='text-sm'>{firstLetterUppercase(dateDistance(val))}</Typography.Text>
              }}
            />
            <Column
              title='Updated At'
              dataIndex='updatedAt'
              key='updatedAt'
              render={(val) => {
                return <Typography.Text className='text-sm'>{firstLetterUppercase(dateDistance(val))}</Typography.Text>
              }}
            />
            <Column
              title='Action'
              key='action'
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              render={(_, record: AnyObject) => {
                const editable = isEditing(record as ProductTableDataType)
                // const deletable = isDelete(record as ColorTableDataType)
                return editable ? (
                  <Flex gap={30}>
                    <Typography.Link onClick={() => handleSaveEditing(record.key, setLoading)}>Save</Typography.Link>
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
              }}
            />
          </Table>
        </Form>
      </Flex>
      {openModal && <AddNewProduct setLoading={setLoading} openModal={openModal} setOpenModal={setOpenModal} />}
    </>
  )
}

export default memo(ProductPage)
