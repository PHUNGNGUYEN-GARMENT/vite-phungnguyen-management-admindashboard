/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColorPicker, Flex } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import AccessoryNoteAPI from '~/api/services/AccessoryNoteAPI'
import useTable, { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import useAPIService from '~/hooks/useAPIService'
import { AccessoryNote } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import useGarmentAccessory from '../hooks/useGarmentAccessory'
import { GarmentAccessoryTableDataType } from '../type'
import ModalAddNewAccessoryNote from './ModalAddNewAccessoryNote'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const GarmentAccessoryTable: React.FC<Props> = () => {
  const table = useTable<GarmentAccessoryTableDataType>([])
  const accessoryNoteService = useAPIService<AccessoryNote>(AccessoryNoteAPI)
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
  const [itemSelected, setItemSelected] = useState<{ key: React.Key; values: string[]; label: string }>({
    key: '',
    values: [''],
    label: ''
  })

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
                value={newRecord && (newRecord.amountCutting ?? 0)}
                onValueChange={(val) => setNewRecord({ ...newRecord, amountCutting: val })}
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
              setNewRecord({ ...newRecord, passingDeliveryDate: val ? DayJS(val).format(DatePattern.iso8601) : null })
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
            {/* {table.isEditing(record.key!) && (
              <Select
                mode='multiple'
                options={accessoryNotes.map((item) => {
                  return {
                    label: item.title,
                    value: item.id,
                    key: item.id
                  } as DefaultOptionType
                })}
                // onChange={(val: number[], _option) =>
                //   setNewRecord({
                //     ...newRecord,
                //     garmentAccessoryNotes: accessoryNotes.map((i) => {
                //       if (val.includes(i.id!)) {
                //         return {
                //           productID: record.id!,
                //           accessoryNoteID: i.id!,
                //           garmentAccessoryID: record.garmentAccessory?.id
                //         } as GarmentAccessoryNote
                //       }
                //     })
                //   })
                // }
                tagRender={(props) => {
                  const { label, value, closable, onClose } = props
                  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
                    event.preventDefault()
                    event.stopPropagation()
                  }
                  const noteStatus: { value: NoteItemStatusType; label: string }[] = [
                    { value: 'lake', label: 'Thiếu' },
                    { value: 'enough', label: 'Đủ' },
                    { value: 'arrived', label: 'Đã về' },
                    { value: 'not_arrived', label: 'Chưa về' }
                  ]
                  return (
                    <Tag
                      color={'default'}
                      onMouseDown={onPreventMouseDown}
                      closable={closable}
                      onClose={onClose}
                      className='m-[2px]'
                    >
                      <Space size='small' align='center' className='p-1'>
                        <Typography.Text>{label}</Typography.Text>
                        <Divider className='m-0' type='vertical' />
                        <Dropdown
                          trigger={['click']}
                          menu={{
                            items: noteStatus.map((item) => {
                              return { key: item.value, label: item.label }
                            }) as MenuProps['items'],
                            selectable: true,
                            defaultSelectedKeys: [`${0}`],
                            onSelect: (info) =>
                              setItemSelected({
                                key: info.key,
                                values: info.selectedKeys,
                                label: noteStatus.find((i) => i.value === info.key)?.label ?? ''
                              })
                          }}
                        >
                          <Typography.Link className=''>
                            <Flex align='center' justify='center' gap={5} className='rounded-sm bg-border px-2 py-1'>
                              <Typography.Text>{itemSelected.label}</Typography.Text>
                              <ChevronDown strokeWidth={1} size={20} />
                            </Flex>
                          </Typography.Link>
                        </Dropdown>
                        <Divider className='m-0' type='vertical' />
                      </Space>
                    </Tag>
                  )
                }}
                // defaultValue={[]}
                className='w-full'
              />
            )} */}
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
                setNewRecord(record!.garmentAccessory!)
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
        />
      </BaseLayout>
      {openModal && (
        <ModalAddNewAccessoryNote openModal={openModal} setOpenModal={setOpenModal} onAddNew={handleAddNewItem} />
      )}
    </>
  )
}

export default GarmentAccessoryTable
