/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColorPicker, Flex, Space } from 'antd'
import { ColumnsType } from 'antd/es/table'
import useTable, { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { GarmentAccessoryNote } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import useGarmentAccessory from '../hooks/useGarmentAccessory'
import { GarmentAccessoryTableDataType } from '../type'
import ModalAddNewAccessoryNote from './ModalAddNewAccessoryNote'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const GarmentAccessoryTable: React.FC<Props> = () => {
  const table = useTable<GarmentAccessoryTableDataType>([])
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
    productColorService,
    garmentAccessoryService,
    accessoryNotes
  } = useGarmentAccessory(table)

  const columns: ColumnsType<GarmentAccessoryTableDataType> = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '10%',
      render: (_value: any, record: GarmentAccessoryTableDataType) => {
        return (
          <>
            <EditableStateCell
              isEditing={false}
              dataIndex='productCode'
              title='Mã hàng'
              inputType='text'
              required={true}
            >
              <SkyTableTypography status={'active'}>{record.productCode}</SkyTableTypography>
            </EditableStateCell>
          </>
        )
      }
    },
    {
      title: 'Số lượng PO',
      dataIndex: 'quantityPO',
      width: '10%',
      render: (_value: any, record: GarmentAccessoryTableDataType) => {
        return (
          <>
            <EditableStateCell
              isEditing={false}
              dataIndex='quantityPO'
              title='Số lượng PO'
              inputType='number'
              required={true}
            >
              <SkyTableTypography status={'active'}>{record.quantityPO}</SkyTableTypography>
            </EditableStateCell>
          </>
        )
      }
    },
    {
      title: 'Màu',
      dataIndex: 'colorID',
      width: '10%',
      render: (_value: any, record: GarmentAccessoryTableDataType) => {
        return (
          <>
            <EditableStateCell
              isEditing={false}
              dataIndex='colorID'
              title='Màu'
              inputType='colorselector'
              required={false}
            >
              <Flex className='' wrap='wrap' justify='space-between' align='center' gap={10}>
                <SkyTableTypography status={record.productColor?.color?.status} className='w-fit'>
                  {record.productColor?.color?.name}
                </SkyTableTypography>
                {record.productColor && (
                  <ColorPicker size='middle' format='hex' value={record.productColor?.color?.hexColor} disabled />
                )}
              </Flex>
            </EditableStateCell>
          </>
        )
      }
    },
    {
      title: 'Cắt phụ liệu',
      children: [
        {
          title: 'Cắt được',
          dataIndex: 'amountCutting',
          width: '10%',
          render: (_value: any, record: TableItemWithKey<GarmentAccessoryTableDataType>) => {
            return (
              <EditableStateCell
                isEditing={table.isEditing(record.key!)}
                dataIndex='amountCutting'
                title='Cắt được'
                inputType='number'
                required={true}
                initialValue={record.garmentAccessory ? record.garmentAccessory?.amountCutting : ''}
                value={newRecord && (newRecord.garmentAccessory?.amountCutting ?? 0)}
                onValueChange={(val) =>
                  setNewRecord({
                    ...newRecord,
                    garmentAccessory: { ...newRecord.garmentAccessory, amountCutting: val }
                  })
                }
              >
                <SkyTableTypography status={record.status}>
                  {record.garmentAccessory ? record.garmentAccessory?.amountCutting : ''}
                </SkyTableTypography>
              </EditableStateCell>
            )
          }
        },
        {
          title: 'Còn lại',
          dataIndex: 'remainingAmount',
          width: '10%',
          render: (_value: any, record: TableItemWithKey<GarmentAccessoryTableDataType>) => {
            return (
              <EditableStateCell isEditing={false} dataIndex='remainingAmount' title='Còn lại' inputType='number'>
                <SkyTableTypography status={record.status}>
                  {record.garmentAccessory?.amountCutting &&
                    record.garmentAccessory.amountCutting > 0 &&
                    (record.quantityPO ?? 0) - (record.garmentAccessory?.amountCutting ?? 0)}
                </SkyTableTypography>
              </EditableStateCell>
            )
          }
        }
      ]
    },
    {
      title: 'Ngày giao chuyền',
      dataIndex: 'passingDeliveryDate',
      width: '15%',
      render: (_value: any, record: TableItemWithKey<GarmentAccessoryTableDataType>) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='passingDeliveryDate'
            title='Giao chuyền'
            inputType='datepicker'
            required={true}
            initialValue={
              record.garmentAccessory
                ? record.garmentAccessory.passingDeliveryDate && DayJS(record.garmentAccessory.passingDeliveryDate)
                : ''
            }
            onValueChange={(val) =>
              setNewRecord({
                ...newRecord,
                garmentAccessory: {
                  ...newRecord.garmentAccessory,
                  passingDeliveryDate: val ? DayJS(val).format(DatePattern.iso8601) : null
                }
              })
            }
          >
            <SkyTableTypography status={record.status}>
              {record.garmentAccessory
                ? record.garmentAccessory.passingDeliveryDate &&
                  DayJS(record.garmentAccessory.passingDeliveryDate).format(DatePattern.display)
                : ''}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Ghi chú',
      dataIndex: 'accessoryNotes',
      render: (_value: any, record: TableItemWithKey<GarmentAccessoryTableDataType>) => {
        return (
          <>
            <EditableStateCell
              isEditing={table.isEditing(record.key!)}
              dataIndex='accessoryNotes'
              title='Ghi chú'
              inputType='multipleselect'
              required={true}
              selectProps={{
                options: accessoryNotes.map((item) => {
                  return {
                    value: item.id,
                    label: item.title
                  }
                }),
                defaultValue:
                  record.garmentAccessoryNotes &&
                  record.garmentAccessoryNotes.map((item) => {
                    return {
                      value: item.accessoryNote?.id,
                      label: item.accessoryNote?.title
                    }
                  })
              }}
              onValueChange={(val: number[]) => {
                setNewRecord({
                  ...newRecord,
                  garmentAccessoryNotes: val.map((item) => {
                    return { accessoryNoteID: item, noteStatus: 'enough' } as GarmentAccessoryNote
                  })
                })
              }}
            >
              <Space size='small' wrap>
                {record.garmentAccessoryNotes &&
                  record.garmentAccessoryNotes.map((item, index) => {
                    return (
                      <SkyTableTypography
                        className='my-[2px] h-6 rounded-sm bg-black bg-opacity-[0.06] px-2 py-1'
                        key={index}
                        status={item.status}
                      >
                        {item.accessoryNote?.title}
                      </SkyTableTypography>
                    )
                  })}
              </Space>
            </EditableStateCell>
          </>
        )
      }
    }
  ]

  return (
    <>
      <BaseLayout
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
          columns={columns}
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
                setNewRecord({ garmentAccessory: record?.garmentAccessory })
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
        />
      </BaseLayout>
      {openModal && (
        <ModalAddNewAccessoryNote openModal={openModal} setOpenModal={setOpenModal} onAddNew={handleAddNewItem} />
      )}
    </>
  )
}

export default GarmentAccessoryTable
