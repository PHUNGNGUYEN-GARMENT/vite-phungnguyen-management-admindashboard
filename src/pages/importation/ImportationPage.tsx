import useDevice from '~/components/hooks/useDevice'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColorPicker, Divider, Flex, Space } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import useTable from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import ExpandableItemRow from '~/components/sky-ui/SkyTable/ExpandableItemRow'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import {
  breakpoint,
  dateValidatorChange,
  dateValidatorDisplay,
  dateValidatorInit,
  numberValidatorChange,
  numberValidatorDisplay,
  numberValidatorInit,
  textValidatorDisplay
} from '~/utils/helpers'
import useImportation from './hooks/useImportation'
import { ImportationTableDataType } from './type'

const ImportationPage = () => {
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
  } = useImportation(table)
  const { width } = useDevice()

  const columns = {
    productCode: (record: ImportationTableDataType) => {
      return (
        <EditableStateCell isEditing={false} dataIndex='productCode' title='Mã hàng' inputType='text' required={true}>
          <SkyTableTypography strong status={record.status}>
            {textValidatorDisplay(record.productCode)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    productColor: (record: ImportationTableDataType) => {
      return (
        <EditableStateCell isEditing={false} dataIndex='colorID' title='Màu' inputType='colorselector' required={false}>
          <Flex justify='space-between' align='center' gap={10} wrap='wrap'>
            <SkyTableTypography status={record.productColor?.color?.status} className='w-fit'>
              {textValidatorDisplay(record.productColor?.color?.name)}
            </SkyTableTypography>
            {record.productColor && (
              <ColorPicker size='middle' format='hex' value={record.productColor?.color?.hexColor} disabled />
            )}
          </Flex>
        </EditableStateCell>
      )
    },
    quantity: (record: ImportationTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='quantity'
          title='Lô nhập'
          inputType='number'
          required={true}
          initialValue={record.importation && numberValidatorInit(record.importation.quantity)}
          onValueChange={(val: number) => setNewRecord({ ...newRecord, quantity: numberValidatorChange(val) })}
        >
          <SkyTableTypography status={record.status}>
            {record.importation && numberValidatorDisplay(record.importation.quantity)}
          </SkyTableTypography>
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
          initialValue={record.importation && dateValidatorInit(record.importation.dateImported)}
          onValueChange={(val: Dayjs) => setNewRecord({ ...newRecord, dateImported: dateValidatorChange(val) })}
        >
          <SkyTableTypography status={record.status}>
            {record.importation && dateValidatorDisplay(record.importation.dateImported)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    }
  }

  const tableColumns: ColumnsType<ImportationTableDataType> = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '15%',
      render: (_value: any, record: ImportationTableDataType) => {
        return columns.productCode(record)
      }
    },
    {
      title: 'Màu',
      dataIndex: 'colorID',
      width: '10%',
      render: (_value: any, record: ImportationTableDataType) => {
        return columns.productColor(record)
      }
    },
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
                  ...record?.importation
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

export default ImportationPage
