import { Button, Flex, Input, Switch, Typography } from 'antd'
import { SwitchChangeEventHandler } from 'antd/es/switch'
import { Plus } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAdminAction } from '~/store/actions-creator'
import { RootState } from '~/store/store'

interface Props extends React.HTMLAttributes<HTMLElement> {
  searchPlaceHolder?: string
  defaultSearchValue?: string | number | readonly string[] | undefined
  searchValue?: string | undefined
  onSearch?: (
    value: string,
    event?:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLElement, MouseEvent>
      | React.KeyboardEvent<HTMLInputElement>
      | undefined,
    info?: {
      source?: 'clear' | 'input'
    }
  ) => void
  onSearchChange?: React.ChangeEventHandler<HTMLInputElement> | undefined
  dateCreation?: boolean
  onSortChange?: SwitchChangeEventHandler
  onDateCreationChange?: SwitchChangeEventHandler
  onResetClick?: React.MouseEventHandler<HTMLElement> | undefined
  onAddNewClick?: React.MouseEventHandler<HTMLElement> | undefined
}

const { Search } = Input

const BaseLayout: React.FC<Props> = ({
  searchPlaceHolder,
  onSearchChange,
  searchValue,
  defaultSearchValue,
  onSearch,
  onSortChange,
  dateCreation,
  onDateCreationChange,
  onResetClick,
  onAddNewClick,
  children,
  ...props
}) => {
  const user = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()

  return (
    <div {...props}>
      <Flex vertical gap={20}>
        {props.title && <Typography.Title level={3}>{props.title}</Typography.Title>}
        <Flex justify='space-between' align='center'>
          <Flex gap={10} align='center'>
            <Switch
              checkedChildren='Admin'
              unCheckedChildren='Admin'
              defaultChecked={false}
              checked={user.isAdmin}
              onChange={(val) => {
                dispatch(setAdminAction(val))
              }}
            />
            {onSortChange && (
              <Switch
                checkedChildren='Sorted'
                unCheckedChildren='Sorted'
                defaultChecked={false}
                onChange={onSortChange}
              />
            )}
            {user.isAdmin && onDateCreationChange && (
              <Switch
                checkedChildren='DateCreation'
                unCheckedChildren='DateCreation'
                defaultChecked={dateCreation}
                onChange={onDateCreationChange}
              />
            )}
            {onSearch && (
              <Search
                placeholder={searchPlaceHolder ? searchPlaceHolder : 'Search...'}
                size='middle'
                enterButton
                className='w-[350px]'
                name='search'
                allowClear
                value={searchValue}
                defaultValue={defaultSearchValue}
                onSearch={onSearch}
                onChange={onSearchChange}
              />
            )}
          </Flex>
          <Flex gap={10} align='center'>
            {onResetClick && (
              <Button onClick={onResetClick} className='flex items-center' type='default'>
                Reset
              </Button>
            )}

            {user.isAdmin && onAddNewClick && (
              <Button onClick={onAddNewClick} className='flex items-center' type='primary' icon={<Plus size={20} />}>
                New
              </Button>
            )}
          </Flex>
        </Flex>
        {children}
      </Flex>
    </div>
  )
}

export default BaseLayout
