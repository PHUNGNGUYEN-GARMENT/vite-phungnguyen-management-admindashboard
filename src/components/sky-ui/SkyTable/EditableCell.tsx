/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { ColorPicker, DatePicker, Form, Input, InputNumber, Select, Table } from 'antd'
import { memo } from 'react'
import { TableItemWithKey } from '~/components/hooks/useTable'
import { InputType } from '~/typing'
import { DatePattern } from '~/utils/date-formatter'

export interface EditableCellProps<T extends { key?: React.Key }> {
  editing: boolean
  dataIndex: string
  setLoading?: (enable: boolean) => void
  initialValue?: any
  required?: boolean
  title: string
  inputType: InputType
  record: TableItemWithKey<T>
  index: number
  children?: React.ReactNode
}

export type EditableTableProps = Parameters<typeof Table>[0]

function EditableCell<T extends { key?: React.Key }>({
  editing,
  dataIndex,
  record,
  title,
  required,
  initialValue,
  inputType,
  children,
  ...restProps
}: EditableCellProps<T>) {
  const inputNode = ((): React.ReactNode => {
    switch (inputType) {
      case 'colorpicker':
        return <ColorPicker defaultFormat='hex' showText className='w-full' />
      case 'number':
        return <InputNumber className='w-full' />
      case 'select':
        return <Select />
      case 'datepicker':
        return <DatePicker format={DatePattern.display} className='' />
      default:
        return <Input className='w-full' />
    }
  })()

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          initialValue={initialValue ?? ''}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`
            }
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

export default memo(EditableCell)