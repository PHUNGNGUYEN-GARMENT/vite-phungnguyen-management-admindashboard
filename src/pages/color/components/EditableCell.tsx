/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { ColorPicker, Form, Input, Table } from 'antd'
import { memo } from 'react'
import { ColorTableDataType } from './ColorTable'

type InputType = 'number' | 'text'

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  title: string | undefined
  inputType: InputType
  record: ColorTableDataType
  index: number
  children: React.ReactNode
}

export type EditableTableProps = Parameters<typeof Table>[0]

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  record,
  title,
  inputType,
  children,
  ...restProps
}) => {
  const inputNode = ((): React.ReactNode => {
    switch (dataIndex) {
      case 'nameColor':
        return (
          <Form.Item
            name='nameColor'
            initialValue={record.nameColor}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`
              }
            ]}
          >
            <Input className='w-full' />
          </Form.Item>
        )
      default: // Default là trạng thái mặc định
        return (
          <Form.Item
            name='hexColor'
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`
              }
            ]}
          >
            <ColorPicker showText className='w-full' format='hex' />
          </Form.Item>
        )
    }
  })()

  return <td {...restProps}>{editing ? inputNode : children}</td>
}

export default memo(EditableCell)
