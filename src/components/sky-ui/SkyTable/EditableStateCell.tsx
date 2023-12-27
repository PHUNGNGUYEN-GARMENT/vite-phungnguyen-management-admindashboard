/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { ColorPicker, DatePicker, Flex, Input, InputNumber, Select, Table, Typography } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { HTMLAttributes, memo } from 'react'
import { InputType } from '~/typing'
import { DatePattern } from '~/utils/date-formatter'
import { cn } from '~/utils/helpers'

export interface EditableStateCellProps extends HTMLAttributes<HTMLElement> {
  isEditing: boolean
  dataIndex: string
  value: any
  initialValue?: any
  onValueChange?: (value: any, option?: any) => void
  selectItems?: (DefaultOptionType & { optionData?: any })[]
  inputType?: InputType
  required?: boolean
  title?: string
}

export type EditableTableProps = Parameters<typeof Table>[0]

function EditableStateCell({
  isEditing,
  dataIndex,
  title,
  value,
  selectItems,
  initialValue,
  onValueChange,
  required,
  inputType,
  ...restProps
}: EditableStateCellProps) {
  const inputNode = ((): React.ReactNode => {
    switch (inputType) {
      case 'colorpicker':
        return (
          <ColorPicker
            onChange={(val, hex) => onValueChange?.(val, hex)}
            defaultFormat='hex'
            defaultValue={initialValue}
            value={value}
            showText
            className={cn('w-full', restProps.className)}
          />
        )
      case 'number':
        return (
          <InputNumber
            value={value}
            onChange={(val) => onValueChange?.(val)}
            defaultValue={initialValue}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'select':
        return (
          <Select
            placeholder={`Select ${title}`}
            options={
              selectItems &&
              selectItems.map((item) => {
                return {
                  label: item.label,
                  value: item.value,
                  key: item.optionData
                } as DefaultOptionType
              })
            }
            defaultValue={initialValue}
            onChange={(val, option) => onValueChange?.(val, option)}
            value={value}
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
            className={cn('w-full', restProps.className)}
          />
        )
      case 'colorselector':
        return (
          <Select
            placeholder={`Select ${title}`}
            options={
              selectItems &&
              selectItems.map((item) => {
                return {
                  label: item.label,
                  value: item.value,
                  key: item.optionData
                } as DefaultOptionType
              })
            }
            defaultValue={initialValue}
            onChange={(val, option) => onValueChange?.(val as number, option)}
            value={value}
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
            className={cn('w-full', restProps.className)}
          />
        )
      case 'datepicker':
        return (
          <DatePicker
            onChange={(val) => onValueChange?.(val)}
            defaultValue={initialValue}
            value={value}
            format={DatePattern.display}
            className={cn('w-full', restProps.className)}
          />
        )
      default:
        return (
          <Input
            onChange={(event) => onValueChange?.(event.target.value)}
            defaultValue={initialValue}
            value={value}
            className={cn('w-full', restProps.className)}
          />
        )
    }
  })()

  return <>{isEditing ? inputNode : restProps.children}</>
}

export default memo(EditableStateCell)