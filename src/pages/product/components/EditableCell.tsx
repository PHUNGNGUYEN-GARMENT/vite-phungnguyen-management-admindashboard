/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker, Input, InputNumber, Select, Table } from 'antd'
import dayjs from 'dayjs'
import { memo, useEffect } from 'react'
import { ProductTableDataType } from '../ProductPage'

type InputType = 'select' | 'text' | 'number' | 'datepicker' | 'view'

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  title: any
  inputType: InputType
  record: ProductTableDataType
  index: number
  children: React.ReactNode
}

export type EditableTableProps = Parameters<typeof Table>[0]

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  record,
  inputType,
  children,
  ...restProps
}) => {

  const inputTypeComponentMap: Record<string, React.ReactNode> = {
    number: (
      <InputNumber
        className='w-full'
        value={record ? record.quantityPO : '0'}
        placeholder='Quantity po..'
      />
    ),
    text: <Input value={record ? record.productCode : ''} />,
    select: (
      <Select
        mode='multiple'
        allowClear
        placeholder='Please select'
        optionLabelProp='label'
        defaultValue={record ? record.status : ['']}
        className='w-full'
        style={{
          width: '100%'
        }}
      />
    ),
    datepicker: (
      <DatePicker
        defaultValue={dayjs(
          dataIndex === 'dateInputNPL'
            ? record
              ? record.dateInputNPL
              : ''
            : record
              ? record.dateOutputFCR
              : ''
        )}
      />
    ),
    view: <>{record ? record.key : ''}</>
  }

  const inputNode: React.ReactNode =
    inputTypeComponentMap[inputType] || inputTypeComponentMap['default']

  return <td {...restProps}>{editing ? <>{inputNode}</> : children}</td>
}

export default memo(EditableCell)
