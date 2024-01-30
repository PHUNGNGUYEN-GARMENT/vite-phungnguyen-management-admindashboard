import { Button, Flex, Input, Switch, Typography } from 'antd'
import { SwitchChangeEventHandler } from 'antd/es/switch'
import { Plus } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
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
  const currentUser = useSelector((state: RootState) => state.user)
  // const dispatch = useDispatch()
  // dispatch(setUserAction)

  return (
    <div {...props}>
      <Flex vertical gap={20}>
        {props.title && <Typography.Title level={2}>{props.title}</Typography.Title>}
        <Flex vertical gap={20}>
          {onSearch && (
            <Search
              placeholder={searchPlaceHolder ? searchPlaceHolder : 'Search...'}
              size='middle'
              enterButton
              className='w-full lg:hidden'
              name='search'
              allowClear
              value={searchValue}
              defaultValue={defaultSearchValue}
              onSearch={onSearch}
              onChange={onSearchChange}
            />
          )}
          <Flex justify='space-between' align='center'>
            <Flex gap={10} align='center' wrap='wrap'>
              {/* <Switch
                checkedChildren='Admin'
                unCheckedChildren='Admin'
                defaultChecked={false}
                checked={user.isAdmin}
                onChange={(val) => {
                  dispatch(setAdminAction(val))
                }}
              /> */}
              {onSortChange && (
                <Switch
                  checkedChildren='Sorted'
                  unCheckedChildren='Sorted'
                  defaultChecked={false}
                  onChange={onSortChange}
                />
              )}
              {currentUser.user.isAdmin && onDateCreationChange && (
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
                  className='hidden w-[450px] lg:block'
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
              {currentUser.user.isAdmin && onAddNewClick && (
                <Button onClick={onAddNewClick} className='flex items-center' type='primary' icon={<Plus size={20} />}>
                  New
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
        {children}
      </Flex>
    </div>
  )
}

export default BaseLayout
