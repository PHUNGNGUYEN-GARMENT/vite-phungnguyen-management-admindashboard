/* eslint-disable @typescript-eslint/ban-types */
import { Flex, Form, Input, List, Typography } from 'antd'
import { useSelector } from 'react-redux'
import { RootState } from '~/store/store'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import ActionRow, { ActionRowProps } from '../ActionRow'

export interface SkyListItemProps<T extends { key?: React.Key }> extends ActionRowProps {
  record: T
  label?: string
  labelEditing?: boolean
  labelName?: string
  isDateCreation?: boolean
  createdAt?: string
  updatedAt?: string
}

const SkyListItem = <T extends { key?: React.Key }>({ ...props }: SkyListItemProps<T>) => {
  const user = useSelector((state: RootState) => state.user)

  return (
    <List.Item className='mb-5 rounded-sm bg-white '>
      <Flex vertical className='w-full' gap={10}>
        <Flex align='center' justify='space-between' gap={10}>
          {props.labelEditing && user.isAdmin ? (
            <Form.Item name={props.labelName} initialValue={props.label} className='m-0'>
              <Input size='large' className='text-lg font-medium' />
            </Form.Item>
          ) : (
            <Typography.Title className='m-0 h-fit p-0' level={4}>
              {props.label}
            </Typography.Title>
          )}

          <ActionRow
            isEditing={props.isEditing}
            editingKey={props.editingKey}
            disableEditing={props.disableEditing ?? props.editingKey !== ''}
            disableDeleting={props.disableDeleting ?? props.editingKey !== ''}
            onSave={props.onSave}
            onEdit={props.onEdit}
            onDelete={props.onDelete}
            onConfirmCancelEditing={props.onConfirmCancelEditing}
            onConfirmCancelDeleting={props.onConfirmCancelDeleting}
            onConfirmDelete={props.onConfirmDelete}
          />
        </Flex>
        {props.children}
        {user.isAdmin && props.isDateCreation && (
          <Flex vertical gap={10}>
            <Flex className='w-full' align='center' justify='start' gap={5}>
              <Typography.Text type='secondary' className='w-40 font-medium'>
                Created at
              </Typography.Text>
              <Input
                name='createdAt'
                className='w-full'
                defaultValue={DayJS(props.createdAt).format(DatePattern.display)}
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
                defaultValue={DayJS(props.updatedAt).format(DatePattern.display)}
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
