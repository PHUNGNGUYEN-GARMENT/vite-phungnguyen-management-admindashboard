/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { ColorPicker, DatePicker, Flex, Form, Input, InputNumber, Select, Table, Typography } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { HTMLAttributes, memo } from 'react'
import { InputType } from '~/typing'
import { DatePattern } from '~/utils/date-formatter'
import { cn } from '~/utils/helpers'

export type EditableCellRequiredType = { key?: React.Key; name?: string; id?: number }

export interface EditableCellNewProps extends HTMLAttributes<HTMLElement> {
  isEditing: boolean
  dataIndex: string
  inputType?: InputType
  initialField?: {
    value: any
    data?: any
    selectItems?: (DefaultOptionType & { optionData?: any })[]
  }
  required?: boolean
  title?: string
}

export type EditableTableProps = Parameters<typeof Table>[0]

function EditableCellNew({
  isEditing,
  dataIndex,
  title,
  required,
  initialField,
  inputType,
  ...restProps
}: EditableCellNewProps) {
  const inputNode = ((): React.ReactNode => {
    switch (inputType) {
      case 'colorpicker':
        return <ColorPicker defaultFormat='hex' value={initialField?.value} showText className='w-full' />
      case 'number':
        return <InputNumber value={initialField?.value} className='w-full' />
      case 'select':
        return (
          <Select
            placeholder={`Select ${title}`}
            options={
              initialField?.selectItems &&
              initialField.selectItems.map((item) => {
                return {
                  label: item.label,
                  value: item.value,
                  key: item.optionData
                } as DefaultOptionType
              })
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
        return <DatePicker format={DatePattern.display} className='w-full' />
      default:
        return <Input value={initialField?.value} className='w-full' />
    }
  })()

  return (
    <>
      {isEditing ? (
        <Form.Item
          name={dataIndex}
          className={cn('w-full', restProps.className)}
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
