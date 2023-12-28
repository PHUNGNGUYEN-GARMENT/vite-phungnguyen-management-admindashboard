/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { Flex, Input, List, Typography } from 'antd'
import { useSelector } from 'react-redux'
import { RootState } from '~/store/store'
import { ItemStatusType } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import ActionRow, { ActionProps } from '../ActionRow'
import SkyTableTypography from '../SkyTable/SkyTableTypography'

export interface SkyListItemProps<
  T extends { key?: React.Key; status?: ItemStatusType; createdAt?: string; updatedAt?: string }
> {
  record: T
  label?: string
  isEditing: boolean
  labelEditing?: boolean
  labelName?: string
  isDateCreation?: boolean
  actions?: ActionProps<T>
  value?: any
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined
  defaultValue?: string | number | readonly string[] | undefined
  children?: React.ReactNode
}

const SkyListItemNew = <
  T extends { key?: React.Key; status?: ItemStatusType; createdAt?: string; updatedAt?: string }
>({
  record,
  children,
  ...props
}: SkyListItemProps<T>) => {
  const user = useSelector((state: RootState) => state.user)

  return (
    <List.Item className='mb-5 w-full rounded-sm bg-white'>
      <Flex vertical className='w-full' gap={10}>
        <Flex align='center' justify='space-between' gap={10}>
          {props.labelEditing && props.isEditing && user.isAdmin ? (
            <Input
              size='large'
              defaultValue={props.defaultValue}
              onChange={props.onChange}
              value={props.value}
              className='text-lg font-medium'
            />
          ) : (
            <SkyTableTypography status={record.status}>{props.label}</SkyTableTypography>
          )}

          <ActionRow
            isEditing={props.isEditing}
            onAdd={{
              onClick: (e) => props.actions?.onAdd?.onClick?.(e, record),
              disabled: props.actions?.onAdd?.disabled ?? props.isEditing,
              isShow: props.actions?.onAdd ? props.actions.onAdd.isShow ?? true : false
            }}
            onSave={{
              onClick: (e) => props.actions?.onSave?.onClick?.(e, record),
              disabled: props.actions?.onSave?.disabled ?? props.isEditing,
              isShow: props.actions?.onSave ? props.actions.onSave.isShow ?? true : false
            }}
            onEdit={{
              onClick: (e) => props.actions?.onEdit?.onClick?.(e, record),
              disabled: props.actions?.onEdit?.disabled ?? props.isEditing,
              isShow: props.actions?.onEdit ? props.actions.onEdit.isShow ?? true : false
            }}
            onDelete={{
              onClick: (e) => props.actions?.onDelete?.onClick?.(e, record),
              disabled: props.actions?.onDelete?.disabled ?? props.isEditing,
              isShow: props.actions?.onDelete ? props.actions.onDelete.isShow ?? true : false
            }}
            onConfirmCancelEditing={props.actions?.onConfirmCancelEditing}
            onConfirmCancelDeleting={props.actions?.onConfirmCancelDeleting}
            onConfirmDelete={() => props.actions?.onConfirmDelete?.(record)}
          />
        </Flex>
        {children}
        {user.isAdmin && props.isDateCreation && (
          <Flex vertical gap={10}>
            <Flex className='w-full' align='center' justify='start' gap={5}>
              <Typography.Text type='secondary' className='w-40 font-medium'>
                Created at
              </Typography.Text>
              <Input
                name='createdAt'
                className='w-full'
                defaultValue={record?.createdAt && DayJS(record.createdAt).format(DatePattern.display)}
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
                defaultValue={record?.updatedAt && DayJS(record.updatedAt).format(DatePattern.display)}
                readOnly
              />
            </Flex>
          </Flex>
        )}
      </Flex>
    </List.Item>
  )
}

export default SkyListItemNew
