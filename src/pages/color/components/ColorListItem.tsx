/* eslint-disable react-refresh/only-export-components */
import {
  Button,
  ColorPicker,
  Flex,
  Form,
  Input,
  List,
  Popconfirm,
  Typography
} from 'antd'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '~/store/store'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { ColorTableDataType } from '../type'

interface Props extends React.HTMLAttributes<HTMLElement> {
  data: ColorTableDataType
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
    <List.Item {...props} key={data.id} className='mb-5 rounded-sm bg-white'>
      <Flex vertical className='w-full' gap={10}>
        <Flex align='center' justify='space-between'>
          {isEditing && user.isAdmin ? (
            <Form.Item name={`nameColor`} initialValue={data.nameColor}>
              <Input size='large' />
            </Form.Item>
          ) : (
            <Typography.Title copyable className='m-0 h-fit p-0' level={4}>
              {data.nameColor}
            </Typography.Title>
          )}

          {isEditing ? (
            <Flex gap={5}>
              <Button type='primary' onClick={onSaveClick}>
                Save
              </Button>
              <Popconfirm
                title={`Sure to cancel?`}
                okButtonProps={{
                  size: 'middle'
                }}
                cancelButtonProps={{
                  size: 'middle'
                }}
                placement='topLeft'
                onConfirm={onConfirmCancelEditing}
              >
                <Button type='dashed'>Cancel</Button>
              </Popconfirm>
            </Flex>
          ) : (
            <Flex gap={10}>
              {user.isAdmin && (
                <Button
                  type='primary'
                  disabled={editingKey !== ''}
                  onClick={onClickStartEditing}
                >
                  Edit
                </Button>
              )}
              {user.isAdmin && (
                <Popconfirm
                  title={`Sure to delete?`}
                  onCancel={onConfirmCancelDeleting}
                  onConfirm={onConfirmDelete}
                >
                  <Button
                    type='dashed'
                    disabled={editingKey !== ''}
                    onClick={() => onStartDeleting?.(data.key ?? data.id!)}
                  >
                    Delete
                  </Button>
                </Popconfirm>
              )}
            </Flex>
          )}
        </Flex>
        <Flex align='center' justify='start' gap={5}>
          <Typography.Text type='secondary' className='w-40 font-medium'>
            Mã màu
          </Typography.Text>
          {isEditing ? (
            <Form.Item
              name={`hexColor`}
              initialValue={data.hexColor}
              className='m-0 w-full'
            >
              <ColorPicker
                size='middle'
                className='w-full'
                defaultFormat='hex'
                disabled={editingKey !== data.id}
                showText
              />
            </Form.Item>
          ) : (
            <Flex className='w-full' align='center' justify='start'>
              <ColorPicker
                className='w-full'
                defaultValue={data.hexColor}
                size='middle'
                disabled={editingKey !== data.id}
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
  )
}

export default memo(ColorListItem)
