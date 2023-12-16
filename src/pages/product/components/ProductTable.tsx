/* eslint-disable @typescript-eslint/no-explicit-any */
import { App as AntApp, ColorPicker, Flex, Form, List, Table, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RequestBodyType, defaultRequestBody } from '~/api/client'
import PrintablePlaceAPI from '~/api/services/PrintablePlaceAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import ProductGroupAPI from '~/api/services/ProductGroupAPI'
import useTable, { TableCellProps, TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import ProgressBar from '~/components/ui/ProgressBar'
import EditableCell, { EditableTableProps, InputType } from '~/components/ui/Table/EditableCell'
import ItemAction from '~/components/ui/Table/ItemAction'
import { RootState } from '~/store/store'
import { Color, Group, Print, PrintablePlace, Product, ProductColor, ProductGroup } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { ProductTableDataType } from '../type'
// import EditableCell, { EditableTableProps } from './EditableCell'
import ColorAPI from '~/api/services/ColorAPI'
import GroupAPI from '~/api/services/GroupAPI'
import PrintAPI from '~/api/services/PrintAPI'
import useAPIService from '~/hooks/useAPIService'
import ModalAddNewProduct from './ModalAddNewProduct'

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

interface Props extends React.HTMLAttributes<HTMLElement> {}

const ProductTable: React.FC<Props> = ({ ...props }) => {
  const colorService = useAPIService<Color>(ColorAPI)
  const groupService = useAPIService<Group>(GroupAPI)
  const printService = useAPIService<Print>(PrintAPI)
  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const productGroupService = useAPIService<ProductGroup>(ProductGroupAPI)
  const printablePlaceService = useAPIService<PrintablePlace>(PrintablePlaceAPI)
  const {
    form,
    isEditing,
    editingKey,
    dataSource,
    loading,
    setLoading,
    setDataSource,
    setDeleteKey,
    dateCreation,
    setDateCreation,
    handleStartAddNew,
    handleStartEditing,
    handleStartDeleting,
    handleStartSaveEditing,
    handleConvertDataSource,
    handleConvertDataSource2,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting
  } = useTable<ProductTableDataType>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [products, setProducts] = useState<Product[]>([])
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([])
  const [printablePlaces, setPrintablePlaces] = useState<PrintablePlace[]>([])
  const { message } = AntApp.useApp()
  const user = useSelector((state: RootState) => state.user)
  console.log('Product page loading...')

  useEffect(() => {
    productService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setProducts(meta.data as Product[])
      }
    })
    productColorService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setProductColors(meta.data as ProductColor[])
      }
    })
    productGroupService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setProductGroups(meta.data as ProductGroup[])
      }
    })
    printablePlaceService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        console.log('Printable place', meta.data)
        setPrintablePlaces(meta.data as PrintablePlace[])
      }
    })
  }, [])

  useEffect(() => {
    handleConvertDataSource2(
      products.map((item) => {
        return {
          ...item,
          productColor: productColors.find((i) => i.productID === item.id),
          productGroup: productGroups.find((i) => i.productID === item.id),
          printablePlace: printablePlaces.find((i) => i.productID === item.id),
          key: item.id
        } as ProductTableDataType
      }) as ProductTableDataType[]
    )
  }, [products, productColors, productGroups, printablePlaces])

  useEffect(() => {
    if (dataSource.length > 0) {
      console.log('dataSource: ', dataSource)
    }
  }, [dataSource])

  const selfHandleSaveClick = async (item: TableItemWithKey<ProductTableDataType>) => {
    const row = (await form.validateFields()) as any
    console.log(row)
    if (
      row.productCode !== item.productCode ||
      row.quantityPo !== item.quantityPO ||
      row.dateInputNPL !== item.dateInputNPL ||
      row.dateOutputFCR !== item.dateOutputFCR
    ) {
      console.log('Product progressing')
      serviceActionUpdateOrCreate(
        { field: 'id', key: Number(item.id!) },
        ProductAPI,
        {
          productCode: row.productCode,
          quantityPO: row.quantityPO,
          dateInputNPL: row.dateInputNPL,
          dateOutputFCR: row.dateOutputFCR
        } as Product,
        setLoading,
        (data, msg) => {
          if (data?.success) {
            message.success(msg)
          } else {
            message.error(msg)
          }
          handleStartSaveEditing(item.id!, {
            ...item,
            productCode: row.productCode,
            quantityPO: row.quantityPO,
            dateInputNPL: row.dateInputNPL,
            dateOutputFCR: row.dateOutputFCR
          })
        }
      )
    }
    if (row.colorID !== item.productColor?.colorID) {
      console.log('ProductColor progressing')
      serviceActionUpdateOrCreate(
        { field: 'productID', key: Number(item.id!) },
        ProductColorAPI,
        { colorID: row.colorID } as ProductColor,
        setLoading,
        (data, msg) => {
          if (data?.success) {
            message.success(msg)
          } else {
            message.error(msg)
          }
          handleStartSaveEditing(item.id!, { ...item, productColor: { colorID: row.colorID } as ProductColor })
        }
      )
    }
    if (row.groupID !== item.productGroup?.groupID) {
      console.log('ProductGroup progressing')
      serviceActionUpdateOrCreate(
        { field: 'productID', key: Number(item.id!) },
        ProductGroupAPI,
        { groupID: row.groupID } as ProductGroup,
        setLoading,
        (data, msg) => {
          if (data?.success) {
            message.success(msg)
          } else {
            message.error(msg)
          }
          handleStartSaveEditing(item.id!, { ...item, productGroup: { groupID: row.groupID } as ProductGroup })
        }
      )
    }
    if (row.printID !== item.printablePlace?.printID) {
      console.log('PrintablePlace progressing')
      serviceActionUpdateOrCreate(
        { field: 'productID', key: Number(item.id!) },
        PrintablePlaceAPI,
        { printID: row.printID } as PrintablePlace,
        setLoading,
        (data, msg) => {
          if (data?.success) {
            message.success(msg)
            handleStartSaveEditing(item.id!, { ...item, printablePlace: { printID: row.printID } as PrintablePlace })
          } else {
            message.error(msg)
          }
        }
      )
    }
  }

  const actionsCols: (ColumnTypes[number] & TableCellProps)[] = [
    {
      title: 'Operation',
      width: '1%',
      dataIndex: 'operation',
      render: (_, item: ProductTableDataType) => {
        return (
          <>
            <ItemAction
              isEditing={isEditing(item.key!)}
              editingKey={editingKey}
              onSaveClick={() => selfHandleSaveClick(item)}
              onClickStartEditing={() => handleStartEditing(item.key!)}
              onConfirmCancelEditing={() => handleConfirmCancelEditing()}
              onConfirmCancelDeleting={() => handleConfirmCancelDeleting()}
              onConfirmDelete={() => {
                productService.deleteItemByPk(item.id!, setLoading, (meta) => {
                  if (meta) {
                    if (meta.success) {
                      handleStartDeleting(item.id!, () => {})
                      message.success('Deleted!')
                    }
                  } else {
                    message.error('Failed!')
                  }
                })
              }}
              onStartDeleting={() => setDeleteKey(item.key!)}
            />
          </>
        )
      }
    }
  ]

  const commonCols: (ColumnTypes[number] & TableCellProps)[] = [
    {
      title: 'Code',
      dataIndex: 'productCode',
      width: '10%',
      editable: user.isAdmin,
      render: (_, record: ProductTableDataType) => {
        return (
          <Typography.Text copyable className='text-md flex-shrink-0 font-bold'>
            {record.productCode}
          </Typography.Text>
        )
      }
    },
    {
      title: 'Màu',
      dataIndex: 'color',
      width: '10%',
      editable: true,
      render: (_, record: ProductTableDataType) => {
        return (
          <Flex className='' align='center' vertical gap={5}>
            <span>{record.productColor?.color?.nameColor}</span>
            <ColorPicker size='middle' format='hex' value={record.productColor?.color?.hexColor} disabled showText />
          </Flex>
        )
      }
    },
    {
      title: 'Nhóm',
      dataIndex: 'group',
      width: '10%',
      editable: true,
      render: (_, record: ProductTableDataType) => {
        return <span>{record.productGroup?.group?.name}</span>
      }
    },
    {
      title: 'Số lượng PO',
      dataIndex: 'quantityPO',
      width: '10%',
      editable: true
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      width: '',
      render: (_, record: ProductTableDataType) => {
        const progressArr: { task: string; quantity: number }[] = [
          {
            task: 'Sewing',
            quantity: record.progress?.sewing ?? 0
          },
          {
            task: 'Iron',
            quantity: record.progress?.iron ?? 0
          },
          {
            task: 'Check',
            quantity: record.progress?.check ?? 0
          },
          {
            task: 'Pack',
            quantity: record.progress?.pack ?? 0
          }
        ]
        return (
          <Flex vertical>
            <List className='list-none'>
              {progressArr.map((item, index) => {
                return (
                  <List.Item key={index} className='m-0 p-0'>
                    <Flex className='m-0 w-full p-0'>
                      <Typography.Text className='m-0 w-16 flex-shrink-0 p-0'>{item.task}</Typography.Text>
                      <Flex className='w-full' align='center' vertical>
                        <ProgressBar count={item.quantity ?? 0} total={record.quantityPO ?? 0} />
                        <Typography.Text type='secondary' className='w-24 font-medium'>
                          {item.quantity ?? 0}/{record.quantityPO ?? 0}
                        </Typography.Text>
                      </Flex>
                    </Flex>
                  </List.Item>
                )
              })}
            </List>
          </Flex>
        )
      }
    },
    {
      title: 'NPL',
      dataIndex: 'dateInputNPL',
      width: '5%',
      editable: true,
      render: (_, record: ProductTableDataType) => {
        const validData = record.dateInputNPL ? record.dateInputNPL : ''
        return <span>{DayJS(validData).format(DatePattern.display)}</span>
      }
    },
    {
      title: 'FCR',
      dataIndex: 'dateOutputFCR',
      width: '5%',
      editable: true,
      render: (_, record: ProductTableDataType) => {
        const validData = record.dateOutputFCR ? record.dateOutputFCR : ''
        return <span>{DayJS(validData).format(DatePattern.display)}</span>
      }
    }
  ]

  const dateCreationColumns: (ColumnTypes[number] & TableCellProps)[] = [
    {
      title: 'Created date',
      dataIndex: 'createdAt',
      width: '5%',
      render: (_, record: ProductTableDataType) => {
        const validData = record.createdAt ? record.createdAt : ''
        return <span>{DayJS(validData).format(DatePattern.display)}</span>
      }
    },
    {
      title: 'Updated date',
      dataIndex: 'updatedAt',
      width: '5%',
      responsive: ['md'],
      render: (_, record: ProductTableDataType) => {
        const validData = record.updatedAt ? record.updatedAt : ''
        return <span>{DayJS(validData).format(DatePattern.display)}</span>
      }
    }
  ]

  const adminColumns: (ColumnTypes[number] & TableCellProps)[] = dateCreation
    ? [...commonCols, ...dateCreationColumns, ...actionsCols]
    : [...commonCols, ...actionsCols]

  const staffColumns: (ColumnTypes[number] & TableCellProps)[] = [...commonCols]

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
        onCell: (record: ProductTableDataType) => ({
          record,
          inputType: onCellColumnType(col.dataIndex),
          dataIndex: col.dataIndex,
          title: col.title,
          initialValue: smartInitialValue(col.dataIndex, record),
          editing: isEditing(record.key!)
        })
      }
    }) as ColumnTypes
  }

  const smartInitialValue = (dataIndex: string, record: ProductTableDataType): any => {
    switch (dataIndex) {
      case 'productCode':
        return record.productCode
      case 'quantityPO':
        return record.quantityPO
      case 'group':
        return record.productGroup?.group?.name
      case 'dateInputNPL':
        return DayJS(record.dateInputNPL)
      case 'dateOutputFCR':
        return DayJS(record.dateOutputFCR)
      case 'color':
        return record.productColor?.color
      default:
        return record.id
    }
  }

  const onCellColumnType = (dataIndex: string): InputType => {
    switch (dataIndex) {
      case 'productCode':
        return 'text'
      case 'group':
        return 'select'
      case 'color':
        return 'select'
      case 'quantityPO':
        return 'number'
      case 'dateInputNPL':
        return 'datepicker'
      case 'dateOutputFCR':
        return 'datepicker'
      case 'status':
        return 'select'
      default:
        return 'text'
    }
  }

  return (
    <>
      <Form {...props} form={form} component={false}>
        <BaseLayout
          onDateCreationChange={(enable) => setDateCreation(enable)}
          onSearch={(value) => {
            if (value.length > 0) {
              productService.getListItems(
                {
                  ...defaultRequestBody,
                  search: {
                    field: 'productCode',
                    term: value
                  }
                },
                setLoading,
                (meta) => {
                  if (meta?.success) {
                    handleConvertDataSource(meta)
                  }
                }
              )
            }
          }}
          onSortChange={(val) => {
            productService.sortedListItems(val ? 'asc' : 'desc', setLoading, (meta) => {
              if (meta?.success) {
                handleConvertDataSource(meta)
              }
            })
          }}
          onResetClick={() => {
            form.setFieldValue('search', '')
            productService.getListItems(defaultRequestBody, setLoading, (meta) => {
              if (meta?.success) {
                handleConvertDataSource(meta)
              }
            })
          }}
          onAddNewClick={() => setOpenModal(true)}
        >
          <Table
            components={{
              body: {
                cell: EditableCell
              }
            }}
            loading={loading}
            bordered
            dataSource={dataSource}
            columns={mergedColumns(user.isAdmin ? adminColumns : staffColumns)}
            rowClassName='editable-row'
            pagination={{
              onChange: (_page) => {
                productService.setPage(_page)
                const body: RequestBodyType = {
                  ...defaultRequestBody,
                  paginator: {
                    page: _page,
                    pageSize: 5
                  },
                  search: {
                    field: 'productCode',
                    term: form.getFieldValue('search') ?? ''
                  }
                }
                productService.getListItems(body, setLoading, (meta) => {
                  if (meta?.success) {
                    handleConvertDataSource(meta)
                  }
                })
              },
              current: productService.metaData?.page,
              pageSize: 5,
              total: productService.metaData?.total
            }}
          />
        </BaseLayout>
      </Form>
      {openModal && (
        <ModalAddNewProduct
          setLoading={setLoading}
          loading={loading}
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={(addNewForm) => {
            console.log(addNewForm)
            try {
              setLoading(true)
              productService.createNewItem(addNewForm, setLoading, (meta1) => {
                if (meta1?.success) {
                  const itemNew = meta1.data as Product
                  productColorService.createNewItem(
                    { productID: itemNew.id!, colorID: addNewForm.colorID } as ProductColor,
                    setLoading,
                    async (meta2) => {
                      if (meta2?.success) {
                        const productColorNew = meta2.data as ProductColor
                        const getProductColorNew = await ProductColorAPI.getItemByPk(productColorNew.id!)
                        productGroupService.createNewItem(
                          { productID: itemNew.id!, groupID: addNewForm.groupID } as ProductGroup,
                          setLoading,
                          async (meta3) => {
                            if (meta3?.success) {
                              const productGroupNew = meta3.data as ProductGroup
                              const getProductGroupNew = await ProductGroupAPI.getItemByPk(productGroupNew.id!)
                              printablePlaceService.createNewItem(
                                { productID: itemNew.id!, printID: addNewForm.printID } as PrintablePlace,
                                setLoading,
                                async (meta4) => {
                                  if (meta4?.success) {
                                    const printablePlaceNew = meta4.data as PrintablePlace
                                    const getPrintablePlaceNew = await PrintablePlaceAPI.getItemByPk(
                                      printablePlaceNew.id!
                                    )
                                    handleStartAddNew({
                                      key: Number(itemNew.id),
                                      ...itemNew,
                                      productColor: getProductColorNew?.data as ProductColor,
                                      productGroup: getProductGroupNew?.data as ProductGroup,
                                      printablePlace: getPrintablePlaceNew?.data as PrintablePlace
                                    })
                                    message.success('Created!')
                                    setOpenModal(false)
                                  }
                                }
                              )
                            }
                          }
                        )
                      }
                    }
                  )
                } else {
                  message.error('Failed!')
                }
              })
            } catch (error) {
              message.error('Failed!')
              console.log(error)
            } finally {
              setLoading(false)
            }
          }}
        />
      )}
    </>
  )
}

export default ProductTable
