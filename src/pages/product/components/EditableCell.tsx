import { Form, Input, InputNumber, Table } from 'antd'
import { memo } from 'react'
import { ProductTableDataType } from '../ProductPage'

type InputType = 'number' | 'text'

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  title: any
  inputType: InputType
  record: ProductTableDataType
  index: number
  children: React.ReactNode
}

export type EditableTableProps = Parameters<typeof Table>[0]

// eslint-disable-next-line react-refresh/only-export-components
const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  record,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
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

// eslint-disable-next-line react-refresh/only-export-components
export default memo(EditableCell)
