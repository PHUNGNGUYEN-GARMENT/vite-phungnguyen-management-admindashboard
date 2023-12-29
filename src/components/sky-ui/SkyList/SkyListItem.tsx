/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { Flex, Input, List, Typography } from 'antd'
import { useSelector } from 'react-redux'
import { RootState } from '~/store/store'
import { ItemStatusType } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import ActionRow, { ActionProps } from '../ActionRow'
import EditableStateCell, { EditableStateCellProps } from '../SkyTable/EditableStateCell'
import SkyTableTypography from '../SkyTable/SkyTableTypography'

export interface SkyListItemProps<
  T extends { key?: React.Key; status?: ItemStatusType; createdAt?: string; updatedAt?: string }
> extends EditableStateCellProps {
  record: T
  label?: string
  labelEditing?: boolean
  isDateCreation?: boolean
  actions?: ActionProps<T>
  children?: React.ReactNode
}

const SkyListItem = <T extends { key?: React.Key; status?: ItemStatusType; createdAt?: string; updatedAt?: string }>({
  record,
  children,
  ...props
}: SkyListItemProps<T>) => {
  const user = useSelector((state: RootState) => state.user)

  return (
    <List.Item className='mb-5 w-full rounded-sm bg-white'>
      <Flex vertical className='w-full' gap={10}>
        <Flex align='center' justify='space-between' gap={10}>
          <EditableStateCell {...props} isEditing={(props.labelEditing && props.isEditing && user.isAdmin) ?? false}>
            <SkyTableTypography className='text-lg font-semibold' status={record.status}>
              {props.label}
            </SkyTableTypography>
          </EditableStateCell>

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

export default SkyListItem
