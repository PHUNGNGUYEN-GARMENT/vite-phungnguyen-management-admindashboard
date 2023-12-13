/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { Form, Input, Table } from 'antd'
import { memo } from 'react'
import { TableItemWithKey } from '~/components/hooks/useTable'
import { SewingLineTableDataType } from '../type'

type InputType = 'number' | 'text'

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  title: string | undefined
  inputType: InputType
  record: TableItemWithKey<SewingLineTableDataType>
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
      case 'sewingLineName':
        return (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`
              }
            ]}
            initialValue={record.sewingLineName}
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
