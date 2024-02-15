/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColorPicker, Divider, Flex, Space } from 'antd'
import { ColumnsType } from 'antd/es/table'
import dayjs, { Dayjs } from 'dayjs'
import useDevice from '~/components/hooks/useDevice'
import useTable from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import ExpandableItemRow from '~/components/sky-ui/SkyTable/ExpandableItemRow'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import { SewingLine } from '~/typing'
import DayJS from '~/utils/date-formatter'
import {
  breakpoint,
  cn,
  dateValidatorDisplay,
  numberValidatorCalc,
  numberValidatorDisplay,
  textValidatorDisplay
} from '~/utils/helpers'
import useSewingLineDelivery from './hooks/useSewingLineDelivery'
import { ExpandableTableDataType, SewingLineDeliveryTableDataType } from './type'

const SewingLineDeliveryPage = () => {
  const table = useTable<SewingLineDeliveryTableDataType>([])
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
    productService,
    sewingLines,
    sewingLineDeliveryRecordTemp,
    setSewingLineDeliveryRecordTemp
  } = useSewingLineDelivery(table)
  const { width } = useDevice()

  const columns = {
    productCode: (record: SewingLineDeliveryTableDataType) => {
      return (
        <EditableStateCell isEditing={false} dataIndex='productCode' title='Mã hàng' inputType='text' required={true}>
          <SkyTableTypography status={'active'} className='flex gap-[2px] font-bold'>
            {textValidatorDisplay(record.productCode)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },

    quantityPO: (record: SewingLineDeliveryTableDataType) => {
      return (
        <EditableStateCell
          isEditing={false}
          dataIndex='quantityPO'
          title='Số lượng PO'
          inputType='number'
          required={true}
        >
          <SkyTableTypography status={'active'}>{numberValidatorDisplay(record.quantityPO)}</SkyTableTypography>
        </EditableStateCell>
      )
    },
    dateOutputFCR: (record: SewingLineDeliveryTableDataType) => {
      return (
        <EditableStateCell
          isEditing={false}
          dataIndex='dateOutputFCR'
          title='FCR'
          inputType='datepicker'
          required={true}
        >
          <SkyTableTypography status={'active'}>
            {record.dateOutputFCR && dateValidatorDisplay(record.dateOutputFCR)}
          </SkyTableTypography>
        </EditableStateCell>
      )
    },
    productColor: (record: SewingLineDeliveryTableDataType) => {
      return (
        <EditableStateCell isEditing={false} dataIndex='colorID' title='Màu' inputType='colorselector' required={false}>
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
    accessoryNotes: (record: SewingLineDeliveryTableDataType) => {
      const sewingLinesFiltered = sewingLines.filter(
        (item) =>
          record.sewingLineDeliveries &&
          record.sewingLineDeliveries.some((recorded) => recorded.sewingLineID === item.id)
      )
      return (
        <EditableStateCell
          isEditing={table.isEditing(record.key!)}
          dataIndex='accessoryNotes'
          title='Chuyền may'
          inputType='multipleselect'
          required={true}
          selectProps={{
            options: sewingLines.map((item) => {
              return {
                value: item.id,
                label: item.name
              }
            }),
            defaultValue: sewingLinesFiltered.map((item) => {
              return {
                value: item.id,
                label: item.name
              }
            })
          }}
          onValueChange={(values: number[]) => {
            setNewRecord({
              sewingLineDeliveriesToUpdate: values.map((sewingLineID) => {
                return {
                  sewingLineID: sewingLineID
                }
              })
            })
          }}
        >
          <Space size='small' wrap>
            {sewingLinesFiltered.map((item, index) => {
              return (
                <SkyTableTypography
                  key={index}
                  className='my-[2px] h-6 rounded-sm bg-lightGrey px-2 py-1'
                  type={
                    dayjs(record.dateOutputFCR).diff(
                      record.sewingLineDeliveries?.find((i) => i.sewingLineID === item.id)?.expiredDate,
                      'days'
                    ) < 5
                      ? 'danger'
                      : undefined
                  }
                  status={item.status}
                >
                  {textValidatorDisplay(item.name)}
                </SkyTableTypography>
              )
            })}
          </Space>
        </EditableStateCell>
      )
    }
  }

  const tableColumns: ColumnsType<SewingLineDeliveryTableDataType> = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '15%',
      render: (_value: any, record: SewingLineDeliveryTableDataType) => {
        return columns.productCode(record)
      }
    },
    {
      title: 'Số lượng PO',
      dataIndex: 'quantityPO',
      width: '10%',
      responsive: ['md'],
      render: (_value: any, record: SewingLineDeliveryTableDataType) => {
        return columns.quantityPO(record)
      }
    },
    {
      title: 'Màu',
      dataIndex: 'colorID',
      width: '15%',
      render: (_value: any, record: SewingLineDeliveryTableDataType) => {
        return columns.productColor(record)
      }
    },
    {
      title: 'Ngày xuất FCR',
      dataIndex: 'dateOutputFCR',
      width: '15%',
      responsive: ['lg'],
      render: (_value: any, record: SewingLineDeliveryTableDataType) => {
        return columns.dateOutputFCR(record)
      }
    },
    {
      title: 'Chuyền may',
      dataIndex: 'accessoryNotes',
      responsive: ['xl'],
      render: (_value: any, record: SewingLineDeliveryTableDataType) => {
        return columns.accessoryNotes(record)
      }
    }
  ]

  const expandableColumns = (data: SewingLineDeliveryTableDataType): ColumnsType<ExpandableTableDataType> => {
    const items = sewingLines.filter((item) =>
      data.sewingLineDeliveries
        ? data.sewingLineDeliveries.some((record) => record.sewingLineID === item.id)
        : undefined
    )

    return items.map((item, index) => {
      const disabled =
        data.sewingLineDeliveries && data.sewingLineDeliveries.some((record) => record.sewingLineID === item.id)
      return {
        title: <SkyTableTypography disabled={!disabled}>{item.name}</SkyTableTypography>,
        onHeaderCell: () => {
          return {
            style: {
              background: cn({
                'var(--light-grey)': disabled && index % 2 === 0
              })
            }
          }
        },
        children: [
          {
            title: 'SL Vào chuyền',
            dataIndex: 'quantityOriginal',
            width: '10%',
            render: (_value: any, record: ExpandableTableDataType) => {
              const sewingLineDeliveryRecord = data.sewingLineDeliveries
                ? data.sewingLineDeliveries.find((i) => i.sewingLineID === item.id)
                : {}

              return (
                <EditableStateCell
                  isEditing={table.isEditing(record.key!)}
                  dataIndex='quantityOriginal'
                  title='SL Vào chuyền'
                  inputType='number'
                  required={true}
                  initialValue={record.quantityOriginal && numberValidatorDisplay(record.quantityOriginal)}
                  value={
                    newRecord.sewingLineDeliveriesToUpdate &&
                    numberValidatorDisplay(
                      newRecord.sewingLineDeliveriesToUpdate!.find((i) => i.sewingLineID === item.id)?.quantityOriginal
                    )
                  }
                  onValueChange={(val) => {
                    setSewingLineDeliveryRecordTemp({ quantityOriginal: val })
                    const newRecords = [...newRecord.sewingLineDeliveriesToUpdate!]
                    const index = newRecords.findIndex((i) => i.sewingLineID === item.id)
                    if (index !== -1) {
                      newRecords[index].quantityOriginal = val
                      setNewRecord({ sewingLineDeliveriesToUpdate: newRecords })
                    } else {
                      const recordNews = newRecords.filter((i) => i.sewingLineID !== item.id)
                      recordNews.push({
                        quantityOriginal: val,
                        quantitySewed: sewingLineDeliveryRecordTemp.quantitySewed,
                        expiredDate: sewingLineDeliveryRecordTemp.expiredDate,
                        sewingLineID: item.id
                      })
                      setNewRecord({ sewingLineDeliveriesToUpdate: recordNews })
                    }
                  }}
                >
                  <SkyTableTypography status={record.status}>
                    {numberValidatorDisplay(sewingLineDeliveryRecord?.quantityOriginal)}
                  </SkyTableTypography>
                </EditableStateCell>
              )
            }
          },
          {
            title: 'May được',
            dataIndex: 'sewed',
            width: '10%',
            render: (_value: any, record: ExpandableTableDataType) => {
              const sewingLineDeliveryRecord = data.sewingLineDeliveries
                ? data.sewingLineDeliveries.find((i) => i.sewingLineID === item.id)
                : {}
              return (
                <EditableStateCell
                  isEditing={table.isEditing(record.key!)}
                  dataIndex='sewed'
                  title='May được'
                  inputType='number'
                  required={true}
                  initialValue={record.quantitySewed && numberValidatorDisplay(record.quantitySewed)}
                  value={
                    newRecord.sewingLineDeliveriesToUpdate &&
                    numberValidatorDisplay(
                      newRecord.sewingLineDeliveriesToUpdate!.find((i) => i.sewingLineID === item.id)?.quantitySewed
                    )
                  }
                  onValueChange={(val) => {
                    setSewingLineDeliveryRecordTemp({ quantitySewed: val })
                    const newRecords = [...newRecord.sewingLineDeliveriesToUpdate!]
                    const index = newRecords.findIndex((i) => i.sewingLineID === item.id)
                    if (index !== -1) {
                      newRecords[index].quantitySewed = val
                      setNewRecord({ sewingLineDeliveriesToUpdate: newRecords })
                    } else {
                      const recordNews = newRecords.filter((i) => i.sewingLineID !== item.id)
                      recordNews.push({
                        quantityOriginal: sewingLineDeliveryRecordTemp.quantityOriginal,
                        quantitySewed: val,
                        expiredDate: sewingLineDeliveryRecordTemp.expiredDate,
                        sewingLineID: item.id
                      })
                      setNewRecord({ sewingLineDeliveriesToUpdate: recordNews })
                    }
                  }}
                >
                  <SkyTableTypography status={record.status}>
                    {numberValidatorDisplay(sewingLineDeliveryRecord?.quantitySewed)}
                  </SkyTableTypography>
                </EditableStateCell>
              )
            }
          },
          {
            title: 'SL Còn lại',
            dataIndex: 'amountQuantity',
            width: '10%',
            render: (_value: any, record: ExpandableTableDataType) => {
              const sewingLineDeliveryRecord = data.sewingLineDeliveries
                ? data.sewingLineDeliveries.find((i) => i.sewingLineID === item.id)
                : {}
              return (
                <EditableStateCell
                  isEditing={false}
                  dataIndex='amountQuantity'
                  title='SL Còn lại'
                  inputType='number'
                  required={true}
                >
                  <SkyTableTypography status={record.status}>
                    {numberValidatorDisplay(
                      numberValidatorCalc(sewingLineDeliveryRecord?.quantityOriginal) -
                        numberValidatorCalc(sewingLineDeliveryRecord?.quantitySewed)
                    )}
                  </SkyTableTypography>
                </EditableStateCell>
              )
            }
          },
          {
            title: 'Ngày dự kiến hoàn thành',
            dataIndex: 'expiredDate',
            width: '15%',
            render: (_value: any, record: ExpandableTableDataType) => {
              const sewingLineDeliveryRecord = data.sewingLineDeliveries
                ? data.sewingLineDeliveries.find((i) => i.sewingLineID === item.id)
                : {}
              return (
                <EditableStateCell
                  isEditing={table.isEditing(record.key!)}
                  dataIndex='expiredDate'
                  title='Ngày dự kiến hoàn thành'
                  inputType='datepicker'
                  required={true}
                  initialValue={sewingLineDeliveryRecord?.expiredDate}
                  onValueChange={(val: Dayjs) => {
                    if (val) {
                      setSewingLineDeliveryRecordTemp({ expiredDate: DayJS(val).toISOString() })
                      const newRecords = [...newRecord.sewingLineDeliveriesToUpdate!]
                      const index = newRecords.findIndex((i) => i.sewingLineID === item.id)
                      if (index !== -1) {
                        newRecords[index].expiredDate = DayJS(val).toISOString()
                        setNewRecord({ sewingLineDeliveriesToUpdate: newRecords })
                      } else {
                        const recordNews = newRecords.filter((i) => i.sewingLineID !== item.id)
                        recordNews.push({
                          quantitySewed: sewingLineDeliveryRecordTemp.quantitySewed,
                          expiredDate: DayJS(val).toISOString(),
                          sewingLineID: item.id
                        })
                        setNewRecord({ sewingLineDeliveriesToUpdate: recordNews })
                      }
                    }
                  }}
                >
                  <SkyTableTypography
                    type={
                      dayjs(data.dateOutputFCR).diff(sewingLineDeliveryRecord?.expiredDate, 'days') < 5
                        ? 'danger'
                        : undefined
                    }
                    status={record.status}
                  >
                    {dateValidatorDisplay(sewingLineDeliveryRecord?.expiredDate)}
                  </SkyTableTypography>
                </EditableStateCell>
              )
            }
          }
        ]
      }
    })
  }

  // const accessoryNotes = {
  //   quantityOriginal: (record: SewingLineDeliveryTableDataType, item: SewingLineDelivery) => {
  //     const sewingLineDeliveryRecord = record.sewingLineDeliveries
  //       ? record.sewingLineDeliveries.find((i) => i.sewingLineID === item.id)
  //       : {}
  //     return (
  //       <EditableStateCell
  //         isEditing={table.isEditing(record.key!)}
  //         dataIndex='quantityOriginal'
  //         title='SL Vào chuyền'
  //         inputType='number'
  //         required={true}
  //         initialValue={item.quantityOriginal && numberValidatorDisplay(item.quantityOriginal)}
  //         value={
  //           newRecord.sewingLineDeliveriesToUpdate &&
  //           numberValidatorDisplay(
  //             newRecord.sewingLineDeliveriesToUpdate!.find((i) => i.sewingLineID === item.id)?.quantityOriginal
  //           )
  //         }
  //         onValueChange={(val) => {
  //           setSewingLineDeliveryRecordTemp({ quantityOriginal: val })
  //           const newRecords = [...newRecord.sewingLineDeliveriesToUpdate!]
  //           const index = newRecords.findIndex((i) => i.sewingLineID === item.id)
  //           if (index !== -1) {
  //             newRecords[index].quantityOriginal = val
  //             setNewRecord({ sewingLineDeliveriesToUpdate: newRecords })
  //           } else {
  //             const recordNews = newRecords.filter((i) => i.sewingLineID !== item.id)
  //             recordNews.push({
  //               quantityOriginal: val,
  //               quantitySewed: sewingLineDeliveryRecordTemp.quantitySewed,
  //               expiredDate: sewingLineDeliveryRecordTemp.expiredDate,
  //               sewingLineID: item.id
  //             })
  //             setNewRecord({ sewingLineDeliveriesToUpdate: recordNews })
  //           }
  //         }}
  //       >
  //         <SkyTableTypography status={record.status}>
  //           {numberValidatorDisplay(sewingLineDeliveryRecord?.quantityOriginal)}
  //         </SkyTableTypography>
  //       </EditableStateCell>
  //     )
  //   },
  //   quantitySewed: (record: SewingLineDeliveryTableDataType, item: SewingLineDelivery) => {
  //     const sewingLineDeliveryRecord = record.sewingLineDeliveries
  //       ? record.sewingLineDeliveries.find((i) => i.sewingLineID === item.id)
  //       : {}
  //     return (
  //       <EditableStateCell
  //         isEditing={table.isEditing(record.key!)}
  //         dataIndex='sewed'
  //         title='May được'
  //         inputType='number'
  //         required={true}
  //         initialValue={item.quantitySewed && numberValidatorDisplay(item.quantitySewed)}
  //         value={
  //           newRecord.sewingLineDeliveriesToUpdate &&
  //           numberValidatorDisplay(
  //             newRecord.sewingLineDeliveriesToUpdate!.find((i) => i.sewingLineID === item.id)?.quantitySewed
  //           )
  //         }
  //         onValueChange={(val) => {
  //           setSewingLineDeliveryRecordTemp({ quantitySewed: val })
  //           const newRecords = [...newRecord.sewingLineDeliveriesToUpdate!]
  //           const index = newRecords.findIndex((i) => i.sewingLineID === item.id)
  //           if (index !== -1) {
  //             newRecords[index].quantitySewed = val
  //             setNewRecord({ sewingLineDeliveriesToUpdate: newRecords })
  //           } else {
  //             const recordNews = newRecords.filter((i) => i.sewingLineID !== item.id)
  //             recordNews.push({
  //               quantityOriginal: sewingLineDeliveryRecordTemp.quantityOriginal,
  //               quantitySewed: val,
  //               expiredDate: sewingLineDeliveryRecordTemp.expiredDate,
  //               sewingLineID: item.id
  //             })
  //             setNewRecord({ sewingLineDeliveriesToUpdate: recordNews })
  //           }
  //         }}
  //       >
  //         <SkyTableTypography status={record.status}>
  //           {numberValidatorDisplay(sewingLineDeliveryRecord?.quantitySewed)}
  //         </SkyTableTypography>
  //       </EditableStateCell>
  //     )
  //   },
  //   amountQuantity: (record: SewingLineDeliveryTableDataType, item: SewingLineDelivery) => {
  //     const sewingLineDeliveryRecord = record.sewingLineDeliveries
  //       ? record.sewingLineDeliveries.find((i) => i.sewingLineID === item.id)
  //       : {}
  //     return (
  //       <EditableStateCell
  //         isEditing={false}
  //         dataIndex='amountQuantity'
  //         title='SL Còn lại'
  //         inputType='number'
  //         required={true}
  //       >
  //         <SkyTableTypography status={record.status}>
  //           {numberValidatorDisplay(
  //             numberValidatorCalc(sewingLineDeliveryRecord?.quantityOriginal) -
  //               numberValidatorCalc(sewingLineDeliveryRecord?.quantitySewed)
  //           )}
  //         </SkyTableTypography>
  //       </EditableStateCell>
  //     )
  //   },
  //   expiredDate: (record: SewingLineDeliveryTableDataType, item: SewingLineDelivery) => {
  //     const sewingLineDeliveryRecord = record.sewingLineDeliveries
  //       ? record.sewingLineDeliveries.find((i) => i.sewingLineID === item.id)
  //       : {}
  //     return (
  //       <EditableStateCell
  //         isEditing={table.isEditing(record.key!)}
  //         dataIndex='expiredDate'
  //         title='Ngày dự kiến hoàn thành'
  //         inputType='datepicker'
  //         required={true}
  //         initialValue={sewingLineDeliveryRecord?.expiredDate}
  //         onValueChange={(val: Dayjs) => {
  //           if (val) {
  //             setSewingLineDeliveryRecordTemp({ expiredDate: DayJS(val).toISOString() })
  //             const newRecords = [...newRecord.sewingLineDeliveriesToUpdate!]
  //             const index = newRecords.findIndex((i) => i.sewingLineID === item.id)
  //             if (index !== -1) {
  //               newRecords[index].expiredDate = DayJS(val).toISOString()
  //               setNewRecord({ sewingLineDeliveriesToUpdate: newRecords })
  //             } else {
  //               const recordNews = newRecords.filter((i) => i.sewingLineID !== item.id)
  //               recordNews.push({
  //                 quantitySewed: sewingLineDeliveryRecordTemp.quantitySewed,
  //                 expiredDate: DayJS(val).toISOString(),
  //                 sewingLineID: item.id
  //               })
  //               setNewRecord({ sewingLineDeliveriesToUpdate: recordNews })
  //             }
  //           }
  //         }}
  //       >
  //         <SkyTableTypography
  //           type={
  //             dayjs(record.dateOutputFCR).diff(sewingLineDeliveryRecord?.expiredDate, 'days') < 5 ? 'danger' : undefined
  //           }
  //           status={record.status}
  //         >
  //           {dateValidatorDisplay(sewingLineDeliveryRecord?.expiredDate)}
  //         </SkyTableTypography>
  //       </EditableStateCell>
  //     )
  //   }
  // }

  return (
    <>
      <BaseLayout
        title='Chuyền may'
        searchValue={searchText}
        onDateCreationChange={(enable) => table.setDateCreation(enable)}
        onSearchChange={(e) => setSearchText(e.target.value)}
        onSearch={(value) => handleSearch(value)}
        onSortChange={(checked, e) => handleSortChange(checked, e)}
        onResetClick={{
          onClick: () => handleResetClick()
        }}
      >
        <SkyTable
          bordered
          loading={table.loading}
          columns={tableColumns}
          className='relative'
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
                if (record?.sewingLineDeliveries) {
                  setNewRecord({
                    sewingLineDeliveriesToUpdate: record.sewingLineDeliveries.map((item) => {
                      return item as SewingLine
                    })
                  })
                }
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
            expandedRowRender: (record: SewingLineDeliveryTableDataType) => {
              return (
                <>
                  <Flex vertical gap={10} className='relative'>
                    <Flex vertical>
                      <Space direction='vertical' size={10} split={<Divider className='my-0 py-0' />}>
                        {!(width >= breakpoint.md) && (
                          <ExpandableItemRow title='Số lượng PO:' isEditing={false}>
                            {columns.quantityPO(record)}
                          </ExpandableItemRow>
                        )}
                        {!(width >= breakpoint.lg) && (
                          <ExpandableItemRow title='Ngày xuất FCR:' isEditing={table.isEditing(record.id!)}>
                            {columns.dateOutputFCR(record)}
                          </ExpandableItemRow>
                        )}
                        {!(width >= breakpoint.xl) && (
                          <ExpandableItemRow title='Ngày xuất FCR:' isEditing={table.isEditing(record.id!)}>
                            {columns.accessoryNotes(record)}
                          </ExpandableItemRow>
                        )}
                      </Space>
                    </Flex>
                    {/* <List
                      grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }}
                      dataSource={record.sewingLineDeliveries}
                      renderItem={(item, index) => (
                        <List.Item key={index}>
                          <Flex vertical gap={20} align='center' className='w-full'>
                            <SkyTableTypography className='w-fit' strong>
                              {item.sewingLine?.name}
                            </SkyTableTypography>
                            <Space direction='vertical' size={10} split={<Divider className='m-0 p-0' />}>
                              <ExpandableItemRow
                                className='w-fit'
                                title='SL vào chuyền:'
                                isEditing={table.isEditing(record.id!)}
                              >
                                {accessoryNotes.quantityOriginal(record, item)}
                              </ExpandableItemRow>
                              <ExpandableItemRow title='SL may được:' isEditing={table.isEditing(record.id!)}>
                                {accessoryNotes.quantitySewed(record, item)}
                              </ExpandableItemRow>
                              <ExpandableItemRow title='SL còn lại:' isEditing={false}>
                                {accessoryNotes.amountQuantity(record, item)}
                              </ExpandableItemRow>
                              <ExpandableItemRow
                                title='Ngày dự kiến hoàn thành:'
                                isEditing={table.isEditing(record.id!)}
                              >
                                {accessoryNotes.expiredDate(record, item)}
                              </ExpandableItemRow>
                            </Space>
                          </Flex>
                        </List.Item>
                      )}
                    /> */}
                    <Flex className='z-[999] h-[200px] scroll-smooth p-2'>
                      <SkyTable
                        bordered
                        virtual
                        className='absolute'
                        scroll={{
                          x: expandableColumns(record).length > 2 ? 1500 : true,
                          y: 400
                        }}
                        rowKey='id'
                        scrollTo={3}
                        loading={table.loading}
                        columns={expandableColumns(record)}
                        rowClassName='editable-row'
                        dataSource={table.dataSource.filter((item) => item.id === record.id)}
                        metaData={productService.metaData}
                        pagination={false}
                        isDateCreation={table.dateCreation}
                        editingKey={table.editingKey}
                        deletingKey={table.deletingKey}
                      />
                    </Flex>
                  </Flex>
                </>
              )
            },
            columnWidth: '0.001%'
          }}
        />
      </BaseLayout>
    </>
  )
}

export default SewingLineDeliveryPage
