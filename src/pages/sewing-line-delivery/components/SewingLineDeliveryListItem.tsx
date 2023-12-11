/* eslint-disable react-refresh/only-export-components */
import { ColorPicker, Flex, Form, Input, List, Typography } from 'antd'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { TableItemWithKey } from '~/components/hooks/useTable'
import ItemAction from '~/components/layout/Item/ItemAction'
import { RootState } from '~/store/store'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { SewingLineDeliveryTableDataType } from '../type'

interface Props extends React.HTMLAttributes<HTMLElement> {
  data: TableItemWithKey<SewingLineDeliveryTableDataType>
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

const ColorListItem: React.FC<Props> = ({
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
              <Form.Item name={`nameColor`} initialValue={data.id}>
                <Input size='large' />
              </Form.Item>
            ) : (
              <Typography.Title copyable className='m-0 h-fit p-0' level={4}>
                {data.id}
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
          <Flex align='center' justify='start' gap={5}>
            <Typography.Text type='secondary' className='w-40 font-medium'>
              Mã màu
            </Typography.Text>
            {isEditing ? (
              <Form.Item
                name={`hexColor`}
                initialValue={data.id}
                className='m-0 w-full'
              >
                <ColorPicker
                  size='middle'
                  className='w-full'
                  format='hex'
                  defaultFormat='hex'
                  disabled={editingKey !== data.key}
                  showText
                />
              </Form.Item>
            ) : (
              <Flex className='w-full' align='center' justify='start'>
                <ColorPicker
                  className='w-full'
                  size='middle'
                  disabled={editingKey !== data.key}
                  showText
                />
              </Flex>
            )}
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
                  defaultValue={DayJS(data.createdAt).format(
                    DatePattern.display
                  )}
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
                  defaultValue={DayJS(data.updatedAt).format(
                    DatePattern.display
                  )}
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

export default memo(ColorListItem)
