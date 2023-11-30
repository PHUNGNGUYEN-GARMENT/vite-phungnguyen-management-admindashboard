import type { SelectProps } from 'antd'
import { DatePicker, Form, Input, InputNumber, Select, Table } from 'antd'
import { memo } from 'react'
import Status from '~/components/ui/Status'
import { StatusType } from '~/typing'
import { ProductTableDataType } from './ProductTable'

type InputType = 'select' | 'text' | 'number' | 'datepicker' | 'view'

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  record,
  title,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inputType,
  children,
  ...restProps
}) => {
  const statusOptions: SelectProps['options'] = [
    {
      label: 'Normal',
      value: 'normal'
    },
    {
      label: 'Warning',
      value: 'warn'
    },
    {
      label: 'Error',
      value: 'error'
    },
    {
      label: 'Success',
      value: 'success'
    }
  ]

  const convertStatusType = (
    value: string | number
  ): { type: StatusType; label: string } => {
    switch (value) {
      case 'error':
        return { type: 'error', label: 'Error' }
      case 'warn':
        return { type: 'warn', label: 'Warn' }
      case 'success':
        return { type: 'success', label: 'Success' }
      default:
        return { type: 'normal', label: 'Normal' }
    }
  }

  const inputNode = ((): React.ReactNode => {
    switch (dataIndex) {
      case 'id':
        return (
          <Form.Item
            name='id'
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`
              }
            ]}
          >
            <div />
          </Form.Item>
        )
      case 'productCode':
        return (
          <Form.Item
            name='productCode'
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
      case 'quantityPO':
        return (
          <Form.Item
            name='quantityPO'
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`
              }
            ]}
          >
            <InputNumber className='w-full' />
          </Form.Item>
        )
      case 'dateOutputFCR':
        return (
          <Form.Item
            name='dateOutputFCR'
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`
              }
            ]}
          >
            <DatePicker className='w-full' format='DD/MM/YYYY' />
          </Form.Item>
        )
      default: // Default là trạng thái mặc định
        switch (dataIndex) {
          case 'sewing':
            return (
              <Form.Item
                name='sewing'
                style={{ margin: 0 }}
                rules={[
                  {
                    required: true,
                    message: `Please Input ${title}!`
                  }
                ]}
              >
                <Select
                  value={record.sewing ?? 'normal'}
                  className='w-full'
                  options={statusOptions}
                  optionRender={(option) => {
                    return (
                      <Status
                        type={convertStatusType(option.value ?? '').type}
                        label={convertStatusType(option.value ?? '').label}
                      />
                    )
                  }}
                />
              </Form.Item>
            )
          case 'iron':
            return (
              <Form.Item
                name='iron'
                style={{ margin: 0 }}
                rules={[
                  {
                    required: true,
                    message: `Please Input ${title}!`
                  }
                ]}
              >
                <Select
                  className='w-full'
                  options={statusOptions}
                  optionRender={(option) => {
                    return (
                      <Status
                        type={convertStatusType(option.value ?? '').type}
                        label={convertStatusType(option.value ?? '').label}
                      />
                    )
                  }}
                />
              </Form.Item>
            )
          case 'check':
            return (
              <Form.Item
                name='check'
                style={{ margin: 0 }}
                rules={[
                  {
                    required: true,
                    message: `Please Input ${title}!`
                  }
                ]}
              >
                <Select
                  className='w-full'
                  options={statusOptions}
                  optionRender={(option) => {
                    return (
                      <Status
                        type={convertStatusType(option.value ?? '').type}
                        label={convertStatusType(option.value ?? '').label}
                      />
                    )
                  }}
                />
              </Form.Item>
            )
          default:
            return (
              <Form.Item
                name='pack'
                style={{ margin: 0 }}
                rules={[
                  {
                    required: true,
                    message: `Please Input ${title}!`
                  }
                ]}
              >
                <Select
                  className='w-full'
                  options={statusOptions}
                  optionRender={(option) => {
                    return (
                      <Status
                        type={convertStatusType(option.value ?? '').type}
                        label={convertStatusType(option.value ?? '').label}
                      />
                    )
                  }}
                />
              </Form.Item>
            )
        }
    }
  })()

  return <td {...restProps}>{editing ? inputNode : children}</td>
}

// eslint-disable-next-line react-refresh/only-export-components
export default memo(EditableCell)
