/* eslint-disable react-refresh/only-export-components */
import { Flex, Form, Input, List, Typography } from 'antd'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { TableItemWithKey } from '~/components/hooks/useTable'
import ItemAction from '~/components/ui/Table/ItemAction'
import { RootState } from '~/store/store'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { GroupTableDataType } from '../type'

interface Props extends React.HTMLAttributes<HTMLElement> {
  data: TableItemWithKey<GroupTableDataType>
  isEditing: boolean
  editingKey: React.Key
  dateCreation?: boolean
  onSaveClick?: React.MouseEventHandler<HTMLElement> | undefined
  onClickStartEditing?: React.MouseEventHandler<HTMLElement> | undefined
  onConfirmCancelEditing?: (e?: React.MouseEvent<HTMLElement>) => void
  onConfirmCancelDeleting?: (e?: React.MouseEvent<HTMLElement>) => void
  onConfirmDelete?: (e?: React.MouseEvent<HTMLElement>) => void
  onStartDeleting?: (key: React.Key) => void
}

const GroupListItem: React.FC<Props> = ({
  data,
  isEditing,
  editingKey,
  dateCreation,
  onSaveClick,
  onClickStartEditing,
  onConfirmCancelEditing,
  onConfirmCancelDeleting,
  onConfirmDelete,
  onStartDeleting,
  ...props
}) => {
  const user = useSelector((state: RootState) => state.user)

  return (
    <>
      <List.Item {...props} key={data.key} className='mb-5 rounded-sm bg-white'>
        <Flex vertical className='w-full' gap={10}>
          <Flex align='center' justify='space-between'>
            {isEditing && user.isAdmin ? (
              <Form.Item name={`name`} initialValue={data.name}>
                <Input size='large' />
              </Form.Item>
            ) : (
              <Typography.Title copyable className='m-0 h-fit p-0' level={4}>
                {data.name}
              </Typography.Title>
            )}

            <ItemAction
              isEditing={isEditing}
              editingKey={editingKey}
              onSaveClick={onSaveClick}
              onClickStartEditing={onClickStartEditing}
              onConfirmCancelEditing={onConfirmCancelEditing}
              onConfirmCancelDeleting={onConfirmCancelDeleting}
              onConfirmDelete={onConfirmDelete}
              onStartDeleting={() => onStartDeleting?.(data.key!)}
            />
          </Flex>
          {user.isAdmin && dateCreation && (
            <Flex vertical gap={10}>
              <Flex align='center' justify='start' gap={5}>
                <Typography.Text type='secondary' className='w-40 font-medium'>
                  Created at
                </Typography.Text>

                <Input
                  name='createdAt'
                  className='w-full'
                  defaultValue={DayJS(data.createdAt).format(DatePattern.display)}
                  readOnly
                />
              </Flex>
              <Flex align='center' justify='start' gap={5}>
                <Typography.Text type='secondary' className='w-40 font-medium'>
                  Updated at
                </Typography.Text>

                <Input
                  name='updatedAt'
                  className='w-full'
                  defaultValue={DayJS(data.updatedAt).format(DatePattern.display)}
                  readOnly
                />
              </Flex>
            </Flex>
          )}
        </Flex>
      </List.Item>
    </>
  )
}

export default memo(GroupListItem)
