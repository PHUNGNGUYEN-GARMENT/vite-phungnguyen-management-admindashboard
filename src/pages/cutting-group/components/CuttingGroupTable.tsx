/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Collapse, ColorPicker, Flex, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import useDevice from '~/components/hooks/useDevice'
import useTable from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableStateCell from '~/components/sky-ui/SkyTable/EditableStateCell'
import SkyTable from '~/components/sky-ui/SkyTable/SkyTable'
import SkyTableTypography from '~/components/sky-ui/SkyTable/SkyTableTypography'
import {
  cn,
  dateValidatorChange,
  dateValidatorDisplay,
  dateValidatorInit,
  numberValidatorChange,
  numberValidatorDisplay,
  numberValidatorInit,
  textValidatorDisplay
} from '~/utils/helpers'
import useCuttingGroup from '../hooks/useCuttingGroup'
import { CuttingGroupTableDataType } from '../type'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const CuttingGroup: React.FC<Props> = () => {
  const table = useTable<CuttingGroupTableDataType>([])
  const { width } = useDevice()
  const [expandableTable, setExpandableTable] = useState<boolean>(false)
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
  } = useCuttingGroup(table)

  const columns: ColumnsType<CuttingGroupTableDataType> = [
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: '10%',
      render: (_value: any, record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell isEditing={false} dataIndex='productCode' title='Mã hàng' inputType='text' required={true}>
            <SkyTableTypography status={record.status}>{textValidatorDisplay(record.productCode)}</SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'Màu',
      dataIndex: 'colorID',
      width: '10%',
      render: (_value: any, record: CuttingGroupTableDataType) => {
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
                  {textValidatorDisplay(record.productColor?.color?.name)}
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
      title: 'Số lượng PO',
      dataIndex: 'quantityPO',
      width: '10%',
      render: (_value: any, record: CuttingGroupTableDataType) => {
        return (
          <>
            <EditableStateCell
              isEditing={false}
              dataIndex='quantityPO'
              title='Số lượng PO'
              inputType='number'
              required={true}
            >
              <SkyTableTypography status={'active'}>{numberValidatorDisplay(record.quantityPO)}</SkyTableTypography>
            </EditableStateCell>
          </>
        )
      }
    },
    {
      title: 'SL Thực cắt',
      dataIndex: 'quantityRealCut',
      width: '10%',
      render: (_value: any, record: CuttingGroupTableDataType) => {
        return (
          <>
            <EditableStateCell
              isEditing={table.isEditing(record.key!)}
              dataIndex='quantityRealCut'
              title='Thực cắt'
              inputType='number'
              required={true}
              initialValue={record.cuttingGroup && numberValidatorInit(record.cuttingGroup?.quantityRealCut)}
              value={newRecord?.quantityRealCut}
              onValueChange={(val) => setNewRecord({ ...newRecord, quantityRealCut: numberValidatorChange(val) })}
            >
              <SkyTableTypography status={record.status}>
                {record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityRealCut)}
              </SkyTableTypography>
            </EditableStateCell>
          </>
        )
      }
    },
    {
      title: 'Ngày giờ cắt',
      dataIndex: 'timeCut',
      width: '15%',
      render: (_value: any, record: CuttingGroupTableDataType) => {
        return (
          <EditableStateCell
            isEditing={table.isEditing(record.key!)}
            dataIndex='timeCut'
            title='Ngày giờ cắt'
            inputType='datepicker'
            required={true}
            initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.timeCut)}
            onValueChange={(val: Dayjs) => setNewRecord({ ...newRecord, timeCut: dateValidatorChange(val) })}
          >
            <SkyTableTypography status={record.status}>
              {record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.timeCut)}
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    },
    {
      title: 'SL Còn lại',
      dataIndex: 'remainingAmount',
      width: '10%',
      render: (_value: any, record: CuttingGroupTableDataType) => {
        const totalAmount =
          numberValidatorDisplay(record.quantityPO) - numberValidatorDisplay(record.cuttingGroup?.quantityRealCut)
        return (
          <EditableStateCell isEditing={false} dataIndex='remainingAmount' title='Còn lại' inputType='number'>
            <SkyTableTypography status={record.status}>
              {totalAmount < 0 ? totalAmount * -1 : totalAmount} <span>{totalAmount < 0 && '(Dư)'}</span>
            </SkyTableTypography>
          </EditableStateCell>
        )
      }
    }
  ]

  const expandableColumns: ColumnsType<CuttingGroupTableDataType> = [
    {
      title: 'In thêu',
      children: [
        {
          title: 'Ngày gửi in thêu',
          dataIndex: 'dateSendEmbroidered',
          width: '25%',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <EditableStateCell
                isEditing={table.isEditing(record.key!)}
                dataIndex='dateSendEmbroidered'
                title='Ngày gửi in thêu'
                inputType='datepicker'
                required={true}
                initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.dateSendEmbroidered)}
                onValueChange={(val: Dayjs) =>
                  setNewRecord({
                    ...newRecord,
                    dateSendEmbroidered: dateValidatorChange(val)
                  })
                }
              >
                <SkyTableTypography status={record.status}>
                  {record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.dateSendEmbroidered)}
                </SkyTableTypography>
              </EditableStateCell>
            )
          }
        },
        {
          title: 'SL Còn lại',
          dataIndex: 'amountQuantityEmbroidered',
          width: '25%',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            const totalAmount = record.cuttingGroup
              ? numberValidatorDisplay(record.cuttingGroup.quantityArrived1Th) +
                numberValidatorDisplay(record.cuttingGroup.quantityArrived2Th) +
                numberValidatorDisplay(record.cuttingGroup.quantityArrived3Th) +
                numberValidatorDisplay(record.cuttingGroup.quantityArrived4Th) +
                numberValidatorDisplay(record.cuttingGroup.quantityArrived5Th) +
                numberValidatorDisplay(record.cuttingGroup.quantityArrived6Th) +
                numberValidatorDisplay(record.cuttingGroup.quantityArrived7Th) +
                numberValidatorDisplay(record.cuttingGroup.quantityArrived8Th) +
                numberValidatorDisplay(record.cuttingGroup.quantityArrived9Th) +
                numberValidatorDisplay(record.cuttingGroup.quantityArrived10Th)
              : 0
            const total = numberValidatorDisplay(record.quantityPO) - totalAmount
            return (
              <>
                <EditableStateCell
                  isEditing={false}
                  dataIndex='amountQuantityEmbroidered'
                  title='SL Còn lại'
                  inputType='number'
                  required={true}
                >
                  <SkyTableTypography status={record.status}>{total}</SkyTableTypography>
                </EditableStateCell>
              </>
            )
          }
        }
      ]
    },
    {
      title: 'Bán thành phẩm',
      children: [
        {
          title: 'SL Giao BTP',
          dataIndex: 'quantityDeliveredBTP',
          width: '25%',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <>
                <EditableStateCell
                  isEditing={table.isEditing(record.key!)}
                  dataIndex='quantityDeliveredBTP'
                  title='SL Giao'
                  inputType='number'
                  required={true}
                  initialValue={record.cuttingGroup ? record.cuttingGroup.quantityDeliveredBTP : ''}
                  value={newRecord && (newRecord?.quantityDeliveredBTP ?? 0)}
                  onValueChange={(val) => setNewRecord({ ...newRecord, quantityDeliveredBTP: val })}
                >
                  <SkyTableTypography status={record.status}>
                    {record.cuttingGroup ? record.cuttingGroup?.quantityDeliveredBTP : ''}
                  </SkyTableTypography>
                </EditableStateCell>
              </>
            )
          }
        },
        {
          title: 'SL Còn lại',
          dataIndex: 'amountQuantityDeliveredBTP',
          width: '25%',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            const amountQuantityBTP =
              numberValidatorDisplay(record.quantityPO) -
              numberValidatorDisplay(record.cuttingGroup?.quantityDeliveredBTP)
            return (
              <>
                <EditableStateCell
                  isEditing={false}
                  dataIndex='amountQuantityDeliveredBTP'
                  title='SL Còn lại'
                  inputType='number'
                  required={true}
                >
                  <SkyTableTypography status={record.status}>{amountQuantityBTP}</SkyTableTypography>
                </EditableStateCell>
              </>
            )
          }
        }
      ]
    }
  ]

  const expandableColumns2: ColumnsType<CuttingGroupTableDataType> = [
    {
      title: 'Lần 1',
      children: [
        {
          title: 'SL về',
          dataIndex: 'quantityArrived',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <>
                <EditableStateCell
                  isEditing={table.isEditing(record.key!)}
                  dataIndex='quantityArrived'
                  title='Thực cắt'
                  inputType='number'
                  required={true}
                  initialValue={record.cuttingGroup && numberValidatorInit(record.cuttingGroup.quantityArrived1Th)}
                  value={newRecord?.quantityArrived1Th}
                  onValueChange={(val) =>
                    setNewRecord({ ...newRecord, quantityArrived1Th: numberValidatorChange(val) })
                  }
                >
                  <SkyTableTypography status={record.status}>
                    {record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityArrived1Th)}
                  </SkyTableTypography>
                </EditableStateCell>
              </>
            )
          }
        },
        {
          title: 'Ngày về',
          dataIndex: 'dateArrived',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <EditableStateCell
                isEditing={table.isEditing(record.key!)}
                dataIndex='dateArrived'
                title='Ngày về'
                inputType='datepicker'
                required={true}
                initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.dateArrived1Th)}
                onValueChange={(val: Dayjs) =>
                  setNewRecord({
                    ...newRecord,
                    dateArrived1Th: dateValidatorChange(val)
                  })
                }
              >
                <SkyTableTypography status={record.status}>
                  {record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.dateArrived1Th)}
                </SkyTableTypography>
              </EditableStateCell>
            )
          }
        }
      ]
    },
    {
      title: 'Lần 2',
      children: [
        {
          title: 'SL về',
          dataIndex: 'quantityArrived',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <>
                <EditableStateCell
                  isEditing={table.isEditing(record.key!)}
                  dataIndex='quantityArrived'
                  title='Thực cắt'
                  inputType='number'
                  required={true}
                  initialValue={record.cuttingGroup && numberValidatorInit(record.cuttingGroup.quantityArrived2Th)}
                  value={newRecord?.quantityArrived2Th}
                  onValueChange={(val) =>
                    setNewRecord({ ...newRecord, quantityArrived2Th: numberValidatorChange(val) })
                  }
                >
                  <SkyTableTypography status={record.status}>
                    {record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityArrived2Th)}
                  </SkyTableTypography>
                </EditableStateCell>
              </>
            )
          }
        },
        {
          title: 'Ngày về',
          dataIndex: 'dateArrived',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <EditableStateCell
                isEditing={table.isEditing(record.key!)}
                dataIndex='dateArrived'
                title='Ngày về'
                inputType='datepicker'
                required={true}
                initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.dateArrived2Th)}
                onValueChange={(val: Dayjs) =>
                  setNewRecord({
                    ...newRecord,
                    dateArrived2Th: dateValidatorChange(val)
                  })
                }
              >
                <SkyTableTypography status={record.status}>
                  {record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.dateArrived2Th)}
                </SkyTableTypography>
              </EditableStateCell>
            )
          }
        }
      ]
    },
    {
      title: 'Lần 3',
      children: [
        {
          title: 'SL về',
          dataIndex: 'quantityArrived',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <>
                <EditableStateCell
                  isEditing={table.isEditing(record.key!)}
                  dataIndex='quantityArrived'
                  title='Thực cắt'
                  inputType='number'
                  required={true}
                  initialValue={record.cuttingGroup && numberValidatorInit(record.cuttingGroup.quantityArrived3Th)}
                  value={newRecord?.quantityArrived3Th}
                  onValueChange={(val) =>
                    setNewRecord({ ...newRecord, quantityArrived3Th: numberValidatorChange(val) })
                  }
                >
                  <SkyTableTypography status={record.status}>
                    {record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityArrived3Th)}
                  </SkyTableTypography>
                </EditableStateCell>
              </>
            )
          }
        },
        {
          title: 'Ngày về',
          dataIndex: 'dateArrived',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <EditableStateCell
                isEditing={table.isEditing(record.key!)}
                dataIndex='dateArrived'
                title='Ngày về'
                inputType='datepicker'
                required={true}
                initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.dateArrived3Th)}
                onValueChange={(val: Dayjs) =>
                  setNewRecord({
                    ...newRecord,
                    dateArrived3Th: dateValidatorChange(val)
                  })
                }
              >
                <SkyTableTypography status={record.status}>
                  {record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.dateArrived3Th)}
                </SkyTableTypography>
              </EditableStateCell>
            )
          }
        }
      ]
    },
    {
      title: 'Lần 4',
      children: [
        {
          title: 'SL về',
          dataIndex: 'quantityArrived',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <>
                <EditableStateCell
                  isEditing={table.isEditing(record.key!)}
                  dataIndex='quantityArrived'
                  title='Thực cắt'
                  inputType='number'
                  required={true}
                  initialValue={record.cuttingGroup && numberValidatorInit(record.cuttingGroup.quantityArrived4Th)}
                  value={newRecord?.quantityArrived4Th}
                  onValueChange={(val) =>
                    setNewRecord({ ...newRecord, quantityArrived4Th: numberValidatorChange(val) })
                  }
                >
                  <SkyTableTypography status={record.status}>
                    {record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityArrived4Th)}
                  </SkyTableTypography>
                </EditableStateCell>
              </>
            )
          }
        },
        {
          title: 'Ngày về',
          dataIndex: 'dateArrived',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <EditableStateCell
                isEditing={table.isEditing(record.key!)}
                dataIndex='dateArrived'
                title='Ngày về'
                inputType='datepicker'
                required={true}
                initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.dateArrived4Th)}
                onValueChange={(val: Dayjs) =>
                  setNewRecord({
                    ...newRecord,
                    dateArrived4Th: dateValidatorChange(val)
                  })
                }
              >
                <SkyTableTypography status={record.status}>
                  {record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.dateArrived4Th)}
                </SkyTableTypography>
              </EditableStateCell>
            )
          }
        }
      ]
    },
    {
      title: 'Lần 5',
      children: [
        {
          title: 'SL về',
          dataIndex: 'quantityArrived',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <>
                <EditableStateCell
                  isEditing={table.isEditing(record.key!)}
                  dataIndex='quantityArrived'
                  title='Thực cắt'
                  inputType='number'
                  required={true}
                  initialValue={record.cuttingGroup && numberValidatorInit(record.cuttingGroup.quantityArrived5Th)}
                  value={newRecord?.quantityArrived5Th}
                  onValueChange={(val) =>
                    setNewRecord({ ...newRecord, quantityArrived5Th: numberValidatorChange(val) })
                  }
                >
                  <SkyTableTypography status={record.status}>
                    {record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityArrived5Th)}
                  </SkyTableTypography>
                </EditableStateCell>
              </>
            )
          }
        },
        {
          title: 'Ngày về',
          dataIndex: 'dateArrived',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <EditableStateCell
                isEditing={table.isEditing(record.key!)}
                dataIndex='dateArrived'
                title='Ngày về'
                inputType='datepicker'
                required={true}
                initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.dateArrived5Th)}
                onValueChange={(val: Dayjs) =>
                  setNewRecord({
                    ...newRecord,
                    dateArrived5Th: dateValidatorChange(val)
                  })
                }
              >
                <SkyTableTypography status={record.status}>
                  {record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.dateArrived5Th)}
                </SkyTableTypography>
              </EditableStateCell>
            )
          }
        }
      ]
    }
  ]

  const expandableColumns3: ColumnsType<CuttingGroupTableDataType> = [
    {
      title: 'Lần 6',
      children: [
        {
          title: 'SL về',
          dataIndex: 'quantityArrived',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <>
                <EditableStateCell
                  isEditing={table.isEditing(record.key!)}
                  dataIndex='quantityArrived'
                  title='Thực cắt'
                  inputType='number'
                  required={true}
                  initialValue={record.cuttingGroup && numberValidatorInit(record.cuttingGroup.quantityArrived6Th)}
                  value={newRecord?.quantityArrived6Th}
                  onValueChange={(val) =>
                    setNewRecord({ ...newRecord, quantityArrived6Th: numberValidatorChange(val) })
                  }
                >
                  <SkyTableTypography status={record.status}>
                    {record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityArrived6Th)}
                  </SkyTableTypography>
                </EditableStateCell>
              </>
            )
          }
        },
        {
          title: 'Ngày về',
          dataIndex: 'dateArrived',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <EditableStateCell
                isEditing={table.isEditing(record.key!)}
                dataIndex='dateArrived'
                title='Ngày về'
                inputType='datepicker'
                required={true}
                initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.dateArrived6Th)}
                onValueChange={(val: Dayjs) =>
                  setNewRecord({
                    ...newRecord,
                    dateArrived6Th: dateValidatorChange(val)
                  })
                }
              >
                <SkyTableTypography status={record.status}>
                  {record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.dateArrived6Th)}
                </SkyTableTypography>
              </EditableStateCell>
            )
          }
        }
      ]
    },
    {
      title: 'Lần 7',
      children: [
        {
          title: 'SL về',
          dataIndex: 'quantityArrived',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <>
                <EditableStateCell
                  isEditing={table.isEditing(record.key!)}
                  dataIndex='quantityArrived'
                  title='Thực cắt'
                  inputType='number'
                  required={true}
                  initialValue={record.cuttingGroup && numberValidatorInit(record.cuttingGroup.quantityArrived7Th)}
                  value={newRecord?.quantityArrived7Th}
                  onValueChange={(val) =>
                    setNewRecord({ ...newRecord, quantityArrived7Th: numberValidatorChange(val) })
                  }
                >
                  <SkyTableTypography status={record.status}>
                    {record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityArrived7Th)}
                  </SkyTableTypography>
                </EditableStateCell>
              </>
            )
          }
        },
        {
          title: 'Ngày về',
          dataIndex: 'dateArrived',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <EditableStateCell
                isEditing={table.isEditing(record.key!)}
                dataIndex='dateArrived'
                title='Ngày về'
                inputType='datepicker'
                required={true}
                initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.dateArrived7Th)}
                onValueChange={(val: Dayjs) =>
                  setNewRecord({
                    ...newRecord,
                    dateArrived7Th: dateValidatorChange(val)
                  })
                }
              >
                <SkyTableTypography status={record.status}>
                  {record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.dateArrived7Th)}
                </SkyTableTypography>
              </EditableStateCell>
            )
          }
        }
      ]
    },
    {
      title: 'Lần 8',
      children: [
        {
          title: 'SL về',
          dataIndex: 'quantityArrived',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <>
                <EditableStateCell
                  isEditing={table.isEditing(record.key!)}
                  dataIndex='quantityArrived'
                  title='Thực cắt'
                  inputType='number'
                  required={true}
                  initialValue={record.cuttingGroup && numberValidatorInit(record.cuttingGroup.quantityArrived8Th)}
                  value={newRecord?.quantityArrived8Th}
                  onValueChange={(val) =>
                    setNewRecord({ ...newRecord, quantityArrived8Th: numberValidatorChange(val) })
                  }
                >
                  <SkyTableTypography status={record.status}>
                    {record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityArrived8Th)}
                  </SkyTableTypography>
                </EditableStateCell>
              </>
            )
          }
        },
        {
          title: 'Ngày về',
          dataIndex: 'dateArrived',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <EditableStateCell
                isEditing={table.isEditing(record.key!)}
                dataIndex='dateArrived'
                title='Ngày về'
                inputType='datepicker'
                required={true}
                initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.dateArrived8Th)}
                onValueChange={(val: Dayjs) =>
                  setNewRecord({
                    ...newRecord,
                    dateArrived8Th: dateValidatorChange(val)
                  })
                }
              >
                <SkyTableTypography status={record.status}>
                  {record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.dateArrived8Th)}
                </SkyTableTypography>
              </EditableStateCell>
            )
          }
        }
      ]
    },
    {
      title: 'Lần 9',
      children: [
        {
          title: 'SL về',
          dataIndex: 'quantityArrived',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <>
                <EditableStateCell
                  isEditing={table.isEditing(record.key!)}
                  dataIndex='quantityArrived'
                  title='Thực cắt'
                  inputType='number'
                  required={true}
                  initialValue={record.cuttingGroup && numberValidatorInit(record.cuttingGroup.quantityArrived9Th)}
                  value={newRecord?.quantityArrived9Th}
                  onValueChange={(val) =>
                    setNewRecord({ ...newRecord, quantityArrived9Th: numberValidatorChange(val) })
                  }
                >
                  <SkyTableTypography status={record.status}>
                    {record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityArrived9Th)}
                  </SkyTableTypography>
                </EditableStateCell>
              </>
            )
          }
        },
        {
          title: 'Ngày về',
          dataIndex: 'dateArrived',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <EditableStateCell
                isEditing={table.isEditing(record.key!)}
                dataIndex='dateArrived'
                title='Ngày về'
                inputType='datepicker'
                required={true}
                initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.dateArrived9Th)}
                onValueChange={(val: Dayjs) =>
                  setNewRecord({
                    ...newRecord,
                    dateArrived9Th: dateValidatorChange(val)
                  })
                }
              >
                <SkyTableTypography status={record.status}>
                  {record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.dateArrived9Th)}
                </SkyTableTypography>
              </EditableStateCell>
            )
          }
        }
      ]
    },
    {
      title: 'Lần 10',
      children: [
        {
          title: 'SL về',
          dataIndex: 'quantityArrived',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <>
                <EditableStateCell
                  isEditing={table.isEditing(record.key!)}
                  dataIndex='quantityArrived'
                  title='Thực cắt'
                  inputType='number'
                  required={true}
                  initialValue={record.cuttingGroup && numberValidatorInit(record.cuttingGroup.quantityArrived10Th)}
                  value={newRecord?.quantityArrived10Th}
                  onValueChange={(val) =>
                    setNewRecord({ ...newRecord, quantityArrived10Th: numberValidatorChange(val) })
                  }
                >
                  <SkyTableTypography status={record.status}>
                    {record.cuttingGroup && numberValidatorDisplay(record.cuttingGroup?.quantityArrived10Th)}
                  </SkyTableTypography>
                </EditableStateCell>
              </>
            )
          }
        },
        {
          title: 'Ngày về',
          dataIndex: 'dateArrived',
          render: (_value: any, record: CuttingGroupTableDataType) => {
            return (
              <EditableStateCell
                isEditing={table.isEditing(record.key!)}
                dataIndex='dateArrived'
                title='Ngày về'
                inputType='datepicker'
                required={true}
                initialValue={record.cuttingGroup && dateValidatorInit(record.cuttingGroup.dateArrived10Th)}
                onValueChange={(val: Dayjs) =>
                  setNewRecord({
                    ...newRecord,
                    dateArrived10Th: dateValidatorChange(val)
                  })
                }
              >
                <SkyTableTypography status={record.status}>
                  {record.cuttingGroup && dateValidatorDisplay(record.cuttingGroup.dateArrived10Th)}
                </SkyTableTypography>
              </EditableStateCell>
            )
          }
        }
      ]
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
                setNewRecord(record?.cuttingGroup)
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
                <>
                  {width < 1600 && (
                    <Flex vertical gap={10}>
                      <SkyTable
                        bordered
                        loading={table.loading}
                        columns={expandableColumns}
                        rowClassName='editable-row'
                        dataSource={table.dataSource.filter((item) => item.id === record.id)}
                        metaData={productService.metaData}
                        pagination={false}
                        isDateCreation={table.dateCreation}
                        editingKey={table.editingKey}
                        deletingKey={table.deletingKey}
                      />
                      <Collapse
                        className='w-full'
                        items={[
                          {
                            key: '1',
                            label: (
                              <Typography.Title className='m-0' level={5} type='secondary'>
                                In thêu về
                              </Typography.Title>
                            ),
                            children: (
                              <Flex vertical gap={10}>
                                <SkyTable
                                  bordered
                                  loading={table.loading}
                                  columns={expandableColumns2}
                                  rowClassName='editable-row'
                                  dataSource={table.dataSource.filter((item) => item.id === record.id)}
                                  metaData={productService.metaData}
                                  pagination={false}
                                  isDateCreation={table.dateCreation}
                                  editingKey={table.editingKey}
                                  deletingKey={table.deletingKey}
                                />
                                <div className='flex w-full items-center justify-center'>
                                  <Button
                                    type='link'
                                    className='flex items-center justify-center'
                                    onClick={() => setExpandableTable((prev) => !prev)}
                                  >
                                    <span>Mở rộng</span>
                                    <ChevronDown
                                      size={20}
                                      className={cn('transition-transform duration-300', {
                                        'rotate-180': expandableTable
                                      })}
                                    />
                                  </Button>
                                </div>
                                {expandableTable && (
                                  <SkyTable
                                    bordered
                                    loading={table.loading}
                                    columns={expandableColumns3}
                                    rowClassName='editable-row'
                                    dataSource={table.dataSource.filter((item) => item.id === record.id)}
                                    metaData={productService.metaData}
                                    pagination={false}
                                    isDateCreation={table.dateCreation}
                                    editingKey={table.editingKey}
                                    deletingKey={table.deletingKey}
                                  />
                                )}
                              </Flex>
                            )
                          }
                        ]}
                      />
                    </Flex>
                  )}
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

export default CuttingGroup
