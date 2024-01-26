/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Popconfirm as PopConfirm } from 'antd'
import { BaseButtonProps } from 'antd/es/button/button'
import React, { HTMLAttributes } from 'react'
import { cn } from '~/utils/helpers'

export interface ActionButtonProps<T extends { key?: React.Key }> extends BaseButtonProps {
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>, record?: T) => void
  isShow?: boolean | true
  disabled?: boolean
}

export interface ActionProps<T extends { key?: React.Key }> extends BaseButtonProps {
  isShow?: boolean
  disabled?: boolean
  onAdd?: ActionButtonProps<T>
  onSave?: ActionButtonProps<T>
  onEdit?: ActionButtonProps<T>
  onDelete?: ActionButtonProps<T>
  onConfirmDelete?: (record: T) => void
  onConfirmCancelEditing?: (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void
  onConfirmCancelDeleting?: (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void
}

export interface ActionRowProps<T extends { key?: React.Key }> extends HTMLAttributes<HTMLElement> {
  isEditing?: boolean
  vertical?: boolean
  onAdd?: ActionButtonProps<T>
  onSave: ActionButtonProps<T>
  onEdit: ActionButtonProps<T>
  onDelete?: ActionButtonProps<T>
  onConfirmCancelEditing?: (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void
  onConfirmCancelDeleting?: (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void
  onConfirmDelete?: (e?: React.MouseEvent<HTMLElement>) => void
}

const ActionRow = <T extends { key?: React.Key }>({ ...props }: ActionRowProps<T>) => {
  return (
    <Flex className={props.className}>
      <Flex align='center' justify='space-between'>
        {props.isEditing && props.onSave.isShow ? (
          <Flex className={cn('flex-col', props.className)} gap={5}>
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
          <Flex gap={10} className={cn('flex-col', props.className)} justify='center'>
            {props.onAdd?.isShow && (
              <Button type='dashed' disabled={props.onAdd.disabled} onClick={(e) => props.onAdd?.onClick?.(e)}>
                Add
              </Button>
            )}
            {props.onEdit.isShow && (
              <Button type='dashed' disabled={props.onEdit.disabled} onClick={props.onEdit.onClick}>
                Edit
              </Button>
            )}
            {props.onDelete?.isShow && (
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
