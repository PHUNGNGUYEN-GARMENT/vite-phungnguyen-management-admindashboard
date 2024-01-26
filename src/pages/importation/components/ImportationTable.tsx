/* eslint-disable @typescript-eslint/no-explicit-any */
import { Divider, Flex, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import { useEffect } from 'react'
import useDevice from '~/components/hooks/useDevice'
import useTable from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import ExpandableItemRow from '~/components/sky-ui/SkyTable/ExpandableItemRow'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { ProductTableDataType } from '~/pages/product/type'
import {
  breakpoint,
  dateValidatorChange,
  dateValidatorDisplay,
  dateValidatorInit,
  numberValidatorChange,
  numberValidatorDisplay,
  numberValidatorInit
} from '~/utils/helpers'
import useImportationTable from '../hooks/useImportationTable'
import { ImportationTableDataType } from '../type'

interface Props {
  productRecord: ProductTableDataType
}

const ImportationTable: React.FC<Props> = ({ productRecord }) => {
  const table = useTable<ImportationTableDataType>([])
  const {
    searchText,
    setSearchText,
    newRecord,
    setNewRecord,
    handleResetClick,
    handleSortChange,
    handleSearch,
    handleSaveClick,
    handleConfirmDelete,
    handlePageChange,
    productService
  } = useImportationTable(table)
  const { width } = useDevice()

  useEffect(() => {
    console.log(productRecord)
  }, [productRecord])

  const columns = {
    quantity: (record: ImportationTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='quantity'
          title='Lô nhập'
          inputType='number'
          required={true}
          initialValue={numberValidatorInit(record.quantity)}
          onValueChange={(val: number) => setNewRecord({ ...newRecord, quantity: numberValidatorChange(val) })}
        >
          <SkyTableTypography status={record.status}>{numberValidatorDisplay(record.quantity)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    dateImported: (record: ImportationTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='dateImported'
          title='Ngày nhập'
          inputType='datepicker'
          required={true}
          initialValue={dateValidatorInit(record.dateImported)}
          onValueChange={(val: Dayjs) => setNewRecord({ ...newRecord, dateImported: dateValidatorChange(val) })}
        >
          <SkyTableTypography status={record.status}>{dateValidatorDisplay(record.dateImported)}</SkyTableTypography>
        </EditableStateCell>
      )
    }
  }

  const tableColumns: ColumnsType<ImportationTableDataType> = [
    {
      title: 'Lô nhập',
      dataIndex: 'quantity',
      width: '15%',
      responsive: ['md'],
      render: (_value: any, record: ImportationTableDataType) => {
        return columns.quantity(record)
      }
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'dateImported',
      width: '15%',
      responsive: ['lg'],
      render: (_value: any, record: ImportationTableDataType) => {
        return columns.dateImported(record)
      }
    }
  ]

  return (
    <>
      <BaseLayout
        searchPlaceHolder='Mã hàng...'
        searchValue={searchText}
        onDateCreationChange={(enable) => table.setDateCreation(enable)}
        onSearchChange={(e) => setSearchText(e.target.value)}
        onSearch={(value) => handleSearch(value)}
        onSortChange={(checked, e) => handleSortChange(checked, e)}
        onResetClick={() => handleResetClick()}
      >
        <SkyTable
          bordered
          loading={table.loading}
          columns={tableColumns}
          editingKey={table.editingKey}
          deletingKey={table.deletingKey}
          dataSource={table.dataSource}
          rowClassName='editable-row'
          metaData={productService.metaData}
          onPageChange={handlePageChange}
          isDateCreation={table.dateCreation}
          actions={{
            onEdit: {
              onClick: (_e, record) => {
                setNewRecord({
                  ...record
                })
                table.handleStartEditing(record!.key!)
              }
            },
            onSave: {
              onClick: (_e, record) => handleSaveClick(record!)
            },
            onDelete: {
              onClick: (_e, record) => table.handleStartDeleting(record!.key!)
            },
            onConfirmCancelEditing: () => table.handleConfirmCancelEditing(),
            onConfirmCancelDeleting: () => table.handleConfirmCancelDeleting(),
            onConfirmDelete: (record) => handleConfirmDelete(record),
            isShow: true
          }}
          expandable={{
            expandedRowRender: (record) => {
              return (
                <Flex vertical className='w-full md:w-1/2'>
                  <Space direction='vertical' size={10} split={<Divider className='my-0 py-0' />}>
                    {!(width >= breakpoint.md) && (
                      <ExpandableItemRow title='Lô nhập:' isEditing={table.isEditing(record.id!)}>
                        {columns.quantity(record)}
                      </ExpandableItemRow>
                    )}
                    {!(width >= breakpoint.lg) && (
                      <ExpandableItemRow title='Ngày nhập:' isEditing={table.isEditing(record.id!)}>
                        {columns.dateImported(record)}
                      </ExpandableItemRow>
                    )}
                  </Space>
                </Flex>
              )
            },
            columnWidth: '0.001%'
          }}
        />
      </BaseLayout>
    </>
  )
}

export default ImportationTable
