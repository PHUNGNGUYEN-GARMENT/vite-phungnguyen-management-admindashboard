/* eslint-disable react-refresh/only-export-components */
import {
  Button,
  Flex,
  Form,
  Popconfirm,
  Switch,
  Table,
  Tag,
  Typography
} from 'antd'
import { AnyObject } from 'antd/es/_util/type'
import { Plus } from 'lucide-react'
import React, { memo, useEffect } from 'react'
import PrintablePlaceAPI from '~/api/services/PrintablePlaceAPI'
import ProductAPI from '~/api/services/ProductAPI'
import { PrintablePlace, Product } from '~/typing'
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
  prints: string[]
  createdAt: string
  updatedAt: string
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

const ProductPage: React.FC = () => {
  const {
    products,
    setProducts,
    printablePlaces,
    setPrintablePlaces,
    openModal,
    setOpenModal,
    loading,
    setLoading,
    expandedDate,
    setExpandedDate
  } = useProduct()
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
      .then((res) => {
        setLoading(true)
        if (res?.isSuccess) {
          setProducts(res.data as Product[])
        }
      })
      .then(() => {
        PrintablePlaceAPI.getAlls().then((res) => {
          if (res?.isSuccess) {
            setPrintablePlaces(res.data as PrintablePlace[])
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
            const prints = printablePlaces.filter(
              (print) => print.productID === item.productID
            )
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

  const fixedColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: 'ID',
      dataIndex: 'productID',
      width: '5%',
      editable: true,
      responsive: ['lg']
    },
    {
      title: 'Code',
      dataIndex: 'productCode',
      width: '15%',
      editable: true
    },
    {
      title: 'Quantity PO',
      dataIndex: 'quantityPO',
      width: '15%',
      editable: true
    },
    {
      title: 'Date Input NPL',
      dataIndex: 'dateInputNPL',
      width: '15%',
      editable: true
    },
    {
      title: 'Date Output FCR',
      dataIndex: 'dateOutputFCR',
      width: '15%',
      editable: true
    },
    {
      title: 'Nơi in - Thêu',
      dataIndex: 'prints',
      width: '20%',
      editable: true,
      render: (prints: string[]) => (
        <>
          {prints.map((print, index) => {
            return <Tag key={index}>{print}</Tag>
          })}
        </>
      )
    },
    {
      title: 'Created date',
      dataIndex: 'createdAt',
      width: '15%',
      editable: true,
      render(value) {
        return (
          <Typography.Text className='text-sm'>
            {firstLetterUppercase(dateDistance(value))}
          </Typography.Text>
        )
      }
    },
    {
      title: 'Updated date',
      dataIndex: 'updatedAt',
      width: '15%',
      editable: true,
      responsive: ['md'],
      render(value) {
        return (
          <Typography.Text className='text-sm'>
            {firstLetterUppercase(dateDistance(value))}
          </Typography.Text>
        )
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
          <Flex className='flex flex-col gap-3 lg:flex-row'>
            <Typography.Link
              onClick={() => handleSaveEditing(record.key, setLoading)}
            >
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
                  productCode: '',
                  productID: '',
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

  const columns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: 'ID',
      dataIndex: 'productID',
      width: '5%',
      editable: true,
      responsive: ['lg']
    },
    {
      title: 'Code',
      dataIndex: 'productCode',
      width: '15%',
      editable: true
    },
    {
      title: 'Quantity PO',
      dataIndex: 'quantityPO',
      width: '15%',
      editable: true
    },
    {
      title: 'Date Input NPL',
      dataIndex: 'dateInputNPL',
      width: '15%',
      editable: true
    },
    {
      title: 'Date Output FCR',
      dataIndex: 'dateOutputFCR',
      width: '15%',
      editable: true
    },
    {
      title: 'Nơi in - Thêu',
      dataIndex: 'prints',
      width: '20%',
      editable: true,
      render: (prints: string[]) => (
        <>
          {prints.map((print, index) => {
            return <Tag key={index}>{print}</Tag>
          })}
        </>
      )
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
            <Typography.Link
              onClick={() => handleSaveEditing(record.key, setLoading)}
            >
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
          <Flex className='flex flex-col gap-3 lg:flex-row'>
            {/* <Typography.Link disabled={editingKey !== ''} onClick={() => handleEdit(record as Item)}>
                  Edit
                  </Typography.Link> */}
            <Button
              type='dashed'
              disabled={editingKey !== ''}
              onClick={() => {
                form.setFieldsValue({
                  nameColor: '',
                  hexColor: '',
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

  const mergedColumns = (
    cols: (ColumnTypes[number] & {
      editable?: boolean
      dataIndex: string
    })[]
  ): ColumnTypes => {
    return cols.map((col) => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        responsive: col.responsive,
        onCell: (record: ProductTableDataType) => ({
          record,
          inputType:
            col.dataIndex === 'productCode'
              ? 'text'
              : col.dataIndex === 'quantityPO'
                ? 'number'
                : col.dataIndex === 'dateInputNPL'
                  ? 'datepicker'
                  : col.dataIndex === 'dateOutputFCR'
                    ? 'datepicker'
                    : 'select',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
          responsive: col.responsive
        })
      }
    }) as ColumnTypes
  }

  return (
    <>
      <Flex vertical gap={30}>
        <Flex justify='space-between' align='end'>
          <Switch
            checkedChildren='Ngày tạo & sửa'
            unCheckedChildren='Ngày tạo & sửa'
            defaultChecked={false}
            checked={expandedDate}
            onChange={setExpandedDate}
          />
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
            columns={mergedColumns(expandedDate ? fixedColumns : columns)}
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
      <AddNewProduct
        setLoading={setLoading}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  )
}

export default memo(ProductPage)
