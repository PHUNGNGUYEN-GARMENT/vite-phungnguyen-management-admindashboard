/* eslint-disable react-refresh/only-export-components */
import { Flex, Form, Input, InputNumber, Typography } from 'antd'
import { memo } from 'react'
import { TableItemWithKey } from '~/components/hooks/useTable'
import ListItem from '~/components/sky-ui/SkyTable/ListItem'

interface Props extends React.HTMLAttributes<HTMLElement> {
  data: TableItemWithKey<ImportationTableDataType>
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

const ImportationListItem: React.FC<Props> = ({
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
        label={`${data.product?.productCode}`}
        name='productCode'
        {...props}
      >
        <Flex className='w-full' align='center' justify='start' gap={5}>
          <Typography.Text type='secondary' className='w-40 font-medium'>
            Lô nhập
          </Typography.Text>
          {isEditing ? (
            <Form.Item name='quantity' initialValue={data.quantity} className='m-0 w-full'>
              <InputNumber size='middle' className='w-full' disabled={editingKey !== data.key} />
            </Form.Item>
          ) : (
            <Input className='w-full' defaultValue={data.quantity} size='middle' disabled={editingKey !== data.key} />
          )}
        </Flex>
      </ListItem>
    </>
  )
}

export default memo(ImportationListItem)
