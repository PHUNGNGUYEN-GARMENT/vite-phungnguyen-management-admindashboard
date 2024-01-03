/* eslint-disable @typescript-eslint/no-explicit-any */
import { Divider, Select, Space, Tag, Typography } from 'antd'
import { SelectProps } from 'antd/lib'
import React, { useState } from 'react'

export interface SelectMultipleItemProps extends SelectProps {
  dropDownMenu?: SelectProps
  onValueChange?: (value: any, option?: any) => void
}

const SelectMultipleItem = ({ dropDownMenu, onValueChange, ...props }: SelectMultipleItemProps) => {
  const [itemSelected, setItemSelected] = useState<{ key: React.Key; value: string }>({
    key: '',
    value: ''
  })

  return (
    <Select
      {...props}
      mode='multiple'
      options={props.options}
      onChange={(val: number[]) => onValueChange?.(val, { dropdownItems: itemSelected })}
      tagRender={(props) => {
        const { label, value, closable, onClose } = props
        const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
          event.preventDefault()
          event.stopPropagation()
        }
        return (
          <Tag
            color={'default'}
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            className='m-[2px]'
          >
            <Space size='small' align='center' className='p-1'>
              <Typography.Text>{label}</Typography.Text>
              <Divider className='m-0' type='vertical' />
              {dropDownMenu && (
                <Select
                  {...dropDownMenu}
                  style={{ width: 120 }}
                  onChange={(val, option) => setItemSelected({ key: val, value: val })}
                />
              )}
              <Divider className='m-0' type='vertical' />
            </Space>
          </Tag>
        )
      }}
      // defaultValue={[]}
      className='w-full'
    />
  )
}

export default SelectMultipleItem
