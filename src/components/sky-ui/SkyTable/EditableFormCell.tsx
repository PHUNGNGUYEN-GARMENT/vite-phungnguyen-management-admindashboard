/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { Checkbox, ColorPicker, DatePicker, Flex, Form, Input, InputNumber, Select, Table, Typography } from 'antd'
import { InputProps, TextAreaProps } from 'antd/es/input'
import { SelectProps } from 'antd/es/select'
import { CheckboxProps, ColorPickerProps, InputNumberProps } from 'antd/lib'
import { HTMLAttributes, memo } from 'react'
import { InputType } from '~/typing'
import { DatePattern } from '~/utils/date-formatter'
import { cn } from '~/utils/helpers'

export type EditableCellRequiredType = { key?: React.Key; name?: string; id?: number }

export interface EditableFormCellProps extends HTMLAttributes<HTMLElement> {
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

function EditableFormCell({
  isEditing,
  dataIndex,
  title,
  value,
  colorPickerProps,
  checkboxProps,
  inputNumberProps,
  textAreaProps,
  inputProps,
  selectProps,
  initialValue,
  onValueChange,
  setLoading,
  required,
  inputType,
  disabled,
  ...restProps
}: EditableFormCellProps) {
  const inputNode = ((): React.ReactNode => {
    switch (inputType) {
      case 'colorpicker':
        return (
          <ColorPicker
            {...colorPickerProps}
            defaultFormat='hex'
            value={value ? value : colorPickerProps?.value}
            showText
            disabled={disabled}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'colorselector':
        return (
          <Select
            {...selectProps}
            placeholder={`Select ${title}`}
            virtual={false}
            disabled={disabled}
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
      case 'number':
        return (
          <InputNumber
            {...inputNumberProps}
            name={dataIndex}
            placeholder={`Enter ${title}`}
            value={value}
            disabled={disabled}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'checkbox':
        return (
          <Checkbox
            {...checkboxProps}
            name={dataIndex}
            checked={value}
            disabled={disabled}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'select':
        return (
          <Select
            {...selectProps}
            placeholder={`Select ${title}`}
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
      case 'textarea':
        return (
          <Input.TextArea
            {...textAreaProps}
            name={dataIndex}
            placeholder={`Enter ${title}`}
            value={value}
            disabled={disabled}
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
            value={value}
            className='w-full'
          />
        )
      case 'datepicker':
        return (
          <DatePicker
            name={dataIndex}
            placeholder={`Pick ${title}`}
            value={value}
            onChange={(_val, dateString) => onValueChange?.(dateString)}
            disabled={disabled}
            format={DatePattern.display}
            className={cn('w-full', restProps.className)}
          />
        )
      default:
        return (
          <Input
            {...inputProps}
            name={dataIndex}
            placeholder={`Enter ${title}`}
            value={value}
            disabled={disabled}
            className={cn('w-full', restProps.className)}
          />
        )
    }
  })()

  return (
    <>
      {isEditing ? (
        <Form.Item
          name={dataIndex}
          className={cn('w-full', restProps.className)}
          initialValue={initialValue}
          style={{ margin: 0 }}
          rules={[
            {
              required: required,
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

export default memo(EditableFormCell)
