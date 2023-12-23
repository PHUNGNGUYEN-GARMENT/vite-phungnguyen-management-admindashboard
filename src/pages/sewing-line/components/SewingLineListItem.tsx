/* eslint-disable react-refresh/only-export-components */
import { Flex, Input, Typography } from 'antd'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { TableItemWithKey } from '~/components/hooks/useTable'
import ListItem from '~/components/sky-ui/SkyTable/ListItem'
import { RootState } from '~/store/store'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { SewingLineTableDataType } from '../type'

interface Props extends React.HTMLAttributes<HTMLElement> {
  data: TableItemWithKey<SewingLineTableDataType>
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
  const user = useSelector((state: RootState) => state.user)

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
        label={`${data.sewingLineName}`}
        name='sewingLineName'
        {...props}
      >
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
      </ListItem>
    </>
  )
}

export default memo(ColorListItem)
