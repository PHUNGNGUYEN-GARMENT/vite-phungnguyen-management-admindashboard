/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { Checkbox, ColorPicker, DatePicker, Flex, Input, InputNumber, Select, Table, Typography } from 'antd'
import { DefaultOptionType, SelectProps } from 'antd/es/select'
import { HTMLAttributes, memo } from 'react'
import { InputType } from '~/typing'
import { DatePattern } from '~/utils/date-formatter'
import { cn } from '~/utils/helpers'

export interface EditableStateCellProps extends HTMLAttributes<HTMLElement> {
  isEditing: boolean
  dataIndex?: string
  value?: any
  setLoading?: (enable: boolean) => void
  initialValue?: any
  onValueChange?: (value: any, option?: any) => void
  selectProps?: SelectProps
  selectItems?: (DefaultOptionType & { optionData?: any })[]
  inputType?: InputType
  required?: boolean
  title?: string
  disabled?: boolean
}

export type EditableTableProps = Parameters<typeof Table>[0]

function EditableStateCell({
  isEditing,
  dataIndex,
  title,
  value,
  selectItems,
  selectProps,
  initialValue,
  onValueChange,
  setLoading,
  required,
  inputType,
  disabled,
  ...restProps
}: EditableStateCellProps) {
  // const [itemSelects, setItemSelects] = useState<{ accessoryNoteID: React.Key; garmentNoteStatusID: React.Key }[]>([])

  // const handleMenuSelectItem = (value: React.Key, info: any) => {
  //   if (selectItems) {
  //     const newItems = [...selectItems]
  //     const index = selectItems.findIndex((i) => i.value === value)
  //     if (index !== -1) {
  //       newItems[index].garmentNoteStatusID = info.key
  //       console.log({
  //         value: value,
  //         info: info
  //       })
  //     } else {
  //       // Handle the case when the selectedKey is not found in the array
  //       console.error(`Object with selectKey ${value} not found in the array.`)
  //     }
  //     setItemSelects(
  //       newItems.map((item) => {
  //         return {
  //           accessoryNoteID: Number(item.value),
  //           garmentNoteStatusID: info.key
  //         }
  //       })
  //     )
  //   }
  // }

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
            {...selectProps}
            onChange={(val, option) => onValueChange?.(val, option)}
            optionRender={
              selectProps
                ? selectProps.optionRender
                : (ori, info) => {
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
                  }
            }
            className={cn('w-full', restProps.className)}
          />
        )
      case 'multipleselect':
        return (
          <Select
            {...selectProps}
            mode='multiple'
            virtual={false}
            value={value}
            onChange={(val: number[], option) => onValueChange?.(val, option)}
            className='w-full'
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
