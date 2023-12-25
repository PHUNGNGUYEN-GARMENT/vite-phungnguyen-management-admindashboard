/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColorPicker, Flex, Form, Typography } from 'antd'
import type { ColumnType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { defaultRequestBody } from '~/api/client'
import ColorAPI from '~/api/services/ColorAPI'
import GroupAPI from '~/api/services/GroupAPI'
import PrintAPI from '~/api/services/PrintAPI'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableCellNew from '~/components/sky-ui/SkyTable/EditableCellNew'
import ListItemRow from '~/components/sky-ui/SkyTable/ListItemRow'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import { Color, Group, Print, Product } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import useProduct from '../hooks/useProduct'
import { ProductTableDataType } from '../type'
import ModalAddNewProduct from './ModalAddNewProduct'
import ProductProgressStatus from './ProductProgressStatus'

const ProductTable: React.FC = () => {
  const {
    form,
    isEditing,
    editingKey,
    dataSource,
    loading,
    setLoading,
    dateCreation,
    setDateCreation,
    handleStartEditing,
    handleStartDeleting,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting,
    openModal,
    setOpenModal,
    selfConvertDataSource,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    handlePageChange,
    productService
  } = useProduct()

  const [editable, setEditable] = useState<boolean>(false)

  const [colors, setColors] = useState<Color[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [prints, setPrints] = useState<Print[]>([])

  useEffect(() => {
    if (editable) {
      ColorAPI.getItems(defaultRequestBody).then((meta) => {
        if (meta?.success) {
          const items = meta.data as Color[]
          setColors(items)
        }
      })
      GroupAPI.getItems(defaultRequestBody).then((meta) => {
        if (meta?.success) {
          const items = meta.data as Group[]
          setGroups(items)
        }
      })
      PrintAPI.getItems(defaultRequestBody).then((meta) => {
        if (meta?.success) {
          const items = meta.data as Print[]
          setPrints(items)
        }
      })
    }
  }, [editable])

  const columns: ColumnType<ProductTableDataType>[] = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '10%',
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <>
            <EditableCellNew
              isEditing={isEditing(record.key!)}
              dataIndex='productCode'
              title='Mã hàng'
              inputType='text'
              required={true}
              initialField={{ value: record.productCode }}
            >
              <Typography.Text className='text-md flex-shrink-0 font-bold'>{record.productCode}</Typography.Text>
            </EditableCellNew>
          </>
        )
      }
    },
    {
      title: 'Số lượng PO',
      dataIndex: 'quantityPO',
      width: '10%',
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <>
            <EditableCellNew
              isEditing={isEditing(record.key!)}
              dataIndex='quantityPO'
              title='Số lượng PO'
              inputType='number'
              required={true}
              initialField={{ value: record.quantityPO }}
            >
              <span>{record.quantityPO}</span>
            </EditableCellNew>
          </>
        )
      }
    },
    {
      title: 'Màu',
      dataIndex: 'colorID',
      width: '10%',
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <>
            <EditableCellNew
              isEditing={isEditing(record.key!)}
              dataIndex='colorID'
              title='Màu'
              inputType='select'
              required={false}
              initialField={{
                value: record.productColor?.colorID,
                selectItems: colors.map((i) => {
                  return { label: i.name, value: i.id, optionData: i.hexColor }
                })
              }}
            >
              <Flex className='' justify='space-between' align='center' gap={10}>
                <Typography.Text>{record.productColor?.color?.name}</Typography.Text>
                <ColorPicker size='middle' format='hex' value={record.productColor?.color?.hexColor} disabled />
              </Flex>
            </EditableCellNew>
          </>
        )
      }
    },
    {
      title: 'Nhóm',
      dataIndex: 'groupID',
      width: '10%',
      responsive: ['xl'],
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <>
            <EditableCellNew
              isEditing={isEditing(record.key!)}
              dataIndex='groupID'
              title='Nhóm'
              inputType='select'
              required={false}
              initialField={{
                value: record.productGroup?.groupID,
                selectItems: groups.map((i) => {
                  return { label: i.name, value: i.id, optionData: i.id }
                })
              }}
            >
              <span>{record.productGroup?.group?.name}</span>
            </EditableCellNew>
          </>
        )
      }
    },
    {
      title: 'Nơi in',
      dataIndex: 'printID',
      width: '10%',
      responsive: ['xxl'],
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <>
            <EditableCellNew
              isEditing={isEditing(record.key!)}
              dataIndex='printID'
              title='Nơi in'
              inputType='select'
              required={false}
              initialField={{
                value: record.printablePlace?.printID,
                selectItems: prints.map((i) => {
                  return { label: i.name, value: i.id, optionData: i.id }
                })
              }}
            >
              <span>{record.printablePlace?.print?.name}</span>
            </EditableCellNew>
          </>
        )
      }
    },
    {
      title: 'Tiến trình',
      dataIndex: 'progress',
      responsive: ['xxl'],
      width: 'auto',
      render: (_value: any, record: ProductTableDataType) => {
        return <ProductProgressStatus collapse={false} record={record} />
      }
    },
    {
      title: 'NPL',
      dataIndex: 'dateInputNPL',
      width: '10%',
      responsive: ['lg'],
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <>
            <EditableCellNew
              isEditing={isEditing(record.key!)}
              dataIndex='dateInputNPL'
              title='NPL'
              inputType='datepicker'
              required={true}
              initialField={{ value: DayJS(record.dateInputNPL) }}
            >
              <span>{DayJS(record.dateInputNPL).format(DatePattern.display)}</span>
            </EditableCellNew>
          </>
        )
      }
    },
    {
      title: 'FCR',
      dataIndex: 'dateOutputFCR',
      width: '10%',
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <>
            <EditableCellNew
              isEditing={isEditing(record.key!)}
              dataIndex='dateOutputFCR'
              title='FCR'
              inputType='datepicker'
              required={true}
              initialField={{ value: DayJS(record.dateOutputFCR) }}
            >
              <span>{DayJS(record.dateOutputFCR).format(DatePattern.display)}</span>
            </EditableCellNew>
          </>
        )
      }
    }
  ]

  return (
    <>
      <Form form={form}>
        <BaseLayout
          onDateCreationChange={(enable) => setDateCreation(enable)}
          onSearch={async (value) => {
            if (value.length > 0) {
              await productService.getListItems(
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
                    selfConvertDataSource(meta?.data as Product[])
                  }
                }
              )
            }
          }}
          onSortChange={async (val) => {
            await productService.sortedListItems(val ? 'asc' : 'desc', setLoading, (meta) => {
              if (meta?.success) {
                selfConvertDataSource(meta?.data as Product[])
              }
            })
          }}
          onResetClick={async () => {
            form.setFieldValue('search', '')
            await productService.getListItems(defaultRequestBody, setLoading, (meta) => {
              if (meta?.success) {
                selfConvertDataSource(meta?.data as Product[])
              }
            })
          }}
          onAddNewClick={() => setOpenModal(true)}
        >
          <SkyTable
            bordered
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            rowClassName='editable-row'
            metaData={productService.metaData}
            onPageChange={handlePageChange}
            editingKey={editingKey}
            isDateCreation={dateCreation}
            actions={{
              onEdit: {
                onClick: (_e, record) => {
                  setEditable((prev) => !prev)
                  handleStartEditing(record!.key!)
                }
              },
              onSave: {
                onClick: (_e, record) => handleSaveClick(record!)
              },
              onDelete: {
                onClick: (_e, record) => handleStartDeleting(record!.key!)
              },
              onConfirmCancelEditing: () => handleConfirmCancelEditing(),
              onConfirmCancelDeleting: () => handleConfirmCancelDeleting(),
              onConfirmDelete: (record) => handleConfirmDelete(record),
              isShow: true
            }}
            expandable={{
              expandedRowRender: (record: ProductTableDataType) => {
                return (
                  <Flex className='w-1/2' vertical gap={20}>
                    <ListItemRow
                      label='Nhóm'
                      isEditing={isEditing(record.key!)}
                      dataIndex='groupID'
                      inputType='select'
                      initialField={{
                        value: record.productGroup?.groupID,
                        selectItems: groups.map((i) => {
                          return { label: i.name, value: i.id, optionData: i.id }
                        })
                      }}
                      className='xl:hidden'
                      value={record.productGroup?.group?.name}
                    />
                    <ListItemRow
                      label='Nơi in'
                      isEditing={isEditing(record.key!)}
                      dataIndex='printID'
                      inputType='select'
                      initialField={{
                        value: record.printablePlace?.printID,
                        selectItems: prints.map((i) => {
                          return { label: i.name, value: i.id, optionData: i.id }
                        })
                      }}
                      className='2xl:hidden'
                      value={record.printablePlace?.print?.name}
                    />
                    <ProductProgressStatus collapse className='w-full 2xl:hidden' record={record} />
                  </Flex>
                )
              },
              columnWidth: '1%',
              showExpandColumn: innerWidth < 1536
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
          onAddNew={handleAddNewItem}
        />
      )}
    </>
  )
}

export default ProductTable
