/* eslint-disable react-refresh/only-export-components */
import { ColorPicker, Flex, Form, Typography } from 'antd'
import React, { memo } from 'react'
import { TableItemWithKey } from '~/components/hooks/useTable'
import ListItem from '~/components/sky-ui/Table/ListItem'
import { ColorTableDataType } from '../type'

interface Props extends React.HTMLAttributes<HTMLElement> {
  data: TableItemWithKey<ColorTableDataType>
  isEditing: boolean
  editingKey: React.Key
  dateCreation: boolean
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
  return (
    <>
      <ListItem
        itemId={data.key ?? data.id!}
        isEditing={isEditing}
        createdAt={data.createdAt}
        updatedAt={data.updatedAt}
        editingKey={editingKey}
        dateCreation={dateCreation}
        onSaveClick={onSaveClick}
        onClickStartEditing={onClickStartEditing}
        onConfirmCancelEditing={onConfirmCancelEditing}
        onConfirmCancelDeleting={onConfirmCancelDeleting}
        onConfirmDelete={onConfirmDelete}
        onStartDeleting={onStartDeleting}
        label={`${data.name}`}
        name='name'
        {...props}
      >
        <Flex className='w-full' align='center' justify='start' gap={5}>
          <Typography.Text type='secondary' className='w-40 font-medium'>
            Mã màu
          </Typography.Text>
          {isEditing ? (
            <Form.Item name='hexColor' initialValue={data.hexColor} className='m-0 w-full'>
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
            <ColorPicker
              className='w-full'
              defaultValue={data.hexColor}
              size='middle'
              disabled={editingKey !== data.key}
              showText
            />
          )}
        </Flex>
      </ListItem>
    </>
  )
}

export default memo(ColorListItem)
