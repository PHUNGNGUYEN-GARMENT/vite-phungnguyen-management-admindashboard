/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import {
  Button,
  Checkbox,
  ColorPicker,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Table,
  Typography
} from 'antd'
import { Eye, EyeOff } from 'lucide-react'
import { memo, useState } from 'react'
import { DatePattern } from '~/utils/date-formatter'
import { cn } from '~/utils/helpers'
import { EditableStateCellProps } from './EditableStateCell'

export type EditableCellRequiredType = { key?: React.Key; name?: string; id?: number }

export interface EditableFormCellProps extends EditableStateCellProps {}

export type EditableTableProps = Parameters<typeof Table>[0]

function EditableFormCell({
  isEditing,
  dataIndex,
  title,
  subtitle,
  placeholder,
  allowClear,
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
  readonly,
  disabled,
  ...restProps
}: EditableFormCellProps) {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false)

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
            title={title}
            placeholder={placeholder}
            virtual={false}
            disabled={disabled}
            optionRender={(ori, info) => {
              return (
                <Flex justify='space-between' align='center' key={info.index}>
                  <Typography.Text>{ori.label}</Typography.Text>
                  <div
                    className='h-6 w-6 rounded-sm'
                    style={{
                      backgroundColor: `${ori.key}`
                    }}
                  />
                </Flex>
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
            title={title}
            required={required}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'checkbox':
        return (
          <Checkbox
            {...checkboxProps}
            required={required}
            title={title}
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
            title={title}
            placeholder={placeholder}
            disabled={disabled}
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
            title={title}
            placeholder={`${placeholder}`}
            value={value}
            readOnly={readonly}
            required={required}
            disabled={disabled}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'multipleselect':
        return (
          <Select
            {...selectProps}
            title={title}
            placeholder={placeholder}
            mode='multiple'
            virtual={false}
            disabled={disabled}
            value={value}
            className='w-full'
          />
        )
      case 'datepicker':
        return (
          <DatePicker
            name={dataIndex}
            title={title}
            placeholder={placeholder}
            value={value}
            required={required}
            onChange={(_val, dateString) => onValueChange?.(dateString)}
            disabled={disabled}
            format={DatePattern.display}
            className={cn('w-full', restProps.className)}
          />
        )
      case 'password':
        return (
          <Input
            type={passwordVisible ? 'text' : 'password'}
            suffix={
              <Button onClick={() => setPasswordVisible((prev) => !prev)} type='link' className='p-2'>
                {passwordVisible ? (
                  <Eye color='var(--foreground)' size={16} />
                ) : (
                  <EyeOff size={16} color='var(--foreground)' />
                )}
              </Button>
            }
            title={title}
            required={required}
            allowClear={allowClear}
            placeholder={placeholder ?? 'Enter password'}
            readOnly={readonly}
          />
        )
      default:
        return (
          <Input
            {...inputProps}
            title={title}
            required={required}
            placeholder={placeholder}
            name={dataIndex}
            value={value}
            autoComplete='give-text'
            allowClear={allowClear}
            disabled={disabled}
            readOnly={readonly}
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
          required={required}
          label={title}
          validateTrigger='onBlur'
          style={{ margin: 0 }}
          rules={[
            {
              required: required,
              message: subtitle
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
