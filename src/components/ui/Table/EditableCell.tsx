/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { ColorPicker, DatePicker, Form, Input, InputNumber, Select, Table } from 'antd'
import { memo } from 'react'
import { TableItemWithKey } from '~/components/hooks/useTable'

type InputType = 'number' | 'text' | 'colorpicker' | 'select' | 'datepicker'

interface EditableCellProps<T extends { key?: React.Key }> extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  initialValue?: unknown
  title: string | undefined
  inputType: InputType
  record: TableItemWithKey<T>
  index: number
  children: React.ReactNode
}

export type EditableTableProps = Parameters<typeof Table>[0]

function EditableCell<T extends { key?: React.Key }>({
  editing,
  dataIndex,
  record,
  title,
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
        return <InputNumber />
      case 'select':
        return <Select />
      case 'datepicker':
        return <DatePicker />
      default:
        return <Input />
    }
  })()

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          initialValue={initialValue}
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
