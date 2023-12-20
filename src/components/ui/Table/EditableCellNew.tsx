/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { ColorPicker, DatePicker, Flex, Form, Input, InputNumber, Select, Table, Typography } from 'antd'
import { HTMLAttributes, memo } from 'react'
import { TableItemWithKey } from '~/components/hooks/useTable'
import { InputType } from '~/typing'
import { DatePattern } from '~/utils/date-formatter'

export interface EditableCellNewProps<T extends { key?: React.Key }> extends HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  initialField: {
    value: any
    data?: any[]
  }
  required?: boolean
  title: string
  inputType: InputType
  record: TableItemWithKey<T>
  index: number
}

export type EditableTableProps = Parameters<typeof Table>[0]

function EditableCellNew<T extends { key?: React.Key }>({
  editing,
  dataIndex,
  record,
  title,
  required,
  initialField,
  inputType,
  ...restProps
}: EditableCellNewProps<T>) {
  const inputNode = ((): React.ReactNode => {
    switch (inputType) {
      case 'colorpicker':
        return <ColorPicker defaultFormat='hex' value={initialField?.value} showText className='w-full' />
      case 'number':
        return <InputNumber value={initialField?.value} className='w-full' />
      case 'select':
        return (
          <Select
            placeholder='Select...'
            options={
              initialField.data
                ? initialField.data?.map((item) => {
                    return {
                      label: item.name,
                      value: item.id,
                      key: item.id
                    }
                  })
                : undefined
            }
            value={initialField?.value}
            optionRender={(ori, info) => {
              return (
                <>
                  <Flex justify='space-between' align='center' key={info.index}>
                    <Typography.Text>{ori.label}</Typography.Text>
                    <div
                      className='h-6 w-6 rounded-sm'
                      style={{
                        backgroundColor: `${ori.key}`
                      }}
                    />
                  </Flex>
                </>
              )
            }}
            className='w-full'
          />
        )
      case 'datepicker':
        return <DatePicker format={DatePattern.display} className='' />
      default:
        return <Input value={initialField?.value} name={dataIndex} className='w-full' />
    }
  })()

  return (
    <>
      {editing ? (
        <Form.Item
          name={dataIndex}
          className={restProps.className}
          initialValue={initialField?.value}
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
        restProps.children
      )}
    </>
  )
}

export default memo(EditableCellNew)
