import {
  Button,
  DatePicker,
  Flex,
  Input,
  InputNumber,
  Popconfirm,
  Progress,
  Typography
} from 'antd'
import React, { memo } from 'react'
import { Product } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { cn } from '~/utils/helpers'

interface Props extends React.HTMLAttributes<HTMLElement> {
  data: Product
  editingID: number | undefined
  deleteID: number | undefined
  isAdmin: boolean
  setEditingID: (id: number | undefined) => void
  setDeleteID: (id: number | undefined) => void
}

const ProductListItem: React.FC<Props> = ({
  data,
  editingID,
  setEditingID,
  deleteID,
  setDeleteID,
  isAdmin,
  ...props
}) => {
  const isEditing: boolean = editingID === data.id

  // const isDelete: boolean = deleteID === data.id

  return (
    <Flex vertical className={cn('w-full bg-white', props.className)} gap={5}>
      <Flex align='center' justify='space-between'>
        <Typography.Title className='m-0 h-fit p-0' level={4}>
          {data.productCode}
        </Typography.Title>
        {isEditing ? (
          <Flex gap={5}>
            <Button
              type='primary'
              size='small'
              onClick={() => console.log('Save...')}
            >
              Save
            </Button>
            <Popconfirm
              title={`Sure to cancel?`}
              onConfirm={() => {
                console.log('Cancel editing...')
                setEditingID(undefined)
              }}
            >
              {/* <Typography.Link>Cancel</Typography.Link> */}
              <Button size='small' type='dashed'>
                Cancel
              </Button>
            </Popconfirm>
          </Flex>
        ) : (
          <Flex gap={10}>
            <Button
              type='dashed'
              disabled={deleteID !== undefined}
              size='small'
              onClick={() => {
                setEditingID(data.id)
              }}
            >
              Edit
            </Button>
            {isAdmin && (
              <Popconfirm
                title={`Sure to delete?`}
                onCancel={() => setDeleteID(undefined)}
                onConfirm={() => console.log('Deleting...')}
              >
                <Typography.Link onClick={() => setDeleteID(data.id)}>
                  Delete
                </Typography.Link>
              </Popconfirm>
            )}
          </Flex>
        )}
      </Flex>
      <Flex align='center' justify='start' gap={5}>
        <Typography.Text type='secondary' className='w-40 font-medium'>
          Số lượng PO
        </Typography.Text>
        <InputNumber
          value={data.quantityPO}
          className='w-full text-center'
          readOnly={editingID !== data.id}
        />
      </Flex>
      <Flex align='center' justify='start' gap={5}>
        <Typography.Text type='secondary' className='w-40 font-medium'>
          Ngày xuất FCR
        </Typography.Text>
        {isEditing ? (
          <DatePicker
            className='w-full'
            format={DatePattern.display}
            defaultValue={DayJS(data.dateOutputFCR)}
          />
        ) : (
          <Input value={DayJS(data.dateOutputFCR).format('DD/MM/YYYY')} />
        )}
      </Flex>
      <Flex vertical gap={5}>
        <Flex gap={5}>
          <Typography.Text type='secondary' className='w-24 font-medium'>
            May
          </Typography.Text>
          <Flex className='w-full' align='center' vertical>
            <Progress percent={70} />
            <Typography.Text type='secondary' className='w-24 font-medium'>
              1000/2000
            </Typography.Text>
          </Flex>
        </Flex>
        <Flex gap={5}>
          <Typography.Text type='secondary' className='w-24 font-medium'>
            Ủi
          </Typography.Text>
          <Flex className='w-full' align='center' vertical>
            <Progress percent={70} />
            <Typography.Text type='secondary' className='w-24 font-medium'>
              1000/2000
            </Typography.Text>
          </Flex>
        </Flex>
        <Flex gap={5}>
          <Typography.Text type='secondary' className='w-24 font-medium'>
            Kiểm tra
          </Typography.Text>
          <Flex className='w-full' align='center' vertical>
            <Progress percent={70} />
            <Typography.Text type='secondary' className='w-24 font-medium'>
              1000/2000
            </Typography.Text>
          </Flex>
        </Flex>
        <Flex gap={5}>
          <Typography.Text type='secondary' className='w-24 font-medium'>
            Đóng gói
          </Typography.Text>
          <Flex className='w-full' align='center' vertical>
            <Progress percent={70} />
            <Typography.Text type='secondary' className='w-24 font-medium'>
              1000/2000
            </Typography.Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default memo(ProductListItem)
