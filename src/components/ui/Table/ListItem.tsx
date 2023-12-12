/* eslint-disable react-refresh/only-export-components */
import { Flex, Form, Input, List, Typography } from 'antd'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import ItemAction from '~/components/ui/Table/ItemAction'
import { RootState } from '~/store/store'
import DayJS, { DatePattern } from '~/utils/date-formatter'

interface Props extends React.HTMLAttributes<HTMLElement> {
  itemId: React.Key
  name?: string
  label?: React.ReactNode
  isEditing: boolean
  createdAt?: string
  updatedAt?: string
  editingKey: React.Key
  dateCreation: boolean
  onSaveClick?: React.MouseEventHandler<HTMLElement> | undefined
  onClickStartEditing?: React.MouseEventHandler<HTMLElement> | undefined
  onConfirmCancelEditing?: (e?: React.MouseEvent<HTMLElement>) => void
  onConfirmCancelDeleting?: (e?: React.MouseEvent<HTMLElement>) => void
  onConfirmDelete?: (e?: React.MouseEvent<HTMLElement>) => void
  onStartDeleting?: (key: React.Key) => void
}

const ListItem: React.FC<Props> = ({
  itemId,
  label,
  name,
  isEditing,
  editingKey,
  dateCreation,
  onSaveClick,
  createdAt,
  updatedAt,
  onClickStartEditing,
  onConfirmCancelEditing,
  onConfirmCancelDeleting,
  onConfirmDelete,
  onStartDeleting,
  ...props
}) => {
  const user = useSelector((state: RootState) => state.user)

  return (
    <List.Item {...props} className='mb-5 rounded-sm bg-white '>
      <Flex vertical className='w-full' gap={10}>
        <Flex align='center' justify='space-between' gap={10}>
          {label ? (
            typeof label === 'string' ? (
              <>
                {isEditing && user.isAdmin ? (
                  <Form.Item name={name} initialValue={label} className='m-0'>
                    <Input size='large' className='text-lg font-medium' />
                  </Form.Item>
                ) : (
                  <Typography.Title copyable className='m-0 h-fit p-0' level={4}>
                    {label}
                  </Typography.Title>
                )}
              </>
            ) : (
              label
            )
          ) : (
            'Empty label'
          )}

          <ItemAction
            isEditing={isEditing}
            editingKey={editingKey}
            onSaveClick={onSaveClick}
            onClickStartEditing={onClickStartEditing}
            onConfirmCancelEditing={onConfirmCancelEditing}
            onConfirmCancelDeleting={onConfirmCancelDeleting}
            onConfirmDelete={onConfirmDelete}
            onStartDeleting={() => onStartDeleting?.(itemId)}
          />
        </Flex>
        {props.children}
        {user.isAdmin && dateCreation && (
          <Flex vertical gap={10}>
            <Flex className='w-full' align='center' justify='start' gap={5}>
              <Typography.Text type='secondary' className='w-40 font-medium'>
                Created at
              </Typography.Text>
              <Input
                name='createdAt'
                className='w-full'
                defaultValue={DayJS(createdAt).format(DatePattern.display)}
                readOnly
              />
            </Flex>
            <Flex className='w-full' align='center' justify='start' gap={5}>
              <Typography.Text type='secondary' className='w-40 font-medium'>
                Updated at
              </Typography.Text>
              <Input
                name='createdAt'
                className='w-full'
                defaultValue={DayJS(updatedAt).format(DatePattern.display)}
                readOnly
              />
            </Flex>
          </Flex>
        )}
      </Flex>
    </List.Item>
  )
}

export default memo(ListItem)
