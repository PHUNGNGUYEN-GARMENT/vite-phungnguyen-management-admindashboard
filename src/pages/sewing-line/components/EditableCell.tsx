/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { ColorPicker, Form, Input, Table } from 'antd'
import { memo } from 'react'
import { TableItemWithKey } from '~/components/hooks/useTable'
import { ColorTableDataType } from '../type'

type InputType = 'number' | 'text'

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  title: string | undefined
  inputType: InputType
  record: TableItemWithKey<ColorTableDataType>
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
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`
              }
            ]}
            initialValue={record ? record.nameColor : ''}
          >
            <Input className='w-full' />
          </Form.Item>
        )
      default:
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
            initialValue={record ? record.hexColor : '#000000'}
          >
            <ColorPicker defaultFormat='hex' showText className='w-full' />
          </Form.Item>
        )
    }
  })()

  return <td {...restProps}>{editing ? inputNode : children}</td>
}

export default memo(EditableCell)
