import { Button, Flex, Popconfirm as PopConfirm } from 'antd'
import React, { HTMLAttributes } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '~/store/store'

export interface ActionRowProps extends HTMLAttributes<HTMLElement> {
  isEditing: boolean
  editingKey: React.Key
  disableEditing?: boolean
  disableDeleting?: boolean
  onSave: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onEdit: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onDelete?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onConfirmCancelEditing: (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void
  onConfirmCancelDeleting: (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void
  onConfirmDelete: (e?: React.MouseEvent<HTMLElement>) => void
}

const ActionRow: React.FC<ActionRowProps> = ({ ...props }) => {
  const user = useSelector((state: RootState) => state.user)

  return (
    <Flex className=''>
      <Flex align='center' justify='space-between'>
        {props.isEditing ? (
          <Flex gap={5}>
            <Button type='primary' onClick={props.onSave}>
              Save
            </Button>
            <PopConfirm
              title={`Sure to cancel?`}
              okButtonProps={{
                size: 'middle'
              }}
              cancelButtonProps={{
                size: 'middle'
              }}
              placement='topLeft'
              onConfirm={props.onConfirmCancelEditing}
            >
              <Button type='dashed'>Cancel</Button>
            </PopConfirm>
          </Flex>
        ) : (
          <Flex gap={10}>
            {user.isAdmin && (
              <Button type='dashed' disabled={props.disableEditing} onClick={props.onEdit}>
                Edit
              </Button>
            )}
            {user.isAdmin && (
              <PopConfirm
                title={`Sure to delete?`}
                onCancel={props.onConfirmCancelDeleting}
                onConfirm={props.onConfirmDelete}
              >
                <Button type='dashed' disabled={props.disableDeleting} onClick={props.onDelete}>
                  Delete
                </Button>
              </PopConfirm>
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}

export default ActionRow
