/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColorPicker, Flex, Typography } from 'antd'
import type { ColumnType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { defaultRequestBody } from '~/api/client'
import ColorAPI from '~/api/services/ColorAPI'
import GroupAPI from '~/api/services/GroupAPI'
import PrintAPI from '~/api/services/PrintAPI'
import useDevice from '~/components/hooks/useDevice'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import ImportationTable from '~/pages/importation/components/ImportationTable'
import { Color, Group, Print, Product } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import useProduct from '../hooks/useProduct'
import { ProductTableDataType } from '../type'
import ModalAddNewProduct from './ModalAddNewProduct'
import ProductProgressStatus from './ProductProgressStatus'

const ProductTable: React.FC = () => {
  const {
    isEditing,
    dataSource,
    loading,
    setLoading,
    searchText,
    setSearchText,
    newRecord,
    setNewRecord,
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
  const { width } = useDevice()
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

  const groupCol: ColumnType<ProductTableDataType> = {
    title: 'Nhóm',
    dataIndex: 'groupID',
    width: '10%',
    render: (_value: any, record: ProductTableDataType) => {
      return (
        <>
          <EditableStateCell
            isEditing={isEditing(record.key!)}
            dataIndex='groupID'
            title='Nhóm'
            inputType='select'
            required={false}
            initialValue={record.productGroup?.groupID}
            value={newRecord.groupID}
            onValueChange={(val) => {
              setNewRecord({ ...newRecord, groupID: val })
            }}
            selectItems={groups.map((i) => {
              return { label: i.name, value: i.id, optionData: i.id }
            })}
          >
            <span>{record.productGroup?.group?.name}</span>
          </EditableStateCell>
        </>
      )
    }
  }

  const printCol: ColumnType<ProductTableDataType> = {
    title: 'Nơi in',
    dataIndex: 'printID',
    width: '10%',
    render: (_value: any, record: ProductTableDataType) => {
      return (
        <>
          <EditableStateCell
            isEditing={isEditing(record.key!)}
            dataIndex='printID'
            title='Nơi in'
            inputType='select'
            required={true}
            initialValue={record.printablePlace?.printID}
            value={newRecord.printID}
            onValueChange={(val: any) => setNewRecord({ ...newRecord, printID: val })}
            selectItems={prints.map((i) => {
              return { label: i.name, value: i.id, optionData: i.id }
            })}
          >
            <span>{record.printablePlace?.print?.name}</span>
          </EditableStateCell>
        </>
      )
    }
  }

  const dateInputNPLCol: ColumnType<ProductTableDataType> = {
    title: 'NPL',
    dataIndex: 'dateInputNPL',
    width: '10%',
    render: (_value: any, record: ProductTableDataType) => {
      return (
        <>
          <EditableStateCell
            isEditing={isEditing(record.key!)}
            dataIndex='dateInputNPL'
            title='NPL'
            inputType='datepicker'
            required={true}
            initialValue={DayJS(record.dateInputNPL)}
            value={DayJS(newRecord.dateInputNPL)}
            onValueChange={(val: any) =>
              setNewRecord({ ...newRecord, dateInputNPL: DayJS(val).format(DatePattern.iso8601) })
            }
          >
            <span>{DayJS(record.dateInputNPL).format(DatePattern.display)}</span>
          </EditableStateCell>
        </>
      )
    }
  }

  const columns: ColumnType<ProductTableDataType>[] = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '10%',
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <>
            <EditableStateCell
              isEditing={isEditing(record.key!)}
              dataIndex='productCode'
              title='Mã hàng'
              inputType='text'
              required={true}
              initialValue={record.productCode}
              value={newRecord.productCode}
              onValueChange={(val) => setNewRecord({ ...newRecord, productCode: val })}
            >
              <Typography.Text className='text-md flex-shrink-0 font-bold'>{record.productCode}</Typography.Text>
            </EditableStateCell>
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
            <EditableStateCell
              isEditing={isEditing(record.key!)}
              dataIndex='quantityPO'
              title='Số lượng PO'
              inputType='number'
              required={true}
              initialValue={record.quantityPO}
              value={newRecord.quantityPO}
              onValueChange={(val) => setNewRecord({ ...newRecord, quantityPO: val })}
            >
              <span>{record.quantityPO}</span>
            </EditableStateCell>
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
            <EditableStateCell
              isEditing={isEditing(record.key!)}
              dataIndex='colorID'
              title='Màu'
              inputType='colorselector'
              required={false}
              initialValue={record.productColor?.colorID}
              value={newRecord.colorID}
              onValueChange={(val) => setNewRecord({ ...newRecord, colorID: val })}
              selectItems={colors.map((i) => {
                return { label: i.name, value: i.id, optionData: i.hexColor }
              })}
            >
              <Flex className='' justify='space-between' align='center' gap={10}>
                <Typography.Text>{record.productColor?.color?.name}</Typography.Text>
                {record.productColor && (
                  <ColorPicker size='middle' format='hex' value={record.productColor?.color?.hexColor} disabled />
                )}
              </Flex>
            </EditableStateCell>
          </>
        )
      }
    },
    { ...groupCol, responsive: ['xxl'] },
    { ...printCol, responsive: ['xxl'] },
    // {
    //   title: 'Tiến trình',
    //   dataIndex: 'progress',
    //   responsive: ['xxl'],
    //   width: 'auto',
    //   render: (_value: any, record: ProductTableDataType) => {
    //     return <ProductProgressStatus collapse={false} record={record} />
    //   }
    // },
    { ...dateInputNPLCol, responsive: ['xl'] },
    {
      title: 'FCR',
      dataIndex: 'dateOutputFCR',
      width: '10%',
      render: (_value: any, record: ProductTableDataType) => {
        return (
          <>
            <EditableStateCell
              isEditing={isEditing(record.key!)}
              dataIndex='dateOutputFCR'
              title='FCR'
              inputType='datepicker'
              required={true}
              initialValue={DayJS(record.dateOutputFCR)}
              value={DayJS(newRecord.dateOutputFCR)}
              onValueChange={(val: any) =>
                setNewRecord({ ...newRecord, dateOutputFCR: DayJS(val).format(DatePattern.iso8601) })
              }
            >
              <span>{DayJS(record.dateOutputFCR).format(DatePattern.display)}</span>
            </EditableStateCell>
          </>
        )
      }
    }
  ]

  const expandableColumns: ColumnType<ProductTableDataType>[] =
    width < 1600 ? (width < 1200 ? [groupCol, printCol, dateInputNPLCol] : [groupCol, printCol]) : []

  return (
    <>
      <BaseLayout
        onDateCreationChange={(enable) => setDateCreation(enable)}
        searchValue={searchText}
        onSearchChange={(e) => setSearchText(e.target.value)}
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
          await productService.sortedListItems(
            val ? 'asc' : 'desc',
            setLoading,
            (meta) => {
              if (meta?.success) {
                selfConvertDataSource(meta?.data as Product[])
              }
            },
            { field: 'productCode', term: searchText }
          )
        }}
        onResetClick={async () => {
          setSearchText('')
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
          isDateCreation={dateCreation}
          actions={{
            onEdit: {
              onClick: (_e, record) => {
                setNewRecord(record)
                setEditable((prev) => !prev)
                handleStartEditing(record!.key!)
              }
            },
            onSave: {
              onClick: (_e, record) => handleSaveClick(record!, newRecord)
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
                <Flex vertical gap={10}>
                  {width < 1600 && (
                    <SkyTable
                      bordered
                      loading={loading}
                      columns={expandableColumns}
                      dataSource={dataSource.filter((item) => item.id === record.id)}
                      rowClassName='editable-row'
                      metaData={productService.metaData}
                      pagination={false}
                      isDateCreation={dateCreation}
                    />
                  )}
                  <ProductProgressStatus collapse record={record} />
                  <ImportationTable productRecord={record} />
                </Flex>
              )
            },
            columnWidth: '0.001%'
          }}
        />
      </BaseLayout>
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
