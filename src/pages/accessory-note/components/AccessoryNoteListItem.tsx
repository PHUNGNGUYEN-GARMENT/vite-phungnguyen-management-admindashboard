/* eslint-disable react-refresh/only-export-components */
import React, { memo } from 'react'
import { TableItemWithKey } from '~/components/hooks/useTable'
import ListItem from '~/components/sky-ui/Table/ListItem'
import { AccessoryNoteTableDataType } from '../type'

interface Props extends React.HTMLAttributes<HTMLElement> {
  data: TableItemWithKey<AccessoryNoteTableDataType>
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

const AccessoryNoteListItem: React.FC<Props> = ({
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
        label={`${data.title}`}
        name='title'
        {...props}
      />
    </>
  )
}

export default memo(AccessoryNoteListItem)
