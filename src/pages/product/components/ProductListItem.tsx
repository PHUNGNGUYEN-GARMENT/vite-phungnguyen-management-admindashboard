/* eslint-disable react-refresh/only-export-components */
import {
  Button,
  ColorPicker,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  List,
  Popconfirm,
  Typography
} from 'antd'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import ProgressBar from '~/components/ui/ProgressBar'
import { RootState } from '~/store/store'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { ProductTableDataType } from '../type'

interface Props extends React.HTMLAttributes<HTMLElement> {
  data: ProductTableDataType
  isEditing: boolean
  editingKey: React.Key
  onSaveClick?: React.MouseEventHandler<HTMLElement> | undefined
  onClickStartEditing?: React.MouseEventHandler<HTMLElement> | undefined
  onConfirmCancelEditing?: (e?: React.MouseEvent<HTMLElement>) => void
  onConfirmCancelDeleting?: (e?: React.MouseEvent<HTMLElement>) => void
  onConfirmDelete?: (e?: React.MouseEvent<HTMLElement>) => void
  onStartDeleting?: (key: React.Key) => void
}

const ProductListItem: React.FC<Props> = ({
  data,
  isEditing,
  editingKey,
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
    <List.Item {...props} key={data.key} className='mb-5 rounded-sm bg-white'>
      <Flex vertical className='w-full' gap={20}>
        <Flex align='center' justify='space-between'>
          {isEditing && user.isAdmin ? (
            <Form.Item name='productCode' initialValue={data.productCode}>
              <Input size='large' />
            </Form.Item>
          ) : (
            <Typography.Title copyable className='m-0 h-fit p-0' level={4}>
              {data.productCode}
            </Typography.Title>
          )}

          {isEditing ? (
            <Flex gap={5}>
              <Button type='primary' onClick={onSaveClick}>
                Save
              </Button>
              <Popconfirm
                title={`Sure to cancel?`}
                okButtonProps={{
                  size: 'middle'
                }}
                cancelButtonProps={{
                  size: 'middle'
                }}
                placement='topLeft'
                onConfirm={onConfirmCancelEditing}
              >
                <Button type='dashed'>Cancel</Button>
              </Popconfirm>
            </Flex>
          ) : (
            <Flex gap={10}>
              {user.isAdmin && (
                <Button
                  type='primary'
                  disabled={editingKey !== ''}
                  onClick={onClickStartEditing}
                >
                  Edit
                </Button>
              )}
              {user.isAdmin && (
                <Popconfirm
                  title={`Sure to delete?`}
                  onCancel={onConfirmCancelDeleting}
                  onConfirm={onConfirmDelete}
                >
                  <Button
                    type='dashed'
                    disabled={editingKey !== ''}
                    onClick={() => onStartDeleting?.(data.key!)}
                  >
                    Delete
                  </Button>
                </Popconfirm>
              )}
            </Flex>
          )}
        </Flex>
        <Flex align='center' justify='start' gap={5}>
          <Typography.Text type='secondary' className='w-40 font-medium'>
            Mã màu
          </Typography.Text>
          <Flex className='w-full' align='center' justify='start'>
            {isEditing ? (
              <Form.Item
                name='color'
                className='m-0 w-full'
                initialValue={data.productColor?.hexColor}
              >
                <ColorPicker
                  className='w-full'
                  size='middle'
                  disabled={!isEditing}
                  showText
                />
              </Form.Item>
            ) : (
              <ColorPicker
                className='w-full'
                defaultValue={data.productColor?.hexColor}
                size='middle'
                disabled={!isEditing}
                showText
              />
            )}
          </Flex>
        </Flex>
        <Flex align='center' justify='start' gap={5}>
          <Typography.Text type='secondary' className='w-40 font-medium'>
            Số lượng PO
          </Typography.Text>
          {isEditing ? (
            <Form.Item
              name='quantityPO'
              initialValue={data.quantityPO}
              className='m-0 w-full'
            >
              <InputNumber
                className='w-full text-center'
                readOnly={!isEditing}
              />
            </Form.Item>
          ) : (
            <Input
              name='quantityPo'
              className='w-full'
              defaultValue={data.quantityPO}
              readOnly
            />
          )}
        </Flex>
        <Flex align='center' justify='start' gap={5}>
          <Typography.Text type='secondary' className='w-40 font-medium'>
            Ngày xuất FCR
          </Typography.Text>
          {isEditing ? (
            <Form.Item
              className='m-0 w-full'
              name='dateOutputFCR'
              initialValue={DayJS(data.dateOutputFCR)}
            >
              <DatePicker className='w-full' format={DatePattern.display} />
            </Form.Item>
          ) : (
            <Input
              name='dateOutputFCR'
              readOnly
              className='zoom-in-0'
              value={DayJS(data.dateOutputFCR).format('DD/MM/YYYY')}
            />
          )}
        </Flex>
        <Flex vertical gap={5}>
          <Flex gap={5}>
            <Typography.Text type='secondary' className='w-24 font-medium'>
              May
            </Typography.Text>
            <Flex className='w-full' align='center' vertical>
              {/* <Progress percent={70} strokeColor='var(--warn)' /> */}
              <ProgressBar
                count={data.progress?.sewing ?? 0}
                total={data.quantityPO ?? 0}
              />
              <Typography.Text type='secondary' className='w-24 font-medium'>
                {data.progress?.sewing ?? 0}/{data.quantityPO ?? 0}
              </Typography.Text>
            </Flex>
          </Flex>
          <Flex gap={5}>
            <Typography.Text type='secondary' className='w-24 font-medium'>
              Ủi
            </Typography.Text>
            <Flex className='w-full' align='center' vertical>
              <ProgressBar
                count={data.progress?.iron ?? 0}
                total={data.quantityPO ?? 0}
              />
              <Typography.Text type='secondary' className='w-24 font-medium'>
                {data.progress?.iron ?? 0}/{data.quantityPO ?? 0}
              </Typography.Text>
            </Flex>
          </Flex>
          <Flex gap={5}>
            <Typography.Text type='secondary' className='w-24 font-medium'>
              Kiểm tra
            </Typography.Text>
            <Flex className='w-full' align='center' vertical>
              <ProgressBar
                count={data.progress?.check ?? 0}
                total={data.quantityPO ?? 0}
              />
              <Typography.Text type='secondary' className='w-24 font-medium'>
                {data.progress?.check ?? 0}/{data.quantityPO ?? 0}
              </Typography.Text>
            </Flex>
          </Flex>
          <Flex gap={5}>
            <Typography.Text type='secondary' className='w-24 font-medium'>
              Đóng gói
            </Typography.Text>
            <Flex className='w-full' align='center' vertical>
              <ProgressBar
                count={data.progress?.pack ?? 0}
                total={data.quantityPO ?? 0}
              />
              <Typography.Text type='secondary' className='w-24 font-medium'>
                {data.progress?.pack ?? 0}/{data.quantityPO ?? 0}
              </Typography.Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </List.Item>
  )
}

export default memo(ProductListItem)
