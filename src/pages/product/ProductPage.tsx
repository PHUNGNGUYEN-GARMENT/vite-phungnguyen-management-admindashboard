/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColorPicker, Divider, Flex, Space } from 'antd'
import type { ColumnType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import useDevice from '~/components/hooks/useDevice'
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
  textValidatorChange,
  textValidatorDisplay,
  textValidatorInit
} from '~/utils/helpers'
import ModalAddNewProduct from './components/ModalAddNewProduct'
import useProduct from './hooks/useProduct'
import { ProductTableDataType } from './type'

const ProductPage: React.FC = () => {
  const table = useTable<ProductTableDataType>([])

  const {
    searchText,
    setSearchText,
    newRecord,
    setNewRecord,
    openModal,
    setOpenModal,
    handleResetClick,
    handleSortChange,
    handleSearch,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    handlePageChange,
    productService,
    prints,
    groups,
    colors
  } = useProduct(table)
  const { width } = useDevice()

  const columns = {
    productCode: (record: ProductTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='productCode'
          title='Mã hàng'
          inputType='text'
          required={true}
          initialValue={textValidatorInit(record.productCode)}
          value={newRecord.productCode}
          onValueChange={(val) => setNewRecord({ ...newRecord, productCode: textValidatorChange(val) })}
        >
          <SkyTableTypography strong status={'active'}>
            {textValidatorDisplay(record.productCode)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    quantityPO: (record: ProductTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='quantityPO'
          title='Số lượng PO'
          inputType='number'
          required={true}
          initialValue={numberValidatorInit(record.quantityPO)}
          value={newRecord.quantityPO}
          onValueChange={(val) => setNewRecord({ ...newRecord, quantityPO: numberValidatorChange(val) })}
        >
          <SkyTableTypography status={'active'}>{numberValidatorDisplay(record.quantityPO)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    productColor: (record: ProductTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='colorID'
          title='Màu'
          inputType='colorselector'
          required={false}
          onValueChange={(val) => setNewRecord({ ...newRecord, colorID: numberValidatorChange(val) })}
          selectProps={{
            options: colors.map((i) => {
              return { label: i.name, value: i.id, key: i.hexColor }
            }),
            defaultValue: numberValidatorInit(record.productColor?.colorID),
            value: newRecord.colorID
          }}
        >
          <Flex className='' wrap='wrap' justify='space-between' align='center' gap={10}>
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
    productGroup: (record: ProductTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='groupID'
          title='Nhóm'
          inputType='select'
          required={false}
          onValueChange={(val) => {
            setNewRecord({ ...newRecord, groupID: numberValidatorChange(val) })
          }}
          selectProps={{
            options: groups.map((i) => {
              return { label: i.name, value: i.id, optionData: i.id }
            }),
            defaultValue: textValidatorInit(record.productGroup?.group?.name)
          }}
        >
          <SkyTableTypography status={record.productGroup?.group?.status}>
            {textValidatorDisplay(record.productGroup?.group?.name)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    productPrint: (record: ProductTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='printID'
          title='Nơi in'
          inputType='select'
          required={true}
          onValueChange={(val: any) => setNewRecord({ ...newRecord, printID: numberValidatorChange(val) })}
          selectProps={{
            options: prints.map((i) => {
              return { label: i.name, value: i.id, optionData: i.id }
            }),
            defaultValue: textValidatorInit(record.printablePlace?.print?.name)
          }}
        >
          <SkyTableTypography status={record.printablePlace?.print?.status}>
            {textValidatorDisplay(record.printablePlace?.print?.name)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    dateInputNPL: (record: ProductTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='dateInputNPL'
          title='NPL'
          inputType='datepicker'
          required={true}
          initialValue={dateValidatorInit(record.dateInputNPL)}
          onValueChange={(val: Dayjs) => setNewRecord({ ...newRecord, dateInputNPL: dateValidatorChange(val) })}
        >
          <SkyTableTypography status={'active'}>{dateValidatorDisplay(record.dateInputNPL)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    dateOutputFCR: (record: ProductTableDataType) => {
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='dateOutputFCR'
          title='FCR'
          inputType='datepicker'
          required={true}
          initialValue={dateValidatorInit(record.dateOutputFCR)}
          onValueChange={(val: Dayjs) => setNewRecord({ ...newRecord, dateOutputFCR: dateValidatorChange(val) })}
        >
          <SkyTableTypography status={'active'}>
            {record.dateOutputFCR && dateValidatorDisplay(record.dateOutputFCR)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    }
  }

  const tableColumns: ColumnType<ProductTableDataType>[] = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '10%',
      render: (_value: any, record: ProductTableDataType) => {
        return columns.productCode(record)
      }
    },
    {
      title: 'Số lượng PO',
      dataIndex: 'quantityPO',
      width: '10%',
      responsive: ['sm'],
      render: (_value: any, record: ProductTableDataType) => {
        return columns.quantityPO(record)
      }
    },
    {
      title: 'Màu',
      dataIndex: 'colorID',
      width: '10%',
      render: (_value: any, record: ProductTableDataType) => {
        return columns.productColor(record)
      }
    },
    {
      title: 'Nhóm',
      dataIndex: 'groupID',
      width: '10%',
      responsive: ['md'],
      render: (_value: any, record: ProductTableDataType) => {
        return columns.productGroup(record)
      }
    },
    {
      title: 'Nơi in',
      dataIndex: 'printID',
      width: '10%',
      responsive: ['xl'],
      render: (_value: any, record: ProductTableDataType) => {
        return columns.productGroup(record)
      }
    },
    {
      title: 'Ngày nhập NPL',
      dataIndex: 'dateInputNPL',
      width: '10%',
      responsive: ['lg'],
      render: (_value: any, record: ProductTableDataType) => {
        return columns.dateInputNPL(record)
      }
    },
    {
      title: 'Ngày xuất FCR',
      dataIndex: 'dateOutputFCR',
      width: '10%',
      responsive: ['lg'],
      render: (_value: any, record: ProductTableDataType) => {
        return columns.dateOutputFCR(record)
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
        onAddNewClick={() => setOpenModal(true)}
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
                setNewRecord({ ...record })
                table.handleStartEditing(record!.key!)
              }
            },
            onSave: {
              onClick: (_e, record) => handleSaveClick(record!, newRecord)
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
            expandedRowRender: (record: ProductTableDataType) => {
              return (
                <Flex vertical>
                  <Space direction='vertical' size={10} split={<Divider className='my-0 py-0' />}>
                    {!(width >= breakpoint.sm) && (
                      <ExpandableItemRow title='Số lượng PO:' isEditing={table.isEditing(record.id!)}>
                        {columns.quantityPO(record)}
                      </ExpandableItemRow>
                    )}
                    {!(width >= breakpoint.md) && (
                      <ExpandableItemRow title='Nhóm:' isEditing={table.isEditing(record.id!)}>
                        {columns.productPrint(record)}
                      </ExpandableItemRow>
                    )}
                    {!(width >= breakpoint.xl) && (
                      <ExpandableItemRow title='Nơi in:' isEditing={table.isEditing(record.id!)}>
                        {columns.productPrint(record)}
                      </ExpandableItemRow>
                    )}
                    {!(width >= breakpoint.lg) && (
                      <ExpandableItemRow
                        title='Ngày nhập NPL:'
                        className='flex lg:hidden'
                        isEditing={table.isEditing(record.id!)}
                      >
                        {columns.dateInputNPL(record)}
                      </ExpandableItemRow>
                    )}
                    {!(width >= breakpoint.lg) && (
                      <ExpandableItemRow title='Ngày xuất FCR:' isEditing={table.isEditing(record.id!)}>
                        {columns.dateInputNPL(record)}
                      </ExpandableItemRow>
                    )}
                  </Space>
                </Flex>
              )
            },
            columnWidth: '0.001%',
            showExpandColumn: !(width >= breakpoint.xl)
          }}
        />
      </BaseLayout>
      {openModal && (
        <ModalAddNewProduct
          setLoading={table.setLoading}
          loading={table.loading}
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={handleAddNewItem}
        />
      )}
    </>
  )
}

export default ProductPage
