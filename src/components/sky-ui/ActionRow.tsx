/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Popconfirm as PopConfirm } from 'antd'
import { BaseButtonProps } from 'antd/es/button/button'
import React, { HTMLAttributes } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '~/store/store'

export interface ActionButtonProps<T extends { key?: React.Key }> extends BaseButtonProps {
  onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>, record?: T) => void
  isShow?: boolean | true
  disabled?: boolean
}

export interface ActionRowProps<T extends { key?: React.Key }> extends HTMLAttributes<HTMLElement> {
  isEditing: boolean
  editingKey: React.Key
  onAdd?: ActionButtonProps<T>
  onSave: ActionButtonProps<T>
  onEdit: ActionButtonProps<T>
  onDelete?: ActionButtonProps<T>
  onConfirmCancelEditing: (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void
  onConfirmCancelDeleting: (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void
  onConfirmDelete: (e?: React.MouseEvent<HTMLElement>) => void
}

const ActionRow = <T extends { key?: React.Key }>({ ...props }: ActionRowProps<T>) => {
  const user = useSelector((state: RootState) => state.user)

  return (
    <Flex className=''>
      <Flex align='center' justify='space-between'>
        {props.isEditing && props.onSave.isShow ? (
          <Flex gap={5}>
            <Button type='primary' onClick={props.onSave.onClick}>
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
            {props.onAdd?.isShow && (
              <Button type='dashed' disabled={props.onAdd.disabled} onClick={(e) => props.onAdd?.onClick(e)}>
                Add
              </Button>
            )}
            {user.isAdmin && props.onEdit.isShow && (
              <Button type='dashed' disabled={props.onEdit.disabled} onClick={props.onEdit.onClick}>
                Edit
              </Button>
            )}
            {user.isAdmin && props.onDelete?.isShow && (
              <PopConfirm
                title={`Sure to delete?`}
                onCancel={props.onConfirmCancelDeleting}
                onConfirm={props.onConfirmDelete}
              >
                <Button type='dashed' disabled={props.onDelete.disabled} onClick={props.onDelete.onClick}>
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
