/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { Checkbox, ColorPicker, DatePicker, Flex, Input, InputNumber, Select, Table, Typography } from 'antd'
import { ItemType } from 'antd/es/menu/hooks/useItems'
import { DefaultOptionType } from 'antd/es/select'
import { HTMLAttributes, memo, useState } from 'react'
import { InputType } from '~/typing'
import { DatePattern } from '~/utils/date-formatter'
import { cn } from '~/utils/helpers'
import SelectMultipleItem from '../SelectMultipleItem'

export interface EditableStateCellProps extends HTMLAttributes<HTMLElement> {
  isEditing: boolean
  dataIndex?: string
  value?: any
  initialValue?: any
  onValueChange?: (value: any, option?: any) => void
  selectItems?: (DefaultOptionType & { optionData?: any })[]
  inputType?: InputType
  required?: boolean
  title?: string
  disabled?: boolean
  isShowDropdown?: boolean
  dropdownItems?: ItemType[]
  dropdownInitialValue?: string
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
  disabled,
  isShowDropdown,
  dropdownItems,
  dropdownInitialValue,
  ...restProps
}: EditableStateCellProps) {
  const [itemSelected, setItemSelected] = useState<{ key: React.Key; values: string }>({
    key: '',
    values: ''
  })

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
            disabled={disabled}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'checkbox':
        return (
          <Checkbox
            name={dataIndex}
            checked={value}
            disabled={disabled}
            onChange={(val) => onValueChange?.(val)}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'number':
        return (
          <InputNumber
            name={dataIndex}
            value={value}
            disabled={disabled}
            onChange={(val) => onValueChange?.(val)}
            defaultValue={initialValue}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'textarea':
        return (
          <Input.TextArea
            name={dataIndex}
            value={value}
            disabled={disabled}
            onChange={(val) => onValueChange?.(val.target.value)}
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
            disabled={disabled}
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
      case 'noteselectmultiple':
        return (
          <SelectMultipleItem
            disabled={disabled}
            defaultValue={initialValue}
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
            value={value}
            onChange={(val, option) => onValueChange?.(val as number, option)}
            isShowDropdown={isShowDropdown}
            dropdownItems={dropdownItems}
            dropdownInitialValue={dropdownInitialValue}
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
            disabled={disabled}
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
            name={dataIndex}
            onChange={(val) => onValueChange?.(val)}
            defaultValue={initialValue}
            value={value}
            disabled={disabled}
            format={DatePattern.display}
            className={cn('w-full', restProps.className)}
          />
        )
      default:
        return (
          <Input
            name={dataIndex}
            onChange={(event) => onValueChange?.(event.target.value)}
            defaultValue={initialValue}
            value={value}
            disabled={disabled}
            className={cn('w-full', restProps.className)}
          />
        )
    }
  })()

  return <>{isEditing ? inputNode : restProps.children}</>
}

export default memo(EditableStateCell)
