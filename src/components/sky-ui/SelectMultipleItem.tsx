import { Divider, Dropdown, Flex, Select, Space, Tag, Typography } from 'antd'
import { ItemType } from 'antd/es/menu/hooks/useItems'
import { SelectProps } from 'antd/lib'
import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react'

export interface SelectMultipleItemProps extends SelectProps {
  isShowDropdown?: boolean
  dropdownItems?: ItemType[]
  dropdownInitialValue?: string
}

const SelectMultipleItem = ({
  isShowDropdown,
  dropdownInitialValue,
  dropdownItems,
  ...props
}: SelectMultipleItemProps) => {
  const [itemSelected, setItemSelected] = useState<{ key: React.Key; values: string[] }>({
    key: '',
    values: ['']
  })

  return (
    <Select
      {...props}
      mode='multiple'
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
            <Space size='small' align='center' split={<Divider type='vertical' />}>
              <Typography.Text>{label}</Typography.Text>
              {isShowDropdown && (
                <Dropdown
                  trigger={['click']}
                  menu={{
                    items: dropdownItems,
                    selectable: true,
                    defaultSelectedKeys: [dropdownInitialValue ?? ''],
                    onSelect: (info) => setItemSelected({ key: info.key, values: info.selectedKeys })
                  }}
                >
                  <Typography.Link>
                    <Flex align='center' justify='center'>
                      {itemSelected.values}
                      <ChevronDown strokeWidth={1} size={20} />
                    </Flex>
                  </Typography.Link>
                </Dropdown>
              )}
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
