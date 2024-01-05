/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import {
  Checkbox,
  CheckboxProps,
  ColorPicker,
  ColorPickerProps,
  DatePicker,
  Flex,
  Input,
  InputNumber,
  InputNumberProps,
  Select,
  Table,
  Typography
} from 'antd'
import { InputProps, TextAreaProps } from 'antd/es/input'
import { SelectProps } from 'antd/es/select'
import { HTMLAttributes, memo } from 'react'
import { InputType } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { cn } from '~/utils/helpers'

export interface EditableStateCellProps extends HTMLAttributes<HTMLElement> {
  isEditing: boolean
  dataIndex?: string
  value?: any
  setLoading?: (enable: boolean) => void
  initialValue?: any
  onValueChange?: (value: any, option?: any) => void
  selectProps?: SelectProps
  colorPickerProps?: ColorPickerProps
  checkboxProps?: CheckboxProps
  inputNumberProps?: InputNumberProps
  textAreaProps?: TextAreaProps
  inputProps?: InputProps
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
  colorPickerProps,
  checkboxProps,
  inputNumberProps,
  textAreaProps,
  selectProps,
  inputProps,
  initialValue,
  onValueChange,
  setLoading,
  required,
  inputType,
  disabled,
  ...restProps
}: EditableStateCellProps) {
  const inputNode = ((): React.ReactNode => {
    switch (inputType) {
      case 'colorpicker':
        return (
          <ColorPicker
            {...colorPickerProps}
            onChange={(val, hex) => onValueChange?.(val, hex)}
            defaultFormat='hex'
            defaultValue={initialValue ?? colorPickerProps?.defaultValue ?? ''}
            value={value ?? colorPickerProps?.value ?? ''}
            showText
            disabled={disabled}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'checkbox':
        return (
          <Checkbox
            {...checkboxProps}
            name={dataIndex}
            defaultChecked={initialValue ?? checkboxProps?.defaultChecked ?? ''}
            checked={value ?? checkboxProps?.value ?? ''}
            disabled={disabled}
            value={value ?? checkboxProps?.value ?? ''}
            onChange={(val) => onValueChange?.(val)}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'number':
        return (
          <InputNumber
            {...inputNumberProps}
            placeholder={`Enter ${title}`}
            name={dataIndex}
            required
            value={value ?? inputNumberProps?.value ?? ''}
            disabled={disabled}
            onChange={(val) => onValueChange?.(val)}
            defaultValue={initialValue ?? inputNumberProps?.defaultValue ?? ''}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'textarea':
        return (
          <Input.TextArea
            {...textAreaProps}
            placeholder={`Enter ${title}`}
            name={dataIndex}
            value={value ?? textAreaProps?.value ?? ''}
            disabled={disabled}
            onChange={(val) => onValueChange?.(val.target.value)}
            defaultValue={initialValue ?? textAreaProps?.defaultValue ?? ''}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'select':
        return (
          <Select
            {...selectProps}
            placeholder={`Select ${title}`}
            defaultValue={initialValue ?? selectProps?.defaultValue ?? ''}
            // value={value ?? selectProps?.value ?? ''}
            onChange={(val, option) => onValueChange?.(val, option)}
            disabled={disabled}
            virtual={false}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'multipleselect':
        return (
          <Select
            {...selectProps}
            placeholder={`Select ${title}`}
            mode='multiple'
            virtual={false}
            defaultValue={initialValue ?? selectProps?.defaultValue ?? ''}
            // value={value ?? selectProps?.value ?? ''}
            disabled={disabled}
            onChange={(val: number[], option) => onValueChange?.(val, option)}
            className='w-full'
          />
        )
      case 'colorselector':
        return (
          <Select
            {...selectProps}
            placeholder={`Select ${title}`}
            defaultValue={initialValue ?? selectProps?.defaultValue ?? ''}
            // value={value ?? selectProps?.value ?? ''}
            onChange={(val, option) => onValueChange?.(val, option)}
            disabled={disabled}
            virtual={false}
            className={cn('w-full', restProps.className)}
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
          />
        )
      case 'datepicker':
        return (
          <DatePicker
            placeholder={`Pick ${title}`}
            name={dataIndex}
            onChange={(val) => onValueChange?.(val)}
            disabled={disabled}
            // value={value && DayJS(value)}
            defaultValue={initialValue && DayJS(initialValue)}
            format={DatePattern.display}
            className={cn('w-full', restProps.className)}
          />
        )
      default:
        return (
          <Input
            {...inputProps}
            required
            placeholder={`Enter ${title}`}
            name={dataIndex}
            onChange={(event) => onValueChange?.(event.target.value)}
            defaultValue={initialValue ?? inputProps?.defaultValue ?? ''}
            value={value ?? inputProps?.value ?? ''}
            disabled={disabled}
            className={cn('w-full', restProps.className)}
          />
        )
    }
  })()

  return <>{isEditing ? inputNode : restProps.children}</>
}

export default memo(EditableStateCell)
