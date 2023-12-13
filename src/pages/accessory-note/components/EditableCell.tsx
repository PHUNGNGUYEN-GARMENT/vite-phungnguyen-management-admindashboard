/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { Form, Input, Table } from 'antd'
import { memo } from 'react'
import { AccessoryNoteTableDataType } from '../type'

type InputType = 'number' | 'text'

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  title: string | undefined
  inputType: InputType
  record: AccessoryNoteTableDataType
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
      case 'title':
        return (
          <Form.Item
            name='title'
            initialValue={record.title}
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
      default:
        return <></>
    }
  })()

  return <td {...restProps}>{editing ? inputNode : children}</td>
}

export default memo(EditableCell)
