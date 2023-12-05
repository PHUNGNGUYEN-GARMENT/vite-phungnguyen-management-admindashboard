import {
  Calendar,
  Flex,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Modal,
  Select,
  Typography
} from 'antd'
import React, { memo, useEffect, useState } from 'react'
import { defaultRequestBody } from '~/api/client'
import ColorAPI from '~/api/services/ColorAPI'
import { Color, Product } from '~/typing'
import DayJS from '~/utils/date-formatter'

interface Props extends React.HTMLAttributes<HTMLElement> {
  openModal: boolean
  setOpenModal: (enable: boolean) => void
  onAddNew: (form: FormInstance<Product>) => void
}

// eslint-disable-next-line no-empty-pattern, react-refresh/only-export-components
const ModalAddNewProduct: React.FC<Props> = ({
  openModal,
  setOpenModal,
  onAddNew,
  ...props
}) => {
  const [form] = Form.useForm()
  const [colors, setColors] = useState<Color[]>([])
  console.log('Load AddNewProduct...')

  useEffect(() => {
    ColorAPI.getItems({
      ...defaultRequestBody,
      paginator: {
        page: 1,
        pageSize: 1000
      }
    }).then((data) => {
      if (data?.success) {
        const _colors = data.data as Product[]
        setColors(_colors)
      }
    })
  }, [])

  return (
    <Modal
      open={openModal}
      onOk={() => onAddNew(form)}
      centered
      width='auto'
      onCancel={() => {
        setOpenModal(false)
      }}
    >
      <Form form={form} {...props}>
        <Flex
          vertical
          gap={20}
          className='w-full sm:w-[500px] md:w-[600px] lg:w-[900px]'
        >
          <Typography.Title level={2}>Add new product</Typography.Title>
          <Flex align='center' gap={5} className='w-full'>
            <Typography.Text className='w-24 flex-shrink-0'>
              Mã Code:
            </Typography.Text>
            <Form.Item
              className='m-0 w-full'
              name='productCode'
              rules={[
                {
                  required: true,
                  message: `Please enter product code!`
                }
              ]}
            >
              <Input
                allowClear
                className='w-full'
                placeholder='Product code..'
              />
            </Form.Item>
          </Flex>
          <Flex align='center' gap={5} className='w-full'>
            <Typography.Text className='w-24 flex-shrink-0'>
              Số lượng PO:
            </Typography.Text>
            <Form.Item
              name='quantityPO'
              className='m-0 w-full'
              rules={[
                {
                  required: true,
                  message: `Please enter quantity PO!`
                }
              ]}
            >
              <InputNumber className='w-full' placeholder='Quantity po..' />
            </Form.Item>
          </Flex>
          <Flex align='center' gap={5} className='w-full'>
            <Typography.Text className='w-24 flex-shrink-0'>
              Màu:
            </Typography.Text>
            <Form.Item
              name='color'
              className='m-0 w-full'
              rules={[
                {
                  required: true,
                  message: `Please select a color!`
                }
              ]}
            >
              <Select
                placeholder='Select color...'
                options={colors.map((item) => {
                  return {
                    label: item.nameColor,
                    value: item.id,
                    key: item.hexColor
                  }
                })}
                optionRender={(ori, info) => {
                  return (
                    <Flex
                      justify='space-between'
                      align='center'
                      key={info.index}
                    >
                      <Typography.Text>{ori.label}</Typography.Text>
                      <div
                        className='h-6 w-6 rounded-sm'
                        style={{
                          backgroundColor: `${ori.key}`
                        }}
                      />
                    </Flex>
                  )
                }}
                className='w-full'
              />
            </Form.Item>
          </Flex>
          <Flex vertical>
            <Typography.Text className='flex-shrink-0'>
              Ngày nhập NPL:
            </Typography.Text>
            <Form.Item
              className='m-0'
              name='dateInputNPL'
              initialValue={DayJS(Date.now())}
            >
              <Calendar fullscreen={false} />
            </Form.Item>
          </Flex>
          <Flex vertical>
            <Typography.Text className='flex-shrink-0'>
              Ngày xuất FCR:
            </Typography.Text>
            <Form.Item name='dateOutputFCR' initialValue={DayJS(Date.now())}>
              <Calendar fullscreen={false} />
            </Form.Item>
          </Flex>
        </Flex>
      </Form>
    </Modal>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default memo(ModalAddNewProduct)
